'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminSidebar } from '../../../components/(Admin)/Sidebar';
import { ActivityLogTable, ActivityLog } from '../../../components/(Admin)/(Auditlogs)/ActivityLogTable';
import { LoginLogTable, LoginLog } from '../../../components/(Admin)/(Auditlogs)/LoginLogTable';
import {
  History, Loader2, Database, Cpu, ShieldAlert,
  RefreshCw, Filter,
} from 'lucide-react';

const MODULES = ['ALL', 'LEAVE', 'REPORTS', 'EVALUATIONS', 'PAYROLL', 'ATTENDANCE', 'ACCOUNTS'];

const MODULE_COLORS: Record<string, string> = {
  ALL:         'bg-indigo-600 text-white border-indigo-600',
  LEAVE:       'bg-sky-500/10 text-sky-400 border-sky-500/30',
  REPORTS:     'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  EVALUATIONS: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  PAYROLL:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  ATTENDANCE:  'bg-amber-500/10 text-amber-400 border-amber-500/30',
  ACCOUNTS:    'bg-red-500/10 text-red-400 border-red-500/30',
};

const PAGE_LIMIT = 50;

async function apiFetch(url: string): Promise<Response> {
  return fetch(url, { credentials: 'include' });
}

export default function AuditLogsPage() {
  const [mode, setMode]                 = useState<'activities' | 'logins'>('activities');
  // ── Fixed: explicit generic types prevent TypeScript from inferring never[] ─
  const [loginLogs, setLoginLogs]       = useState<LoginLog[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [total, setTotal]               = useState<number>(0);
  const [page, setPage]                 = useState<number>(1);
  const [loading, setLoading]           = useState<boolean>(false);
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');
  const [lastRefresh, setLastRefresh]   = useState<Date | null>(null);

  const fetchActivityLogs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const modParam = moduleFilter === 'ALL' ? '' : `&module=${moduleFilter}`;
      const res = await apiFetch(
        `http://localhost:5076/api/Admin/activity-logs?page=${page}&limit=${PAGE_LIMIT}${modParam}`
      );

      if (res.ok) {
        const data = await res.json();
        setActivityLogs(data.logs  ?? []);
        setTotal(data.total ?? 0);
        setLastRefresh(new Date());
      } else if (res.status === 401 || res.status === 403) {
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Activity log fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, moduleFilter]);

  const fetchLoginLogs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await apiFetch('http://localhost:5076/api/Admin/login-logs');

      if (res.ok) {
        const data = await res.json();
        setLoginLogs(Array.isArray(data) ? data : []);
        setLastRefresh(new Date());
      } else if (res.status === 401 || res.status === 403) {
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Login log fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode === 'activities') fetchActivityLogs(false);
    else                       fetchLoginLogs(false);
  }, [mode, page, moduleFilter]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (mode === 'activities') fetchActivityLogs(true);
      else                       fetchLoginLogs(true);
    }, 15_000);
    return () => clearInterval(interval);
  }, [mode, fetchActivityLogs, fetchLoginLogs]);

  const handleModuleChange = (mod: string) => {
    setModuleFilter(mod);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase relative">
      <AdminSidebar />

      <section className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">

        {/* ── HEADER ── */}
        <header className="px-12 py-10 border-b border-white/5 flex justify-between items-end backdrop-blur-md bg-[#020617]/80 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
              <History className="w-4 h-4" strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Audit Trail Protocol</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              System <span className="text-indigo-600">Logs</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => mode === 'activities' ? fetchActivityLogs(false) : fetchLoginLogs(false)}
              className="p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all group"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </button>

            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 gap-2">
              <button
                onClick={() => { setMode('activities'); setPage(1); }}
                className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                  mode === 'activities'
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                ACTIVITIES
              </button>
              <button
                onClick={() => { setMode('logins'); setPage(1); }}
                className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                  mode === 'logins'
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                LOGINS
              </button>
            </div>
          </div>
        </header>

        {/* ── MODULE FILTER (activities only) ── */}
        {mode === 'activities' && (
          <div className="px-12 py-5 border-b border-white/5 flex items-center gap-3 shrink-0 overflow-x-auto">
            <Filter className="w-3 h-3 text-slate-600 shrink-0" />
            {MODULES.map((mod) => (
              <button
                key={mod}
                onClick={() => handleModuleChange(mod)}
                className={`px-4 py-1.5 rounded-full text-[8px] font-black tracking-widest border transition-all shrink-0 ${
                  moduleFilter === mod
                    ? MODULE_COLORS[mod]
                    : 'text-slate-600 border-white/5 bg-white/5 hover:text-slate-300'
                }`}
              >
                {mod}
              </button>
            ))}
            {total > 0 && (
              <span className="ml-auto text-[8px] font-black text-slate-600 tracking-widest shrink-0">
                {total} RECORD{total !== 1 ? 'S' : ''}
              </span>
            )}
          </div>
        )}

        {/* ── LOG CONTENT ── */}
        <div className="flex-1 overflow-y-auto p-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-indigo-500">
              <Loader2 className="w-10 h-10 animate-spin" />
              <span className="text-[10px] font-black tracking-[0.5em]">Syncing Records...</span>
            </div>
          ) : mode === 'activities' ? (
            <ActivityLogTable
              logs={activityLogs}
              page={page}
              totalPages={totalPages}
              total={total}
              onPrev={() => setPage(p => Math.max(1, p - 1))}
              onNext={() => setPage(p => Math.min(totalPages, p + 1))}
            />
          ) : (
            <LoginLogTable logs={loginLogs} />
          )}
        </div>

        {/* ── FOOTER ── */}
        <footer className="px-12 py-5 border-t border-white/5 bg-[#020617] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
            <p className="text-[8px] font-black text-slate-600 tracking-[0.4em]">LOG RECORDS ARE IMMUTABLE</p>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <Database className="w-3 h-3 text-indigo-500" />
              <span className="text-[8px] font-black text-slate-500 tracking-widest">VAULT: ACTIVE</span>
            </div>
            <span className="text-[8px] font-black text-slate-700 tracking-widest not-italic">
              {lastRefresh
                ? `LAST SYNC: ${lastRefresh.toLocaleTimeString('en-PH', {
                    timeZone: 'Asia/Manila',
                    hour:     '2-digit',
                    minute:   '2-digit',
                    second:   '2-digit',
                  })} PHT`
                : 'LAST SYNC: —'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-indigo-600">
            <Cpu className="w-3 h-3" />
            <span className="text-[8px] font-black tracking-widest">INTEGRITY: NOMINAL</span>
            <ShieldAlert className="w-4 h-4 animate-pulse" />
          </div>
        </footer>
      </section>
    </main>
  );
}