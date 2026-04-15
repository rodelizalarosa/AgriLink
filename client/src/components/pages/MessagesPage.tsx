import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Circle, Clock, Search, Send } from 'lucide-react';
import type { Conversation, Message } from '../../types';
import { API_BASE_URL } from '../../api/apiConfig';
import { useMessaging } from '../../contexts/MessagingContext';

interface MessagesPageProps {
  userType?: string;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ userType = 'buyer' }) => {
  const isFarmer = userType.toLowerCase() === 'farmer';
  const { conversations, getCachedThread, getThreadMessages, markRead, sendTextMessage, threadsVersion } = useMessaging();
  const [searchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const autoStartedRef = useRef<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const filteredConversations = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => c.participantName.toLowerCase().includes(q));
  }, [conversations, searchTerm]);

  const totalUnread = useMemo(
    () => conversations.reduce((acc, c) => acc + (Number(c.unreadCount) || 0), 0),
    [conversations]
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    const otherUserId = Number(selectedConversation?.participantId);
    if (!Number.isFinite(otherUserId) || otherUserId <= 0) return;

    const text = messageText;
    setMessageText('');
    sendTextMessage(otherUserId, text).catch((err) => {
      console.error(err);
    });
  };

  useEffect(() => {
    const contactIdParam = searchParams.get('contactId');
    const contactId = Number(contactIdParam);
    if (Number.isFinite(contactId) && contactId > 0) return;
    if (selectedConversation) return;
    if (conversations.length === 0) return;
    setSelectedConversation(conversations[0]);
  }, [conversations, selectedConversation, searchParams]);

  useEffect(() => {
    const contactIdParam = searchParams.get('contactId');
    const contactId = Number(contactIdParam);
    if (!Number.isFinite(contactId) || contactId <= 0) {
      return;
    }

    const idStr = String(contactId);
    const existing = conversations.find((c) => c.participantId === idStr);
    if (existing) {
      setSelectedConversation(existing);
      return;
    }

    fetch(`${API_BASE_URL}/users/${contactId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((profile) => {
        const name = profile?.first_name || profile?.last_name
          ? `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
          : '';
        if (!name) return;
        setSelectedConversation((prev) =>
          prev?.participantId === idStr ? { ...prev, participantName: name } : prev
        );
      })
      .catch(() => null);

    setSelectedConversation({
      id: idStr,
      participantId: idStr,
      participantName: 'New conversation',
      participantType: 'user',
      participantImage: '?',
      lastMessage: '',
      lastMessageTime: '',
      unreadCount: 0,
    });
  }, [conversations, searchParams]);

  useEffect(() => {
    const shouldAutoStart = searchParams.get('startConversation') === '1';
    const contactId = Number(searchParams.get('contactId'));
    if (!shouldAutoStart || !Number.isFinite(contactId) || contactId <= 0) {
      return;
    }

    const starter = String(searchParams.get('starter') || '').trim();
    const productName = String(searchParams.get('productName') || '').trim();
    const fallbackStarter = productName
      ? `Hi, I'm interested in your ${productName}. Is it still available?`
      : "Hi, I'm interested in your listing. Is it still available?";
    const starterMessage = starter || fallbackStarter;
    const autoKey = `${contactId}:${productName}:${starterMessage}`;
    if (autoStartedRef.current.has(autoKey)) {
      return;
    }

    autoStartedRef.current.add(autoKey);
    getThreadMessages(contactId)
      .then((thread) => {
        if (thread.length > 0) return;
        return sendTextMessage(contactId, starterMessage);
      })
      .catch((err) => {
        console.error(err);
        autoStartedRef.current.delete(autoKey);
      });
  }, [getThreadMessages, searchParams, sendTextMessage]);

  useEffect(() => {
    const otherUserId = Number(selectedConversation?.participantId);
    if (!selectedConversation || !Number.isFinite(otherUserId) || otherUserId <= 0) {
      setMessages([]);
      return;
    }

    const cached = getCachedThread(otherUserId);
    if (cached) {
      setMessages(cached);
      markRead(otherUserId).catch(() => null);
      return;
    }

    setIsLoadingThread(true);
    getThreadMessages(otherUserId)
      .then((msgs) => {
        setMessages(msgs);
        return markRead(otherUserId);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingThread(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation, threadsVersion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, selectedConversation?.id]);

  return (
    <div className="h-[calc(100vh-2rem)] bg-white rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden flex border border-slate-200">
      <aside className="w-full md:w-[25rem] lg:w-[27rem] border-r border-slate-200 flex flex-col bg-white">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2 flex items-center gap-2">
            Messages
            {totalUnread > 0 && (
              <span className="bg-amber-100 text-amber-700 text-[11px] px-2.5 py-1 rounded-full font-semibold">
                {totalUnread} unread
              </span>
            )}
          </h1>

          {isFarmer && totalUnread > 0 && (
            <p className="text-xs font-medium text-slate-500 mb-4 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              {totalUnread} buyer conversation{totalUnread !== 1 ? 's' : ''} awaiting your reply
            </p>
          )}

          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500/40 focus:bg-white text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1.5">
          {filteredConversations.length === 0 && (
            <div className="h-full min-h-44 grid place-items-center text-xs font-medium text-slate-400">
              No conversations yet
            </div>
          )}

          {filteredConversations.map((conv) => {
            const hasUnread = isFarmer && conv.unreadCount > 0;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full flex items-center gap-3.5 p-3 rounded-2xl transition-all relative group border ${
                  selectedConversation?.id === conv.id
                    ? 'bg-emerald-50 border-emerald-100'
                    : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                {hasUnread && <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-amber-400 rounded-full" />}

                <div className="relative shrink-0">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-semibold text-sm ${
                      selectedConversation?.id === conv.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {conv.participantImage}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-slate-100">
                    <Circle className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />
                  </div>
                </div>

                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-semibold truncate ${selectedConversation?.id === conv.id ? 'text-slate-900' : 'text-slate-700'}`}>
                      {conv.participantName}
                    </h3>
                    <span className="text-[10px] font-medium text-slate-400 uppercase shrink-0 ml-2">{conv.lastMessageTime}</span>
                  </div>
                  <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-slate-800 font-medium' : 'text-slate-400 font-normal'}`}>
                    {conv.lastMessage}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <div className={`min-w-5 h-5 px-1.5 text-white text-[10px] font-semibold rounded-full flex items-center justify-center shrink-0 ${isFarmer ? 'bg-amber-500' : 'bg-emerald-600'}`}>
                    {conv.unreadCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {selectedConversation ? (
          <>
            <header className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 font-semibold">
                  {selectedConversation.participantImage}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-slate-900 leading-none">{selectedConversation.participantName}</h2>
                    {isFarmer && selectedConversation.unreadCount > 0 && (
                      <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        {selectedConversation.unreadCount} unread
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" />
                    <span className="text-[11px] font-medium text-slate-500">Active now</span>
                  </div>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/70">
              {isLoadingThread && <div className="text-xs font-medium text-slate-500">Loading messages...</div>}
              {!isLoadingThread && messages.length === 0 && <div className="text-xs font-medium text-slate-500">No messages yet.</div>}

              {messages.map((msg) => {
                const myId = localStorage.getItem('agrilink_id') || '';
                const isMe = String(msg.senderId) === String(myId);
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-tr-md'
                            : 'bg-white text-slate-700 rounded-tl-md border border-slate-200'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 mt-1.5 px-1">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 border-t border-slate-200 bg-white">
              <form
                onSubmit={handleSendMessage}
                className="bg-white border border-slate-200 rounded-xl p-2 flex items-center gap-2 focus-within:border-emerald-500/40 transition-all"
              >
                <input
                  type="text"
                  placeholder={isFarmer ? 'Reply to buyer...' : 'Type your message here...'}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/60">
            <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center text-emerald-600 mb-6">
              <Send className="w-8 h-8 rotate-12" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">Select a conversation</h2>
            <p className="text-slate-500 text-sm max-w-sm">
              {isFarmer ? 'Choose a conversation to reply to your buyers.' : 'Choose a conversation from the sidebar to start messaging.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagesPage;
