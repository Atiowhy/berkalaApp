// src/app/register/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // State untuk form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    console.log("Tembak API ke:", BASE_URL);

    try {
      // Tembak API Register di Backend Express
      // Pastikan port-nya sesuai dengan backend-mu (misal: 5000)
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Menangkap pesan error dari backend
        throw new Error(data.message || "Gagal melakukan registrasi");
      }

      // Jika sukses (sesuai format controller-mu)
      if (data.success) {
        setSuccessMsg("Registrasi berhasil! Mengalihkan ke halaman login...");

        // Tunggu 2 detik agar user bisa membaca pesan sukses, lalu pindah ke /login
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-gray-200 relative overflow-hidden px-4">
      {/* Efek Cahaya Ambient */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)] tracking-wider mb-2">
            BERKALA
          </h1>
          <p className="text-slate-400 font-medium">
            Mulai perjalanan produktivitasmu
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
          {/* Pesan Error */}
          {error && (
            <div className="mb-6 rounded-xl bg-rose-500/10 border border-rose-500/30 p-4 text-sm text-rose-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              {error}
            </div>
          )}

          {/* Pesan Sukses */}
          {successMsg && (
            <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Nama */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-gray-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Username"
                />
              </div>
            </div>

            {/* Input Email */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-gray-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-gray-200 placeholder-slate-600 focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all duration-300"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 text-slate-950 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0">
              {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
              {!loading && <ArrowRight size={20} strokeWidth={3} />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
