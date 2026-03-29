'use client';

import React, { useEffect, useState } from 'react';
import { UserCircle, ChevronRight } from 'lucide-react';

export interface Agent {
  id:         string;
  name:       string;
  role:       string;
  peerScore:  string;
  department: string;
}

interface TeamListUIProps {
  agents:        Agent[];
  mode:          'evaluate' | 'results';
  onSelectAgent: (agent: Agent) => void;
  onBack:        () => void;
}

export const TeamListUI = ({ agents, mode, onSelectAgent, onBack }: TeamListUIProps) => {
  const [dept, setDept] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDept(String(parsed.department || '').trim().toUpperCase());
      }
    } catch {}
  }, []);

  return (
    <section className="flex-1 p-12 overflow-y-auto bg-[#020617]">
      <header className="mb-12 border-l-2 border-indigo-600 pl-6">
        <button
          onClick={onBack}
          className="text-[10px] font-black text-indigo-500 mb-4 hover:underline tracking-widest block uppercase"
        >
          ← EXIT TO HUB
        </button>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
          {mode === 'evaluate' ? 'TEAM' : 'PEER'}{' '}
          <span className="text-indigo-600">
            {mode === 'evaluate' ? 'EVALUATION' : 'ANALYSIS'}
          </span>
        </h1>
        <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mt-2 uppercase">
          SECTOR: <span className="text-slate-200">{dept || 'UNKNOWN'}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 max-w-4xl">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className="group flex items-center justify-between bg-slate-900/40 border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/40 transition-all hover:bg-slate-900/60"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                  <UserCircle className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-black text-white tracking-tight">{agent.name}</h3>
                  <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                    {agent.role}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1" />
            </button>
          ))
        ) : (
          <div className="p-20 border border-dashed border-white/10 rounded-[3rem] text-center bg-slate-900/10">
            <p className="text-[10px] font-black text-slate-600 tracking-[0.5em] uppercase">
              NO SUBORDINATES DETECTED IN {dept || 'YOUR DEPARTMENT'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};