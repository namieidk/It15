'use client';

import React, { useState, useEffect } from 'react';
import { HRSidebar } from '../../../components/(Hr)/Dashboard/sidebar';
import { HRApprovalsUI, ApprovalRequest } from '../../../components/(Hr)/Approval/Hrapprovalsui';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function HRApprovalsPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'SUCCESS' | 'ERROR' } | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      // Only fetches MANAGER_APPROVED requests — manager-rejected ones never appear here
      const response = await fetch('http://localhost:5076/api/Leave/hr-pending');
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('HR Queue Sync Error:', error);
      setFetchError(
        error instanceof TypeError && error.message === 'Failed to fetch'
          ? 'Cannot reach the server. Make sure your ASP.NET backend is running on port 5076.'
          : String(error)
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const showToast = (message: string, type: 'SUCCESS' | 'ERROR') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async (requestId: number, actionType: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch('http://localhost:5076/api/Leave/hr-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ RequestId: requestId, Status: actionType }),
      });

      if (response.ok) {
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        showToast(
          actionType === 'APPROVED'
            ? 'LEAVE FULLY APPROVED — CREDITS DEDUCTED'
            : 'REQUEST DENIED BY HR',
          'SUCCESS'
        );
      } else {
        const err = await response.json().catch(() => ({ message: 'Unknown error' }));
        showToast(err.message?.toUpperCase() ?? 'TRANSACTION FAILED', 'ERROR');
      }
    } catch {
      showToast('NETWORK ERROR', 'ERROR');
    }
  };

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase relative">
      <HRSidebar />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl border backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl ${
            toast.type === 'SUCCESS'
              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'SUCCESS' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-[10px] font-black tracking-[0.3em]">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center bg-[#020617]">
          <div className="text-indigo-500 font-black animate-pulse tracking-[0.5em] text-[10px]">
            SYNCING HR QUEUE...
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && fetchError && (
        <div className="flex-1 flex items-center justify-center bg-[#020617]">
          <div className="flex flex-col items-center gap-6 max-w-md text-center">
            <div className="h-16 w-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.3em] text-red-400 mb-2">CONNECTION FAILED</p>
              <p className="text-[11px] text-slate-500 font-bold tracking-widest leading-relaxed">{fetchError}</p>
            </div>
            <button
              onClick={fetchRequests}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600/10 border border-indigo-600/30 rounded-2xl text-[10px] font-black text-indigo-400 tracking-widest hover:bg-indigo-600/20 transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              RETRY CONNECTION
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !fetchError && (
        <HRApprovalsUI requests={requests} onAction={handleAction} />
      )}
    </main>
  );
}