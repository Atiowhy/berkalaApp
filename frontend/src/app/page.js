import Link from "next/link";

export default function LandingPage() {
  return (
    // Latar belakang utama yang gelap dengan overflow-hidden agar efek cahaya tidak membuat scrollbar
    <div className="min-h-screen pb-5 bg-slate-950 text-gray-200 overflow-hidden relative font-sans">
      {/* Efek Cahaya Ambient (Glow Bulat di Pojok) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar Atas */}
      <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] tracking-widest">
          BERKALA
        </div>
        <div>
          <Link
            href="/login"
            className="text-slate-300 hover:text-cyan-400 font-semibold transition-colors duration-300 mr-6">
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/50 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 font-bold rounded-lg shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all duration-300">
            Daftar
          </Link>
        </div>
      </nav>

      {/* Bagian Hero (Konten Utama di Tengah) */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 mt-20 md:mt-32 max-w-4xl mx-auto">
        {/* Badge / Label kecil di atas judul */}
        <div className="inline-block mb-6 px-5 py-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 text-xs md:text-sm font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(217,70,239,0.2)]">
          Sistem Produktivitas Kontekstual
        </div>

        {/* Judul Utama */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Kendalikan Waktu, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            Bangun Masa Depan.
          </span>
        </h1>

        {/* Deskripsi */}
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
          Platform all-in-one untuk melacak kebiasaan, merancang rutinitas, mengelola keuangan dan
          memastikan setiap harimu berjalan satu persen lebih baik dari kemarin.
        </p>

        {/* Tombol Call to Action (CTA) */}
        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <Link
            href="/register"
            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.7)] transition-all duration-300 transform hover:-translate-y-1 text-center">
            Mulai Perjalananmu
          </Link>

          <Link
            href="/login"
            className="px-8 py-4 bg-slate-900 border border-slate-700 hover:border-fuchsia-500 text-gray-200 hover:text-fuchsia-400 font-bold rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all duration-300 transform hover:-translate-y-1 text-center">
            Pelajari Fitur
          </Link>
        </div>
      </main>

      {/* Efek Garis Grid di latar belakang agar terlihat seperti blueprint teknis */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size[24px_24px]"></div>
    </div>
  );
}
