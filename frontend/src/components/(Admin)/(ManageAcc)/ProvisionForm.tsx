'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';

import { 
  ShieldCheck, ArrowLeft, Save, Fingerprint, 
  UserCheck, Loader2, Building2, CheckCircle2, XCircle, Eye, EyeOff, X
} from 'lucide-react';

interface ProvisionFormData {
  name: string;
  employeeId: string;
  role: string;
  department: string;
  password: string;
}

interface Props {
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: ProvisionFormData;
  setFormData: Dispatch<SetStateAction<ProvisionFormData>>;
  isSubmitting: boolean;
}

export const ProvisionForm = ({ onBack, onSubmit, formData, setFormData, isSubmitting }: Props) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Critical Error: Registry Rejected');
  const [showPassword, setShowPassword] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState({ employeeId: '', password: '' });

  const handleCloseModal = () => setShowSuccessModal(false);

  const handleInputChange = (field: keyof ProvisionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const internalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Snapshot credentials BEFORE onSubmit resets the form
    const snapshot = { employeeId: formData.employeeId, password: formData.password };
    try {
      await onSubmit(e);
      setSavedCredentials(snapshot);
      setShowSuccessModal(true);
    } catch (err: unknown) {
      console.error("PROVISION ERROR:", err);
      const message = err instanceof Error ? err.message : 'Critical Error: Registry Rejected';
      setErrorMessage(message);
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 6000);
    }
  };

  return (
    <section className="flex-1 flex flex-col overflow-y-auto bg-[#020617] relative">

      {/* --- SUCCESS MODAL (Updated to Indigo Theme) --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md" onClick={handleCloseModal} />
          <div className="relative w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-[2.5rem] p-8 shadow-[0_0_50px_-12px_rgba(79,70,229,0.2)]">
            <button onClick={handleCloseModal} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Account Provisioned</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
                The user has been committed to the kernel.
              </p>
              <div className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 mb-8 text-left">
                <p className="text-[8px] font-black text-indigo-400 tracking-[0.2em] uppercase mb-3">Credentials Set</p>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 font-mono">
                    ID: <span className="text-white font-black">{savedCredentials.employeeId}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Password: <span className="text-white font-black">{savedCredentials.password}</span>
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={handleCloseModal}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- ERROR TOAST --- */}
      {showErrorToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] max-w-lg w-full px-4">
          <div className="flex items-center gap-4 px-8 py-5 rounded-2xl border border-red-500/50 bg-red-500/10 text-red-400 backdrop-blur-xl">
            <XCircle className="w-6 h-6 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em]">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="p-12 border-b border-white/5 flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-500 font-black text-[10px] tracking-widest uppercase hover:gap-4 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Abort Provisioning
        </button>
        <div className="text-right">
          <h2 className="text-xl font-black text-white tracking-tighter uppercase">Provision New Account</h2>
          <p className="text-[8px] font-black text-indigo-500 tracking-[0.3em]">ROOT PRIVILEGE REQUIRED</p>
        </div>
      </header>

      {/* --- FORM --- */}
      <form onSubmit={internalSubmit} className="p-12 max-w-4xl mx-auto w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">

          {/* LEFT: Identity */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-indigo-500 tracking-[0.4em] flex items-center gap-2 uppercase">
              <UserCheck className="w-4 h-4" /> Identity Details
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 tracking-widest ml-2 uppercase">Full Legal Name</label>
                <input 
                  required 
                  value={formData.name} 
                  onChange={(e) => handleInputChange('name', e.target.value.toUpperCase())} 
                  placeholder="ENTER NAME..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-indigo-500 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 tracking-widest ml-2 uppercase">Staff ID (6 Chars)</label>
                <input 
                  required 
                  maxLength={6} 
                  value={formData.employeeId} 
                  onChange={(e) => handleInputChange('employeeId', e.target.value.toUpperCase())} 
                  placeholder="AX0000" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-indigo-500 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 tracking-widest ml-2 uppercase">Password</label>
                <div className="relative">
                  <input 
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password} 
                    onChange={(e) => handleInputChange('password', e.target.value)} 
                    placeholder="Set account password..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-xs font-black text-white outline-none focus:border-indigo-500 transition-all" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Role & Department */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-indigo-500 tracking-[0.4em] flex items-center gap-2 uppercase">
              <ShieldCheck className="w-4 h-4" /> Authority & Placement
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 tracking-widest ml-2 uppercase">Department</label>
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
                  </select>
                  <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 tracking-widest ml-2 uppercase">System Role</label>
                <select 
                  required 
                  value={formData.role} 
                  onChange={(e) => handleInputChange('role', e.target.value)} 
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="">SELECT ROLE...</option>
                  <option value="HR">HR</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* --- SUBMIT --- */}
        <div className="bg-indigo-600/5 border border-indigo-600/20 p-8 rounded-[2.5rem] flex items-center justify-between">
          <div className="flex items-center gap-4 text-left">
            <Fingerprint className="w-8 h-8 text-indigo-500" />
            <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase leading-relaxed">
              Provisioning grants immediate security clearance. <br /> Logs will be synchronized with the kernel.
            </p>
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2 uppercase"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Commit Account
          </button>
        </div>
      </form>
    </section>
  );
};