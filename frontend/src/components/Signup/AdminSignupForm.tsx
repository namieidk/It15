'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Loader2 } from 'lucide-react';

export const AdminSignupForm = () => {
  const router = useRouter(); 
  
  const initialFormState = {
    fullName: '',
    employeeId: '', 
    adminKey: '',   
    password: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({
    type: null, message: ''
  });

  // Password Security Checks
  const checks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const isPasswordValid = Object.values(checks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.employeeId.trim().length !== 6) {
      setStatus({ 
        type: 'error', 
        message: `ID ERROR: Entered ${formData.employeeId.length} chars. Must be exactly 6.` 
      });
      return;
    }

    setIsLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch("http://localhost:5076/api/auth/register-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName.trim(),
          employeeId: formData.employeeId.trim().toUpperCase(),
          password: formData.password,
          secretKey: formData.adminKey     
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus({ type: 'success', message: 'ADMIN INITIALIZED SUCCESSFULLY' });
        setFormData(initialFormState);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setStatus({ 
          type: 'error', 
          message: data.message || data.detail || 'INITIALIZATION FAILED' 
        });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'COMMUNICATIONS FAILURE: Is the Backend Running?' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full px-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-mono text-xs placeholder:text-slate-700 uppercase italic font-black";
  const labelStyle = "text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 ml-1 mb-1.5 block";
  const checkStyle = (met: boolean) => `text-[8px] font-bold uppercase tracking-tighter transition-colors ${met ? 'text-indigo-400' : 'text-slate-600'}`;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {status.type && (
        <div className={`p-3 rounded-xl text-[10px] font-mono mb-4 border animate-pulse italic font-black ${
          status.type === 'success' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
        }`}>
          [{status.type.toUpperCase()}]: {status.message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelStyle}>Full Name</label>
          <input 
            type="text" 
            required 
            placeholder="J. DOE" 
            className={inputStyle} 
            value={formData.fullName} 
            onChange={(e) => setFormData({...formData, fullName: e.target.value.toUpperCase()})} 
          />
        </div>
        <div>
          <label className={labelStyle}>Staff ID (6 Chars)</label>
          <input 
            type="text" 
            required 
            maxLength={6} 
            placeholder="123456" 
            className={inputStyle} 
            value={formData.employeeId} 
            onChange={(e) => setFormData({...formData, employeeId: e.target.value.toUpperCase().replace(/\s/g, '')})} 
          />
        </div>
      </div>

      <div>
        <label className={labelStyle}>Master Admin Key</label>
        <input 
          type="password" 
          required 
          placeholder="ENTER PROVISIONING KEY" 
          className={inputStyle} 
          value={formData.adminKey} 
          onChange={(e) => setFormData({...formData, adminKey: e.target.value})} 
        />
      </div>

      <div>
        <label className={labelStyle}>System Password</label>
        <input 
          type="password" 
          required 
          placeholder="••••••••••••" 
          className={inputStyle} 
          value={formData.password} 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        
        <div className="flex gap-3 mt-2 px-1">
          <span className={checkStyle(checks.length)}>● 8+ Chars</span>
          <span className={checkStyle(checks.upper)}>● Upper</span>
          <span className={checkStyle(checks.number)}>● Number</span>
          <span className={checkStyle(checks.special)}>● Symbol</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || status.type === 'success' || !isPasswordValid}
        className={`w-full py-4 mt-2 font-black rounded-xl transition-all active:scale-[0.98] text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl italic ${
          isLoading || status.type === 'success' || !isPasswordValid 
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
            : 'bg-white text-slate-950 hover:bg-indigo-500 hover:text-white shadow-white/5'
        }`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : "Initialize Admin Account"}
      </button>
    </form>
  );
};