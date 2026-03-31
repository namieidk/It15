"use client";
import React, { useEffect } from "react";
import { X, MapPin, Clock, Briefcase, CalendarDays, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Theme, Job } from "./Types";

interface ApplyModalProps {
  job: Job;
  t: Theme;
  onClose: () => void;
}

export function ApplyModal({ job, t, onClose }: ApplyModalProps) {
  const router = useRouter();

  useEffect(() => {
    // Construct params
    const params = new URLSearchParams({
      jobId:    String(job.id),
      jobTitle: job.title,
      dept:     job.department,
    });

    // Use replace instead of push to prevent back-button loops
    router.replace(`/Apply?${params.toString()}`);
  }, [job, router]);

  return (
    <div className="nx-overlay" onClick={onClose}>
      <div
        className="nx-modal"
        style={{ 
          background: t.surface, 
          border: `1px solid ${t.border}`, 
          textAlign: "center", 
          padding: "3rem 2rem" 
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div style={{ color: t.accent, marginBottom: "1.5rem" }}>
          <Loader2 size={42} className="animate-spin" style={{ margin: "0 auto" }} />
        </div>
        <div style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontWeight: 800, 
          fontSize: "1.2rem", 
          color: t.text, 
          marginBottom: ".5rem" 
        }}>
          Preparing Application
        </div>
        <p style={{ color: t.muted, fontSize: ".88rem" }}>
          Redirecting you to the form for <strong style={{ color: t.text }}>{job.title}</strong>
        </p>
      </div>
    </div>
  );
}

// ─── Job Details Modal ────────────────────────────────────────────────────────

interface JobDetailsModalProps {
  job: Job;
  t: Theme;
  onClose: () => void;
  onApply: (job: Job) => void;
}

export function JobDetailsModal({ job, t, onClose, onApply }: JobDetailsModalProps) {
  return (
    <div className="nx-overlay" onClick={onClose}>
      <div
        className="nx-modal"
        style={{ background: t.surface, border: `1px solid ${t.border}` }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <button
          type="button"
          className="nx-modal-x"
          style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.muted }}
          onClick={onClose}
        >
          <X size={15} />
        </button>

        <span
          className="nx-badge"
          style={{
            background: `${job.badgeColor}1a`,
            color: job.badgeColor,
            border: `1px solid ${job.badgeColor}40`,
            display: "inline-block",
            marginBottom: ".8rem",
          }}
        >
          {job.badge}
        </span>

        <div className="nx-modal-title" style={{ color: t.text }}>{job.title}</div>
        <div className="nx-modal-dept"  style={{ color: t.accent }}>{job.department}</div>

        <div className="nx-tags">
          {[
            { icon: <MapPin size={11} />,       label: job.location               },
            { icon: <Clock size={11} />,        label: job.shift                  },
            { icon: <Briefcase size={11} />,    label: job.type                   },
            { icon: <CalendarDays size={11} />, label: `${job.slots} slots open`  },
          ].map((tg) => (
            <span
              key={tg.label}
              className="nx-tag"
              style={{ background: t.tagBg, border: `1px solid ${t.border}`, color: t.muted }}
            >
              {tg.icon}{tg.label}
            </span>
          ))}
        </div>

        <div className="nx-modal-lbl"  style={{ color: t.muted }}>Requirements</div>
        <ul className="nx-req-list">
          {job.requirements.map((r, i) => (
            <li key={i} style={{ color: t.muted, display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '8px' }}>
              <CheckCircle2 size={14} style={{ color: t.accent, flexShrink: 0, marginTop: 2 }} />
              {r}
            </li>
          ))}
        </ul>

        <div className="nx-modal-actions">
          <button
            className="nx-btn-apply"
            style={{ background: t.accent, boxShadow: `0 4px 14px ${t.accentGlow}`, color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => onApply(job)}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}