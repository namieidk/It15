// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface PayrollRecord {
  id: string;
  name: string;
  role: string;
  dept: string;
  sssId: string;
  philId: string;
  pagibigId: string;
  basicSalary: number;
  grossPay: number;
  estimatedDeductions: number;
  netTakeHome: number;
  status: 'PROCESSED' | 'PENDING';
}

export interface PayPeriod {
  id: number;
  label: string;
  periodStart: string;
  periodEnd: string;
  cutoffDate: string;
  payDate: string;
  status: string;
}

export interface Payslip {
  id: number;
  employeeId: string;
  employeeName?: string;
  department?: string;
  role?: string;
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
  notifiedAt: string | null;
}

export interface PpForm {
  label: string;
  periodStart: string;
  periodEnd: string;
  cutoffDate: string;
  payDate: string;
}

export type ViewType = 'dashboard' | 'enrollment' | 'periods' | 'payslips' | 'payslip-detail';