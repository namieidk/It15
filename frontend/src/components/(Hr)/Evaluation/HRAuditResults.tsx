'use client';

import React from 'react';
import { BarChart, ShieldAlert, X } from 'lucide-react';
import { Agent } from './HRTeamList';

// Define the feedback structure here since you don't have it elsewhere
export interface PeerFeedback {
  peerId: string;
  score: string;
  comment: string;
}

interface HRAuditResultsUIProps {
  agent: Agent;
  feedbacks: PeerFeedback[];
  onClose: () => void;
}

export const HRAuditResultsUI = ({ agent, feedbacks, onClose }: HRAuditResultsUIProps) => {
  return (
    <section className="flex-1 flex flex-col overflow-hidden bg-[#020617] uppercase font-sans">
      <header className="px-12 py-10 border-b border-white/5 flex justify-between items-center bg-slate-950/50 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-600/20">
            {agent.name[0]}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase">
              {agent.name} <span className="text-slate-500">— FEEDBACK AUDIT</span>
            </h2>
            <p className="text-[10px] font-black text-indigo-500 tracking-[0.4em]">
              VERIFIED EMPLOYEE ID: {agent.id}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] tracking-widest text-slate-400 hover:text-white transition-all shadow-xl"
        >
          TERMINATE AUDIT
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-12 space-y-10">
        <div className="bg-amber-500/5 border border-amber-500/10 p-6 rounded-3xl flex items-center gap-4">
           <ShieldAlert className="w-5 h-5 text-amber-500" />
           <p className="text-[10px] font-black text-amber-500 tracking-widest">
             CONFIDENTIAL: ALL PEER IDENTITIES ARE MASKED FOR DATA INTEGRITY
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {feedbacks.length > 0 ? feedbacks.map((feedback, index) => (
            <div key={index} className="bg-slate-900/60 border border-white/5 p-10 rounded-[3rem] group">
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black text-indigo-500 tracking-[0.3em] bg-indigo-500/10 px-4 py-2 rounded-full">
                  ENTRY SOURCE: ALPHA-{index + 100}
                </span>
                <div className="flex items-center gap-3 text-emerald-500">
                  <BarChart className="w-5 h-5 opacity-50" />
                  <span className="text-2xl font-black tracking-tighter">SCORE: {feedback.score}</span>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-300 tracking-widest leading-relaxed italic uppercase">
                &quot;{feedback.comment}&quot;
              </p>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-[3rem]">
               <p className="text-[10px] font-black text-slate-600 tracking-[0.5em]">
                 NO ANALYTIC DATA CAPTURED FOR THIS CYCLE
               </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};