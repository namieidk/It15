'use client';

import React, { useState } from 'react';
import { UserCircle, ChevronRight, Search, Users } from 'lucide-react';

export interface Agent {
  id: string; // EmployeeId from DB
  name: string;
  role: string;
  department: string;
}

interface HRTeamListUIProps {
  agents: Agent[];
  mode: 'evaluate' | 'results';
  onSelectAgent: (agent: Agent) => void;
  onBack: () => void;
}

export const HRTeamListUI = ({ agents, mode, onSelectAgent, onBack }: HRTeamListUIProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.id.includes(searchTerm)
  );

  return (
    <section className="flex-1 p-12 overflow-y-auto bg-[#020617] uppercase font-sans">
      <header className="mb-12 border-l-2 border-indigo-600 pl-6 flex justify-between items-end">
        <div>
          <button
            onClick={onBack}
            className="text-[10px] font-black text-indigo-500 mb-4 hover:underline tracking-widest block"
          >
            ← RETURN TO AUDIT HUB
          </button>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            {mode === 'evaluate' ? 'PERSONNEL' : 'DATA'}{' '}
            <span className="text-indigo-600">
              {mode === 'evaluate' ? 'ROSTER' : 'ARCHIVE'}
            </span>
          </h1>
          <div className="flex items-center gap-2 text-slate-500 mt-2">
            <Users className="w-3 h-3" />
            <span className="text-[10px] font-bold tracking-[0.3em]">TOTAL AGENTS: {agents.length}</span>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="FILTER BY NAME OR ID..."
            className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black text-white w-80 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 max-w-5xl">
        {filtered.length > 0 ? (
          filtered.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className="group flex items-center justify-between bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-indigo-500/40 transition-all hover:bg-slate-900/60 shadow-lg"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <UserCircle className="w-10 h-10" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-black text-white tracking-tight">{agent.name}</h3>
                  <p className="text-[10px] font-bold text-slate-500 tracking-widest mt-1">
                    ID: {agent.id} • {agent.department || 'OPERATIONS'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-[9px] font-black text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">OPEN PROFILE</span>
                 <ChevronRight className="w-6 h-6 text-slate-700 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))
        ) : (
          <div className="p-20 border border-dashed border-white/10 rounded-[3rem] text-center bg-slate-900/5">
            <p className="text-[10px] font-black text-slate-600 tracking-[0.5em]">
              NO MATCHING PERSONNEL FOUND
            </p>
          </div>
        )}
      </div>
    </section>
  );
};