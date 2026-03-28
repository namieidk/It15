'use client';

import { Sidebar } from '../../../components/(Employee)/Dashboard/Sidebar';
import { AttendanceTable } from '../../../components/(Employee)/Attendance/Attendancetable';
import { Calendar, Download, Filter } from 'lucide-react';

export default function AttendancePage() {
  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans">
      <Sidebar />
      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
        
        <header className="px-10 py-8 flex justify-between items-end border-b border-indigo-500/10 backdrop-blur-md sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Records</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
              Attendance <span className="text-indigo-500">Logs</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition">
              <Filter className="w-4 h-4 text-indigo-400" /> Filter Period
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20">
              <Download className="w-4 h-4" /> Export Data
            </button>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] w-full mx-auto">
          {/* All Logic, Metrics, and Tables are inside this component */}
          <AttendanceTable />
        </div>

      </section>
    </main>
  );
}