'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const LoginForm = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5076/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const role = data.user.role.toUpperCase();
        const name = data.user.name;
        const id = data.user.employeeId;
        const department = data.user.department || 'General'; 

        // Set session cookie
        document.cookie = `session=${JSON.stringify({ role, name })}; path=/; max-age=${30 * 60}`;

        const userPayload = {
          name,
          role,
          employeeId: id,
          department, 
        };
        localStorage.setItem('user', JSON.stringify(userPayload));

        // Legacy keys
        localStorage.setItem('user_role', role);
        localStorage.setItem('user_name', name);

        switch (role) {
          case 'ADMIN':    router.push('/adminDashboard'); break;
          case 'MANAGER':  router.push('/managerDashboard'); break;
          case 'HR':       router.push('/hrDashboard'); break;
          case 'EMPLOYEE': router.push('/Dashboard'); break;
          default:         router.push('/'); break;
        }
      } else {
        setError(data.message || 'IDENTITY VERIFICATION FAILED.');
      }
    } catch (err) {
      setError('COMMUNICATIONS FAILURE: DATABASE OFFLINE.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* EMPLOYEE ID INPUT */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
          Employee ID
        </label>
        <input
          type="text"
          required
          maxLength={6}
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
          placeholder="AX0000"
          className="w-full px-5 py-4 bg-slate-900/50 border border-white/5 rounded-2xl text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-mono text-sm uppercase"
        />
      </div>

      {/* PASSWORD INPUT */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            Password
          </label>
          <button type="button" className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter hover:text-indigo-400 transition-colors">
            Forgot Password?
          </button>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-5 py-4 pr-12 bg-slate-900/50 border border-white/5 rounded-2xl text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">{error}</span>
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={isLoading}
        className="group w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black rounded-2xl transition-all active:scale-[0.98] text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 border border-white/10"
      >
        {isLoading ? (
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Login
          </>
        )}
      </button>
    </form>
  );
};