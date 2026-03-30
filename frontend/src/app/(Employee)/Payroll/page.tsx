'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { PayrollView } from '../../../components/(Employee)/Payroll/Payroll';

export interface PayslipData {
  id: number;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  basicSalary: number;
  nightDiff: number;
  overtime: number;
  allowances: number;
  grossPay: number;
  sssDeduction: number;
  philHealthDeduction: number;
  pagIbigDeduction: number;
  withholdingTax: number;
  totalDeductions: number;
  netPay: number;
  status: string;
  generatedAt: string;
}

export default function PayrollPage() {
  const [history, setHistory] = useState<PayslipData[]>([]);
  const [activeSlip, setActiveSlip] = useState<PayslipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPayslips = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      
      try {
        const res = await fetch(`http://localhost:5076/api/Payroll/payslips?employeeId=${user.employeeId}`);
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
          if (data.length > 0) setActiveSlip(data[0]); 
        }
      } catch (e) {
        console.error("API Error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchPayslips();
  }, []);

  const totalPages = Math.ceil(history.length / itemsPerPage) || 1;
  const visibleHistory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return history.slice(start, start + itemsPerPage);
  }, [history, currentPage]);

  if (loading) return <LoadingSpinner />;

  return (
    <PayrollView 
      activeSlip={activeSlip}
      visibleHistory={visibleHistory}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onSelectSlip={setActiveSlip}
    />
  );
}

function LoadingSpinner() {
  return (
    <div className="h-screen w-full bg-[#020617] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-indigo-500 tracking-[0.5em]">SYNCHRONIZING...</p>
      </div>
    </div>
  );
}