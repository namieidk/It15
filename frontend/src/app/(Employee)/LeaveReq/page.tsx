'use client';

import React, { useState, useEffect } from 'react';
import { LeaveRequestForm } from '../../../components/(Employee)/LeaveReq/LeaveRequestForm';
import { Sidebar } from '@/src/components/(Employee)/Dashboard/Sidebar';
import { SessionGuard } from '@/src/components/SessionGuard';
import { Calendar } from 'lucide-react';

interface LeaveHistory {
  type: string;
  date: string;
  status: string;
  color: string;
  icon: React.ElementType;
}

interface LeaveHistoryAPI {
  type: string;
  date: string;
  status: string;
}

export default function LeaveReqPage() {
  const [credits, setCredits] = useState(0);
  const [history, setHistory] = useState<LeaveHistory[]>([]);
  const [requestedDays, setRequestedDays] = useState(0);
  const [dates, setDates] = useState({ start: '', end: '' });
  const [popup, setPopup] = useState({ show: false, msg: '', type: 'success' as 'success' | 'error' });

  const getEmployeeId = (): number | null => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return parseInt(user.employeeId);
    } catch {
      return null;
    }
  };

  const mapHistory = (data: LeaveHistoryAPI[]): LeaveHistory[] =>
    data.map((item) => ({
      type: item.type,
      date: item.date,
      status: item.status,
      color: item.status === 'APPROVED' ? 'green' : item.status === 'REJECTED' ? 'red' : 'indigo',
      icon: Calendar,
    }));

  // ✅ Only used for post-submit refresh (event handler, not effect)
  const fetchHistory = async (employeeId: number) => {
    try {
      const res = await fetch(`http://localhost:5076/api/Leave/history/${employeeId}`);
      if (res.ok) {
        const data: LeaveHistoryAPI[] = await res.json();
        setHistory(mapHistory(data));
      }
    } catch {
      console.error('Failed to fetch history');
    }
  };

  // ✅ Inline async IIFE — satisfies strict linter
  useEffect(() => {
    const id = getEmployeeId();
    if (!id) return;

    (async () => {
      try {
        const [creditsRes, historyRes] = await Promise.all([
          fetch(`http://localhost:5076/api/Leave/credits/${id}`),
          fetch(`http://localhost:5076/api/Leave/history/${id}`),
        ]);

        if (creditsRes.ok) {
          const data = await creditsRes.json();
          setCredits(data.balance);
        }

        if (historyRes.ok) {
          const data: LeaveHistoryAPI[] = await historyRes.json();
          setHistory(mapHistory(data));
        }
      } catch {
        console.error('Failed to load leave data');
      }
    })();
  }, []);

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const updated = { ...dates, [type]: value };
    setDates(updated);
    if (updated.start && updated.end) {
      const diff = (new Date(updated.end).getTime() - new Date(updated.start).getTime()) / (1000 * 60 * 60 * 24) + 1;
      setRequestedDays(diff > 0 ? diff : 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const employeeId = getEmployeeId();

    try {
      const res = await fetch('http://localhost:5076/api/Leave/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          leaveType: data.get('leaveType'),
          startDate: data.get('startDate'),
          endDate: data.get('endDate'),
          reason: data.get('reason'),
        }),
      });

      const result = await res.json();
      if (res.ok) {
        setPopup({ show: true, msg: result.message || 'Leave request transmitted.', type: 'success' });
        form.reset();
        setRequestedDays(0);
        if (employeeId) fetchHistory(employeeId);
      } else {
        setPopup({ show: true, msg: result.message || 'Request failed.', type: 'error' });
      }
    } catch {
      setPopup({ show: true, msg: 'Communications failure. Backend offline.', type: 'error' });
    }
  };

  return (
    <SessionGuard allowedRoles={['EMPLOYEE']}>
      <main className="h-screen w-full flex bg-[#050510] text-slate-200 overflow-hidden font-sans uppercase">
        <Sidebar />
        <LeaveRequestForm
          credits={credits}
          history={history}
          requestedDays={requestedDays}
          onDateChange={handleDateChange}
          onSubmit={handleSubmit}
          popup={popup}
          closePopup={() => setPopup({ ...popup, show: false })}
        />
      </main>
    </SessionGuard>
  );
}