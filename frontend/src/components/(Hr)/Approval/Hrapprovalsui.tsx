'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertCircle,
  Calendar,
  User,
  ChevronDown,
} from 'lucide-react';

export interface ApprovalRequest {
  id: number;
  employeeId: number;
  name: string;
  type: string;
  date: string;
  reason: string;
  priority: 'HIGH' | 'NORMAL';
}

interface HRApprovalsUIProps {
  requests: ApprovalRequest[];
  onAction: (id: number, type: 'APPROVED' | 'REJECTED') => void;
}

export const HRApprovalsUI = ({ requests, onAction }: HRApprovalsUIProps) => {
  const [filter, setFilter] = useState<'ALL' | 'HIGH'>('ALL');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const highPriorityCount = requests.filter((r) => r.priority === 'HIGH').length;
  const filtered = filter === 'HIGH' ? requests.filter((r) => r.priority === 'HIGH') : requests;

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">

      {/* HEADER */}
      <header className="px-8 py-7 border-b border-white/5 flex flex-wrap justify-between items-center gap-4 backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-indigo-500" strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">
              Governance &amp; Compliance
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
            Final <span className="text-indigo-600">Authorizations</span>
          </h1>
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          <div className="px-5 py-3 bg-indigo-600/10 border border-indigo-600/30 rounded-xl text-[10px] font-black text-indigo-400 tracking-widest uppercase">
            {requests.length} AWAITING DECISION
          </div>
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            {(['ALL', 'HIGH'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-5 py-2.5 rounded-lg text-[9px] font-black tracking-[0.2em] transition-all ${
                  filter === t ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'
                }`}
              >
                {t === 'HIGH' ? 'URGENT' : 'ALL'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-8 max-w-[1200px] w-full mx-auto space-y-4">

        {/* Pre-approval notice */}
        <div className="bg-indigo-600/5 border border-indigo-600/20 p-4 rounded-2xl flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-white tracking-widest mb-0.5 uppercase">
              Attention Required
            </h4>
            <p className="text-[10px] font-bold text-slate-500 tracking-wider leading-relaxed uppercase">
              All requests below have been pre-approved by their managers. Your decision is final.
              {highPriorityCount > 0 &&
                ` ${highPriorityCount} high priority request${highPriorityCount > 1 ? 's require' : ' requires'} immediate sign-off.`}
            </p>
          </div>
        </div>

        {/* High priority alert */}
        {highPriorityCount > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/20 p-3.5 rounded-2xl flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-orange-500 flex items-center justify-center text-slate-950 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-black text-orange-400 tracking-widest uppercase">
              {highPriorityCount} High Priority Request{highPriorityCount > 1 ? 's' : ''} — Immediate Action Required
            </p>
          </div>
        )}

        {/* REQUESTS LIST */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-slate-600 font-black tracking-[0.5em] text-[10px] uppercase italic">
                System Synchronized // No Pending HR Actions
              </p>
            </div>
          ) : (
            filtered.map((req) => {
              const isExpanded = expandedIds.has(req.id);
              return (
                <div
                  key={req.id}
                  className="bg-slate-900/40 border border-white/5 rounded-2xl hover:border-indigo-500/20 transition-all group overflow-hidden"
                >
                  {/* Urgent stripe */}
                  {req.priority === 'HIGH' && (
                    <div className="h-[3px] w-full bg-gradient-to-r from-red-500 to-orange-500" />
                  )}

                  {/* MAIN ROW — everything on one line */}
                  <div className="px-5 py-4 flex items-center gap-4">

                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                      req.priority === 'HIGH'
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-slate-800 border-white/5 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20'
                    }`}>
                      <User className={`w-5 h-5 ${
                        req.priority === 'HIGH' ? 'text-red-400' : 'text-slate-500 group-hover:text-indigo-400'
                      }`} />
                    </div>

                    {/* Identity */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-black text-indigo-500 tracking-widest shrink-0">#{req.id}</span>
                        <span className="text-xs font-black text-white tracking-tight truncate">{req.name}</span>
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded border bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shrink-0">
                          MGR APPROVED
                        </span>
                        {req.priority === 'HIGH' && (
                          <span className="text-[8px] font-black px-1.5 py-0.5 rounded border bg-red-500/10 text-red-400 border-red-500/20 shrink-0">
                            URGENT
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] font-black text-indigo-400 tracking-widest uppercase">{req.type}</span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 tracking-widest">
                          <Calendar className="w-3 h-3 shrink-0" />{req.date}
                        </span>
                      </div>
                    </div>

                    {/* Reason toggle */}
                    <button
                      onClick={() => toggleExpand(req.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[9px] font-black tracking-widest uppercase transition-all shrink-0 ${
                        isExpanded
                          ? 'bg-indigo-600/10 border-indigo-600/30 text-indigo-400'
                          : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      REASON
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onAction(req.id, 'REJECTED')}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-500/20 text-red-400 font-black text-[9px] tracking-[0.2em] hover:bg-red-500 hover:text-white hover:border-transparent transition-all uppercase active:scale-95"
                      >
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        DENY
                      </button>
                      <button
                        onClick={() => onAction(req.id, 'APPROVED')}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-black text-[9px] tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 uppercase active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        FINAL APPROVE
                      </button>
                    </div>
                  </div>

                  {/* EXPANDABLE REASON */}
                  {isExpanded && (
                    <div className="px-5 pb-4">
                      <div className="bg-white/[0.03] border border-indigo-500/10 rounded-xl p-4">
                        <p className="text-[9px] font-black text-slate-600 tracking-[0.2em] uppercase mb-1.5">
                          Justification
                        </p>
                        <p className="text-[11px] font-bold text-slate-300 tracking-wider leading-relaxed uppercase">
                          {req.reason}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};