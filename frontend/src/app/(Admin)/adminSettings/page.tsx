'use client';

import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { AdminSidebar } from '../../../components/(Admin)/Sidebar';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Bell, 
  Database, 
  Lock, 
  Cloud, 
  Save,
  RefreshCw,
  Fingerprint,
  HardDrive,
  Loader2
} from 'lucide-react';

export interface SystemSettings {
  id: number;
  sessionTimeout: number;
  passwordExpiry: number;
  mfaRequired: boolean;
  alertCritical: boolean;
  alertLogins: boolean;
  alertExports: boolean;
  storageUsage: number;
}

export default function AdminSettingsPage() {
  const [loading, setLoading]   = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const [settings, setSettings] = useState<SystemSettings>({
    id:             0,
    sessionTimeout: 30,
    passwordExpiry: 90,
    mfaRequired:    true,
    alertCritical:  true,
    alertLogins:    false,
    alertExports:   true,
    storageUsage:   84,
  });

  // ── FETCH SETTINGS ────────────────────────────────────────────────────────
  // Fixed: added credentials: 'include' so the HttpOnly JWT cookie is sent.
  // Without it the backend sees no token and returns 401.
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:5076/api/admin/syssetting', {
          credentials: 'include',   // ← THE FIX
        });
        
        if (response.ok) {
          const data: SystemSettings = await response.json();
          setSettings(data);
        } else if (response.status === 401 || response.status === 403) {
          window.location.href = '/login';
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Kernel Error:', errorData.details || 'Unknown Error');
          toast.error('KERNEL SYNC FAILURE', {
            description: errorData.message || 'Could not retrieve settings from database.',
          });
        }
      } catch (error) {
        console.error('Connection Refused:', error);
        toast.error('CONNECTION OFFLINE', {
          description: 'Ensure the C# Backend is active on port 5076.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // ── SAVE SETTINGS ─────────────────────────────────────────────────────────
  // Fixed: added credentials: 'include' here too — PUT also needs the cookie.
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:5076/api/admin/syssetting', {
        method:      'PUT',
        credentials: 'include',   // ← THE FIX
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('CONFIGURATION DEPLOYED', { description: 'Kernel parameters updated.' });
      } else if (response.status === 401 || response.status === 403) {
        window.location.href = '/login';
      } else {
        toast.error('DEPLOYMENT REJECTED');
      }
    } catch (error) {
      toast.error('NETWORK ERROR');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSetting = (key: keyof SystemSettings) => {
    const val = settings[key];
    if (typeof val === 'boolean') {
      setSettings(prev => ({ ...prev, [key]: !val }));
    }
  };

  if (loading) return (
    <div className="h-screen w-full bg-[#020617] flex flex-col items-center justify-center italic font-black text-indigo-500 tracking-[0.4em]">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      SYNCHRONIZING CORE...
    </div>
  );

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase italic font-black">
      <Toaster position="top-right" richColors theme="dark" />
      <AdminSidebar />
      
      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-[#020617] scrollbar-hide">
        
        <header className="px-12 py-10 border-b border-white/5 flex justify-between items-end backdrop-blur-md sticky top-0 z-20 bg-[#020617]/90">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
              <SettingsIcon className="w-4 h-4" strokeWidth={3} />
              <span className="text-[10px] tracking-[0.4em]">Axiom Interface</span>
            </div>
            <h1 className="text-4xl text-white tracking-tighter uppercase font-black italic">
              System <span className="text-indigo-600">Settings</span>
            </h1>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save & Deploy
          </button>
        </header>

        <div className="p-12 max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
            {/* SECURITY */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 space-y-8 backdrop-blur-3xl shadow-2xl">
              <h3 className="text-xs text-indigo-500 tracking-[0.4em] flex items-center gap-3">
                <Lock className="w-4 h-4" /> Security Matrix
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[8px] text-slate-500 tracking-widest ml-2">SESSION TIMEOUT (MIN)</label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-indigo-500 transition-all font-black italic"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[8px] text-slate-500 tracking-widest ml-2">PASSWORD EXPIRY (DAYS)</label>
                  <input
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => setSettings({ ...settings, passwordExpiry: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-indigo-500 transition-all font-black italic"
                  />
                </div>
              </div>

              <div
                onClick={() => toggleSetting('mfaRequired')}
                className="flex items-center justify-between p-6 bg-indigo-600/5 border border-indigo-600/20 rounded-2xl cursor-pointer hover:bg-indigo-600/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <Fingerprint className={`w-6 h-6 ${settings.mfaRequired ? 'text-indigo-500' : 'text-slate-600'}`} />
                  <div>
                    <p className="text-[10px] text-white tracking-widest uppercase">Force MFA Protocol</p>
                    <p className="text-[8px] text-slate-600 tracking-widest">Secondary Device Auth Required</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full relative p-1 transition-colors duration-300 ${settings.mfaRequired ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${settings.mfaRequired ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>

            {/* MAINTENANCE */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 space-y-8 backdrop-blur-3xl">
              <h3 className="text-xs text-indigo-500 tracking-[0.4em] flex items-center gap-3">
                <Database className="w-4 h-4" /> Cluster Management
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="flex flex-col items-start gap-4 p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 transition-all">
                  <RefreshCw className="w-6 h-6 text-indigo-400" />
                  <div>
                    <h4 className="text-[10px] text-white tracking-widest mb-1 uppercase">Re-Index Nodes</h4>
                    <p className="text-[8px] text-slate-600 tracking-widest uppercase italic font-black">Flush SQL Buffer</p>
                  </div>
                </button>
                <button className="flex flex-col items-start gap-4 p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 transition-all">
                  <Cloud className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h4 className="text-[10px] text-white tracking-widest mb-1 uppercase">Cloud Mirror</h4>
                    <p className="text-[8px] text-slate-600 tracking-widest uppercase italic font-black">Sync To Remote Core</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {/* INFRASTRUCTURE */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 space-y-6">
              <h3 className="text-[10px] text-slate-500 tracking-[0.4em] uppercase">Hardware Status</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-4 h-4 text-indigo-500" />
                    <span className="text-[10px] text-white tracking-widest">SATA-SSD 01</span>
                  </div>
                  <span className="text-[10px] text-indigo-500 font-black">{settings.storageUsage}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${settings.storageUsage}%` }} />
                </div>
              </div>
            </div>

            {/* ALERTS */}
            <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 space-y-6">
              <h3 className="text-[10px] text-slate-500 tracking-[0.4em] flex items-center gap-2 uppercase font-black">
                <Bell className="w-3 h-3 text-indigo-500" /> Global Alerts
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'CRITICAL ERRORS', key: 'alertCritical' as keyof SystemSettings },
                  { label: 'USER LOGINS',     key: 'alertLogins'   as keyof SystemSettings },
                  { label: 'DAILY EXPORTS',   key: 'alertExports'  as keyof SystemSettings },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSetting(item.key)}
                  >
                    <span className="text-[9px] text-slate-300 tracking-widest uppercase italic font-black">
                      {item.label}
                    </span>
                    <input
                      type="checkbox"
                      className="accent-indigo-600 w-4 h-4 cursor-pointer"
                      checked={settings[item.key] as boolean}
                      onChange={() => {}}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}