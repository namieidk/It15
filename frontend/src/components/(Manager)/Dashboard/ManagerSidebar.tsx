'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Clock, MessageSquare, 
  Target, BarChart3, UserCircle, LogOut, 
  ShieldCheck, CheckSquare, Users 
} from 'lucide-react';

const managerItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/managerDashboard' },
  { name: 'Attendance', icon: Clock, path: '/managerAttendance' },
  { name: 'Approvals', icon: CheckSquare, path: '/Approvals' },
  { name: 'Messages', icon: MessageSquare, path: '/managerMessage' },
  { name: 'Evaluation', icon: Target, path: '/managerEvaluation' },
  { name: 'Reports', icon: BarChart3, path: '/managerReports' },
  { name: 'Profile', icon: UserCircle, path: '/managerProfile' },
];

export const ManagerSidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-72 h-screen bg-[#020617] border-r border-white/5 flex flex-col p-8 sticky top-0">
      <div className="flex items-center gap-3 mb-12">
        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
          <ShieldCheck className="text-white w-6 h-6" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-black tracking-tighter text-xl leading-none uppercase">Axiom</span>
          <span className="text-blue-500 font-bold text-[10px] tracking-[0.4em] uppercase">Manager</span>
        </div>
      </div>
      <nav className="flex-1 space-y-2">
        {managerItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
                isActive 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
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