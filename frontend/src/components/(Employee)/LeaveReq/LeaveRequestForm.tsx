'use client';

import React, { useMemo } from 'react';
import { FilePlus, Calendar, Info, ChevronRight, LucideIcon } from 'lucide-react';
import { Toaster } from 'sonner';

interface LeaveHistoryItem {
  type: string;
  date: string;
  status: string;
  color: string; 
  icon: LucideIcon;
}

interface LeaveRequestProps {
  credits: number;
  history: LeaveHistoryItem[];
  requestedDays: number;
  dates: { start: string; end: string };
  onDateChange: (type: 'start' | 'end', value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const LeaveRequestForm = ({ 
  credits, 
  history, 
  requestedDays, 
  dates,
  onDateChange, 
  onSubmit
}: LeaveRequestProps) => {

  const todayLimit = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  return (
    <section className="relative flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050510] to-[#050510] scrollbar-hide uppercase italic">
      
      {/* SONNER TOASTER CONFIG */}
      <Toaster 
        position="top-right" 
        expand={false} 
        richColors 
        theme="dark"
        toastOptions={{
          style: { 
            background: '#0a0a20', 
            border: '1px solid rgba(79, 70, 229, 0.2)',
            color: '#fff',
            fontFamily: 'inherit',
            textTransform: 'uppercase',
            fontSize: '10px',
            fontWeight: '900',
            letterSpacing: '0.1em'
          },
        }}
      />

      <header className="px-12 py-10 border-b border-indigo-500/10 flex justify-between items-end backdrop-blur-xl sticky top-0 z-20 bg-[#050510]/80">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <FilePlus className="w-4 h-4" strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Request Submission</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Apply For <span className="text-indigo-500">Leave</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl shadow-lg">
          <div className="text-right">
            <p className="text-[8px] font-black text-indigo-400/50 tracking-widest uppercase">Available Credits</p>
            <p className="text-lg font-black text-white italic">{credits} DAYS</p>
          </div>
          <div className="h-8 w-px bg-indigo-500/20"></div>
          <Calendar className="text-indigo-400 w-6 h-6" />
        </div>
      </header>

      <div className="p-12 max-w-[1200px] w-full mx-auto space-y-10">
        <form onSubmit={onSubmit} className="bg-indigo-950/20 border border-indigo-500/10 rounded-[3.5rem] p-12 shadow-2xl backdrop-blur-3xl space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase ml-1 pb-2">Leave Category</label>
              <select name="leaveType" required className="w-full h-[62px] bg-indigo-950/40 border border-indigo-500/10 rounded-2xl px-6 text-[10px] font-black text-white outline-none focus:border-indigo-500/50 appearance-none cursor-pointer">
                <option value="SICK LEAVE">SICK LEAVE</option>
                <option value="VACATION LEAVE">VACATION LEAVE</option>
                <option value="EMERGENCY LEAVE">EMERGENCY LEAVE</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase ml-1 pb-4">Inclusive Dates</label>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <p className="text-[7px] font-black text-indigo-500/50 tracking-widest ml-1">START</p>
                  <input name="startDate" type="date" required min={todayLimit} value={dates.start} onChange={(e) => onDateChange('start', e.target.value)} 
                    className="w-full h-[62px] bg-indigo-950/40 border border-indigo-500/10 rounded-2xl px-6 text-[10px] font-black text-white outline-none focus:border-indigo-500/50 [color-scheme:dark] cursor-pointer" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-[7px] font-black text-indigo-500/50 tracking-widest ml-1">END</p>
                  <input name="endDate" type="date" required min={dates.start || todayLimit} value={dates.end} onChange={(e) => onDateChange('end', e.target.value)} 
                    className="w-full h-[62px] bg-indigo-950/40 border border-indigo-500/10 rounded-2xl px-6 text-[10px] font-black text-white outline-none focus:border-indigo-500/50 [color-scheme:dark] cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase ml-1 pb-2">Reason / Remarks</label>
            <textarea 
              name="reason" 
              required 
              placeholder="PLEASE PROVIDE DETAILED REASON..." 
              className="w-full h-40 bg-indigo-950/40 border border-indigo-500/10 rounded-[2.5rem] p-8 text-xs font-black text-white outline-none focus:border-indigo-500/50 resize-none uppercase" 
            />
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-indigo-500/10">
            <div className="flex items-center gap-4 text-indigo-400">
               <Info className="w-5 h-5 text-indigo-500" />
               <span className="text-[9px] font-black uppercase tracking-widest">Requested: {requestedDays} Days</span>
            </div>
            <button type="submit" className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-xl active:scale-95 italic">
              Apply Request
            </button>
          </div>
        </form>

        <div className="space-y-6 pb-20">
          <h3 className="text-xs font-black text-white tracking-[0.4em] uppercase px-6 italic">Request Logs</h3>
          <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-[3rem] overflow-hidden backdrop-blur-xl">
            {history.length > 0 ? history.map((log, i) => (
              <div key={i} className="px-10 py-6 flex justify-between items-center border-b border-indigo-500/5 last:border-0 group hover:bg-indigo-500/5 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-400">
                    <log.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase">{log.type}</p>
                    <p className="text-[9px] font-black text-indigo-400/30 uppercase mt-1">Date: {log.date}</p>
                  </div>
                </div>
                <div className="text-[10px] font-black text-indigo-500 italic uppercase">
                  {log.status}
                  <ChevronRight className="inline w-3 h-3 ml-2 text-indigo-900" />
                </div>
              </div>
            )) : (
              <div className="p-20 text-center text-[10px] font-black text-indigo-900 tracking-[0.5em] uppercase">No active records found</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};