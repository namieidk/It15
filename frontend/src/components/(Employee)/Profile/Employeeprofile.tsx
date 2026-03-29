'use client';

import React from 'react';
import { 
  User, Mail, Phone, MapPin, Briefcase, 
  ShieldCheck, Fingerprint, Camera, Edit3, Award, Loader2, Lock, X 
} from 'lucide-react';

export interface EmployeeData {
  name: string;
  employeeId: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  workstation: string;
  profileImage?: string;
  bannerImage?: string;
}

export interface EditForm {
  email: string;
  phone: string;
  workstation: string;
}

interface EmployeeProfileUIProps {
  data: EmployeeData;
  showModal: boolean;
  saving: boolean;
  editForm: EditForm;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onSave: () => void;
  onEditChange: (field: keyof EditForm, value: string) => void;
  onAvatarClick: () => void;
  onBannerClick: () => void;
}

export const EmployeeProfileUI = ({
  data, showModal, saving, editForm,
  onOpenModal, onCloseModal, onSave, onEditChange,
  onAvatarClick, onBannerClick
}: EmployeeProfileUIProps) => {

  return (
    <section className="flex-1 flex flex-col overflow-y-auto bg-[#020617] uppercase">
      
      {/* ── BANNER ── */}
      <div 
        onClick={onBannerClick} 
        className="h-64 bg-slate-900 border-b border-white/5 relative shrink-0 cursor-pointer group overflow-hidden"
      >
        {data.bannerImage ? (
          <img src={data.bannerImage} className="w-full h-full object-cover opacity-70" alt="Banner" />
        ) : (
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-indigo-900" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10">
           <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <Camera className="w-4 h-4 text-white" />
              <span className="text-[9px] font-black text-white tracking-[0.3em]">Update Banner</span>
           </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <div className="px-12 -mt-24 relative z-20 flex flex-col md:flex-row items-end justify-between gap-10">
          <div className="flex flex-col md:flex-row items-end gap-10">
              <div className="relative group">
                  <div onClick={onAvatarClick} className="w-48 h-48 rounded-[3.5rem] bg-slate-800 border-[8px] border-[#020617] flex items-center justify-center overflow-hidden cursor-pointer shadow-2xl">
                      {data.profileImage ? <img src={data.profileImage} className="w-full h-full object-cover" alt="Avatar" /> : <User className="w-24 h-24 text-slate-600" />}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Camera className="w-6 h-6 text-white" /></div>
                  </div>
                  {saving && <div className="absolute inset-0 bg-black/40 rounded-[3.5rem] flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>}
              </div>

              <div className="mb-6 space-y-2">
                  <div className="flex items-center gap-4">
                      <h1 className="text-5xl font-black text-white tracking-tighter leading-none">{data.name}</h1>
                      <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md flex items-center gap-2">
                          <ShieldCheck className="w-3 h-3 text-indigo-400" />
                          <span className="text-[8px] font-black text-indigo-400 tracking-widest uppercase">Verified Personnel</span>
                      </div>
                  </div>
                  <p className="text-sm font-black text-slate-500 tracking-[0.3em]">{data.role} · {data.department}</p>
              </div>
          </div>

          <button onClick={onOpenModal} className="mb-8 flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black tracking-widest hover:bg-indigo-600 transition-all">
              <Edit3 className="w-4 h-4" /> Edit Biometrics
          </button>
      </div>

      {/* ── INFO GRID ── */}
      <div className="p-12 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
             <h3 className="text-xs font-black text-indigo-500 tracking-[0.4em] px-4 flex items-center gap-3"><Fingerprint className="w-4 h-4" /> Personnel Dossier</h3>
             <div className="bg-slate-900/20 border border-white/5 rounded-[3rem] p-10 space-y-8 backdrop-blur-sm">
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-600 tracking-[0.2em]">Email</p>
                   <p className="text-xs font-black text-white tracking-widest flex items-center gap-3"><Mail className="w-4 h-4 text-indigo-500" /> {data.email}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-600 tracking-[0.2em]">Phone</p>
                   <p className="text-xs font-black text-white tracking-widest flex items-center gap-3"><Phone className="w-4 h-4 text-indigo-500" /> {data.phone}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-600 tracking-[0.2em]">Workstation</p>
                   <p className="text-xs font-black text-white tracking-widest flex items-center gap-3"><MapPin className="w-4 h-4 text-indigo-500" /> {data.workstation}</p>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <h3 className="text-xs font-black text-indigo-400 tracking-[0.4em] px-4 flex items-center gap-3"><Award className="w-4 h-4" /> System Identity</h3>
             <div className="bg-slate-900/20 border border-white/5 rounded-[3rem] p-10 space-y-8 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                   <div>
                      <p className="text-[9px] font-black text-slate-600 tracking-[0.2em]">Serial Number</p>
                      <p className="text-xs font-black text-white tracking-widest">{data.employeeId}</p>
                   </div>
                   <Lock className="w-4 h-4 text-slate-700" />
                </div>
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-600 tracking-[0.2em]">Status</p>
                   <p className="text-xs font-black text-emerald-500 tracking-widest flex items-center gap-3"><ShieldCheck className="w-4 h-4" /> Active Personnel</p>
                </div>
             </div>
          </div>
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#0a0f1e] border border-white/10 rounded-[3rem] w-full max-w-lg shadow-2xl">
             <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-sm font-black text-white">Modify Biometrics</h2>
                <X onClick={onCloseModal} className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white" />
             </div>
             <div className="p-10 space-y-6">
                {['email', 'phone', 'workstation'].map((field) => (
                  <div key={field}>
                    <label className="text-[9px] font-black text-slate-500 tracking-[0.3em] block mb-2">{field.toUpperCase()}</label>
                    <input 
                      type="text" 
                      value={editForm[field as keyof EditForm]} 
                      onChange={(e) => onEditChange(field as keyof EditForm, e.target.value)}
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white text-xs font-bold outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                ))}
                <button onClick={onSave} disabled={saving} className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] tracking-widest transition-all">
                  {saving ? 'Syncing...' : 'Commit Changes'}
                </button>
             </div>
          </div>
        </div>
      )}
    </section>
  );
};