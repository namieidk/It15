'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../../components/(Employee)/Dashboard/Sidebar';
import { AttendanceTable } from '../../../components/(Employee)/Attendance/Attendancetable';
import { Calendar, Download, Filter, X } from 'lucide-react';

export default function AttendancePage() {
  // State for date filtering
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <Sidebar />
      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] scrollbar-hide">
        
        <header className="px-10 py-8 flex flex-col md:flex-row md:items-end justify-between border-b border-indigo-500/10 backdrop-blur-md sticky top-0 z-20 gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Records</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Attendance <span className="text-indigo-500 text-shadow-glow">Logs</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* DATE INPUTS */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2 gap-3 focus-within:border-indigo-500/50 transition-all">
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-indigo-500 tracking-widest ml-1">FROM</span>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-[10px] font-bold outline-none text-white w-28 uppercase"
                />
              </div>
              <div className="w-[1px] h-6 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[7px] font-black text-indigo-500 tracking-widest ml-1">TO</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-[10px] font-bold outline-none text-white w-28 uppercase"
                />
              </div>
            </div>

            {/* CLEAR FILTER BUTTON */}
            {(startDate || endDate) && (
              <button 
                onClick={clearFilters}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition group"
                title="Clear Filters"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              </button>
            )}
          </div>
        </header>

        <div className="p-10 max-w-[1600px] w-full mx-auto">
          {/* Passing the filter states to the table component */}
          <AttendanceTable startDate={startDate} endDate={endDate} />
        </div>

      </section>
    </main>
  );
}