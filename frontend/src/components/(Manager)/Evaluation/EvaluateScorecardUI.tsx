'use client';

import React, { useState } from 'react';
import { ShieldCheck, Save } from 'lucide-react';
import { Agent } from './TeamListUI';

const RUBRICS = [
  { key: 'technical', label: 'TECHNICAL PROFICIENCY', description: 'ASSIGN VALUE BASED ON QUARTERLY METRICS.' },
  { key: 'security', label: 'SECURITY COMPLIANCE', description: 'ASSIGN VALUE BASED ON QUARTERLY METRICS.' },
  { key: 'communication', label: 'COMMUNICATION', description: 'ASSIGN VALUE BASED ON QUARTERLY METRICS.' },
];

interface EvaluateScorecardUIProps {
  agent: Agent;
  onClose: () => void;
  onSubmit: (agentId: string, scores: Record<string, number>) => void;
}

export const EvaluateScorecardUI = ({ agent, onClose, onSubmit }: EvaluateScorecardUIProps) => {
  const [scores, setScores] = useState<Record<string, number>>({});

  const handleScore = (key: string, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const allScored = RUBRICS.every((r) => scores[r.key] !== undefined);

  const handleSubmit = () => {
    if (allScored) onSubmit(agent.id, scores);
  };

  return (
    <section className="flex-1 flex flex-col overflow-hidden">
      <header className="px-12 py-8 border-b border-white/5 flex justify-between items-center bg-[#020617]">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-lg">
            {agent.name[0]}
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase">
              {agent.name} — SCORECARD
            </h2>
            <p className="text-[9px] font-black text-slate-500 tracking-[0.3em]">
              SECURE ACCESS ID: {agent.id}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-8 py-4 bg-white/5 rounded-2xl font-black text-[10px] tracking-widest text-slate-400 hover:text-white transition-all"
        >
          CLOSE SESSION
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-12 space-y-12">
        <div className="flex items-center gap-3 text-blue-500">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="text-xs font-black tracking-[0.4em]">EXECUTIVE SCORING MODULE</h3>
        </div>

        <div className="space-y-6">
          {RUBRICS.map((rubric) => (
            <div
              key={rubric.key}
              className="bg-slate-900/20 border border-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8"
            >
              <div className="max-w-xl">
                <p className="text-sm font-black text-white tracking-tight mb-2 uppercase">
                  {rubric.label}
                </p>
                <p className="text-[10px] font-bold text-slate-500 tracking-widest">
                  {rubric.description}
                </p>
              </div>
              <div className="flex gap-2 bg-slate-950 p-2 rounded-2xl border border-white/5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleScore(rubric.key, num)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs transition-all ${
                      scores[rubric.key] === num
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-blue-600/20 hover:text-blue-400'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-white/5">
          <button
            onClick={handleSubmit}
            disabled={!allScored}
            className={`w-full py-6 rounded-3xl font-black tracking-[0.3em] text-xs flex items-center justify-center gap-4 transition-all ${
              allScored
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Save className="w-5 h-5" />
            {allScored ? 'COMMIT SCORECARD TO HR DATABASE' : 'SCORE ALL CATEGORIES TO CONTINUE'}
          </button>
        </div>
      </div>
    </section>
  );
};