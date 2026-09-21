import React from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  Mail, 
  Boxes, 
  BookOpenCheck, 
  Wallet, 
  FileSpreadsheet, 
  Settings, 
  X,
  School,
  AlertCircle,
  ClipboardList,
  ArrowLeftRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    activeModule, 
    setActiveModule, 
    notifications,
    currentUser
  } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Utama',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'kesiswaan',
      label: 'Administrasi Kesiswaan',
      icon: GraduationCap,
      badge: null
    },
    {
      id: 'piket',
      label: 'Piket Harian',
      icon: ClipboardList,
      badge: null
    },
    {
      id: 'mutasi',
      label: 'Mutasi Siswa',
      icon: ArrowLeftRight,
      badge: null
    },
    {
      id: 'kepegawaian',
      label: 'Kepegawaian (GTK)',
      icon: Users,
      badge: notifications.impendingKgb.length + notifications.impendingPangkat.length > 0
        ? `${notifications.impendingKgb.length + notifications.impendingPangkat.length} H-90`
        : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      id: 'persuratan',
      label: 'Persuratan & Kearsipan',
      icon: Mail,
      badge: notifications.urgentDisposisi.length > 0 ? `${notifications.urgentDisposisi.length}` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    },
    {
      id: 'sarpras',
      label: 'Sarana & Prasarana',
      icon: Boxes,
      badge: notifications.damagedAssets.length > 0 ? `${notifications.damagedAssets.length} Rusak` : null,
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40'
    },
    {
      id: 'pinjam_alat',
      label: 'Buku Pinjam Alat',
      icon: BookOpenCheck,
      badge: notifications.overdueLoans.length > 0 
        ? `${notifications.overdueLoans.length} Terlambat` 
        : (notifications.dueTodayLoans.length > 0 ? `${notifications.dueTodayLoans.length} Hari ini` : null),
      badgeColor: notifications.overdueLoans.length > 0 
        ? 'bg-rose-500/30 text-rose-300 border-rose-500/50' 
        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
    },
    {
      id: 'keuangan',
      label: 'Keuangan Sekolah (BKU)',
      icon: Wallet,
      badge: null
    },
    {
      id: 'laporan',
      label: 'Laporan & Ekspor',
      icon: FileSpreadsheet,
      badge: null
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan & Master Data',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-slate-950 text-slate-200 z-50 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-sm">
              <School className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-wide block leading-none">
                SMPN 2 KUTASARI
              </span>
              <span className="text-[10px] text-blue-400 font-medium tracking-wider uppercase">
                Sistem Tata Usaha
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Menu Administrasi
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`} />
                  <span className="tracking-wide">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.roleTitle}</p>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-center text-slate-300 font-mono">
            v2.6 • Kutasari, Purbalingga
          </div>
        </div>
      </aside>
    </>
  );
};
