'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AdminReportsUI } from '../../../components/(Admin)/Report/Reports';
import { Toaster, toast } from 'sonner';

export interface Report {
  id: string;
  reportNumber: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  employeeId: string;
  department: string;
  downloadUrl: string;
}

export interface AdminStats {
  totalAccounts: number;
  storageUsedGB: string;
  dataBreaches: number;
}

export interface OrgSummary {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  byType: { type: string; count: number }[];
  byDepartment: { department: string; count: number }[];
  byMonth: { month: string; count: number }[];
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [summary, setSummary] = useState<OrgSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [adminName, setAdminName] = useState('');

  const fetchAll = useCallback(async (silent = false) => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
    };

    try {
      if (!silent) {
        setIsLoading(true);
        setStatsLoading(true);
      }

      const [reportsRes, statsRes, summaryRes] = await Promise.all([
        fetch('http://localhost:5076/api/Reports/admin/all-reports', { headers }),
        fetch('http://localhost:5076/api/Reports/admin/stats', { headers }),
        fetch('http://localhost:5076/api/Reports/admin/summary', { headers }),
      ]);

      if (reportsRes.ok) setReports(await reportsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (summaryRes.ok) setSummary(await summaryRes.json());

      if (silent) {
        // Optional: show a small toast when background data updates
        console.log("Admin Dashboard Auto-Synced");
      }
    } catch (err) {
      console.error('Admin reports fetch error:', err);
      toast.error("Sync Failure", {
        description: "Could not refresh administrative data from server."
      });
    } finally {
      setIsLoading(false);
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const parsed = stored ? JSON.parse(stored) : {};
    setAdminName(parsed.name ?? 'Admin');

    // Initial Load
    fetchAll(false);

    // Background Refresh every 10 seconds
    const interval = setInterval(() => fetchAll(true), 10000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const handleExportCSV = () => {
    if (reports.length === 0) {
      toast.error("Export Failed", {
        description: "No report data available to generate a CSV."
      });
      return;
    }

    try {
      const csv = [
        ['ReportNumber', 'Name', 'Type', 'Status', 'EmployeeId', 'Department', 'CreatedAt'].join(','),
        ...reports.map(r => [
          r.reportNumber, 
          `"${r.name}"`, 
          r.type, 
          r.status,
          r.employeeId, 
          r.department, 
          new Date(r.createdAt).toLocaleString(),
        ].join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `admin-full-audit-${Date.now()}.csv`;
      
      a.href = url; 
      a.download = filename; 
      a.click();
      URL.revokeObjectURL(url);

      // Success Toast
      toast.success("Audit Log Exported", {
        description: `${filename} has been saved to your downloads.`
      });
    } catch (error) {
      toast.error("Export Error", {
        description: "An unexpected error occurred during CSV generation."
      });
    }
  };

  return (
    <>
      {/* Toast Notification Container */}
      <Toaster position="top-right" theme="dark" richColors />
      
      <AdminReportsUI 
        reports={reports}
        stats={stats}
        summary={summary}
        isLoading={isLoading}
        statsLoading={statsLoading}
        adminName={adminName}
        onExportCSV={handleExportCSV}
      />
    </>
  );
}