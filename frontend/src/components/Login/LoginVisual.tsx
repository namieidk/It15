'use client';

import React from 'react';
import Image from 'next/image';

// --- BACKGROUND AMBIANCE (Pulses) ---
export const LoginBackground = () => (
  <>
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-900 rounded-full blur-[120px] opacity-20 animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-emerald-900 rounded-full blur-[100px] opacity-10" />
  </>
);

// --- HEADER WITH LOGO ---
export const LoginHeader = () => (
  <div className="text-center mb-8 flex flex-col items-center italic font-black">
    {/* LOGO PEDESTAL (Solid White, No Hover) */}
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white shadow-xl shadow-indigo-600/5 mb-6 overflow-hidden border border-slate-200">
      <Image 
        src="/logo.png" 
        alt="Axiom Logo" 
        width={48} // Slightly larger logo footprint
        height={48} 
        priority // Ensures fast loading on login screen
        className="object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
      />
    </div>

    {/* MAIN TITLES */}
    <h1 className="text-3xl tracking-tighter text-white uppercase italic">
      Axiom <span className="font-light text-indigo-500 not-italic">Core</span>
    </h1>
    
    {/* SUBTITLE (Command Center Style) */}
    <div className="flex items-center gap-3 mt-2">
        <div className="h-[1px] w-4 bg-slate-800" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black">
            Secure ERP Access
        </p>
        <div className="h-[1px] w-4 bg-slate-800" />
    </div>
  </div>
);