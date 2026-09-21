import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  School, 
  Users, 
  Database, 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  FileText,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, SchoolIdentity, UserRole } from '../../types';

export const PengaturanModule: React.FC = () => {
  const { 
    school, 
    updateSchool, 
    users, 
    addUser, 
    updateUser, 
    deleteUser,
    exportDatabaseToJson,
    importDatabaseFromJson,
    resetToFactoryData,
    currentUser
  } = useApp();

  // Proteksi Edit Pengaturan & Konfigurasi Sistem (Sandi: Spendaku212)
  const [isEditUnlocked, setIsEditUnlocked] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const handleProtectedAction = (action: () => void) => {
    if (isEditUnlocked) {
      action();
    } else {
      setPendingAction(() => action);
      setPasswordInput('');
      setPasswordError(null);
      setIsPasswordModalOpen(true);
    }
  };

  const handleVerifyPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passwordInput === 'Spendaku212') {
      setIsEditUnlocked(true);
      setIsPasswordModalOpen(false);
      setPasswordError(null);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      setPasswordError('Sandi otorisasi salah! Silakan periksa kembali kata sandi Anda.');
    }
  };

  const [activeTab, setActiveTab] = useState<'profil_sekolah' | 'manajemen_user' | 'backup_restore'>('profil_sekolah');

  // School profile form
  const [profileForm, setProfileForm] = useState<SchoolIdentity>(school);

  useEffect(() => {
    setProfileForm(school);
  }, [school]);

  // User modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'staf_tu' as UserRole,
    roleTitle: 'Staf Administrasi Tata Usaha',
    assignedClass: '',
    isActive: true
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    handleProtectedAction(() => {
      updateSchool(profileForm);
      alert('Profil dan Kop Surat SMPN 2 Kutasari berhasil disimpan!');
    });
  };

  const handleOpenUserModal = (u?: User) => {
    handleProtectedAction(() => {
      if (u) {
        setEditingUser(u);
        setUserForm({
          name: u.name,
          email: u.email,
          role: u.role,
          roleTitle: u.roleTitle,
          assignedClass: u.assignedClass || '',
          isActive: u.isActive
        });
      } else {
        setEditingUser(null);
        setUserForm({
          name: '',
          email: '',
          role: 'staf_tu',
          roleTitle: 'Staf Administrasi Tata Usaha',
          assignedClass: '',
          isActive: true
        });
      }
      setIsUserModalOpen(true);
    });
  };

  const handleDeleteUser = (id: string, name: string) => {
    handleProtectedAction(() => {
      if (window.confirm(`Hapus pengguna ${name}?`)) {
        deleteUser(id);
      }
    });
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) {
      alert('Nama dan email wajib diisi!');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, userForm);
    } else {
      addUser({
        ...userForm,
        isActive: true,
        assignedModules: ['semua']
      });
    }
    setIsUserModalOpen(false);
  };

  const handleBackupDownload = () => {
    exportDatabaseToJson();
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleProtectedAction(() => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const success = importDatabaseFromJson(content);
        if (success) {
          alert('Database SIMTU SMPN 2 Kutasari berhasil dipulihkan dari file cadangan!');
        } else {
          alert('Gagal memulihkan database. Format berkas JSON tidak valid.');
        }
      };
      reader.readAsText(file);
    });
    e.target.value = '';
  };

  const handleResetData = () => {
    handleProtectedAction(() => {
      if (window.confirm('PERINGATAN: Seluruh perubahan data Anda akan dikembalikan ke data awal standar. Lanjutkan reset?')) {
        resetToFactoryData();
        alert('Sistem berhasil direset ke data percontohan resmi!');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            Pengaturan & Konfigurasi Sistem
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Identitas sekolah, kop surat resmi, manajemen hak akses pengguna, serta pencadangan & pemulihan database.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Tombol Proteksi Edit Pengaturan (Cukup SATU menu proteksi) */}
          {!isEditUnlocked ? (
            <button
              type="button"
              onClick={() => {
                setPendingAction(null);
                setPasswordInput('');
                setPasswordError(null);
                setIsPasswordModalOpen(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Aksi edit pengaturan diproteksi kata sandi. Klik untuk membuka otorisasi."
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Proteksi: Terkunci</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditUnlocked(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs group"
              title="Akses edit konfigurasi terbuka. Klik untuk mengunci kembali."
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Akses Edit: Terbuka</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-200/60 px-1.5 py-0.5 rounded ml-0.5 group-hover:bg-emerald-300">
                Kunci
              </span>
            </button>
          )}

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200">
            <button
              onClick={() => setActiveTab('profil_sekolah')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'profil_sekolah' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>Profil & Kop Surat</span>
            </button>

            <button
              onClick={() => setActiveTab('manajemen_user')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'manajemen_user' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manajemen Pengguna</span>
            </button>

            <button
              onClick={() => setActiveTab('backup_restore')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'backup_restore' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Backup & Restore</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: PROFIL & KOP SURAT */}
      {activeTab === 'profil_sekolah' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Identitas Sekolah & Tata Naskah Dinas</h3>
                {!isEditUnlocked && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-600" />
                    Terkunci (Hanya Baca)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {!isEditUnlocked 
                  ? 'Pengaturan terkunci. Klik tombol "Proteksi: Terkunci" di bilah atas untuk membuka otorisasi edit.' 
                  : 'Data ini menjadi acuan otomatis pada seluruh Kop Surat dan Tanda Tangan Dokumen Cetak.'}
              </p>
            </div>
            {isEditUnlocked && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
            )}
          </div>

          <fieldset disabled={!isEditUnlocked} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Satuan Pendidikan *</label>
                <input
                  type="text"
                  required
                  disabled={!isEditUnlocked}
                  value={profileForm.namaSekolah}
                  onChange={(e) => setProfileForm({ ...profileForm, namaSekolah: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-600 font-semibold disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NPSN</label>
                  <input
                    type="text"
                    disabled={!isEditUnlocked}
                    value={profileForm.npsn}
                    onChange={(e) => setProfileForm({ ...profileForm, npsn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-600 font-mono disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Akreditasi</label>
                  <input
                    type="text"
                    disabled={!isEditUnlocked}
                    value={profileForm.akreditasi}
                    onChange={(e) => setProfileForm({ ...profileForm, akreditasi: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-600 font-bold text-emerald-700 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 border-slate-300"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Alamat Lengkap</label>
                <input
                  type="text"
                  disabled={!isEditUnlocked}
                  value={profileForm.alamatLengkap}
                  onChange={(e) => setProfileForm({ ...profileForm, alamatLengkap: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-600 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 border-slate-300"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kecamatan & Kabupaten</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    disabled={!isEditUnlocked}
                    value={profileForm.kecamatan}
                    onChange={(e) => setProfileForm({ ...profileForm, kecamatan: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 border-slate-300"
                    placeholder="Kecamatan"
                  />
                  <input
                    type="text"
                    disabled={!isEditUnlocked}
                    value={profileForm.kabupaten}
                    onChange={(e) => setProfileForm({ ...profileForm, kabupaten: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 border-slate-300"
                    placeholder="Kabupaten"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kode Pos & Kontak</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    disabled={!isEditUnlocked}
                    value={profileForm.kodePos}
                    onChange={(e) => setProfileForm({ ...profileForm, kodePos: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 border-slate-300"
                    placeholder="Kode Pos"
                  />
                  <input
                    type="text"
                    disabled={!isEditUnlocked}
                    value={profileForm.telepon}
                    onChange={(e) => setProfileForm({ ...profileForm, telepon: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 border-slate-300"
                    placeholder="No. Telepon"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Resmi Sekolah</label>
                <input
                  type="email"
                  disabled={!isEditUnlocked}
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-mono disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 border-slate-300"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Website Resmi</label>
                <input
                  type="text"
                  disabled={!isEditUnlocked}
                  value={profileForm.website}
                  onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-mono disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 border-slate-300"
                />
              </div>

              <div className="border-t border-slate-200 pt-4 md:col-span-2">
                <h4 className="font-bold text-slate-900 text-xs mb-3">Pejabat Penandatangan Resmi</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <span className="font-bold text-slate-800 block text-[11px]">Kepala Sekolah</span>
                    <input
                      type="text"
                      disabled={!isEditUnlocked}
                      value={profileForm.kepalaSekolah}
                      onChange={(e) => setProfileForm({ ...profileForm, kepalaSekolah: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded font-semibold text-xs disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 border-slate-300"
                      placeholder="Nama Lengkap & Gelar"
                    />
                    <input
                      type="text"
                      disabled={!isEditUnlocked}
                      value={profileForm.nipKepalaSekolah}
                      onChange={(e) => setProfileForm({ ...profileForm, nipKepalaSekolah: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded font-mono text-xs disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 border-slate-300"
                      placeholder="NIP Kepala Sekolah"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <span className="font-bold text-slate-800 block text-[11px]">Kepala Urusan Tata Usaha (KTU)</span>
                    <input
                      type="text"
                      disabled={!isEditUnlocked}
                      value={profileForm.kepalaTu}
                      onChange={(e) => setProfileForm({ ...profileForm, kepalaTu: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded font-semibold text-xs disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 border-slate-300"
                      placeholder="Nama Kepala TU & Gelar"
                    />
                    <input
                      type="text"
                      disabled={!isEditUnlocked}
                      value={profileForm.nipKepalaTu}
                      onChange={(e) => setProfileForm({ ...profileForm, nipKepalaTu: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded font-mono text-xs disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200 border-slate-300"
                      placeholder="NIP Kepala TU"
                    />
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      )}

      {/* TAB 2: MANAJEMEN USER */}
      {activeTab === 'manajemen_user' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Daftar Akun Pengguna & Hak Akses (RBAC)</h3>
              <p className="text-xs text-slate-500">Kelola akun pegawai, peran kedinasan, dan otorisasi modul.</p>
            </div>
            <button
              onClick={() => handleOpenUserModal()}
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengguna</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                  <th className="py-3 px-4">Nama Pengguna</th>
                  <th className="py-3 px-4">Email Login</th>
                  <th className="py-3 px-4">Peran Sistem</th>
                  <th className="py-3 px-4">Jabatan Kedinasan</th>
                  <th className="py-3 px-4">Kelas Binaan</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {u.name}
                      {u.id === currentUser.id && (
                        <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded font-mono">
                          (Anda)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'kepala_sekolah' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'kepala_tu' ? 'bg-blue-100 text-blue-800' :
                        u.role === 'staf_tu' ? 'bg-emerald-100 text-emerald-800' :
                        u.role === 'guru' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{u.roleTitle}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {u.assignedClass ? `Kelas ${u.assignedClass}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenUserModal(u)}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded cursor-pointer"
                          title="Edit Pengguna"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {u.id !== currentUser.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded cursor-pointer"
                            title="Hapus Pengguna"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BACKUP & RESTORE */}
      {activeTab === 'backup_restore' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {/* Card Backup */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Unduh Cadangan Database (Backup)</h3>
              <p className="text-slate-500 leading-relaxed">
                Ekspor seluruh data SIMTU SMPN 2 Kutasari (siswa, GTK, surat masuk/keluar, sarpras, peminjaman alat, transaksi kas, dan pengguna) dalam format JSON aman.
              </p>
            </div>

            <button
              onClick={handleBackupDownload}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              Unduh File JSON Cadangan
            </button>
          </div>

          {/* Card Restore */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Pulihkan Database (Restore)</h3>
              <p className="text-slate-500 leading-relaxed">
                Unggah berkas JSON cadangan untuk memulihkan seluruh catatan dan pengaturan yang telah disimpan sebelumnya.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => {
                  if (!isEditUnlocked) {
                    handleProtectedAction(() => {
                      document.getElementById('restore-file-input')?.click();
                    });
                  } else {
                    document.getElementById('restore-file-input')?.click();
                  }
                }}
                className="w-full py-2 border-2 border-dashed border-blue-400 hover:bg-blue-50/50 text-blue-800 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih Berkas JSON Backup</span>
              </button>
              <input
                id="restore-file-input"
                type="file"
                accept=".json"
                onChange={handleRestoreFile}
                className="hidden"
              />
            </div>
          </div>

          {/* Card Reset */}
          <div className="bg-white p-5 rounded-xl border border-red-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-800 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-red-900 text-sm">Reset ke Data Standar (Pabrik)</h3>
              <p className="text-slate-500 leading-relaxed">
                Mengembalikan seluruh data ke data percontohan lengkap (30+ siswa, 15+ GTK, arsip surat, 20+ aset sarpras, pinjam alat, dan kas).
              </p>
            </div>

            <button
              onClick={handleResetData}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Database ke Default</span>
            </button>
          </div>
        </div>
      )}

      {/* USER MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                {editingUser ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Pengguna *</label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Peran / Hak Akses</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => {
                      const newRole = e.target.value as UserRole;
                      const roleTitles: Record<UserRole, string> = {
                        kepala_sekolah: 'Kepala Sekolah',
                        kepala_tu: 'Kepala Tata Usaha',
                        staf_tu: 'Staf Administrasi Tata Usaha',
                        guru: 'Guru / Wali Kelas',
                        sarpras_laboran: 'Petugas Sarpras & Laboran'
                      };
                      setUserForm({ 
                        ...userForm, 
                        role: newRole,
                        roleTitle: roleTitles[newRole] || userForm.roleTitle 
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 font-semibold"
                  >
                    <option value="kepala_sekolah">Kepala Sekolah</option>
                    <option value="kepala_tu">Kepala Tata Usaha</option>
                    <option value="staf_tu">Staf Tata Usaha</option>
                    <option value="guru">Guru / Wali Kelas</option>
                    <option value="sarpras_laboran">Petugas Sarpras / Laboran</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jabatan Kedinasan</label>
                  <input
                    type="text"
                    value={userForm.roleTitle}
                    onChange={(e) => setUserForm({ ...userForm, roleTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {userForm.role === 'guru' && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Wali Kelas (Khusus Guru Wali)</label>
                  <input
                    type="text"
                    value={userForm.assignedClass}
                    onChange={(e) => setUserForm({ ...userForm, assignedClass: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="Contoh: 8A atau 9B"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PROTEKSI EDIT PENGATURAN & KONFIGURASI SISTEM (SPENDAKU212) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-700 p-5 text-white flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Proteksi Konfigurasi Sistem</h3>
                  <p className="text-xs text-amber-100 mt-0.5">
                    Otorisasi sandi pengaman diperlukan untuk mengubah pengaturan
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordError(null);
                  setPendingAction(null);
                }}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyPassword} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Masukkan Kata Sandi Otorisasi:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ketik kata sandi..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(null);
                    }}
                    autoFocus
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm border-2 border-slate-300 rounded-xl focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-100 font-medium tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordError(null);
                    setPendingAction(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Buka Kunci Pengaturan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
