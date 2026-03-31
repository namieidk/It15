"use client";
import { TrendingUp, Award, ShieldCheck, Star, Users, Globe } from "lucide-react";
import { Theme } from "./Types";

interface WhySectionProps {
  t: Theme;
}

const WHY_ITEMS = [
  {
    icon: <TrendingUp size={19} />,
    bg: "#6366f118", color: "#6366f1",
    title: "Career Growth",
    desc: "Clear promotion paths from associate to team lead to operations manager within 18 months.",
  },
  {
    icon: <Award size={19} />,
    bg: "#6366f118", color: "#6366f1",
    title: "Competitive Pay",
    desc: "Market-leading base salary plus night differential, performance bonuses, and 13th month pay.",
  },
  {
    icon: <ShieldCheck size={19} />,
    bg: "#f59e0b18", color: "#f59e0b",
    title: "Full Gov Benefits",
    desc: "Complete SSS, PhilHealth, and Pag-IBIG coverage from Day 1, fully employer-assisted.",
  },
  {
    icon: <Star size={19} />,
    bg: "#ef444418", color: "#ef4444",
    title: "Recognition Culture",
    desc: "Monthly agent spotlights, team lunches, and annual gala awards for top performers.",
  },
  {
    icon: <Users size={19} />,
    bg: "#6366f118", color: "#6366f1",
    title: "Inclusive Workplace",
    desc: "Diverse, welcoming environment where every culture, background, and voice is celebrated.",
  },
  {
    icon: <Globe size={19} />,
    bg: "#6366f118", color: "#6366f1",
    title: "Global Exposure",
    desc: "Work with US, AU, and EU clients — building world-class communication experience.",
  },
];

export default function WhySection({ t }: WhySectionProps) {
  return (
    <section
      id="why"
      style={{
        background: t.surface,
        borderTop: `1px solid ${t.border}`,
        borderBottom: `1px solid ${t.border}`,
        padding: "5rem 2rem",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="nx-eyebrow" style={{ color: t.accent }}>Why Axiom Core</div>
        <h2 className="nx-h2" style={{ color: t.text }}>More Than Just a Job</h2>
        <p className="nx-sub" style={{ color: t.muted }}>We invest in your growth, well-being, and future.</p>

        <div className="nx-why-grid">
          {WHY_ITEMS.map((w) => (
            <div
              key={w.title}
              className="nx-why-card"
              style={{ background: t.bg, border: `1px solid ${t.border}` }}
            >
              <div className="nx-why-icon" style={{ background: w.bg }}>
                <span style={{ color: w.color }}>{w.icon}</span>
              </div>
              <div className="nx-why-title" style={{ color: t.text }}>{w.title}</div>
              <div className="nx-why-desc"  style={{ color: t.muted }}>{w.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}