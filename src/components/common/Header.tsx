import React, { useState } from 'react';
import { 
  Bell, 
  UserCheck, 
  ChevronDown, 
  Shield, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  FileText, 
  Package, 
  Menu,
  School,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { 
    currentUser, 
    users, 
    setCurrentUser, 
    school, 
    notifications, 
    setActiveModule 
  } = useApp();
  
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const totalAlerts = 
    notifications.urgentDisposisi.length + 
    notifications.overdueLoans.length + 
    notifications.dueTodayLoans.length + 
    notifications.impendingKgb.length + 
    notifications.impendingPangkat.length +
    notifications.damagedAssets.length;

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'kepala_sekolah':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'kepala_tu':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'staf_tu':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'guru':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'sarpras_laboran':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'kepala_sekolah': return 'Kepala Sekolah';
      case 'kepala_tu': return 'Kepala TU';
      case 'staf_tu': return 'Staf TU';
      case 'guru': return 'Guru / Wali Kelas';
      case 'sarpras_laboran': return 'Sarpras / Laboran';
      default: return role;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs no-print">
      {/* Left: Mobile hamburger & School info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <School className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-blue-950 text-base sm:text-lg tracking-tight">SIMTU</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 hidden sm:inline-block">
                SMPN 2 Kutasari
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Purbalingga, Jawa Tengah • Tahun Ajaran {school.tahunAjaranAktif} {school.semesterAktif}
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Academic Year indicator badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-700 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>TA {school.tahunAjaranAktif} ({school.semesterAktif})</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationMenu(!showNotificationMenu);
              setShowRoleMenu(false);
            }}
            className="p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg relative cursor-pointer transition-colors"
            title="Pemberitahuan & Peringatan"
          >
            <Bell className="w-5 h-5" />
            {totalAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {totalAlerts > 9 ? '9+' : totalAlerts}
              </span>
            )}
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Notifikasi & Agenda Penting
                </span>
                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  {totalAlerts} Perlu Tindakan
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                {/* Overdue Loans */}
                {notifications.overdueLoans.map(loan => (
                  <div 
                    key={loan.id}
                    onClick={() => {
                      setActiveModule('pinjam_alat');
                      setShowNotificationMenu(false);
                    }}
                    className="p-3 hover:bg-red-50/60 cursor-pointer transition-colors flex items-start gap-2.5"
                  >
                    <Clock className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-950">Peminjaman Terlambat: {loan.nomorPinjam}</p>
                      <p className="text-slate-600 text-[11px]">
                        {loan.namaPeminjam} ({loan.items.map(i => i.namaBarang).join(', ')})
                      </p>
                      <p className="text-[10px] text-red-700 font-medium">Batas: {loan.rencanaTanggalKembali}</p>
                    </div>
                  </div>
                ))}

                {/* Due Today Loans */}
                {notifications.dueTodayLoans.map(loan => (
                  <div 
                    key={loan.id}
                    onClick={() => {
                      setActiveModule('pinjam_alat');
                      setShowNotificationMenu(false);
                    }}
                    className="p-3 hover:bg-amber-50/60 cursor-pointer transition-colors flex items-start gap-2.5"
                  >
                    <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-950">Jatuh Tempo Hari Ini: {loan.nomorPinjam}</p>
                      <p className="text-slate-600 text-[11px]">
                        {loan.namaPeminjam} • Rencana kembali pukul {loan.rencanaJamKembali || '15:00'}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Urgent Disposisi */}
                {notifications.urgentDisposisi.slice(0, 3).map(letter => (
                  <div 
                    key={letter.id}
                    onClick={() => {
                      setActiveModule('persuratan');
                      setShowNotificationMenu(false);
                    }}
                    className="p-3 hover:bg-blue-50/60 cursor-pointer transition-colors flex items-start gap-2.5"
                  >
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Surat Belum Didisposisi</p>
                      <p className="text-slate-600 text-[11px] line-clamp-1">{letter.asalSurat}: {letter.perihal}</p>
                    </div>
                  </div>
                ))}

                {/* Impending KGB / Pangkat */}
                {notifications.impendingKgb.slice(0, 2).map(st => (
                  <div 
                    key={st.id}
                    onClick={() => {
                      setActiveModule('kepegawaian');
                      setShowNotificationMenu(false);
                    }}
                    className="p-3 hover:bg-emerald-50/60 cursor-pointer transition-colors flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Kenaikan Gaji Berkala (H-90)</p>
                      <p className="text-slate-600 text-[11px]">{st.nama} ({st.pangkatGolongan}) • TMT: {st.tmtKgbBerikutnya}</p>
                    </div>
                  </div>
                ))}

                {/* Damaged Assets */}
                {notifications.damagedAssets.slice(0, 2).map(item => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      setActiveModule('sarpras');
                      setShowNotificationMenu(false);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5"
                  >
                    <Package className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Aset Butuh Penanganan</p>
                      <p className="text-slate-600 text-[11px]">{item.nama} ({item.kondisi}) di {item.lokasiRuang}</p>
                    </div>
                  </div>
                ))}

                {totalAlerts === 0 && (
                  <div className="p-6 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                    <p>Semua administrasi berjalan lancar.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher & Active User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotificationMenu(false);
            }}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-slate-900 line-clamp-1 max-w-[130px]">
                  {currentUser.name}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeColor(currentUser.role)}`}>
                  {getRoleLabel(currentUser.role)}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">{currentUser.roleTitle}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Ganti Akun Pengguna (Simulasi Hak Akses)
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Klik untuk beralih peran dan menguji izin modul
                </p>
              </div>

              <div className="py-1 max-h-72 overflow-y-auto">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setCurrentUser(u);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                      u.id === currentUser.id ? 'bg-blue-50/70 font-semibold' : ''
                    }`}
                  >
                    <div>
                      <p className="text-slate-900 font-medium">{u.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeColor(u.role)}`}>
                          {getRoleLabel(u.role)}
                        </span>
                        <span className="text-[10px] text-slate-500">{u.roleTitle}</span>
                      </div>
                    </div>
                    {u.id === currentUser.id && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
