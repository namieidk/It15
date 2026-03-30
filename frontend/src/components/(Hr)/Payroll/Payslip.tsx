'use client';

import React from 'react';
import { ArrowLeft, FileText, Search, ChevronRight } from 'lucide-react';
import { Payslip, ViewType } from './Type';
import { fmt, fmtD } from './Utils';
import { NavTabs } from './Shell';

// ─── Payslip Row ──────────────────────────────────────────────────────────────

interface PayslipRowProps {
  slip: Payslip;
  onView: (slip: Payslip) => void;
}

function PayslipRow({ slip, onView }: PayslipRowProps) {
  return (
    <tr className="hover:bg-indigo-600/5 transition-colors group">
      <td className="px-10 py-6">
        <p className="text-xs font-black italic text-white">{slip.employeeName ?? slip.employeeId}</p>
        <p className="text-[8px] text-slate-500 font-bold mt-0.5 tracking-widest uppercase">
          {slip.department} · {slip.role}
        </p>
      </td>
      <td className="px-6 py-6 text-[10px] font-black text-slate-400">
        {fmtD(slip.periodStart)} – {fmtD(slip.periodEnd)}
      </td>
      <td className="px-6 py-6 text-[10px] font-black text-slate-400">{fmtD(slip.payDate)}</td>
      <td className="px-6 py-6 text-xs font-black italic text-indigo-400">{fmt(slip.grossPay)}</td>
      <td className="px-6 py-6 text-xs font-black italic text-orange-500">{fmt(slip.totalDeductions)}</td>
      <td className="px-6 py-6 text-xs font-black italic text-emerald-400">{fmt(slip.netPay)}</td>
      <td className="px-6 py-6 text-right">
        <span className={`px-3 py-1 rounded-lg text-[8px] font-black tracking-widest border ${
          slip.status === 'PROCESSED'
            ? 'border-emerald-500/20 text-emerald-500'
            : 'border-orange-500/20 text-orange-500'
        }`}>
          {slip.status}
        </span>
      </td>
      <td className="px-6 py-6">
        <button
          onClick={() => onView(slip)}
          className="flex items-center gap-1 text-[9px] font-black text-indigo-500 hover:text-indigo-400 tracking-widest uppercase transition-colors"
        >
          View <ChevronRight className="w-3 h-3" />
        </button>
      </td>
    </tr>
  );
}

// ─── Payslips List View ───────────────────────────────────────────────────────

interface PayslipsViewProps {
  view: ViewType;
  onNavigate: (view: ViewType) => void;
  payslips: Payslip[];
  slipFilter: string;
  onFilterChange: (val: string) => void;
  onViewSlip: (slip: Payslip) => void;
}

export function PayslipsView({
  view,
  onNavigate,
  payslips,
  slipFilter,
  onFilterChange,
  onViewSlip,
}: PayslipsViewProps) {
  const filtered = payslips.filter(s =>
    !slipFilter ||
    s.employeeId.toLowerCase().includes(slipFilter.toLowerCase()) ||
    (s.employeeName ?? '').toLowerCase().includes(slipFilter.toLowerCase())
  );

  return (
    <>
      <header className="px-12 py-10 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 mb-2 font-black uppercase tracking-[0.4em] text-[10px]">
            <FileText className="w-4 h-4" /> Records Vault
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter">
            Pay <span className="text-indigo-600">Slips</span>
          </h1>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-600" />
          <input
            value={slipFilter}
            onChange={e => onFilterChange(e.target.value)}
            placeholder="Filter by ID or name..."
            className="bg-white/5 border border-white/10 rounded-2xl pl-10 pr-6 py-3 text-[10px] font-black text-white outline-none focus:border-indigo-500 uppercase w-72"
          />
        </div>
      </header>

      <NavTabs view={view} onNavigate={onNavigate} />

      <div className="p-12 max-w-[1600px] w-full mx-auto">
        <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[10px] font-black text-slate-500 tracking-[0.3em]">
                <th className="px-10 py-6">EMPLOYEE</th>
                <th className="px-6 py-6">PERIOD</th>
                <th className="px-6 py-6">PAY DATE</th>
                <th className="px-6 py-6 text-indigo-400">GROSS</th>
                <th className="px-6 py-6 text-orange-500">DEDUCTIONS</th>
                <th className="px-6 py-6 text-emerald-500">NET PAY</th>
                <th className="px-6 py-6 text-right">STATUS</th>
                <th className="px-6 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(slip => (
                <PayslipRow key={slip.id} slip={slip} onView={onViewSlip} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-20 text-center text-[10px] font-black text-slate-700 tracking-widest uppercase italic">
                    No Payslips Generated Yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ─── Payslip Detail View ──────────────────────────────────────────────────────

interface PayslipDetailViewProps {
  slip: Payslip;
  onBack: () => void;
}

export function PayslipDetailView({ slip, onBack }: PayslipDetailViewProps) {
  return (
    <>
      {/* HEADER */}
      <header className="px-12 py-8 border-b border-white/5 backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80 flex items-center gap-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-500 font-black text-[10px] tracking-widest hover:text-indigo-400 uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div>
          <p className="text-[9px] font-black text-slate-500 tracking-widest uppercase">Payslip #{slip.id}</p>
          <h2 className="text-xl font-black italic tracking-tighter">{slip.employeeName ?? slip.employeeId}</h2>
        </div>
      </header>

      <div className="p-12 max-w-3xl mx-auto w-full space-y-8">
        {/* META CARDS */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Period',   value: `${fmtD(slip.periodStart)} – ${fmtD(slip.periodEnd)}` },
            { label: 'Pay Date', value: fmtD(slip.payDate) },
            { label: 'Status',   value: slip.status },
          ].map(item => (
            <div key={item.label} className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
              <p className="text-[8px] font-black text-slate-500 tracking-widest uppercase mb-1">{item.label}</p>
              <p className="text-xs font-black text-white">{item.value}</p>
            </div>
          ))}
        </div>

        {/* EARNINGS */}
        <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden">
          <div className="px-8 py-5 bg-white/5 border-b border-white/5">
            <p className="text-[9px] font-black text-indigo-400 tracking-[0.3em] uppercase">Earnings</p>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { label: 'Basic Salary', value: slip.basicSalary, color: 'text-white' },
              { label: 'Overtime Pay', value: slip.overtime,    color: 'text-indigo-400' },
              { label: 'Night Diff',   value: slip.nightDiff,   color: 'text-indigo-400' },
              { label: 'Allowances',   value: slip.allowances,  color: 'text-indigo-400' },
            ].map(item => (
              <div key={item.label} className="px-8 py-5 flex justify-between items-center">
                <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{item.label}</p>
                <p className={`text-sm font-black italic ${item.color}`}>{fmt(item.value)}</p>
              </div>
            ))}
            <div className="px-8 py-5 flex justify-between items-center bg-indigo-600/5">
              <p className="text-[10px] font-black text-indigo-400 tracking-widest uppercase">Gross Pay</p>
              <p className="text-base font-black text-indigo-400 italic">{fmt(slip.grossPay)}</p>
            </div>
          </div>
        </div>

        {/* DEDUCTIONS */}
        <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] overflow-hidden">
          <div className="px-8 py-5 bg-white/5 border-b border-white/5">
            <p className="text-[9px] font-black text-orange-400 tracking-[0.3em] uppercase">Deductions</p>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { label: 'SSS',             value: slip.sssDeduction },
              { label: 'PhilHealth',      value: slip.philHealthDeduction },
              { label: 'Pag-IBIG',        value: slip.pagIbigDeduction },
              { label: 'Withholding Tax', value: slip.withholdingTax },
            ].map(item => (
              <div key={item.label} className="px-8 py-5 flex justify-between items-center">
                <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{item.label}</p>
                <p className="text-sm font-black italic text-orange-400">{fmt(item.value)}</p>
              </div>
            ))}
            <div className="px-8 py-5 flex justify-between items-center bg-orange-500/5">
              <p className="text-[10px] font-black text-orange-400 tracking-widest uppercase">Total Deductions</p>
              <p className="text-base font-black text-orange-400 italic">{fmt(slip.totalDeductions)}</p>
            </div>
          </div>
        </div>

        {/* NET PAY */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-8 flex items-center justify-between">
          <div>
            <p className="text-[8px] font-black text-slate-500 tracking-widest uppercase mb-1">Net Take Home Pay</p>
            <p className="text-[9px] font-black text-slate-600 tracking-widest uppercase">After all deductions</p>
          </div>
          <p className="text-4xl font-black text-emerald-400 italic">{fmt(slip.netPay)}</p>
        </div>

        {/* META */}
        <p className="text-center text-[8px] font-black text-slate-700 tracking-widest uppercase italic">
          Generated: {slip.generatedAt}
          {slip.notifiedAt && ` · Notified: ${slip.notifiedAt}`}
        </p>
      </div>
    </>
  );
}