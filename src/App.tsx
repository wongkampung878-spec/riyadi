import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { KesiswaanModule } from './components/kesiswaan/KesiswaanModule';
import { PiketModule } from './components/piket/PiketModule';
import { MutasiModule } from './components/mutasi/MutasiModule';
import { KepegawaianModule } from './components/kepegawaian/KepegawaianModule';
import { PersuratanModule } from './components/persuratan/PersuratanModule';
import { SarprasModule } from './components/sarpras/SarprasModule';
import { PinjamAlatModule } from './components/pinjam-alat/PinjamAlatModule';
import { KeuanganModule } from './components/keuangan/KeuanganModule';
import { LaporanModule } from './components/laporan/LaporanModule';
import { PengaturanModule } from './components/pengaturan/PengaturanModule';

const MainLayout: React.FC = () => {
  const { activeModule, setActiveModule, school } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeModule === 'dashboard' && <DashboardView />}
            {activeModule === 'kesiswaan' && <KesiswaanModule />}
            {activeModule === 'piket' && <PiketModule />}
            {activeModule === 'mutasi' && <MutasiModule />}
            {activeModule === 'kepegawaian' && <KepegawaianModule />}
            {activeModule === 'persuratan' && <PersuratanModule />}
            {activeModule === 'sarpras' && <SarprasModule />}
            {activeModule === 'pinjam_alat' && <PinjamAlatModule />}
            {activeModule === 'keuangan' && <KeuanganModule />}
            {activeModule === 'laporan' && <LaporanModule />}
            {activeModule === 'pengaturan' && <PengaturanModule />}
          </main>

          {/* Official Footer */}
          <footer className="bg-white border-t border-slate-200 py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 print:hidden">
            <div>
              <span className="font-bold text-slate-700">{school.namaSekolah}</span> — Kab. {school.kabupaten}, {school.provinsi}
            </div>
            <div className="text-[11px] text-slate-400">
              SIMTU (Sistem Informasi Manajemen Tata Usaha) &copy; 2026. Hak Cipta Dilindungi.
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
