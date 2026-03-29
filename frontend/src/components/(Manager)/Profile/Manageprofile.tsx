'use client';

import React from 'react';
import {
  User, ShieldCheck, Settings, Mail, Phone,
  MapPin, Briefcase, Lock, ChevronRight, Fingerprint, Loader2, X, Save, Camera
} from 'lucide-react';

export interface DirectReport { name: string; role: string; status: string; }

export interface UserData {
  name:          string;
  employeeId:    string;
  role:          string;
  department:    string;
  email:         string;
  phone:         string;
  workstation:   string;
  status:        string;
  teamSize:      number;
  directReports: DirectReport[];
  profileImage?: string; 
  bannerImage?:  string; 
}

export interface EditForm {
  email:       string;
  phone:       string;
  workstation: string;
}

interface ManagerProfileUIProps {
  data:          UserData;
  showModal:     boolean;
  saving:        boolean;
  saveError:     string | null;
  editForm:      EditForm;
  onOpenModal:   () => void;
  onCloseModal:  () => void;
  onSave:        () => void;
  onEditChange:  (field: keyof EditForm, value: string) => void;
  onAvatarClick: () => void;
  onBannerClick: () => void; 
}

export const ManagerProfileUI = ({
  data, showModal, saving, saveError, editForm,
  onOpenModal, onCloseModal, onSave, onEditChange,
  onAvatarClick, onBannerClick
}: ManagerProfileUIProps) => {
  
  const formFields: (keyof EditForm)[] = ['email', 'phone', 'workstation'];

  return (
    <>
      <section className="flex-1 flex flex-col overflow-y-auto bg-[#020617] relative">

        {/* ── BANNER SECTION ────────────────────────────────────────── */}
        <div 
          onClick={onBannerClick}
          className="h-64 bg-slate-900 border-b border-white/5 relative shrink-0 cursor-pointer group overflow-hidden"
        >
          {data.bannerImage ? (
            <img src={data.bannerImage} className="w-full h-full object-cover" alt="Banner" />
          ) : (
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-blue-900/20" />
          )}
          
          {/* Banner Hover UI */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <Camera className="w-4 h-4 text-white" />
              <span className="text-[9px] font-black text-white tracking-[0.3em] uppercase">Update Banner</span>
            </div>
          </div>
        </div>

        {/* ── PROFILE HEADER (Positioned to overlap banner) ─────────── */}
        <div className="px-12 relative z-20 -mt-20 flex items-end gap-8">
          {/* AVATAR */}
          <div 
            onClick={(e) => { e.stopPropagation(); onAvatarClick(); }}
            className="w-44 h-44 rounded-[2.5rem] bg-slate-800 border-[8px] border-[#020617] flex items-center justify-center shadow-2xl relative group overflow-hidden cursor-pointer"
          >
            {data.profileImage ? (
              <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-blue-600 flex items-center justify-center">
                <User className="w-24 h-24 text-white" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              <Camera className="w-6 h-6 text-white mb-1" />
              <span className="text-[7px] font-black text-white tracking-widest uppercase">Update Bio</span>
            </div>
          </div>

          {/* NAME & ACCESS DETAILS */}
          <div className="mb-6 uppercase">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-4xl font-black text-white tracking-tighter leading-none">{data.name}</h1>
              <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md flex items-center gap-2">
                 <ShieldCheck className="w-3 h-3 text-blue-400" />
                 <span className="text-[8px] font-black text-blue-400 tracking-widest uppercase">Level 4 Access</span>
              </div>
            </div>
            <p className="text-sm font-black text-slate-500 tracking-[0.3em]">{data.role} · {data.department}</p>
          </div>
        </div>

        {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
        <div className="p-12 mt-8 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Biometrics Card */}
          <div className="space-y-8">
            <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-3xl">
              <h3 className="text-[10px] font-black text-blue-500 mb-8 flex items-center gap-2 tracking-[0.4em] uppercase">
                <Fingerprint className="w-4 h-4" /> Personnel Biometrics
              </h3>
              <div className="space-y-6 uppercase">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/5 rounded-lg text-slate-600 font-bold"><Lock className="w-4 h-4" /></div>
                  <div><p className="text-[8px] font-black text-slate-600 tracking-widest">Employee ID</p><p className="text-[11px] font-black text-white">{data.employeeId}</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/5 rounded-lg text-slate-600"><Mail className="w-4 h-4" /></div>
                  <div className="overflow-hidden"><p className="text-[8px] font-black text-slate-600 tracking-widest">Email Address</p><p className="text-[11px] font-black text-white truncate">{data.email}</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/5 rounded-lg text-slate-600"><Phone className="w-4 h-4" /></div>
                  <div><p className="text-[8px] font-black text-slate-600 tracking-widest">Direct Line</p><p className="text-[11px] font-black text-white">{data.phone}</p></div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/5 rounded-lg text-slate-600"><MapPin className="w-4 h-4" /></div>
                  <div><p className="text-[8px] font-black text-slate-600 tracking-widest">Workstation</p><p className="text-[11px] font-black text-white">{data.workstation}</p></div>
                </div>
              </div>
              <button onClick={onOpenModal} className="w-full mt-8 py-4 bg-white/5 border border-white/5 hover:bg-blue-600 hover:text-white text-slate-400 rounded-2xl text-[9px] font-black tracking-[0.3em] transition-all uppercase">
                Modify Biometric Data
              </button>
            </div>
          </div>

          {/* Direct Reports Card */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/40 border border-white/5 rounded-[3.5rem] overflow-hidden uppercase">
               <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/5 tracking-widest text-white text-[10px] font-black">
                <span>Direct Reports // {data.department}</span>
                <div className="flex items-center gap-2 text-slate-500">
                  <Briefcase className="w-4 h-4" />
                  <span>Total: {data.teamSize}</span>
                </div>
               </div>
               <div className="divide-y divide-white/5">
                {data.directReports.map((report, i) => (
                  <div key={i} className="px-10 py-6 flex justify-between items-center hover:bg-white/5 transition-all font-black">
                    <div className="flex items-center gap-4 text-white">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 text-[10px] uppercase">
                        {report.name[0]}{report.name.split(' ')[1]?.[0] || ''}
                      </div>
                      <div>
                        <p className="text-xs uppercase">{report.name}</p>
                        <p className="text-[9px] text-slate-500 tracking-widest">{report.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`text-[8px] tracking-widest ${report.status === 'ACTIVE' ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {report.status === 'ACTIVE' ? 'ON-SHIFT' : 'OFF-SHIFT'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-800" />
                    </div>
                  </div>
                ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 uppercase">
          <div className="bg-[#0a0f1e] border border-white/10 rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden">
             <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h2 className="text-sm font-black text-white tracking-tight">System Settings</h2>
                <X onClick={onCloseModal} className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white" />
             </div>
             <div className="p-10 space-y-6">
                {formFields.map((field) => (
                  <div key={field}>
                    <label className="text-[9px] font-black text-slate-500 tracking-[0.3em] block mb-2">{field.toUpperCase()}</label>
                    <input 
                      type="text" 
                      value={editForm[field]} 
                      onChange={(e) => onEditChange(field, e.target.value)}
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-white text-xs font-bold outline-none focus:border-blue-500/50"
                    />
                  </div>
                ))}
                {saveError && <p className="text-[9px] font-black text-red-500 tracking-widest">⚠ {saveError}</p>}
                <button 
                  onClick={onSave} 
                  disabled={saving}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] tracking-widest transition-all"
                >
                  {saving ? 'UPDATING CORE...' : 'COMMIT CHANGES'}
                </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};