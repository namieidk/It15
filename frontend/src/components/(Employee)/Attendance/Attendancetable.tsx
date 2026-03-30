'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Moon, 
  Sun, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle 
} from 'lucide-react';

interface Log {
  id: number;
  clockInTime: string;
  clockOutTime: string | null;
  regularHours: number;
  overtimeHours: number;
  totalHoursWorked: number;
  status: string;
}

interface AttendanceTableProps {
  startDate?: string;
  endDate?: string;
}

export const AttendanceTable = ({ startDate, endDate }: AttendanceTableProps) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. FETCH DATA
  useEffect(() => {
    const loadData = async () => {
      const stored = localStorage.getItem('user');
      if (!stored) return;
      const { employeeId } = JSON.parse(stored);

      try {
        const res = await fetch(`http://localhost:5076/api/attendance/my-logs/${employeeId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data: Log[] = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Connection Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. FILTER LOGS BASED ON PROPS
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const logDate = new Date(log.clockInTime).toISOString().split('T')[0];
      
      if (startDate && logDate < startDate) return false;
      if (endDate && logDate > endDate) return false;
      
      return true;
    });
  }, [logs, startDate, endDate]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate]);

  // 3. CALCULATE METRICS (Based on filtered data)
  const metrics = useMemo(() => {
    if (filteredLogs.length === 0) return { total: 0, lates: 0, score: 0 };

    const totalHrs = filteredLogs.reduce((acc, curr) => acc + curr.totalHoursWorked, 0);
    const lateCount = filteredLogs.filter((l) => l.status.toUpperCase().includes('LATE')).length;

    const completedShifts = filteredLogs.filter(l => l.clockOutTime !== null);
    const targetHours = completedShifts.length * 8;
    const actualHours = completedShifts.reduce((acc, curr) => acc + curr.totalHoursWorked, 0);

    let complianceScore = 100;
    if (targetHours > 0) {
      complianceScore = Math.min(100, (actualHours / targetHours) * 100);
    }

    return { 
      total: totalHrs, 
      lates: lateCount, 
      score: Math.round(complianceScore) 
    };
  }, [filteredLogs]);

  // 4. PAGINATION CALCULATION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;

  if (loading) {
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-xs text-shadow-glow">Syncing Encrypted Logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 uppercase">
      
      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricBox 
          label="Total Hours" 
          val={metrics.total.toFixed(1)} 
          unit="HRS" 
          color="text-white" 
        />
        <MetricBox 
          label="Late Instances" 
          val={metrics.lates.toString().padStart(2, '0')} 
          unit="SHIFTS" 
          color="text-orange-400" 
        />
        <MetricBox 
          label="Performance Score" 
          val={`${metrics.score}%`} 
          unit={metrics.score >= 90 ? "EXCELLENT" : "BELOW TARGET"} 
          color={metrics.score < 85 ? "text-red-400" : "text-indigo-400"} 
        />
      </div>

      {/* LOGS TABLE */}
      <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-indigo-500/10 bg-indigo-500/5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/60">
                <th className="p-6">Shift Window</th>
                <th className="p-6">Time In/Out</th>
                <th className="p-6 text-center">Regular</th>
                <th className="p-6 text-center">Overtime</th>
                <th className="p-6">Target Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/5">
              {currentItems.length > 0 ? (
                currentItems.map((log) => {
                  const date = new Date(log.clockInTime);
                  const isNight = date.getHours() >= 18 || date.getHours() < 6;
                  const progress = Math.min(100, (log.totalHoursWorked / 8) * 100);

                  return (
                    <tr key={log.id} className="hover:bg-indigo-500/[0.03] transition-all group">
                      <td className="p-6 font-bold text-sm">
                        <div className="flex items-center gap-3">
                           {isNight ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                           <span className="text-white tracking-tighter italic">
                             {date.toLocaleDateString('en-PH', { day: '2-digit', month: 'short', year: 'numeric' })}
                           </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-xs font-black">
                          <span className="text-indigo-300">{new Date(log.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="text-slate-600">→</span>
                          <span className={log.clockOutTime ? "text-slate-400" : "text-emerald-400 animate-pulse"}>
                            {log.clockOutTime ? new Date(log.clockOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ONGOING'}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-center font-mono font-bold text-indigo-200">{log.regularHours.toFixed(1)}h</td>
                      <td className="p-6 text-center font-mono font-bold text-emerald-400">{log.overtimeHours > 0 ? `+${log.overtimeHours.toFixed(1)}h` : '—'}</td>
                      <td className="p-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter">
                            <span className={progress >= 100 ? "text-emerald-400" : "text-indigo-400/60"}>
                              {log.totalHoursWorked.toFixed(1)} / 8.0 HRS
                            </span>
                            <span className="text-slate-500">{Math.round(progress)}%</span>
                          </div>
                          <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${progress >= 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-indigo-500'}`} 
                              style={{ width: `${progress}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-500 uppercase font-black text-xs tracking-widest">
                    No records found for selected range
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-6 bg-indigo-500/5 flex items-center justify-between border-t border-indigo-500/10">
          <p className="text-[10px] text-indigo-400/50 font-black uppercase tracking-widest">
            Range: {indexOfFirstItem + 1} — {Math.min(indexOfLastItem, filteredLogs.length)} of {filteredLogs.length}
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-indigo-500/10 text-indigo-400 disabled:opacity-20 hover:bg-indigo-500/10 transition-all active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-[11px] font-black text-white px-2">
              PAGE {currentPage} <span className="text-slate-600 mx-1">/</span> {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-indigo-500/10 text-indigo-400 disabled:opacity-20 hover:bg-indigo-500/10 transition-all active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem]">
        <AlertCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
        <p className="text-[11px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
          System Notice: Filtering updates performance metrics in real-time. Use range selection to audit specific billing cycles.
        </p>
      </div>
    </div>
  );
};

const MetricBox = ({ label, val, unit, color }: { label: string, val: string, unit: string, color: string }) => (
  <div className="bg-indigo-950/20 p-7 rounded-[2.5rem] border border-indigo-500/10 backdrop-blur-3xl shadow-xl group hover:border-indigo-500/30 transition-all">
    <p className="text-[10px] font-black text-indigo-400/50 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">{label}</p>
    <p className={`text-4xl font-black ${color} tracking-tighter uppercase italic`}>
      {val} <span className="text-[10px] text-slate-600 font-bold tracking-normal ml-1 italic">{unit}</span>
    </p>
  </div>
);