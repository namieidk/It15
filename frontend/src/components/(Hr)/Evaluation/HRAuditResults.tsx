'use client';

import React from 'react';
import { BarChart, ShieldAlert, X, Calendar, Database, Hash } from 'lucide-react';
import { Agent } from './HRTeamList';

export interface PeerFeedback {
  id: number;
  peerDisplay: string; 
  score: string;
  comment: string;
  date?: string;       // Added to support the Date field from backend
}

interface HRAuditResultsUIProps {
  agent: Agent;
  feedbacks: PeerFeedback[];
  onClose: () => void;
}

export const HRAuditResultsUI = ({ agent, feedbacks, onClose }: HRAuditResultsUIProps) => {
  return (
    <section className="flex-1 flex flex-col overflow-hidden bg-[#020617] uppercase font-sans">
      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header className="px-12 py-10 border-b border-white/5 flex justify-between items-center bg-slate-950/50 backdrop-blur-xl z-10">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-500 text-3xl shadow-2xl shadow-indigo-600/10">
            {agent.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">
                {agent.name}
              </h2>
              <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-500 tracking-widest">
                {agent.role}
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-500 tracking-[0.4em]">
              ROSTER SECURE ID: <span className="text-indigo-500/80">{agent.id}</span> • DEPT: {agent.department}
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="group flex items-center gap-4 px-8 py-4 bg-red-500/5 border border-red-500/20 rounded-2xl font-black text-[10px] tracking-[0.3em] text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <X size={14} className="group-hover:rotate-90 transition-transform" />
          TERMINATE AUDIT
        </button>
      </header>

      {/* ── CONTENT ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-12 space-y-8 scrollbar-hide">
        {/* Warning Banner */}
        <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-[2rem] flex items-center justify-between">
           <div className="flex items-center gap-4">
             <ShieldAlert className="w-5 h-5 text-amber-500 animate-pulse" />
             <p className="text-[10px] font-black text-amber-500 tracking-[0.3em]">
               ENCRYPTION ACTIVE: PEER IDENTITIES ARE FULLY MASKED FOR DATA INTEGRITY PROTOCOLS
             </p>
           </div>
           <div className="flex items-center gap-6 text-[10px] font-black text-slate-600 tracking-widest">
              <div className="flex items-center gap-2">
                <Database size={12} /> RECORD COUNT: {feedbacks.length}
              </div>
           </div>
        </div>

        {/* Feedback Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {feedbacks.length > 0 ? feedbacks.map((feedback) => (
            <div 
              key={feedback.id} 
              className="bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] group hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Hash size={10} className="text-indigo-500" />
                    <span className="text-[10px] font-black text-indigo-500 tracking-[0.3em]">
                      {feedback.peerDisplay}
                    </span>
                  </div>
                  {feedback.date && (
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600 tracking-widest uppercase">
                      <Calendar size={10} /> {feedback.date}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-slate-600 tracking-widest mb-1">RATING</span>
                  <div className="flex items-center gap-3 text-emerald-500">
                    <BarChart className="w-4 h-4 opacity-50" />
                    <span className="text-3xl font-black tracking-tighter italic">{feedback.score}</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <p className="text-[11px] font-bold text-slate-300 tracking-[0.15em] leading-relaxed italic uppercase relative z-10">
                  &quot;{feedback.comment}&quot;
                </p>
                {/* Decorative quote mark background */}
                <span className="absolute -top-4 -left-2 text-6xl font-black text-white/5 pointer-events-none group-hover:text-indigo-500/10 transition-colors">“</span>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[4rem] bg-slate-900/10">
               <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Database className="w-8 h-8 text-slate-700" />
               </div>
               <p className="text-[11px] font-black text-slate-600 tracking-[0.5em] uppercase">
                 NO ANALYTIC DATA CAPTURED FOR THIS CYCLE
               </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};