'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LogoutModal } from './LogoutModal'; 
import { 
  LayoutDashboard, MessageSquare, BarChart3, 
  UserRoundCog, History, Settings, LogOut 
} from 'lucide-react';
import { ShieldAlert } from 'lucide-react';

const adminLinks = [
  { name: 'Dashboard', href: '/adminDashboard', icon: LayoutDashboard },
  { name: 'Message', href: '/adminMessage', icon: MessageSquare },
  { name: 'Reports', href: '/adminReports', icon: BarChart3 },
  { name: 'Manage Acc', href: '/ManageAcc', icon: UserRoundCog }, 
  { name: 'Audit Logs', href: '/Auditlogs', icon: History },
  { name: 'Settings', href: '/adminSettings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleFinalLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    // Clear cookies if needed
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push('/login'); 
  };

  return (
    <>
      <aside className="w-64 h-screen bg-[#020617] border-r border-white/5 flex flex-col p-6 sticky top-0 shrink-0 font-sans italic">
        
        {/* BRANDING SECTION - Matched to Manager Sidebar */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="h-9 w-9 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 overflow-hidden relative">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              fill 
              className="object-cover scale-150 object-center" 
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black tracking-tighter text-lg leading-none uppercase italic">Axiom</span>
            <span className="text-indigo-500 font-bold text-[8px] tracking-[0.5em] uppercase">Admin</span>
          </div>
        </div>

        {/* NAVIGATION SECTION */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide pr-2">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all border ${
                  isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border-indigo-600/20' 
                  : 'text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <link.icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] uppercase tracking-[0.15em] ${isActive ? 'font-black' : 'font-bold'}`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER SECTION */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-500 hover:text-red-400 transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Terminate Session</span>
          </button>
        
        </div>
      </aside>

      {/* Render the Custom Modal */}
      <LogoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleFinalLogout} 
      />
    </>
  );
}