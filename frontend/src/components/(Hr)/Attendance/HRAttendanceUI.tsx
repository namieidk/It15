'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Users, Search, Filter, Download, UserCheck, AlertTriangle, Clock, X, Building2 } from 'lucide-react';

export interface HRAttendanceRecord {
  id: string;
  name: string;
  dept: string; // HR Specific
  shift: string;
  login: string;
  status: string;
}

export interface HRFilterState {
  status: string;
  department: string;
  shift: string;
}

interface HRAttendanceUIProps {
  data: HRAttendanceRecord[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  filters: HRFilterState;
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
  isLoading: boolean;
}

export const HRAttendanceUI = ({
  data,
  searchTerm,
  onSearchChange,
  onExport,
  filters,
  onFilterChange,
  onResetFilters,
  isLoading
}: HRAttendanceUIProps) => {
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isFilterActive = filters.status !== 'ALL' || filters.department !== 'ALL' || filters.shift !== 'ALL';
  const lateCount = data.filter(a => a.status === 'LATE').length;
  const presentCount = data.filter(a => a.status === 'PRESENT').length;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="p-12 max-w-[1600px] w-full mx-auto space-y-10">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-b border-white/5 pb-10">
        <div>
          
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
            HR <span className="text-indigo-600">Intelligence</span>
          </h1>
          <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase mt-2">{today}</p>
        </div>

        <div className="flex gap-4 items-center">
          {/* SEARCH BAR */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="SEARCH GLOBAL AGENT..."
              className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black tracking-widest outline-none focus:border-indigo-500/50 transition-all min-w-[280px] text-white uppercase"
            />
          </div>

          {/* FILTER SYSTEM */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                isFilterActive ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" /> Filter Registry
            </button>

            {showFilter && (
              <div className="absolute right-0 top-14 z-50 w-80 bg-[#0a0f1e] border border-white/10 rounded-[2rem] shadow-2xl p-6 space-y-6 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Filters</span>
                  {isFilterActive && (
                    <button onClick={onResetFilters} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Reset</button>
                  )}
                </div>

                {/* DEPT FILTER (HR SPECIFIC) */}
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Department</p>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-[10px] font-black text-white uppercase outline-none"
                    value={filters.department}
                    onChange={(e) => onFilterChange('department', e.target.value)}
                  >
                    <option value="ALL">All Departments</option>
                    <option value="IT">Information Technology</option>
                    <option value="HR">Human Resources</option>
                    <option value="OP">Operations</option>
                  </select>
                </div>

                {/* STATUS FILTER */}
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['ALL', 'PRESENT', 'LATE', 'ABSENT'].map((s) => (
                      <button
                        key={s}
                        onClick={() => onFilterChange('status', s)}
                        className={`py-3 rounded-xl text-[9px] font-black border ${filters.status === s ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/5 text-slate-400'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => setShowFilter(false)} className="w-full py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Close</button>
              </div>
            )}
          </div>

          <button onClick={onExport} className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
            <Download className="w-4 h-4" /> Export 
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Global Workforce', val: data.length, icon: UserCheck, color: 'text-indigo-400' },
          { label: 'Active Presence', val: presentCount, icon: Users, color: 'text-emerald-500' },
          { label: 'Late Exceptions', val: lateCount, icon: AlertTriangle, color: 'text-orange-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] flex items-center gap-5 backdrop-blur-3xl">
            <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
            <div>
              <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color} tracking-tighter`}>{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* GLOBAL ATTENDANCE TABLE */}
      <div className="bg-slate-900/20 border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-black border-b border-white/5 bg-white/[0.02]">
              <th className="px-10 py-6">Agent ID</th>
              <th className="px-10 py-6">Name</th>
              <th className="px-10 py-6">Department</th>
              <th className="px-10 py-6">Clock In</th>
              <th className="px-10 py-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
               <tr><td colSpan={5} className="px-10 py-20 text-center text-[10px] font-black text-indigo-500 animate-pulse tracking-[0.5em]">DECRYPTING REGISTRY...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={5} className="px-10 py-20 text-center text-[10px] font-black text-slate-600 tracking-widest uppercase">No global records found</td></tr>
            ) : (
              data.map((agent, index) => (
                <tr key={`${agent.id}-${index}`} className="hover:bg-white/5 transition-all group">
                  <td className="px-10 py-7 text-[10px] font-black text-slate-500 tracking-widest font-mono">{agent.id}</td>
                  <td className="px-10 py-7 font-black text-white text-xs uppercase group-hover:text-indigo-400 transition-colors">{agent.name}</td>
                  <td className="px-10 py-7 font-black text-slate-400 text-[10px] tracking-widest">{agent.dept}</td>
                  <td className="px-10 py-7 font-mono text-white text-sm">{agent.login}</td>
                  <td className="px-10 py-7 text-right">
                    <span className={`text-[10px] font-black tracking-widest uppercase ${agent.status === 'LATE' ? 'text-orange-400' : 'text-emerald-500'}`}>
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