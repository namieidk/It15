'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { HRSidebar } from '../../../components/(Hr)/Dashboard/sidebar';
import { HREvaluationHubUI } from '../../../components/(Hr)/Evaluation/HREvaluationHub';
import { HRTeamListUI, Agent } from '../../../components/(Hr)/Evaluation/HRTeamList';
import { HRAuditResultsUI, PeerFeedback } from '../../../components/(Hr)/Evaluation/HRAuditResults';
import { HREvaluationFormUI } from '../../../components/(Hr)/Evaluation/HREvaluationFormUI';
import { HRDepartmentSelectorUI } from '../../../components/(Hr)/Evaluation/HRDepartmentSelectorUI';

type ViewState = 'hub' | 'departments' | 'evaluate' | 'results' | 'form';

export default function HREvaluatePage() {
  const [view, setView] = useState<ViewState>('hub');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeDept, setActiveDept] = useState<string>(''); // Track chosen dept

  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<PeerFeedback[]>([]); 

  const fetchRoster = useCallback(async (deptOverride?: string) => {
    try {
      setIsLoading(true);
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      
      // If evaluating managers, dept doesn't matter (global). 
      // If viewing results, we use the selected department.
      const dept = deptOverride || activeDept || stored.department;

      const url = `http://localhost:5076/api/Evaluation/agents-with-status?` + 
                  `department=${encodeURIComponent(dept)}&` +
                  `excludeId=${stored.employeeId}&` +
                  `viewerRole=HR&` +
                  `mode=${view === 'form' ? 'evaluate' : view}`;
      
      const res = await fetch(url); 
      if (res.ok) {
        const data = await res.json();
        setAgents(data);
      }
    } catch (error) {
      toast.error("DATABASE SYNC ERROR");
    } finally {
      setIsLoading(false);
    }
  }, [view, activeDept]);

  // Trigger fetch when view changes to 'evaluate' (Global Managers) 
  // or when 'activeDept' is set for 'results'
  useEffect(() => {
    if (view === 'evaluate' || (view === 'results' && activeDept)) {
      fetchRoster();
    }
  }, [view, activeDept, fetchRoster]);

  const handleDeptSelect = (dept: string) => {
    setActiveDept(dept);
    setView('results'); // Move to the list after selecting dept
  };

  const handleSelectAgent = async (agent: Agent) => {
    setSelectedAgent(agent);
    if (view === 'results') {
      try {
        setIsLoading(true);
        const res = await fetch(`http://localhost:5076/api/Evaluation/peer-results/${agent.id}`);
        if (res.ok) {
          const data = await res.json();
          setFeedbacks(data);
        }
      } catch (error) {
        toast.error("ACCESS DENIED");
      } finally {
        setIsLoading(false);
      }
    } else if (view === 'evaluate') {
      setView('form');
    }
  };

  const renderContent = () => {
    if (view === 'hub') return <HREvaluationHubUI onNavigate={(v) => setView(v === 'results' ? 'departments' : 'evaluate')} />;
    
    // NEW: Department Selection View
    if (view === 'departments') return <HRDepartmentSelectorUI onSelect={handleDeptSelect} onBack={() => setView('hub')} />;

    if (view === 'form' && selectedAgent) return <HREvaluationFormUI agent={selectedAgent} onBack={() => setView('evaluate')} onSubmit={() => { setView('hub'); fetchRoster(); }} />;

    if (selectedAgent && view === 'results') return <HRAuditResultsUI agent={selectedAgent} feedbacks={feedbacks} onClose={() => setSelectedAgent(null)} />;

    if (view === 'evaluate' || view === 'results') {
      return (
        <HRTeamListUI 
          agents={agents} 
          mode={view} 
          onSelectAgent={handleSelectAgent} 
          onBack={() => {
            setView(view === 'results' ? 'departments' : 'hub');
            setSelectedAgent(null);
          }} 
        />
      );
    }
  };

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <Toaster position="top-right" theme="dark" richColors />
      <HRSidebar />
      <section className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {isLoading && <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#020617]/80 backdrop-blur-sm">...</div>}
          {renderContent()}
        </div>
      </section>
    </main>
  );
}