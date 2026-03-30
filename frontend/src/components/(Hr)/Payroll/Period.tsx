'use client';

import React, { useState, useMemo } from 'react';
import { CalendarDays, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { PayPeriod, PpForm, ViewType } from './Type';
import { fmtD } from './Utils';
import { NavTabs } from './Shell';

// ─── Pay Period Form ──────────────────────────────────────────────────────────

interface PeriodFormProps {
  form: PpForm;
  onChange: (key: keyof PpForm, value: string) => void;
  onSave: () => void;
}

const FORM_FIELDS: { key: keyof PpForm; label: string; type: string; placeholder: string }[] = [
  { key: 'label',       label: 'Period Label', type: 'text', placeholder: 'e.g. June 2026 - 1st Cut' },
  { key: 'periodStart', label: 'Period Start',  type: 'date', placeholder: '' },
  { key: 'periodEnd',   label: 'Period End',    type: 'date', placeholder: '' },
  { key: 'cutoffDate',  label: 'Cutoff Date',   type: 'date', placeholder: '' },
  { key: 'payDate',     label: 'Pay Date',      type: 'date', placeholder: '' },
];

function PeriodForm({ form, onChange, onSave }: PeriodFormProps) {
  return (
    <div className="bg-slate-900/40 border border-indigo-500/10 rounded-[3rem] p-10 space-y-8">
      <h3 className="text-[10px] font-black text-indigo-500 tracking-[0.4em] flex items-center gap-2 uppercase">
        <CalendarDays className="w-4 h-4" /> Schedule New Pay Period
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {FORM_FIELDS.map(f => (
          <div key={f.key} className="space-y-2">
            <label className="text-[8px] font-black text-slate-500 tracking-widest ml-2 uppercase">
              {f.label}
            </label>
            <input
              type={f.type}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={e => onChange(f.key, e.target.value)}
              className="w-full bg-[#020617] border border-white/10 rounded-2xl p-4 text-[10px] font-black text-white outline-none focus:border-indigo-500 transition-all uppercase"
            />
          </div>
        ))}

        <div className="flex items-end lg:col-span-1">
          <button
            onClick={onSave}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[9px] font-black tracking-widest uppercase transition-all shadow-lg shadow-indigo-600/20 text-white"
          >
            <Save className="w-3 h-3" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pay Periods Table ────────────────────────────────────────────────────────

interface PeriodsTableProps {
  payPeriods: PayPeriod[];
}

function PeriodsTable({ payPeriods }: PeriodsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Lower count because the form above is large

  // Pagination Calculations
  const totalPages = Math.ceil(payPeriods.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visiblePeriods = useMemo(() => 
    payPeriods.slice(startIndex, startIndex + itemsPerPage),
    [payPeriods, startIndex]
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5 text-[10px] font-black text-slate-500 tracking-[0.3em]">
              <th className="px-10 py-6">LABEL</th>
              <th className="px-6 py-6">PERIOD RANGE</th>
              <th className="px-6 py-6">CUTOFF</th>
              <th className="px-6 py-6 text-emerald-500">EST. PAY DATE</th>
              <th className="px-6 py-6 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payPeriods.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-16 text-center text-[10px] font-black text-slate-700 tracking-widest uppercase italic">
                  No Pay Periods Scheduled
                </td>
              </tr>
            ) : (
              visiblePeriods.map(p => (
                <tr key={p.id} className="hover:bg-indigo-600/5 transition-colors group">
                  <td className="px-10 py-6">
                    <p className="text-xs font-black text-white italic uppercase tracking-tighter">{p.label}</p>
                    <p className="text-[7px] text-slate-600 font-bold tracking-widest mt-0.5 uppercase">System ID: {p.id}</p>
                  </td>
                  <td className="px-6 py-6 text-[10px] font-black text-slate-400">
                    {fmtD(p.periodStart)} – {fmtD(p.periodEnd)}
                  </td>
                  <td className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{fmtD(p.cutoffDate)}</td>
                  <td className="px-6 py-6 text-[10px] font-black text-emerald-400 uppercase tracking-widest">{fmtD(p.payDate)}</td>
                  <td className="px-6 py-6 text-right">
                    <span className={`px-4 py-1.5 rounded-lg text-[8px] font-black tracking-widest border transition-all ${
                      p.status === 'PROCESSED'
                        ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5'
                        : 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      {payPeriods.length > itemsPerPage && (
        <div className="flex items-center justify-between px-10">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Schedule Page <span className="text-white">{currentPage}</span> of {totalPages}
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-10 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all border ${
                    currentPage === i + 1 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white disabled:opacity-10 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Pay Periods View ─────────────────────────────────────────────────────────

interface PeriodsViewProps {
  view: ViewType;
  onNavigate: (view: ViewType) => void;
  payPeriods: PayPeriod[];
  form: PpForm;
  onFormChange: (key: keyof PpForm, value: string) => void;
  onSave: () => void;
}

export function PeriodsView({
  view,
  onNavigate,
  payPeriods,
  form,
  onFormChange,
  onSave,
}: PeriodsViewProps) {
  return (
    <div className="min-h-screen bg-[#020617]">
      <header className="px-12 py-10 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80">
        <div className="flex items-center gap-2 text-indigo-500 mb-2 font-black uppercase tracking-[0.4em] text-[10px]">
          <CalendarDays className="w-4 h-4" /> Schedule Management
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter text-white">
          Pay <span className="text-indigo-600">Periods</span>
        </h1>
      </header>

      <NavTabs view={view} onNavigate={onNavigate} />

      <div className="p-12 max-w-[1500px] w-full mx-auto space-y-10">
        <PeriodForm form={form} onChange={onFormChange} onSave={onSave} />
        <PeriodsTable payPeriods={payPeriods} />
      </div>
    </div>
  );
}