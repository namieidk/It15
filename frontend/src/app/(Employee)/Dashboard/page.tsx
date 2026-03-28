'use client';

import React from 'react';
import { 
  Bell, 
  Search, 
  Zap, 
  ExternalLink, 
  BarChart3, 
  LayoutDashboard 
} from 'lucide-react';

import { Sidebar } from '../../../components/(Employee)/Dashboard/Sidebar';
import { StatCards } from '../../../components/(Employee)/Dashboard/StatCard';
import { SessionGuard } from '@/src/components/SessionGuard';

export default function EmployeeDashboard() {
  return (
    <SessionGuard allowedRoles={['EMPLOYEE']}>
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020617] to-[#020617]">
        
        {/* TOP BAR / HEADER */}
        <header className="px-10 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-2">
                Operational <span className="text-emerald-500 not-italic">Unit</span>
              </h1>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Node: AX-PRIME-01 // Dept: Operations</p>
            </div>
            
            <div className="hidden xl:flex items-center bg-white/5 border border-white/5 px-4 py-2 rounded-xl gap-3">
              <Search className="w-4 h-4 text-slate-500" />
              <input 
                className="bg-transparent outline-none text-xs font-bold placeholder:text-slate-600 w-48" 
                placeholder="Search system logs..." 
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#020617]"></span>
            </button>
            
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="text-right">
                <p className="text-xs font-black text-white uppercase tracking-tight">Alexander Wright</p>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">L3 Senior Tech</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center shadow-2xl">
                <span className="text-emerald-500 font-black text-xs">AW</span>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="p-10 max-w-[1600px] w-full mx-auto">
          <StatCards />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Left Column: Activity Feed */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Zap className="w-40 h-40 text-emerald-500" />
                </div>
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Performance Analytics Feed</h3>
                  <button className="text-[10px] font-bold text-slate-500 hover:text-emerald-400 flex items-center gap-1 uppercase tracking-widest transition-colors">
                    History <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-4 relative z-10">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group/item">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-slate-950 flex items-center justify-center text-emerald-500 border border-white/5">
                          <BarChart3 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight group-hover/item:text-emerald-400">Weekly Performance Audit</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">System Verified // ID: {i}092</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Clock Widget */}
            <div className="space-y-6">
              <div className="bg-emerald-500 p-10 rounded-[3rem] text-slate-950 flex flex-col items-center text-center relative overflow-hidden">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-slate-900/60">Shift Timer</h3>
                <div className="text-5xl font-black tracking-tighter mb-8 font-mono">07:22:14</div>
                <button className="w-full py-5 bg-slate-950 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] transition-transform">
                  <Zap className="w-4 h-4 text-emerald-400" fill="currentColor" />
                  Clock Out Securely
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </SessionGuard>
  );
}