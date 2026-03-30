'use client';

import React from 'react';
import { ArrowLeft, UserCircle, MessageSquareQuote, Shield } from 'lucide-react';
import { Agent } from './TeamListUI';

interface FeedbackItem {
  id: number;           
  peerDisplay: string;  
  score: string;        
  comment: string;
}

interface PeerResultsUIProps {
  agent: Agent;
  feedbacks: FeedbackItem[];
  onClose: () => void;
}

export const PeerResultsUI = ({ agent, feedbacks, onClose }: PeerResultsUIProps) => {
  return (
    <section className="flex-1 overflow-y-auto bg-[#020617] h-full uppercase scrollbar-hide">
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-50 bg-[#020617]/95 backdrop-blur-md border-b border-white/5 px-12 py-8 flex items-center justify-between">
        <div>
          <button 
            onClick={onClose} 
            className="flex items-center gap-2 text-[10px] font-black text-indigo-500 hover:text-indigo-400 tracking-widest mb-2 transition-all"
          >
            <ArrowLeft className="w-3 h-3" /> RETURN TO SELECTION
          </button>
          <h1 className="text-3xl font-black text-white tracking-tighter italic">
            PERFORMANCE <span className="text-indigo-600">ANALYTICS</span>
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">TOTAL REPORTS</p>
          <p className="text-2xl font-black text-white italic">{feedbacks.length}</p>
        </div>
      </div>

      <div className="px-12 py-10 max-w-5xl mx-auto">
        {/* TARGET USER PROFILE */}
        <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 mb-10 flex items-center gap-8 shadow-2xl">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center">
            <UserCircle className="w-12 h-12 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{agent.name}</h2>
            <p className="text-[10px] font-bold text-indigo-400 tracking-[0.3em]">{agent.role} · ID: {agent.id}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">AGGREGATE SCORE</p>
            <p className="text-4xl font-black text-white italic">{agent.peerScore}</p>
          </div>
        </div>

        {/* FEEDBACK LIST */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-4 h-4 text-indigo-500" />
            <h3 className="text-[10px] font-black text-slate-400 tracking-[0.4em]">VERIFIED FEEDBACK LOGS</h3>
          </div>

          {feedbacks.length > 0 ? (
            feedbacks.map((item, index) => (
              // KEY FIX: Combine DB ID and Index to guarantee uniqueness
              <div 
                key={`feedback-${item.id}-${index}`} 
                className="group bg-slate-900/20 border border-white/5 hover:border-indigo-500/30 p-8 rounded-[2rem] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-[10px] font-black text-slate-400 tracking-widest">
                      SOURCE: {item.peerDisplay}
                    </span>
                  </div>
                  <div className="bg-slate-950 px-4 py-2 rounded-xl border border-white/5">
                    <span className="text-xl font-black text-white italic">{item.score}</span>
                    <span className="text-[10px] font-bold text-slate-600 ml-2">/ 5.0</span>
                  </div>
                </div>

                <div className="relative">
                  <MessageSquareQuote className="absolute -top-2 -left-2 w-8 h-8 text-indigo-500/10" />
                  <p className="text-xs font-medium text-slate-300 leading-relaxed tracking-wide pl-6 italic">
                    {item.comment || "NO QUALITATIVE REMARKS PROVIDED."}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 border border-dashed border-white/10 rounded-[3rem] text-center">
              <p className="text-[10px] font-black text-slate-600 tracking-[0.5em]">NO HISTORICAL DATA FOUND</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};