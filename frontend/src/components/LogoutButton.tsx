'use client';

import { useAutoLogout } from '../hooks/useAutoLogout';
import { LogOut } from 'lucide-react';

export const LogoutButton = () => {
  const { logout } = useAutoLogout();

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-widest"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
};