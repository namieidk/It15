'use client';

import React, { useState } from 'react';
import { UserCircle, ChevronRight, Lock } from 'lucide-react';

export interface Agent {
  id:         string;
  name:       string;
  role:       string;
  peerScore:  string;
  department: string;
  alreadyEvaluated?: boolean;
}

interface TeamListUIProps {
  agents:        Agent[];
  mode:          'evaluate' | 'results';
  onSelectAgent: (agent: Agent) => void;
  onBack:        () => void;
}

export const TeamListUI = ({ agents, mode, onSelectAgent, onBack }: TeamListUIProps) => {
  // --- FIX: Lazy Initializer ---
  // We read from localStorage once during the very first render.
  // This avoids the "Effect -> SetState -> Re-render" cycle.
  const [dept] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          return String(parsed.department || '').trim().toUpperCase();
        }
      } catch (e) {
        console.error("Failed to parse user department", e);
      }
    }
    return 'UNKNOWN';
  });

  return (
    <section className="flex-1 p-12 overflow-y-auto bg-[#020617] uppercase">
      <header className="mb-12 border-l-2 border-indigo-600 pl-6">
        <button
          onClick={onBack}
          className="text-[10px] font-black text-indigo-500 mb-4 hover:underline tracking-widest block"
        >
          ← EXIT TO HUB
        </button>
        <h1 className="text-4xl font-black text-white tracking-tighter italic">
          {mode === 'evaluate' ? 'TEAM' : 'PEER'}{' '}
          <span className="text-indigo-600">
            {mode === 'evaluate' ? 'EVALUATION' : 'ANALYSIS'}
          </span>
        </h1>
        <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mt-2">
          SECTOR: <span className="text-slate-200">{dept}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 max-w-4xl">
        {agents.length > 0 ? (
          agents.map((agent) => {
            const isLocked = agent.alreadyEvaluated && mode === 'evaluate';

            return (
              <button
                key={agent.id}
                disabled={isLocked}
                onClick={() => onSelectAgent(agent)}
                className={`relative overflow-hidden group flex items-center justify-between border p-8 rounded-[2rem] transition-all
                  ${isLocked 
                    ? 'bg-slate-900/20 border-red-500/20 opacity-60 cursor-not-allowed' 
                    : 'bg-slate-900/40 border-white/5 hover:border-indigo-500/40 hover:bg-slate-900/60'}`}
              >
                {isLocked && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <div className="bg-red-500/20 border border-red-500/40 px-4 py-2 rounded-full flex items-center gap-2">
                      <Lock size={12} className="text-red-400" />
                      <span className="text-[10px] font-black text-red-400 tracking-widest">MONTHLY LIMIT REACHED</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl
                    ${isLocked 
                      ? 'bg-slate-800 text-slate-600' 
                      : 'bg-slate-800 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                    <UserCircle className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <h3 className={`text-lg font-black tracking-tight ${isLocked ? 'text-slate-500' : 'text-white'}`}>
                      {agent.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-500 tracking-widest">
                      {isLocked ? 'AUDIT ARCHIVED' : agent.role}
                    </p>
                  </div>
                </div>
                {!isLocked && <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1" />}
              </button>
            );
          })
        ) : (
          <div className="p-20 border border-dashed border-white/10 rounded-[3rem] text-center bg-slate-900/10">
            <p className="text-[10px] font-black text-slate-600 tracking-[0.5em]">
              NO PERSONNEL DETECTED
            </p>
          </div>
        )}
      </div>
    </section>
  );
};