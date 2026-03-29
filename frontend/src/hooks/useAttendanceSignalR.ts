import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { AttendanceRecord } from '../components/(Manager)/Attendance/ManagerAttendance';

interface LateNotification {
  employeeId: string;
  name: string;
  time: string;
}

interface UseAttendanceSignalRProps {
  department: string;
  onNewClockIn: (record: AttendanceRecord) => void;
  onLateNotification: (notification: LateNotification) => void;
}

export function useAttendanceSignalR({
  department,
  onNewClockIn,
  onLateNotification,
}: UseAttendanceSignalRProps) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!department) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5076/hubs/attendance')
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    // ✅ Listen for new clock-ins
    connection.on('NewClockIn', (record: AttendanceRecord) => {
      onNewClockIn(record);
    });

    // ✅ Listen for late notifications
    connection.on('LateNotification', (notification: LateNotification) => {
      onLateNotification(notification);
    });

    connection
      .start()
      .then(async () => {
        setIsConnected(true);
        // ✅ Join the department group to only receive relevant updates
        await connection.invoke('JoinDepartmentGroup', department);
        console.log(`[SignalR] Connected and joined group: ${department}`);
      })
      .catch((err) => console.error('[SignalR] Connection error:', err));

    connectionRef.current = connection;

    return () => {
      connection.invoke('LeaveDepartmentGroup', department).catch(() => {});
      connection.stop();
      setIsConnected(false);
    };
  }, [department]);

  return { isConnected };
}