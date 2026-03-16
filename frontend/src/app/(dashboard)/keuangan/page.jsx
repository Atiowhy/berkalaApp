// src/app/(dashboard)/keuangan/page.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Coffee,
  Laptop,
  Utensils,
  Landmark,
  Target,
  Monitor,
  X,
  Receipt,
  PiggyBank,
} from "lucide-react";

// --- Fungsi Bantuan ---
const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);
};

const formatDate = (dateString) => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

const getCategoryIcon = (category, type) => {
  const cat = category.toLowerCase();
  if (type === "INCOME")
    return {
      icon: <Landmark size={20} className="text-emerald-400" />,
      bg: "bg-emerald-500/10 border-emerald-500/30",
      text: "text-emerald-400",
    };
  if (cat.includes("makan") || cat.includes("minum") || cat.includes("kopi"))
    return {
      icon: <Coffee size={20} className="text-rose-400" />,
      bg: "bg-rose-500/10 border-rose-500/30",
      text: "text-rose-400",
    };
  if (
    cat.includes("server") ||
    cat.includes("hosting") ||
    cat.includes("pc") ||
    cat.includes("laptop")
  )
    return {
      icon: <Laptop size={20} className="text-rose-400" />,
      bg: "bg-rose-500/10 border-rose-500/30",
      text: "text-rose-400",
    };
  return {
    icon: <Receipt size={20} className="text-rose-400" />,
    bg: "bg-rose-500/10 border-rose-500/30",
    text: "text-rose-400",
  };
};

// Tema warna dinamis untuk kartu tabungan
const savingThemes = [
  {
    icon: <Monitor size={20} className="text-cyan-400" />,
    bg: "bg-cyan-500/10 border-cyan-500/30",
    barColor: "bg-cyan-500",
    textColor: "text-cyan-400",
  },
  {
    icon: <Wallet size={20} className="text-emerald-400" />,
    bg: "bg-emerald-500/10 border-emerald-500/30",
    barColor: "bg-emerald-500",
    textColor: "text-emerald-400",
  },
  {
    icon: <Target size={20} className="text-fuchsia-400" />,
    bg: "bg-fuchsia-500/10 border-fuchsia-500/30",
    barColor: "bg-fuchsia-500",
    textColor: "text-fuchsia-400",
  },
  {
    icon: <PiggyBank size={20} className="text-orange-400" />,
    bg: "bg-orange-500/10 border-orange-500/30",
    barColor: "bg-orange-500",
    textColor: "text-orange-400",
  },
];

export default function KeuanganPage() {
  const [transactions, setTransactions] = useState([]);
  const [savings, setSavings] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Modal Transaksi
  const [isTransModalOpen, setIsTransModalOpen] = useState(false);
  const [transFormData, setTransFormData] = useState({
    type: "EXPENSE",
    amount: "",
    category: "",
    description: "",
  });

  // State untuk Modal Buat Tabungan
  const [isSavingModalOpen, setIsSavingModalOpen] = useState(false);
  const [savingFormData, setSavingFormData] = useState({
    title: "",
    targetAmount: "",
  });

  // State untuk Modal Top Up Tabungan
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [selectedSavingId, setSelectedSavingId] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- API CALLS ---
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      // Tarik semua data secara paralel agar ngebut!
      const [summaryRes, transRes, savingsRes] = await Promise.all([
        fetch("http://localhost:5000/transactions/summary", { headers }),
        fetch("http://localhost:5000/transactions", { headers }),
        fetch("http://localhost:5000/savings", { headers }),
      ]);

      const summaryData = await summaryRes.json();
      const transData = await transRes.json();
      const savingsData = await savingsRes.json();

      if (summaryData.success) setSummary(summaryData.data);
      if (transData.success) setTransactions(transData.data);
      if (savingsData.success) setSavings(savingsData.data);
    } catch (error) {
      console.error("Gagal mengambil data keuangan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---
  const handleTransSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transFormData),
      });
      if (res.ok) {
        setIsTransModalOpen(false);
        setTransFormData({
          type: "EXPENSE",
          amount: "",
          category: "",
          description: "",
        });
        fetchData();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/savings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(savingFormData),
      });
      if (res.ok) {
        setIsSavingModalOpen(false);
        setSavingFormData({ title: "", targetAmount: "" });
        fetchData();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/savings/${selectedSavingId}/add`,
        {
          method: "PUT", // Ingat, rute top up kita pakai PUT
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: topUpAmount }),
        },
      );
      if (res.ok) {
        setIsTopUpModalOpen(false);
        setTopUpAmount("");
        setSelectedSavingId(null);
        fetchData();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTopUpModal = (id) => {
    setSelectedSavingId(id);
    setIsTopUpModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto relative">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
            Arus Kas
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Pantau setiap rupiah yang masuk dan keluar.
          </p>
        </div>
        <button
          onClick={() => setIsTransModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all duration-300 transform hover:-translate-y-1 w-full md:w-auto justify-center">
          <Plus size={20} strokeWidth={3} />
          <span>Catat Transaksi</span>
        </button>
      </div>

      {/* --- RINGKASAN SALDO --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="p-6 md:p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/80 to-cyan-900/20 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Wallet size={20} />
            </div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Total Saldo
            </h2>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-gray-100 relative z-10 mt-2 truncate">
            {formatRupiah(summary.balance)}
          </h3>
        </div>
        <div className="p-6 md:p-8 rounded-3xl border border-emerald-500/20 bg-slate-900/40 backdrop-blur-md hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ArrowUpRight size={20} strokeWidth={3} />
            </div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Pemasukan
            </h2>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-emerald-400 mt-2 truncate">
            {formatRupiah(summary.totalIncome)}
          </h3>
        </div>
        <div className="p-6 md:p-8 rounded-3xl border border-rose-500/20 bg-slate-900/40 backdrop-blur-md hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <ArrowDownRight size={20} strokeWidth={3} />
            </div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Pengeluaran
            </h2>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-rose-400 mt-2 truncate">
            {formatRupiah(summary.totalExpense)}
          </h3>
        </div>
      </div>

      {/* --- TARGET TABUNGAN DINAMIS --- */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6 px-1">
          <h2 className="text-lg font-bold text-gray-200 flex items-center gap-2">
            <Target size={20} className="text-cyan-400" /> Target Tabungan
          </h2>
          <button
            onClick={() => setIsSavingModalOpen(true)}
            className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg">
            <Plus size={16} /> Buat Target
          </button>
        </div>

        {savings.length === 0 ? (
          <div className="text-center text-slate-500 py-8 border border-slate-800 border-dashed rounded-3xl bg-slate-900/20">
            Belum ada target impian. Yuk, mulai menabung!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {savings.map((saving, index) => {
              const theme = savingThemes[index % savingThemes.length];
              // Hitung persentase (maksimal 100%)
              const progress = Math.min(
                100,
                Math.round((saving.currentAmount / saving.targetAmount) * 100),
              );

              return (
                <div
                  key={saving.id}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:bg-slate-900/60 hover:border-slate-700 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${theme.bg}`}>
                        {theme.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-200">
                          {saving.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Terkumpul {progress}%
                        </p>
                      </div>
                    </div>
                    {/* Tombol Top Up (Plus) */}
                    <button
                      onClick={() => openTopUpModal(saving.id)}
                      className={`p-1.5 rounded-lg border ${theme.bg} ${theme.textColor} hover:${theme.barColor} hover:text-slate-950 transition-all duration-300 shadow-sm hover:shadow-[0_0_10px_currentColor]`}>
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-300">
                      {formatRupiah(saving.currentAmount)}
                    </span>
                    <span className="text-slate-500">
                      / {formatRupiah(saving.targetAmount)}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
                    <div
                      className={`h-full rounded-full ${theme.barColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${progress}%` }}>
                      <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-sm rounded-full"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- RIWAYAT TRANSAKSI (Sama seperti sebelumnya) --- */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-200 mb-6 px-1">
          Riwayat Terakhir
        </h2>
        {isLoading ? (
          <div className="text-center py-10 text-cyan-500">
            Menarik data dari brankas...
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-slate-500 py-10 border border-slate-800 border-dashed rounded-3xl">
            Belum ada transaksi.
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((trx) => {
              const style = getCategoryIcon(trx.category, trx.type);
              const sign = trx.type === "INCOME" ? "+" : "-";
              return (
                <div
                  key={trx.id}
                  className="flex items-center justify-between p-4 md:p-5 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm hover:bg-slate-900/60 hover:border-slate-700 transition-all duration-300">
                  <div className="flex items-center gap-4 md:gap-5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border ${style.bg}`}>
                      {style.icon}
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-gray-200">
                        {trx.category}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-500 mt-1">
                        {formatDate(trx.date)}{" "}
                        {trx.description ? `• ${trx.description}` : ""}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-base md:text-lg font-black tracking-wide ${style.text}`}>
                    {sign} {formatRupiah(trx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Modal Transaksi Baru */}
      {isTransModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl w-full max-w-md shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">
                Catat Transaksi
              </h2>
              <button
                onClick={() => setIsTransModalOpen(false)}
                className="text-slate-500 hover:text-rose-400">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleTransSubmit} className="space-y-4">
              <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    setTransFormData({ ...transFormData, type: "EXPENSE" })
                  }
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${transFormData.type === "EXPENSE" ? "bg-rose-500/20 text-rose-400" : "text-slate-500"}`}>
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTransFormData({ ...transFormData, type: "INCOME" })
                  }
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${transFormData.type === "INCOME" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500"}`}>
                  Pemasukan
                </button>
              </div>
              <input
                type="number"
                required
                value={transFormData.amount}
                onChange={(e) =>
                  setTransFormData({ ...transFormData, amount: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500/50"
                placeholder="Nominal (Rp)"
              />
              <input
                type="text"
                required
                value={transFormData.category}
                onChange={(e) =>
                  setTransFormData({
                    ...transFormData,
                    category: e.target.value,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500/50"
                placeholder="Kategori (Makan, Gaji, dll)"
              />
              <input
                type="text"
                value={transFormData.description}
                onChange={(e) =>
                  setTransFormData({
                    ...transFormData,
                    description: e.target.value,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-cyan-500/50"
                placeholder="Catatan Opsional"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all disabled:opacity-70">
                {isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal Buat Target Tabungan */}
      {isSavingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl w-full max-w-md shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">Target Baru</h2>
              <button
                onClick={() => setIsSavingModalOpen(false)}
                className="text-slate-500 hover:text-rose-400">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSavingSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={savingFormData.title}
                onChange={(e) =>
                  setSavingFormData({
                    ...savingFormData,
                    title: e.target.value,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-fuchsia-500/50"
                placeholder="Nama Impian (Cth: Rakit PC, Beli Motor)"
              />
              <input
                type="number"
                required
                value={savingFormData.targetAmount}
                onChange={(e) =>
                  setSavingFormData({
                    ...savingFormData,
                    targetAmount: e.target.value,
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-fuchsia-500/50"
                placeholder="Target Dana (Rp)"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-70">
                {isSubmitting ? "Menyimpan..." : "Mulai Menabung"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Top Up Tabungan */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl w-full max-w-md shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">Isi Tabungan</h2>
              <button
                onClick={() => setIsTopUpModalOpen(false)}
                className="text-slate-500 hover:text-rose-400">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleTopUpSubmit} className="space-y-4">
              <input
                type="number"
                required
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-emerald-500/50"
                placeholder="Nominal yang ditabung (Rp)"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all disabled:opacity-70">
                {isSubmitting ? "Memproses..." : "Masukkan ke Celengan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
