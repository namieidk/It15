'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Users, Search, Filter, Download, UserCheck, AlertTriangle, MoreHorizontal, Clock, X } from 'lucide-react';

export interface AttendanceRecord {
  id: string;
  name: string;
  shift: string;
  login: string;
  status: string;
  health: 'GOOD' | 'WARNING' | 'CRITICAL';
}

export type StatusFilter = 'ALL' | 'PRESENT' | 'LATE' | 'ABSENT';
export type DateFilter = 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH';
export type ShiftFilter = 'ALL' | 'MORNING' | 'AFTERNOON' | 'NIGHT';

export interface FilterState {
  status: StatusFilter;
  date: DateFilter;
  shift: ShiftFilter;
}

interface ManagerAttendanceUIProps {
  attendanceData: AttendanceRecord[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
}

export const ManagerAttendanceUI = ({
  attendanceData,
  searchTerm,
  onSearchChange,
  onExport,
  filters,
  onFilterChange,
  onResetFilters,
}: ManagerAttendanceUIProps) => {

  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isFilterActive =
    filters.status !== 'ALL' ||
    filters.date !== 'TODAY' ||
    filters.shift !== 'ALL';

  const lateCount = attendanceData.filter(a => a.status === 'LATE').length;
  const presentCount = attendanceData.filter(a => a.status === 'PRESENT').length;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-12 max-w-[1600px] w-full mx-auto space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-end border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 mb-2">
            <Clock className="w-4 h-4" strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Live Department Stream</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            Roster <span className="text-indigo-600">Attendance</span>
          </h1>
          <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase mt-2">{today}</p>
        </div>

        <div className="flex gap-4 items-center">
          {/* SEARCH */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="SEARCH AGENT..."
              className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black tracking-widest outline-none focus:border-indigo-500/50 transition-all min-w-[280px] text-white uppercase"
            />
          </div>

          {/* FILTER BUTTON + DROPDOWN */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                isFilterActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-600/20'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:border-indigo-500/50 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {isFilterActive && <span className="w-2 h-2 bg-white rounded-full animate-pulse" />}
            </button>

            {showFilter && (
              <div className="absolute right-0 top-14 z-50 w-80 bg-[#0a0f1e] border border-white/10 rounded-[2rem] shadow-2xl p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Filter Options</span>
                  <div className="flex items-center gap-3">
                    {isFilterActive && (
                      <button
                        onClick={() => { onResetFilters(); }}
                        className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                    <button onClick={() => setShowFilter(false)}>
                      <X className="w-4 h-4 text-slate-500 hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>

                {/* STATUS */}
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['ALL', 'PRESENT', 'LATE', 'ABSENT'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => onFilterChange({ ...filters, status: s })}
                        className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                          filters.status === s
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-white/5 text-slate-400 border-white/5 hover:border-indigo-500/30 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DATE */}
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Date Range</p>
                  <div className="space-y-2">
                    {([
                      { val: 'TODAY', label: 'Today' },
                      { val: 'THIS_WEEK', label: 'This Week' },
                      { val: 'THIS_MONTH', label: 'This Month' },
                    ] as const).map((d) => (
                      <button
                        key={d.val}
                        onClick={() => onFilterChange({ ...filters, date: d.val })}
                        className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                          filters.date === d.val
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-white/5 text-slate-400 border-white/5 hover:border-indigo-500/30 hover:text-white'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SHIFT */}
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Shift</p>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { val: 'ALL', label: 'All Shifts' },
                      { val: 'MORNING', label: '🌅 Morning' },
                      { val: 'AFTERNOON', label: '☀️ Afternoon' },
                      { val: 'NIGHT', label: '🌙 Night' },
                    ] as const).map((sh) => (
                      <button
                        key={sh.val}
                        onClick={() => onFilterChange({ ...filters, shift: sh.val })}
                        className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                          filters.shift === sh.val
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-white/5 text-slate-400 border-white/5 hover:border-indigo-500/30 hover:text-white'
                        }`}
                      >
                        {sh.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowFilter(false)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onExport}
            className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
          >
            <Download className="w-4 h-4" /> Export Log
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total In Shift', val: attendanceData.length, icon: UserCheck, color: 'text-indigo-400' },
          { label: 'On-Time', val: presentCount, icon: Users, color: 'text-emerald-500' },
          { label: 'Late Flags', val: lateCount, icon: AlertTriangle, color: 'text-orange-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] flex items-center gap-5 backdrop-blur-3xl">
            <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color} tracking-tighter`}>{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-slate-900/20 border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
             {today}
          </h3>
          <div className="flex items-center gap-3">
            {isFilterActive && (
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Filters Active
              </span>
            )}
            {searchTerm && (
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Search: {searchTerm}
              </span>
            )}
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black border-b border-white/5">
              <th className="px-10 py-6">Agent ID</th>
              <th className="px-10 py-6">Name</th>
              <th className="px-10 py-6">Clock In</th>
              <th className="px-10 py-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {attendanceData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-10 py-20 text-center text-[10px] font-black text-slate-600 tracking-widest uppercase">
                  {searchTerm || isFilterActive ? 'No records match your filters' : 'No attendance records found for today'}
                </td>
              </tr>
            ) : (
              attendanceData.map((agent, index) => (
                <tr key={`${agent.id}-${agent.login}-${index}`} className="hover:bg-white/5 transition-all group">
                  <td className="px-10 py-7 text-[10px] font-black text-slate-500 tracking-widest font-mono">{agent.id}</td>
                  <td className="px-10 py-7 font-black text-white text-xs uppercase group-hover:text-indigo-400 transition-colors">{agent.name}</td>
                  <td className="px-10 py-7 font-mono text-white text-sm">{agent.login}</td>
                  <td className="px-10 py-7">
                    <span className={`text-[10px] font-black tracking-widest uppercase ${
                      agent.status === 'LATE' ? 'text-orange-400' : 'text-emerald-500'
                    }`}>
                      ● {agent.status}
                    </span>
                  </td>
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};