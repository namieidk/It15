'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, LogOut, Loader2, Clock } from 'lucide-react';

export const ShiftStatus = () => {
  const [time, setTime] = useState('--:--:--');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ reg: 0, ot: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    
    const stored = localStorage.getItem('user');
    if (stored) {
      const { employeeId } = JSON.parse(stored);
      fetchStats(employeeId);
    }

    return () => clearInterval(timer);
  }, []);

  const fetchStats = async (empId: string) => {
    try {
      const response = await fetch(`http://localhost:5076/api/attendance/weekly-summary/${empId}`);
      
      // CRITICAL SAFETY CHECK: Prevent "Unexpected end of JSON" crash
      if (!response.ok) {
        console.warn(`Stat fetch failed with status: ${response.status}. Verify endpoint exists.`);
        return; 
      }

      const data = await response.json();
      setStats({ reg: data.totalRegular, ot: data.totalOT });
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

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
        setIsClockedIn(!isClockedIn);
        fetchStats(employeeId); // Refresh stats
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Action failed");
      }
    } catch (err) {
      alert("Backend is unreachable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-indigo-950/40 p-8 rounded-[2.5rem] border border-indigo-500/10 backdrop-blur-xl">
      <div className="text-center mb-6">
        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Current System Time</p>
        <div className="text-4xl font-mono font-black text-white">{time}</div>
      </div>

      <button 
        onClick={handleToggleShift}
        disabled={isLoading}
        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
          isClockedIn 
            ? 'bg-slate-900 text-white hover:bg-black border border-white/5' 
            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
        }`}
      >
        {isLoading ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : isClockedIn ? "End Shift" : "Begin Shift"}
      </button>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
          <p className="text-[8px] font-bold text-slate-500 uppercase">Regular</p>
          <p className="text-lg font-black text-indigo-300">{stats.reg}h</p>
        </div>
        <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
          <p className="text-[8px] font-bold text-emerald-500/50 uppercase">Overtime</p>
          <p className="text-lg font-black text-emerald-400">+{stats.ot}h</p>
        </div>
      </div>
    </div>
  );
};