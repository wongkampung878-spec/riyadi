import React, { useState, useMemo } from 'react';
import { 
  ArrowLeftRight, 
  UserPlus, 
  UserMinus, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Building, 
  Calendar, 
  Check, 
  Trash2, 
  Eye, 
  Plus, 
  ChevronRight,
  ShieldCheck,
  AlertOctagon,
  FileSpreadsheet,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useApp } from '../../context/AppContext';
import { getDynamicRombels } from '../../data/initialData';
import { StudentMutation, Student } from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import { PrintModal } from '../common/PrintModal';

export const MutasiModule: React.FC = () => {
  const { 
    school, 
    currentUser, 
    students, 
    mutations, 
    loans,
    addMutationMasuk, 
    addMutationKeluar, 
    deleteMutation 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'buku_mutasi' | 'form_masuk' | 'form_keluar'>('buku_mutasi');
  const [filterJenis, setFilterJenis] = useState<'semua' | 'masuk' | 'keluar'>('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTahun, setSelectedTahun] = useState(school.tahunAjaranAktif);

  // Detail & Print states
  const [viewingMutation, setViewingMutation] = useState<StudentMutation | null>(null);
  const [printingMutation, setPrintingMutation] = useState<StudentMutation | null>(null);
  const [printDocType, setPrintDocType] = useState<'skp_keluar' | 'sk_diterima' | 'buku_mutasi' | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Dynamic Rombels for SMPN 2 Kutasari (7A-7F, 8A-8G, 9A-9F + imported)
  const allRombels = useMemo(() => getDynamicRombels(students), [students]);

  // ==========================================
  // FORM MUTASI MASUK (4 WIZARD STEPS)
  // ==========================================
  const [stepMasuk, setStepMasuk] = useState<1 | 2 | 3 | 4>(1);
  const [formMasuk, setFormMasuk] = useState({
    // Step 1: Data Pribadi
    nisn: '',
    nis: `26${Math.floor(100 + Math.random() * 900)}`,
    namaSiswa: '',
    nik: '',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2012-05-15',
    jenisKelamin: 'L' as 'L' | 'P',
    agama: 'Islam' as 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu',
    alamat: '',
    noHpOrtu: '',
    namaAyah: '',
    pekerjaanAyah: 'Wiraswasta',
    namaIbu: '',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    namaWali: '',

    // Step 2: Asal Sekolah
    namaSekolahAsal: '',
    npsnSekolahAsal: '',
    alamatSekolahAsal: '',
    kelasAsal: '7',
    nomorSuratPindah: '',
    tanggalSuratPindah: '2026-09-15',

    // Step 3: Penempatan
    kelasTujuan: '7',
    rombelTujuan: '7B',
    tanggalMutasi: '2026-09-21',
    alasan: 'Mengikuti kepindahan domisili tugas dinas orang tua ke Purbalingga',

    // Step 4: Berkas Checklist
    berkasSuratPindah: true,
    berkasRekomendasiDinas: true,
    berkasRapor: true,
    berkasAktaKelahiran: true,
    berkasKartuKeluarga: true,
    berkasKelakuanBaik: true
  });

  // Capacity helper
  const getRombelCapacity = (rombel: string) => {
    const count = students.filter(s => s.rombel === rombel && s.status === 'aktif').length;
    const max = 32;
    return { count, sisa: Math.max(0, max - count) };
  };

  const handleSaveMutasiMasuk = () => {
    if (!formMasuk.namaSiswa.trim() || !formMasuk.nisn.trim()) {
      alert('Nama Siswa dan NISN wajib diisi.');
      setStepMasuk(1);
      return;
    }

    if (formMasuk.nisn.length < 10) {
      alert('NISN harus 10 digit.');
      setStepMasuk(1);
      return;
    }

    const res = addMutationMasuk({
      jenis: 'masuk',
      tanggalMutasi: formMasuk.tanggalMutasi,
      tanggalEfektif: formMasuk.tanggalMutasi,
      petugasPencatat: currentUser.name,
      namaSiswa: formMasuk.namaSiswa,
      nisn: formMasuk.nisn,
      nis: formMasuk.nis,
      nik: formMasuk.nik,
      tempatLahir: formMasuk.tempatLahir,
      tanggalLahir: formMasuk.tanggalLahir,
      jenisKelamin: formMasuk.jenisKelamin,
      agama: formMasuk.agama,
      alamat: formMasuk.alamat,
      noHpOrtu: formMasuk.noHpOrtu,
      namaAyah: formMasuk.namaAyah,
      pekerjaanAyah: formMasuk.pekerjaanAyah,
      namaIbu: formMasuk.namaIbu,
      pekerjaanIbu: formMasuk.pekerjaanIbu,
      namaWali: formMasuk.namaWali,
      kelasTujuan: formMasuk.kelasTujuan,
      rombelTujuan: formMasuk.rombelTujuan,
      alasan: formMasuk.alasan,
      tahunAjaran: school.tahunAjaranAktif,
      semester: school.semesterAktif as any,
      asalSekolah: {
        namaSekolah: formMasuk.namaSekolahAsal,
        npsn: formMasuk.npsnSekolahAsal,
        alamatSekolah: formMasuk.alamatSekolahAsal,
        kelasAsal: formMasuk.kelasAsal,
        nomorSuratPindah: formMasuk.nomorSuratPindah,
        tanggalSuratPindah: formMasuk.tanggalSuratPindah
      },
      kelengkapanBerkas: {
        suratPindahSekolahAsal: formMasuk.berkasSuratPindah,
        suratRekomendasiDinas: formMasuk.berkasRekomendasiDinas,
        fotokopiRapor: formMasuk.berkasRapor,
        fotokopiAktaKelahiran: formMasuk.berkasAktaKelahiran,
        fotokopiKartuKeluarga: formMasuk.berkasKartuKeluarga,
        suratBebasMasalah: formMasuk.berkasKelakuanBaik
      }
    });

    alert(res.message);
    if (res.mutation) {
      setPrintingMutation(res.mutation);
      setPrintDocType('sk_diterima');
      setIsPrintModalOpen(true);
    }
    setActiveTab('buku_mutasi');
  };

  // ==========================================
  // FORM MUTASI KELUAR (3 WIZARD STEPS)
  // ==========================================
  const [selectedStudentKeluarId, setSelectedStudentKeluarId] = useState<string>('');
  const [formKeluar, setFormKeluar] = useState({
    tanggalMutasi: '2026-09-21',
    namaSekolahTujuan: '',
    npsnSekolahTujuan: '',
    kabupatenSekolahTujuan: 'Banyumas',
    provinsiSekolahTujuan: 'Jawa Tengah',
    alasan: 'Mengikuti orang tua pindah tempat kerja',
    bebasAdministrasi: true,
    catatanTunggakan: 'Lunas seluruh administrasi',
    raporSelesai: true
  });

  const selectedStudentKeluar = useMemo(() => {
    return students.find(s => s.id === selectedStudentKeluarId);
  }, [students, selectedStudentKeluarId]);

  // Check active loans for chosen student
  const activeStudentLoan = useMemo(() => {
    if (!selectedStudentKeluar) return null;
    return loans.find(l => 
      (l.status === 'Dipinjam' || l.status === 'Terlambat') &&
      (l.peminjamId === selectedStudentKeluar.id || l.namaPeminjam.toLowerCase().includes(selectedStudentKeluar.nama.toLowerCase()))
    );
  }, [loans, selectedStudentKeluar]);

  const handleSaveMutasiKeluar = () => {
    if (!selectedStudentKeluar) {
      alert('Pilih siswa yang akan diproses mutasi keluar.');
      return;
    }

    if (!formKeluar.namaSekolahTujuan.trim()) {
      alert('Nama Sekolah Tujuan wajib diisi.');
      return;
    }

    if (activeStudentLoan) {
      const confirmForce = confirm(
        `PERHATIAN: Siswa ${selectedStudentKeluar.nama} masih tercatat meminjam barang inventaris/sarpras (${activeStudentLoan.nomorPinjam} - ${activeStudentLoan.items.map(i => i.namaBarang).join(', ')}).\n\nTetap lanjutkan mutasi keluar?`
      );
      if (!confirmForce) return;
    }

    const res = addMutationKeluar({
      jenis: 'keluar',
      tanggalMutasi: formKeluar.tanggalMutasi,
      tanggalEfektif: formKeluar.tanggalMutasi,
      petugasPencatat: currentUser.name,
      studentId: selectedStudentKeluar.id,
      namaSiswa: selectedStudentKeluar.nama,
      nisn: selectedStudentKeluar.nisn,
      nis: selectedStudentKeluar.nis,
      nik: selectedStudentKeluar.nik,
      tempatLahir: selectedStudentKeluar.tempatLahir,
      tanggalLahir: selectedStudentKeluar.tanggalLahir,
      jenisKelamin: selectedStudentKeluar.jenisKelamin,
      agama: selectedStudentKeluar.agama,
      alamat: selectedStudentKeluar.alamat,
      noHpOrtu: selectedStudentKeluar.noHpOrtu,
      namaAyah: selectedStudentKeluar.namaAyah,
      pekerjaanAyah: selectedStudentKeluar.pekerjaanAyah,
      namaIbu: selectedStudentKeluar.namaIbu,
      pekerjaanIbu: selectedStudentKeluar.pekerjaanIbu,
      namaWali: selectedStudentKeluar.namaWali,
      kelasTujuan: selectedStudentKeluar.kelas,
      rombelTujuan: selectedStudentKeluar.rombel,
      alasan: formKeluar.alasan,
      tahunAjaran: school.tahunAjaranAktif,
      semester: school.semesterAktif as any,
      tujuanSekolah: {
        namaSekolah: formKeluar.namaSekolahTujuan,
        npsn: formKeluar.npsnSekolahTujuan,
        kabupatenKota: formKeluar.kabupatenSekolahTujuan,
        provinsi: formKeluar.provinsiSekolahTujuan
      },
      keteranganAdministrasi: {
        statusLunas: formKeluar.bebasAdministrasi,
        catatanTunggakan: formKeluar.catatanTunggakan,
        pinjamanBarangTerselesaikan: !activeStudentLoan,
        catatanBarang: activeStudentLoan 
          ? `Terdapat pinjaman aktif (${activeStudentLoan.nomorPinjam})` 
          : 'Bebas pinjaman inventaris sekolah'
      }
    });

    alert(res.message);
    if (res.mutation) {
      setPrintingMutation(res.mutation);
      setPrintDocType('skp_keluar');
      setIsPrintModalOpen(true);
    }
    setActiveTab('buku_mutasi');
  };

  // Filtered Mutations
  const filteredMutations = useMemo(() => {
    return mutations.filter(m => {
      const matchSearch = 
        m.namaSiswa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.nisn.includes(searchTerm) ||
        m.nomorMutasi.toLowerCase().includes(searchTerm.toLowerCase());

      const matchJenis = filterJenis !== 'semua' ? m.jenis === filterJenis : true;
      const matchTahun = selectedTahun ? m.tahunAjaran === selectedTahun : true;

      return matchSearch && matchJenis && matchTahun;
    });
  }, [mutations, searchTerm, filterJenis, selectedTahun]);

  // Export Mutations to Excel
  const handleExportExcel = () => {
    const exportData = filteredMutations.map((m, idx) => ({
      'No': idx + 1,
      'No. Registrasi Mutasi': m.nomorMutasi,
      'Tanggal Mutasi': m.tanggalMutasi,
      'Jenis Mutasi': m.jenis.toUpperCase(),
      'Nama Siswa': m.namaSiswa,
      'NISN': m.nisn,
      'NIS': m.nis,
      'L/P': m.jenisKelamin,
      'Kelas/Rombel': m.rombelTujuan,
      'Dari/Ke Sekolah': m.jenis === 'masuk' ? m.asalSekolah?.namaSekolah : m.tujuanSekolah?.namaSekolah,
      'Alasan Mutasi': m.alasan,
      'Tahun Ajaran': m.tahunAjaran
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Buku Mutasi Siswa');
    XLSX.writeFile(workbook, `Buku_Mutasi_Siswa_SMPN2_Kutasari_${selectedTahun.replace('/', '-')}.xlsx`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-700/20">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Buku Mutasi Siswa & Registrasi Pindah Sekolah
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Terhubung Buku Induk
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola mutasi siswa masuk dan keluar, penerbitan Surat Keterangan Pindah (SKP), serta kliring administrasi sarpras dan buku.
            </p>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('buku_mutasi')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'buku_mutasi'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            Buku Mutasi ({mutations.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('form_masuk');
              setStepMasuk(1);
            }}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'form_masuk'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Input Mutasi Masuk
          </button>
          <button
            onClick={() => setActiveTab('form_keluar')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'form_keluar'
                ? 'bg-rose-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <UserMinus className="w-4 h-4" />
            Input Mutasi Keluar
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* TAB 1: BUKU MUTASI SISWA (DAFTAR UTAMA)   */}
      {/* ========================================== */}
      {activeTab === 'buku_mutasi' && (
        <div className="space-y-4">
          {/* Filter & Action Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari siswa, NISN, no. mutasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Filter Jenis */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setFilterJenis('semua')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                    filterJenis === 'semua' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Semua ({mutations.length})
                </button>
                <button
                  onClick={() => setFilterJenis('masuk')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                    filterJenis === 'masuk' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700'
                  }`}
                >
                  Masuk ({mutations.filter(m => m.jenis === 'masuk').length})
                </button>
                <button
                  onClick={() => setFilterJenis('keluar')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                    filterJenis === 'keluar' ? 'bg-rose-600 text-white shadow-xs' : 'text-rose-700'
                  }`}
                >
                  Keluar ({mutations.filter(m => m.jenis === 'keluar').length})
                </button>
              </div>

              {/* Filter Tahun */}
              <select
                value={selectedTahun}
                onChange={(e) => setSelectedTahun(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
              >
                <option value="2026/2027">T.A. 2026/2027</option>
                <option value="2025/2026">T.A. 2025/2026</option>
                <option value="2024/2025">T.A. 2024/2025</option>
              </select>
            </div>

            {/* Right Buttons: Export Excel & Cetak Buku */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="Ekspor Buku Mutasi ke Excel"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Ekspor Excel
              </button>

              <button
                onClick={() => {
                  setPrintDocType('buku_mutasi');
                  setIsPrintModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="Cetak Buku Mutasi Formal"
              >
                <Printer className="w-4 h-4" />
                Cetak Buku Mutasi
              </button>
            </div>
          </div>

          {/* Tabel Buku Mutasi */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                    <th className="py-3 px-3">No</th>
                    <th className="py-3 px-3">No. Registrasi & Tgl</th>
                    <th className="py-3 px-3">Jenis</th>
                    <th className="py-3 px-3">Nama Siswa & NISN</th>
                    <th className="py-3 px-3 text-center">Kelas/Rombel</th>
                    <th className="py-3 px-3">Dari / Ke Sekolah</th>
                    <th className="py-3 px-3">Alasan Pindah</th>
                    <th className="py-3 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredMutations.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-blue-900 block">{m.nomorMutasi}</span>
                        <span className="text-[11px] text-slate-500">{m.tanggalMutasi}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          m.jenis === 'masuk' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {m.jenis === 'masuk' ? 'Pindah Masuk' : 'Pindah Keluar'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{m.namaSiswa}</span>
                        <span className="text-[11px] text-slate-500 font-mono">NISN: {m.nisn} &bull; NIS: {m.nis}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {m.rombelTujuan}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {m.jenis === 'masuk' ? (
                          <span>Dari: <strong>{m.asalSekolah?.namaSekolah || '-'}</strong></span>
                        ) : (
                          <span>Ke: <strong>{m.tujuanSekolah?.namaSekolah || '-'}</strong> ({m.tujuanSekolah?.kabupatenKota})</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[180px] truncate" title={m.alasan}>
                        {m.alasan}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setViewingMutation(m)}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                            title="Lihat Detail Mutasi"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setPrintingMutation(m);
                              setPrintDocType(m.jenis === 'masuk' ? 'sk_diterima' : 'skp_keluar');
                              setIsPrintModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                            title={m.jenis === 'masuk' ? 'Cetak Surat Keterangan Diterima' : 'Cetak Surat Keterangan Pindah (SKP)'}
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus arsip mutasi ${m.namaSiswa}?`)) {
                                deleteMutation(m.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                            title="Hapus Arsip"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredMutations.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-400">
                        Belum ada catatan mutasi yang cocok dengan kriteria filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: FORM MUTASI MASUK (4 LANGKAH)      */}
      {/* ========================================== */}
      {activeTab === 'form_masuk' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header Wizard Steps */}
          <div className="px-6 py-4 bg-emerald-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserPlus className="w-6 h-6 text-emerald-300" />
              <div>
                <h3 className="font-bold text-sm">Registrasi Siswa Pindahan Masuk (Mutasi Masuk)</h3>
                <p className="text-xs text-emerald-200">Data otomatis dicatat ke Buku Induk Siswa dengan status Aktif</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('buku_mutasi')}
              className="text-xs text-emerald-200 hover:text-white underline cursor-pointer"
            >
              Kembali ke Buku Mutasi
            </button>
          </div>

          {/* Stepper Navigation */}
          <div className="px-6 py-3 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between text-xs">
            <button
              onClick={() => setStepMasuk(1)}
              className={`font-bold flex items-center gap-1.5 cursor-pointer ${
                stepMasuk === 1 ? 'text-emerald-800' : 'text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                stepMasuk === 1 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>1</span>
              Data Pribadi Siswa
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <button
              onClick={() => setStepMasuk(2)}
              className={`font-bold flex items-center gap-1.5 cursor-pointer ${
                stepMasuk === 2 ? 'text-emerald-800' : 'text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                stepMasuk === 2 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>2</span>
              Asal Sekolah
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <button
              onClick={() => setStepMasuk(3)}
              className={`font-bold flex items-center gap-1.5 cursor-pointer ${
                stepMasuk === 3 ? 'text-emerald-800' : 'text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                stepMasuk === 3 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>3</span>
              Penempatan Rombel
            </button>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <button
              onClick={() => setStepMasuk(4)}
              className={`font-bold flex items-center gap-1.5 cursor-pointer ${
                stepMasuk === 4 ? 'text-emerald-800' : 'text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                stepMasuk === 4 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>4</span>
              Kelengkapan Berkas
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* STEP 1: DATA PRIBADI */}
            {stepMasuk === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">NISN (10 Digit): *</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="Contoh: 0123456789"
                    value={formMasuk.nisn}
                    onChange={(e) => setFormMasuk({ ...formMasuk, nisn: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIS Lokal Baru (Otomatis/Ubah):</label>
                  <input
                    type="text"
                    value={formMasuk.nis}
                    onChange={(e) => setFormMasuk({ ...formMasuk, nis: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIK Siswa (16 Digit):</label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="3303..."
                    value={formMasuk.nik}
                    onChange={(e) => setFormMasuk({ ...formMasuk, nik: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa: *</label>
                  <input
                    type="text"
                    placeholder="Nama lengkap sesuai akta kelahiran..."
                    value={formMasuk.namaSiswa}
                    onChange={(e) => setFormMasuk({ ...formMasuk, namaSiswa: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-bold focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin:</label>
                  <select
                    value={formMasuk.jenisKelamin}
                    onChange={(e) => setFormMasuk({ ...formMasuk, jenisKelamin: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-600 font-semibold"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tempat Lahir:</label>
                  <input
                    type="text"
                    value={formMasuk.tempatLahir}
                    onChange={(e) => setFormMasuk({ ...formMasuk, tempatLahir: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Lahir:</label>
                  <input
                    type="date"
                    value={formMasuk.tanggalLahir}
                    onChange={(e) => setFormMasuk({ ...formMasuk, tanggalLahir: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Agama:</label>
                  <select
                    value={formMasuk.agama}
                    onChange={(e) => setFormMasuk({ ...formMasuk, agama: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Alamat Tempat Tinggal di Kutasari:</label>
                  <input
                    type="text"
                    placeholder="Desa, RT/RW, Kecamatan..."
                    value={formMasuk.alamat}
                    onChange={(e) => setFormMasuk({ ...formMasuk, alamat: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. HP Orang Tua/Wali (WhatsApp):</label>
                  <input
                    type="text"
                    placeholder="08..."
                    value={formMasuk.noHpOrtu}
                    onChange={(e) => setFormMasuk({ ...formMasuk, noHpOrtu: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Ayah:</label>
                  <input
                    type="text"
                    value={formMasuk.namaAyah}
                    onChange={(e) => setFormMasuk({ ...formMasuk, namaAyah: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Ibu:</label>
                  <input
                    type="text"
                    value={formMasuk.namaIbu}
                    onChange={(e) => setFormMasuk({ ...formMasuk, namaIbu: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pekerjaan Ayah/Ibu:</label>
                  <input
                    type="text"
                    value={formMasuk.pekerjaanAyah}
                    onChange={(e) => setFormMasuk({ ...formMasuk, pekerjaanAyah: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: ASAL SEKOLAH */}
            {stepMasuk === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nama Sekolah Asal: *</label>
                  <input
                    type="text"
                    placeholder="Contoh: SMP Negeri 1 Bobotsari / MTs Negeri 2 Purbalingga"
                    value={formMasuk.namaSekolahAsal}
                    onChange={(e) => setFormMasuk({ ...formMasuk, namaSekolahAsal: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-bold focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NPSN Sekolah Asal:</label>
                  <input
                    type="text"
                    placeholder="8 Digit NPSN..."
                    value={formMasuk.npsnSekolahAsal}
                    onChange={(e) => setFormMasuk({ ...formMasuk, npsnSekolahAsal: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas Asal di Sekolah Sebelumnya:</label>
                  <select
                    value={formMasuk.kelasAsal}
                    onChange={(e) => setFormMasuk({ ...formMasuk, kelasAsal: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-semibold"
                  >
                    <option value="7">Kelas VII (Tujuh)</option>
                    <option value="8">Kelas VIII (Delapan)</option>
                    <option value="9">Kelas IX (Sembilan)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Alamat Lengkap Sekolah Asal (Kabupaten/Provinsi):</label>
                  <input
                    type="text"
                    placeholder="Misal: Jl. Raya Bobotsari No. 12, Kab. Purbalingga, Jawa Tengah"
                    value={formMasuk.alamatSekolahAsal}
                    onChange={(e) => setFormMasuk({ ...formMasuk, alamatSekolahAsal: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Surat Pindah dari Sekolah Asal:</label>
                  <input
                    type="text"
                    placeholder="421.3/..."
                    value={formMasuk.nomorSuratPindah}
                    onChange={(e) => setFormMasuk({ ...formMasuk, nomorSuratPindah: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Surat Pindah Sekolah Asal:</label>
                  <input
                    type="date"
                    value={formMasuk.tanggalSuratPindah}
                    onChange={(e) => setFormMasuk({ ...formMasuk, tanggalSuratPindah: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: PENEMPATAN ROMBEL */}
            {stepMasuk === 3 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tingkat Kelas Diterima:</label>
                    <select
                      value={formMasuk.kelasTujuan}
                      onChange={(e) => {
                        const k = e.target.value;
                        setFormMasuk({ ...formMasuk, kelasTujuan: k, rombelTujuan: `${k}A` });
                      }}
                      className="w-full border border-slate-300 rounded-lg p-2 font-bold"
                    >
                      <option value="7">Kelas 7</option>
                      <option value="8">Kelas 8</option>
                      <option value="9">Kelas 9</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Penempatan Rombel:</label>
                    <select
                      value={formMasuk.rombelTujuan}
                      onChange={(e) => setFormMasuk({ ...formMasuk, rombelTujuan: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 font-bold text-emerald-800"
                    >
                      {allRombels.filter(r => r.startsWith(formMasuk.kelasTujuan)).map(r => {
                        const { count, sisa } = getRombelCapacity(r);
                        return (
                          <option key={r} value={r}>
                            Rombel {r} &bull; Terisi {count}/32 (Sisa {sisa} kursi)
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tanggal Mulai Diterima:</label>
                    <input
                      type="date"
                      value={formMasuk.tanggalMutasi}
                      onChange={(e) => setFormMasuk({ ...formMasuk, tanggalMutasi: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alasan Kepindahan:</label>
                  <textarea
                    rows={2}
                    value={formMasuk.alasan}
                    onChange={(e) => setFormMasuk({ ...formMasuk, alasan: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2.5"
                  />
                </div>

                {/* Sisa Kursi Info Box */}
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Building className="w-5 h-5 text-blue-700" />
                    <div>
                      <span className="font-bold text-blue-900 block">Kapasitas Kelas {formMasuk.rombelTujuan}</span>
                      <span className="text-slate-600">
                        Saat ini terisi {getRombelCapacity(formMasuk.rombelTujuan).count} siswa aktif dari pagu maksimal 32 siswa.
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-700 text-white font-bold rounded-lg text-xs">
                    Sisa {getRombelCapacity(formMasuk.rombelTujuan).sisa} Kursi
                  </span>
                </div>
              </div>
            )}

            {/* STEP 4: KELENGKAPAN BERKAS */}
            {stepMasuk === 4 && (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                    Verifikasi Dokumen Fisik / Persyaratan Administrasi:
                  </h4>

                  <label className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formMasuk.berkasSuratPindah}
                      onChange={(e) => setFormMasuk({ ...formMasuk, berkasSuratPindah: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-semibold text-slate-800">Surat Keterangan Pindah dari Sekolah Asal (Asli)</span>
                  </label>

                  <label className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formMasuk.berkasRekomendasiDinas}
                      onChange={(e) => setFormMasuk({ ...formMasuk, berkasRekomendasiDinas: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-semibold text-slate-800">Surat Rekomendasi Dinas Pendidikan (jika dari luar kabupaten/provinsi)</span>
                  </label>

                  <label className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formMasuk.berkasRapor}
                      onChange={(e) => setFormMasuk({ ...formMasuk, berkasRapor: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-semibold text-slate-800">Buku Rapor Lengkap & Nilai Semester Terakhir</span>
                  </label>

                  <label className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formMasuk.berkasAktaKelahiran}
                      onChange={(e) => setFormMasuk({ ...formMasuk, berkasAktaKelahiran: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-semibold text-slate-800">Fotokopi Akta Kelahiran Siswa</span>
                  </label>

                  <label className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formMasuk.berkasKartuKeluarga}
                      onChange={(e) => setFormMasuk({ ...formMasuk, berkasKartuKeluarga: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-semibold text-slate-800">Fotokopi Kartu Keluarga (KK)</span>
                  </label>

                  <label className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formMasuk.berkasKelakuanBaik}
                      onChange={(e) => setFormMasuk({ ...formMasuk, berkasKelakuanBaik: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-semibold text-slate-800">Surat Keterangan Berkelakuan Baik / Bebas Masalah dari Sekolah Asal</span>
                  </label>
                </div>
              </div>
            )}

            {/* Stepper Bottom Controls */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                {stepMasuk > 1 && (
                  <button
                    type="button"
                    onClick={() => setStepMasuk((stepMasuk - 1) as any)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                  >
                    &larr; Langkah Sebelumnya
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {stepMasuk < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStepMasuk((stepMasuk + 1) as any)}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    Lanjut ke Langkah {stepMasuk + 1} &rarr;
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveMutasiMasuk}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Simpan & Masukkan ke Buku Induk Siswa
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: FORM MUTASI KELUAR (PINDAH KELUAR) */}
      {/* ========================================== */}
      {activeTab === 'form_keluar' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-rose-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserMinus className="w-6 h-6 text-rose-300" />
              <div>
                <h3 className="font-bold text-sm">Registrasi Siswa Pindah Keluar (Mutasi Keluar)</h3>
                <p className="text-xs text-rose-200">Siswa akan dinonaktifkan dari rombel dan diterbitkan Surat Keterangan Pindah (SKP)</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('buku_mutasi')}
              className="text-xs text-rose-200 hover:text-white underline cursor-pointer"
            >
              Kembali ke Buku Mutasi
            </button>
          </div>

          <div className="p-6 space-y-5 text-xs">
            {/* 1. Pilih Siswa dari Buku Induk */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                1. Pilih Siswa Aktif dari Buku Induk:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cari / Pilih Siswa: *</label>
                  <select
                    value={selectedStudentKeluarId}
                    onChange={(e) => setSelectedStudentKeluarId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-bold focus:ring-2 focus:ring-rose-600 bg-white"
                  >
                    <option value="">-- Pilih Siswa Aktif --</option>
                    {students.filter(s => s.status === 'aktif').map(s => (
                      <option key={s.id} value={s.id}>
                        Kelas {s.rombel} &bull; {s.nama} (NISN: {s.nisn})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedStudentKeluar && (
                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                    <span className="font-bold text-slate-900 block text-sm">{selectedStudentKeluar.nama}</span>
                    <p className="text-slate-500">
                      Rombel: <strong>{selectedStudentKeluar.rombel}</strong> &bull; NISN: <span className="font-mono">{selectedStudentKeluar.nisn}</span> &bull; NIS: <span className="font-mono">{selectedStudentKeluar.nis}</span>
                    </p>
                    <p className="text-slate-500">
                      Alamat: {selectedStudentKeluar.alamat} &bull; Ortu: {selectedStudentKeluar.namaAyah}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Sekolah Tujuan & Alasan */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                2. Data Sekolah Tujuan & Tanggal Mutasi:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Nama Sekolah Tujuan: *</label>
                  <input
                    type="text"
                    placeholder="Contoh: SMP Negeri 1 Purwokerto / SMP Negeri 3 Cilacap"
                    value={formKeluar.namaSekolahTujuan}
                    onChange={(e) => setFormKeluar({ ...formKeluar, namaSekolahTujuan: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-bold focus:ring-2 focus:ring-rose-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NPSN Sekolah Tujuan (jika ada):</label>
                  <input
                    type="text"
                    placeholder="8 digit..."
                    value={formKeluar.npsnSekolahTujuan}
                    onChange={(e) => setFormKeluar({ ...formKeluar, npsnSekolahTujuan: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kabupaten/Kota Sekolah Tujuan:</label>
                  <input
                    type="text"
                    value={formKeluar.kabupatenSekolahTujuan}
                    onChange={(e) => setFormKeluar({ ...formKeluar, kabupatenSekolahTujuan: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Provinsi:</label>
                  <input
                    type="text"
                    value={formKeluar.provinsiSekolahTujuan}
                    onChange={(e) => setFormKeluar({ ...formKeluar, provinsiSekolahTujuan: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Mutasi Keluar: *</label>
                  <input
                    type="date"
                    value={formKeluar.tanggalMutasi}
                    onChange={(e) => setFormKeluar({ ...formKeluar, tanggalMutasi: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-semibold bg-white"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">Alasan Pindah Sekolah:</label>
                  <input
                    type="text"
                    placeholder="Misal: Mengikuti orang tua pindah domisili kerja / Melanjutkan pendidikan di pondok pesantren"
                    value={formKeluar.alasan}
                    onChange={(e) => setFormKeluar({ ...formKeluar, alasan: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 3. Kliring Sarpras & Administrasi */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
                3. Kliring Administrasi, Perpustakaan & Pinjaman Alat Sarpras:
              </h4>

              {/* Loan Alert if student has unreturned equipment */}
              {activeStudentLoan ? (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-lg flex items-start gap-3 text-rose-900">
                  <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">PERINGATAN: Siswa Memiliki Pinjaman Barang Belum Kembali!</span>
                    <p className="text-xs text-rose-800 mt-0.5">
                      Nomor Pinjam: <strong>{activeStudentLoan.nomorPinjam}</strong> &bull; Barang: <strong>{activeStudentLoan.items.map(i => i.namaBarang).join(', ')}</strong> &bull; Keperluan: {activeStudentLoan.keperluan}.
                    </p>
                    <p className="text-[11px] text-rose-700 italic mt-1">
                      Harap selesaikan pengembalian barang di Modul Buku Pinjam Alat sebelum menyerahkan Surat Keterangan Pindah fisik.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2.5 text-emerald-900">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold">Bebas Pinjaman Sarpras: Siswa tidak memiliki tanggungan peminjaman alat sarana prasarana.</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2.5 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formKeluar.bebasAdministrasi}
                    onChange={(e) => setFormKeluar({ ...formKeluar, bebasAdministrasi: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Bebas tanggungan administrasi & buku paket perpustakaan</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formKeluar.raporSelesai}
                    onChange={(e) => setFormKeluar({ ...formKeluar, raporSelesai: e.target.checked })}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">Buku rapor siswa sudah dilengkapi & ditandatangani wali kelas</span>
                </label>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('buku_mutasi')}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveMutasiKeluar}
                className="px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                Proses Mutasi Keluar & Terbitkan Surat Pindah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL DETAIL MUTASI                        */}
      {/* ========================================== */}
      {viewingMutation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Arsip Dokumen Mutasi Siswa
                </h3>
                <p className="text-xs text-slate-500 font-mono">{viewingMutation.nomorMutasi}</p>
              </div>
              <button 
                onClick={() => setViewingMutation(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block">Nama Siswa:</span>
                  <span className="font-bold text-slate-900 text-sm">{viewingMutation.namaSiswa}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">NISN / NIS:</span>
                  <span className="font-mono font-bold">{viewingMutation.nisn} / {viewingMutation.nis}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Jenis Mutasi:</span>
                  <span className="font-bold uppercase text-blue-900">{viewingMutation.jenis}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tanggal Mutasi:</span>
                  <span className="font-bold">{viewingMutation.tanggalMutasi}</span>
                </div>
              </div>

              {viewingMutation.jenis === 'masuk' ? (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-950 block">Sekolah Asal:</span>
                  <p className="text-emerald-900 font-medium">{viewingMutation.asalSekolah?.namaSekolah}</p>
                  <p className="text-emerald-800 text-[11px]">No. Surat Asal: {viewingMutation.asalSekolah?.nomorSuratPindah || '-'}</p>
                  <p className="text-emerald-800 text-[11px]">Diterima di Rombel: <strong>{viewingMutation.rombelTujuan}</strong></p>
                </div>
              ) : (
                <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 space-y-1">
                  <span className="font-bold text-rose-950 block">Sekolah Tujuan:</span>
                  <p className="text-rose-900 font-medium">{viewingMutation.tujuanSekolah?.namaSekolah} ({viewingMutation.tujuanSekolah?.kabupatenKota})</p>
                  <p className="text-rose-800 text-[11px]">Status Sarpras: {viewingMutation.keteranganAdministrasi?.catatanBarang}</p>
                </div>
              )}

              <div>
                <span className="font-bold text-slate-700 block mb-0.5">Alasan Kepindahan:</span>
                <p className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-700">{viewingMutation.alasan}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setPrintingMutation(viewingMutation);
                  setPrintDocType(viewingMutation.jenis === 'masuk' ? 'sk_diterima' : 'skp_keluar');
                  setIsPrintModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Dokumen Resmi
              </button>
              <button
                onClick={() => setViewingMutation(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* PRINT MODAL: SURAT KETERANGAN PINDAH (SKP) */}
      {/* ========================================== */}
      {printingMutation && printDocType === 'skp_keluar' && (
        <PrintModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          title={`Surat Keterangan Pindah - ${printingMutation.namaSiswa}`}
          documentNumber={`SKP/${printingMutation.nisn}`}
        >
          <div className="text-black text-xs font-serif leading-relaxed">
            {/* Kop Resmi */}
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <div className="w-16 h-16 flex items-center justify-center shrink-0">
                <SchoolLogo className="w-16 h-16" />
              </div>
              <div className="text-center flex-1 px-4">
                <p className="text-xs uppercase tracking-wider font-bold">PEMERINTAH KABUPATEN PURBALINGGA</p>
                <p className="text-xs uppercase tracking-wider font-bold">DINAS PENDIDIKAN DAN KEBUDAYAAN</p>
                <h1 className="text-base uppercase tracking-wide font-black text-black">
                  SMP NEGERI 2 KUTASARI
                </h1>
                <p className="text-[10px] italic">
                  {school.alamatLengkap}, Kec. {school.kecamatan}, Kab. {school.kabupaten}, Prov. {school.provinsi} - Kode Pos: {school.kodePos}
                </p>
                <p className="text-[10px]">
                  Telepon: {school.telepon} &bull; Pos-el: {school.email} &bull; Laman: {school.website}
                </p>
              </div>
            </div>

            {/* Judul Surat */}
            <div className="text-center mb-6">
              <h2 className="text-sm font-bold uppercase underline">
                SURAT KETERANGAN PINDAH SEKOLAH
              </h2>
              <p className="text-[11px] font-sans font-medium text-slate-800">
                Nomor: 421.3 / {printingMutation.nomorMutasi.replace('MTS-K/', '')} / 2026
              </p>
            </div>

            <p className="mb-3 indent-8 text-justify">
              Yang bertanda tangan di bawah ini, Kepala SMP Negeri 2 Kutasari, Kabupaten Purbalingga, Provinsi Jawa Tengah, dengan ini menerangkan bahwa:
            </p>

            {/* Identitas Siswa */}
            <table className="w-full text-xs mb-4 ml-4">
              <tbody>
                <tr>
                  <td className="w-48 py-1 font-semibold">1. Nama Siswa</td>
                  <td className="w-4">:</td>
                  <td className="font-bold uppercase">{printingMutation.namaSiswa}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">2. NISN / NIS</td>
                  <td>:</td>
                  <td>{printingMutation.nisn} / {printingMutation.nis}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">3. Tempat, Tanggal Lahir</td>
                  <td>:</td>
                  <td>{printingMutation.tempatLahir}, {printingMutation.tanggalLahir}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">4. Jenis Kelamin / Agama</td>
                  <td>:</td>
                  <td>{printingMutation.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} / {printingMutation.agama}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">5. Tingkat / Rombel Terakhir</td>
                  <td>:</td>
                  <td>Kelas {printingMutation.rombelTujuan}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">6. Nama Orang Tua / Wali</td>
                  <td>:</td>
                  <td>{printingMutation.namaAyah || printingMutation.namaWali}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">7. Pekerjaan Orang Tua</td>
                  <td>:</td>
                  <td>{printingMutation.pekerjaanAyah || 'Wiraswasta'}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">8. Alamat Tempat Tinggal</td>
                  <td>:</td>
                  <td>{printingMutation.alamat}</td>
                </tr>
              </tbody>
            </table>

            <p className="mb-3 indent-8 text-justify">
              Sesuai dengan surat permohonan kepindahan oleh orang tua/wali siswa tertanggal {printingMutation.tanggalMutasi}, bahwa siswa yang bersangkutan telah dinyatakan <strong>PINDAH KELUAR</strong> dari SMP Negeri 2 Kutasari atas kehendak sendiri / mengikuti orang tua dengan tujuan:
            </p>

            <table className="w-full text-xs mb-4 ml-4">
              <tbody>
                <tr>
                  <td className="w-48 py-1 font-semibold">Nama Sekolah Tujuan</td>
                  <td className="w-4">:</td>
                  <td className="font-bold">{printingMutation.tujuanSekolah?.namaSekolah}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">Kabupaten/Kota & Provinsi</td>
                  <td>:</td>
                  <td>{printingMutation.tujuanSekolah?.kabupatenKota}, {printingMutation.tujuanSekolah?.provinsi}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">Alasan Kepindahan</td>
                  <td>:</td>
                  <td>{printingMutation.alasan}</td>
                </tr>
              </tbody>
            </table>

            <p className="mb-6 indent-8 text-justify">
              Bersama surat keterangan ini kami lampirkan Buku Rapor yang bersangkutan. Surat keterangan ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.
            </p>

            {/* Tanda Tangan */}
            <div className="grid grid-cols-2 text-center text-xs mt-10">
              <div>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
              </div>
              <div>
                <p>Kutasari, {printingMutation.tanggalMutasi}</p>
                <p className="font-bold">Kepala SMP Negeri 2 Kutasari</p>
                <div className="h-16" />
                <p className="font-bold underline">{school.kepalaSekolah}</p>
                <p>NIP. {school.nipKepalaSekolah}</p>
              </div>
            </div>
          </div>
        </PrintModal>
      )}

      {/* ========================================== */}
      {/* PRINT MODAL: SURAT KETERANGAN DITERIMA     */}
      {/* ========================================== */}
      {printingMutation && printDocType === 'sk_diterima' && (
        <PrintModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          title={`Surat Keterangan Diterima - ${printingMutation.namaSiswa}`}
          documentNumber={`SK-MASUK/${printingMutation.nisn}`}
        >
          <div className="text-black text-xs font-serif leading-relaxed">
            {/* Kop Resmi */}
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <div className="w-16 h-16 flex items-center justify-center shrink-0">
                <SchoolLogo className="w-16 h-16" />
              </div>
              <div className="text-center flex-1 px-4">
                <p className="text-xs uppercase tracking-wider font-bold">PEMERINTAH KABUPATEN PURBALINGGA</p>
                <p className="text-xs uppercase tracking-wider font-bold">DINAS PENDIDIKAN DAN KEBUDAYAAN</p>
                <h1 className="text-base uppercase tracking-wide font-black text-black">
                  SMP NEGERI 2 KUTASARI
                </h1>
                <p className="text-[10px] italic">
                  {school.alamatLengkap}, Kec. {school.kecamatan}, Kab. {school.kabupaten}, Prov. {school.provinsi} - Kode Pos: {school.kodePos}
                </p>
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-sm font-bold uppercase underline">
                SURAT KETERANGAN PENERIMAAN MUTASI SISWA
              </h2>
              <p className="text-[11px] font-sans font-medium text-slate-800">
                Nomor: 421.3 / {printingMutation.nomorMutasi.replace('MTS-M/', '')} / 2026
              </p>
            </div>

            <p className="mb-3 indent-8 text-justify">
              Kepala SMP Negeri 2 Kutasari menerangkan bahwa siswa tersebut di bawah ini:
            </p>

            <table className="w-full text-xs mb-4 ml-4">
              <tbody>
                <tr>
                  <td className="w-44 py-1 font-semibold">Nama Siswa</td>
                  <td className="w-4">:</td>
                  <td className="font-bold uppercase">{printingMutation.namaSiswa}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">NISN / NIS Baru</td>
                  <td>:</td>
                  <td>{printingMutation.nisn} / {printingMutation.nis}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">Sekolah Asal</td>
                  <td>:</td>
                  <td>{printingMutation.asalSekolah?.namaSekolah}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">Diterima di Kelas/Rombel</td>
                  <td>:</td>
                  <td className="font-bold">Kelas {printingMutation.rombelTujuan}</td>
                </tr>
                <tr>
                  <td className="py-1 font-semibold">Terhitung Mulai Tanggal</td>
                  <td>:</td>
                  <td>{printingMutation.tanggalMutasi}</td>
                </tr>
              </tbody>
            </table>

            <p className="mb-6 indent-8 text-justify">
              Telah resmi diterima sebagai siswa di SMP Negeri 2 Kutasari dan dicatatkan pada Buku Induk Siswa. Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.
            </p>

            <div className="grid grid-cols-2 text-center text-xs mt-10">
              <div />
              <div>
                <p>Kutasari, {printingMutation.tanggalMutasi}</p>
                <p className="font-bold">Kepala SMP Negeri 2 Kutasari</p>
                <div className="h-16" />
                <p className="font-bold underline">{school.kepalaSekolah}</p>
                <p>NIP. {school.nipKepalaSekolah}</p>
              </div>
            </div>
          </div>
        </PrintModal>
      )}

    </div>
  );
};
