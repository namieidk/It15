"use client";
import React, { RefObject } from "react";
import {
  User, Mail, Phone, FileText, ChevronLeft, 
  CheckCircle2, X, Loader2, AlertCircle, Upload
} from "lucide-react";
import { themes } from "../Welcome/Themes";
import { globalStyles } from "../Welcome/Style";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FormDataState {
  firstName: string;
  lastName: string;
  age: string;
  sex: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  resume: File | null;
  coverLetter: string;
}

interface ApplyFormUIProps {
  form: FormDataState;
  errors: Record<string, string>;
  loading: boolean;
  submitted: boolean;
  refCode: string;
  progress: number;
  jobTitle: string;
  dragOver: boolean;
  fileRef: RefObject<HTMLInputElement | null>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
  handlers: {
    handleChange: (key: keyof FormDataState, value: string | File | null) => void;
    handleFile: (file: File | null) => void;
    handleSubmit: () => void;
    setDragOver: (val: boolean) => void;
    onBack: () => void;
  };
}

const applyStyles = `
  .ap-page { min-height: 100vh; font-family: 'Outfit', sans-serif; padding: 0 0 6rem; transition: background .3s; }
  .ap-header { position: sticky; top: 0; z-index: 100; padding: 1rem 2rem; display: flex; align-items: center; gap: 1rem; backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); }
  .ap-back-btn { display: inline-flex; align-items: center; gap: .4rem; padding: .45rem 1rem; border-radius: 9px; font-size: .82rem; cursor: pointer; transition: 0.2s; background: transparent; }
  .ap-header-title { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.1rem; }
  .ap-job-pill { display: inline-flex; align-items: center; padding: .35rem 1rem; border-radius: 999px; font-size: .75rem; font-weight: 600; }
  .ap-progress-wrap { max-width: 780px; margin: 0 auto; padding: 2rem 2rem 0; }
  .ap-progress-bar { height: 6px; border-radius: 999px; overflow: hidden; margin-bottom: .5rem; }
  .ap-progress-fill { height: 100%; transition: width .4s ease; }
  .ap-card { max-width: 780px; margin: 1.5rem auto 0; border-radius: 24px; padding: 2.5rem; transition: 0.3s; }
  .ap-section-title { font-weight: 800; font-size: 1.2rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: .75rem; }
  .ap-section-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .ap-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
  .ap-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.2rem; }
  .ap-field { display: flex; flex-direction: column; gap: .5rem; margin-bottom: 1.2rem; }
  .ap-label { font-size: .8rem; font-weight: 600; }
  .ap-input, .ap-select, .ap-textarea { padding: .8rem 1rem; border-radius: 12px; font-size: .9rem; outline: none; width: 100%; transition: 0.2s; }
  .ap-textarea { min-height: 120px; resize: vertical; }
  .ap-upload-zone { border-radius: 16px; padding: 3rem 2rem; text-align: center; cursor: pointer; border: 2px dashed; transition: 0.2s; }
  .ap-upload-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
  .ap-file-chosen { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-radius: 12px; margin-top: 1rem; border: 1px solid; }
  .ap-btn-submit { flex: 1; border: none; padding: 1rem; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: 0.2s; }
  .ap-error-msg { font-size: .75rem; color: #ef4444; margin-top: 0.25rem; display: flex; align-items: center; gap: 0.25rem; }
  
  @media (max-width: 640px) { .ap-grid-2, .ap-grid-3 { grid-template-columns: 1fr; } }
`;

export const ApplyFormUI: React.FC<ApplyFormUIProps> = (props) => {
  const { form, errors, loading, submitted, refCode, progress, jobTitle, dragOver, fileRef, t, handlers } = props;

  if (submitted) {
    return (
      <div className="ap-page" style={{ background: t.bg, color: t.text }}>
        <style dangerouslySetInnerHTML={{ __html: globalStyles + applyStyles }} />
        <div className="ap-success" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <div className="ap-success-icon" style={{ background: t.accentSoft, width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
            <CheckCircle2 size={40} style={{ color: t.accent }} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Success!</h1>
          <p style={{ color: t.muted, maxWidth: '500px', margin: '0 auto 2rem' }}>Application for <b>{jobTitle}</b> received.</p>
          <div style={{ background: t.surface, padding: '1rem 2rem', borderRadius: '99px', display: 'inline-block', border: `1px solid ${t.accentBorder}`, color: t.accent, fontWeight: 700, letterSpacing: '2px', marginBottom: '3rem' }}>
            REF: {refCode}
          </div>
          <br />
          <button className="ap-btn-submit" style={{ background: t.accent, maxWidth: '300px', margin: '0 auto', color: '#fff' }} onClick={handlers.onBack}>
            Return to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-page" style={{ background: t.bg, color: t.text }}>
      <style dangerouslySetInnerHTML={{ __html: globalStyles + applyStyles }} />

      <div className="ap-header" style={{ background: t.navBg }}>
        <button type="button" className="ap-back-btn" style={{ border: `1px solid ${t.border}`, color: t.muted }} onClick={handlers.onBack}>
          <ChevronLeft size={16} /> Back
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="ap-header-title" style={{ color: t.text }}>Axiom Recruitment</div>
        </div>
        <div className="ap-job-pill" style={{ background: t.accentSoft, color: t.accent, border: `1px solid ${t.accentBorder}` }}>
          {jobTitle}
        </div>
      </div>

      <div className="ap-progress-wrap">
        <div className="ap-progress-bar" style={{ background: t.surface2 }}>
          <div className="ap-progress-fill" style={{ width: `${progress}%`, background: t.accent }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.7rem', color: t.muted, fontWeight: 700 }}>{progress}% COMPLETE</div>
      </div>

      <div className="ap-card" style={{ background: t.surface, border: `1px solid ${t.border}` }}>
        <h3 className="ap-section-title" style={{ color: t.text }}>
           <div className="ap-section-icon" style={{ background: t.accentSoft, color: t.accent }}><User size={16}/></div>
           Personal Information
        </h3>
        
        <div className="ap-grid-2">
          <div className="ap-field">
            <label className="ap-label">First Name</label>
            <input className="ap-input" placeholder="First Name" style={{ background: t.surface2, border: `1px solid ${errors.firstName ? '#ef4444' : t.border}`, color: t.text }} value={form.firstName} onChange={(e) => handlers.handleChange("firstName", e.target.value)} />
            {errors.firstName && <span className="ap-error-msg">{errors.firstName}</span>}
          </div>
          <div className="ap-field">
            <label className="ap-label">Last Name</label>
            <input className="ap-input" placeholder="Last Name" style={{ background: t.surface2, border: `1px solid ${errors.lastName ? '#ef4444' : t.border}`, color: t.text }} value={form.lastName} onChange={(e) => handlers.handleChange("lastName", e.target.value)} />
            {errors.lastName && <span className="ap-error-msg">{errors.lastName}</span>}
          </div>
        </div>

        <div className="ap-grid-2">
          <div className="ap-field">
            <label className="ap-label">Age</label>
            <input type="number" className="ap-input" style={{ background: t.surface2, border: `1px solid ${errors.age ? '#ef4444' : t.border}`, color: t.text }} value={form.age} onChange={(e) => handlers.handleChange("age", e.target.value)} />
            {errors.age && <span className="ap-error-msg">{errors.age}</span>}
          </div>
          <div className="ap-field">
            <label className="ap-label">Sex</label>
            <select className="ap-select" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: form.sex ? t.text : t.muted }} value={form.sex} onChange={(e) => handlers.handleChange("sex", e.target.value)}>
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>

      <div className="ap-card" style={{ background: t.surface, border: `1px solid ${t.border}`, marginTop: '1.5rem' }}>
        <h3 className="ap-section-title" style={{ color: t.text }}>
           <div className="ap-section-icon" style={{ background: t.accentSoft, color: t.accent }}><Mail size={16}/></div>
           Contact & Address
        </h3>
        <div className="ap-grid-2">
          <div className="ap-field">
            <label className="ap-label">Email Address</label>
            <input type="email" className="ap-input" style={{ background: t.surface2, border: `1px solid ${errors.email ? '#ef4444' : t.border}`, color: t.text }} value={form.email} onChange={(e) => handlers.handleChange("email", e.target.value)} />
            {errors.email && <span className="ap-error-msg">{errors.email}</span>}
          </div>
          <div className="ap-field">
            <label className="ap-label">Phone Number</label>
            <input className="ap-input" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.text }} value={form.phone} onChange={(e) => handlers.handleChange("phone", e.target.value)} />
          </div>
        </div>
        <div className="ap-field">
          <label className="ap-label">Street Address</label>
          <input className="ap-input" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.text }} value={form.address} onChange={(e) => handlers.handleChange("address", e.target.value)} />
        </div>
        <div className="ap-grid-3">
          <input className="ap-input" placeholder="City" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.text }} value={form.city} onChange={(e) => handlers.handleChange("city", e.target.value)} />
          <input className="ap-input" placeholder="Province" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.text }} value={form.province} onChange={(e) => handlers.handleChange("province", e.target.value)} />
          <input className="ap-input" placeholder="Zip" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.text }} value={form.zipCode} onChange={(e) => handlers.handleChange("zipCode", e.target.value)} />
        </div>
      </div>

      <div className="ap-card" style={{ background: t.surface, border: `1px solid ${t.border}`, marginTop: '1.5rem' }}>
        <h3 className="ap-section-title" style={{ color: t.text }}>
           <div className="ap-section-icon" style={{ background: t.accentSoft, color: t.accent }}><FileText size={16}/></div>
           Documents
        </h3>
        
        <div 
          className="ap-upload-zone"
          style={{ 
            background: dragOver ? t.accentSoft : t.surface2, 
            borderColor: errors.resume ? '#ef4444' : (dragOver ? t.accent : t.border),
            color: t.muted 
          }}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); handlers.setDragOver(true); }}
          onDragLeave={() => handlers.setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            handlers.setDragOver(false);
            if (e.dataTransfer.files?.[0]) handlers.handleFile(e.dataTransfer.files[0]);
          }}
        >
          <div className="ap-upload-icon" style={{ background: t.accentSoft, color: t.accent }}><Upload size={24}/></div>
          <div style={{ color: t.text, fontWeight: 700 }}>Upload Resume</div>
          <div style={{ fontSize: '0.8rem' }}>PDF or Word (Max 5MB)</div>
          <input ref={fileRef} type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => handlers.handleFile(e.target.files?.[0] || null)} />
        </div>

        {form.resume && (
          <div className="ap-file-chosen" style={{ background: t.accentSoft, borderColor: t.accentBorder }}>
            <FileText size={20} style={{ color: t.accent }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: t.text }}>{form.resume.name}</div>
            </div>
            <X size={18} style={{ cursor: 'pointer', color: t.muted }} onClick={(e) => { e.stopPropagation(); handlers.handleChange("resume", null); }} />
          </div>
        )}
        {errors.resume && <div className="ap-error-msg"><AlertCircle size={12}/> {errors.resume}</div>}

        <div className="ap-field" style={{ marginTop: '2rem' }}>
          <label className="ap-label">Cover Letter (Optional)</label>
          <textarea className="ap-textarea" style={{ background: t.surface2, border: `1px solid ${t.border}`, color: t.text }} value={form.coverLetter} onChange={(e) => handlers.handleChange("coverLetter", e.target.value)} />
        </div>

        {errors.submit && <div className="ap-error-msg" style={{ justifyContent: 'center', marginBottom: '1rem' }}>{errors.submit}</div>}

        <button 
          type="button" 
          className="ap-btn-submit" 
          style={{ background: t.accent, boxShadow: `0 8px 20px ${t.accentGlow}`, color: '#fff' }} 
          onClick={handlers.handleSubmit} 
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <>SUBMIT APPLICATION <CheckCircle2 size={18} /></>}
        </button>
      </div>
    </div>
  );
};