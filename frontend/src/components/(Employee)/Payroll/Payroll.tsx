'use client';

import React from 'react';
import { Sidebar } from '../../../components/(Employee)/Dashboard/Sidebar';
import { 
  TrendingUp, ShieldCheck, Info, ArrowDownRight, 
  Wallet, Receipt, History, Ghost, ChevronLeft, ChevronRight 
} from 'lucide-react';

// 1. DATA CONTRACT
export interface PayslipData {
  id: number;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  basicSalary: number;
  nightDiff: number;
  overtime: number;
  allowances: number;
  grossPay: number;
  sssDeduction: number;
  philHealthDeduction: number;
  pagIbigDeduction: number;
  withholdingTax: number;
  totalDeductions: number;
  netPay: number;
  status: string;
  generatedAt: string;
}

// 2. PROPS INTERFACE
interface PayrollViewProps {
  activeSlip: PayslipData | null;
  visibleHistory: PayslipData[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectSlip: (slip: PayslipData) => void;
}

export function PayrollView({
  activeSlip,
  visibleHistory,
  currentPage,
  totalPages,
  onPageChange,
  onSelectSlip
}: PayrollViewProps) {
  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <Sidebar />

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
        
        <header className="px-12 py-10 border-b border-white/5 flex justify-between items-end backdrop-blur-xl sticky top-0 z-20 bg-[#020617]/80">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
                <Wallet className="w-4 h-4" />
                <span className="text-[10px] font-black tracking-[0.4em]">Official Records</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter italic">
              Payslip <span className="text-indigo-600">Archive</span>
            </h1>
          </div>
        </header>

        <div className="p-12 max-w-[1400px] w-full mx-auto space-y-10">
          {!activeSlip ? (
            <EmptyState />
          ) : (
            <>
              {/* HERO CARD */}
              <div className="bg-slate-900/40 border border-white/5 rounded-[3.5rem] p-12 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
                <div className="z-10">
                  <p className="text-[10px] font-black text-slate-500 tracking-[0.4em] mb-4">Net Take-Home</p>
                  <h2 className="text-7xl font-black text-white tracking-tighter italic">
                    ₱ {activeSlip.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h2>
                  <p className="text-[10px] font-black text-indigo-500 mt-4 tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Period: {activeSlip.periodStart} – {activeSlip.periodEnd}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] text-center min-w-[240px] backdrop-blur-md">
                    <p className="text-[10px] font-black text-slate-500 tracking-widest mb-2">Pay Release Date</p>
                    <p className="text-2xl font-black text-white italic">{activeSlip.payDate}</p>
                    <div className="mt-4 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[9px] font-black text-indigo-400">
                        PS-{activeSlip.id} · {activeSlip.status}
                    </div>
                </div>
              </div>

              {/* GRID WITH TOTALS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* EARNINGS */}
                <DataCard title="Earnings" icon={<TrendingUp className="w-4 h-4"/>} color="text-indigo-500">
                    <Row label="Basic Salary" val={activeSlip.basicSalary} />
                    <Row label="Night Differential" val={activeSlip.nightDiff} />
                    <Row label="Overtime Pay" val={activeSlip.overtime} />
                    <Row label="Allowances" val={activeSlip.allowances} />
                    {/* TOTAL EARNINGS ROW */}
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center px-5">
                        <span className="text-[10px] font-black text-indigo-400 tracking-widest">Total Gross</span>
                        <span className="text-lg font-black text-indigo-400 italic">₱ {activeSlip.grossPay.toLocaleString()}</span>
                    </div>
                </DataCard>

                {/* DEDUCTIONS */}
                <DataCard title="Deductions" icon={<ArrowDownRight className="w-4 h-4"/>} color="text-orange-400">
                    <Row label="SSS" val={activeSlip.sssDeduction} isNeg />
                    <Row label="PhilHealth" val={activeSlip.philHealthDeduction} isNeg />
                    <Row label="Pag-IBIG" val={activeSlip.pagIbigDeduction} isNeg />
                    <Row label="Tax" val={activeSlip.withholdingTax} isNeg />
                    {/* TOTAL DEDUCTIONS ROW */}
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center px-5">
                        <span className="text-[10px] font-black text-orange-400 tracking-widest">Total Deductions</span>
                        <span className="text-lg font-black text-orange-400 italic">₱ {activeSlip.totalDeductions.toLocaleString()}</span>
                    </div>
                </DataCard>
              </div>

              {/* HISTORY LEDGER */}
              <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-white/5">
                    <History className="w-5 h-5 text-slate-500" />
                    <h3 className="text-xs font-black text-white tracking-[0.3em]">Historical Ledger</h3>
                </div>
                <div className="divide-y divide-white/5">
                    {visibleHistory.map((slip) => (
                        <div 
                          key={slip.id} 
                          onClick={() => onSelectSlip(slip)} 
                          className={`px-10 py-6 flex justify-between items-center hover:bg-indigo-600/5 cursor-pointer transition-all ${activeSlip.id === slip.id ? 'bg-indigo-600/10 border-l-4 border-indigo-500' : ''}`}
                        >
                            <span className="text-xs font-black tracking-tight">{slip.periodStart} - {slip.periodEnd}</span>
                            <div className="flex items-center gap-6">
                                <span className="text-xs font-black text-emerald-400 italic">₱ {slip.netPay.toLocaleString()}</span>
                                <Receipt className="w-5 h-5 text-slate-500" />
                            </div>
                        </div>
                    ))}
                </div>
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-10">
                  <p className="text-[9px] font-black text-slate-500 tracking-widest italic">Page {currentPage} of {totalPages}</p>
                  <div className="flex gap-2">
                      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400 disabled:opacity-20 hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></button>
                      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400 disabled:opacity-20 hover:text-white transition-all"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

// ─── STATED HELPER COMPONENTS ───

const EmptyState = () => (
    <div className="h-[60vh] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[4rem]">
        <Ghost className="w-16 h-16 text-slate-800 mb-6" />
        <h2 className="text-xl font-black text-slate-600 tracking-widest">No Records Found</h2>
    </div>
);

interface DataCardProps {
    title: string;
    icon: React.ReactNode;
    color: string;
    children: React.ReactNode;
}

const DataCard = ({ title, icon, color, children }: DataCardProps) => (
    <div className="space-y-6">
        <h3 className={`text-xs font-black ${color} tracking-[0.4em] flex items-center gap-3 uppercase`}>
            {icon} {title}
        </h3>
        <div className="bg-slate-900/20 border border-white/5 rounded-[3rem] p-8 space-y-4">
            {children}
        </div>
    </div>
);

interface RowProps {
    label: string;
    val: number;
    isNeg?: boolean;
}

const Row = ({ label, val, isNeg }: RowProps) => (
    <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5">
        <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">{label}</span>
        <span className={`text-sm font-black ${isNeg ? 'text-orange-400' : 'text-white'} italic`}>
            {isNeg ? '- ' : ''}₱ {val.toLocaleString()}
        </span>
    </div>
);