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
  ChevronsRight 
} from 'lucide-react';

export interface LoginLog {
  id: number;
  user: string;
  role: string;
  ipAddress: string;
  device: string;
  timestamp: string;
  status: string;
}

interface Props {
  logs: LoginLog[];
}

export const LoginLogTable = ({ logs }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = logs.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase border-b border-white/5">
            <tr>
              <th className="px-10 py-6 text-indigo-500/50">TIMESTAMP</th>
              <th className="px-6 py-6 text-indigo-500/50">ACTOR IDENTIFIER</th>
              <th className="px-6 py-6 text-indigo-500/50">NETWORK IP</th>
              <th className="px-10 py-6 text-right text-indigo-500/50">SECURITY STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currentLogs.length > 0 ? (
              currentLogs.map((log) => {
                const isSuccess = log.status === 'SUCCESS';
                const isUnknown = log.user.startsWith('UNKNOWN');

                return (
                  <tr key={log.id} className="hover:bg-indigo-600/5 transition-colors group">
                    <td className="px-10 py-6 text-[10px] font-black text-slate-500 font-mono italic">
                      {log.timestamp}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        {isUnknown && <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />}
                        <div>
                          <p className={`text-xs font-black tracking-tight uppercase ${isUnknown ? 'text-red-400' : 'text-white'}`}>
                            {log.user}
                          </p>
                          <p className="text-[8px] font-bold text-slate-600 tracking-widest">
                            {log.role} 
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-indigo-400 font-mono text-[10px] font-black">
                        <Globe className="w-3 h-3" /> {log.ipAddress}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                          isSuccess ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'
                        }`}>
                          {isSuccess ? <ShieldCheck className="w-3 h-3 text-emerald-500" /> : <ShieldAlert className="w-3 h-3 text-red-500" />}
                          <span className={`text-[9px] font-black tracking-tighter ${isSuccess ? 'text-emerald-500' : 'text-red-500'}`}>
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

      {/* --- TERMINAL STYLE PAGINATION CONTROLS --- */}
      {logs.length > itemsPerPage && (
        <div className="flex items-center justify-between px-10 py-4 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
              Displaying Sector: <span className="text-indigo-400">{startIndex + 1}-{Math.min(endIndex, logs.length)}</span> of <span className="text-indigo-400">{logs.length}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-2 text-slate-500 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-slate-500 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1 px-4 items-center">
               <span className="text-[10px] font-black text-white bg-indigo-600 px-3 py-1 rounded-md shadow-lg shadow-indigo-600/20">
                 {currentPage}
               </span>
               <span className="text-[10px] font-black text-slate-600 px-2 py-1 italic">
                 / {totalPages}
               </span>
            </div>

            <button 
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-500 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-500 hover:text-white disabled:opacity-20 transition-all"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};