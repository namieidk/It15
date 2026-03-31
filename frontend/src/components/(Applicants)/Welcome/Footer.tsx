"use client";
import { MapPin, Phone, Mail, Globe, Clock } from "lucide-react";

function IconFacebook() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconXTwitter() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

import { Theme } from "./Types";

interface FooterProps {
  t: Theme;
  onScrollTo: (id: string) => void;
}

const QUICK_LINKS = [
  { label: "Open Positions",   id: "jobs"  },
  { label: "Why Axiom Core",   id: "why"   },
  { label: "About the Company",id: "about" },
  { label: "Employee Portal",  id: ""      },
  { label: "HR Self-Service",  id: ""      },
];

const DEPARTMENT_LINKS = [
  "Customer Support",
  "Technical Helpdesk",
  "Quality Assurance",
  "HR & Administration",
  "Operations & Training",
];

const CONTACT_ITEMS = [
  {
    icon: <MapPin size={14} />,
    label: "Address",
    value: "18F Aeon Centre Tower, JP Laurel Ave, Bajada, Davao City, 8000 Davao del Sur, Philippines",
  },
  {
    icon: <Phone size={14} />,
    label: "Phone",
    value: "+63 (82) 297-4400\n+63 917 800 9900",
  },
  {
    icon: <Mail size={14} />,
    label: "Email",
    value: "careers@axiomcore.ph\nhr@axiomcore.ph",
  },
  {
    icon: <Globe size={14} />,
    label: "Website",
    value: "www.axiomcore.ph",
  },
  {
    icon: <Clock size={14} />,
    label: "Office Hours",
    value: "Mon – Fri: 8:00 AM – 6:00 PM\nSat: 9:00 AM – 1:00 PM",
  },
];

const SOCIAL_ICONS = [
  { key: "facebook", icon: <IconFacebook /> },
  { key: "twitter",  icon: <IconXTwitter /> },
  { key: "globe",    icon: <IconGlobe />    },
];

const FOOTER_BADGES = ["DOLE Accredited", "PEZA Registered", "ISO 9001:2015"];

export default function Footer({ t, onScrollTo }: FooterProps) {
  return (
    <footer id="contact" style={{ background: t.surface, borderTop: `1px solid ${t.border}` }}>
      <div className="nx-footer-top">

        {/* Brand */}
        <div>
          <div className="nx-footer-brand" style={{ color: t.text }}>
            Axiom<span style={{ color: t.accent }}>Core</span>
          </div>
          <p className="nx-footer-tagline" style={{ color: t.muted }}>
            Empowering Filipino talent through world-class BPO operations in the heart of Davao City, Mindanao.
          </p>
          <div className="nx-socials">
            {SOCIAL_ICONS.map(({ key, icon }) => (
              <button
                key={key}
                className="nx-social-btn"
                style={{ border: `1px solid ${t.border}`, color: t.muted }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.borderColor = t.accentBorder;
                  el.style.color       = t.accent;
                  el.style.background  = t.accentSoft;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.borderColor = t.border;
                  el.style.color       = t.muted;
                  el.style.background  = "transparent";
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="nx-footer-col-title" style={{ color: t.text }}>Quick Links</div>
          <ul className="nx-footer-links">
            {QUICK_LINKS.map(({ label, id }) => (
              <li
                key={label}
                style={{ color: t.muted }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = t.accent)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = t.muted)}
                onClick={() => id && onScrollTo(id)}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Departments */}
        <div>
          <div className="nx-footer-col-title" style={{ color: t.text }}>Departments</div>
          <ul className="nx-footer-links">
            {DEPARTMENT_LINKS.map((lk) => (
              <li
                key={lk}
                style={{ color: t.muted }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = t.accent)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = t.muted)}
              >
                {lk}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="nx-footer-col-title" style={{ color: t.text }}>Contact Us</div>
          {CONTACT_ITEMS.map((c) => (
            <div key={c.label} className="nx-contact-item">
              <span style={{ color: t.accent, flexShrink: 0, marginTop: 3 }}>{c.icon}</span>
              <div>
                <div className="nx-contact-lbl" style={{ color: t.accent }}>{c.label}</div>
                <div className="nx-contact-val" style={{ color: t.muted, whiteSpace: "pre-line" }}>
                  {c.value}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="nx-footer-bottom" style={{ borderTop: `1px solid ${t.border}` }}>
        <div className="nx-footer-copy" style={{ color: t.muted }}>
          © 2026 Axiom Core Davao. All rights reserved.&nbsp;·&nbsp;IT15 Project — Axiom Core HRIS
        </div>
        <div className="nx-footer-badges">
          {FOOTER_BADGES.map((b) => (
            <span
              key={b}
              className="nx-footer-badge"
              style={{ border: `1px solid ${t.border}`, color: t.muted }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}