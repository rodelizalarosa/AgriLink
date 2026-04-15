import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Conversation, Message } from '../types';
import { fetchConversations, fetchMessages, markThreadRead, sendMessage } from '../api/messages';
import { getStoredAuthToken } from '../api/apiConfig';
import { disconnectSocket, getSocket, initSocket } from '../services/socketService';

type MessagingContextValue = {
  conversations: Conversation[];
  unreadTotal: number;
  isReady: boolean;
  error: string | null;
  threadsVersion: number;
  refreshConversations: () => Promise<void>;
  getThreadMessages: (otherUserId: number) => Promise<Message[]>;
  getCachedThread: (otherUserId: number) => Message[] | undefined;
  sendTextMessage: (otherUserId: number, content: string) => Promise<void>;
  markRead: (otherUserId: number) => Promise<void>;
};

const MessagingContext = createContext<MessagingContextValue | null>(null);

function initials(first: string, last: string) {
  const a = String(first || '').trim()[0] || '';
  const b = String(last || '').trim()[0] || '';
  const out = `${a}${b}`.toUpperCase();
  return out || '?';
}

function formatTime(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function mapConversationRow(row: any): Conversation {
  const pid = Number(row?.participantId);
  const first = String(row?.first_name ?? '').trim();
  const last = String(row?.last_name ?? '').trim();
  const role = String(row?.role ?? '').trim();
  const unread = Number(row?.unreadCount ?? 0) || 0;

  return {
    id: String(pid),
    participantId: String(pid),
    participantName: `${first} ${last}`.trim() || `User ${pid}`,
    participantType: role || 'user',
    participantImage: initials(first, last),
    lastMessage: String(row?.lastMessage ?? '').trim(),
    lastMessageTime: formatTime(row?.lastMessageTime ?? null),
    unreadCount: unread,
  };
}

function mapMessageRow(row: any): Message {
  const mid = Number(row?.m_id);
  const sender = Number(row?.sender_id);
  const receiver = Number(row?.receiver_id);
  const createdAt = String(row?.created_at ?? '');
  const isReadRaw = row?.is_read;

  return {
    id: String(mid || createdAt || Math.random()),
    senderId: String(sender),
    receiverId: String(receiver),
    content: String(row?.content ?? ''),
    timestamp: formatTime(createdAt),
    isRead: Boolean(isReadRaw === 1 || isReadRaw === true),
  };
}

export function MessagingProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadsVersion, setThreadsVersion] = useState(0);
  const [authTick, setAuthTick] = useState(0);

  // Cache message threads by other user id.
  const threadsRef = useRef<Map<number, Message[]>>(new Map());

  const unreadTotal = useMemo(
    () => conversations.reduce((acc, c) => acc + (Number(c.unreadCount) || 0), 0),
    [conversations]
  );

  const refreshConversations = useCallback(async () => {
    try {
      setError(null);
      const rows = await fetchConversations();
      setConversations(rows.map(mapConversationRow));
    } catch (e: any) {
      setError(e?.message || 'Failed to refresh conversations');
    }
  }, []);

  const getCachedThread = useCallback((otherUserId: number) => {
    return threadsRef.current.get(otherUserId);
  }, []);

  const getThreadMessages = useCallback(async (otherUserId: number) => {
    const cached = threadsRef.current.get(otherUserId);
    if (cached) return cached;

    const rows = await fetchMessages(otherUserId);
    const mapped = rows.map(mapMessageRow);
    threadsRef.current.set(otherUserId, mapped);
    setThreadsVersion((v) => v + 1);
    return mapped;
  }, []);

  const upsertMessage = useCallback((row: any) => {
    const msg = mapMessageRow(row);
    const sender = Number(row?.sender_id);
    const receiver = Number(row?.receiver_id);
    if (!Number.isFinite(sender) || !Number.isFinite(receiver)) return;

    const myIdRaw = localStorage.getItem('agrilink_id');
    const myId = Number(myIdRaw);
    const otherUserId = sender === myId ? receiver : sender;

    const current = threadsRef.current.get(otherUserId) ?? [];
    // Dedupe by id (m_id) when present.
    const exists = current.some((m) => m.id === msg.id);
    const next = exists ? current : [...current, msg];
    threadsRef.current.set(otherUserId, next);
    if (!exists) setThreadsVersion((v) => v + 1);

    // Update conversations list (last message + unread).
    setConversations((prev) => {
      const otherIdStr = String(otherUserId);
      const isIncoming = receiver === myId;
      let found = false;
      const updated = prev.map((c) => {
        if (c.participantId !== otherIdStr) return c;
        found = true;
        return {
          ...c,
          lastMessage: msg.content || c.lastMessage,
          lastMessageTime: msg.timestamp || c.lastMessageTime,
          unreadCount: isIncoming ? (Number(c.unreadCount) || 0) + 1 : c.unreadCount,
        };
      });

      if (found) {
        // Move updated conversation to the top.
        const idx = updated.findIndex((c) => c.participantId === otherIdStr);
        if (idx > 0) {
          const [conv] = updated.splice(idx, 1);
          updated.unshift(conv);
        }
        return updated;
      }

      // If we don't have a conversation row yet, refresh from server to avoid guessing metadata.
      refreshConversations().catch(() => null);
      return prev;
    });
  }, [refreshConversations]);

  const sendTextMessage = useCallback(async (otherUserId: number, content: string) => {
    const text = String(content || '').trim();
    if (!text) return;
    const row = await sendMessage(otherUserId, text);
    // REST response + socket echo can both arrive; upsert handles dedupe.
    upsertMessage(row);
  }, [upsertMessage]);

  const markRead = useCallback(async (otherUserId: number) => {
    await markThreadRead(otherUserId);
    setConversations((prev) =>
      prev.map((c) => (c.participantId === String(otherUserId) ? { ...c, unreadCount: 0 } : c))
    );
    setThreadsVersion((v) => v + 1);
  }, []);

  // Init socket + initial conversations when token exists.
  useEffect(() => {
    const token = getStoredAuthToken();
    const isLoggedIn = localStorage.getItem('agrilink_isLoggedIn') === 'true';
    if (!token || !isLoggedIn) {
      disconnectSocket();
      setIsReady(false);
      setConversations([]);
      threadsRef.current.clear();
      return;
    }

    initSocket(token);
    refreshConversations().finally(() => setIsReady(true));

    const socket = getSocket();
    if (!socket) return;

    const handler = (row: any) => upsertMessage(row);
    socket.on('new_message', handler);

    return () => {
      socket.off('new_message', handler);
    };
  }, [refreshConversations, upsertMessage, authTick]);

  // Re-run auth-dependent initialization on explicit app auth changes.
  useEffect(() => {
    const bump = () => setAuthTick((v) => v + 1);
    window.addEventListener('agrilink-auth-changed', bump);
    return () => window.removeEventListener('agrilink-auth-changed', bump);
  }, []);

  const value: MessagingContextValue = useMemo(
    () => ({
      conversations,
      unreadTotal,
      isReady,
      error,
      threadsVersion,
      refreshConversations,
      getThreadMessages,
      getCachedThread,
      sendTextMessage,
      markRead,
    }),
    [
      conversations,
      unreadTotal,
      isReady,
      error,
      threadsVersion,
      refreshConversations,
      getThreadMessages,
      getCachedThread,
      sendTextMessage,
      markRead,
    ]
  );

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>;
}

export function useMessaging() {
  const ctx = useContext(MessagingContext);
  if (!ctx) throw new Error('useMessaging must be used within a MessagingProvider');
  return ctx;
}
