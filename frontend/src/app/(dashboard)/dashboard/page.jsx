// src/app/(dashboard)/page.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  CheckCircle2,
  Flame,
  TrendingUp,
  ArrowRight,
  Circle,
  CalendarDays,
  Target,
} from "lucide-react";
import Link from "next/link";

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);
};

export default function DashboardPage() {
  const [summary, setSummary] = useState({ balance: 0 });
  const [todos, setTodos] = useState([]);
  const [habits, setHabits] = useState([]);
  // STATE BARU: Untuk Tabungan
  const [savings, setSavings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- API CALLS ---
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      // UPDATE: Tambah fetch API Savings ke dalam Promise.all
      const [summaryRes, todosRes, habitsRes, savingsRes] = await Promise.all([
        fetch("http://localhost:5000/transactions/summary", { headers }),
        fetch("http://localhost:5000/todos", { headers }),
        fetch("http://localhost:5000/habit", { headers }),
        fetch("http://localhost:5000/savings", { headers }),
      ]);

      const summaryData = await summaryRes.json();
      const todosData = await todosRes.json();
      const habitsData = await habitsRes.json();
      const savingsData = await savingsRes.json();

      if (summaryData.success) setSummary(summaryData.data);
      if (todosData.success) setTodos(todosData.data);
      if (habitsData.success) setHabits(habitsData.data);
      if (savingsData.success) setSavings(savingsData.data);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- LOGIKA PERHITUNGAN ---
  const completedTodosCount = todos.filter((t) => t.isCompleted).length;
  const pendingTodos = todos.filter((t) => !t.isCompleted).slice(0, 4);
  const activeHabits = habits.slice(0, 3);
  const activeSavings = savings.slice(0, 3); // Ambil maks 3 tabungan teratas

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Selamat Pagi"
      : hour < 15
        ? "Selamat Siang"
        : hour < 18
          ? "Selamat Sore"
          : "Selamat Malam";

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      {/* --- HEADER GREETING --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-800 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>

        <div className="z-10">
          <p className="text-cyan-400 font-bold mb-1 flex items-center gap-2">
            <TrendingUp size={18} /> {greeting}, Atio! 👋
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-gray-100">
            Pusat Komando
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base max-w-xl">
            Satu layar untuk mengontrol produktivitas, tugas harian, dan arus
            kas keuanganmu. Semua dalam kendalimu.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-cyan-500 animate-pulse font-bold tracking-widest uppercase">
          Menyiapkan Dashboard...
        </div>
      ) : (
        <>
          {/* --- WIDGET STATISTIK CEPAT (3 KOLOM) --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Widget Keuangan */}
            <Link
              href="/keuangan"
              className="group p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/80 to-cyan-900/20 backdrop-blur-md hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                  <Wallet size={24} />
                </div>
                <h2 className="font-bold text-slate-400 uppercase tracking-widest text-xs">
                  Total Saldo
                </h2>
              </div>
              <h3 className="text-3xl font-black text-gray-100 truncate">
                {formatRupiah(summary.balance)}
              </h3>
              <p className="text-xs text-cyan-400 mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Kelola Keuangan <ArrowRight size={14} />
              </p>
            </Link>

            {/* Widget Todo List */}
            <Link
              href="/todo"
              className="group p-6 rounded-3xl border border-fuchsia-500/30 bg-gradient-to-br from-slate-900/80 to-fuchsia-900/20 backdrop-blur-md hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 group-hover:bg-fuchsia-500 group-hover:text-slate-950 transition-colors">
                  <CheckCircle2 size={24} />
                </div>
                <h2 className="font-bold text-slate-400 uppercase tracking-widest text-xs">
                  Tugas Selesai
                </h2>
              </div>
              <h3 className="text-3xl font-black text-gray-100 truncate">
                {completedTodosCount}{" "}
                <span className="text-lg text-slate-500 font-medium">
                  / {todos.length}
                </span>
              </h3>
              <p className="text-xs text-fuchsia-400 mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Lihat Todo List <ArrowRight size={14} />
              </p>
            </Link>

            {/* Widget Habit */}
            <Link
              href="/habits"
              className="group p-6 rounded-3xl border border-orange-500/30 bg-gradient-to-br from-slate-900/80 to-orange-900/20 backdrop-blur-md hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-slate-950 transition-colors">
                  <Flame size={24} />
                </div>
                <h2 className="font-bold text-slate-400 uppercase tracking-widest text-xs">
                  Habit Aktif
                </h2>
              </div>
              <h3 className="text-3xl font-black text-gray-100 truncate">
                {habits.length}{" "}
                <span className="text-lg text-slate-500 font-medium">
                  Rutinitas
                </span>
              </h3>
              <p className="text-xs text-orange-400 mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Pantau Habit <ArrowRight size={14} />
              </p>
            </Link>
          </div>

          {/* --- WIDGET KONTEN (UPDATE: SEKARANG 3 KOLOM!) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
            {/* Panel 1: Tugas Prioritas (Belum Selesai) */}
            <div className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-200">
                  Perlu Diselesaikan
                </h2>
                <Link
                  href="/todo"
                  className="text-xs font-bold text-fuchsia-400 hover:text-fuchsia-300 transition-colors bg-fuchsia-500/10 py-1.5 px-3 rounded-lg">
                  Semua
                </Link>
              </div>

              {pendingTodos.length === 0 ? (
                <div className="text-center text-slate-500 py-8 border border-slate-800 border-dashed rounded-2xl flex-1 flex items-center justify-center">
                  Semua tugas hari ini beres. 🎉
                </div>
              ) : (
                <div className="space-y-3 flex-1">
                  {pendingTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                      <Circle
                        size={16}
                        className="text-fuchsia-500/50 flex-shrink-0"
                      />
                      <span className="text-sm font-medium text-gray-300 truncate">
                        {todo.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Panel 2: Sorotan Habit */}
            <div className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-200">
                  Fokus Rutinitas
                </h2>
                <Link
                  href="/habits"
                  className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors bg-orange-500/10 py-1.5 px-3 rounded-lg">
                  Semua
                </Link>
              </div>

              {activeHabits.length === 0 ? (
                <div className="text-center text-slate-500 py-8 border border-slate-800 border-dashed rounded-2xl flex-1 flex items-center justify-center">
                  Belum ada habit aktif.
                </div>
              ) : (
                <div className="space-y-3 flex-1">
                  {activeHabits.map((habit) => {
                    const totalSelesai = habit.logs ? habit.logs.length : 0;
                    return (
                      <div
                        key={habit.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 flex-shrink-0">
                            <CalendarDays size={16} />
                          </div>
                          <p className="text-sm font-bold text-gray-300 truncate">
                            {habit.title}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className="text-[10px] text-slate-500 font-bold uppercase">
                            Total
                          </p>
                          <p className="text-lg font-black text-orange-400">
                            {totalSelesai}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Panel 3: Target Tabungan (BARU!) */}
            <div className="p-6 md:p-8 rounded-3xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                  <Target size={18} className="text-emerald-400" /> Target
                  Impian
                </h2>
                <Link
                  href="/keuangan"
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 py-1.5 px-3 rounded-lg">
                  Semua
                </Link>
              </div>

              {activeSavings.length === 0 ? (
                <div className="text-center text-slate-500 py-8 border border-slate-800 border-dashed rounded-2xl flex-1 flex items-center justify-center">
                  Tidak ada target menabung.
                </div>
              ) : (
                <div className="space-y-4 flex-1">
                  {activeSavings.map((saving) => {
                    const progress = Math.min(
                      100,
                      Math.round(
                        (saving.currentAmount / saving.targetAmount) * 100,
                      ),
                    );
                    return (
                      <div
                        key={saving.id}
                        className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/50">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-bold text-gray-300 truncate pr-2">
                            {saving.title}
                          </p>
                          <span className="text-xs font-black text-emerald-400">
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${progress}%` }}>
                            <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/40 blur-[1px] rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1.5 text-right font-medium tracking-wide">
                          {formatRupiah(saving.currentAmount)} /{" "}
                          {formatRupiah(saving.targetAmount)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
