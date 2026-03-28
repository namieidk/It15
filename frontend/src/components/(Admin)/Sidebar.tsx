'use client';

import React, { useState } from 'react'; // Added useState
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogoutModal } from './LogoutModal'; // Import the modal
import { 
  LayoutDashboard, MessageSquare, BarChart3, 
  UserRoundCog, History, Settings, ShieldAlert, 
  LogOut, Terminal 
} from 'lucide-react';

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
    router.push('/login'); 
  };

  return (
    <>
      <aside className="w-80 h-screen bg-[#020617] border-r border-white/5 flex flex-col font-sans uppercase shrink-0">
        <div className="p-10">
          <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <ShieldAlert className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <span className="text-xl font-black text-white tracking-tighter uppercase">
                System <span className="text-indigo-500">Admin</span>
              </span>
          </div>
          <p className="text-[8px] font-black text-slate-600 tracking-[0.5em] ml-1">Root Authority v4.0</p>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group border ${
                  isActive 
                  ? 'bg-indigo-600/10 text-indigo-400 border-indigo-600/20' 
                  : 'text-slate-500 border-transparent hover:bg-white/5 hover:text-white'
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`} />
                <span className="text-[10px] font-black tracking-[0.2em]">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-8 space-y-6">
          <div className="bg-slate-900/40 border border-white/5 p-5 rounded-[2rem]">
              <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-black text-slate-600 tracking-widest flex items-center gap-2">
                      <Terminal className="w-3 h-3" /> SYS CORE
                  </span>
                  <span className="text-[8px] font-black text-emerald-500">STABLE</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-full" />
              </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)} // Open Custom Modal
            className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl border border-white/5 text-slate-600 font-black text-[10px] tracking-widest hover:border-red-500/50 hover:text-red-500 transition-all uppercase"
          >
            <LogOut className="w-4 h-4" /> Terminate Session
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