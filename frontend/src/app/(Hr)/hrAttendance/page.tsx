'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HRSidebar } from '../../../components/(Hr)/Dashboard/sidebar';
import { useAttendanceSignalR, AttendanceNotification } from '../../../hooks/useAttendanceSignalR';
import { HRAttendanceUI, HRAttendanceRecord, HRFilterState } from '../../../components/(Hr)/Attendance/HRAttendanceUI';

export default function HRAttendancePage() {
  const [attendanceData, setAttendanceData] = useState<HRAttendanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<AttendanceNotification[]>([]);
  
  const [filters, setFilters] = useState<HRFilterState>({ 
    status: 'ALL', 
    department: 'ALL',
    shift: 'ALL' 
  });

  // 1. Fetch Logic
  const fetchGlobalAttendance = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5076/api/Attendance/all`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data: HRAttendanceRecord[] = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('HR Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchGlobalAttendance(); 
  }, [fetchGlobalAttendance]);

  // 2. SignalR Handlers
  const handleNewClockIn = useCallback((record: HRAttendanceRecord) => {
    setAttendanceData((prev) => [record, ...prev]);
  }, []);

  const handleLateNotification = useCallback((notification: AttendanceNotification) => {
    setNotifications((prev) => [notification, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.employeeId !== notification.employeeId));
    }, 8000);
  }, []);

  // 3. Connect SignalR
  const { isConnected } = useAttendanceSignalR<HRAttendanceRecord>({
    department: "", 
    role: "HR",
    onNewClockIn: handleNewClockIn,
    onLateNotification: handleLateNotification,
  });

  // 4. Filter Logic
  const filteredData = useMemo(() => {
    return attendanceData.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'ALL' || item.status === filters.status;
      
      const matchesDept = filters.department === 'ALL' || item.dept === filters.department;

      let matchesShift = true;
      if (filters.shift !== 'ALL' && item.login !== '--:--') {
        const [hours] = item.login.split(':').map(Number);
        if (filters.shift === 'MORNING') matchesShift = hours >= 6 && hours < 12;
        else if (filters.shift === 'AFTERNOON') matchesShift = hours >= 12 && hours < 18;
        else if (filters.shift === 'NIGHT') matchesShift = hours >= 18 || hours < 6;
      }

      return matchesSearch && matchesStatus && matchesDept && matchesShift;
    });
  }, [searchTerm, attendanceData, filters]);

  // Handler for filter changes
  const handleFilterChange = (key: string, val: string) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: val 
    }));
  };

  const handleResetFilters = () => {
    setFilters({ status: 'ALL', department: 'ALL', shift: 'ALL' });
  };

  const handleExport = () => {
    console.log("Exporting Global Attendance Log...");
    // Logic for CSV/PDF export goes here
  };

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <HRSidebar />
      <section className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
    

        <div className="px-12 pt-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-[9px] font-black tracking-[0.3em] text-slate-500 uppercase">
              {isConnected ? 'Global Uplink Active' : 'Establishing Secure Link...'}
            </span>
          </div>
        </div>

        {/* Notifications */}
        <div className="fixed top-24 right-12 z-50 space-y-3">
          {notifications.map((n, i) => (
            <div key={`${n.employeeId}-${i}`} className="bg-red-950/90 border border-red-500/30 rounded-2xl px-6 py-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right-4 flex items-center gap-4">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <div>
                <p className="text-[9px] font-black text-red-400 uppercase mb-1">Breach: Late Entry ({n.dept})</p>
                <p className="text-[10px] font-bold text-white tracking-tighter">{n.name} — {n.time}</p>
              </div>
            </div>
          ))}
        </div>

        <HRAttendanceUI 
          data={filteredData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onExport={handleExport}
          isLoading={isLoading}
        />
      </section>
    </main>
  );
}