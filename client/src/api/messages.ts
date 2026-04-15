import { API_BASE_URL, getStoredAuthToken } from './apiConfig';

type ApiConversationRow = {
  participantId: number;
  first_name: string;
  last_name: string;
  role: string;
  phone?: string | null;
  peerLastSessionAt?: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number | string | null;
};

type ApiMessageRow = {
  m_id: number;
  sender_id: number;
  receiver_id: number;
  content: string | null;
  image_path?: string | null;
  is_read: number | boolean | null;
  created_at: string;
};

const authHeaders = (): Record<string, string> => {
  const token = getStoredAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

export async function fetchConversations(): Promise<ApiConversationRow[]> {
  const res = await fetch(`${API_BASE_URL}/messages`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Failed to load conversations (${res.status})`);
  const data = await res.json();
  return (data?.conversations ?? []) as ApiConversationRow[];
}

export async function fetchMessages(otherUserId: number): Promise<ApiMessageRow[]> {
  const res = await fetch(`${API_BASE_URL}/messages/${otherUserId}`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Failed to load messages (${res.status})`);
  const data = await res.json();
  return (data?.messages ?? []) as ApiMessageRow[];
}

export async function sendMessage(receiverId: number, content: string): Promise<ApiMessageRow> {
  const res = await fetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ receiverId, content }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Failed to send message (${res.status})`);
  }
  const data = await res.json();
  return data?.data as ApiMessageRow;
}

export async function markThreadRead(otherUserId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/messages/${otherUserId}/read`, {
    method: 'PUT',
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Failed to mark read (${res.status})`);
}

export type { ApiConversationRow, ApiMessageRow };
