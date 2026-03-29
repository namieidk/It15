'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { HRSidebar } from '../../../components/(Hr)/Dashboard/sidebar';
import { HREvaluationHubUI } from '../../../components/(Hr)/Evaluation/HREvaluationHub';
import { HRTeamListUI, Agent } from '../../../components/(Hr)/Evaluation/HRTeamList';
import { HRAuditResultsUI, PeerFeedback } from '../../../components/(Hr)/Evaluation/HRAuditResults';
import { HREvaluationFormUI } from '../../../components/(Hr)/Evaluation/HREvaluationFormUI';

// API Response Interface
interface EvaluationAgentResponse {
  id: string;
  name: string;
  role: string;
  department: string;
  peerScore: string;
}

// Added 'form' to the ViewState
type ViewState = 'hub' | 'evaluate' | 'results' | 'form';

export default function HREvaluatePage() {
  // Navigation State
  const [view, setView] = useState<ViewState>('hub');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Data State
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedbacks, setFeedbacks] = useState<PeerFeedback[]>([]); 

  // 1. Fetch Personnel (Managers & Employees only)
  const fetchRoster = useCallback(async () => {
    try {
      setIsLoading(true);
      // Passing viewerRole=HR tells the C# controller to include Managers
      const res = await fetch('http://localhost:5076/api/Evaluation/agents?viewerRole=HR'); 
      
      if (res.ok) {
        const data: EvaluationAgentResponse[] = await res.json();
        const mappedAgents: Agent[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          department: item.department,
          peerScore: item.peerScore 
        }));
        setAgents(mappedAgents);
      } else {
        throw new Error("UNAUTHORIZED");
      }
    } catch (error) {
      toast.error("DATA LINK FAILURE: COULD NOT RETRIEVE GLOBAL ROSTER");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  // 2. Handle Selection (Navigates to Results or Evaluation Form)
  const handleSelectAgent = async (agent: Agent) => {
    setSelectedAgent(agent);
    
    if (view === 'results') {
      try {
        const res = await fetch(`http://localhost:5076/api/Evaluation/peer-results/${agent.id}`);
        if (res.ok) {
          const data: PeerFeedback[] = await res.json();
          setFeedbacks(data);
        }
      } catch (error) {
        toast.error("SECURITY ERROR: UNABLE TO ACCESS PEER DATA");
      }
    } else if (view === 'evaluate') {
      // Switch to the full-page evaluation form
      setView('form');
    }
  };

  // 3. Handle Database Submission
  const handleSubmitEvaluation = async (score: number, comment: string) => {
    if (!selectedAgent) return;

    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await fetch('http://localhost:5076/api/Evaluation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetEmployeeId: selectedAgent.id,
          evaluatorId: storedUser.employeeId, // HR's ID from local storage
          score: score,
          comments: comment
        }),
      });

      if (res.ok) {
        toast.success(`AUDIT COMMITTED: ${selectedAgent.name} FINAL SCORE: ${score}`);
        setView('hub');
        setSelectedAgent(null);
        fetchRoster(); // Refresh the list
      }
    } catch (error) {
      toast.error("DATABASE COMMIT FAILED");
    }
  };

  // 4. Render Engine
  const renderContent = () => {
    // Evaluation Form View
    if (view === 'form' && selectedAgent) {
      return (
        <HREvaluationFormUI 
          agent={selectedAgent} 
          onBack={() => setView('evaluate')} 
          onSubmit={handleSubmitEvaluation}
        />
      );
    }

    // Results Audit View
    if (selectedAgent && view === 'results') {
      return (
        <HRAuditResultsUI 
          agent={selectedAgent} 
          feedbacks={feedbacks} 
          onClose={() => setSelectedAgent(null)} 
        />
      );
    }

    // Roster List View
    if (view === 'evaluate' || view === 'results') {
      return (
        <HRTeamListUI 
          agents={agents} 
          mode={view} 
          onSelectAgent={handleSelectAgent} 
          onBack={() => {
            setView('hub');
            setSelectedAgent(null);
          }} 
        />
      );
    }

    // Main Hub View
    return <HREvaluationHubUI onNavigate={(nextView) => setView(nextView)} />;
  };

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <Toaster position="top-right" theme="dark" richColors />
      
      <HRSidebar />
      
      <section className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
       
        
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {isLoading && view !== 'hub' && view !== 'form' ? (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#020617]/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black tracking-[0.5em] text-indigo-500">DECRYPTING GLOBAL ROSTER...</p>
              </div>
            </div>
          ) : renderContent()}
        </div>
      </section>
    </main>
  );
}