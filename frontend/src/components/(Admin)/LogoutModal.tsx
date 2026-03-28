'use client';

import React from 'react';
import { ShieldAlert, X, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal = ({ isOpen, onClose, onConfirm }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#020617] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-500/10 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Background Glow Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 blur-[80px] rounded-full" />
        
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/5">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>

          <h2 className="text-xl font-black text-white tracking-tighter uppercase mb-2">
            Terminate <span className="text-red-500">Root Session?</span>
          </h2>
          
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] leading-relaxed uppercase mb-8">
            Warning: All encrypted links will be severed. Access to the kernel will require re-authentication.
          </p>

          <div className="flex flex-col w-full gap-3">
            <button 
              onClick={onConfirm}
              className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-[10px] font-black tracking-[0.3em] transition-all shadow-lg shadow-red-600/20 uppercase"
            >
              Confirm Termination
            </button>
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white text-[10px] font-black tracking-[0.3em] transition-all uppercase"
            >
              Maintain Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};