'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { ShieldCheck, ArrowLeft, Save, UserCheck, Loader2, Building2, Fingerprint, Hash } from 'lucide-react';
import { ProvisionFormData } from '../../../app/(Admin)/ManageAcc/page';

interface Props {
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: ProvisionFormData;
  setFormData: Dispatch<SetStateAction<ProvisionFormData>>;
  isSubmitting: boolean;
}

export const EditAccountForm = ({ onBack, onSubmit, formData, setFormData, isSubmitting }: Props) => {
  
  const handleInputChange = (field: keyof ProvisionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="flex-1 flex flex-col overflow-y-auto bg-[#020617] relative">
      <header className="p-12 border-b border-white/5 flex justify-between items-center backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-500 font-black text-[10px] tracking-widest uppercase hover:gap-4 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Discard Changes
        </button>
        <div className="text-right">
          <h2 className="text-xl font-black text-white tracking-tighter uppercase">Modify Account</h2>
          <p className="text-[8px] font-black text-indigo-500 tracking-[0.3em]">MANUAL OVERRIDE MODE</p>
        </div>
      </header>

      <form onSubmit={onSubmit} className="p-12 max-w-4xl mx-auto w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6 text-left">
            <h3 className="text-[10px] font-black text-indigo-500 tracking-[0.4em] flex items-center gap-2 uppercase">
              <UserCheck className="w-4 h-4" /> Identity
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 tracking-widest ml-2 uppercase">Legal Name</label>
                <input 
                  required
                  value={formData.name} 
                  onChange={(e) => handleInputChange('name', e.target.value.toUpperCase())} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-indigo-500 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 tracking-widest ml-2 uppercase">Employee ID</label>
                <div className="relative">
                  <input 
                    required
                    value={formData.employeeId} 
                    onChange={(e) => handleInputChange('employeeId', e.target.value.toUpperCase())} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-xs font-black text-indigo-400 outline-none focus:border-indigo-500 transition-all" 
                  />
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-left">
            <h3 className="text-[10px] font-black text-indigo-500 tracking-[0.4em] flex items-center gap-2 uppercase">
              <ShieldCheck className="w-4 h-4" /> Authorization
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 tracking-widest ml-2 uppercase">Department</label>
                <select 
                  required 
                  value={formData.department} 
                  onChange={(e) => handleInputChange('department', e.target.value)} 
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="IT_SERVICES">IT SERVICES</option>
                  <option value="OPERATIONS">OPERATIONS</option>
                  <option value="FINANCE">FINANCE</option>
                  <option value="ADMINISTRATION">ADMINISTRATION</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 tracking-widest ml-2 uppercase">System Role</label>
                <select 
                  required 
                  value={formData.role} 
                  onChange={(e) => handleInputChange('role', e.target.value)} 
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-xs font-black text-white outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="HR">HR</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-600/5 border border-indigo-600/20 p-8 rounded-[2.5rem] flex items-center justify-between">
          <div className="flex items-center gap-4 text-left">
            <Fingerprint className="w-8 h-8 text-indigo-500" />
            <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase leading-relaxed">
              Verify all details before committing to the archive.<br />
              All changes are recorded in the audit log.
            </p>
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-indigo-500 disabled:bg-slate-800 transition-all flex items-center gap-2 uppercase"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSubmitting ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </section>
  );
};