'use client';

import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
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
  // --- VIEW & DATA STATES ---
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [accounts, setAccounts] = useState<UserAccount[]>([]); 
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- NOTIFICATION STATES ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // --- REVOKE MODAL STATES ---
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [targetRevokeId, setTargetRevokeId] = useState<number | null>(null);

  // --- FORM STATE ---
  const [formData, setFormData] = useState<ProvisionFormData>({ 
    id: 0, name: '', employeeId: '', role: '', department: '', password: ''
  });

  // --- INITIAL FETCH ---
  useEffect(() => { 
    fetchAccounts(); 
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5076/api/admin/accounts");
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error("Database fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const showSuccessNotification = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // --- NAVIGATION HANDLERS ---
  const handleEditClick = (account: UserAccount) => {
    setFormData({
      id: account.id,
      name: account.name,
      employeeId: account.employeeId,
      role: account.role,
      department: account.department || 'OPERATIONS',
      password: '' 
    });
    setView('edit');
  };

  const openRevokeConfirm = (id: number) => {
    setTargetRevokeId(id);
    setShowRevokeModal(true);
  };

  // --- API ACTIONS ---

  const handleReactivate = async (id: number) => {
    try {
      // ✅ Matches RestoreAccount in C#
      const response = await fetch(`http://localhost:5076/api/admin/reactivate-account/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        showSuccessNotification('✓ ACCOUNT ACCESS RESTORED');
        await fetchAccounts();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`REACTIVATE FAILED: ${errorData.message || 'Server Error'}`);
      }
    } catch (error) {
      alert("NETWORK ERROR: Connection to kernel failed.");
    }
  };

  const executeRevoke = async () => {
    if (!targetRevokeId) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5076/api/admin/revoke-account/${targetRevokeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        setShowRevokeModal(false);
        showSuccessNotification('✓ ACCOUNT ACCESS REVOKED');
        await fetchAccounts();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`REVOKE FAILED: ${errorData.message || 'Server Error'}`);
      }
    } catch (error) {
      console.error("Revoke error:", error);
      alert("NETWORK ERROR: Connection to kernel failed.");
    } finally {
      setIsSubmitting(false);
      setTargetRevokeId(null);
    }
  };

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5076/api/admin/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchAccounts();
        setFormData({ name: '', employeeId: '', role: '', department: '', password: '' });
        showSuccessNotification('✓ ACCOUNT PROVISIONED SUCCESSFULLY');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Provisioning Failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:5076/api/admin/update-account/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          employeeId: formData.employeeId,
          role: formData.role,
          department: formData.department
        }),
      });

      if (response.ok) {
        await fetchAccounts();
        showSuccessNotification('✓ IDENTITY UPDATED SUCCESSFULLY');
        setTimeout(() => setView('list'), 1500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Could not update account.");
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SessionGuard allowedRoles={['ADMIN']}>
      <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase relative">
        <AdminSidebar />
        
        {showSuccess && (
          <div className="absolute top-10 right-10 z-[100] bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            {successMessage}
          </div>
        )}

        {/* --- CUSTOM REVOKE MODAL --- */}
        {showRevokeModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[#020617]/80" onClick={() => !isSubmitting && setShowRevokeModal(false)} />
            <div className="relative w-full max-w-md bg-slate-900 border border-red-500/30 rounded-[2.5rem] p-10 shadow-[0_0_50px_-12px_rgba(239,68,68,0.2)]">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                  <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-white tracking-tighter uppercase mb-4">Confirm Access Revocation</h3>
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed tracking-widest uppercase mb-8">
                  Warning: This action will freeze this identity in the system. <br/>
                  Target Staff ID: <span className="text-red-500 font-black">
                    {accounts.find(a => a.id === targetRevokeId)?.employeeId || 'UNKNOWN'}
                  </span>
                </p>
                <div className="flex flex-col w-full gap-3">
                  <button 
                    onClick={executeRevoke}
                    disabled={isSubmitting}
                    className="w-full py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Execute Revocation'}
                  </button>
                  <button onClick={() => setShowRevokeModal(false)} disabled={isSubmitting} className="w-full py-5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all">Abort Command</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MAIN VIEWS --- */}
        {view === 'list' && (
          <AccountList 
            accounts={accounts} 
            loading={loading} 
            onCreateClick={() => {
              setFormData({ name: '', employeeId: '', role: '', department: '', password: '' });
              setView('create');
            }} 
            onEditClick={handleEditClick} 
            onRevokeClick={openRevokeConfirm} 
            onReactivateClick={handleReactivate} // ✅ Passed here
          />
        )}

        {view === 'create' && (
          <ProvisionForm 
            onBack={() => setView('list')} 
            onSubmit={handleProvision}
            formData={formData} 
            setFormData={setFormData as Dispatch<SetStateAction<ProvisionFormData>>}
            isSubmitting={isSubmitting}
          />
        )}

        {view === 'edit' && (
          <EditAccountForm 
            onBack={() => setView('list')} 
            onSubmit={handleUpdate} 
            formData={formData} 
            setFormData={setFormData as Dispatch<SetStateAction<ProvisionFormData>>}
            isSubmitting={isSubmitting}
          />
        )}
      </main>
    </SessionGuard>
  );
}