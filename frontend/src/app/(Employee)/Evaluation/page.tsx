'use client';

import React, { useState, useEffect } from 'react';
import { EvaluationView, Agent } from '../../../components/(Employee)/Evaluation/Evaluation';
import { ShieldCheck, Lock } from 'lucide-react';

interface LocalUser {
  employeeId: string;
  name: string;
  role: string;
  department: string;
}

// Extended Agent interface to include status
export interface EnhancedAgent extends Agent {
  alreadyEvaluated?: boolean; 
  lastEvaluationDate?: string;
}

export default function EvaluationPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [targetAgent, setTargetAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<EnhancedAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { setHasMounted(true); }, []);

  useEffect(() => {
    if (!selectedType || !hasMounted) return;
    
    const fetchAgents = async () => {
      setLoading(true);
      const user: LocalUser = JSON.parse(localStorage.getItem('user') || '{}');
      try {
        const params = new URLSearchParams({
          department: user.department || '',
          excludeId: user.employeeId || '',
          viewerRole: user.role || '',
          evaluationType: selectedType,
          month: new Date().getMonth().toString(), // Pass current month to API
          year: new Date().getFullYear().toString()
        });

        const res = await fetch(`http://localhost:5076/api/Evaluation/agents-with-status?${params}`);
        if (res.ok) {
          const data = await res.json();
          setAgents(data);
        }
      } catch (e) { 
        console.error("Fetch Error:", e); 
      } finally { 
        setLoading(false); 
      }
    };

    fetchAgents();
  }, [selectedType, hasMounted]);

  const handleSubmit = async (avgScore: number, finalComment: string) => {
    if (!targetAgent) return;
    setIsSubmitting(true);
    const user: LocalUser = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      const res = await fetch('http://localhost:5076/api/Evaluation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetEmployeeId: targetAgent.id,
          evaluatorId: user.employeeId,
          score: avgScore,
          comments: finalComment,
          evaluationType: selectedType
        })
      });

      if (res.ok) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setSelectedType(null);
          setTargetAgent(null);
          // Refresh list to show updated lock status
          window.location.reload(); 
        }, 3000);
      }
    } catch (e) { 
      alert("Submission failed."); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  if (!hasMounted) return null;

  return (
    <>
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] shadow-2xl flex items-center gap-5 border border-indigo-400/30 backdrop-blur-md">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
            <div className="uppercase">
              <p className="text-[11px] font-black tracking-widest">Audit Finalized</p>
              <p className="text-[8px] font-bold opacity-70 tracking-widest">Monthly Quota Updated</p>
            </div>
          </div>
        </div>
      )}

      <EvaluationView 
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        agents={agents}
        targetAgent={targetAgent}
        setTargetAgent={setTargetAgent}
        loading={loading}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting || showToast}
      />
    </>
  );
}