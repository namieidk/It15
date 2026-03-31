"use client";
import { Sun, Moon } from "lucide-react";
import { Theme } from "./Types";

interface NavbarProps {
  t: Theme;
  dark: boolean;
  scrolled: boolean;
  onToggleTheme: () => void;
  onScrollTo: (id: string) => void;
}

const NAV_LINKS = [
  { id: "jobs",    label: "Open Roles" },
  { id: "why",     label: "Why Us"     },
  { id: "about",   label: "About"      },
  { id: "contact", label: "Contact"    },
];

export default function Navbar({ t, dark, scrolled, onToggleTheme, onScrollTo }: NavbarProps) {
  return (
    <nav
      className={`nx-nav${scrolled ? " stuck" : ""}`}
      style={{
        background: scrolled ? t.navBg : "transparent",
        borderBottom: scrolled ? `1px solid ${t.navBorder}` : "1px solid transparent",
      }}
    >
      {/* Logo */}
      <div className="nx-logo" style={{ color: t.text }}>
        <span className="live-dot" style={{ background: t.accent }} />
        Axiom<span style={{ color: t.accent }}>Core</span>
      </div>

      {/* Nav Links */}
      <div className="nx-nav-links">
        {NAV_LINKS.map(({ id, label }) => (
          <button key={id} style={{ color: t.muted }} onClick={() => onScrollTo(id)}>
            {label}
          </button>
        ))}
      </div>

      {/* Right Actions */}
      <div className="nx-nav-right">
        <button
          className="nx-icon-btn"
          style={{ border: `1px solid ${t.border}`, color: t.muted, background: "transparent" }}
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        
      </div>
    </nav>
  );
}