'use client';

import React from 'react';
import { ClipboardCheck, Users, ShieldCheck } from 'lucide-react';

interface HREvaluationHubUIProps {
  onNavigate: (view: 'evaluate' | 'results') => void;
}

export const HREvaluationHubUI = ({ onNavigate }: HREvaluationHubUIProps) => {
  return (
    <section className="flex-1 p-12 flex flex-col justify-center items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 text-indigo-500 mb-4">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-black tracking-[0.5em]">ADMINISTRATIVE OVERWATCH</span>
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
          PERFORMANCE <span className="text-indigo-600">AUDIT</span>
        </h1>
        <p className="text-[10px] font-black text-slate-500 tracking-[0.5em]">GLOBAL PERSONNEL EVALUATION MODULE</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl uppercase">
        <button
          onClick={() => onNavigate('evaluate')}
          className="bg-slate-900/40 border border-white/5 p-12 rounded-[3rem] hover:border-indigo-500/50 transition-all group text-left backdrop-blur-md"
        >
          <ClipboardCheck className="w-12 h-12 text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">ANNUAL REVIEW</h3>
          <p className="text-[9px] font-bold text-slate-500 tracking-widest leading-relaxed">EXECUTE FORMAL PERFORMANCE REVIEWS FOR ALL AGENTS</p>
        </button>

        <button
          onClick={() => onNavigate('results')}
          className="bg-slate-900/40 border border-white/5 p-12 rounded-[3rem] hover:border-emerald-500/50 transition-all group text-left backdrop-blur-md"
        >
          <Users className="w-12 h-12 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">GLOBAL RESULTS</h3>
          <p className="text-[9px] font-bold text-slate-500 tracking-widest leading-relaxed">MONITOR ANONYMIZED PEER FEEDBACK METRICS</p>
        </button>
      </div>
    </section>
  );
};