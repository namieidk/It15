'use client';

import React, { useState } from 'react';
import { Bell, Search } from 'lucide-react';

export const Navbar = () => {
  const [userData] = useState(() => {
    if (typeof window === 'undefined') {
      return { name: '', role: '', department: '', initials: '' };
    }

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return { name: '', role: '', department: '', initials: '' };

      const user = JSON.parse(storedUser);
      const nameParts: string[] = user.name?.split(' ') ?? [];
      const initials =
        nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : nameParts[0]?.slice(0, 2) ?? '';

      return {
        name: user.name ?? '',
        role: user.role ?? '',
        department: user.department ?? '',
        initials: initials.toUpperCase(),
      };
    } catch {
      return { name: '', role: '', department: '', initials: '' };
    }
  });

  return (
    <header className="px-10 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80">
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-2">
  <span className="text-white">{userData.department}</span>
  <span className="text-indigo-600 not-italic">UNIT</span>
</h1>
        </div>

        
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-indigo-400 transition-colors group">
          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#020617]"></span>
        </button>

        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
          <div className="text-right">
            <p className="text-xs font-black text-white uppercase tracking-tight">
              {userData.name}
            </p>
            <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">
              {userData.role}
            </p>
          </div>
          
        </div>
      </div>
    </header>
  );
};