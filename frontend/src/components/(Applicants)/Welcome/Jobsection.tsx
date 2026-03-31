"use client";
import { useState } from "react";
import { MapPin, Clock, Briefcase, ChevronRight, CalendarDays, Filter } from "lucide-react";
import { Theme, Job, DeptIcon, jobs, allDepartments } from "./Types";

interface JobsSectionProps {
  t: Theme;
  onOpenDetails: (job: Job) => void;
}

export default function JobsSection({ t, onOpenDetails }: JobsSectionProps) {
  const [filterDept, setFilterDept] = useState<string>("All");

  const filtered: Job[] =
    filterDept === "All" ? jobs : jobs.filter((j) => j.department === filterDept);

  return (
    <section className="nx-wrap" id="jobs">
      <div className="nx-eyebrow" style={{ color: t.accent }}>Open Positions</div>
      <h2 className="nx-h2" style={{ color: t.text }}>Find Your Role</h2>
      <p className="nx-sub" style={{ color: t.muted }}>
        We&apos;re actively hiring across all departments. Filter by team and apply directly below.
      </p>

      {/* Filter Chips */}
      <div className="nx-filter">
        <span className="nx-filter-lbl" style={{ color: t.muted }}>
          <Filter size={13} /> Filter:
        </span>
        {allDepartments.map((d) => (
          <button
            key={d}
            className="nx-chip-btn"
            style={
              filterDept === d
                ? { background: t.accentSoft, border: `1px solid ${t.accentBorder}`, color: t.accent }
                : { background: "transparent", border: `1px solid ${t.border}`, color: t.muted }
            }
            onClick={() => setFilterDept(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Job Cards */}
      <div className="nx-jobs">
        {filtered.map((job) => (
          <JobCard key={job.id} job={job} t={t} onOpen={onOpenDetails} />
        ))}
      </div>
    </section>
  );
}

// ─── Job Card ────────────────────────────────────────────────────────────────

interface JobCardProps {
  job: Job;
  t: Theme;
  onOpen: (job: Job) => void;
}

function JobCard({ job, t, onOpen }: JobCardProps) {
  const tags = [
    { icon: <MapPin size={11} />,    label: job.location },
    { icon: <Clock size={11} />,     label: job.shift    },
    { icon: <Briefcase size={11} />, label: job.type     },
  ];

  return (
    <div
      className="nx-card"
      style={{ background: t.surface, border: `1px solid ${t.border}` }}
      onClick={() => onOpen(job)}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background   = t.surface2;
        el.style.boxShadow    = `0 16px 40px ${t.shadow}`;
        el.style.borderColor  = t.accentBorder;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background  = t.surface;
        el.style.boxShadow   = "none";
        el.style.borderColor = t.border;
      }}
    >
      {/* Header */}
      <div className="nx-card-head">
        <div
          className="nx-dept-box"
          style={{ background: t.accentSoft, color: t.accent, border: `1px solid ${t.accentBorder}` }}
        >
          <DeptIcon dept={job.department} />
        </div>
        <span
          className="nx-badge"
          style={{
            background: `${job.badgeColor}1a`,
            color: job.badgeColor,
            border: `1px solid ${job.badgeColor}40`,
          }}
        >
          {job.badge}
        </span>
      </div>

      <div className="nx-job-title" style={{ color: t.text }}>{job.title}</div>
      <div className="nx-job-dept"  style={{ color: t.muted }}>{job.department}</div>

      {/* Tags */}
      <div className="nx-tags">
        {tags.map((tg) => (
          <span
            key={tg.label}
            className="nx-tag"
            style={{ background: t.tagBg, border: `1px solid ${t.border}`, color: t.muted }}
          >
            {tg.icon}{tg.label}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="nx-card-foot" style={{ borderTop: `1px solid ${t.border}` }}>
        <div className="nx-slots" style={{ color: t.muted }}>
          <CalendarDays size={13} />
          <strong style={{ color: t.accentWarm }}>{job.slots}</strong> slots open
        </div>
        <button
          className="nx-btn-view"
          style={{ border: `1px solid ${t.accentBorder}`, color: t.accent }}
          onClick={(e) => { e.stopPropagation(); onOpen(job); }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = t.accentSoft)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
        >
          Details <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}