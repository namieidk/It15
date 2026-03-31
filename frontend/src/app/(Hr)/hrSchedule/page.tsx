'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { HRSidebar } from '../../../components/(Hr)/Dashboard/sidebar';
import { HRScheduleUI, EmployeeSchedule, ScheduleSavePayload } from '../../../components/(Hr)/Schedule/HrSchedule';

export default function HRSchedulePage() {
  const [employees, setEmployees] = useState<EmployeeSchedule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchRoster = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:5076/api/Schedule/roster');
      if (res.ok) {
        const data: EmployeeSchedule[] = await res.json();
        setEmployees(data);
      } else {
        toast.error("Registry Sync Failed", {
          description: "Server returned an error status."
        });
      }
    } catch (e) { 
      toast.error("Database Connection Lost", {
        description: "Check if the backend API is running."
      });
    } finally { 
      setIsLoading(false); 
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => { 
    fetchRoster(); 
  }, [fetchRoster]);

  /**
   * Handles the saving of new deployment parameters.
   * Updates the Schedule and initializes/verifies the Leave Profile in the Employee table.
   */
  const handleSave = async (payload: ScheduleSavePayload) => {
    try {
      const response = await fetch('http://localhost:5076/api/Schedule/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("Deployment Synchronized", {
          description: `Schedule and Leave Profile updated for Agent ID: ${payload.employeeId}`
        });
        // Refresh the UI with the latest data
        fetchRoster();
      } else {
        const errorData = await response.json();
        toast.error("Database Rejection", {
          description: errorData.message || "The server rejected the sync request."
        });
      }
    } catch (error) {
      toast.error("Network Link Failure", {
        description: "Could not reach the server to commit deployment."
      });
    }
  };

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      {/* Toast Notification Container */}
      <Toaster position="top-right" theme="dark" richColors />
      
      {/* Sidebar Navigation */}
      <HRSidebar />

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
       
        
        {/* Main UI Content Grid */}
        <HRScheduleUI 
          employees={employees} 
          onSave={handleSave} 
          isLoading={isLoading} 
        />
        
      </section>
    </main>
  );
}