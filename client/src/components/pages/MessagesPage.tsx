import React, { useState } from 'react';
import {
  Search,
  Send,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Paperclip,
  Smile,
  ChevronLeft,
  Circle,
  Clock,
} from 'lucide-react';
import { sampleConversations, sampleMessages } from '../../data';
import type { Conversation } from '../../types';

interface MessagesPageProps {
  userType?: string;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ userType = 'buyer' }) => {
  const isFarmer = userType.toLowerCase() === 'farmer';
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(sampleConversations[0]);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = sampleConversations.filter(c =>
    c.participantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnread = sampleConversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageText('');
  };

  return (
    <div className="h-[calc(100vh-2rem)] bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden flex border border-gray-100 animate-in fade-in duration-700">

      {/* 📱 Conversations Sidebar */}
      <aside className="w-full md:w-96 border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-8 pb-4">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2 flex items-center gap-3">
            Messages
            {totalUnread > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-black">
                {totalUnread} Unread
              </span>
            )}
          </h1>
          {isFarmer && totalUnread > 0 && (
            <p className="text-xs font-bold text-gray-400 mb-4 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              {totalUnread} buyer conversation{totalUnread !== 1 ? 's' : ''} awaiting your reply
            </p>
          )}

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-transparent focus:border-green-600/20 shadow-sm font-bold text-sm outline-none transition-all placeholder:text-gray-300"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
          {filteredConversations.map(conv => {
            const hasUnread = isFarmer && conv.unreadCount > 0;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full flex items-center gap-4 p-5 rounded-[2rem] transition-all relative group ${
                  selectedConversation?.id === conv.id
                    ? 'bg-white shadow-xl shadow-gray-200/50 border border-gray-50'
                    : 'hover:bg-white/60'
                }`}
              >
                {/* Subtle left accent for unread farmer messages */}
                {hasUnread && (
                  <div className="absolute left-0 top-5 bottom-5 w-0.5 bg-amber-400 rounded-full" />
                )}

                <div className="relative shrink-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg ${
                    selectedConversation?.id === conv.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {conv.participantImage}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Circle className="w-3 h-3 fill-green-400 text-green-400" />
                  </div>
                </div>

                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-black tracking-tight truncate ${selectedConversation?.id === conv.id ? 'text-gray-900' : 'text-gray-700'}`}>
                      {conv.participantName}
                    </h3>
                    <span className="text-[10px] font-black text-gray-400 uppercase shrink-0 ml-2">{conv.lastMessageTime}</span>
                  </div>
                  <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'}`}>
                    {conv.lastMessage}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <div className={`w-6 h-6 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shrink-0 ${
                    isFarmer ? 'bg-amber-500 shadow-amber-500/30' : 'bg-green-600 shadow-green-500/30'
                  }`}>
                    {conv.unreadCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* 💬 Chat Area */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {selectedConversation ? (
          <>
            {/* Header */}
            <header className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button className="md:hidden p-2 text-gray-400 hover:text-gray-600">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 font-black shadow-inner">
                  {selectedConversation.participantImage}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">{selectedConversation.participantName}</h2>
                    {isFarmer && selectedConversation.unreadCount > 0 && (
                      <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        {selectedConversation.unreadCount} unread
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Circle className="w-2 h-2 fill-green-400 text-green-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Now</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"><Phone className="w-5 h-5" /></button>
                <button className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"><Video className="w-5 h-5" /></button>
                <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/30">
              {sampleMessages.map(msg => {
                const isMe = msg.senderId === 'me';
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in duration-500`}>
                    <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`px-6 py-4 rounded-3xl shadow-sm text-sm font-medium leading-relaxed ${
                        isMe
                          ? 'bg-green-600 text-white rounded-tr-none shadow-green-500/20'
                          : 'bg-white text-gray-700 rounded-tl-none border border-gray-100 shadow-gray-200/40'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 px-2">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <footer className="p-8 pt-4">
              <form
                onSubmit={handleSendMessage}
                className="bg-white border-2 border-gray-50 rounded-4xl p-2 flex items-center gap-2 shadow-2xl shadow-gray-200/40 focus-within:border-green-600/20 transition-all"
              >
                <button type="button" className="p-4 text-gray-400 hover:text-green-600 transition-colors"><Paperclip className="w-5 h-5" /></button>
                <button type="button" className="p-4 text-gray-400 hover:text-green-600 transition-colors hidden sm:block"><ImageIcon className="w-5 h-5" /></button>
                <input
                  type="text"
                  placeholder={isFarmer ? "Reply to buyer..." : "Type your message here..."}
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none font-bold text-sm placeholder:text-gray-300"
                />
                <button type="button" className="p-4 text-gray-400 hover:text-amber-500 transition-colors"><Smile className="w-5 h-5" /></button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white w-14 h-14 rounded-3xl flex items-center justify-center shadow-xl shadow-green-500/30 active:scale-95 transition-all"
                >
                  <Send className="w-6 h-6 ml-1" />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/30">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center text-green-600 mb-8 border border-gray-100">
              <Send className="w-10 h-10 rotate-12" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Select a conversation</h2>
            <p className="text-gray-500 font-medium max-w-sm">
              {isFarmer ? 'Choose a conversation to reply to your buyers.' : 'Choose a conversation from the sidebar to start messaging.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MessagesPage;
