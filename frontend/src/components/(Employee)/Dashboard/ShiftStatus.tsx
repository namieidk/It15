'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

export const ShiftStatus = () => {
  const [time, setTime] = useState('--:--:--');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ reg: 0, ot: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const { employeeId } = JSON.parse(storedUser);
      fetchStats(employeeId);
      const savedStatus = localStorage.getItem(`isClockedIn_${employeeId}`);
      if (savedStatus === 'true') setIsClockedIn(true);
    }
  }, []);

  const fetchStats = useCallback(async (empId: string) => {
    try {
      const response = await fetch(`http://localhost:5076/api/attendance/weekly-summary/${empId}`);
      if (response.ok) {
        const data = await response.json();
        setStats({ reg: data.totalRegular || 0, ot: data.totalOT || 0 });
      }
    } catch (err) { console.error(err); }
  }, []);

  const handleToggleShift = async () => {
    setIsLoading(true);
    const stored = localStorage.getItem('user');
    if (!stored) return;
    const { employeeId } = JSON.parse(stored);
    const endpoint = isClockedIn ? 'clockout' : 'clockin';
    
    try {
      const res = await fetch(`http://localhost:5076/api/attendance/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId }),
      });

      if (res.ok) {
        const newStatus = !isClockedIn;
        setIsClockedIn(newStatus);
        localStorage.setItem(`isClockedIn_${employeeId}`, String(newStatus));
        fetchStats(employeeId); 
      }
    } catch (err) { alert("Backend unreachable"); } 
    finally { setIsLoading(false); }
  };

  return (
    <div className="bg-indigo-950/40 p-8 rounded-[2.5rem] border border-indigo-500/10 backdrop-blur-xl uppercase italic font-black">
      <div className="text-center mb-6">
        <p className="text-[9px] text-indigo-400 tracking-[0.4em] mb-2">System Time</p>
        <div className="text-4xl text-white font-mono tracking-tighter">{time}</div>
      </div>

      <button 
        onClick={handleToggleShift}
        disabled={isLoading}
        className={`w-full py-5 rounded-2xl text-[10px] tracking-[0.2em] transition-all active:scale-95 ${
          isClockedIn ? 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20' : 'bg-indigo-600 text-white hover:bg-indigo-500'
        }`}
      >
        {isLoading ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : (isClockedIn ? "TERMINATE SHIFT" : "BEGIN SHIFT")}
      </button>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
          <p className="text-[8px] text-slate-500 tracking-widest mb-1">Regular</p>
          <p className="text-xl text-indigo-400">{stats.reg}H</p>
        </div>
        <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10">
          <p className="text-[8px] text-emerald-500/50 tracking-widest mb-1">Overtime</p>
          <p className="text-xl text-emerald-400">+{stats.ot}H</p>
        </div>
      </div>
    </div>
  );
};