'use client';

import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import {
  ShieldCheck, ArrowLeft, Save, Fingerprint,
  UserCheck, Loader2, Building2, CheckCircle2, Eye, EyeOff, X, Users
} from 'lucide-react';

interface ProvisionFormData {
  name: string;
  employeeId: string;
  role: string;
  department: string;
  password: string;
}

interface ApprovedApplicant {
  id: number;
  fullName: string;
  department: string;
}

interface Props {
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: ProvisionFormData;
  setFormData: Dispatch<SetStateAction<ProvisionFormData>>;
  isSubmitting: boolean;
}

export const ProvisionForm = ({ onBack, onSubmit, formData, setFormData, isSubmitting }: Props) => {
  const [showSuccessModal, setShowSuccessModal]   = useState(false);
  const [showErrorToast, setShowErrorToast]       = useState(false);
  const [errorMessage, setErrorMessage]           = useState('Critical Error: Registry Rejected');
  const [showPassword, setShowPassword]           = useState(false);
  const [savedCredentials, setSavedCredentials]   = useState({ employeeId: '', password: '' });
  const [approvedApplicants, setApprovedApplicants] = useState<ApprovedApplicant[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(true);

  // ── Fixed: credentials: 'include' so the JWT cookie is sent ───────────────
  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await fetch('http://localhost:5076/api/admin/approved-applicants', {
          credentials: 'include',   // ← THE FIX
        });
        if (res.ok) {
          const data = await res.json();
          setApprovedApplicants(data);
        } else if (res.status === 401 || res.status === 403) {
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('Failed to fetch approved applicants', err);
      } finally {
        setIsLoadingApplicants(false);
      }
    };
    fetchApproved();
  }, []);

  const handleInputChange = (field: keyof ProvisionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNameSelect = (name: string) => {
    const applicant = approvedApplicants.find(a => a.fullName === name);
    setFormData(prev => ({
      ...prev,
      name:       name,
      department: applicant?.department || prev.department,
    }));
  };

  const internalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const snapshot = { employeeId: formData.employeeId, password: formData.password };
    try {
      await onSubmit(e);
      setSavedCredentials(snapshot);
      setShowSuccessModal(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Critical Error: Registry Rejected';
      setErrorMessage(message);
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 6000);
    }
  };

  return (
    <section className="flex-1 flex flex-col overflow-y-auto bg-[#020617] relative font-sans">

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" onClick={() => setShowSuccessModal(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-[2.5rem] p-8">
            <button onClick={() => setShowSuccessModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center uppercase tracking-widest">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Account Provisioned</h3>
              <p className="text-[10px] font-bold text-slate-400 mb-8">Committed to Kernel</p>
              <div className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 mb-8 text-left">
                <p className="text-[8px] font-black text-indigo-400 mb-3">Credentials Set</p>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 font-mono">ID: <span className="text-white font-black">{savedCredentials.employeeId}</span></p>
                  <p className="text-[10px] text-slate-400 font-mono">Password: <span className="text-white font-black">{savedCredentials.password}</span></p>
                </div>
              </div>
              <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] tracking-widest">ACKNOWLEDGE</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="p-12 border-b border-white/5 flex justify-between items-center">
        <button onClick={onBack} className="flex items-center gap-2 text-indigo-500 font-black text-[10px] tracking-widest uppercase">
          <ArrowLeft size={16} /> Abort
        </button>
        <div className="text-right uppercase">
          <h2 className="text-xl font-black text-white tracking-tighter">Provision Account</h2>
          <p className="text-[8px] font-black text-indigo-500 tracking-[0.3em]">ROOT PRIVILEGE REQUIRED</p>
        </div>
      </header>

      {/* FORM */}
      <form onSubmit={internalSubmit} className="p-12 max-w-4xl mx-auto w-full space-y-12 uppercase">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* LEFT: Identity */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-indigo-500 tracking-[0.4em] flex items-center gap-2">
              <UserCheck className="w-4 h-4" /> Identity Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 tracking-widest ml-2">Full Legal Name (Approved Applicants)</label>
                <div className="relative">
                  <select
                    required
                    value={formData.name}
                    onChange={(e) => handleNameSelect(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="">{isLoadingApplicants ? 'LOADING...' : 'SELECT APPROVED APPLICANT...'}</option>
                    {approvedApplicants.map(app => (
                      <option key={app.id} value={app.fullName}>{app.fullName}</option>
                    ))}
                  </select>
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 tracking-widest ml-2">Staff ID (6 Chars)</label>
                <input
                  required
                  maxLength={6}
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange('employeeId', e.target.value.toUpperCase())}
                  placeholder="AX0000"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 tracking-widest ml-2">Password</label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-xs font-black text-white outline-none focus:border-indigo-500"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Role & Department */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-indigo-500 tracking-[0.4em] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Authority & Placement
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 tracking-widest ml-2">Department</label>
                <div className="relative">
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="">SELECT DEPARTMENT...</option>
                    <option value="IT_SERVICES">IT SERVICES</option>
                    <option value="OPERATIONS">OPERATIONS</option>
                    <option value="FINANCE">FINANCE</option>
                    <option value="HUMAN_RESOURCES">HUMAN RESOURCES</option>
                  </select>
                  <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 tracking-widest ml-2">System Role</label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="">SELECT ROLE...</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="HR">HR</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="bg-indigo-600/5 border border-indigo-600/20 p-8 rounded-[2.5rem] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Fingerprint className="w-8 h-8 text-indigo-500" />
            <p className="text-[9px] font-black text-slate-400 tracking-widest leading-relaxed">LOGS SYNCHRONIZED WITH KERNEL.</p>
          </div>
          <button
            disabled={isSubmitting}
            type="submit"
            className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2 uppercase"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />} Commit Account
          </button>
        </div>
      </form>
    </section>
  );
};