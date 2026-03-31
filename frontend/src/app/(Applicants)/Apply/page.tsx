"use client";
import React, { useState, useRef, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { themes } from "../../../components/(Applicants)/Welcome/Themes";
import { ApplyFormUI, FormDataState } from "../../../components/(Applicants)/Applicants/ApplyForm";

function ApplyPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Data Hooks & Environment
  const jobId = searchParams.get("jobId") ?? "0";
  const jobTitle = searchParams.get("jobTitle") ?? "General Application";
  const jobDept = searchParams.get("dept") ?? "Operations";
  const t = themes.dark;

  // 2. State
  const [form, setForm] = useState<FormDataState>({
    firstName: "", lastName: "", age: "", sex: "",
    email: "", phone: "", address: "", city: "", province: "", zipCode: "",
    resume: null, coverLetter: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // 3. Logic Helpers
  const requiredFields = ["firstName", "lastName", "age", "sex", "email", "phone", "address", "city", "province"] as const;
  const filledCount = requiredFields.filter(k => form[k].trim() !== "").length;
  const progress = Math.round(((filledCount + (form.resume ? 1 : 0)) / (requiredFields.length + 1)) * 100);

  const handleChange = (key: keyof FormDataState, value: string | File | null) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => {
      const n = { ...prev }; delete n[key]; return n;
    });
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      setErrors(prev => ({ ...prev, resume: "Upload PDF or Word documents only." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, resume: "File size exceeds 5MB limit." }));
      return;
    }
    handleChange("resume", file);
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.age.trim() || isNaN(Number(form.age))) newErrors.age = "Valid age required";
    if (!form.email.includes("@")) newErrors.email = "Invalid email";
    if (!form.resume) newErrors.resume = "Resume is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("JobId", jobId);
      formData.append("JobTitle", jobTitle);
      formData.append("Department", jobDept);
      formData.append("FirstName", form.firstName);
      formData.append("LastName", form.lastName);
      formData.append("Age", form.age);
      formData.append("Sex", form.sex);
      formData.append("Email", form.email);
      formData.append("Phone", form.phone);
      formData.append("Address", `${form.address}, ${form.city}, ${form.province}`);
      formData.append("ZipCode", form.zipCode);
      formData.append("CoverLetter", form.coverLetter);
      if (form.resume) formData.append("Resume", form.resume);

      const res = await fetch("http://localhost:5076/api/applicants", { 
        method: "POST", 
        body: formData 
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Submission failed.");
      }

      const data = await res.json();
      setRefCode(data.referenceCode);
      setSubmitted(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return <div style={{ minHeight: '100vh', background: '#020617' }} />;

  return (
    <ApplyFormUI 
      form={form}
      errors={errors}
      loading={loading}
      submitted={submitted}
      refCode={refCode}
      progress={progress}
      jobTitle={jobTitle}
      dragOver={dragOver}
      fileRef={fileRef}
      t={t}
      handlers={{
        handleChange,
        handleFile,
        handleSubmit,
        setDragOver,
        onBack: () => router.push("/Welcome")
      }}
    />
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020617' }}><Loader2 className="animate-spin" color="#6366f1" /></div>}>
      <ApplyPageInner />
    </Suspense>
  );
}