// src/app/(dashboard)/layout.jsx
import Navigation from "../../components/Navigation";

export default function DashboardLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 flex overflow-hidden">
      {/* ==========================================
          BACKGROUND DECORATION (Efek Kece!)
          ========================================== */}

      {/* 1. Pola Titik (Dot Grid) Super Halus */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}></div>

      {/* 2. Ambient Aurora (Cahaya Bias di Sudut Layar) */}
      <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* ========================================== */}

      {/* Sidebar / Bottom Nav (Sudah z-50 agar di atas background) */}
      <div className="relative z-50">
        <Navigation />
      </div>

      {/* Konten Utama */}
      <main className="relative z-10 flex-1 pl-4 pr-4 md:pl-72 md:pr-8 pt-8 pb-24 md:pb-8 w-full h-screen overflow-y-auto overflow-x-hidden custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
