'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { HRSidebar } from '../../../components/(Hr)/Dashboard/sidebar';
import { NavbarWrapper } from '../../../components/(Employee)/Dashboard/NavbarWrapper';
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
      }
    } catch (e) { 
      toast.error("Failed to connect to database");
    } finally { 
      setIsLoading(false); 
    }
  }, []);

  useEffect(() => { fetchRoster(); }, [fetchRoster]);

  const handleSave = async (payload: ScheduleSavePayload) => {
    const promise = fetch('http://localhost:5076/api/Schedule/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    toast.promise(promise, {
      loading: 'Updating deployment parameters...',
      success: () => {
        fetchRoster();
        return `Schedule for ID ${payload.employeeId} has been synchronized`;
      },
      error: 'Database rejection: Check connection strings',
    });
  };

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <Toaster position="top-right" theme="dark" richColors />
      <HRSidebar />
      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
        <NavbarWrapper />
        <HRScheduleUI 
          employees={employees} 
          onSave={handleSave} 
          isLoading={isLoading} 
        />
      </section>
    </main>
  );
}