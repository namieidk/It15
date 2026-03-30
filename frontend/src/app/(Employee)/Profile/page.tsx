'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../../../components/(Employee)/Dashboard/Sidebar';
import { Loader2 } from 'lucide-react';
import { EmployeeProfileUI, EmployeeData, EditForm } from '../../../components/(Employee)/Profile/Employeeprofile';

const API_BASE = 'http://localhost:5076/api/user';

export default function ProfilePage() {
  const [data,      setData]      = useState<EmployeeData | null>(null);
  const [loading,   setLoading]   = useState<boolean>(true);
  const [saving,    setSaving]    = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editForm,  setEditForm]  = useState<EditForm>({
    email:        '',
    phone:        '',
    workstation:  '',
    sssId:        '',
    philHealthId: '',
    pagIbigId:    '',
  });

  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const router    = useRouter();

  // ── LOAD PROFILE ────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userJson = localStorage.getItem('user');
        if (!userJson) return router.push('/login');

        const session = JSON.parse(userJson);
        const res     = await fetch(`${API_BASE}/profile/${session.employeeId}`);
        if (!res.ok) throw new Error('FETCH_FAILED');

        const result: EmployeeData = await res.json();
        setData(result);
        setEditForm({
          email:        result.email        ?? '',
          phone:        result.phone        ?? '',
          workstation:  result.workstation  ?? '',
          sssId:        result.sssId        ?? '',
          philHealthId: result.philHealthId ?? '',
          pagIbigId:    result.pagIbigId    ?? '',
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  // ── IMAGE UPLOAD ─────────────────────────────────────────────────────────────
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'banner'
  ) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;

    setSaving(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

    try {
      const cloudRes  = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const cloudData = await cloudRes.json();

      const updatedPayload: EmployeeData = {
        ...data,
        profileImage: type === 'avatar' ? cloudData.secure_url : data.profileImage,
        bannerImage:  type === 'banner' ? cloudData.secure_url : data.bannerImage,
      };

      const res = await fetch(`${API_BASE}/update-profile`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(updatedPayload),
      });

      if (res.ok) setData(updatedPayload);
    } catch (err) {
      alert('Upload Failed');
    } finally {
      setSaving(false);
    }
  };

  // ── SAVE TEXT DETAILS ────────────────────────────────────────────────────────
  const handleSaveDetails = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const payload: EmployeeData = { ...data, ...editForm };
      const res = await fetch(`${API_BASE}/update-profile`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (res.ok) {
        setData(payload);
        setShowModal(false);
      }
    } catch (err) {
      alert('Sync Error');
    } finally {
      setSaving(false);
    }
  };

  // ── LOADING SCREEN ───────────────────────────────────────────────────────────
  if (loading || !data) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
    </div>
  );

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <Sidebar />

      <input type="file" ref={avatarRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'avatar')} />
      <input type="file" ref={bannerRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'banner')} />

      <EmployeeProfileUI
        data={data}
        showModal={showModal}
        saving={saving}
        editForm={editForm}
        onOpenModal={() => setShowModal(true)}
        onCloseModal={() => setShowModal(false)}
        onSave={handleSaveDetails}
        onEditChange={(field, value) => setEditForm((prev) => ({ ...prev, [field]: value }))}
        onAvatarClick={() => avatarRef.current?.click()}
        onBannerClick={() => bannerRef.current?.click()}
      />
    </main>
  );
}