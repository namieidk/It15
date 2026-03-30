'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LeaveRequestForm } from '../../../components/(Employee)/LeaveReq/LeaveRequestForm';
import { Sidebar } from '@/src/components/(Employee)/Dashboard/Sidebar';
import { SessionGuard } from '@/src/components/SessionGuard';
import { Calendar, Clock, LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

interface LeaveHistoryItem {
  type: string;
  date: string;
  status: string;
  color: string;
  icon: LucideIcon;
}

interface LeaveHistoryAPIResponse {
  type: string;
  date: string;
  status: string;
}

export default function LeaveReqPage() {
  const [credits, setCredits] = useState<number>(15);
  const [history, setHistory] = useState<LeaveHistoryItem[]>([]);
  const [requestedDays, setRequestedDays] = useState<number>(0);
  const [dates, setDates] = useState({ start: '', end: '' });

  const getEmployeeId = useCallback((): number | null => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.employeeId ? parseInt(user.employeeId) : null;
    } catch { return null; }
  }, []);

  const fetchHistory = useCallback(async (employeeId: number) => {
    try {
      const res = await fetch(`http://localhost:5076/api/Leave/history/${employeeId}`);
      if (res.ok) {
        const data: LeaveHistoryAPIResponse[] = await res.json();
        const mappedData: LeaveHistoryItem[] = data.map((item) => {
          const status = item.status.toUpperCase();
          return {
            type: item.type,
            date: new Date(item.date).toLocaleDateString('en-PH', { 
              day: '2-digit', month: 'short', year: 'numeric' 
            }),
            status: status,
            color: status === 'APPROVED' ? 'emerald' : status === 'REJECTED' ? 'red' : 'indigo',
            icon: status === 'PENDING' ? Clock : Calendar,
          };
        });
        setHistory(mappedData);
      }
    } catch (err) { console.error("Fetch Error:", err); }
  }, []);

  // Combined effect to handle initial data load
  useEffect(() => {
    const id = getEmployeeId();
    if (!id) return;

    const loadInitialData = async () => {
      try {
        // Fetch Credits
        const creditsRes = await fetch(`http://localhost:5076/api/Leave/credits/${id}`);
        if (creditsRes.ok) {
          const data = await creditsRes.json();
          setCredits(data.balance ?? data.credits ?? 15);
        }
        // Fetch History
        await fetchHistory(id);
      } catch (err) {
        console.error("Initialization Error:", err);
      }
    };

    loadInitialData();
  }, [getEmployeeId, fetchHistory]);

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(value) < today) {
      toast.error("INVALID DATE: PAST DATES RESTRICTED");
      return; 
    }
    const updated = { ...dates, [type]: value };
    setDates(updated);
    if (updated.start && updated.end) {
      const diff = Math.ceil((new Date(updated.end).getTime() - new Date(updated.start).getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setRequestedDays(diff > 0 ? diff : 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const employeeId = getEmployeeId();
    const formData = new FormData(e.currentTarget);
    const reason = formData.get('reason') as string;

    if (!employeeId || requestedDays <= 0) {
      toast.error("PLEASE SELECT VALID DATES");
      return;
    }

    const promise = fetch('http://localhost:5076/api/Leave/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId,
        leaveType: formData.get('leaveType'),
        startDate: dates.start,
        endDate: dates.end,
        reason,
      }),
    });

    toast.promise(promise, {
      loading: 'TRANSMITTING REQUEST...',
      success: (res) => {
        if (!res.ok) throw new Error();
        setDates({ start: '', end: '' });
        setRequestedDays(0);
        (e.target as HTMLFormElement).reset();
        fetchHistory(employeeId);
        return 'REQUEST TRANSMITTED SUCCESSFULLY';
      },
      error: 'FAILED TO TRANSMIT REQUEST',
    });
  };

  return (
    <SessionGuard allowedRoles={['EMPLOYEE']}>
      <main className="h-screen w-full flex bg-[#050510] text-slate-200 overflow-hidden font-sans uppercase italic">
        <Sidebar />
        <LeaveRequestForm
          credits={credits}
          history={history}
          requestedDays={requestedDays}
          dates={dates}
          onDateChange={handleDateChange}
          onSubmit={handleSubmit}
        />
      </main>
    </SessionGuard>
  );
}