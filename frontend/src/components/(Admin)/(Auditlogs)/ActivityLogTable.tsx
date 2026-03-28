'use client';

import React from 'react';
import { Download, PlusCircle, UserMinus, ShieldCheck } from 'lucide-react';

export interface ActivityLog {
  id: string;
  user: string;
  role: string;
  dept: string;
  action: string;
  target: string;
  timestamp: string;
}

// --- DUMMY DATA FOR PROTOCOL TESTING ---
const DUMMY_LOGS: ActivityLog[] = [
  {
    id: 'ACT-901',
    user: 'SYSTEM_ADMIN_ALPHA',
    role: 'SUPER_ADMIN',
    dept: 'CENTRAL_KERNEL',
    action: 'PROVISIONED_NEW_ACCESS',
    target: 'EMP_090607',
    timestamp: '2026-03-29 02:40:11'
  },
  {
    id: 'ACT-902',
    user: 'HR_MANAGER_01',
    role: 'ADMIN',
    dept: 'HUMAN_RESOURCES',
    action: 'REVOKED_IDENTITY_KEY',
    target: 'EMP_041122',
    timestamp: '2026-03-29 01:15:45'
  },
  {
    id: 'ACT-903',
    user: 'SYSTEM_ADMIN_ALPHA',
    role: 'SUPER_ADMIN',
    dept: 'CENTRAL_KERNEL',
    action: 'DOWNLOADED_AUDIT_EXPORT',
    target: 'LOG_ARCHIVE_Q1',
    timestamp: '2026-03-28 23:55:00'
  },
  {
    id: 'ACT-904',
    user: 'DEPT_LEAD_BETA',
    role: 'ADMIN',
    dept: 'ENGINEERING',
    action: 'PROVISIONED_NEW_ACCESS',
    target: 'EMP_882910',
    timestamp: '2026-03-28 21:30:12'
  }
];

interface Props {
  logs?: ActivityLog[]; // Made optional so it can fall back to dummy data
}

export const ActivityLogTable = ({ logs = [] }: Props) => {
  // Use provided logs if they exist, otherwise use dummy data
  const displayLogs = logs.length > 0 ? logs : DUMMY_LOGS;

  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/5 text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase border-b border-white/5">
          <tr>
            <th className="px-10 py-6 text-indigo-500/50">TIMESTAMP</th>
            <th className="px-6 py-6 text-indigo-500/50">ACTOR</th>
            <th className="px-6 py-6 text-indigo-500/50">ACTION TYPE</th>
            <th className="px-10 py-6 text-right text-indigo-500/50">TARGET OBJECT</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {displayLogs.map((log) => {
            const isCritical = log.action.includes('REVOKE') || log.action.includes('DOWNLOAD');
            
            return (
              <tr key={log.id} className="hover:bg-indigo-600/5 transition-colors group">
                <td className="px-10 py-6 text-[10px] font-black text-slate-500 font-mono italic">
                  {log.timestamp}
                </td>
                <td className="px-6 py-6">
                  <p className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight uppercase">
                    {log.user}
                  </p>
                  <p className="text-[8px] font-bold text-slate-600 tracking-widest uppercase">
                    {log.role}  {log.dept}
                  </p>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    {isCritical ? (
                      <Download className="w-3 h-3 text-red-400" />
                    ) : (
                      <PlusCircle className="w-3 h-3 text-emerald-500" />
                    )}
                    <span className={`text-[10px] font-black transition-colors uppercase ${
                      isCritical ? 'text-red-400/70 group-hover:text-red-400' : 'text-slate-300 group-hover:text-slate-100'
                    }`}>
                      {log.action}
                    </span>
                  </div>
                </td>
                <td className="px-10 py-6 text-right">
                  <span className="text-[10px] font-black text-white bg-indigo-500/5 px-3 py-1 rounded-lg border border-indigo-500/10 group-hover:border-indigo-500/30 transition-all shadow-inner uppercase">
                    {log.target}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};