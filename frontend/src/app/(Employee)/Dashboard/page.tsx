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
      <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
        <Sidebar />

        <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] custom-scrollbar">
          
          <NavbarWrapper />

          <div className="p-10 max-w-[1600px] w-full mx-auto space-y-10">
            {/* Top Stats Section */}
            <StatCards />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              {/* Left Column: Feed */}
              <div className="xl:col-span-2">
                <PerformanceFeed />
              </div>

              {/* Right Column: Clocking System */}
              <div className="flex flex-col gap-6">
                <ShiftStatus />
              </div>
            </div>
          </div>
        </section>
      </main>
    </SessionGuard>
  );
}