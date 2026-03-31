"use client";
import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

import { themes }       from "../../../components/(Applicants)/Welcome/Themes";
import { globalStyles } from "../../../components/(Applicants)/Welcome/Style";
import { Job }          from "../../../components/(Applicants)/Welcome/Types";

import Navbar        from "../../../components/(Applicants)/Welcome/Navbar";
import Hero          from "../../../components/(Applicants)/Welcome/Hero";
import JobsSection   from "../../../components/(Applicants)/Welcome/Jobsection";
import WhySection    from "../../../components/(Applicants)/Welcome/Whysection";
import AboutSection  from "../../../components/(Applicants)/Welcome/About";
import Footer        from "../../../components/(Applicants)/Welcome/Footer";

// Force these to be Client-Only to stop Hydration Mismatches and Effect Cascades
const JobDetailsModal = dynamic(() => import("../../../components/(Applicants)/Welcome/Modals").then(mod => mod.JobDetailsModal), { ssr: false });
const ApplyModal = dynamic(() => import("../../../components/(Applicants)/Welcome/Modals").then(mod => mod.ApplyModal), { ssr: false });

export default function WelcomePage() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [detailJob, setDetailJob] = useState<Job | null>(null);
  const [applyJob, setApplyJob]   = useState<Job | null>(null);

  // We use the theme inside a useMemo so it doesn't recalculate on every render
  const t = useMemo(() => themes.dark, []);

  useEffect(() => {
    const onScroll = (): void => {
      const isOverThreshold = window.scrollY > 50;
      // Functional update: only triggers re-render if the value actually flips
      setScrolled(prev => prev !== isOverThreshold ? isOverThreshold : prev);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string): void => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        background: t.bg,
        color: t.text,
        minHeight: "100vh",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      <Navbar
        t={t}
        dark={true}
        scrolled={scrolled}
        onToggleTheme={() => {}} 
        onScrollTo={scrollTo}
      />

      <Hero t={t} onScrollTo={scrollTo} />
      <JobsSection t={t} onOpenDetails={(job: Job) => setDetailJob(job)} />
      <WhySection t={t} />
      <AboutSection t={t} />
      <Footer t={t} onScrollTo={scrollTo} />

      {/* Modals are now safely loaded only on client */}
      {detailJob && (
        <JobDetailsModal
          job={detailJob}
          t={t}
          onClose={() => setDetailJob(null)}
          onApply={(job: Job) => {
            setDetailJob(null);
            setApplyJob(job);
          }}
        />
      )}

      {applyJob && (
        <ApplyModal
          job={applyJob}
          t={t}
          onClose={() => setApplyJob(null)}
        />
      )}
    </div>
  );
}