'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ManagerSidebar } from '../../../components/(Manager)/Dashboard/ManagerSidebar';
import { EvaluationHubUI } from '../../../components/(Manager)/Evaluation/Evaluation';
import { TeamListUI, Agent } from '../../../components/(Manager)/Evaluation/TeamListUI';
import { PeerResultsUI } from '../../../components/(Manager)/Evaluation/PeerResultsUI';
import { EvaluationFormUI } from '../../../components/(Manager)/Evaluation/EvaluationFormUi';

type ViewState = 'hub' | 'evaluate' | 'results' | 'form' | 'peer-detail';

export default function EvaluationPage() {
  const [view, setView]                   = useState<ViewState>('hub');
  const [agents, setAgents]               = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [peerFeedbacks, setPeerFeedbacks] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  const API_BASE = "http://localhost:5076/api/Evaluation";

  const getManagerInfo = () => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) return { id: '', dept: '', role: '' };
      const parsed = JSON.parse(stored);
      return {
        id:   String(parsed.employeeId || '').trim(),
        dept: String(parsed.department || '').trim().toUpperCase(),
        role: String(parsed.role || '').trim().toUpperCase(),
      };
    } catch {
      return { id: '', dept: '', role: '' };
    }
  };

  const fetchAgents = useCallback(async () => {
    const { id, dept, role } = getManagerInfo();
    if (!dept) return;

    setLoading(true);
    setError(null);
    try {
      // UPDATED TO THE CORRECT ENDPOINT NAME: agents-with-status
      const res = await fetch(
        `${API_BASE}/agents-with-status?department=${encodeURIComponent(dept)}&excludeId=${encodeURIComponent(id)}&viewerRole=${role}&evaluationType=peer`
      );
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setAgents(data);
    } catch (err) {
      console.error("Connection Error:", err);
      setError("Cannot connect to server. Check backend routes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  const handleSelectAgent = async (agent: Agent) => {
    if (agent.alreadyEvaluated && view === 'evaluate') return;
    
    setSelectedAgent(agent);
    if (view === 'results') {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/peer-results/${agent.id}`);
        const data = await res.json();
        setPeerFeedbacks(data);
        setView('peer-detail');
      } catch (err) {
        setError("Failed to load peer results.");
      } finally {
        setLoading(false);
      }
    } else {
      setView('form');
    }
  };

  const handleFormSubmit = async (score: number, comment: string) => {
    if (!selectedAgent) return;
    const { id: evaluatorId } = getManagerInfo();

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/submit`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetEmployeeId: selectedAgent.id,
          evaluatorId,
          score,
          comments: comment,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      setView('hub');
      fetchAgents(); // Refresh the list to apply locks
    } catch (err) {
      setError("Submission failed. Monthly limit reached or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase relative">
      <ManagerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-900/80 border border-red-500/40 text-red-300 text-[10px] font-black tracking-widest px-6 py-3 rounded-2xl backdrop-blur-sm">
            ⚠ {error} <button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-white">✕</button>
          </div>
        )}
        {view === 'hub' && <EvaluationHubUI onNavigate={(next) => setView(next as ViewState)} />}
        {(view === 'evaluate' || view === 'results') && (
          <TeamListUI agents={agents} mode={view} onBack={() => setView('hub')} onSelectAgent={handleSelectAgent} />
        )}
        {view === 'form' && selectedAgent && (
          <EvaluationFormUI agent={selectedAgent} onBack={() => setView('evaluate')} onSubmit={handleFormSubmit} />
        )}
        {view === 'peer-detail' && selectedAgent && (
          <PeerResultsUI agent={selectedAgent} feedbacks={peerFeedbacks} onClose={() => setView('results')} />
        )}
        {loading && (
          <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md flex flex-col items-center justify-center z-50">
            <div className="w-32 h-1 bg-indigo-900/20 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-indigo-600 animate-pulse" />
            </div>
            <span className="text-[10px] font-black tracking-[0.4em] text-indigo-500">PROCESSING PERSONNEL DATA...</span>
          </div>
        )}
      </div>
    </main>
  );
}