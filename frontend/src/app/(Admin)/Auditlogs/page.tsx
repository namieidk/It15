'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../../components/(Admin)/Sidebar';
import { ActivityLogTable } from '../../../components/(Admin)/(Auditlogs)/ActivityLogTable';
import { LoginLogTable } from '../../../components/(Admin)/(Auditlogs)/LoginLogTable';
import { History, Search, Filter, Calendar, UserRound, Loader2, Database, Cpu, ShieldAlert, RefreshCw } from 'lucide-react';

export default function AuditLogsPage() {
  const [mode, setMode] = useState<'activities' | 'logins'>('activities');
  const [loginLogs, setLoginLogs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]); 
  const [loading, setLoading] = useState(false);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = mode === 'logins' ? 'login-logs' : 'activity-logs';
      const response = await fetch(`http://localhost:5076/api/admin/${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        mode === 'logins' ? setLoginLogs(data) : setActivityLogs(data);
      }
    } catch (error) {
      console.error("Link Failure:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mode]);

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase relative">
      <AdminSidebar />
      
      <section className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
        
        {/* HEADER SECTION */}
        <header className="px-12 py-10 border-b border-white/5 flex justify-between items-end backdrop-blur-md bg-[#020617]/80">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
                <History className="w-4 h-4" strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Audit Trail Protocol</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">System <span className="text-indigo-600">Logs</span></h1>
          </div>

          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 gap-2">
            <button onClick={() => setMode('activities')} className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${mode === 'activities' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>ACTIVITIES</button>
            <button onClick={() => setMode('logins')} className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${mode === 'logins' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>LOGINS</button>
          </div>
        </header>

        {/* LOG CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-indigo-500">
                <Loader2 className="w-10 h-10 animate-spin" />
                <span className="text-[10px] font-black tracking-[0.5em]">Syncing Records...</span>
              </div>
            ) : (
              mode === 'activities' ? <ActivityLogTable logs={activityLogs} /> : <LoginLogTable logs={loginLogs} />
            )}
        </div>

        {/* SYSTEM STATUS FOOTER */}
        <footer className="px-12 py-6 border-t border-white/5 bg-[#020617] flex justify-between items-center">
            <div className="flex items-center gap-6">
              <p className="text-[8px] font-black text-slate-600 tracking-[0.4em]">LOG RECORDS ARE IMMUTABLE</p>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                <Database className="w-3 h-3 text-indigo-500" />
                <span className="text-[8px] font-black text-slate-500 tracking-widest">VAULT: ACTIVE</span>
              </div>
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