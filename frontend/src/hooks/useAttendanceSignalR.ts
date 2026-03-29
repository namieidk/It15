import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

// 1. Define strict interfaces for the data models
interface BaseRecord {
  id: string;
  name: string;
}

export interface AttendanceNotification {
  employeeId: string;
  name: string;
  time: string;
  dept: string; // Required for HR, can be empty string for others
}

interface UseAttendanceSignalRProps<T> {
  department: string;
  role?: 'HR' | 'MANAGER' | 'EMPLOYEE';
  onNewClockIn: (record: T) => void;
  // ✅ Replaced 'any' with a concrete interface
  onLateNotification: (notification: AttendanceNotification) => void;
}

export function useAttendanceSignalR<T extends BaseRecord>({
  department,
  role = 'MANAGER',
  onNewClockIn,
  onLateNotification,
}: UseAttendanceSignalRProps<T>) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const url = `http://localhost:5076/hubs/attendance?department=${encodeURIComponent(department)}&role=${role}`;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(url, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.None)
      .build();

    // ✅ Strongly typed listener for NewClockIn
    connection.on('NewClockIn', (record: T) => {
      if (isMounted) onNewClockIn(record);
    });

    // ✅ Strongly typed listener for LateNotification
    connection.on('LateNotification', (notification: AttendanceNotification) => {
      if (isMounted) onLateNotification(notification);
    });

    const startConnection = async () => {
      try {
        await connection.start();
        if (isMounted) {
          setIsConnected(true);
          console.log(`[SignalR] Linked as ${role}`);
        }
      } catch (err) {
        if (isMounted) console.error("[SignalR] Connection Failed:", err);
      }
    };

    startConnection();
    connectionRef.current = connection;

    return () => {
      isMounted = false;
      if (connectionRef.current) {
        const conn = connectionRef.current;
        connectionRef.current = null;
        
        conn.off('NewClockIn');
        conn.off('LateNotification');
        
        if (conn.state !== signalR.HubConnectionState.Disconnected) {
          conn.stop().catch(() => {});
        }
        setIsConnected(false);
      }
    };
  }, [department, role, onNewClockIn, onLateNotification]);

  return { isConnected };
}