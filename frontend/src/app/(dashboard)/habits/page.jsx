// src/app/(dashboard)/habits/page.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Flame,
  CalendarDays,
  MoreVertical,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// --- FUNGSI BANTUAN (UTILITY) ---

// 1. Dapatkan N hari terakhir dengan fleksibel (Bisa 7 hari, bisa 28 hari)
const getPastDays = (count) => {
  const days = [];
  const dayNames = ["M", "S", "S", "R", "K", "J", "S"];

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    days.push({
      dateString: `${year}-${month}-${day}`,
      label: dayNames[d.getDay()],
      dateNum: d.getDate(), // Tanggal angkanya (1-31) untuk UI 28 hari
    });
  }
  return days;
};

// 2. Hitung Total Selesai (Versi Santai)
const calculateStreak = (logs) => {
  if (!logs) return 0;
  return logs.length;
};

export default function HabitPage() {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk melacak kartu mana yang sedang di-klik/diperluas (Expanded)
  const [expandedHabitId, setExpandedHabitId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({ title: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const theme = {
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
      hover: "hover:bg-cyan-500/20",
    },
    fuchsia: {
      bg: "bg-fuchsia-500/10",
      border: "border-fuchsia-500/30",
      text: "text-fuchsia-400",
      hover: "hover:bg-fuchsia-500/20",
    },
    orange: {
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      text: "text-orange-400",
      hover: "hover:bg-orange-500/20",
    },
  };
  const colors = ["cyan", "fuchsia", "orange"];

  // Siapkan data 7 hari dan 28 hari (4 Minggu)
  const last7Days = getPastDays(7);
  const last28Days = getPastDays(28);

  // --- API CALLS ---
  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/habit`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (result.success) setHabits(result.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/habit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newHabit),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setNewHabit({ title: "", description: "" });
        fetchHabits();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLog = async (habitId, dateString) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/habit/${habitId}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date: dateString }),
      });

      if (res.ok) fetchHabits();
    } catch (error) {
      console.error("Gagal mencentang habit:", error);
    }
  };

  // Fungsi Buka-Tutup Kartu
  const toggleExpand = (id) => {
    setExpandedHabitId(expandedHabitId === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            Daftar Habit
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Bangun rutinitasmu dalam siklus 28 Hari.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all transform hover:-translate-y-1 w-full md:w-auto justify-center">
          <Plus size={20} strokeWidth={3} />
          <span>Habit Baru</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-cyan-500 py-10">
          Memuat data dari database...
        </div>
      ) : habits.length === 0 ? (
        <div className="text-center text-slate-500 py-10 border border-slate-800 border-dashed rounded-3xl">
          Belum ada habit. Yuk buat habit pertamamu!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {habits.map((habit, index) => {
            const colorKey = colors[index % colors.length];
            const c = theme[colorKey];
            const currentTotal = calculateStreak(habit.logs);
            const isExpanded = expandedHabitId === habit.id;

            return (
              <div
                key={habit.id}
                onClick={() => toggleExpand(habit.id)}
                className={`p-5 md:p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isExpanded
                    ? `bg-slate-900/60 border-${colorKey}-500/50 shadow-[0_0_30px_rgba(0,0,0,0.5)]`
                    : `border-slate-800 bg-slate-900/30 backdrop-blur-sm hover:bg-slate-900/50 hover:border-slate-700`
                }`}>
                {/* --- HEADER KARTU --- */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border ${c.bg} ${c.border}`}>
                      <Flame className={c.text} size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-100">
                        {habit.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <CalendarDays size={14} />
                        <span>{habit.description || "Setiap Hari"}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-500 hover:text-gray-200 transition-colors bg-slate-800/50 p-1.5 rounded-lg">
                    {isExpanded ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>

                {/* --- TRACKER 7 HARI (DEFAULT) --- */}
                {!isExpanded && (
                  <div
                    className="flex items-end justify-between border-t border-slate-800/50 pt-5 mt-auto animate-in fade-in"
                    onClick={(e) => e.stopPropagation()} // Cegah kartu terbuka saat klik bulatan
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      {last7Days.map((dayObj, i) => {
                        const isCompleted = habit.logs?.some((log) =>
                          log.date.startsWith(dayObj.dateString),
                        );
                        return (
                          <div
                            key={i}
                            className="flex flex-col items-center gap-2 group">
                            <span
                              className={`text-[10px] font-bold ${isCompleted ? c.text : "text-slate-500"}`}>
                              {dayObj.label}
                            </span>
                            <button
                              onClick={() =>
                                handleToggleLog(habit.id, dayObj.dateString)
                              }
                              className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center border transition-all duration-300 transform group-hover:scale-110 ${
                                isCompleted
                                  ? `${c.bg} ${c.border} ${c.text} shadow-[0_0_10px_currentColor]`
                                  : `bg-slate-950/50 border-slate-700 hover:border-slate-500 text-transparent hover:${c.text}`
                              }`}>
                              <Check
                                size={16}
                                strokeWidth={isCompleted ? 3 : 2}
                                className={
                                  isCompleted
                                    ? "opacity-100"
                                    : "opacity-0 group-hover:opacity-50"
                                }
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">
                        Total
                      </p>
                      <p
                        className={`text-2xl font-black ${currentTotal > 0 ? c.text : "text-gray-200"}`}>
                        {currentTotal}
                      </p>
                    </div>
                  </div>
                )}

                {/* --- TRACKER 28 HARI (EXPANDED VIEW) --- */}
                {isExpanded && (
                  <div
                    className="border-t border-slate-800/50 pt-5 mt-auto animate-in slide-in-from-top-4 fade-in duration-300"
                    onClick={(e) => e.stopPropagation()} // Cegah kartu tertutup saat klik bulatan
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Perjalanan 28 Hari
                      </span>
                      <span
                        className={`text-xs font-black ${c.text} bg-slate-950 px-3 py-1 rounded-full border border-slate-800`}>
                        {currentTotal} Selesai
                      </span>
                    </div>

                    {/* Grid 7 Kolom (4 Minggu) */}
                    <div className="grid grid-cols-7 gap-2 md:gap-3">
                      {last28Days.map((dayObj, i) => {
                        const isCompleted = habit.logs?.some((log) =>
                          log.date.startsWith(dayObj.dateString),
                        );
                        // Tanggal hari ini (elemen terakhir dari array)
                        const isToday = i === 27;

                        return (
                          <button
                            key={i}
                            onClick={() =>
                              handleToggleLog(habit.id, dayObj.dateString)
                            }
                            title={dayObj.dateString}
                            className={`relative w-full aspect-square rounded-xl flex flex-col items-center justify-center border transition-all duration-300 hover:-translate-y-1 ${
                              isCompleted
                                ? `${c.bg} ${c.border} ${c.text} shadow-[0_0_15px_currentColor]`
                                : `bg-slate-950/80 border-slate-800 hover:border-slate-600 text-slate-600 ${c.hover}`
                            } ${isToday ? "ring-2 ring-offset-2 ring-offset-slate-900 ring-gray-400" : ""}`}>
                            <span className="text-[10px] md:text-xs font-bold mb-0.5">
                              {dayObj.label}
                            </span>
                            <span
                              className={`text-sm md:text-base font-black ${isCompleted ? "opacity-100" : "opacity-40"}`}>
                              {dayObj.dateNum}
                            </span>

                            {/* Titik indikator kecil jika selesai */}
                            {isCompleted && (
                              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-current"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL POP-UP TAMBAH HABIT --- */}
      {/* ... (Kode Modal Tidak Berubah) ... */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl w-full max-w-md shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">
                Buat Habit Baru
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-rose-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Nama Habit
                </label>
                <input
                  type="text"
                  required
                  value={newHabit.title}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, title: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500/50"
                  placeholder="Contoh: Latihan Drum"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Deskripsi (Opsional)
                </label>
                <input
                  type="text"
                  value={newHabit.description}
                  onChange={(e) =>
                    setNewHabit({ ...newHabit, description: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500/50"
                  placeholder="Contoh: Jam 19:00 WIB"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all disabled:opacity-70">
                {isSubmitting ? "Menyimpan..." : "Simpan Habit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
