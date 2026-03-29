'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ManagerSidebar } from '../../../components/(Manager)/Dashboard/ManagerSidebar';
import { ManagerProfileUI, UserData, EditForm } from '../../../components/(Manager)/Profile/Manageprofile';

const API_BASE = "http://localhost:5076/api/user";

// Define a strict interface for the Cloudinary Response
interface CloudinaryResponse {
  secure_url: string;
}

// Define the interface for the update payload to match your C# DTO
interface ProfileUpdatePayload extends EditForm {
  employeeId: string;
  profileImage: string;
  bannerImage: string;
}

export default function ManagerProfilePage() {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ 
    email: '', 
    phone: '', 
    workstation: '' 
  });
  
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // ── LOAD PROFILE ────────────────────────────────────────────────────────
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
          setError("SESSION EXPIRED");
          return;
        }

        const session = JSON.parse(userJson) as { employeeId: string };
        const employeeId = session.employeeId;

        const res = await fetch(`${API_BASE}/profile/${employeeId}`);
        if (!res.ok) throw new Error("FETCH_ERROR");
        
        const result: UserData = await res.json();
        
        setData(result);
        setEditForm({ 
          email: result.email, 
          phone: result.phone, 
          workstation: result.workstation 
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("UNKNOWN ERROR");
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // ── UPLOAD LOGIC ────────────────────────────────────────────────────────
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file || !data) return;

    setSaving(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

    try {
      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, 
        { method: 'POST', body: formData }
      );
      
      const cloudData: CloudinaryResponse = await cloudRes.json();
      let secureUrl = cloudData.secure_url;

      // Transformation for Landscape Banner
      if (type === 'banner') {
        secureUrl = secureUrl.replace('/upload/', '/upload/c_fill,ar_3:1,g_auto,w_1800/');
      }

      const payload: ProfileUpdatePayload = {
        employeeId: data.employeeId,
        email: data.email,
        phone: data.phone,
        workstation: data.workstation,
        profileImage: type === 'avatar' ? secureUrl : (data.profileImage || ""),
        bannerImage: type === 'banner' ? secureUrl : (data.bannerImage || "")
      };

      const res = await fetch(`${API_BASE}/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setData(prev => prev ? { ...prev, ...payload } : null);
      }
    } catch (err: unknown) {
      console.error("Upload error:", err);
      alert("BIO-SYNC FAILED");
    } finally {
      setSaving(false);
    }
  };

  // ── SAVE MODAL DATA ─────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setSaveError(null);

    try {
      const payload: ProfileUpdatePayload = {
        ...editForm,
        employeeId: data.employeeId,
        profileImage: data.profileImage || "",
        bannerImage: data.bannerImage || ""
      };

      const res = await fetch(`${API_BASE}/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed on server");

      setData(prev => prev ? { ...prev, ...editForm } : null);
      setShowModal(false);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "SYNC ERROR");
    } finally {
      setSaving(false);
    }
  };

  // ── RENDER STATES ───────────────────────────────────────────────────────
  if (loading || !data) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
        <p className="text-blue-500 font-black mt-4 text-[10px] tracking-[0.5em] uppercase">
          Initializing Terminal...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-red-500 uppercase">
        <p className="font-black tracking-widest">{error}</p>
        <button 
          onClick={() => router.push('/')} 
          className="mt-4 border border-red-500/50 px-6 py-2 text-[10px]"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <main className="h-screen w-full flex bg-[#020617] overflow-hidden">
      <ManagerSidebar />
      
      {/* Hidden inputs with strict type handlers */}
      <input 
        type="file" 
        ref={avatarRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpload(e, 'avatar')} 
      />
      <input 
        type="file" 
        ref={bannerRef} 
        className="hidden" 
        accept="image/*" 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpload(e, 'banner')} 
      />

      <ManagerProfileUI
        data={data}
        showModal={showModal}
        saving={saving}
        saveError={saveError}
        editForm={editForm}
        onOpenModal={() => setShowModal(true)}
        onCloseModal={() => setShowModal(false)}
        onSave={handleSave}
        onEditChange={(f: keyof EditForm, v: string) => setEditForm(p => ({ ...p, [f]: v }))}
        onAvatarClick={() => avatarRef.current?.click()}
        onBannerClick={() => bannerRef.current?.click()}
      />
    </main>
  );
}