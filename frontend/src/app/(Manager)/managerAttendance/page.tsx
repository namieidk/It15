'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ManagerSidebar } from '../../../components/(Manager)/Dashboard/ManagerSidebar';
import { ManagerAttendanceUI, AttendanceRecord } from '../../../components/(Manager)/Attendance/ManagerAttendance';
import { useAttendanceSignalR } from '../../../hooks/useAttendanceSignalR';

type StatusFilter = 'ALL' | 'PRESENT' | 'LATE' | 'ABSENT';
type DateFilter = 'TODAY' | 'THIS_WEEK' | 'THIS_MONTH';
type ShiftFilter = 'ALL' | 'MORNING' | 'AFTERNOON' | 'NIGHT';

interface FilterState {
  status: StatusFilter;
  date: DateFilter;
  shift: ShiftFilter;
}

interface LateNotification {
  employeeId: string;
  name: string;
  time: string;
}

export default function ManagerAttendancePage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [department, setDepartment] = useState<string>('');
  const [notifications, setNotifications] = useState<LateNotification[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    status: 'ALL',
    date: 'TODAY',
    shift: 'ALL',
  });

  // ✅ Get department from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const manager = JSON.parse(storedUser);
      setDepartment(manager.department ?? '');
    }
  }, []);

  // ✅ Fetch initial attendance data
  useEffect(() => {
    if (!department) return;

    (async () => {
      try {
        const response = await fetch(`http://localhost:5076/api/Attendance/department/${department}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data: AttendanceRecord[] = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error('Critical Error fetching roster:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [department]);

  // ✅ Handle new real-time clock-in
  const handleNewClockIn = useCallback((record: AttendanceRecord) => {
    setAttendanceData((prev) => [record, ...prev]);
  }, []);

  // ✅ Handle late notification
  const handleLateNotification = useCallback((notification: LateNotification) => {
    setNotifications((prev) => [notification, ...prev.slice(0, 4)]); // keep last 5
    // Auto-dismiss after 8 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.employeeId !== notification.employeeId));
    }, 8000);
  }, []);

  // ✅ Connect SignalR
  const { isConnected } = useAttendanceSignalR({
    department,
    onNewClockIn: handleNewClockIn,
    onLateNotification: handleLateNotification,
  });

  const filteredAttendance = useMemo(() => {
    return attendanceData.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filters.status === 'ALL' || agent.status === filters.status;

      let matchesShift = true;
      if (filters.shift !== 'ALL' && agent.login !== '--:--') {
        const [hours] = agent.login.split(':').map(Number);
        if (filters.shift === 'MORNING') matchesShift = hours >= 6 && hours < 12;
        else if (filters.shift === 'AFTERNOON') matchesShift = hours >= 12 && hours < 18;
        else if (filters.shift === 'NIGHT') matchesShift = hours >= 18 || hours < 6;
      }

      return matchesSearch && matchesStatus && matchesShift;
    });
  }, [searchTerm, attendanceData, filters]);

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <ManagerSidebar />
      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">

        {/* ✅ SignalR connection status indicator */}
        <div className="px-12 pt-1 flex justify-end">
          <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${isConnected ? 'text-emerald-500' : 'text-slate-600'}`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
            {isConnected ? 'Live Stream Active' : 'Connecting...'}
          </div>
        </div>

        {/* ✅ Late notifications toasts */}
        <div className="fixed top-6 right-6 z-50 space-y-3">
          {notifications.map((n, i) => (
            <div
              key={`${n.employeeId}-${i}`}
              className="bg-orange-950/90 border border-orange-500/30 rounded-2xl px-6 py-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-4 duration-300 flex items-center gap-4 min-w-[300px]"
            >
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse flex-shrink-0" />
              <div>
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Late Clock-In Detected</p>
                <p className="text-[9px] font-bold text-orange-300/70 uppercase tracking-widest mt-1">
                  {n.name} — {n.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-indigo-500 font-black animate-pulse tracking-[.5em] text-[10px]">SYNCING WITH DATABASE...</div>
          </div>
        ) : (
          <ManagerAttendanceUI
            attendanceData={filteredAttendance}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onExport={() => alert('DOWNLOADING ENCRYPTED DATA...')}
            filters={filters}
            onFilterChange={setFilters}
            onResetFilters={() => setFilters({ status: 'ALL', date: 'TODAY', shift: 'ALL' })}
          />
        )}
      </section>
    </main>
  );
}