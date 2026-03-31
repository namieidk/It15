import React from "react";
import { 
  Settings, 
  Monitor, 
  Wallet, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  ClipboardList,
  LineChart
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface Job {
  id: number;
  title: string;
  department: string;
  type: string;
  shift: string;
  location: string;
  slots: number;
  description: string;
  requirements: string[];
  badge: string;
  badgeColor: string;
}

export interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface Theme {
  accent: string;
  accentSoft: string;
  accentBorder: string;
  accentGlow: string;
  accentWarm: string;
  text: string;
  muted: string;
  bg: string;
  surface: string;
  surface2: string;
  border: string;
  tagBg: string;
  shadow: string;
  heroBg: string;
  navBg: string;
  navBorder: string;
  chipBg: string;
  chipBorder: string;
  orb1: string;
  orb2: string;
  gridline: string;
}

// ─── JOB DATA ─────────────────────────────────────────────────────────────────

export const jobs: Job[] = [
  {
    id: 1,
    title: "Operations Manager",
    department: "Operations",
    type: "Full-time",
    shift: "Day Shift (8AM - 5PM)",
    location: "Davao City",
    slots: 2,
    description:
      "Oversee daily business operations, improve organizational processes, and work to improve quality, productivity, and efficiency.",
    requirements: [
      "Bachelor's degree in Business Administration or related field",
      "5+ years of experience in operations management",
      "Strong budget management and forecasting skills",
      "Excellent leadership and conflict resolution abilities",
    ],
    badge: "Urgent",
    badgeColor: "#ef4444",
  },
  {
    id: 2,
    title: "Senior IT Systems Administrator",
    department: "IT Service",
    type: "Full-time",
    shift: "Night Shift (10PM - 6AM)",
    location: "Davao City",
    slots: 3,
    description:
      "Maintain, upgrade, and manage our software, hardware, and networks. Ensure that our technology infrastructure runs smoothly and efficiently.",
    requirements: [
      "BS in Computer Science, Information Technology or related",
      "Experience with cloud services (AWS/Azure) and virtualization",
      "Strong knowledge of system security and data backup/recovery",
      "Relevant certifications (MCSE, CCNA) are a major plus",
    ],
    badge: "Night Shift",
    badgeColor: "#6366f1",
  },
  {
    id: 3,
    title: "Financial Analyst",
    department: "Finance",
    type: "Full-time",
    shift: "Day Shift (9AM - 6PM)",
    location: "Davao City",
    slots: 4,
    description:
      "Consolidate and analyze financial data, taking into account company’s goals and financial standing. Provide creative alternatives and advice to reduce costs.",
    requirements: [
      "Degree in Finance, Accounting, or Economics",
      "Proven working experience as a Financial Analyst",
      "Proficient in spreadsheets, databases, and financial software",
      "Strong presentation, reporting, and communication skills",
    ],
    badge: "New Role",
    badgeColor: "#10b981",
  },
  {
    id: 4,
    title: "Service Desk Lead",
    department: "IT Service",
    type: "Full-time",
    shift: "Shifting",
    location: "Davao City",
    slots: 5,
    description:
      "Supervise the IT service desk team, ensure high-quality technical support, and act as a point of escalation for complex technical issues.",
    requirements: [
      "College Graduate in an IT-related field",
      "At least 3 years of experience in technical support",
      "Familiarity with ITIL foundations and best practices",
      "Customer-service oriented with leadership potential",
    ],
    badge: "IT Service",
    badgeColor: "#f59e0b",
  },
  {
    id: 5,
    title: "Accounts Payable Specialist",
    department: "Finance",
    type: "Full-time",
    shift: "Day Shift (8AM - 5PM)",
    location: "Davao City",
    slots: 2,
    description:
      "Process and monitor payments and expenditures. Ensure that vendors and suppliers are paid within established time limits.",
    requirements: [
      "BS degree in Accounting or Finance",
      "High degree of accuracy and attention to detail",
      "Experience with ERP systems (SAP, Oracle, or NetSuite)",
      "Understanding of basic bookkeeping and accounting payable principles",
    ],
    badge: "Finance",
    badgeColor: "#8b5cf6",
  },
];

export const allDepartments: string[] = [
  "All",
  "Operations",
  "IT Service",
  "Finance",
];

// ─── DEPT ICON HELPER ─────────────────────────────────────────────────────────

export function DeptIcon({ 
  dept, 
  size = 18 
}: { 
  dept: string; 
  size?: number 
}) {
  const props = { size, strokeWidth: 1.75 };
  
  switch (dept) {
    case "Operations":
      return <Settings {...props} />;
    case "IT Service":
      return <Monitor {...props} />;
    case "Finance":
      return <Wallet {...props} />;
    case "HR / Admin":
      return <ClipboardList {...props} />;
    case "Quality Assurance":
      return <ShieldCheck {...props} />;
    default:
      return <Briefcase {...props} />;
  }
}