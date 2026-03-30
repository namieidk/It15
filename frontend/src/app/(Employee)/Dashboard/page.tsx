'use client';

import React from 'react';
import { Sidebar } from '../../../components/(Employee)/Dashboard/Sidebar';
import { StatCards } from '../../../components/(Employee)/Dashboard/StatCard';
import { NavbarWrapper } from '../../../components/(Employee)/Dashboard/NavbarWrapper';
import { PerformanceFeed } from '../../../components/(Employee)/Dashboard/PerformanceFeed';
import { ShiftStatus } from '../../../components/(Employee)/Dashboard/ShiftStatus';
import { SessionGuard } from '@/src/components/SessionGuard';

export default function EmployeeDashboard() {
  return (
    <SessionGuard allowedRoles={['EMPLOYEE']}>
      <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase italic font-black">
        <Sidebar />

        <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] scrollbar-hide">
          
          <NavbarWrapper />

          <div className="p-10 max-w-[1600px] w-full mx-auto space-y-10">
            {/* Real-time Metrics */}
            <StatCards />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              {/* Performance & Updates */}
              <div className="xl:col-span-2 space-y-10">
                <PerformanceFeed />
              </div>

              {/* Attendance & Compliance */}
              <div className="flex flex-col gap-8">
                <ShiftStatus />
                
                <div className="relative group bg-indigo-500/5 border border-indigo-500/10 p-8 rounded-[2.5rem] hidden xl:block overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full group-hover:bg-indigo-500/20 transition-all" />
                  
                  <h4 className="text-[10px] text-indigo-400 tracking-[0.3em] mb-4">Security Protocol</h4>
                  <p className="text-[9px] text-slate-500 leading-relaxed tracking-wider font-bold">
                    ENSURE ALL SHIFTS ARE TERMINATED BEFORE SYSTEM LOGOUT TO PREVENT PAYROLL DISCREPANCIES AND DATA OVERLAPS.
                  </p>
                  
                  <div className="mt-6 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-1/3 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SessionGuard>
  );
}