'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Clock, MessageSquare, 
  Target, BarChart3, CreditCard, UserCircle, LogOut, ShieldCheck, 
  FilePlus 
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/Dashboard' },
  { name: 'Attendance', icon: Clock, path: '/Attendance' },
  { name: 'Request Leave', icon: FilePlus, path: '/LeaveReq' },
  { name: 'Messages', icon: MessageSquare, path: '/Message' },
  { name: 'Evaluation', icon: Target, path: '/Evaluation' },
  { name: 'Reports', icon: BarChart3, path: '/Reports' },
  { name: 'Payroll', icon: CreditCard, path: '/Payroll' },
  { name: 'Profile', icon: UserCircle, path: '/Profile' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-72 h-screen bg-[#020617] border-r border-white/5 flex flex-col p-8 sticky top-0">
      <div className="flex items-center gap-3 mb-12">
        <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <ShieldCheck className="text-slate-950 w-6 h-6" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-black tracking-tighter text-xl leading-none uppercase">Axiom</span>
          <span className="text-emerald-500 font-bold text-[10px] tracking-[0.4em] uppercase">Core</span>
        </div>
      </div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                isActive 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}>
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <button className="flex items-center gap-4 px-4 py-4 text-slate-600 hover:text-red-400 font-black text-[10px] uppercase tracking-widest transition-colors border-t border-white/5 mt-auto">
        <LogOut className="w-5 h-5" /> Terminate Session
      </button>
    </aside>
  );
};