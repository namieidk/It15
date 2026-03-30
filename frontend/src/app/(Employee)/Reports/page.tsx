'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ReportsView from '../../../components/(Employee)/Reports/Reports';

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

export interface UserProfile {
  employeeId: string;
  fullName: string;
  department: string;
  position: string;
}

// ─── PDF DOWNLOAD HELPER ──────────────────────────────────────────────────────
// If the backend provides a real URL (not '#'), open it directly.
// Otherwise generate a polished printable HTML page as fallback.
export async function downloadReportPDF(report: Report, user: UserProfile | null) {
  // Real backend PDF — open directly
  if (report.downloadUrl && report.downloadUrl !== '#') {
    window.open(report.downloadUrl, '_blank');
    return;
  }

  // Fallback: generate a clean printable HTML report
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <title>${report.reportNumber}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=IBM+Plex+Sans:wght@400;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'IBM Plex Sans', monospace;
          background: #fff;
          color: #0a0a0a;
          padding: 56px 64px;
          font-size: 13px;
          line-height: 1.6;
        }

        /* ── HEADER ── */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 32px;
          border-bottom: 3px solid #0a0a0a;
          margin-bottom: 40px;
        }
        .header-left h1 {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -1.5px;
          line-height: 1;
          margin-bottom: 6px;
          font-family: 'IBM Plex Mono', monospace;
        }
        .header-left .subtitle {
          font-size: 9px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #666;
          font-family: 'IBM Plex Mono', monospace;
        }
        .header-right {
          text-align: right;
        }
        .report-number {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #3730a3;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .report-date {
          font-size: 9px;
          color: #999;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* ── BADGE ── */
        .badge {
          display: inline-block;
          padding: 4px 14px;
          border-radius: 99px;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-family: 'IBM Plex Mono', monospace;
        }
        .badge-approved { background: #d1fae5; color: #065f46; }
        .badge-pending  { background: #fef3c7; color: #92400e; }
        .badge-rejected { background: #fee2e2; color: #991b1b; }
        .badge-type     { background: #e0e7ff; color: #3730a3; }

        /* ── META GRID ── */
        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 40px;
        }
        .meta-cell {
          padding: 18px 24px;
          border-right: 1.5px solid #e5e7eb;
          border-bottom: 1.5px solid #e5e7eb;
        }
        .meta-cell:nth-child(even) { border-right: none; }
        .meta-cell:nth-last-child(-n+2) { border-bottom: none; }
        .meta-label {
          font-size: 8px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #9ca3af;
          font-family: 'IBM Plex Mono', monospace;
          margin-bottom: 6px;
          font-weight: 700;
        }
        .meta-value {
          font-size: 14px;
          font-weight: 600;
          color: #0a0a0a;
        }

        /* ── SECTION ── */
        .section-title {
          font-size: 9px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #9ca3af;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 700;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f3f4f6;
        }

        /* ── DETAILS TABLE ── */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }
        th {
          text-align: left;
          padding: 10px 16px;
          font-size: 8px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #9ca3af;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 700;
          background: #f9fafb;
          border-bottom: 1.5px solid #e5e7eb;
        }
        td {
          padding: 14px 16px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 13px;
          color: #374151;
        }
        tr:last-child td { border-bottom: none; }

        /* ── FOOTER ── */
        .footer {
          margin-top: 56px;
          padding-top: 24px;
          border-top: 1.5px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-left {
          font-size: 8px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #d1d5db;
          font-family: 'IBM Plex Mono', monospace;
        }
        .footer-right {
          font-size: 8px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #d1d5db;
          font-family: 'IBM Plex Mono', monospace;
        }

        /* ── WATERMARK ── */
        .watermark {
          position: fixed;
          bottom: 80px;
          right: 60px;
          font-size: 9px;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: #f3f4f6;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 700;
          transform: rotate(-30deg);
          pointer-events: none;
          font-size: 48px;
        }

        @media print {
          body { padding: 32px 40px; }
          .watermark { display: block; }
        }
      </style>
    </head>
    <body>

      <div class="watermark">OFFICIAL</div>

      <!-- HEADER -->
      <div class="header">
        <div class="header-left">
          <h1>Performance<br/>Analytics</h1>
          <div class="subtitle">Official Document Record &nbsp;•&nbsp; ${report.department}</div>
        </div>
        <div class="header-right">
          <div class="report-number">${report.reportNumber}</div>
          <div class="report-date">${new Date(report.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          <br/>
          <span class="badge badge-type">${report.type}</span>
          &nbsp;
          <span class="badge ${
            report.status?.toUpperCase() === 'APPROVED' ? 'badge-approved' :
            report.status?.toUpperCase() === 'PENDING'  ? 'badge-pending' : 'badge-rejected'
          }">${report.status}</span>
        </div>
      </div>

      <!-- REPORT TITLE -->
      <div style="margin-bottom:40px;">
        <div class="section-title">Report Title</div>
        <div style="font-size:20px;font-weight:700;letter-spacing:-0.5px;color:#0a0a0a;">${report.name}</div>
      </div>

      <!-- META GRID -->
      <div class="section-title">Report Details</div>
      <div class="meta-grid">
        <div class="meta-cell">
          <div class="meta-label">Employee ID</div>
          <div class="meta-value">${report.employeeId}</div>
        </div>
        <div class="meta-cell">
          <div class="meta-label">Department</div>
          <div class="meta-value">${report.department}</div>
        </div>
        <div class="meta-cell">
          <div class="meta-label">Full Name</div>
          <div class="meta-value">${user?.fullName ?? '—'}</div>
        </div>
        <div class="meta-cell">
          <div class="meta-label">Position</div>
          <div class="meta-value">${user?.position ?? '—'}</div>
        </div>
      </div>

      <!-- DETAILS TABLE -->
      <div class="section-title">Full Record</div>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Report ID</td><td>${report.id}</td></tr>
          <tr><td>Report Number</td><td>${report.reportNumber}</td></tr>
          <tr><td>Type</td><td><span class="badge badge-type">${report.type}</span></td></tr>
          <tr><td>Status</td><td><span class="badge ${
            report.status?.toUpperCase() === 'APPROVED' ? 'badge-approved' :
            report.status?.toUpperCase() === 'PENDING'  ? 'badge-pending' : 'badge-rejected'
          }">${report.status}</span></td></tr>
          <tr><td>Department</td><td>${report.department}</td></tr>
          <tr><td>Employee ID</td><td>${report.employeeId}</td></tr>
          <tr><td>Created At</td><td>${new Date(report.createdAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td></tr>
        </tbody>
      </table>

      <!-- FOOTER -->
      <div class="footer">
        <div class="footer-left">Performance Analytics System &nbsp;•&nbsp; Auto-Generated</div>
        <div class="footer-right">Printed ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</div>
      </div>

    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, '_blank');
  if (win) {
    setTimeout(() => {
      win.print();
      URL.revokeObjectURL(url);
    }, 800);
  }
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [user, setUser]           = useState<UserProfile | null>(null);
  const [reports, setReports]     = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType]     = useState<string>('ALL');
  const [activeChart, setActiveChart]   = useState<'bar' | 'line'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const stored     = localStorage.getItem('user');
        const token      = localStorage.getItem('token');
        const employeeId = stored ? JSON.parse(stored).employeeId : '';

        if (!employeeId && !token) return;

        const headers: HeadersInit = {
          'Authorization': `Bearer ${token}`,
          'X-Employee-Id': employeeId,
          'Content-Type':  'application/json',
        };

        const [userRes, reportRes] = await Promise.all([
          fetch('http://localhost:5076/api/Reports/user-profile', { headers }),
          fetch('http://localhost:5076/api/Reports/my-reports',   { headers }),
        ]);

        if (userRes.status === 401) throw new Error('UNAUTHORIZED');
        if (userRes.ok)    setUser(await userRes.json());
        if (reportRes.ok)  setReports(await reportRes.json());

      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Kernel Sync Error:', message);
        toast.error('CONNECTION ERROR');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredReports = filterType === 'ALL'
    ? reports
    : reports.filter(r => r.type?.toUpperCase() === filterType);

  const allTypes = [
    'ALL',
    ...Array.from(new Set(reports.map(r => r.type?.toUpperCase()).filter(Boolean))),
  ];

  return (
    <ReportsView
      user={user}
      reports={reports}
      filteredReports={filteredReports}
      isLoading={isLoading}
      filterType={filterType}
      setFilterType={setFilterType}
      allTypes={allTypes}
      activeChart={activeChart}
      setActiveChart={setActiveChart}
      onDownload={(report) => downloadReportPDF(report, user)}
    />
  );
}