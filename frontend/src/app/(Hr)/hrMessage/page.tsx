'use client';

import React, { useRef } from 'react';
import { HRSidebar } from '../../../components/(Hr)/Dashboard/sidebar';
import { 
  Send, Search, ShieldAlert, MoreVertical, Paperclip, 
  User, Lock, Loader2 
} from 'lucide-react';
import { useHRChat } from '../../../hooks/useHRChat';

export default function HRMessagePage() {
  const {
    isReady, currentUser, filteredContacts, activeChat, setActiveChat,
    messages, input, setInput, handleSend, searchTerm, setSearchTerm, 
    scrollRef, setMessages, uploadToCloudinary, isUploading
  } = useHRChat();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isReady) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-500" />
    </div>
  );

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <HRSidebar />

      <section className="flex-1 flex overflow-hidden">
        
        {/* DIRECTORY PANE */}
        <div className="w-80 border-r border-white/5 flex flex-col bg-slate-950/20">
          <div className="p-8">
            <div className="flex items-center gap-2 mb-6 text-indigo-500">
                <Lock className="w-4 h-4" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Secure HR Comms</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input 
                placeholder="SEARCH CONTACTS..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-[10px] font-black outline-none focus:border-indigo-500/30 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-hide">
            {filteredContacts.map((chat) => (
              <button 
                key={chat.employeeId} 
                onClick={() => { setMessages([]); setActiveChat(chat); }}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all border ${
                  activeChat?.employeeId === chat.employeeId 
                  ? 'bg-indigo-600/10 border-indigo-600/20' 
                  : 'hover:bg-white/5 border-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden flex-shrink-0 bg-slate-800">
                  {chat.profileImage ? (
                    <img src={chat.profileImage} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <User className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-black text-white truncate block">{chat.name}</span>
                  <p className="text-[8px] text-slate-500 font-bold tracking-widest uppercase">{chat.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div className="flex-1 flex flex-col bg-[#020617]">
          {activeChat && currentUser ? (
            <>
              {/* Header */}
              <div className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-[#020617]/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-5">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-indigo-600 overflow-hidden flex-shrink-0">
                    {activeChat.profileImage ? (
                      <img src={activeChat.profileImage} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="font-black text-white">{activeChat.name[0]}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white tracking-widest">{activeChat.name}</h3>
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-3 h-3 text-indigo-500" />
                        <p className="text-[9px] font-black text-slate-500 tracking-[0.2em]">{activeChat.role} </p>
                    </div>
                  </div>
                </div>
                <MoreVertical className="w-5 h-5 text-slate-500 cursor-pointer" />
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-10 space-y-6 scrollbar-hide">
                {messages
                  .filter(msg => (msg.content && msg.content.trim() !== "") || msg.fileUrl)
                  .map((msg, i) => {
                    const isMe = msg.senderId === currentUser.employeeId;
                    return (
                      <div key={i} className={`flex flex-col ${isMe ? 'items-end ml-auto' : 'items-start'} max-w-[70%]`}>
                        {msg.fileUrl ? (
                          <img 
                            src={msg.fileUrl} 
                            alt="HR asset" 
                            className="max-w-xs md:max-w-sm rounded-2xl border border-white/5 block shadow-2xl" 
                          />
                        ) : (
                          <div className={`p-5 rounded-3xl ${
                            isMe 
                              ? 'bg-indigo-600 text-white rounded-br-none shadow-xl shadow-indigo-500/10' 
                              : 'bg-slate-900 border border-white/5 text-slate-100 rounded-bl-none shadow-2xl'
                          }`}>
                            <p className="text-xs font-bold leading-relaxed px-1 break-words">{msg.content}</p>
                          </div>
                        )}
                        {isMe && (
                          <span className="text-[8px] font-black text-slate-600 mt-2 tracking-widest">
                            SENT {formatTime(msg.timestamp)}
                          </span>
                        )}
                      </div>
                    );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Input Area */}
              <div className="p-10 pt-0">
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  onChange={(e) => e.target.files?.[0] && uploadToCloudinary(e.target.files[0])}
                  accept="image/*"
                />
                <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-2 flex items-center gap-2 focus-within:border-indigo-500/50 transition-all shadow-inner backdrop-blur-xl">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-4 text-slate-500 hover:text-white transition-colors"
                  >
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                  </button>
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isUploading ? "PROCESSING SECURE ASSET..." : "TYPE AUTHORIZED MESSAGE..."} 
                    className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-widest text-white px-4 placeholder:text-slate-800"
                    disabled={isUploading}
                  />
                  <button 
                    onClick={() => handleSend()} 
                    disabled={(!input.trim() && !isUploading) || isUploading}
                    className="bg-indigo-600 p-4 rounded-full text-white hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-indigo-500/20"
                  >
                    <Send className="w-5 h-5" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20 uppercase tracking-[0.5em]">
              <ShieldAlert className="w-16 h-16 mb-4 text-indigo-500" />
              <p className="text-[10px] font-black">HR COMMAND STANDBY</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}