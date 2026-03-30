'use client';

import React, { useState } from 'react';
import { UserCircle, ChevronRight, Search, Users, Lock, ShieldCheck } from 'lucide-react';

export interface Agent {
  id: string; // EmployeeId from DB
  name: string;
  role: string;
  department: string;
  peerScore: string;       // From backend Average calculation
  alreadyEvaluated?: boolean; // From backend Monthly Lockout check
}

interface HRTeamListUIProps {
  agents: Agent[];
  mode: 'evaluate' | 'results';
  onSelectAgent: (agent: Agent) => void;
  onBack: () => void;
}

export const HRTeamListUI = ({ agents, mode, onSelectAgent, onBack }: HRTeamListUIProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering logic for search
  const filtered = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="flex-1 p-12 overflow-y-auto bg-[#020617] uppercase font-sans scrollbar-hide">
      {/* ── HEADER SECTION ────────────────────────────────────────── */}
      <header className="mb-12 border-l-2 border-indigo-600 pl-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <button
            onClick={onBack}
            className="text-[10px] font-black text-indigo-500 mb-4 hover:text-indigo-400 tracking-[0.3em] block transition-colors"
          >
            ← RETURN TO AUDIT HUB
          </button>
          <h1 className="text-4xl font-black text-white tracking-tighter italic">
            {mode === 'evaluate' ? 'PERSONNEL' : 'DATA'}{' '}
            <span className="text-indigo-600">
              {mode === 'evaluate' ? 'ROSTER' : 'ARCHIVE'}
            </span>
          </h1>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Users className="w-3 h-3" />
              <span className="text-[10px] font-bold tracking-[0.3em]">TOTAL AGENTS: {agents.length}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-800" />
            <div className="flex items-center gap-2 text-indigo-500/60">
              <ShieldCheck className="w-3 h-3" />
              <span className="text-[10px] font-bold tracking-[0.3em]">HR ENCRYPTION ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="FILTER BY NAME OR ID..."
            className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black text-white w-full md:w-80 focus:border-indigo-500/50 outline-none transition-all placeholder:text-slate-700"
          />
        </div>
      </header>

      {/* ── AGENT GRID ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 max-w-5xl">
        {filtered.length > 0 ? (
          filtered.map((agent) => {
            // Logic: Disable button if HR already evaluated them this month (only in 'evaluate' mode)
            const isLocked = agent.alreadyEvaluated && mode === 'evaluate';

            return (
              <button
                key={agent.id}
                disabled={isLocked}
                onClick={() => onSelectAgent(agent)}
                className={`relative overflow-hidden group flex items-center justify-between border p-8 rounded-[2.5rem] transition-all duration-300
                  ${isLocked 
                    ? 'bg-slate-900/20 border-red-500/20 opacity-60 cursor-not-allowed' 
                    : 'bg-slate-900/40 border-white/5 hover:border-indigo-500/40 hover:bg-slate-900/60 shadow-xl'}`}
              >
                {/* Monthly Lockout Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center z-10 animate-in fade-in duration-500">
                    <div className="bg-red-500/10 border border-red-500/30 px-6 py-2 rounded-full flex items-center gap-3">
                      <Lock size={12} className="text-red-500" />
                      <span className="text-[10px] font-black text-red-500 tracking-[0.3em]">MONTHLY AUDIT LIMIT REACHED</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-6 relative z-0">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500
                    ${isLocked 
                      ? 'bg-slate-800 text-slate-600' 
                      : 'bg-slate-800 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-3'}`}>
                    <UserCircle className="w-10 h-10" />
                  </div>
                  
                  <div className="text-left">
                    <h3 className={`text-xl font-black tracking-tight transition-colors ${isLocked ? 'text-slate-600' : 'text-white'}`}>
                      {agent.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-[10px] font-bold text-slate-500 tracking-widest">
                        ID: <span className={isLocked ? 'text-slate-700' : 'text-slate-300'}>{agent.id}</span>
                      </p>
                      <div className="w-1 h-1 rounded-full bg-slate-800" />
                      <p className="text-[10px] font-bold text-slate-500 tracking-widest">
                        {agent.department || 'OPERATIONS'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                   {/* Overall Score Preview (Only show if not locked or in results mode) */}
                   <div className="text-right hidden sm:block mr-4">
                      <p className="text-[8px] font-black text-slate-600 tracking-widest mb-1 uppercase">AVG SCORE</p>
                      <p className={`text-lg font-black italic ${isLocked ? 'text-slate-700' : 'text-indigo-500'}`}>
                        {agent.peerScore}
                      </p>
                   </div>

                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity tracking-[0.2em]">
                        {mode === 'evaluate' ? 'START AUDIT' : 'VIEW ARCHIVE'}
                      </span>
                      <ChevronRight className={`w-6 h-6 transition-transform duration-300 
                        ${isLocked ? 'text-slate-800' : 'text-slate-700 group-hover:text-indigo-500 group-hover:translate-x-2'}`} 
                      />
                   </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="p-32 border border-dashed border-white/10 rounded-[3.5rem] text-center bg-slate-900/5 animate-pulse">
            <p className="text-[10px] font-black text-slate-600 tracking-[0.5em] uppercase">
              NO MATCHING PERSONNEL DETECTED IN ROSTER
            </p>
          </div>
        )}
      </div>
    </section>
  );
};