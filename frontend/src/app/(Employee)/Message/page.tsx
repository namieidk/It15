'use client';

import React, { useRef } from 'react';
import { Sidebar } from '../../../components/(Employee)/Dashboard/Sidebar';  
import { Send, Search, User, Loader2, ShieldAlert, Paperclip } from 'lucide-react';
import { useChatLogic } from '../../../hooks/useChatLogic';

export default function MessagesPage() {
  const {
    isReady, currentUser, filteredUsers, activeChat, setActiveChat,
    messages, input, setInput, handleSend, searchTerm, setSearchTerm, 
    scrollRef, setMessages, uploadToCloudinary, isUploading
  } = useChatLogic();

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
      <Sidebar />
      <section className="flex-1 flex overflow-hidden">
        
        {/* Directory */}
        <div className="w-80 border-r border-white/5 flex flex-col bg-slate-950/20">
          <div className="p-8">
            <h2 className="text-indigo-500 text-[10px] font-black tracking-[0.4em] mb-6">SECURE COMMS</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input 
                placeholder="SEARCH..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-10 text-[10px] outline-none focus:border-indigo-500/50 transition-all font-black tracking-widest" 
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-hide">
            {filteredUsers.map((u) => (
              <button 
                key={u.employeeId} 
                onClick={() => { setMessages([]); setActiveChat(u); }} 
                className={`w-full flex items-center gap-4 p-4 rounded-3xl border transition-all ${activeChat?.employeeId === u.employeeId ? 'bg-indigo-500/10 border-indigo-500/20 shadow-lg shadow-indigo-500/5' : 'border-transparent hover:bg-white/5'}`}
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 bg-slate-800">
                    {u.profileImage ? <img src={u.profileImage} className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-slate-500" />}
                </div>
                <div className="text-left truncate flex-1">
                    <p className="text-xs font-black text-white truncate">{u.name}</p>
                    <p className="text-[8px] text-slate-500 tracking-widest uppercase">{u.department}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-[#020617]">
          {activeChat && currentUser ? (
            <>
              <div className="px-10 py-6 border-b border-white/5 flex items-center gap-5 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-10">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white overflow-hidden">
                  {activeChat.profileImage ? <img src={activeChat.profileImage} className="w-full h-full object-cover" /> : activeChat.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-widest">{activeChat.name}</h3>
                  <p className="text-[9px] font-black text-indigo-500 tracking-[0.2em]"> {activeChat.role}</p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-10 space-y-6 scrollbar-hide">
                {messages.filter(m => m.content?.trim() || m.fileUrl).map((msg, i) => {
                  const isMe = msg.senderId === currentUser.employeeId;
                  return (
                    <div key={i} className={`flex flex-col ${isMe ? 'items-end ml-auto' : 'items-start'} max-w-[70%]`}>
                      {msg.fileUrl ? (
                        <img 
                          src={msg.fileUrl} 
                          alt="asset" 
                          className="max-w-xs md:max-w-sm rounded-2xl border border-white/5 block shadow-2xl" 
                        />
                      ) : (
                        <div className={`p-5 rounded-3xl ${isMe ? 'bg-indigo-600 text-white rounded-br-none shadow-xl shadow-indigo-500/10' : 'bg-slate-900 border border-white/5 text-slate-100 rounded-bl-none shadow-2xl'}`}>
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
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend()} 
                    placeholder={isUploading ? "UPLOADING TRANSMISSION..." : "ENTER TRANSMISSION..."} 
                    className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-widest text-white px-4 placeholder:text-slate-800"
                    disabled={isUploading}
                  />
                  <button 
                    onClick={() => handleSend()} 
                    disabled={(!input.trim() && !isUploading) || isUploading}
                    className="bg-indigo-600 p-4 rounded-full text-white hover:bg-indigo-400 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-indigo-500/20"
                  >
                    <Send className="w-4 h-4" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20 uppercase tracking-[0.5em]">
              <ShieldAlert className="w-12 h-12 mb-4" /><p className="text-[10px] font-black tracking-[0.5em]">TRANSMISSION STANDBY</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}