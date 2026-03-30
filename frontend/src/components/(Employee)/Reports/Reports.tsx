'use client';

import React from 'react';
import { Sidebar } from '../../(Employee)/Dashboard/Sidebar';
import {
  BarChart3, FileText, Download, Loader2,
  TrendingUp, ShieldCheck, Clock,
  LucideIcon
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Report, UserProfile } from '../../../app/(Employee)/Reports/page';

// ─── PROPS ────────────────────────────────────────────────────────────────────

interface ReportsViewProps {
  user:             UserProfile | null;
  reports:          Report[];
  filteredReports:  Report[];
  isLoading:        boolean;
  filterType:       string;
  setFilterType:    (type: string) => void;
  allTypes:         string[];
  activeChart:      'bar' | 'line';
  setActiveChart:   (type: 'bar' | 'line') => void;
  onDownload:       (report: Report) => Promise<void>;  // ← wired from page.tsx
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ title, value, Icon, trend }: {
  title: string; value: string; Icon: LucideIcon; trend: string;
}) {
  return (
    <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] hover:bg-slate-900/60 transition-all border-b-4 border-b-transparent hover:border-b-indigo-500">
      <Icon className="text-indigo-500 mb-4" size={20} />
      <p className="text-[9px] text-slate-500 tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl text-white tracking-tighter">{value}</span>
        <span className="text-[7px] text-slate-600">{trend}</span>
      </div>
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const cls =
    s === 'APPROVED' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-500/10' :
    s === 'PENDING'  ? 'text-amber-400  border-amber-400/20  bg-amber-500/10'  :
                       'text-red-400    border-red-400/20    bg-red-500/10';
  return (
    <span className={`px-3 py-1 rounded-full text-[7px] font-black tracking-widest border uppercase ${cls}`}>
      {status}
    </span>
  );
}

// ─── MAIN VIEW ────────────────────────────────────────────────────────────────

export default function ReportsView({
  user, reports, filteredReports, isLoading,
  filterType, setFilterType, allTypes,
  activeChart, setActiveChart, onDownload,
}: ReportsViewProps) {

  if (isLoading) return (
    <div className="h-screen w-full bg-[#020617] flex flex-col items-center justify-center italic font-black text-indigo-500 tracking-[0.4em]">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      SYNCING...
    </div>
  );

  const barData = ['EVALUATION', 'ATTENDANCE', 'KPI', 'HR', 'PAYROLL'].map(t => ({
    name:  t,
    count: reports.filter(r => r.type?.toUpperCase().includes(t)).length,
  }));

  const lineData = Object.entries(
    reports.reduce((acc: Record<string, number>, r) => {
      const date = new Date(r.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {})
  ).map(([month, count]) => ({ month, count }));

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase italic font-black">
      <Toaster position="top-right" richColors theme="dark" />
      <Sidebar />

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] scrollbar-hide">

        {/* ── HEADER ── */}
        <header className="px-12 py-10 border-b border-white/5 flex justify-between items-end backdrop-blur-xl sticky top-0 z-20 bg-[#020617]/80">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
              <BarChart3 className="w-4 h-4" />
              <span className="text-[10px] tracking-[0.4em]">{user?.department || 'SYSTEM'} UNIT</span>
            </div>
            <h1 className="text-4xl text-white tracking-tighter uppercase leading-none">
              Performance <span className="text-indigo-600">Analytics</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[8px] text-slate-500 tracking-widest mb-1">Authenticated Account</p>
            <p className="text-[10px] text-indigo-400 tracking-widest uppercase">
              {user?.fullName} | {user?.position}
            </p>
          </div>
        </header>

        <div className="p-12 max-w-[1600px] w-full mx-auto space-y-10">

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard title="Total Reports" value={reports.length.toString()}                                                                Icon={FileText}    trend="total"    />
            <StatCard title="Approved"      value={reports.filter(r => r.status?.toUpperCase() === 'APPROVED').length.toString()}            Icon={ShieldCheck} trend="verified" />
            <StatCard title="Pending"       value={reports.filter(r => r.status?.toUpperCase() === 'PENDING').length.toString()}             Icon={Clock}       trend="queue"    />
            <StatCard title="Viewed"        value={filteredReports.length.toString()}                                                        Icon={TrendingUp}  trend="active"   />
          </div>

          {/* ── CHARTS ── */}
          <div className="bg-slate-900/20 border border-white/5 rounded-[3.5rem] p-8 backdrop-blur-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-8 px-4">
              <h3 className="text-xs tracking-[0.3em]">Data Visualization</h3>
              <div className="flex gap-2">
                {(['bar', 'line'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveChart(t)}
                    className={`px-4 py-2 rounded-xl text-[8px] font-black tracking-widest transition-all ${
                      activeChart === t ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500 hover:text-white'
                    }`}
                  >
                    {t === 'bar' ? 'BAR' : 'LINE'}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72">
              {reports.length === 0 ? (
                <div className="h-full flex items-center justify-center opacity-30">
                  <p className="text-[10px] tracking-widest">No data to chart yet.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {activeChart === 'bar' ? (
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                      <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                      <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                      <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#818cf8' }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ── REPORTS TABLE ── */}
          <div className="bg-slate-900/20 border border-white/5 rounded-[3.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="px-10 py-7 border-b border-white/5 flex flex-wrap justify-between items-center gap-4 bg-white/[0.02]">
              <h3 className="text-xs tracking-[0.4em] text-white">Document Logs</h3>
              <div className="flex flex-wrap gap-2">
                {allTypes.map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-4 py-2 rounded-xl text-[8px] font-black tracking-widest border transition-all ${
                      filterType === t
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-white/10 text-slate-500 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {filteredReports.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[9px] tracking-[0.25em] text-slate-500 border-b border-white/5 uppercase font-black not-italic">
                    <th className="px-10 py-5">Report No.</th>
                    <th className="px-10 py-5">Name</th>
                    <th className="px-10 py-5">Type</th>
                    <th className="px-10 py-5">Status</th>
                    <th className="px-10 py-5">Date</th>
                    <th className="px-10 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-white/[0.03] transition-all group">
                      <td className="px-10 py-6 text-[9px] text-slate-500 font-mono tracking-widest not-italic">
                        {report.reportNumber}
                      </td>
                      <td className="px-10 py-6 text-xs text-white font-black uppercase max-w-[220px] truncate">
                        {report.name}
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-[9px] font-black tracking-[0.3em] uppercase text-indigo-400">
                          {report.type}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="px-10 py-6 text-[9px] text-slate-500 tracking-widest not-italic font-bold">
                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: '2-digit', year: 'numeric',
                        })}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button
                          onClick={() => {
                            toast.promise(onDownload(report), {
                              loading: 'PREPARING PDF...',
                              success: 'DOWNLOAD INITIATED',
                              error:   'DOWNLOAD FAILED',
                            });
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-xl text-[8px] font-black tracking-widest transition-all"
                        >
                          <Download size={13} /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center flex flex-col items-center gap-4 opacity-40">
                <FileText className="w-10 h-10 text-indigo-500" />
                <p className="text-[10px] tracking-[0.4em]">No entries found for this filter.</p>
              </div>
            )}
          </div>

          <div className="h-10" />
        </div>
      </section>
    </main>
  );
}