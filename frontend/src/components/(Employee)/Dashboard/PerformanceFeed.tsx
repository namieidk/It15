'use client';

import React from 'react';
import { Zap, ExternalLink, BarChart3 } from 'lucide-react';

export const PerformanceFeed = () => {
  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
        <Zap className="w-40 h-40 text-indigo-500" />
      </div>
      
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Performance Analytics Feed</h3>
        <button className="text-[9px] font-bold text-slate-500 hover:text-indigo-400 flex items-center gap-1 uppercase tracking-widest transition-colors">
          History <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-4 relative z-10">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group/item">
            <div className="flex items-center gap-5">
              <div className="h-10 w-10 rounded-2xl bg-slate-950 flex items-center justify-center text-indigo-500 border border-white/5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-black text-white uppercase tracking-tight group-hover/item:text-indigo-400 transition-colors">Weekly Performance Audit</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">System Verified // ID: {i}092</p>
              </div>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-700 group-hover/item:text-indigo-500 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};