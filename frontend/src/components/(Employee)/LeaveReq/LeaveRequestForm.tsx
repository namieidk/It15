'use client';

import React from 'react';
import { FilePlus, Send, Calendar, Info, ChevronRight, ShieldCheck, AlertCircle, X } from 'lucide-react';

interface LeaveHistory {
  type: string;
  date: string;
  status: string;
  color: string;
  icon: React.ElementType;
}

interface LeaveRequestProps {
  credits: number;
  history: LeaveHistory[];
  requestedDays: number;
  onDateChange: (type: 'start' | 'end', value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  popup: { show: boolean; msg: string; type: 'success' | 'error' };
  closePopup: () => void;
}

export const LeaveRequestForm = ({ 
  credits, 
  history, 
  requestedDays, 
  onDateChange, 
  onSubmit,
  popup,       // ✅ now destructured
  closePopup   // ✅ now destructured
}: LeaveRequestProps) => {
  
  return (
    <section className="relative flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050510] to-[#050510]">

      {/* ✅ POPUP MODAL - was completely missing */}
      {popup.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050510]/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className={`relative max-w-sm w-full p-8 rounded-[3rem] border shadow-2xl text-center space-y-6 ${
            popup.type === 'success' 
              ? 'bg-indigo-950/40 border-indigo-500/30' 
              : 'bg-red-950/40 border-red-500/30'
          }`}>
            <button onClick={closePopup} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
              popup.type === 'success' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {popup.type === 'success' ? <ShieldCheck className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white tracking-tighter uppercase">System Message</h2>
              <p className="text-[10px] font-bold text-slate-400 leading-relaxed tracking-[0.2em] uppercase px-4">
                {popup.msg}
              </p>
            </div>
            <button 
              onClick={closePopup}
              className={`w-full py-5 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase transition-all active:scale-95 shadow-lg ${
                popup.type === 'success' 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20' 
                  : 'bg-red-600 text-white hover:bg-red-500 shadow-red-600/20'
              }`}
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="px-12 py-10 border-b border-indigo-500/10 flex justify-between items-end backdrop-blur-xl sticky top-0 z-20 bg-[#050510]/80">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <FilePlus className="w-4 h-4" strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Request Submission</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            Apply For <span className="text-indigo-500">Leave</span>
          </h1>
        </div>
        <div className="flex items-center gap-4 bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl shadow-lg">
          <div className="text-right">
            <p className="text-[8px] font-black text-indigo-400/50 tracking-widest uppercase">Available Credits</p>
            <p className="text-lg font-black text-white">{Math.floor(credits || 15)} DAYS</p>
          </div>
          <div className="h-8 w-px bg-indigo-500/20"></div>
          <Calendar className="text-indigo-400 w-6 h-6" />
        </div>
      </header>

      <div className="p-12 max-w-[1200px] w-full mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <form onSubmit={onSubmit} className="bg-indigo-950/20 border border-indigo-500/10 rounded-[3.5rem] p-12 shadow-2xl backdrop-blur-3xl space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase">Leave Category</label>
              <select name="leaveType" required className="w-full bg-indigo-950/40 border border-indigo-500/10 rounded-2xl p-5 text-xs font-black text-white outline-none focus:border-indigo-500/50 appearance-none">
                <option value="SICK LEAVE">SICK LEAVE </option>
<option value="VACATION LEAVE">VACATION LEAVE </option>
<option value="EMERGENCY LEAVE">EMERGENCY LEAVE </option>
              </select>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase">Inclusive Dates</label>
                {requestedDays > 0 && (
                  <span className="text-[10px] font-black text-indigo-500 animate-pulse bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    {requestedDays} DAYS REQUESTED
                  </span>
                )}
              </div>
              <div className="flex gap-4">
                <input name="startDate" type="date" required onChange={(e) => onDateChange('start', e.target.value)} className="flex-1 bg-indigo-950/40 border border-indigo-500/10 rounded-2xl p-5 text-xs font-black text-white outline-none focus:border-indigo-500/50 [color-scheme:dark]" />
                <input name="endDate" type="date" required onChange={(e) => onDateChange('end', e.target.value)} className="flex-1 bg-indigo-950/40 border border-indigo-500/10 rounded-2xl p-5 text-xs font-black text-white outline-none focus:border-indigo-500/50 [color-scheme:dark]" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-indigo-400 tracking-[0.3em] uppercase">Reason / Remarks</label>
            <textarea name="reason" required placeholder="PLEASE SPECIFY REASON..." className="w-full h-40 bg-indigo-950/40 border border-indigo-500/10 rounded-[2.5rem] p-8 text-xs font-black text-white outline-none focus:border-indigo-500/50 resize-none placeholder:text-indigo-900" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-indigo-500/10 gap-6">
            <div className="flex items-start gap-4 text-indigo-400 max-w-sm">
              <Info className="w-5 h-5 text-indigo-500 flex-shrink-0" />
              <p className="text-[9px] font-black uppercase leading-relaxed tracking-widest text-indigo-400">
                Approval is subject to management review. Balance updates upon approval.
              </p>
            </div>
            <button 
              type="submit" 
              className="w-full md:w-auto flex items-center justify-center gap-3 px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 group uppercase"
            >
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={3} /> 
              Transmit Request
            </button>
          </div>
        </form>

        {/* HISTORY SECTION */}
        <div className="space-y-6 pb-20">
          <h3 className="text-xs font-black text-white tracking-[0.4em] uppercase px-6">Request Logs</h3>
          <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-[3rem] overflow-hidden backdrop-blur-xl">
            {history.length > 0 ? history.map((log, i) => (
              <div key={i} className="px-10 py-6 flex justify-between items-center border-b border-indigo-500/5 last:border-0 group hover:bg-indigo-500/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-400">
                    <log.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white tracking-tight uppercase">{log.type}</p>
                    <p className="text-[9px] font-black text-indigo-400/30 tracking-widest uppercase mt-1">SUBMITTED: {log.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black tracking-[0.2em] uppercase text-indigo-500">
                  {log.status}
                  <ChevronRight className="w-4 h-4 text-indigo-900" />
                </div>
              </div>
            )) : (
              <div className="p-20 text-center">
                <p className="text-[10px] font-black text-indigo-900 tracking-[0.5em] uppercase">No active records found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};