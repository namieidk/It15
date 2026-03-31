'use client';

import React, { useState } from 'react';
import {
  Globe,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

export interface LoginLog {
  id:        number;
  user:      string;      // backend maps EmployeeId → "user"
  role:      string | null;
  ipAddress: string | null;
  device:    string | null;
  timestamp: string;
  status:    string | null;
}

interface Props {
  logs: LoginLog[];
}

// ── Convert UTC timestamp string → Philippine Standard Time (UTC+8) ─────────
function toPHT(utcString: string): string {
  if (!utcString) return '—';
  try {
    const date = new Date(utcString.replace(' ', 'T') + 'Z');
    return date.toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      year:     'numeric',
      month:    '2-digit',
      day:      '2-digit',
      hour:     '2-digit',
      minute:   '2-digit',
      second:   '2-digit',
      hour12:   false,
    }).replace(',', '');
  } catch {
    return utcString;
  }
}

export const LoginLogTable = ({ logs }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages  = Math.max(1, Math.ceil(logs.length / itemsPerPage));
  const startIndex  = (currentPage - 1) * itemsPerPage;
  const currentLogs = logs.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (p: number) =>
    setCurrentPage(Math.max(1, Math.min(p, totalPages)));

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase border-b border-white/5">
            <tr>
              <th className="px-10 py-6 text-indigo-500/50">TIMESTAMP (PHT)</th>
              <th className="px-6  py-6 text-indigo-500/50">ACTOR IDENTIFIER</th>
              <th className="px-6  py-6 text-indigo-500/50">NETWORK IP</th>
              <th className="px-10 py-6 text-right text-indigo-500/50">SECURITY STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currentLogs.length > 0 ? (
              currentLogs.map((log) => {
                // Safe null coalescing — prevents startsWith crash when fields are null/undefined
                const userName   = log.user      ?? 'UNKNOWN';
                const userRole   = log.role      ?? '—';
                const userIp     = log.ipAddress ?? '—';
                const userStatus = log.status    ?? '—';

                const isSuccess = userStatus.toUpperCase() === 'SUCCESS';
                // Safe: userName is guaranteed a string by this point
                const isUnknown = userName.toUpperCase().startsWith('UNKNOWN');

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-indigo-600/5 transition-colors group"
                  >
                    {/* Timestamp */}
                    <td className="px-10 py-6 text-[10px] font-black text-slate-500 font-mono italic whitespace-nowrap">
                      {toPHT(log.timestamp)}
                    </td>

                    {/* Actor */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        {isUnknown && (
                          <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />
                        )}
                        <div>
                          <p className={`text-xs font-black tracking-tight uppercase ${
                            isUnknown ? 'text-red-400' : 'text-white'
                          }`}>
                            {userName}
                          </p>
                          <p className="text-[8px] font-bold text-slate-600 tracking-widest">
                            {userRole}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* IP */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-indigo-400 font-mono text-[10px] font-black">
                        <Globe className="w-3 h-3" /> {userIp}
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                          isSuccess
                            ? 'border-emerald-500/20 bg-emerald-500/5'
                            : 'border-red-500/20 bg-red-500/5'
                        }`}>
                          {isSuccess
                            ? <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            : <ShieldAlert className="w-3 h-3 text-red-500"     />}
                          <span className={`text-[9px] font-black tracking-tighter ${
                            isSuccess ? 'text-emerald-500' : 'text-red-500'
                          }`}>
                            {isSuccess ? 'VALIDATED' : 'BREACH_ATTEMPT'}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-20 text-center text-[10px] font-black text-slate-600 tracking-widest">
                  SIGNAL LOST: NO AUDIT DATA FOUND
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── PAGINATION ── */}
      {logs.length > itemsPerPage && (
        <div className="flex items-center justify-between px-10 py-4 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
          <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
            Displaying Sector:{' '}
            <span className="text-indigo-400">{startIndex + 1}–{Math.min(startIndex + itemsPerPage, logs.length)}</span>
            {' '}of{' '}
            <span className="text-indigo-400">{logs.length}</span>
          </span>

          <div className="flex items-center gap-2">
            <button onClick={() => goToPage(1)}               disabled={currentPage === 1}          className="p-2 text-slate-500 hover:text-white disabled:opacity-20 transition-all"><ChevronsLeft  className="w-4 h-4" /></button>
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}          className="p-2 text-slate-500 hover:text-white disabled:opacity-20 transition-all"><ChevronLeft   className="w-4 h-4" /></button>
            <div className="flex gap-1 px-4 items-center">
              <span className="text-[10px] font-black text-white bg-indigo-600 px-3 py-1 rounded-md shadow-lg shadow-indigo-600/20">{currentPage}</span>
              <span className="text-[10px] font-black text-slate-600 px-2 py-1 italic">/ {totalPages}</span>
            </div>
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 text-slate-500 hover:text-white disabled:opacity-20 transition-all"><ChevronRight  className="w-4 h-4" /></button>
            <button onClick={() => goToPage(totalPages)}      disabled={currentPage === totalPages} className="p-2 text-slate-500 hover:text-white disabled:opacity-20 transition-all"><ChevronsRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
};