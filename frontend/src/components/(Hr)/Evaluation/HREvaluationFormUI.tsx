'use client';

import React, { useState, useMemo } from 'react';
import { Send, ArrowLeft, ShieldCheck, Star, Activity, AlertCircle } from 'lucide-react';
import { Agent } from './HRTeamList';

const CRITERIA = [
  { key: 'job_knowledge',       label: 'JOB KNOWLEDGE',            desc: 'Understanding of role responsibilities and technical requirements.' },
  { key: 'work_quality',        label: 'WORK QUALITY',             desc: 'Accuracy, thoroughness, and standard of output produced.' },
  { key: 'productivity',        label: 'PRODUCTIVITY',             desc: 'Volume of work completed within given timeframes.' },
  { key: 'initiative',          label: 'INITIATIVE',               desc: 'Proactively takes action without waiting to be directed.' },
  { key: 'reliability',         label: 'RELIABILITY',              desc: 'Consistently meets deadlines and fulfills commitments.' },
  { key: 'communication',       label: 'COMMUNICATION',            desc: 'Clarity and effectiveness in verbal and written communication.' },
  { key: 'teamwork',            label: 'TEAMWORK',                 desc: 'Collaborates effectively and supports team goals.' },
  { key: 'problem_solving',     label: 'PROBLEM SOLVING',          desc: 'Identifies issues and develops effective solutions.' },
  { key: 'adaptability',        label: 'ADAPTABILITY',             desc: 'Adjusts effectively to changing priorities and environments.' },
  { key: 'attendance',          label: 'ATTENDANCE & PUNCTUALITY', desc: 'Consistent presence and on-time reporting to work.' },
  { key: 'customer_service',    label: 'CUSTOMER SERVICE',         desc: 'Handles client or stakeholder interactions professionally.' },
  { key: 'compliance',          label: 'POLICY COMPLIANCE',        desc: 'Adherence to company rules, procedures, and regulations.' },
  { key: 'leadership',          label: 'LEADERSHIP POTENTIAL',     desc: 'Demonstrates ability to guide, influence, and mentor others.' },
  { key: 'professionalism',     label: 'PROFESSIONALISM',          desc: 'Conduct, appearance, and attitude in the workplace.' },
  { key: 'goal_achievement',    label: 'GOAL ACHIEVEMENT',         desc: 'Successfully meets individual KPIs and performance targets.' },
];

interface HREvaluationFormUIProps {
  agent:    Agent;
  onBack:   () => void;
  onSubmit: (score: number, comment: string) => void;
}

export const HREvaluationFormUI = ({ agent, onBack, onSubmit }: HREvaluationFormUIProps) => {
  const [scores,  setScores]  = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');

  const handleScore = (key: string, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  // --- SCORE CALCULATIONS ---
  const totalScored = Object.keys(scores).length;
  const allScored   = totalScored === CRITERIA.length;
  
  const { displayScore, rawAverage } = useMemo(() => {
    if (totalScored === 0) return { displayScore: "0.00", rawAverage: 0 };
    
    const sum = Object.values(scores).reduce((a, b) => a + b, 0);
    const avg = sum / CRITERIA.length;
    
    // Scale to 15.00 (Total Sum / Max possible Sum * 15)
    // (sum / (CRITERIA.length * 5)) * 15
    const scaled = (sum / (CRITERIA.length * 5)) * 15;
    
    return {
      displayScore: scaled.toFixed(2),
      rawAverage: avg
    };
  }, [scores]);

  const handleSubmit = () => {
    if (!allScored || comment.trim().length < 10) return;
    // Sending the 1-5 raw average to DB for consistency, 
    // while the UI shows the 15.00 weighted result.
    onSubmit(parseFloat(rawAverage.toFixed(2)), comment.toUpperCase());
  };

  return (
    <section className="flex-1 overflow-y-auto bg-[#020617] font-sans scrollbar-hide uppercase">
      {/* ── STICKY HEADER ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-[#020617]/95 backdrop-blur-md border-b border-white/5 px-12 py-8 flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-black text-indigo-500 hover:text-indigo-400 tracking-[0.3em] mb-2 transition-all"
          >
            <ArrowLeft className="w-3 h-3" /> ABORT AUDIT
          </button>
          <h1 className="text-3xl font-black text-white tracking-tighter italic">
            HR <span className="text-indigo-600">PERFORMANCE</span> AUDIT
          </h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] mt-1">
            SUBJECT: {agent.name} <span className="mx-2 text-slate-800">|</span> ID: {agent.id}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-3xl text-right">
            <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">AUDIT PROGRESS</p>
            <p className="text-2xl font-black text-white italic tracking-tighter">
              {totalScored}<span className="text-indigo-600">/</span>{CRITERIA.length}
            </p>
          </div>
          
          <div className="bg-indigo-600/10 border border-indigo-500/20 px-8 py-4 rounded-3xl text-right shadow-2xl shadow-indigo-600/10">
            <p className="text-[9px] font-black text-indigo-500 tracking-widest mb-1">LIVE SCORE</p>
            <p className="text-2xl font-black text-white italic tracking-tighter">
              {displayScore} <span className="text-[10px] text-slate-600">/ 15.00</span>
            </p>
          </div>
        </div>
      </div>

      <div className="px-12 py-10 max-w-5xl mx-auto space-y-4">
        {/* ── CRITERIA GRID ────────────────────────────────────────── */}
        {CRITERIA.map((criterion, index) => {
          const selected = scores[criterion.key];
          return (
            <div
              key={criterion.key}
              className={`group border rounded-[2.5rem] p-8 transition-all duration-500 ${
                selected
                  ? 'bg-indigo-600/5 border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.03)]'
                  : 'bg-slate-900/20 border-white/5 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-start gap-6 flex-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs border transition-all duration-500 ${
                    selected ? 'bg-indigo-600 border-indigo-400 text-white rotate-6' : 'bg-slate-900 border-white/10 text-slate-600 group-hover:border-slate-700'
                  }`}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <p className="text-lg font-black text-white tracking-tight italic mb-1">
                      {criterion.label}
                    </p>
                    <p className="text-[11px] font-bold text-slate-500 tracking-widest leading-relaxed">
                      {criterion.desc}
                    </p>
                  </div>
                </div>

                {/* Rating Input */}
                <div className="flex gap-2 bg-black/40 p-2 rounded-[1.8rem] border border-white/5 shrink-0">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleScore(criterion.key, num)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm transition-all active:scale-90 ${
                        selected === num
                          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/40'
                          : 'text-slate-600 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* ── FINAL AUDIT SUMMARY ──────────────────────────── */}
        {allScored && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[3rem] p-10 flex items-center justify-between animate-in slide-in-from-bottom-4 duration-700 shadow-2xl shadow-emerald-500/5">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-[0.5em] text-emerald-500 block mb-1">AUDIT VALIDATED</span>
                <span className="text-xs font-bold text-slate-400 tracking-widest uppercase italic">ALL CRITERIA LOGGED & VERIFIED BY HR</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-7xl font-black text-white tracking-tighter italic leading-none">{displayScore}</p>
              <p className="text-[10px] font-black text-emerald-500 tracking-[0.3em] mt-2">COMPOSITE RESULT / 15.00</p>
            </div>
          </div>
        )}

        {/* ── REMARKS ───────────────────────────────────────────────── */}
        <div className="pt-8 space-y-4">
          <div className="flex items-center gap-3 ml-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            <label className="text-[10px] font-black text-indigo-500 tracking-[0.5em]">
              QUALITATIVE AUDIT REMARKS
            </label>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="PROVIDE DETAILED JUSTIFICATION FOR THIS SCORECARD..."
            className="w-full h-48 bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 text-white focus:border-indigo-500/50 outline-none transition-all resize-none text-[11px] font-bold tracking-widest leading-relaxed placeholder:text-slate-800"
          />
          {comment.length > 0 && comment.length < 10 && (
            <div className="flex items-center gap-2 text-amber-500/80 ml-4 animate-pulse">
              <AlertCircle size={12} />
              <p className="text-[9px] font-black tracking-widest uppercase">MINIMUM 10 CHARACTERS REQUIRED FOR AUDIT LOG</p>
            </div>
          )}
        </div>

        {/* ── SUBMIT ────────────────────────────────────────────────── */}
        <div className="pb-24">
          <button
            onClick={handleSubmit}
            disabled={!allScored || comment.trim().length < 10}
            className={`w-full py-8 rounded-[3rem] font-black text-[12px] tracking-[0.6em] flex items-center justify-center gap-4 transition-all duration-500 ${
              allScored && comment.trim().length >= 10
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl shadow-indigo-600/30 active:scale-[0.98]'
                : 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5'
            }`}
          >
            <Send className="w-5 h-5" />
            {!allScored
              ? `DATA MISSING (${totalScored}/${CRITERIA.length})`
              : comment.trim().length < 10
              ? 'REMARKS REQUIRED'
              : 'COMMIT AUDIT TO DATABASE'}
          </button>
        </div>
      </div>
    </section>
  );
};