'use client';

import React, { useState, useMemo } from 'react';
import { Send, ArrowLeft, ShieldCheck } from 'lucide-react';

const CRITERIA_MAP = {
  peer: [
    { key: 'collaboration', label: 'Team Collaboration', desc: 'Effectiveness in working with others to achieve shared goals.' },
    { key: 'knowledge_sharing', label: 'Knowledge Sharing', desc: 'Proactively helps peers by sharing technical or process expertise.' },
    { key: 'reliability', label: 'Peer Reliability', desc: 'Consistently completes tasks assigned within the team unit.' },
    { key: 'communication', label: 'Interpersonal Comm', desc: 'Clarity and respect in day-to-day peer interactions.' },
    { key: 'support', label: 'Pressure Support', desc: 'Assisting teammates during high-volume or crunch periods.' },
    { key: 'conflict', label: 'Conflict Resolution', desc: 'Handles peer disagreements professionally and constructively.' },
    { key: 'accountability', label: 'Ownership', desc: 'Admits mistakes and takes responsibility for team outcomes.' },
    { key: 'punctuality', label: 'Meeting Presence', desc: 'On-time attendance for stand-ups and internal syncs.' },
    { key: 'innovation', label: 'Creative Input', desc: 'Contributing fresh ideas to improve team workflows.' },
    { key: 'adaptability', label: 'Flexibility', desc: 'Adjusts to changes in team priorities or tech stacks.' },
    { key: 'technical_quality', label: 'Technical Quality', desc: 'The standard of output provided to the team.' },
    { key: 'trust', label: 'Trustworthiness', desc: 'Builds dependable relationships within the department.' },
    { key: 'feedback', label: 'Review Quality', desc: 'Constructiveness of peer reviews and internal feedback.' },
    { key: 'initiative', label: 'Self-Starting', desc: 'Identifying team needs without being asked.' },
    { key: 'cultural_fit', label: 'Team Culture', desc: 'Alignment with the group social and professional dynamic.' },
  ],
  manager: [
    { key: 'job_knowledge', label: 'JOB KNOWLEDGE', desc: 'Understanding of role responsibilities and technical requirements.' },
    { key: 'work_quality', label: 'WORK QUALITY', desc: 'Accuracy, thoroughness, and standard of output produced.' },
    { key: 'productivity', label: 'PRODUCTIVITY', desc: 'Volume of work completed within given timeframes.' },
    { key: 'initiative', label: 'INITIATIVE', desc: 'Proactively takes action without waiting to be directed.' },
    { key: 'reliability', label: 'RELIABILITY', desc: 'Consistently meets deadlines and fulfills commitments.' },
    { key: 'communication', label: 'COMMUNICATION', desc: 'Clarity and effectiveness in verbal and written communication.' },
    { key: 'teamwork', label: 'TEAMWORK', desc: 'Collaborates effectively and supports team goals.' },
    { key: 'problem_solving', label: 'PROBLEM SOLVING', desc: 'Identifies issues and develops effective solutions.' },
    { key: 'adaptability', label: 'ADAPTABILITY', desc: 'Adjusts effectively to changing priorities and environments.' },
    { key: 'attendance', label: 'ATTENDANCE', desc: 'Consistent presence and on-time reporting to work.' },
    { key: 'customer_service', label: 'CUSTOMER SERVICE', desc: 'Handles client or stakeholder interactions professionally.' },
    { key: 'compliance', label: 'POLICY COMPLIANCE', desc: 'Adherence to company rules, procedures, and regulations.' },
    { key: 'leadership', label: 'LEADERSHIP', desc: 'Demonstrates ability to guide, influence, and mentor others.' },
    { key: 'professionalism', label: 'PROFESSIONALISM', desc: 'Conduct, appearance, and attitude in the workplace.' },
    { key: 'goal_achievement', label: 'GOAL ACHIEVEMENT', desc: 'Successfully meets individual KPIs and targets.' },
  ],
  hr: [
    { key: 'ethics', label: 'Ethical Conduct', desc: 'Adherence to the company code of ethics and integrity.' },
    { key: 'safety', label: 'Safety Protocols', desc: 'Following workplace safety and security regulations.' },
    { key: 'policy_awareness', label: 'Policy Knowledge', desc: 'Understanding of HR policies and company handbook.' },
    { key: 'harassment_prevention', label: 'Interpersonal Respect', desc: 'Maintaining a harassment-free environment.' },
    { key: 'confidentiality', label: 'Data Privacy', desc: 'Protecting sensitive company and employee information.' },
    { key: 'asset_care', label: 'Asset Management', desc: 'Proper use and maintenance of company property.' },
    { key: 'reporting', label: 'Reporting Accuracy', desc: 'Honesty and precision in timesheets and documentation.' },
    { key: 'training', label: 'Mandatory Training', desc: 'Timely completion of required corporate courses.' },
    { key: 'dress_code', label: 'Professional Image', desc: 'Adherence to corporate presentation standards.' },
    { key: 'conflict_interest', label: 'Interest Alignment', desc: 'Avoidance of external conflicts with company goals.' },
    { key: 'social_media', label: 'Digital Presence', desc: 'Adherence to company social media and public policies.' },
    { key: 'behavioral_neutrality', label: 'Workplace Harmony', desc: 'Avoiding disruptive office politics or rumors.' },
    { key: 'incident_reporting', label: 'Compliance Reporting', desc: 'Self-reporting errors or policy violations.' },
    { key: 'diversity', label: 'Inclusion Support', desc: 'Promoting a diverse and inclusive atmosphere.' },
    { key: 'legal_alignment', label: 'Regulatory Compliance', desc: 'Following local labor laws and industry standards.' },
  ]
};

const SCORE_LABELS: Record<number, string> = {
  1: 'POOR', 2: 'FAIR', 3: 'GOOD', 4: 'VERY GOOD', 5: 'EXCELLENT',
};

interface EvaluationFormProps {
  type: 'peer' | 'manager' | 'hr';
  targetName: string;
  targetId: string;
  isSubmitting: boolean;
  onBack: () => void;
  onFinish: (avgScore: number, finalComment: string) => void;
}

export function EvaluationForm({ type, targetName, targetId, isSubmitting, onBack, onFinish }: EvaluationFormProps) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');

  const criteria = useMemo(() => CRITERIA_MAP[type] || CRITERIA_MAP.peer, [type]);

  const currentTotalPoints = Object.values(scores).reduce((a, b) => a + b, 0);
  const liveScoreOutOf15 = (currentTotalPoints / 5); 
  const answeredCount = Object.keys(scores).length;
  const allScored = answeredCount === 15;
  const finalAverage = allScored ? (currentTotalPoints / 15) : 0;

  const handleSubmit = () => {
    if (!allScored || comment.trim().length < 5) return;
    onFinish(parseFloat(finalAverage.toFixed(2)), comment);
  };

  return (
    <section className="flex-1 overflow-y-auto bg-[#020617] h-full scrollbar-hide uppercase">
      <div className="sticky top-0 z-50 bg-[#020617]/95 backdrop-blur-md border-b border-white/5 px-12 py-6 flex items-center justify-between">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black text-indigo-500 hover:text-indigo-400 tracking-widest mb-1 transition-all">
            <ArrowLeft className="w-3 h-3" /> CANCEL AND EXIT
          </button>
          <h1 className="text-2xl font-black text-white tracking-tighter italic">
            OFFICIAL <span className="text-indigo-600">{type} EVALUATION</span>
          </h1>
          <p className="text-[9px] font-bold text-slate-500 tracking-[0.3em] mt-1">
            TARGET: {targetName} &nbsp;·&nbsp; ID: {targetId}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-black text-slate-500 tracking-widest mb-1">EVALUATION RESULT</p>
          <p className="text-2xl font-black text-white italic">
            {liveScoreOutOf15.toFixed(2)}
            <span className="text-slate-600 text-sm font-bold tracking-normal"> / 15.00</span>
          </p>
          <p className="text-[8px] font-black text-indigo-500 tracking-widest mt-1">
            {answeredCount} OF 15 POINTS EVALUATED
          </p>
        </div>
      </div>

      <div className="px-12 py-10 max-w-5xl mx-auto space-y-4">
        {criteria.map((criterion, index) => {
          const selected = scores[criterion.key];
          return (
            <div key={criterion.key} className={`border rounded-[2rem] p-8 transition-all duration-300 ${selected ? 'bg-indigo-950/20 border-indigo-500/20 shadow-[0_0_40px_-15px_rgba(79,70,229,0.1)]' : 'bg-slate-900/30 border-white/5'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <span className="text-[9px] font-black text-slate-600 tracking-widest mt-1 w-5 shrink-0">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="text-sm font-black text-white tracking-tight">{criterion.label}</p>
                    <p className="text-[10px] font-bold text-slate-500 tracking-widest mt-1">{criterion.desc}</p>
                    {selected && <p className="text-[9px] font-black text-indigo-400 tracking-[0.3em] mt-2">✓ RATING: {SCORE_LABELS[selected]}</p>}
                  </div>
                </div>
                <div className="flex gap-2 bg-slate-950 p-2 rounded-2xl border border-white/5 shrink-0">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button 
                      key={num} 
                      onClick={() => setScores(prev => ({...prev, [criterion.key]: num}))} 
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs transition-all ${selected === num ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(79,70,229,0.4)] scale-110' : 'text-slate-600 hover:text-indigo-400 hover:bg-white/5'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {allScored && (
          <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-[2rem] p-8 flex items-center justify-between animate-in fade-in zoom-in duration-500">
            <div className="flex items-center gap-3 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-black tracking-[0.4em]">AUDIT VALIDATED</span>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-white italic">{finalAverage.toFixed(2)}</p>
              <p className="text-[9px] font-black text-indigo-400 tracking-widest">FINAL AVERAGE (1-5)</p>
            </div>
          </div>
        )}

        <div className="pt-4">
          <label className="text-[10px] font-black text-slate-400 tracking-widest block mb-4 italic">Assessment Remarks</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-40 bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 text-white focus:border-indigo-500/50 outline-none transition-all text-xs tracking-widest leading-relaxed placeholder:text-slate-700"
            placeholder="ENTER QUALITATIVE FEEDBACK..."
          />
        </div>

        <div className="pb-12">
          <button
            onClick={handleSubmit}
            disabled={!allScored || comment.trim().length < 5 || isSubmitting}
            className={`w-full py-6 rounded-[2rem] font-black text-xs tracking-[0.5em] flex items-center justify-center gap-4 transition-all ${allScored && comment.trim().length >= 5 ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'}`}
          >
            {isSubmitting ? 'SYNCHRONIZING...' : 'AUTHORIZE SUBMISSION'}
          </button>
        </div>
      </div>
    </section>
  );
}