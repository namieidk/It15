"use client";
import { ChevronRight, Building2, Users, Briefcase, Clock, Award, TrendingUp } from "lucide-react";
import { Theme } from "./Types";

interface HeroProps {
  t: Theme;
  onScrollTo: (id: string) => void;
}

const STATS = [
  { icon: <Users size={19} />,      val: "500+",    lbl: "Employees"      },
  { icon: <Briefcase size={19} />,  val: "4",        lbl: "Departments"    },
  { icon: <Clock size={19} />,      val: "24 / 7",   lbl: "Operations"     },
  { icon: <Award size={19} />,      val: "Top BPO",  lbl: "Mindanao 2025"  },
  { icon: <TrendingUp size={19} />, val: "95%",      lbl: "Retention Rate" },
];

export default function Hero({ t, onScrollTo }: HeroProps) {
  return (
    <>
      {/* ── Hero ── */}
      <section className="nx-hero" style={{ background: t.heroBg }}>
        <div
          className="nx-orb"
          style={{ width: 600, height: 600, top: -100, left: -100, background: `radial-gradient(circle, ${t.orb1} 0%, transparent 70%)` }}
        />
        <div
          className="nx-orb"
          style={{ width: 400, height: 400, bottom: -80, right: -80, background: `radial-gradient(circle, ${t.orb2} 0%, transparent 70%)` }}
        />
        <div className="nx-grid" style={{ ["--gl" as string]: t.gridline }} />

        <div className="nx-hero-inner">
          <div
            className="nx-chip fu0"
            style={{ background: t.chipBg, border: `1px solid ${t.chipBorder}`, color: t.accent }}
          >
            <span className="live-dot" style={{ background: t.accent }} />
            Now Hiring in Davao City
          </div>

          <h1 className="nx-h1 fu1" style={{ color: t.text }}>
            Launch Your Career<br />
            with <em style={{ color: t.accent }}>Axiom Core</em>
          </h1>

          <p className="nx-hero-sub fu2" style={{ color: t.muted }}>
            Mindanao&apos;s fastest-growing BPO is looking for passionate individuals.
            Competitive pay, night differential, full government benefits, and a clear
            path to leadership — all from the heart of Davao City.
          </p>

          <div className="nx-hero-btns fu3">
            <button
              className="nx-btn-primary"
              style={{ background: t.accent, boxShadow: `0 6px 22px ${t.accentGlow}` }}
              onClick={() => onScrollTo("jobs")}
            >
              Explore Open Positions <ChevronRight size={16} />
            </button>
            <button
              className="nx-btn-ghost"
              style={{ border: `1px solid ${t.border}`, color: t.text }}
              onClick={() => onScrollTo("about")}
            >
              <Building2 size={16} /> Learn About Us
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div
        className="nx-stats"
        style={{ background: t.surface, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}
      >
        {STATS.map((s) => (
          <div
            key={s.lbl}
            className="nx-stat"
            style={{ borderRight: `1px solid ${t.border}` }}
            onMouseEnter={(e) => (e.currentTarget.style.background = t.surface2)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div className="nx-stat-icon" style={{ color: t.accent }}>{s.icon}</div>
            <div className="nx-stat-val"  style={{ color: t.text }}>{s.val}</div>
            <div className="nx-stat-lbl"  style={{ color: t.muted }}>{s.lbl}</div>
          </div>
        ))}
      </div>
    </>
  );
}