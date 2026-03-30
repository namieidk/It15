'use client';

import React from 'react';
import { ClipboardCheck, Users, ShieldCheck, Activity } from 'lucide-react';

interface HREvaluationHubUIProps {
  onNavigate: (view: 'evaluate' | 'results') => void;
}

export const HREvaluationHubUI = ({ onNavigate }: HREvaluationHubUIProps) => {
  return (
    <section className="flex-1 p-12 flex flex-col justify-center items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-center gap-3 text-indigo-500 mb-4">
          <ShieldCheck className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.5em]">ADMINISTRATIVE OVERWATCH</span>
        </div>
        <h1 className="text-6xl font-black text-white tracking-tighter mb-4 italic">
          PERFORMANCE <span className="text-indigo-600">AUDIT</span>
        </h1>
        <p className="text-[10px] font-black text-slate-500 tracking-[0.5em] uppercase">
          GLOBAL PERSONNEL & MANAGEMENT EVALUATION MODULE
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl uppercase">
        {/* EVALUATE MANAGERS */}
        <button
          onClick={() => onNavigate('evaluate')}
          className="group relative bg-slate-900/40 border border-white/5 p-12 rounded-[3.5rem] hover:border-indigo-500/50 transition-all duration-500 text-left backdrop-blur-md overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity size={120} />
          </div>
          <ClipboardCheck className="w-14 h-14 text-indigo-500 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" />
          <h3 className="text-3xl font-black text-white mb-3 tracking-tighter italic">LEADERSHIP <span className="text-indigo-600">AUDIT</span></h3>
          <p className="text-[10px] font-bold text-slate-500 tracking-widest leading-relaxed">
            EXECUTE FORMAL PERFORMANCE REVIEWS FOR <span className="text-indigo-400">MANAGEMENT PERSONNEL</span> ONLY.
          </p>
          <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="text-[9px] font-black text-indigo-500 tracking-[0.2em]">INITIALIZE PROTOCOL</span>
          </div>
        </button>

        {/* VIEW ALL RESULTS */}
        <button
          onClick={() => onNavigate('results')}
          className="group relative bg-slate-900/40 border border-white/5 p-12 rounded-[3.5rem] hover:border-emerald-500/50 transition-all duration-500 text-left backdrop-blur-md overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={120} />
          </div>
          <Users className="w-14 h-14 text-emerald-500 mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500" />
          <h3 className="text-3xl font-black text-white mb-3 tracking-tighter italic">DATA <span className="text-emerald-600">ARCHIVE</span></h3>
          <p className="text-[10px] font-bold text-slate-500 tracking-widest leading-relaxed">
            MONITOR FEEDBACK METRICS ACROSS <span className="text-emerald-400">ALL DEPARTMENTS</span> (MANAGERS & EMPLOYEES).
          </p>
          <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[9px] font-black text-emerald-500 tracking-[0.2em]">ACCESS DATABASE</span>
          </div>
        </button>
      </div>
    </section>
  );
};