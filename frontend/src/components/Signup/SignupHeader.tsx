'use client';

import React from 'react';
import Image from 'next/image';

export const SignupHeader = () => (
  <div className="text-center mb-8 flex flex-col items-center italic font-black">
    {/* LOGO PEDESTAL (Matches Login Style) */}
    <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-white shadow-xl shadow-indigo-600/5 mb-6 overflow-hidden border border-slate-200">
      <Image 
        src="/logo.png" 
        alt="Axiom Logo" 
        width={48} 
        height={48} 
        priority 
        className="object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
      />
    </div>

    {/* TITLES */}
    <h1 className="text-2xl tracking-[0.2em] text-white uppercase">
      Admin <span className="text-indigo-500 font-light not-italic">Enrollment</span>
    </h1>
    
    <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-3 font-bold bg-slate-950 px-4 py-1.5 rounded-full border border-white/5">
      Terminal ID: <span className="text-indigo-400">AX-SYS-77</span>
    </p>
  </div>
);