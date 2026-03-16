// src/app/(dashboard)/profile/page.jsx
"use client";

import { useState, useEffect } from "react";
import { User, Mail, Briefcase, Save, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Ambil data profil saat halaman dimuat
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.success) {
          setFormData({
            name: result.data.name || "",
            email: result.data.email || "",
            role: result.data.role || "",
          });
        }
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Simpan perubahan ke database
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: formData.name, role: formData.role }),
      });

      const result = await res.json();
      if (result.success) {
        setSuccessMsg("Profil berhasil diperbarui!");
        // Refresh halaman setelah 1.5 detik agar Sidebar ikut terupdate
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error("Gagal update profil:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="text-cyan-500 animate-pulse font-bold p-8">
        Memuat data profil...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-3xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Pengaturan Profil
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Sesuaikan identitas dan peranmu di aplikasi Berkala.
        </p>
      </div>

      {/* FORM KARTU PROFIL */}
      <div className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md relative overflow-hidden">
        {/* Dekorasi Background Kartu */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Input Nama */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
              <User size={14} /> Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          {/* Input Role / Jabatan */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
              <Briefcase size={14} /> Jabatan / Peran
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              placeholder="Contoh: Mahasiswa, Freelancer, dll."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          {/* Input Email (Read Only / Tidak bisa diganti) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
              <Mail size={14} /> Email Account
            </label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full bg-slate-900/50 border border-slate-800/50 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
              title="Email tidak dapat diubah"
            />
            <p className="text-[10px] text-slate-600 mt-2">
              Email digunakan sebagai identitas utama login dan tidak dapat
              diubah.
            </p>
          </div>

          <hr className="border-slate-800/60" />

          {/* Alert Sukses */}
          {successMsg && (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 text-sm font-bold animate-in zoom-in-95 duration-300">
              <CheckCircle2 size={18} /> {successMsg}
            </div>
          )}

          {/* Tombol Simpan */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black px-8 py-3.5 rounded-xl transition-all disabled:opacity-70 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transform hover:-translate-y-1">
            <Save size={18} strokeWidth={2.5} />
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}
