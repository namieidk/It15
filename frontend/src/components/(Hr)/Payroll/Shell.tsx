'use client';

import React from 'react';
import { Toaster } from 'sonner';
import { HRSidebar } from '../Dashboard/sidebar';
import { Shield, ShieldCheck, CalendarDays, FileText } from 'lucide-react';
import { ViewType } from './Type';

// ─── Shell ────────────────────────────────────────────────────────────────────

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <Toaster richColors position="top-right" theme="dark" />
      <HRSidebar />
      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
        {children}
      </section>
    </main>
  );
}

// ─── NavTabs ──────────────────────────────────────────────────────────────────

interface NavTabsProps {
  view: ViewType;
  onNavigate: (view: ViewType) => void;
}

const TABS = [
  { key: 'dashboard' as ViewType, label: 'Roster',      icon: <Shield      className="w-3 h-3" /> },
  { key: 'periods'   as ViewType, label: 'Pay Periods',  icon: <CalendarDays className="w-3 h-3" /> },
  { key: 'payslips'  as ViewType, label: 'Payslips',     icon: <FileText    className="w-3 h-3" /> },
] as const;

export function NavTabs({ view, onNavigate }: NavTabsProps) {
  return (
    <div className="flex gap-1 px-12 border-b border-white/5 bg-[#020617]/60 backdrop-blur-md sticky top-[89px] z-10">
      {TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => onNavigate(tab.key)}
          className={`flex items-center gap-2 px-6 py-4 text-[9px] font-black tracking-widest border-b-2 transition-all uppercase ${
            view === tab.key
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-600 hover:text-slate-400'
          }`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );
}