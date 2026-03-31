'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Toaster, toast } from 'sonner';
import { AdminSidebar } from '../../../components/(Admin)/Sidebar';
import { AccountList, UserAccount } from '../../../components/(Admin)/(ManageAcc)/AccountList';
import { ProvisionForm } from '../../../components/(Admin)/(ManageAcc)/ProvisionForm';
import { EditAccountForm } from '../../../components/(Admin)/(ManageAcc)/EditAccountForm';
import { SessionGuard } from '../../../components/SessionGuard';
import { ShieldAlert, Loader2 } from 'lucide-react';

export interface ProvisionFormData {
  id?: number;
  name: string;
  employeeId: string;
  role: string;
  department: string;
  password: string;
}

export default function ManageAccountsPage() {
  const [view, setView]               = useState<'list' | 'create' | 'edit'>('list');
  const [accounts, setAccounts]       = useState<UserAccount[]>([]);
  const [loading, setLoading]         = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [roleFilter, setRoleFilter]     = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage]   = useState(1);
  const itemsPerPage = 8;

  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [targetRevokeId, setTargetRevokeId]   = useState<number | null>(null);

  const [formData, setFormData] = useState<ProvisionFormData>({
    id: 0, name: '', employeeId: '', role: '', department: '', password: '',
  });

  useEffect(() => { fetchAccounts(); }, []);

  // ── Fixed: credentials: 'include' on every fetch call ─────────────────────
  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://localhost:5076/api/admin/accounts', {
        credentials: 'include',    // ← THE FIX
      });
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      } else if (response.status === 401 || response.status === 403) {
        window.location.href = '/login';
      }
    } catch (error) {
      toast.error('DATABASE OFFLINE', { description: 'Could not connect to the system kernel.' });
    } finally {
      setLoading(false);
    }
  };

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const matchRole   = roleFilter   === 'ALL' || acc.role.toUpperCase() === roleFilter.toUpperCase();
      const matchStatus = statusFilter === 'ALL' || (acc.status || 'ACTIVE').toUpperCase() === statusFilter.toUpperCase();
      return matchRole && matchStatus;
    });
  }, [accounts, roleFilter, statusFilter]);

  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAccounts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAccounts, currentPage]);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  const handleEditClick = (account: UserAccount) => {
    setFormData({
      id:         account.id,
      name:       account.name,
      employeeId: account.employeeId,
      role:       account.role,
      department: account.department || 'OPERATIONS',
      password:   '',
    });
    setView('edit');
  };

  const handleReactivate = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5076/api/admin/reactivate-account/${id}`, {
        method:      'PUT',
        credentials: 'include',    // ← THE FIX
      });
      if (response.ok) {
        toast.success('IDENTITY RESTORED');
        fetchAccounts();
      } else if (response.status === 401 || response.status === 403) {
        window.location.href = '/login';
      }
    } catch {
      toast.error('RESTORE FAILED');
    }
  };

  const executeRevoke = async () => {
    if (!targetRevokeId) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5076/api/admin/revoke-account/${targetRevokeId}`, {
        method:      'PUT',
        credentials: 'include',    // ← THE FIX
      });
      if (response.ok) {
        setShowRevokeModal(false);
        toast.warning('ACCESS REVOKED');
        fetchAccounts();
      } else if (response.status === 401 || response.status === 403) {
        window.location.href = '/login';
      }
    } finally {
      setIsSubmitting(false);
      setTargetRevokeId(null);
    }
  };

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5076/api/admin/provision', {
        method:      'POST',
        credentials: 'include',    // ← THE FIX
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success('PROVISION SUCCESSFUL');
        fetchAccounts();
        setView('list');
      } else if (response.status === 401 || response.status === 403) {
        window.location.href = '/login';
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5076/api/admin/update-account/${formData.id}`, {
        method:      'PUT',
        credentials: 'include',    // ← THE FIX
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success('IDENTITY UPDATED');
        fetchAccounts();
        setView('list');
      } else if (response.status === 401 || response.status === 403) {
        window.location.href = '/login';
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SessionGuard allowedRoles={['ADMIN']}>
      <Toaster position="top-right" richColors theme="dark" />
      <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase italic font-black relative">
        <AdminSidebar />

        {showRevokeModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[#020617]/80" onClick={() => !isSubmitting && setShowRevokeModal(false)} />
            <div className="relative w-full max-w-md bg-slate-900 border border-red-500/30 rounded-[2.5rem] p-10">
              <div className="flex flex-col items-center text-center">
                <ShieldAlert className="w-12 h-12 text-red-500 mb-6" />
                <h3 className="text-xl text-white mb-8 italic">REVOKE ACCESS?</h3>
                <div className="flex flex-col w-full gap-3">
                  <button
                    onClick={executeRevoke}
                    disabled={isSubmitting}
                    className="w-full py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-[10px] tracking-widest transition-all italic"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'CONFIRM TERMINATION'}
                  </button>
                  <button
                    onClick={() => setShowRevokeModal(false)}
                    className="w-full py-5 bg-white/5 text-slate-400 rounded-2xl font-black text-[10px] tracking-widest italic"
                  >
                    ABORT
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'list' && (
          <AccountList
            accounts={paginatedAccounts}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAccounts.length}
            onPageChange={setCurrentPage}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onCreateClick={() => setView('create')}
            onEditClick={handleEditClick}
            onRevokeClick={(id) => { setTargetRevokeId(id); setShowRevokeModal(true); }}
            onReactivateClick={handleReactivate}
          />
        )}

        {view === 'create' && (
          <ProvisionForm
            onBack={() => setView('list')}
            onSubmit={handleProvision}
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
          />
        )}
        {view === 'edit' && (
          <EditAccountForm
            onBack={() => setView('list')}
            onSubmit={handleUpdate}
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
          />
        )}
      </main>
    </SessionGuard>
  );
}