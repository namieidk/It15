// ─── Formatters ───────────────────────────────────────────────────────────────

export const fmt = (n: number) =>
  `₱${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export const fmtD = (d: string) =>
  new Date(d).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

// ─── Deduction Helper (2026 PH Rates) ────────────────────────────────────────

export function calcDeductions(monthly: number) {
  const sss        = monthly * 0.045;
  const pagibig    = monthly <= 1500 ? monthly * 0.01 : Math.min(monthly * 0.02, 100);
  const philhealth = monthly * 0.025;
  return { sss, pagibig, philhealth, total: sss + pagibig + philhealth };
}

// ─── API Base ─────────────────────────────────────────────────────────────────

export const API = 'http://localhost:5076/api/Payroll';