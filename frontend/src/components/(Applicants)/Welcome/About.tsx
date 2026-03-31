"use client";
import { Theme, DeptIcon } from "./Types";

interface AboutSectionProps {
  t: Theme;
}

const DEPARTMENTS = [
  { dept: "Customer Support",   sub: "Largest team — inbound voice and email"       },
  { dept: "Technical Helpdesk", sub: "US-based Tier 1 and Tier 2 support"           },
  { dept: "Quality Assurance",  sub: "CSAT, AHT, and compliance monitoring"         },
  { dept: "HR / Admin",         sub: "People operations and statutory compliance"   },
];

export default function AboutSection({ t }: AboutSectionProps) {
  return (
    <section className="nx-wrap" id="about">
      <div className="nx-about-grid">

        {/* Left — Text */}
        <div>
          <div className="nx-eyebrow" style={{ color: t.accent }}>Who We Are</div>
          <h3 className="nx-about-h3" style={{ color: t.text }}>Mindanao&apos;s BPO of Choice</h3>

          <p className="nx-about-p" style={{ color: t.muted }}>
            Axiom Core Davao delivers world-class customer support and technical helpdesk
            services for leading international brands. Founded in Davao City, we are proud to
            develop Filipino talent right here in Mindanao.
          </p>
          <p className="nx-about-p" style={{ color: t.muted }}>
            Our vision is to be the{" "}
            <strong style={{ color: t.accent }}>leading employer of choice in Mindanao by 2030</strong> —
            built on a culture of excellence, empathy, and continuous growth.
          </p>
          <p className="nx-about-p" style={{ color: t.muted }}>
            From Day 1, every Axiom Core employee receives full statutory benefits,
            structured onboarding, and access to our in-house learning and development program.
          </p>
        </div>

        {/* Right — Department Visual */}
        <div
          className="nx-about-visual"
          style={{ background: t.surface, border: `1px solid ${t.border}` }}
        >
          <div
            className="nx-about-glow"
            style={{ background: `radial-gradient(circle, ${t.orb1} 0%, transparent 70%)` }}
          />
          {DEPARTMENTS.map((d) => (
            <div
              key={d.dept}
              className="nx-dept-row"
              style={{ background: t.surface2, border: `1px solid ${t.border}` }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = t.accentBorder)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = t.border)}
            >
              <div
                className="nx-dept-icon-box"
                style={{ background: t.accentSoft, color: t.accent }}
              >
                <DeptIcon dept={d.dept} size={17} />
              </div>
              <div>
                <div className="nx-dept-name" style={{ color: t.text }}>{d.dept}</div>
                <div className="nx-dept-sub"  style={{ color: t.muted }}>{d.sub}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}