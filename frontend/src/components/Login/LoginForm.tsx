'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

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

        // ✅ Set session cookie for middleware
        document.cookie = `session=${JSON.stringify({ role, name })}; path=/; max-age=${30 * 60}`;

        // ✅ Also store in localStorage for client-side use
        localStorage.setItem('user_role', role);
        localStorage.setItem('user_name', name);

        switch (role) {
          case 'ADMIN':    router.push('/adminDashboard'); break;
          case 'MANAGER':  router.push('/managerDashboard'); break;
          case 'HR':       router.push('/hrDashboard'); break;
          case 'EMPLOYEE': router.push('/Dashboard'); break;
          default:         router.push('/login'); break;
        }
      } else {
        setError(data.message || 'Invalid System Signature.');
      }
    } catch {
      setError('COMMUNICATIONS FAILURE: System Offline.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Employee ID</label>
        <input
          type="text"
          required
          maxLength={6}
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
          placeholder="AX0000"
          className="w-full px-5 py-3.5 bg-slate-800/50 border border-white/5 rounded-xl text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
          <button type="button" className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Reset</button>
        </div>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-5 py-3.5 pr-12 bg-slate-800/50 border border-white/5 rounded-xl text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono text-sm"
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

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 animate-pulse">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
          <span className="text-[11px] font-bold text-red-400">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black rounded-xl transition-all active:scale-[0.97] text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
      >
        {isLoading 
          ? <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> 
          : "Authenticate"
        }
      </button>
    </form>
  );
};