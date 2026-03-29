'use client';

import React from 'react';
import { EyeOff, BarChart } from 'lucide-react';
import { Agent } from './TeamListUI';

interface PeerFeedback {
  peerId: string;
  score: string;
  comment: string;
}

interface PeerResultsUIProps {
  agent: Agent;
  feedbacks: PeerFeedback[];
  onClose: () => void;
}

export const PeerResultsUI = ({ agent, feedbacks, onClose }: PeerResultsUIProps) => {
  return (
    <section className="flex-1 flex flex-col overflow-hidden">
      <header className="px-12 py-8 border-b border-white/5 flex justify-between items-center bg-[#020617]">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-lg">
            {agent.name[0]}
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase">
              {agent.name} — PEER FEEDBACK
            </h2>
            <p className="text-[9px] font-black text-slate-500 tracking-[0.3em]">
              SECURE ACCESS ID: {agent.id}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-8 py-4 bg-white/5 rounded-2xl font-black text-[10px] tracking-widest text-slate-400 hover:text-white transition-all"
        >
          CLOSE SESSION
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-12 space-y-8">
        <div className="flex items-center gap-3 text-orange-400">
          <EyeOff className="w-5 h-5" />
          <h3 className="text-xs font-black tracking-[0.4em]">BLIND PEER DATA (ANONYMOUS)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.peerId}
              className="bg-slate-900/60 border border-white/5 p-8 rounded-[2.5rem]"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-[9px] font-black text-blue-500 tracking-[0.2em]">
                  PEER SOURCE {feedback.peerId}
                </span>
                <div className="flex items-center gap-2 text-emerald-500">
                  <BarChart className="w-4 h-4" />
                  <span className="text-lg font-black">{feedback.score}</span>
                </div>
              </div>
              <p className="text-[11px] font-bold text-slate-300 tracking-widest leading-relaxed uppercase">
                &quot;{feedback.comment}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};