'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export const ShiftStatus = () => {
  const [time, setTime] = useState('--:--:--');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        setStats({ 
            reg: data.totalRegular || 0, 
            ot: data.totalOT || 0 
        });
      } else {
        // If the endpoint returns 404 because no records exist yet, just default to 0
        setStats({ reg: 0, ot: 0 });
      }
    } catch (err) { 
        console.error("Attendance API unreachable", err); 
    }
  }, []);

  const handleToggleShift = async () => {
    setIsLoading(true);
    setError(null);
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

      const data = await res.json();

      if (res.ok) {
        const newStatus = !isClockedIn;
        setIsClockedIn(newStatus);
        localStorage.setItem(`isClockedIn_${employeeId}`, String(newStatus));
        fetchStats(employeeId); 
      } else {
        // Display backend error (e.g., "TOO EARLY")
        setError(data.message?.toUpperCase() || "SHIFT ACTION DENIED");
      }
    } catch (err) { 
      setError("COMMUNICATION ERROR: SYSTEM OFFLINE"); 
    } finally { 
      setIsLoading(false); 
    }
  };

  return (
    <div className="bg-indigo-950/40 p-8 rounded-[2.5rem] border border-indigo-500/10 backdrop-blur-xl uppercase italic font-black relative overflow-hidden">
      
      {error && (
        <div className="absolute inset-0 z-20 bg-red-600/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-8 h-8 text-white mb-3" />
          <p className="text-[10px] text-white tracking-[0.2em] leading-relaxed mb-4">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="px-6 py-2 bg-white text-red-600 rounded-full text-[8px] font-black tracking-[0.3em] hover:scale-105 transition-all"
          >
            ACKNOWLEDGE
          </button>
        </div>
      )}

      <div className="text-center mb-6">
        <p className="text-[9px] text-indigo-400 tracking-[0.4em] mb-2 font-normal not-italic">System Time</p>
        <div className="text-4xl text-white font-mono tracking-tighter">{time}</div>
      </div>

      <button 
        onClick={handleToggleShift}
        disabled={isLoading}
        className={`w-full py-5 rounded-2xl text-[10px] tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center ${
          isClockedIn ? 'bg-red-600 text-white hover:bg-red-500 shadow-xl shadow-red-600/20' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20'
        }`}
      >
        {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : (isClockedIn ? "TERMINATE SHIFT" : "BEGIN SHIFT")}
      </button>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
          <p className="text-[8px] text-slate-500 tracking-widest mb-1 not-italic font-normal">Regular</p>
          <p className="text-xl text-indigo-400">{stats.reg}H</p>
        </div>
        <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10">
          <p className="text-[8px] text-emerald-500/50 tracking-widest mb-1 not-italic font-normal">Overtime</p>
          <p className="text-xl text-emerald-400">+{stats.ot}H</p>
        </div>
      </div>
    </div>
  );
};