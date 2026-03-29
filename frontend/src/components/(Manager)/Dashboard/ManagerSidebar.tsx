'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  LayoutDashboard, Clock, MessageSquare, 
  Target, BarChart3, UserCircle, LogOut, 
  CheckSquare 
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
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push('/login');
  };

  return (
    <aside className="w-64 h-screen bg-[#020617] border-r border-white/5 flex flex-col p-6 sticky top-0 shrink-0">
      
      {/* BRANDING SECTION - Matched to Employee Sidebar */}
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
          <span className="text-indigo-500 font-bold text-[8px] tracking-[0.5em] uppercase">Manager</span>
        </div>
      </div>

      {/* NAVIGATION SECTION - Matched to Employee Sidebar */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-2">
        {managerItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all border ${
                isActive 
                ? 'bg-indigo-600/10 text-indigo-400 border-indigo-600/20' 
                : 'text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/5'
              }`}>
              <item.icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] uppercase tracking-[0.15em] ${isActive ? 'font-black' : 'font-bold'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER SECTION - Matched to Employee Sidebar */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-500 hover:text-red-400 transition-all group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Terminate Session</span>
        </button>
        
        <div className="mt-4 px-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </aside>
  );
};