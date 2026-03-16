// src/components/Sidebar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Flame,
  CheckSquare,
  Wallet,
  LogOut,
  Settings, // Tambahkan ikon gear untuk profil
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // State untuk menyimpan data profil asli
  const [profile, setProfile] = useState({ name: "Loading...", role: "..." });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.success) setProfile(result.data);
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Habit", path: "/habits", icon: Flame },
    { name: "Todo List", path: "/todo", icon: CheckSquare },
    { name: "Keuangan", path: "/keuangan", icon: Wallet },
  ];

  // Ambil inisial nama (Huruf pertama)
  const initial =
    profile.name !== "Loading..." ? profile.name.charAt(0).toUpperCase() : "N";

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col justify-between h-screen w-64 bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800 fixed left-0 top-0 z-50">
        <div>
          <div className="p-8 pb-6">
            <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              BERKALA
            </h1>
          </div>

          <nav className="px-4 space-y-2 mt-4">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.path || pathname?.startsWith(item.path + "/");
              return (
                <Link href={item.path} key={item.name}>
                  <div
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/10 to-transparent border-l-4 border-cyan-400 text-cyan-400"
                        : "text-slate-400 hover:bg-slate-900/50 border-l-4 border-transparent hover:text-gray-200"
                    }`}>
                    {isActive && (
                      <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/5 blur-md -z-10"></div>
                    )}
                    <item.icon
                      size={20}
                      className={
                        isActive
                          ? "text-cyan-400"
                          : "text-slate-500 group-hover:text-cyan-400 transition-colors"
                      }
                    />
                    <span
                      className={`font-semibold tracking-wide ${isActive ? "text-cyan-400" : ""}`}>
                      {item.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* PROFIL PENGGUNA (Sekarang bisa diklik ke /profile) */}
        <div className="p-4 mb-4 mx-4 border border-slate-800/60 rounded-3xl bg-slate-900/40 backdrop-blur-md hover:bg-slate-900/60 transition-colors group">
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-3 flex-1 overflow-hidden cursor-pointer">
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-tr from-fuchsia-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-[0_0_15px_rgba(217,70,239,0.4)]">
                {initial}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors">
                  {profile.name}
                </p>
                <p className="text-[10px] text-cyan-500/80 truncate uppercase tracking-widest font-semibold">
                  {profile.role}
                </p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-rose-400 transition-all duration-300 hover:bg-rose-500/10 p-2 rounded-xl"
              title="Keluar">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-2xl border-t border-slate-800 z-50 pb-safe">
        <div className="flex justify-around items-center p-2">
          {/* Tambahkan menu Profil untuk versi Mobile */}
          {[
            ...menuItems,
            { name: "Profil", path: "/profile", icon: Settings },
          ].map((item) => {
            const isActive =
              pathname === item.path || pathname?.startsWith(item.path + "/");
            return (
              <Link href={item.path} key={item.name} className="flex-1">
                <div className="flex flex-col items-center justify-center py-2 gap-1 relative group">
                  {isActive && (
                    <div className="absolute -top-2 w-8 h-1 bg-cyan-400 rounded-b-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                  )}
                  <item.icon
                    size={22}
                    className={`transition-all duration-300 ${isActive ? "text-cyan-400 scale-110" : "text-slate-500 group-hover:text-gray-300"}`}
                  />
                  <span
                    className={`text-[10px] font-bold transition-all duration-300 ${isActive ? "text-cyan-400" : "text-slate-500"}`}>
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
