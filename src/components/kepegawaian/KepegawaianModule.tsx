import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Printer, 
  Edit3, 
  Trash2, 
  Calendar, 
  Award, 
  FileCheck, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Staff, LeaveRequest } from '../../types';
import { PrintModal } from '../common/PrintModal';

export const KepegawaianModule: React.FC = () => {
  const { 
    staff, 
    addStaff, 
    updateStaff, 
    deleteStaff, 
    leaveRequests, 
    addLeaveRequest, 
    updateLeaveStatus,
    notifications,
    currentUser,
    school
  } = useApp();

  const [activeTab, setActiveTab] = useState<'daftar_gtk' | 'pengingat_kgb' | 'cuti' | 'duk'>('daftar_gtk');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  
  // Modals
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [isLeaveFormOpen, setIsLeaveFormOpen] = useState(false);

  // Print Modals
  const [printDocType, setPrintDocType] = useState<'duk' | 'surat_cuti' | 'pengantar_kgb' | null>(null);
  const [selectedStaffForPrint, setSelectedStaffForPrint] = useState<Staff | null>(null);
  const [selectedLeaveForPrint, setSelectedLeaveForPrint] = useState<LeaveRequest | null>(null);

  // Form State for Staff
  const initialStaffForm: Omit<Staff, 'id'> = {
    nipNuPtk: '',
    nama: '',
    gelar: 'S.Pd.',
    status: 'PNS',
    pangkatGolongan: 'Penata Muda (III/a)',
    tmt: '2022-04-01',
    tmtPangkatBerikutnya: '2026-10-01',
    tmtKgbBerikutnya: '2026-11-01',
    jabatan: 'Guru Mata Pelajaran',
    mapelDiampu: 'Bahasa Indonesia',
    pendidikanTerakhir: 'S1 Pendidikan Bahasa dan Sastra Indonesia',
    noHp: '',
    alamat: '',
    riwayatPangkat: [],
    riwayatPendidikan: [],
    riwayatDiklat: []
  };

  const [staffFormData, setStaffFormData] = useState<Omit<Staff, 'id'>>(initialStaffForm);

  // Form State for Leave Request
  const [leaveFormData, setLeaveFormData] = useState({
    staffId: '',
    jenisCuti: 'Cuti Tahunan' as LeaveRequest['jenisCuti'],
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    jumlahHari: 3,
    alasan: '',
    alamatSelamaCuti: ''
  });

  const filteredStaff = staff.filter(s => {
    const matchesSearch = 
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nipNuPtk?.includes(searchTerm) ||
      s.jabatan.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'semua' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenStaffForm = (member?: Staff) => {
    if (member) {
      setEditingStaff(member);
      setStaffFormData(member);
    } else {
      setEditingStaff(null);
      setStaffFormData(initialStaffForm);
    }
    setIsStaffFormOpen(true);
  };

  const handleSubmitStaffForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffFormData.nama) {
      alert('Nama pegawai wajib diisi!');
      return;
    }

    if (editingStaff) {
      updateStaff(editingStaff.id, staffFormData);
    } else {
      addStaff(staffFormData);
    }
    setIsStaffFormOpen(false);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus pegawai "${name}" dari sistem kepegawaian?`)) {
      deleteStaff(id);
    }
  };

  const handleSubmitLeaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const targetStaff = staff.find(s => s.id === leaveFormData.staffId);
    if (!targetStaff) {
      alert('Pilih pegawai pemohon cuti!');
      return;
    }

    addLeaveRequest({
      staffId: targetStaff.id,
      staffName: targetStaff.nama,
      jenisCuti: leaveFormData.jenisCuti,
      tanggalMulai: leaveFormData.tanggalMulai,
      tanggalSelesai: leaveFormData.tanggalSelesai,
      jumlahHari: Number(leaveFormData.jumlahHari) || 1,
      alasan: leaveFormData.alasan
    });

    setIsLeaveFormOpen(false);
    alert('Permohonan cuti berhasil diajukan dan masuk ke daftar tunggu persetujuan Kepala Sekolah/KTU.');
  };

  // Check permission for leave approval
  const canApproveLeave = currentUser.role === 'kepala_sekolah' || currentUser.role === 'kepala_tu';

  return (
    <div className="space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-700" />
            Administrasi Kepegawaian (GTK)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen Guru & Tenaga Kependidikan, riwayat kenaikan pangkat & KGB (H-90), pengajuan cuti, dan DUK.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('daftar_gtk')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'daftar_gtk' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar GTK
          </button>
          <button
            onClick={() => setActiveTab('pengingat_kgb')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pengingat_kgb' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pengingat KGB & Pangkat</span>
            {notifications.impendingKgb.length + notifications.impendingPangkat.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-600 text-white font-bold">
                {notifications.impendingKgb.length + notifications.impendingPangkat.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('cuti')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cuti' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pengajuan Cuti</span>
            {leaveRequests.filter(l => l.status === 'Menunggu').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                {leaveRequests.filter(l => l.status === 'Menunggu').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('duk')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'duk' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Buku DUK
          </button>
        </div>
      </div>

      {/* TAB 1: DAFTAR GTK */}
      {activeTab === 'daftar_gtk' && (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama, NIP, NUPTK, mapel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="semua">Semua Status Kepegawaian</option>
                <option value="PNS">Pegawai Negeri Sipil (PNS)</option>
                <option value="PPPK">Pegawai Pemerintah dg Perjanjian Kerja (PPPK)</option>
                <option value="GTT">Guru Tidak Tetap (GTT)</option>
                <option value="PTT">Pegawai Tidak Tetap (PTT)</option>
              </select>
            </div>

            <button
              onClick={() => handleOpenStaffForm()}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              Tambah Pegawai (GTK)
            </button>
          </div>

          {/* Tabel GTK */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">Nama Lengkap & NIP</th>
                    <th className="py-3 px-4">Status & Gol</th>
                    <th className="py-3 px-4">Jabatan & Tugas</th>
                    <th className="py-3 px-4">Pendidikan Terakhir</th>
                    <th className="py-3 px-4">Jadwal KGB / Pangkat</th>
                    <th className="py-3 px-4">Kontak</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.map((member, idx) => (
                    <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">{member.nama}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          NIP/NUPTK: {member.nipNuPtk || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          member.status === 'PNS' ? 'bg-blue-100 text-blue-800' :
                          member.status === 'PPPK' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {member.status}
                        </span>
                        <span className="block text-[11px] text-slate-600 mt-0.5">
                          {member.pangkatGolongan || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 block">{member.jabatan}</span>
                        <span className="text-[11px] text-slate-500">{member.mapelDiampu || '-'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-800 block">{member.pendidikanTerakhir}</span>
                      </td>
                      <td className="py-3 px-4">
                        {member.tmtKgbBerikutnya && (
                          <div className="text-[11px]">
                            <span className="text-slate-500">KGB: </span>
                            <span className="font-semibold text-emerald-700 font-mono">{member.tmtKgbBerikutnya}</span>
                          </div>
                        )}
                        {member.tmtPangkatBerikutnya && (
                          <div className="text-[11px]">
                            <span className="text-slate-500">Pangkat: </span>
                            <span className="font-semibold text-blue-700 font-mono">{member.tmtPangkatBerikutnya}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {member.noHp || '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedStaffForPrint(member);
                              setPrintDocType('pengantar_kgb');
                            }}
                            className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded cursor-pointer"
                            title="Cetak Usulan / Surat Pengantar KGB"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenStaffForm(member)}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded cursor-pointer"
                            title="Edit Data GTK"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(member.id, member.nama)}
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded cursor-pointer"
                            title="Hapus Pegawai"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Menampilkan {filteredStaff.length} dari {staff.length} pegawai</span>
              <span>PNS: {staff.filter(s => s.status === 'PNS').length} • PPPK: {staff.filter(s => s.status === 'PPPK').length} • Honorer: {staff.filter(s => s.status === 'GTT' || s.status === 'PTT').length}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PENGINGAT KENAIKAN PANGKAT & KGB (H-90) */}
      {activeTab === 'pengingat_kgb' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
            <Clock className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <h4 className="font-bold text-emerald-950 text-sm">
                Sistem Peringatan Dini Kenaikan Gaji Berkala (KGB) & Pangkat (H-90)
              </h4>
              <p className="text-emerald-800 mt-1 leading-relaxed">
                Staf Tata Usaha dapat menyiapkan berkas SK, Penilaian Kinerja Guru (PKG), dan usulan dinas ke Disdikbud Purbalingga
                minimal 3 bulan (90 hari) sebelum Tanggal Mulai Terhitung (TMT).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kartu Usulan KGB Terdekat */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Jadwal Kenaikan Gaji Berkala (KGB)
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {notifications.impendingKgb.length} Pegawai
                </span>
              </div>

              <div className="space-y-3">
                {notifications.impendingKgb.map(member => (
                  <div key={member.id} className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/40 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{member.nama}</span>
                      <span className="font-mono font-bold text-emerald-800 text-[11px]">
                        TMT: {member.tmtKgbBerikutnya}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      NIP/NUPTK: {member.nipNuPtk || '-'} • Gol: {member.pangkatGolongan}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                        Perlu Disiapkan SK KGB
                      </span>
                      <button
                        onClick={() => {
                          setSelectedStaffForPrint(member);
                          setPrintDocType('pengantar_kgb');
                        }}
                        className="px-2.5 py-1 text-[11px] bg-emerald-700 hover:bg-emerald-600 text-white font-medium rounded transition-colors cursor-pointer"
                      >
                        Cetak Surat Pengantar
                      </button>
                    </div>
                  </div>
                ))}

                {notifications.impendingKgb.length === 0 && (
                  <p className="text-center py-6 text-slate-400 text-xs">Tidak ada usulan KGB dalam 90 hari ke depan.</p>
                )}
              </div>
            </div>

            {/* Kartu Usulan Kenaikan Pangkat Terdekat */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  Jadwal Kenaikan Pangkat Golongan
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {notifications.impendingPangkat.length} Pegawai
                </span>
              </div>

              <div className="space-y-3">
                {notifications.impendingPangkat.map(member => (
                  <div key={member.id} className="p-3 rounded-lg border border-blue-200 bg-blue-50/40 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{member.nama}</span>
                      <span className="font-mono font-bold text-blue-800 text-[11px]">
                        TMT: {member.tmtPangkatBerikutnya}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Pangkat Saat Ini: {member.pangkatGolongan}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[10px] text-blue-700 font-semibold bg-blue-100 px-2 py-0.5 rounded">
                        Periode Usulan BKD/Disdikbud
                      </span>
                      <span className="text-[10px] text-slate-500">Kumpulkan PAK & SKP</span>
                    </div>
                  </div>
                ))}

                {notifications.impendingPangkat.length === 0 && (
                  <p className="text-center py-6 text-slate-400 text-xs">Tidak ada usulan kenaikan pangkat dalam 90 hari ke depan.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PENGAJUAN & PERSETUJUAN CUTI */}
      {activeTab === 'cuti' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Modul Permohonan Cuti Pegawai</h3>
              <p className="text-xs text-slate-500">Pengajuan cuti tahunan, cuti sakit, cuti bersalin, cuti alasan penting.</p>
            </div>
            <button
              onClick={() => setIsLeaveFormOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Ajukan Cuti Baru
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                  <th className="py-3 px-4">Nama Pegawai & NIP</th>
                  <th className="py-3 px-4">Jenis Cuti</th>
                  <th className="py-3 px-4">Tanggal Mulai - Selesai</th>
                  <th className="py-3 px-4">Lama Hari</th>
                  <th className="py-3 px-4">Alasan Cuti</th>
                  <th className="py-3 px-4">Status & Persetujuan</th>
                  <th className="py-3 px-4 text-center">Cetak Formulir</th>
                  {canApproveLeave && <th className="py-3 px-4 text-right">Aksi Persetujuan</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaveRequests.map(leave => (
                  <tr key={leave.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{leave.staffName}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{leave.jenisCuti}</td>
                    <td className="py-3 px-4 text-slate-700 font-mono">
                      {leave.tanggalMulai} s.d {leave.tanggalSelesai}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{leave.jumlahHari} hari kerja</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs">{leave.alasan}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        leave.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' :
                        leave.status === 'Ditolak' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {leave.status}
                      </span>
                      {leave.disetujuiOleh && (
                        <span className="block text-[10px] text-slate-400 mt-0.5">Oleh: {leave.disetujuiOleh}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedLeaveForPrint(leave);
                          setPrintDocType('surat_cuti');
                        }}
                        className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition-colors cursor-pointer"
                      >
                        Cetak Form Cuti
                      </button>
                    </td>
                    {canApproveLeave && (
                      <td className="py-3 px-4 text-right">
                        {leave.status === 'Menunggu' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => updateLeaveStatus(leave.id, 'Disetujui', currentUser.name)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold hover:bg-emerald-500 flex items-center gap-1 cursor-pointer"
                              title="Setujui Cuti"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Setujui
                            </button>
                            <button
                              onClick={() => updateLeaveStatus(leave.id, 'Ditolak', currentUser.name)}
                              className="px-2 py-1 bg-red-600 text-white rounded text-[11px] font-semibold hover:bg-red-500 flex items-center gap-1 cursor-pointer"
                              title="Tolak Cuti"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Selesai diproses</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DAFTAR URUT KEPANGKATAN (DUK) */}
      {activeTab === 'duk' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Daftar Urut Kepangkatan (DUK) Pegawai Negeri Sipil</h3>
              <p className="text-xs text-slate-500">SMP Negeri 2 Kutasari, Kabupaten Purbalingga • Keadaan Per September 2026</p>
            </div>
            <button
              onClick={() => setPrintDocType('duk')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Format DUK Resmi
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[11px]">
                    <th className="py-3 px-3">No Urut</th>
                    <th className="py-3 px-3">Nama Pegawai & NIP</th>
                    <th className="py-3 px-3">Pangkat / Gol. Ruang</th>
                    <th className="py-3 px-3">TMT Pangkat</th>
                    <th className="py-3 px-3">Jabatan</th>
                    <th className="py-3 px-3">TMT KGB Berikutnya</th>
                    <th className="py-3 px-3">Pendidikan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staff.filter(s => s.status === 'PNS').map((pns, index) => (
                    <tr key={pns.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-center text-slate-900">{index + 1}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{pns.nama}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{pns.nipNuPtk}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-blue-900">{pns.pangkatGolongan}</td>
                      <td className="py-3 px-3 font-mono text-slate-700">{pns.tmt}</td>
                      <td className="py-3 px-3">{pns.jabatan}</td>
                      <td className="py-3 px-3 font-mono text-emerald-800 font-semibold">{pns.tmtKgbBerikutnya}</td>
                      <td className="py-3 px-3 text-slate-600">{pns.pendidikanTerakhir}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT GTK */}
      {isStaffFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                {editingStaff ? 'Edit Data Pegawai GTK' : 'Tambah Pegawai GTK Baru'}
              </h3>
              <button onClick={() => setIsStaffFormOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitStaffForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={staffFormData.nama}
                    onChange={(e) => setStaffFormData({ ...staffFormData, nama: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                    placeholder="Contoh: Budi Santoso, S.Pd."
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Status Kepegawaian *</label>
                  <select
                    value={staffFormData.status}
                    onChange={(e) => setStaffFormData({ ...staffFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  >
                    <option value="PNS">Pegawai Negeri Sipil (PNS)</option>
                    <option value="PPPK">PPPK</option>
                    <option value="GTT">Guru Tidak Tetap (GTT)</option>
                    <option value="PTT">Pegawai Tidak Tetap (PTT)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">NIP / NUPTK</label>
                  <input
                    type="text"
                    value={staffFormData.nipNuPtk || ''}
                    onChange={(e) => setStaffFormData({ ...staffFormData, nipNuPtk: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
                    placeholder="18 digit NIP atau 16 digit NUPTK"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pangkat & Golongan Ruang</label>
                  <input
                    type="text"
                    value={staffFormData.pangkatGolongan || ''}
                    onChange={(e) => setStaffFormData({ ...staffFormData, pangkatGolongan: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                    placeholder="Contoh: Pembina (IV/a)"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jabatan Utama</label>
                  <input
                    type="text"
                    required
                    value={staffFormData.jabatan}
                    onChange={(e) => setStaffFormData({ ...staffFormData, jabatan: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                    placeholder="Contoh: Guru Matematika / Staf Tata Usaha"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mata Pelajaran yang Diampu</label>
                  <input
                    type="text"
                    value={staffFormData.mapelDiampu || ''}
                    onChange={(e) => setStaffFormData({ ...staffFormData, mapelDiampu: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                    placeholder="Contoh: Matematika"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">TMT KGB Berikutnya</label>
                  <input
                    type="date"
                    value={staffFormData.tmtKgbBerikutnya || ''}
                    onChange={(e) => setStaffFormData({ ...staffFormData, tmtKgbBerikutnya: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">TMT Kenaikan Pangkat Berikutnya</label>
                  <input
                    type="date"
                    value={staffFormData.tmtPangkatBerikutnya || ''}
                    onChange={(e) => setStaffFormData({ ...staffFormData, tmtPangkatBerikutnya: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    value={staffFormData.pendidikanTerakhir}
                    onChange={(e) => setStaffFormData({ ...staffFormData, pendidikanTerakhir: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                    placeholder="Contoh: S1 Pendidikan Matematika"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">No. HP / WhatsApp</label>
                  <input
                    type="text"
                    value={staffFormData.noHp}
                    onChange={(e) => setStaffFormData({ ...staffFormData, noHp: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-emerald-600"
                    placeholder="08xxxxxxxx"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alamat Tempat Tinggal</label>
                <textarea
                  rows={2}
                  value={staffFormData.alamat}
                  onChange={(e) => setStaffFormData({ ...staffFormData, alamat: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsStaffFormOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {editingStaff ? 'Simpan Perubahan' : 'Simpan Pegawai Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FORM AJUKAN CUTI */}
      {isLeaveFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Form Pengajuan Cuti Pegawai
              </h3>
              <button onClick={() => setIsLeaveFormOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLeaveForm} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pilih Pegawai Pemohon *</label>
                <select
                  required
                  value={leaveFormData.staffId}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, staffId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value="">-- Pilih Guru / Tenaga Kependidikan --</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.nama} ({s.status} - {s.jabatan})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jenis Cuti *</label>
                <select
                  value={leaveFormData.jenisCuti}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, jenisCuti: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                >
                  <option value="Cuti Tahunan">Cuti Tahunan</option>
                  <option value="Cuti Sakit">Cuti Sakit</option>
                  <option value="Cuti Melahirkan">Cuti Melahirkan</option>
                  <option value="Cuti Alasan Penting">Cuti Karena Alasan Penting</option>
                  <option value="Cuti Besar">Cuti Besar</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Mulai Cuti</label>
                  <input
                    type="date"
                    required
                    value={leaveFormData.tanggalMulai}
                    onChange={(e) => setLeaveFormData({ ...leaveFormData, tanggalMulai: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Selesai Cuti</label>
                  <input
                    type="date"
                    required
                    value={leaveFormData.tanggalSelesai}
                    onChange={(e) => setLeaveFormData({ ...leaveFormData, tanggalSelesai: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lama Hari Kerja</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={leaveFormData.jumlahHari}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, jumlahHari: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alasan Pengajuan Cuti *</label>
                <textarea
                  rows={2}
                  required
                  value={leaveFormData.alasan}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, alasan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  placeholder="Keterangan keperluan cuti..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLeaveFormOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Ajukan Permohonan Cuti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT MODAL PREVIEWS (DUK, SURAT CUTI, USULAN KGB) */}
      {printDocType && (
        <PrintModal
          isOpen={!!printDocType}
          onClose={() => setPrintDocType(null)}
          title={
            printDocType === 'duk' ? 'Daftar Urut Kepangkatan (DUK) Pegawai Negeri Sipil' :
            printDocType === 'surat_cuti' ? 'Formulir Permintaan & Pemberian Cuti' :
            'Surat Pengantar Usulan Kenaikan Gaji Berkala (KGB)'
          }
          documentNumber="800 / 045 / SMPN2KTS / 2026"
        >
          {/* FORMAT 1: DUK PRINT */}
          {printDocType === 'duk' && (
            <div className="space-y-4 text-xs font-sans">
              <div className="text-center my-3">
                <h3 className="text-sm font-bold uppercase underline tracking-wider">
                  DAFTAR URUT KEPANGKATAN (DUK) PEGAWAI NEGERI SIPIL
                </h3>
                <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                  SMP NEGERI 2 KUTASARI — KEADAAN PER SEPTEMBER 2026
                </p>
              </div>

              <table className="w-full text-[10px] border border-slate-400 border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-400 font-bold text-center">
                    <th className="border border-slate-400 p-1.5">No Urut</th>
                    <th className="border border-slate-400 p-1.5">Nama Pegawai & NIP</th>
                    <th className="border border-slate-400 p-1.5">Pangkat / Gol. Ruang</th>
                    <th className="border border-slate-400 p-1.5">TMT Pangkat</th>
                    <th className="border border-slate-400 p-1.5">Jabatan</th>
                    <th className="border border-slate-400 p-1.5">TMT KGB</th>
                    <th className="border border-slate-400 p-1.5">Pendidikan</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.filter(s => s.status === 'PNS').map((st, i) => (
                    <tr key={st.id} className="border-b border-slate-300">
                      <td className="border border-slate-400 p-1.5 text-center font-bold">{i + 1}</td>
                      <td className="border border-slate-400 p-1.5 font-semibold">
                        {st.nama}
                        <span className="block font-mono text-[9px] text-slate-600 font-normal">NIP/NUPTK: {st.nipNuPtk}</span>
                      </td>
                      <td className="border border-slate-400 p-1.5">{st.pangkatGolongan}</td>
                      <td className="border border-slate-400 p-1.5 font-mono text-center">{st.tmt}</td>
                      <td className="border border-slate-400 p-1.5">{st.jabatan}</td>
                      <td className="border border-slate-400 p-1.5 font-mono text-center font-bold text-emerald-800">{st.tmtKgbBerikutnya}</td>
                      <td className="border border-slate-400 p-1.5">{st.pendidikanTerakhir}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-8 flex justify-end">
                <div className="text-center w-64 text-xs">
                  <p>Kutasari, 20 September 2026</p>
                  <p className="font-semibold text-slate-800 mt-1">Kepala SMP Negeri 2 Kutasari,</p>
                  <div className="h-20" />
                  <p className="font-bold underline">{school.kepalaSekolah}</p>
                  <p className="font-mono text-[10px]">NIP. {school.nipKepalaSekolah}</p>
                </div>
              </div>
            </div>
          )}

          {/* FORMAT 2: SURAT CUTI PRINT */}
          {printDocType === 'surat_cuti' && selectedLeaveForPrint && (
            <div className="space-y-4 font-serif text-xs leading-relaxed">
              <div className="text-center my-3">
                <h3 className="text-sm font-bold uppercase underline tracking-wider font-sans">
                  FORMULIR PERMINTAAN DAN PEMBERIAN CUTI
                </h3>
                <p className="text-[11px] font-mono text-slate-600">Nomor: 850 / {selectedLeaveForPrint.id.slice(-4)} / 2026</p>
              </div>

              <div className="border border-slate-300 p-3 space-y-3 font-sans">
                <p className="font-bold uppercase bg-slate-100 p-1">I. DATA PEGAWAI</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <p>Nama: <span className="font-bold">{selectedLeaveForPrint.staffName}</span></p>
                  <p>Unit Kerja: {school.namaSekolah}</p>
                </div>

                <p className="font-bold uppercase bg-slate-100 p-1 mt-3">II. JENIS CUTI YANG DIMINTA</p>
                <p className="font-semibold text-blue-900 ml-2">{selectedLeaveForPrint.jenisCuti}</p>

                <p className="font-bold uppercase bg-slate-100 p-1 mt-3">III. ALASAN CUTI</p>
                <p className="ml-2 italic">{selectedLeaveForPrint.alasan}</p>

                <p className="font-bold uppercase bg-slate-100 p-1 mt-3">IV. LAMANYA CUTI</p>
                <p className="ml-2">
                  Selama <span className="font-bold">{selectedLeaveForPrint.jumlahHari} hari</span>, mulai tanggal {selectedLeaveForPrint.tanggalMulai} s.d {selectedLeaveForPrint.tanggalSelesai}.
                </p>

                <p className="font-bold uppercase bg-slate-100 p-1 mt-3">V. KEPUTUSAN PEJABAT YANG BERWENANG</p>
                <div className="p-2 border rounded bg-slate-50 flex items-center justify-between font-bold text-xs">
                  <span>Status: <span className="text-emerald-700 uppercase">{selectedLeaveForPrint.status}</span></span>
                  <span>Disetujui Oleh: {selectedLeaveForPrint.disetujuiOleh || school.kepalaSekolah}</span>
                </div>
              </div>

              <div className="pt-6 flex justify-between">
                <div className="text-center w-52 font-sans text-[11px]">
                  <p>Pemohon Cuti,</p>
                  <div className="h-16" />
                  <p className="font-bold underline">{selectedLeaveForPrint.staffName}</p>
                </div>
                <div className="text-center w-52 font-sans text-[11px]">
                  <p>Kepala Sekolah,</p>
                  <div className="h-16" />
                  <p className="font-bold underline">{school.kepalaSekolah}</p>
                  <p className="font-mono text-[10px]">NIP. {school.nipKepalaSekolah}</p>
                </div>
              </div>
            </div>
          )}

          {/* FORMAT 3: PENGANTAR KGB */}
          {printDocType === 'pengantar_kgb' && selectedStaffForPrint && (
            <div className="space-y-4 font-serif text-xs leading-relaxed">
              <div className="text-right font-sans text-xs mb-4">
                <p>Kutasari, 20 September 2026</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <table>
                  <tbody>
                    <tr><td className="w-16 font-semibold">Nomor</td><td className="w-3">:</td><td className="font-mono">822.2 / 078 / SMPN2KTS / 2026</td></tr>
                    <tr><td className="font-semibold">Lampiran</td><td>:</td><td>1 (satu) berkas</td></tr>
                    <tr><td className="font-semibold">Perihal</td><td>:</td><td className="font-bold">Usulan Kenaikan Gaji Berkala (KGB)</td></tr>
                  </tbody>
                </table>

                <div className="text-xs">
                  <p>Kepada Yth.</p>
                  <p className="font-bold">Kepala Dinas Pendidikan dan Kebudayaan</p>
                  <p>Kabupaten Purbalingga</p>
                  <p className="text-slate-600">di Purbalingga</p>
                </div>
              </div>

              <p className="text-justify indent-8 mt-4">
                Dengan hormat kami sampaikan bahwa Pegawai Negeri Sipil di lingkungan SMP Negeri 2 Kutasari di bawah ini telah memenuhi syarat untuk memperoleh Kenaikan Gaji Berkala (KGB):
              </p>

              <table className="w-full text-xs ml-4 my-2">
                <tbody>
                  <tr><td className="w-44 py-1 font-semibold">1. Nama Pegawai</td><td className="w-3">:</td><td className="font-bold uppercase">{selectedStaffForPrint.nama}</td></tr>
                  <tr><td className="py-1 font-semibold">2. NIP / NUPTK</td><td>:</td><td className="font-mono">{selectedStaffForPrint.nipNuPtk}</td></tr>
                  <tr><td className="py-1 font-semibold">3. Pangkat / Golongan</td><td>:</td><td>{selectedStaffForPrint.pangkatGolongan}</td></tr>
                  <tr><td className="py-1 font-semibold">4. Jabatan</td><td>:</td><td>{selectedStaffForPrint.jabatan}</td></tr>
                  <tr><td className="py-1 font-semibold">5. TMT KGB Baru</td><td>:</td><td className="font-bold text-emerald-800 font-mono">{selectedStaffForPrint.tmtKgbBerikutnya}</td></tr>
                </tbody>
              </table>

              <p className="text-justify indent-8">
                Sebagai bahan pertimbangan, bersama ini kami lampirkan fotokopi SK Pangkat Terakhir, SK KGB Terakhir, dan Penilaian Kinerja Guru (PKG) yang bersangkutan.
              </p>

              <div className="pt-8 flex justify-end">
                <div className="text-center w-64 text-xs font-sans">
                  <p>Kepala SMP Negeri 2 Kutasari,</p>
                  <div className="h-20" />
                  <p className="font-bold underline">{school.kepalaSekolah}</p>
                  <p className="font-mono text-[10px]">NIP. {school.nipKepalaSekolah}</p>
                </div>
              </div>
            </div>
          )}
        </PrintModal>
      )}
    </div>
  );
};
