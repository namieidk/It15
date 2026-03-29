'use client';

import React from 'react';
import { HRSidebar } from '../../../components/(Hr)/Dashboard/sidebar';
import { NavbarWrapper } from '../../../components/(Employee)/Dashboard/NavbarWrapper'; // Adjusted import path
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight,
  Briefcase
} from 'lucide-react';

export default function HRDashboard() {
  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      {/* SIDEBAR NAVIGATION */}
      <HRSidebar />

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
        
        {/* GLOBAL NAVIGATION (Replaces old Header) */}
        <NavbarWrapper />

        <div className="p-12 max-w-[1600px] w-full mx-auto space-y-10">
          
          {/* HR COMMAND METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'ACTIVE HEADCOUNT', val: '1,284', icon: Users, color: 'text-white' },
              { label: 'OPEN REQUISITIONS', val: '24', icon: Briefcase, color: 'text-indigo-400' },
              { label: 'NEW APPLICANTS', val: '156', icon: UserPlus, color: 'text-emerald-500' },
              { label: 'ATTRITION RATE', val: '2.4%', icon: TrendingUp, color: 'text-orange-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between backdrop-blur-3xl group hover:border-indigo-500/30 transition-all">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-600 tracking-widest mb-1">{stat.label}</p>
                    <p className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* RECENT APPLICANTS LIST */}
            <div className="lg:col-span-2 bg-slate-900/20 border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
              <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Pending Talent Pipeline</h3>
                <button className="text-[9px] font-black text-indigo-500 hover:text-indigo-400 transition-colors tracking-widest uppercase">View All Applicants</button>
              </div>
              <div className="divide-y divide-white/5">
                {[
                  { name: 'JULIA CHENG', role: 'UX DESIGNER', date: '2 HOURS AGO', source: 'LINKEDIN' },
                  { name: 'LIAM O\'REILLY', role: 'SR. DEVELOPER', date: '5 HOURS AGO', source: 'REFERRAL' },
                  { name: 'SAMANTHA VANE', role: 'HR GENERALIST', date: 'YESTERDAY', source: 'INDEED' },
                  { name: 'DAVID KHO', role: 'DATA ANALYST', date: '2 DAYS AGO', source: 'DIRECT' },
                ].map((applicant, i) => (
                  <div key={i} className="px-10 py-6 flex justify-between items-center hover:bg-white/5 transition-all group">
                    <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/10 flex items-center justify-center text-indigo-500 text-[10px] font-black">
                            {applicant.name[0]}{applicant.name.split(' ')[1][0]}
                        </div>
                        <div>
                            <p className="text-xs font-black text-white tracking-tight uppercase">{applicant.name}</p>
                            <p className="text-[9px] font-bold text-slate-500 tracking-widest">{applicant.role}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-600 tracking-widest">{applicant.source}</p>
                            <p className="text-[10px] font-black text-slate-400">{applicant.date}</p>
                        </div>
                        <div className="p-2 bg-white/5 rounded-lg border border-white/5 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all cursor-pointer">
                            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CRITICAL COMPLIANCE ALERTS */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-indigo-500 tracking-[0.4em] px-4">Compliance Radar</h3>
              <div className="space-y-4">
                {[
                    { title: 'PAYROLL FINALIZATION', body: 'Q1 Payroll logs require sign-off by EOD.', urgent: true },
                    { title: 'LEAVE CONFLICT', body: '3 Managers applied for overlapping leave dates.', urgent: false },
                    { title: 'SECURITY AUDIT', body: '5 Employees missing biometric re-verification.', urgent: true },
                ].map((alert, i) => (
                    <div key={i} className={`p-8 rounded-[2.5rem] border transition-all ${
                        alert.urgent ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-900/40 border-white/5'
                    }`}>
                        <div className="flex items-center gap-3 mb-3">
                            <AlertCircle className={`w-4 h-4 ${alert.urgent ? 'text-red-500' : 'text-indigo-500'}`} />
                            <h4 className={`text-[10px] font-black tracking-widest uppercase ${alert.urgent ? 'text-red-400' : 'text-white'}`}>
                                {alert.title}
                            </h4>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 tracking-widest leading-relaxed">
                            {alert.body}
                        </p>
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