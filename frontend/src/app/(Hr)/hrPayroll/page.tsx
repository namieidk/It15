/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { Shell } from '../../../components/(Hr)/Payroll/Shell';
import { DashboardView } from '../../../components/(Hr)/Payroll/Dashboard';
import { EnrollmentView } from '../../../components/(Hr)/Payroll/Enrollment';
import { PeriodsView } from '../../../components/(Hr)/Payroll/Period';
import { PayslipsView, PayslipDetailView } from '../../../components/(Hr)/Payroll/Payslip';

import { PayrollRecord, PayPeriod, Payslip, PpForm, ViewType } from '../../../components/(Hr)/Payroll/Type';
import { API } from '../../../components/(Hr)/Payroll/Utils';

export default function HRPayrollPage() {
  // ── View ──────────────────────────────────────────────────────────────────
  const [view, setView] = useState<ViewType>('dashboard');

  // ── Data ──────────────────────────────────────────────────────────────────
  const [payrollList, setPayrollList] = useState<PayrollRecord[]>([]);
  const [payPeriods, setPayPeriods] = useState<PayPeriod[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [activePayslip, setActivePayslip] = useState<Payslip | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Enrollment state ──────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [targetEmployee, setTargetEmployee] = useState<PayrollRecord | null>(null);
  const [salary, setSalary] = useState(0);
  
  // FIXED: Explicitly type the Ref to allow null
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ── Pay Period form ───────────────────────────────────────────────────────
  const [ppForm, setPpForm] = useState<PpForm>({
    label: '', periodStart: '', periodEnd: '', cutoffDate: '', payDate: '',
  });

  // ── Batch ─────────────────────────────────────────────────────────────────
  const [selectedPeriod, setSelectedPeriod] = useState<PayPeriod | null>(null);
  const [batchSelected, setBatchSelected] = useState<string[]>([]);
  const [batchProcessing, setBatchProcessing] = useState(false);

  // ── Payslip filter ────────────────────────────────────────────────────────
  const [slipFilter, setSlipFilter] = useState('');

  // ─── Fetchers ─────────────────────────────────────────────────────────────

  const fetchRoster = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/roster`);
      if (res.ok) setPayrollList(await res.json());
    } catch { toast.error('GATEWAY ERROR'); }
    finally { setLoading(false); }
  };

  const fetchPeriods = async () => {
    try {
      const res = await fetch(`${API}/pay-periods`);
      if (res.ok) setPayPeriods(await res.json());
    } catch { toast.error('PERIODS FETCH FAILED'); }
  };

  const fetchPayslips = async (empId?: string) => {
    try {
      const url = empId ? `${API}/payslips?employeeId=${empId}` : `${API}/payslips`;
      const res = await fetch(url);
      if (res.ok) setPayslips(await res.json());
    } catch { toast.error('PAYSLIPS FETCH FAILED'); }
  };

  useEffect(() => { 
    fetchRoster(); 
    fetchPeriods(); 
    fetchPayslips(); 
  }, []);

  // ─── Enrollment ───────────────────────────────────────────────────────────

  const handleSelectEmployee = (emp: PayrollRecord) => {
    setTargetEmployee(emp);
    setSearchTerm(`${emp.id} - ${emp.name}`);
    setIsDropdownOpen(false);
    // Dynamic rate calculation
    const rate = emp.role.toUpperCase().includes('MANAGER') ? 300 : 170;
    setSalary(rate * 160);
  };

  const handleEnroll = async () => {
    if (!targetEmployee) return;
    try {
      const res = await fetch(`${API}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: targetEmployee.id, basicSalary: salary }),
      });
      if (res.ok) {
        toast.success('LEDGER COMMITTED');
        setView('dashboard');
        fetchRoster();
      }
    } catch { toast.error('SYNC FAILURE'); }
  };

  // ─── Pay Periods ──────────────────────────────────────────────────────────

  const handleFormChange = (key: keyof PpForm, value: string) =>
    setPpForm(prev => ({ ...prev, [key]: value }));

  const handleCreatePeriod = async () => {
    const { label, periodStart, periodEnd, cutoffDate, payDate } = ppForm;
    if (!label || !periodStart || !periodEnd || !cutoffDate || !payDate)
      return toast.error('ALL FIELDS REQUIRED');
    try {
      const res = await fetch(`${API}/pay-period`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label,
          periodStart: new Date(periodStart).toISOString(),
          periodEnd: new Date(periodEnd).toISOString(),
          cutoffDate: new Date(cutoffDate).toISOString(),
          payDate: new Date(payDate).toISOString(),
        }),
      });
      if (res.ok) {
        toast.success('PAY PERIOD SCHEDULED');
        setPpForm({ label: '', periodStart: '', periodEnd: '', cutoffDate: '', payDate: '' });
        fetchPeriods();
      }
    } catch { toast.error('SCHEDULE FAILURE'); }
  };

  // ─── Batch ────────────────────────────────────────────────────────────────

  const toggleBatchSelect = (id: string) =>
    setBatchSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const toggleSelectAll = () => {
    const processedEmployees = payrollList.filter(e => e.status === 'PROCESSED');
    setBatchSelected(
      batchSelected.length === processedEmployees.length
        ? []
        : processedEmployees.map(e => e.id)
    );
  };

  const handleBatchProcess = async () => {
    if (!selectedPeriod) return toast.error('SELECT A PAY PERIOD FIRST');
    if (!batchSelected.length) return toast.error('SELECT EMPLOYEES');
    setBatchProcessing(true);
    try {
      const res = await fetch(`${API}/batch-process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodStart: new Date(selectedPeriod.periodStart).toISOString(),
          periodEnd: new Date(selectedPeriod.periodEnd).toISOString(),
          payDate: new Date(selectedPeriod.payDate).toISOString(),
          employeeIds: batchSelected,
        }),
      });
      if (res.ok) {
        const results = await res.json();
        const success = results.filter((r: any) => r.status === 'SUCCESS').length;
        const failed = results.filter((r: any) => r.status !== 'SUCCESS').length;
        toast.success(`BATCH COMPLETE — ${success} OK, ${failed} FAILED`);
        setBatchSelected([]);
        fetchPayslips();
        fetchRoster();
      }
    } catch { toast.error('BATCH PROCESS FAILED'); }
    finally { setBatchProcessing(false); }
  };

  // ─── Payslip navigation ───────────────────────────────────────────────────

  const handleViewSlip = (slip: Payslip) => {
    setActivePayslip(slip);
    setView('payslip-detail');
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Shell>
      {view === 'dashboard' && (
        <DashboardView
          view={view}
          onNavigate={setView}
          loading={loading}
          payrollList={payrollList}
          payPeriods={payPeriods}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
          batchSelected={batchSelected}
          batchProcessing={batchProcessing}
          onBatchProcess={handleBatchProcess}
          onToggleBatchSelect={toggleBatchSelect}
          onToggleSelectAll={toggleSelectAll}
        />
      )}

      {view === 'enrollment' && (
        <EnrollmentView
          onCancel={() => setView('dashboard')}
          payrollList={payrollList}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isDropdownOpen={isDropdownOpen}
          onDropdownOpen={() => setIsDropdownOpen(true)}
          targetEmployee={targetEmployee}
          onSelectEmployee={handleSelectEmployee}
          salary={salary}
          onEnroll={handleEnroll}
          dropdownRef={dropdownRef}
        />
      )}

      {view === 'periods' && (
        <PeriodsView
          view={view}
          onNavigate={setView}
          payPeriods={payPeriods}
          form={ppForm}
          onFormChange={handleFormChange}
          onSave={handleCreatePeriod}
        />
      )}

      {view === 'payslips' && (
        <PayslipsView
          view={view}
          onNavigate={setView}
          payslips={payslips}
          slipFilter={slipFilter}
          onFilterChange={setSlipFilter}
          onViewSlip={handleViewSlip}
        />
      )}

      {view === 'payslip-detail' && activePayslip && (
        <PayslipDetailView
          slip={activePayslip}
          onBack={() => setView('payslips')}
        />
      )}
    </Shell>
  );
}