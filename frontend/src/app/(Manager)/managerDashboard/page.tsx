'use client';

import React from 'react';
import { ManagerSidebar } from '../../../components/(Manager)/Dashboard/ManagerSidebar';
import { NavbarWrapper } from '../../../components/(Employee)/Dashboard/NavbarWrapper'; 
import { 
  Users, 
  AlertCircle, 
  TrendingUp, 
  ChevronRight,
  Activity
} from 'lucide-react';

export default function ManagerDashboard() {
  const stats = [
    { label: 'Active Headcount', val: '42', sub: '95% SHIFT FILL', icon: Users, color: 'text-indigo-400' },
    { label: 'Pending Leaves', val: '08', sub: 'ACTION REQUIRED', icon: AlertCircle, color: 'text-orange-400' },
    { label: 'Team SLA', val: '99.2%', sub: 'ABOVE TARGET', icon: Activity, color: 'text-emerald-400' },
  ];

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <ManagerSidebar />

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
        
        {/* DYNAMIC NAVBAR */}
        <NavbarWrapper />

        <div className="p-12 max-w-[1600px] w-full mx-auto space-y-12">
          
          {/* TOP KPI CARDS - Now the first element below Navbar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] relative overflow-hidden group hover:border-indigo-500/20 transition-all shadow-2xl shadow-black/20">
                <s.icon className={`absolute top-6 right-8 w-12 h-12 ${s.color} opacity-10 group-hover:scale-125 transition-transform duration-500`} />
                <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] mb-2">{s.label}</p>
                <h2 className="text-5xl font-black text-white tracking-tighter">{s.val}</h2>
                <p className={`text-[9px] font-black ${s.color} mt-4 tracking-widest uppercase`}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT: PENDING APPROVALS LIST */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/20 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-sm">
                <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <h3 className="text-xs font-black text-white tracking-[0.3em] uppercase">Urgent Approvals</h3>
                  <span className="px-4 py-1 bg-orange-500/10 text-orange-400 text-[9px] font-black rounded-full border border-orange-500/20 uppercase">8 PENDING</span>
                </div>
                <div className="divide-y divide-white/5">
                  {[
                    { name: 'JONATHAN DEE', type: 'SICK LEAVE ', date: 'MAR 26 - 28' },
                    { name: 'MARIA SANTOS', type: 'EMERGENCY LEAVE ', date: 'MAR 26' },
                    { name: 'KEVIN TAN', type: 'VTO REQUEST ', date: 'MAR 27' },
                  ].map((req, i) => (
                    <div key={i} className="px-10 py-6 flex justify-between items-center hover:bg-white/5 transition-all group">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-slate-500 text-[10px] border border-white/5 group-hover:border-indigo-500/30 transition-all">
                          {req.name[0]}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white tracking-tight uppercase">{req.name}</p>
                          <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase">{req.type}{req.date}</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 text-[9px] font-black text-indigo-400 hover:text-white transition-colors tracking-widest uppercase group/btn">
                        REVIEW <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: ANALYTICS */}
            <div className="space-y-8">
              <div className="bg-indigo-600 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
                <TrendingUp className="absolute top-[-20px] right-[-20px] w-32 h-32 opacity-20" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-70">Shift Analytics</h3>
                <p className="text-3xl font-black tracking-tighter mb-8 leading-none uppercase">Team performance is up 14% this week</p>
                <button className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform shadow-lg">
                  View Full Report
                </button>
              </div>

              <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Resource Status</h3>
                {[
                  { label: 'Workstations', val: '98%', color: 'bg-emerald-500' },
                  { label: 'Network Load', val: '42%', color: 'bg-indigo-500' },
                  { label: 'AVAYA Status', val: 'ONLINE', color: 'bg-emerald-500' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-black text-white tracking-widest uppercase">{item.label}</span>
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black ${item.color} text-slate-950 uppercase`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}