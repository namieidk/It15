'use client';

import React, { useState, useEffect } from 'react';
import { HRSidebar } from '../../../components/(Hr)/Dashboard/sidebar';
import { 
  Search, Filter, UserPlus, FileText, CheckCircle2, 
  XCircle, Briefcase, Mail, Loader2 
} from 'lucide-react';
import { toast } from 'sonner';

interface Applicant {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  email: string;
  phone: string;
  resumePath: string;
  referenceCode: string;
  status: string;
}

export default function HRApplicantListPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('http://localhost:5076/api/applicants?status=PENDING', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: Failed to fetch`);
      
      const data: Applicant[] = await response.json();
      setApplicants(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error("Fetch Error:", message);
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (app: Applicant, newStatus: 'APPROVED' | 'REJECTED') => {
    const actionText = newStatus === 'APPROVED' ? 'Approved' : 'Denied';
    
    try {
      const response = await fetch(`http://localhost:5076/api/applicants/${app.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Remove from UI
        setApplicants(prev => prev.filter(a => a.id !== app.id));
        
        // Trigger Sonner Toast
        toast.success(`Application ${actionText}`, {
          description: `${app.firstName} ${app.lastName} has been moved to the ${newStatus.toLowerCase()} list.`,
        });
      } else {
        toast.error("Action Failed", {
          description: "Could not update the applicant status on the server.",
        });
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Connection Error", {
        description: "An error occurred while communicating with the database.",
      });
    }
  };

  const filtered = applicants.filter(app => 
    `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.referenceCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <HRSidebar />

      <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
        
        <header className="px-12 py-10 border-b border-white/5 flex justify-between items-end backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
                <UserPlus className="w-4 h-4" strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Talent Acquisition</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              Applicant <span className="text-indigo-600">Pipeline</span>
            </h1>
          </div>

          <div className="flex gap-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                    placeholder="SEARCH CANDIDATES..." 
                    className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black tracking-widest outline-none focus:border-indigo-500/50 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button onClick={fetchApplicants} className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black tracking-widest hover:bg-white/10 transition-all">
                <Filter className="w-4 h-4" /> REFRESH
            </button>
          </div>
        </header>

        <div className="p-12 max-w-[1600px] w-full mx-auto space-y-6">
          
          {loading ? (
            <div className="flex flex-col items-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                <p className="text-[10px] font-black tracking-[0.3em] text-slate-500">Retrieving Candidates...</p>
            </div>
          ) : errorMsg ? (
            <div className="py-20 text-center border border-red-500/20 bg-red-500/5 rounded-[3rem]">
              <p className="text-red-500 font-black tracking-widest text-xs uppercase">{errorMsg}</p>
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((app) => (
                <div key={app.id} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-between gap-8 group hover:border-indigo-500/30 transition-all backdrop-blur-3xl">
                  
                  <div className="flex items-center gap-8 flex-1">
                    <div className="w-20 h-20 rounded-[2rem] bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center text-indigo-500 text-xl font-black">
                      {app.firstName[0]}{app.lastName[0]}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <h2 className="text-xl font-black text-white tracking-tight">{app.firstName} {app.lastName}</h2>
                        <span className="px-3 py-1 rounded-lg text-[8px] font-black tracking-widest border border-white/10 bg-slate-500/10 text-slate-500">
                          {app.referenceCode}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-6 items-center text-slate-500">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5" />
                          <p className="text-[10px] font-black tracking-widest uppercase">{app.jobTitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" />
                          <p className="text-[10px] font-black tracking-widest lowercase">{app.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8">
                    <button 
                      title="VIEW RESUME"
                      onClick={() => window.open(`http://localhost:5076/uploads/resumes/${app.resumePath}`, '_blank')}
                      className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                    
                    <div className="h-10 w-[1px] bg-white/5 mx-2 hidden lg:block" />

                    <button 
                      onClick={() => handleStatusUpdate(app, 'REJECTED')}
                      className="flex-1 lg:flex-none px-6 py-4 rounded-2xl border border-red-500/20 text-red-500 font-black text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> DENY
                    </button>

                    <button 
                      onClick={() => handleStatusUpdate(app, 'APPROVED')}
                      className="flex-1 lg:flex-none px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black text-[10px] tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> APPROVE
                    </button>
                  </div>
                </div>
            ))
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
              <p className="text-slate-600 font-black tracking-[0.5em] text-xs uppercase">No Applicants Found</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}