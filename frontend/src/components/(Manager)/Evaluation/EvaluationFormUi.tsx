'use client';

import React, { useState } from 'react';
import { Send, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Agent } from './TeamListUI';

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

const SCORE_LABELS: Record<number, string> = {
  1: 'POOR',
  2: 'FAIR',
  3: 'GOOD',
  4: 'VERY GOOD',
  5: 'EXCELLENT',
};

interface EvaluationFormUIProps {
  agent:    Agent;
  onBack:   () => void;
  onSubmit: (score: number, comment: string) => void;
}

export const EvaluationFormUI = ({ agent, onBack, onSubmit }: EvaluationFormUIProps) => {
  const [scores,  setScores]  = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');

  const handleScore = (key: string, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const allScored    = CRITERIA.every((c) => scores[c.key] !== undefined);
  const totalScored  = Object.keys(scores).length;
  const averageScore = allScored
    ? (Object.values(scores).reduce((a, b) => a + b, 0) / CRITERIA.length)
    : 0;

  const handleSubmit = () => {
    if (!allScored || comment.trim().length < 5) return;
    onSubmit(parseFloat(averageScore.toFixed(2)), comment);
  };

  return (
    <section className="flex-1 overflow-y-auto bg-[#020617]">

      {/* ── STICKY HEADER ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-[#020617]/95 backdrop-blur-md border-b border-white/5 px-12 py-6 flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-black text-indigo-500 hover:underline tracking-widest mb-1"
          >
            <ArrowLeft className="w-3 h-3" /> CANCEL AND EXIT
          </button>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase">
            OFFICIAL <span className="text-indigo-600">EVALUATION</span>
          </h1>
          <p className="text-[9px] font-bold text-slate-500 tracking-[0.3em] mt-1 uppercase">
            TARGET: {agent.name} &nbsp;·&nbsp; ID: {agent.id}
          </p>
        </div>

        {/* Progress pill */}
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">
            CRITERIA SCORED
          </p>
          <p className="text-2xl font-black text-white">
            {totalScored}
            <span className="text-slate-600 text-sm"> / {CRITERIA.length}</span>
          </p>
        </div>
      </div>

      <div className="px-12 py-10 max-w-5xl space-y-4">

        {/* ── CRITERIA CARDS ────────────────────────────────────────── */}
        {CRITERIA.map((criterion, index) => {
          const selected = scores[criterion.key];
          return (
            <div
              key={criterion.key}
              className={`border rounded-[2rem] p-8 transition-all ${
                selected
                  ? 'bg-indigo-950/20 border-indigo-500/20'
                  : 'bg-slate-900/30 border-white/5'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                {/* Left — label */}
                <div className="flex items-start gap-4 flex-1">
                  <span className="text-[9px] font-black text-slate-600 tracking-widest mt-1 w-5 shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-black text-white tracking-tight uppercase">
                      {criterion.label}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 tracking-widest mt-1">
                      {criterion.desc}
                    </p>
                    {selected && (
                      <p className="text-[9px] font-black text-indigo-400 tracking-[0.3em] mt-2">
                        ✓ {SCORE_LABELS[selected]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right — score buttons */}
                <div className="flex gap-2 bg-slate-950 p-2 rounded-2xl border border-white/5 shrink-0">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleScore(criterion.key, num)}
                      title={SCORE_LABELS[num]}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs transition-all ${
                        selected === num
                          ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]'
                          : selected && selected > num
                          ? 'bg-indigo-900/30 text-indigo-400'
                          : 'text-slate-600 hover:bg-indigo-600/20 hover:text-indigo-400'
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

        {/* ── AVERAGE SCORE SUMMARY ─────────────────────────────────── */}
        {allScored && (
          <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-[2rem] p-8 flex items-center justify-between">
            <div className="flex items-center gap-3 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-black tracking-[0.4em]">COMPUTED AVERAGE SCORE</span>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-white">{averageScore.toFixed(2)}</p>
              <p className="text-[9px] font-black text-indigo-400 tracking-widest">
                OUT OF 5.00
              </p>
            </div>
          </div>
        )}

        {/* ── REMARKS ───────────────────────────────────────────────── */}
        <div className="pt-4">
          <label className="text-[10px] font-black text-slate-400 tracking-widest block mb-4">
            MANAGER REMARKS
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="ENTER QUALITATIVE FEEDBACK..."
            className="w-full h-40 bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 text-white focus:border-indigo-500/50 outline-none transition-all resize-none uppercase text-xs tracking-widest leading-relaxed placeholder:text-slate-700"
          />
          <p className="text-[9px] text-slate-600 tracking-widest mt-2 font-bold">
            MINIMUM 5 CHARACTERS REQUIRED
          </p>
        </div>

        {/* ── SUBMIT ────────────────────────────────────────────────── */}
        <div className="pb-12">
          <button
            onClick={handleSubmit}
            disabled={!allScored || comment.trim().length < 5}
            className={`w-full py-6 rounded-[2rem] font-black text-xs tracking-[0.5em] flex items-center justify-center gap-4 transition-all ${
              allScored && comment.trim().length >= 5
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(79,70,229,0.2)]'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            {!allScored
              ? `SCORE ALL ${CRITERIA.length} CRITERIA TO CONTINUE`
              : comment.trim().length < 5
              ? 'ADD REMARKS TO CONTINUE'
              : 'AUTHORIZE SUBMISSION'}
          </button>
        </div>
      </div>
    </section>
  );
};