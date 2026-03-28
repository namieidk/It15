'use client';

import React from 'react';
import { UserPlus, UserRoundCog, Loader2 } from 'lucide-react';

export interface UserAccount {
  id: number;
  name: string;
  employeeId: string;
  role: string;
  department?: string; 
  status?: string;     
}

interface Props {
  accounts: UserAccount[];
  loading: boolean;
  onCreateClick: () => void;
  onEditClick: (account: UserAccount) => void;
  onRevokeClick: (id: number) => void;
  onReactivateClick: (id: number) => void; // ✅ ADDED
}

export const AccountList = ({ accounts, loading, onCreateClick, onEditClick, onRevokeClick, onReactivateClick }: Props) => {
  return (
    <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617]">
      <header className="px-12 py-10 border-b border-white/5 flex justify-between items-end backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 mb-2">
            <UserRoundCog className="w-4 h-4" strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Identity Management</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            Manage <span className="text-indigo-600">Accounts</span>
          </h1>
        </div>

        <button 
          onClick={onCreateClick}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
        >
          <UserPlus className="w-4 h-4" /> Provision New Acc
        </button>
      </header>

      <div className="p-12 max-w-[1600px] w-full mx-auto space-y-10">
        {loading ? (
          <div className="flex items-center gap-3 text-indigo-500 font-black tracking-widest animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" /> SYNCHRONIZING...
          </div>
        ) : (
          <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-3xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[10px] font-black text-slate-500 tracking-[0.3em]">
                  <th className="px-10 py-6 text-indigo-500/50">IDENTIFIER / USER</th>
                  <th className="px-6 py-6 text-center text-indigo-500/50">ROLE</th>
                  <th className="px-6 py-6 text-center text-indigo-500/50">STATUS</th>
                  <th className="px-10 py-6 text-right text-indigo-500/50">COMMAND</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {accounts.length > 0 ? accounts.map((acc) => {
                  const isActive = (acc.status || 'ACTIVE').toUpperCase() === 'ACTIVE';
                  
                  return (
                    <tr key={acc.id} className={`transition-colors group ${isActive ? 'hover:bg-indigo-600/5' : 'hover:bg-red-600/5 opacity-60'}`}>
                      <td className="px-10 py-6">
                        <p className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors">{acc.name}</p>
                        <p className="text-[8px] font-bold text-slate-600 tracking-widest uppercase">{acc.employeeId}</p>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-[10px] font-black px-3 py-1 rounded-lg border text-indigo-400 border-indigo-400/20 bg-indigo-400/5 uppercase">
                          {acc.role}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className={`text-[8px] font-black tracking-widest uppercase ${isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                          ● {acc.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right space-x-4">
                        {/* Edit — only for active accounts */}
                        {isActive && (
                          <button 
                            onClick={() => onEditClick(acc)}
                            className="text-[9px] font-black text-slate-500 hover:text-white transition-all uppercase"
                          >
                            Edit
                          </button>
                        )}

                        {/* Revoke for active, Reactivate for inactive */}
                        {isActive ? (
                          <button 
                            onClick={() => onRevokeClick(acc.id)}
                            className="text-[9px] font-black text-red-500/50 hover:text-red-500 transition-all uppercase"
                          >
                            Revoke
                          </button>
                        ) : (
                          <button 
                            onClick={() => onReactivateClick(acc.id)}
                            className="text-[9px] font-black text-emerald-500/50 hover:text-emerald-500 transition-all uppercase"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-20 text-center text-slate-600 text-[10px] font-black tracking-widest">
                      NO ACCOUNTS FOUND
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};