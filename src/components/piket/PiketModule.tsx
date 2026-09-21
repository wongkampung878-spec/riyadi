import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Share2, 
  FileSpreadsheet, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Edit3, 
  Eye, 
  UserCheck, 
  ShieldAlert, 
  Send, 
  Download, 
  Check, 
  Copy,
  Building,
  UserX,
  Sparkles,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getDynamicRombels } from '../../data/initialData';
import { 
  PiketReport, 
  PiketClassRecap, 
  PiketAbsentStudent, 
  PiketLateStudent, 
  PiketEarlyLeaveStudent, 
  PiketTeacherAbsence, 
  PiketSchoolGuest,
  DayOfWeek,
  JadwalPiketItem
} from '../../types';
import { SchoolLogo } from '../common/SchoolLogo';
import { PrintModal } from '../common/PrintModal';

export const PiketModule: React.FC = () => {
  const { 
    school, 
    currentUser, 
    staff, 
    students, 
    piketReports, 
    addPiketReport, 
    updatePiketReport, 
    deletePiketReport, 
    verifyPiketReport,
    jadwalPiket,
    updateJadwalPiket
  } = useApp();

  const [activeTab, setActiveTab] = useState<'form' | 'riwayat' | 'jadwal'>('form');

  // Filter states for Riwayat
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterGuru, setFilterGuru] = useState('semua');
  const [filterRombel, setFilterRombel] = useState('semua');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected report for viewing or printing
  const [viewingReport, setViewingReport] = useState<PiketReport | null>(null);
  const [printingReport, setPrintingReport] = useState<PiketReport | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [copiedWaReportId, setCopiedWaReportId] = useState<string | null>(null);

  // Verification modal state
  const [verifyingReport, setVerifyingReport] = useState<PiketReport | null>(null);
  const [kepsekCatatan, setKepsekCatatan] = useState('');

  // Dynamic Rombels for SMPN 2 Kutasari (7A-7F, 8A-8G, 9A-9F + imported)
  const allRombels = useMemo(() => getDynamicRombels(students), [students]);

  // ==========================================
  // FORM STATE INITIALIZATION
  // ==========================================
  const todayDate = '2026-09-21';
  const getDayName = (dateStr: string): DayOfWeek => {
    const d = new Date(dateStr);
    const days: DayOfWeek[] = ['Minggu' as any, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[d.getDay()] || 'Senin';
  };

  const initialClassRecaps: PiketClassRecap[] = useMemo(() => {
    return allRombels.map(rombel => {
      const rombelStudents = students.filter(s => s.rombel === rombel && s.status === 'aktif');
      const count = rombelStudents.length > 0 ? rombelStudents.length : 32;
      return {
        rombel,
        jumlahSiswa: count,
        hadir: count,
        sakit: 0,
        izin: 0,
        alpa: 0,
        dispensasi: 0,
        persentaseHadir: 100
      };
    });
  }, [students]);

  const [formTanggal, setFormTanggal] = useState<string>(todayDate);
  const [formHari, setFormHari] = useState<DayOfWeek>(getDayName(todayDate));
  const [formGuruIds, setFormGuruIds] = useState<string[]>(['stf-003', 'stf-005']);
  const [formJamMasuk, setFormJamMasuk] = useState<string>('06:30');
  const [formJamPulang, setFormJamPulang] = useState<string>('14:30');
  const [formTahunAjaran, setFormTahunAjaran] = useState<string>(school.tahunAjaranAktif);
  const [formSemester, setFormSemester] = useState<'Ganjil' | 'Genap'>(school.semesterAktif as 'Ganjil' | 'Genap');
  const [formRekapKelas, setFormRekapKelas] = useState<PiketClassRecap[]>(initialClassRecaps);
  const [formDetailTidakHadir, setFormDetailTidakHadir] = useState<PiketAbsentStudent[]>([]);
  
  // Incident Sub-sections
  const [formTerlambat, setFormTerlambat] = useState<PiketLateStudent[]>([]);
  const [formIzinKeluar, setFormIzinKeluar] = useState<PiketEarlyLeaveStudent[]>([]);
  const [formGuruAbsen, setFormGuruAbsen] = useState<PiketTeacherAbsence[]>([]);
  const [formTamu, setFormTamu] = useState<PiketSchoolGuest[]>([]);
  const [formCatatanLain, setFormCatatanLain] = useState<string>('');

  // Accordion toggles for incident sections
  const [accordionOpen, setAccordionOpen] = useState({
    rekap: true,
    detailAbsen: true,
    terlambat: true,
    izinKeluar: false,
    guruAbsen: false,
    tamu: false,
    catatanLain: true
  });

  const toggleAccordion = (key: keyof typeof accordionOpen) => {
    setAccordionOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Student Attendance Recalculation Handler
  const handleRecapChange = (rombel: string, field: 'sakit' | 'izin' | 'alpa' | 'dispensasi', value: number) => {
    setFormRekapKelas(prev => prev.map(item => {
      if (item.rombel === rombel) {
        const val = Math.max(0, isNaN(value) ? 0 : value);
        const updated = { ...item, [field]: val };
        const notHadir = updated.sakit + updated.izin + updated.alpa + updated.dispensasi;
        updated.hadir = Math.max(0, updated.jumlahSiswa - notHadir);
        updated.persentaseHadir = updated.jumlahSiswa > 0 
          ? parseFloat(((updated.hadir / updated.jumlahSiswa) * 100).toFixed(1))
          : 100;
        return updated;
      }
      return item;
    }));
  };

  // Totals for Form Table
  const formTotals = useMemo(() => {
    const totalSiswa = formRekapKelas.reduce((acc, curr) => acc + curr.jumlahSiswa, 0);
    const totalHadir = formRekapKelas.reduce((acc, curr) => acc + curr.hadir, 0);
    const totalSakit = formRekapKelas.reduce((acc, curr) => acc + curr.sakit, 0);
    const totalIzin = formRekapKelas.reduce((acc, curr) => acc + curr.izin, 0);
    const totalAlpa = formRekapKelas.reduce((acc, curr) => acc + curr.alpa, 0);
    const totalDisp = formRekapKelas.reduce((acc, curr) => acc + curr.dispensasi, 0);
    const avgPersen = totalSiswa > 0 ? parseFloat(((totalHadir / totalSiswa) * 100).toFixed(1)) : 100;

    return { totalSiswa, totalHadir, totalSakit, totalIzin, totalAlpa, totalDisp, avgPersen };
  }, [formRekapKelas]);

  // Handle Save Report
  const handleSaveReport = () => {
    if (formGuruIds.length === 0) {
      alert('Pilih setidaknya 1 orang Guru Piket.');
      return;
    }

    const guruNames = staff
      .filter(s => formGuruIds.includes(s.id))
      .map(s => `${s.nama}${s.gelar ? ', ' + s.gelar : ''}`);

    const newReport = addPiketReport({
      tanggal: formTanggal,
      hari: formHari,
      guruPiketIds: formGuruIds,
      namaGuruPiket: guruNames,
      jamMasuk: formJamMasuk,
      jamPulang: formJamPulang,
      tahunAjaran: formTahunAjaran,
      semester: formSemester,
      status: 'Terkirim',
      rekapKelas: formRekapKelas,
      detailSiswaTidakHadir: formDetailTidakHadir,
      catatanKejadian: {
        siswaTerlambat: formTerlambat,
        siswaIzinKeluarPulang: formIzinKeluar,
        guruTidakHadirDanKelasKosong: formGuruAbsen,
        tamuSekolah: formTamu,
        catatanLain: formCatatanLain
      }
    });

    alert(`Laporan Guru Piket berhasil disimpan dengan nomor: ${newReport.nomorLaporan}`);
    setActiveTab('riwayat');
  };

  // WhatsApp Summary Generator
  const generateWhatsAppSummary = (report: PiketReport): string => {
    const totalSiswa = report.rekapKelas.reduce((a, b) => a + b.jumlahSiswa, 0);
    const totalHadir = report.rekapKelas.reduce((a, b) => a + b.hadir, 0);
    const totalSakit = report.rekapKelas.reduce((a, b) => a + b.sakit, 0);
    const totalIzin = report.rekapKelas.reduce((a, b) => a + b.izin, 0);
    const totalAlpa = report.rekapKelas.reduce((a, b) => a + b.alpa, 0);
    const totalDisp = report.rekapKelas.reduce((a, b) => a + b.dispensasi, 0);
    const avgPersen = totalSiswa > 0 ? ((totalHadir / totalSiswa) * 100).toFixed(1) : '100';

    let text = `*LAPORAN GURU PIKET HARIAN*\n`;
    text += `*SMP NEGERI 2 KUTASARI*\n`;
    text += `----------------------------------------\n`;
    text += `📅 Hari/Tgl : ${report.hari}, ${report.tanggal}\n`;
    text += `⏰ Jam Piket: ${report.jamMasuk} - ${report.jamPulang} WIB\n`;
    text += `👤 Guru Piket: ${report.namaGuruPiket.join(', ')}\n`;
    text += `----------------------------------------\n`;
    text += `📊 *RINGKASAN KEHADIRAN SEKOLAH*\n`;
    text += `• Total Siswa : ${totalSiswa}\n`;
    text += `• Siswa Hadir : ${totalHadir} (${avgPersen}%)\n`;
    text += `• Sakit (S)   : ${totalSakit}\n`;
    text += `• Izin (I)    : ${totalIzin}\n`;
    text += `• Alpa (A)    : ${totalAlpa}\n`;
    text += `• Dispensasi  : ${totalDisp}\n`;
    text += `----------------------------------------\n`;

    if (report.detailSiswaTidakHadir.length > 0) {
      text += `📋 *RINCIAN SISWA TIDAK HADIR:*\n`;
      report.detailSiswaTidakHadir.forEach((s, idx) => {
        text += `${idx + 1}. ${s.namaSiswa} (${s.rombel}) - [${s.keterangan}] ${s.alasan ? ': ' + s.alasan : ''}\n`;
      });
      text += `----------------------------------------\n`;
    }

    if (report.catatanKejadian.siswaTerlambat.length > 0) {
      text += `⚠️ *SISWA TERLAMBAT:*\n`;
      report.catatanKejadian.siswaTerlambat.forEach((st, idx) => {
        text += `${idx + 1}. ${st.namaSiswa} (${st.rombel}) - Pkl ${st.jamDatang} (Tindakan: ${st.tindakanSanksi})\n`;
      });
      text += `----------------------------------------\n`;
    }

    if (report.catatanKejadian.guruTidakHadirDanKelasKosong.length > 0) {
      text += `ℹ️ *KELAS KOSONG / GURU TUGAS:*\n`;
      report.catatanKejadian.guruTidakHadirDanKelasKosong.forEach((g, idx) => {
        text += `${idx + 1}. ${g.namaGuru} (Jam ke ${g.jamKe}, Rombel ${g.rombel}) - ${g.guruPenggantiTugas}\n`;
      });
      text += `----------------------------------------\n`;
    }

    if (report.catatanKejadian.catatanLain) {
      text += `📝 *CATATAN KEJADIAN:*\n${report.catatanKejadian.catatanLain}\n`;
      text += `----------------------------------------\n`;
    }

    text += `Terima kasih bapak/ibu wali kelas atas kerja sama dan pendampingannya. Salam sehat & sukses selalu!`;

    return text;
  };

  const handleCopyWhatsApp = (report: PiketReport) => {
    const text = generateWhatsAppSummary(report);
    navigator.clipboard.writeText(text);
    setCopiedWaReportId(report.id);
    setTimeout(() => setCopiedWaReportId(null), 3000);
  };

  // Quick statistics for header in Riwayat
  const riwayatStats = useMemo(() => {
    const todayReport = piketReports.find(p => p.tanggal === todayDate) || piketReports[0];
    if (!todayReport) {
      return { totalTidakHadir: 0, s: 0, i: 0, a: 0, d: 0, topRombel: '-', lowestRombel: '-' };
    }

    const s = todayReport.rekapKelas.reduce((acc, c) => acc + c.sakit, 0);
    const i = todayReport.rekapKelas.reduce((acc, c) => acc + c.izin, 0);
    const a = todayReport.rekapKelas.reduce((acc, c) => acc + c.alpa, 0);
    const d = todayReport.rekapKelas.reduce((acc, c) => acc + c.dispensasi, 0);

    const sortedByPercent = [...todayReport.rekapKelas].sort((x, y) => y.persentaseHadir - x.persentaseHadir);
    const topRombel = sortedByPercent[0] ? `${sortedByPercent[0].rombel} (${sortedByPercent[0].persentaseHadir}%)` : '-';
    const lowestRombel = sortedByPercent[sortedByPercent.length - 1] 
      ? `${sortedByPercent[sortedByPercent.length - 1].rombel} (${sortedByPercent[sortedByPercent.length - 1].persentaseHadir}%)` 
      : '-';

    return {
      totalTidakHadir: s + i + a + d,
      s, i, a, d,
      topRombel,
      lowestRombel
    };
  }, [piketReports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return piketReports.filter(report => {
      const matchSearch = 
        report.nomorLaporan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.namaGuruPiket.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
        report.catatanKejadian.catatanLain.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStart = filterStartDate ? report.tanggal >= filterStartDate : true;
      const matchEnd = filterEndDate ? report.tanggal <= filterEndDate : true;
      const matchGuru = filterGuru !== 'semua' ? report.guruPiketIds.includes(filterGuru) : true;
      const matchRombel = filterRombel !== 'semua' ? report.rekapKelas.some(r => r.rombel === filterRombel) : true;

      return matchSearch && matchStart && matchEnd && matchGuru && matchRombel;
    });
  }, [piketReports, searchTerm, filterStartDate, filterEndDate, filterGuru, filterRombel]);

  // Handle Verify modal submit
  const handleConfirmVerification = () => {
    if (!verifyingReport) return;
    const kepsek = staff.find(s => s.jabatan.toLowerCase().includes('kepala sekolah')) || staff[0];
    const kepsekName = kepsek ? `${kepsek.nama}${kepsek.gelar ? ', ' + kepsek.gelar : ''}` : 'Drs. H. Bambang Sudarmo, M.Pd.';

    verifyPiketReport(verifyingReport.id, kepsekCatatan || 'Laporan piket telah diperiksa dan disetujui.', kepsekName);
    setVerifyingReport(null);
    setKepsekCatatan('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Module Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-700/20">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Laporan Guru Piket Harian
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                Piket Terpadu
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Formulir pencatatan kondisi harian sekolah, rekap presensi kelas VII A s.d. IX D, kejadian ketertiban, dan tamu sekolah.
            </p>
          </div>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'form'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Plus className="w-4 h-4" />
            Isi Laporan Baru
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'riwayat'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Riwayat Laporan ({piketReports.length})
          </button>
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'jadwal'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-4 h-4" />
            Jadwal Piket
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* TAB 1: FORM LAPORAN PIKET BARU            */}
      {/* ========================================== */}
      {activeTab === 'form' && (
        <div className="space-y-6">

          {/* 1. BAGIAN IDENTITAS PIKET */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-700" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  1. Identitas & Jadwal Tugas Piket
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Tahun Ajaran: <strong className="text-slate-800">{school.tahunAjaranAktif} ({school.semesterAktif})</strong>
              </span>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tanggal & Hari */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hari & Tanggal:
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={formTanggal}
                    onChange={(e) => {
                      setFormTanggal(e.target.value);
                      setFormHari(getDayName(e.target.value));
                    }}
                    className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50"
                  />
                  <div className="px-3 py-2 bg-blue-50 text-blue-900 text-xs font-bold rounded-lg border border-blue-200">
                    {formHari}
                  </div>
                </div>
              </div>

              {/* Jam Masuk & Jam Pulang */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jam Masuk & Pulang Piket:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={formJamMasuk}
                    onChange={(e) => setFormJamMasuk(e.target.value)}
                    className="w-1/2 text-xs border border-slate-200 rounded-lg px-2.5 py-2 font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50"
                  />
                  <span className="text-xs text-slate-400">s/d</span>
                  <input
                    type="time"
                    value={formJamPulang}
                    onChange={(e) => setFormJamPulang(e.target.value)}
                    className="w-1/2 text-xs border border-slate-200 rounded-lg px-2.5 py-2 font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50"
                  />
                </div>
              </div>

              {/* Guru Piket Multi-select */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Guru Piket Bertugas (Boleh Lebih dari 1 Orang):
                </label>
                <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 min-h-[42px] flex flex-wrap gap-1.5 items-center">
                  {formGuruIds.map(gid => {
                    const st = staff.find(s => s.id === gid);
                    if (!st) return null;
                    return (
                      <span 
                        key={gid}
                        className="inline-flex items-center gap-1.5 bg-blue-100 border border-blue-300 text-blue-950 px-2.5 py-1 rounded-md text-xs font-semibold"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                        {st.nama}{st.gelar ? ', ' + st.gelar : ''}
                        <button
                          type="button"
                          onClick={() => setFormGuruIds(prev => prev.filter(id => id !== gid))}
                          className="text-blue-600 hover:text-rose-600 ml-1 cursor-pointer"
                        >
                          &times;
                        </button>
                      </span>
                    );
                  })}
                  <select
                    onChange={(e) => {
                      if (e.target.value && !formGuruIds.includes(e.target.value)) {
                        setFormGuruIds(prev => [...prev, e.target.value]);
                      }
                      e.target.value = '';
                    }}
                    className="text-xs bg-transparent border-none text-slate-500 font-medium focus:outline-none cursor-pointer py-1"
                    defaultValue=""
                  >
                    <option value="" disabled>+ Tambah Guru Piket...</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.nama}{s.gelar ? ', ' + s.gelar : ''} ({s.jabatan})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* 2. BAGIAN REKAP KEHADIRAN SISWA SELURUH KELAS */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div 
              onClick={() => toggleAccordion('rekap')}
              className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-700" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Tabel Rekap Kehadiran Siswa (VII A s.d. IX D)
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Rata-rata: {formTotals.avgPersen}%
                </span>
                {accordionOpen.rekap ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </div>
            </div>

            {accordionOpen.rekap && (
              <div>
                <div className="p-4 bg-blue-50/50 border-b border-slate-200 text-xs text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span>
                    💡 <em>Jumlah siswa terisi otomatis dari rombel. Cukup ketik jumlah Sakit (S), Izin (I), Alpa (A), atau Dispensasi. Kolom Hadir dan % Hadir dihitung secara otomatis.</em>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormRekapKelas(prev => prev.map(r => ({
                        ...r,
                        hadir: r.jumlahSiswa,
                        sakit: 0,
                        izin: 0,
                        alpa: 0,
                        dispensasi: 0,
                        persentaseHadir: 100
                      })));
                    }}
                    className="px-3 py-1 bg-white border border-blue-300 text-blue-800 hover:bg-blue-100 text-[11px] font-bold rounded-lg cursor-pointer shrink-0"
                  >
                    Reset Semua 100% Hadir
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 text-[11px] uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Kelas / Rombel</th>
                        <th className="py-2.5 px-3 text-center">Jml Siswa</th>
                        <th className="py-2.5 px-3 text-center text-emerald-700 bg-emerald-50/40">Hadir</th>
                        <th className="py-2.5 px-3 text-center text-amber-700">Sakit (S)</th>
                        <th className="py-2.5 px-3 text-center text-blue-700">Izin (I)</th>
                        <th className="py-2.5 px-3 text-center text-rose-700">Alpa (A)</th>
                        <th className="py-2.5 px-3 text-center text-purple-700">Dispensasi</th>
                        <th className="py-2.5 px-3 text-center">% Kehadiran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {formRekapKelas.map((row) => (
                        <tr key={row.rombel} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2 px-3 font-bold text-slate-900">
                            Kelas {row.rombel}
                          </td>
                          <td className="py-2 px-3 text-center font-medium text-slate-600">
                            {row.jumlahSiswa}
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-emerald-700 bg-emerald-50/30">
                            {row.hadir}
                          </td>
                          {/* Sakit */}
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={row.jumlahSiswa}
                              value={row.sakit === 0 ? '' : row.sakit}
                              placeholder="0"
                              onChange={(e) => handleRecapChange(row.rombel, 'sakit', parseInt(e.target.value))}
                              className="w-14 text-center py-1 border border-slate-200 rounded focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-semibold text-amber-800 bg-slate-50"
                            />
                          </td>
                          {/* Izin */}
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={row.jumlahSiswa}
                              value={row.izin === 0 ? '' : row.izin}
                              placeholder="0"
                              onChange={(e) => handleRecapChange(row.rombel, 'izin', parseInt(e.target.value))}
                              className="w-14 text-center py-1 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold text-blue-800 bg-slate-50"
                            />
                          </td>
                          {/* Alpa */}
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={row.jumlahSiswa}
                              value={row.alpa === 0 ? '' : row.alpa}
                              placeholder="0"
                              onChange={(e) => handleRecapChange(row.rombel, 'alpa', parseInt(e.target.value))}
                              className="w-14 text-center py-1 border border-slate-200 rounded focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-semibold text-rose-800 bg-slate-50"
                            />
                          </td>
                          {/* Dispensasi */}
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={row.jumlahSiswa}
                              value={row.dispensasi === 0 ? '' : row.dispensasi}
                              placeholder="0"
                              onChange={(e) => handleRecapChange(row.rombel, 'dispensasi', parseInt(e.target.value))}
                              className="w-14 text-center py-1 border border-slate-200 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-semibold text-purple-800 bg-slate-50"
                            />
                          </td>
                          {/* % Hadir */}
                          <td className="py-2 px-3 text-center">
                            <span className={`inline-block w-16 px-2 py-0.5 rounded text-[11px] font-bold ${
                              row.persentaseHadir >= 95 ? 'bg-emerald-100 text-emerald-800' :
                              row.persentaseHadir >= 90 ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {row.persentaseHadir}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    {/* TOTAL FOOTER ROW */}
                    <tfoot className="bg-slate-100/90 font-bold text-slate-800 border-t-2 border-slate-300">
                      <tr>
                        <td className="py-2.5 px-3 uppercase text-[11px] tracking-wider">
                          TOTAL SEKOLAH
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">
                          {formTotals.totalSiswa}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-700 bg-emerald-100/40">
                          {formTotals.totalHadir}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-amber-700">
                          {formTotals.totalSakit}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-blue-700">
                          {formTotals.totalIzin}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-rose-700">
                          {formTotals.totalAlpa}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-purple-700">
                          {formTotals.totalDisp}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-blue-700 text-white shadow-xs">
                            {formTotals.avgPersen}%
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* 3. BAGIAN DETAIL SISWA TIDAK HADIR */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div 
              onClick={() => toggleAccordion('detailAbsen')}
              className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <UserX className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  3. Rincian Siswa Tidak Hadir ({formDetailTidakHadir.length} Siswa)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newStudent: PiketAbsentStudent = {
                      id: `abs-${Date.now()}`,
                      namaSiswa: '',
                      nis: '',
                      rombel: '7A',
                      keterangan: 'Sakit',
                      alasan: ''
                    };
                    setFormDetailTidakHadir(prev => [...prev, newStudent]);
                    if (!accordionOpen.detailAbsen) toggleAccordion('detailAbsen');
                  }}
                  className="px-2.5 py-1 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Siswa
                </button>
                {accordionOpen.detailAbsen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </div>
            </div>

            {accordionOpen.detailAbsen && (
              <div className="p-4 space-y-3">
                {formDetailTidakHadir.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">
                    Belum ada siswa tidak hadir yang ditambahkan secara spesifik. Klik "+ Tambah Siswa" di atas untuk mencatat nama dan alasan.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {formDetailTidakHadir.map((item, idx) => (
                      <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row items-stretch md:items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        {/* Rombel select */}
                        <div className="w-28">
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Rombel:</label>
                          <select
                            value={item.rombel}
                            onChange={(e) => {
                              const r = e.target.value;
                              setFormDetailTidakHadir(prev => prev.map(x => x.id === item.id ? { ...x, rombel: r, namaSiswa: '' } : x));
                            }}
                            className="w-full text-xs font-bold bg-white border border-slate-300 rounded px-2 py-1.5 focus:outline-none"
                          >
                            {allRombels.map(r => (
                              <option key={r} value={r}>Kelas {r}</option>
                            ))}
                          </select>
                        </div>

                        {/* Student Name auto-complete / input */}
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Nama Siswa:</label>
                          <input
                            type="text"
                            list={`students-${item.rombel}`}
                            placeholder="Ketik atau pilih nama siswa..."
                            value={item.namaSiswa}
                            onChange={(e) => {
                              const val = e.target.value;
                              const matched = students.find(s => s.rombel === item.rombel && s.nama.toLowerCase() === val.toLowerCase());
                              setFormDetailTidakHadir(prev => prev.map(x => x.id === item.id ? { 
                                ...x, 
                                namaSiswa: val,
                                nis: matched ? matched.nis : x.nis,
                                studentId: matched ? matched.id : x.studentId
                              } : x));
                            }}
                            className="w-full text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-600"
                          />
                          <datalist id={`students-${item.rombel}`}>
                            {students.filter(s => s.rombel === item.rombel).map(s => (
                              <option key={s.id} value={s.nama}>{s.nisn} - {s.nis}</option>
                            ))}
                          </datalist>
                        </div>

                        {/* Keterangan */}
                        <div className="w-32">
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Keterangan:</label>
                          <select
                            value={item.keterangan}
                            onChange={(e) => {
                              const ket = e.target.value as any;
                              setFormDetailTidakHadir(prev => prev.map(x => x.id === item.id ? { ...x, keterangan: ket } : x));
                            }}
                            className="w-full text-xs font-semibold bg-white border border-slate-300 rounded px-2 py-1.5 focus:outline-none"
                          >
                            <option value="Sakit">Sakit</option>
                            <option value="Izin">Izin</option>
                            <option value="Alpa">Alpa</option>
                            <option value="Dispensasi">Dispensasi</option>
                          </select>
                        </div>

                        {/* Alasan */}
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Alasan / Bukti:</label>
                          <input
                            type="text"
                            placeholder="Misal: Surat dokter dari Puskesmas / Acara keluarga"
                            value={item.alasan}
                            onChange={(e) => {
                              const al = e.target.value;
                              setFormDetailTidakHadir(prev => prev.map(x => x.id === item.id ? { ...x, alasan: al } : x));
                            }}
                            className="w-full text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                          />
                        </div>

                        {/* Delete row */}
                        <button
                          type="button"
                          onClick={() => setFormDetailTidakHadir(prev => prev.filter(x => x.id !== item.id))}
                          className="p-1.5 text-slate-400 hover:text-rose-600 self-end md:self-center cursor-pointer mt-3 md:mt-0"
                          title="Hapus baris siswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. BAGIAN CATATAN KEJADIAN & KETERTIBAN */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
              4. Catatan Kejadian, Ketertiban & Tamu Sekolah
            </h3>

            {/* 4a. Siswa Terlambat */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div 
                onClick={() => toggleAccordion('terlambat')}
                className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Siswa Terlambat Datang ({formTerlambat.length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormTerlambat(prev => [...prev, {
                        id: `lt-${Date.now()}`,
                        namaSiswa: '',
                        rombel: '7A',
                        jamDatang: '07:15',
                        tindakanSanksi: 'Dicatat dan dibina guru piket'
                      }]);
                      if (!accordionOpen.terlambat) toggleAccordion('terlambat');
                    }}
                    className="px-2 py-0.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded border border-amber-300 cursor-pointer"
                  >
                    + Tambah
                  </button>
                  {accordionOpen.terlambat ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {accordionOpen.terlambat && (
                <div className="p-4 space-y-2">
                  {formTerlambat.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-2">Tidak ada siswa terlambat hari ini.</p>
                  ) : (
                    formTerlambat.map((item) => (
                      <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 items-center">
                        <input
                          type="text"
                          placeholder="Nama Siswa..."
                          value={item.namaSiswa}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormTerlambat(prev => prev.map(x => x.id === item.id ? { ...x, namaSiswa: val } : x));
                          }}
                          className="text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                        />
                        <select
                          value={item.rombel}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormTerlambat(prev => prev.map(x => x.id === item.id ? { ...x, rombel: val } : x));
                          }}
                          className="text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                        >
                          {allRombels.map(r => <option key={r} value={r}>Kelas {r}</option>)}
                        </select>
                        <input
                          type="time"
                          value={item.jamDatang}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormTerlambat(prev => prev.map(x => x.id === item.id ? { ...x, jamDatang: val } : x));
                          }}
                          className="text-xs font-mono bg-white border border-slate-300 rounded px-2 py-1.5"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Tindakan / Sanksi..."
                            value={item.tindakanSanksi}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormTerlambat(prev => prev.map(x => x.id === item.id ? { ...x, tindakanSanksi: val } : x));
                            }}
                            className="flex-1 text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                          />
                          <button
                            type="button"
                            onClick={() => setFormTerlambat(prev => prev.filter(x => x.id !== item.id))}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 4b. Siswa Izin Keluar / Pulang Cepat */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div 
                onClick={() => toggleAccordion('izinKeluar')}
                className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Siswa Izin Keluar / Pulang Cepat ({formIzinKeluar.length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormIzinKeluar(prev => [...prev, {
                        id: `el-${Date.now()}`,
                        namaSiswa: '',
                        rombel: '8A',
                        jam: '10:00',
                        alasan: 'Sakit di UKS',
                        penjemput: 'Orang Tua'
                      }]);
                      if (!accordionOpen.izinKeluar) toggleAccordion('izinKeluar');
                    }}
                    className="px-2 py-0.5 text-xs font-semibold text-blue-900 bg-blue-100 hover:bg-blue-200 rounded border border-blue-300 cursor-pointer"
                  >
                    + Tambah
                  </button>
                  {accordionOpen.izinKeluar ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {accordionOpen.izinKeluar && (
                <div className="p-4 space-y-2">
                  {formIzinKeluar.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-2">Tidak ada siswa izin keluar / pulang cepat.</p>
                  ) : (
                    formIzinKeluar.map((item) => (
                      <div key={item.id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 items-center">
                        <input
                          type="text"
                          placeholder="Nama Siswa..."
                          value={item.namaSiswa}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormIzinKeluar(prev => prev.map(x => x.id === item.id ? { ...x, namaSiswa: val } : x));
                          }}
                          className="text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                        />
                        <select
                          value={item.rombel}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormIzinKeluar(prev => prev.map(x => x.id === item.id ? { ...x, rombel: val } : x));
                          }}
                          className="text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                        >
                          {allRombels.map(r => <option key={r} value={r}>Kelas {r}</option>)}
                        </select>
                        <input
                          type="time"
                          value={item.jam}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormIzinKeluar(prev => prev.map(x => x.id === item.id ? { ...x, jam: val } : x));
                          }}
                          className="text-xs font-mono bg-white border border-slate-300 rounded px-2 py-1.5"
                        />
                        <input
                          type="text"
                          placeholder="Alasan..."
                          value={item.alasan}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormIzinKeluar(prev => prev.map(x => x.id === item.id ? { ...x, alasan: val } : x));
                          }}
                          className="text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Dijemput oleh Siapa..."
                            value={item.penjemput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormIzinKeluar(prev => prev.map(x => x.id === item.id ? { ...x, penjemput: val } : x));
                            }}
                            className="flex-1 text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                          />
                          <button
                            type="button"
                            onClick={() => setFormIzinKeluar(prev => prev.filter(x => x.id !== item.id))}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 4c. Guru Tidak Hadir & Kelas Kosong */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div 
                onClick={() => toggleAccordion('guruAbsen')}
                className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Guru Tidak Hadir / Kelas Kosong & Pengganti ({formGuruAbsen.length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormGuruAbsen(prev => [...prev, {
                        id: `ta-${Date.now()}`,
                        namaGuru: '',
                        jamKe: '1 - 2',
                        rombel: '7A',
                        guruPenggantiTugas: 'Mengerjakan tugas LKS didampingi guru piket'
                      }]);
                      if (!accordionOpen.guruAbsen) toggleAccordion('guruAbsen');
                    }}
                    className="px-2 py-0.5 text-xs font-semibold text-purple-900 bg-purple-100 hover:bg-purple-200 rounded border border-purple-300 cursor-pointer"
                  >
                    + Tambah
                  </button>
                  {accordionOpen.guruAbsen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {accordionOpen.guruAbsen && (
                <div className="p-4 space-y-2">
                  {formGuruAbsen.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-2">Semua kelas terisi guru pengampu. Tidak ada kelas kosong.</p>
                  ) : (
                    formGuruAbsen.map((item) => (
                      <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 items-center">
                        <select
                          value={item.namaGuru}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormGuruAbsen(prev => prev.map(x => x.id === item.id ? { ...x, namaGuru: val } : x));
                          }}
                          className="text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                        >
                          <option value="">Pilih Guru...</option>
                          {staff.map(s => <option key={s.id} value={`${s.nama}, ${s.gelar}`}>{s.nama}, {s.gelar}</option>)}
                        </select>
                        <input
                          type="text"
                          placeholder="Jam ke- (cth: 3 - 4)..."
                          value={item.jamKe}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormGuruAbsen(prev => prev.map(x => x.id === item.id ? { ...x, jamKe: val } : x));
                          }}
                          className="text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                        />
                        <select
                          value={item.rombel}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormGuruAbsen(prev => prev.map(x => x.id === item.id ? { ...x, rombel: val } : x));
                          }}
                          className="text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                        >
                          {allRombels.map(r => <option key={r} value={r}>Kelas {r}</option>)}
                        </select>
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Guru Pengganti / Tugas..."
                            value={item.guruPenggantiTugas}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormGuruAbsen(prev => prev.map(x => x.id === item.id ? { ...x, guruPenggantiTugas: val } : x));
                            }}
                            className="flex-1 text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                          />
                          <button
                            type="button"
                            onClick={() => setFormGuruAbsen(prev => prev.filter(x => x.id !== item.id))}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 4d. Buku Tamu Sekolah */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div 
                onClick={() => toggleAccordion('tamu')}
                className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Buku Tamu Sekolah ({formTamu.length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormTamu(prev => [...prev, {
                        id: `gs-${Date.now()}`,
                        nama: '',
                        instansi: '',
                        keperluan: '',
                        jam: '09:00'
                      }]);
                      if (!accordionOpen.tamu) toggleAccordion('tamu');
                    }}
                    className="px-2 py-0.5 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded border border-emerald-300 cursor-pointer"
                  >
                    + Tambah Tamu
                  </button>
                  {accordionOpen.tamu ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {accordionOpen.tamu && (
                <div className="p-4 space-y-2">
                  {formTamu.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-2">Belum ada tamu sekolah hari ini.</p>
                  ) : (
                    formTamu.map((item) => (
                      <div key={item.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 items-center">
                        <input
                          type="text"
                          placeholder="Nama Tamu..."
                          value={item.nama}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormTamu(prev => prev.map(x => x.id === item.id ? { ...x, nama: val } : x));
                          }}
                          className="text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                        />
                        <input
                          type="text"
                          placeholder="Instansi / Alamat..."
                          value={item.instansi}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormTamu(prev => prev.map(x => x.id === item.id ? { ...x, instansi: val } : x));
                          }}
                          className="text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                        />
                        <input
                          type="text"
                          placeholder="Keperluan..."
                          value={item.keperluan}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormTamu(prev => prev.map(x => x.id === item.id ? { ...x, keperluan: val } : x));
                          }}
                          className="text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Waktu berkunjung..."
                            value={item.jam}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormTamu(prev => prev.map(x => x.id === item.id ? { ...x, jam: val } : x));
                            }}
                            className="flex-1 text-xs bg-white border border-slate-300 rounded px-2 py-1.5"
                          />
                          <button
                            type="button"
                            onClick={() => setFormTamu(prev => prev.filter(x => x.id !== item.id))}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 4e. Catatan Umum & Kejadian Khusus */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Catatan Umum / Kejadian Khusus Hari Ini:
              </label>
              <textarea
                rows={3}
                value={formCatatanLain}
                onChange={(e) => setFormCatatanLain(e.target.value)}
                placeholder="Tuliskan catatan kondisi cuaca, pelaksanaan upacara, kebersihan lingkungan, atau peristiwa khusus lainnya..."
                className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none bg-slate-50"
              />
            </div>

          </div>

          {/* FORM ACTIONS BAR */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Laporan akan disimpan ke sistem SIMTU dan otomatis memperbarui data kehadiran sekolah.
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const draftReport: PiketReport = {
                    id: 'temp-preview',
                    nomorLaporan: `PKT/${formTanggal.replace(/-/g, '/')}/PREVIEW`,
                    tanggal: formTanggal,
                    hari: formHari,
                    guruPiketIds: formGuruIds,
                    namaGuruPiket: staff.filter(s => formGuruIds.includes(s.id)).map(s => `${s.nama}, ${s.gelar}`),
                    jamMasuk: formJamMasuk,
                    jamPulang: formJamPulang,
                    tahunAjaran: formTahunAjaran,
                    semester: formSemester,
                    status: 'Draft',
                    rekapKelas: formRekapKelas,
                    detailSiswaTidakHadir: formDetailTidakHadir,
                    catatanKejadian: {
                      siswaTerlambat: formTerlambat,
                      siswaIzinKeluarPulang: formIzinKeluar,
                      guruTidakHadirDanKelasKosong: formGuruAbsen,
                      tamuSekolah: formTamu,
                      catatanLain: formCatatanLain
                    },
                    createdAt: new Date().toISOString()
                  };
                  handleCopyWhatsApp(draftReport);
                }}
                className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                {copiedWaReportId === 'temp-preview' ? 'Tersalin ke Clipboard!' : 'Salin Ringkasan WhatsApp'}
              </button>

              <button
                type="button"
                onClick={handleSaveReport}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm cursor-pointer transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Simpan & Terbitkan Laporan Piket
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: DAFTAR RIWAYAT LAPORAN PIKET        */}
      {/* ========================================== */}
      {activeTab === 'riwayat' && (
        <div className="space-y-6">

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Total Siswa Tidak Hadir Hari Ini</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-rose-700">{riwayatStats.totalTidakHadir}</span>
                <span className="text-xs text-slate-500">siswa</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 flex gap-2">
                <span>S: <strong>{riwayatStats.s}</strong></span>
                <span>I: <strong>{riwayatStats.i}</strong></span>
                <span>A: <strong className="text-rose-600">{riwayatStats.a}</strong></span>
                <span>Disp: <strong>{riwayatStats.d}</strong></span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Rombel Kehadiran Tertinggi</span>
              <div className="mt-1">
                <span className="text-lg font-bold text-emerald-700 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  Kelas {riwayatStats.topRombel}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Prestasi disiplin kehadiran optimal</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Rombel Perlu Pembinaan</span>
              <div className="mt-1">
                <span className="text-lg font-bold text-amber-700">
                  Kelas {riwayatStats.lowestRombel}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Koordinasi dengan wali kelas & BK</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Total Arsip Laporan Piket</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black text-blue-700">{piketReports.length}</span>
                <span className="text-xs text-slate-500">laporan tersimpan</span>
              </div>
              <p className="mt-2 text-[11px] text-emerald-600 font-semibold">Tercatat rapi di SIMTU</p>
            </div>
          </div>

          {/* Filter & Search Controls */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nomor laporan, guru, catatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Date Filters */}
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
                  title="Dari Tanggal"
                />
                <span className="text-xs text-slate-400">-</span>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700"
                  title="Sampai Tanggal"
                />
              </div>

              {/* Guru filter */}
              <select
                value={filterGuru}
                onChange={(e) => setFilterGuru(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
              >
                <option value="semua">Semua Guru Piket</option>
                {staff.map(s => (
                  <option key={s.id} value={s.id}>{s.nama}</option>
                ))}
              </select>

              {(filterStartDate || filterEndDate || filterGuru !== 'semua' || searchTerm) && (
                <button
                  onClick={() => {
                    setFilterStartDate('');
                    setFilterEndDate('');
                    setFilterGuru('semua');
                    setSearchTerm('');
                  }}
                  className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <button
              onClick={() => setActiveTab('form')}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              Buat Laporan Baru
            </button>
          </div>

          {/* Tabel Riwayat Laporan Piket */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                    <th className="py-3 px-4">No. Laporan & Tanggal</th>
                    <th className="py-3 px-4">Guru Piket</th>
                    <th className="py-3 px-4 text-center">Jam Tugas</th>
                    <th className="py-3 px-4 text-center">Rekap Absen (S/I/A/D)</th>
                    <th className="py-3 px-4 text-center">% Kehadiran</th>
                    <th className="py-3 px-4 text-center">Status Verifikasi</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReports.map((report) => {
                    const totalSiswa = report.rekapKelas.reduce((acc, c) => acc + c.jumlahSiswa, 0);
                    const totalHadir = report.rekapKelas.reduce((acc, c) => acc + c.hadir, 0);
                    const s = report.rekapKelas.reduce((acc, c) => acc + c.sakit, 0);
                    const i = report.rekapKelas.reduce((acc, c) => acc + c.izin, 0);
                    const a = report.rekapKelas.reduce((acc, c) => acc + c.alpa, 0);
                    const d = report.rekapKelas.reduce((acc, c) => acc + c.dispensasi, 0);
                    const avgPersen = totalSiswa > 0 ? ((totalHadir / totalSiswa) * 100).toFixed(1) : '100';

                    return (
                      <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-blue-900 block">{report.nomorLaporan}</span>
                          <span className="text-slate-500 text-[11px]">
                            {report.hari}, {report.tanggal}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {report.namaGuruPiket.join(', ')}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-600">
                          {report.jamMasuk} - {report.jamPulang}
                        </td>
                        <td className="py-3 px-4 text-center font-medium">
                          <span className="text-amber-700">{s}S</span> / <span className="text-blue-700">{i}I</span> / <span className="text-rose-700 font-bold">{a}A</span> / <span className="text-purple-700">{d}D</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            {avgPersen}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {report.verifikasiKepalaSekolah?.diverifikasi ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Disetujui Kepsek
                            </span>
                          ) : (
                            <button
                              onClick={() => setVerifyingReport(report)}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 cursor-pointer"
                              title="Klik untuk verifikasi Kepala Sekolah"
                            >
                              <Clock className="w-3 h-3 text-amber-600" />
                              Menunggu Verifikasi
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Copy WhatsApp */}
                            <button
                              onClick={() => handleCopyWhatsApp(report)}
                              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer transition-colors"
                              title="Salin Ringkasan WhatsApp"
                            >
                              {copiedWaReportId === report.id ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Share2 className="w-4 h-4" />
                              )}
                            </button>

                            {/* View Detail */}
                            <button
                              onClick={() => setViewingReport(report)}
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                              title="Lihat Detail Laporan"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Print */}
                            <button
                              onClick={() => {
                                setPrintingReport(report);
                                setIsPrintModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                              title="Cetak Laporan Piket Resmi"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                if (confirm(`Yakin ingin menghapus laporan piket ${report.nomorLaporan}?`)) {
                                  deletePiketReport(report.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                              title="Hapus Laporan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        Tidak ada laporan piket yang cocok dengan filter pencarian.
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
      {/* TAB 3: JADWAL PIKET GURU                   */}
      {/* ========================================== */}
      {activeTab === 'jadwal' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Jadwal Petugas Guru Piket Harian</h3>
              <p className="text-xs text-slate-500">Tahun Ajaran {school.tahunAjaranAktif} • SMP Negeri 2 Kutasari</p>
            </div>
            <div className="text-xs text-slate-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 font-medium">
              Koordinator Piket & GTK Bertugas Setiap Pukul 06.30 WIB
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jadwalPiket.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{item.hari}</span>
                  <span className="text-[11px] font-mono font-semibold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                    {item.jamTugas}
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-1">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Koordinator Piket:
                    </span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      {item.koordinator}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Guru Petugas:
                    </span>
                    <ul className="space-y-1">
                      {item.namaGuru.map((nama, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          {nama}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/60 border-t border-slate-100 text-right">
                  <button
                    onClick={() => {
                      setFormHari(item.hari);
                      setFormGuruIds(item.guruIds);
                      setActiveTab('form');
                    }}
                    className="text-xs text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
                  >
                    Buat Laporan Hari {item.hari} &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL DETAIL LAPORAN PIKET                 */}
      {/* ========================================== */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Detail Laporan Piket Harian</h3>
                <p className="text-xs text-slate-400">{viewingReport.nomorLaporan} &bull; {viewingReport.hari}, {viewingReport.tanggal}</p>
              </div>
              <button 
                onClick={() => setViewingReport(null)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Petugas info */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block">Guru Piket:</span>
                  <span className="font-bold text-slate-800">{viewingReport.namaGuruPiket.join(', ')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Jam Tugas:</span>
                  <span className="font-mono font-bold text-slate-800">{viewingReport.jamMasuk} - {viewingReport.jamPulang} WIB</span>
                </div>
              </div>

              {/* Rekap per rombel */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2 uppercase text-[11px]">Rekapitulasi Kehadiran Kelas:</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 font-semibold text-slate-700">
                      <tr>
                        <th className="p-2">Kelas</th>
                        <th className="p-2 text-center">Jml</th>
                        <th className="p-2 text-center text-emerald-700">Hadir</th>
                        <th className="p-2 text-center text-amber-700">S</th>
                        <th className="p-2 text-center text-blue-700">I</th>
                        <th className="p-2 text-center text-rose-700">A</th>
                        <th className="p-2 text-center text-purple-700">D</th>
                        <th className="p-2 text-center">% Hadir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {viewingReport.rekapKelas.map(r => (
                        <tr key={r.rombel}>
                          <td className="p-2 font-bold">{r.rombel}</td>
                          <td className="p-2 text-center">{r.jumlahSiswa}</td>
                          <td className="p-2 text-center font-bold text-emerald-700">{r.hadir}</td>
                          <td className="p-2 text-center">{r.sakit}</td>
                          <td className="p-2 text-center">{r.izin}</td>
                          <td className="p-2 text-center">{r.alpa}</td>
                          <td className="p-2 text-center">{r.dispensasi}</td>
                          <td className="p-2 text-center font-bold">{r.persentaseHadir}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rincian Tidak Hadir */}
              {viewingReport.detailSiswaTidakHadir.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-2 uppercase text-[11px]">Rincian Siswa Tidak Hadir:</h4>
                  <ul className="space-y-1">
                    {viewingReport.detailSiswaTidakHadir.map((s, i) => (
                      <li key={i} className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between">
                        <span><strong>{s.namaSiswa}</strong> ({s.rombel})</span>
                        <span className="text-slate-600">[{s.keterangan}] {s.alasan}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Kejadian lain */}
              {viewingReport.catatanKejadian.catatanLain && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-1 uppercase text-[11px]">Catatan Kejadian:</h4>
                  <p className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700">
                    {viewingReport.catatanKejadian.catatanLain}
                  </p>
                </div>
              )}

              {/* Verifikasi Status */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-900 font-bold block mb-1">Status Verifikasi Kepala Sekolah:</span>
                {viewingReport.verifikasiKepalaSekolah?.diverifikasi ? (
                  <p className="text-xs text-blue-800">
                    Telah diverifikasi oleh <strong>{viewingReport.verifikasiKepalaSekolah.namaKepalaSekolah}</strong> pada {viewingReport.verifikasiKepalaSekolah.tanggalVerifikasi}.<br />
                    Catatan: <em>"{viewingReport.verifikasiKepalaSekolah.catatan}"</em>
                  </p>
                ) : (
                  <p className="text-xs text-amber-800">Belum diverifikasi.</p>
                )}
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between">
              <button
                onClick={() => handleCopyWhatsApp(viewingReport)}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                Salin ke WhatsApp
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setPrintingReport(viewingReport);
                    setIsPrintModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Dokumen
                </button>
                <button
                  onClick={() => setViewingReport(null)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded font-semibold text-xs cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL VERIFIKASI KEPALA SEKOLAH            */}
      {/* ========================================== */}
      {verifyingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Verifikasi Laporan Piket oleh Kepala Sekolah
            </h3>
            <p className="text-xs text-slate-600">
              Laporan: <strong>{verifyingReport.nomorLaporan}</strong> ({verifyingReport.hari}, {verifyingReport.tanggal})
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Catatan / Arahan Kepala Sekolah:</label>
              <textarea
                rows={3}
                value={kepsekCatatan}
                onChange={(e) => setKepsekCatatan(e.target.value)}
                placeholder="Misal: Laporan lengkap dan tertib. Tindak lanjuti siswa 8A alpa bersama wali kelas."
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setVerifyingReport(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmVerification}
                className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Setujui & Verifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* PRINT MODAL LAPORAN PIKET HARIAN RESMI    */}
      {/* ========================================== */}
      {printingReport && (
        <PrintModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          title={`Laporan Piket Harian - ${printingReport.tanggal}`}
          documentNumber={printingReport.nomorLaporan}
        >
          <div className="text-black text-xs font-serif leading-relaxed">
            {/* Judul Laporan */}
            <div className="text-center mb-4">
              <h2 className="text-sm font-bold uppercase underline">
                LAPORAN GURU PIKET HARIAN
              </h2>
              <p className="text-[11px] font-sans font-medium text-slate-700">
                Nomor: {printingReport.nomorLaporan}
              </p>
            </div>

            {/* Identitas Hari & Guru */}
            <table className="w-full text-xs mb-3">
              <tbody>
                <tr>
                  <td className="w-36 font-semibold py-0.5">Hari / Tanggal</td>
                  <td className="w-4">:</td>
                  <td>{printingReport.hari}, {printingReport.tanggal}</td>
                  <td className="w-32 font-semibold py-0.5">Tahun Ajaran</td>
                  <td className="w-4">:</td>
                  <td>{printingReport.tahunAjaran} ({printingReport.semester})</td>
                </tr>
                <tr>
                  <td className="font-semibold py-0.5">Guru Piket Bertugas</td>
                  <td>:</td>
                  <td>{printingReport.namaGuruPiket.join(', ')}</td>
                  <td className="font-semibold py-0.5">Jam Tugas Piket</td>
                  <td>:</td>
                  <td>{printingReport.jamMasuk} s.d. {printingReport.jamPulang} WIB</td>
                </tr>
              </tbody>
            </table>

            {/* Tabel Rekap Kelas */}
            <h3 className="font-bold text-xs uppercase mb-1">A. Rekapitulasi Kehadiran Siswa</h3>
            <table className="w-full text-xs border border-black border-collapse mb-4">
              <thead className="bg-slate-100 font-bold text-center">
                <tr>
                  <th className="border border-black p-1">Kelas</th>
                  <th className="border border-black p-1">Jml Siswa</th>
                  <th className="border border-black p-1">Hadir</th>
                  <th className="border border-black p-1">Sakit (S)</th>
                  <th className="border border-black p-1">Izin (I)</th>
                  <th className="border border-black p-1">Alpa (A)</th>
                  <th className="border border-black p-1">Dispensasi</th>
                  <th className="border border-black p-1">% Hadir</th>
                </tr>
              </thead>
              <tbody>
                {printingReport.rekapKelas.map(r => (
                  <tr key={r.rombel} className="text-center">
                    <td className="border border-black p-1 font-bold">{r.rombel}</td>
                    <td className="border border-black p-1">{r.jumlahSiswa}</td>
                    <td className="border border-black p-1 font-semibold">{r.hadir}</td>
                    <td className="border border-black p-1">{r.sakit}</td>
                    <td className="border border-black p-1">{r.izin}</td>
                    <td className="border border-black p-1">{r.alpa}</td>
                    <td className="border border-black p-1">{r.dispensasi}</td>
                    <td className="border border-black p-1">{r.persentaseHadir}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="font-bold bg-slate-50 text-center">
                <tr>
                  <td className="border border-black p-1">JUMLAH</td>
                  <td className="border border-black p-1">{printingReport.rekapKelas.reduce((a, b) => a + b.jumlahSiswa, 0)}</td>
                  <td className="border border-black p-1">{printingReport.rekapKelas.reduce((a, b) => a + b.hadir, 0)}</td>
                  <td className="border border-black p-1">{printingReport.rekapKelas.reduce((a, b) => a + b.sakit, 0)}</td>
                  <td className="border border-black p-1">{printingReport.rekapKelas.reduce((a, b) => a + b.izin, 0)}</td>
                  <td className="border border-black p-1">{printingReport.rekapKelas.reduce((a, b) => a + b.alpa, 0)}</td>
                  <td className="border border-black p-1">{printingReport.rekapKelas.reduce((a, b) => a + b.dispensasi, 0)}</td>
                  <td className="border border-black p-1">
                    {(
                      (printingReport.rekapKelas.reduce((a, b) => a + b.hadir, 0) / 
                       printingReport.rekapKelas.reduce((a, b) => a + b.jumlahSiswa, 0)) * 100
                    ).toFixed(1)}%
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Rincian Ketertiban & Tamu */}
            <h3 className="font-bold text-xs uppercase mb-1">B. Catatan Kejadian, Ketertiban & Tamu Sekolah</h3>
            <div className="border border-black p-2.5 mb-6 space-y-2 text-xs">
              <div>
                <strong>1. Siswa Terlambat: </strong>
                {printingReport.catatanKejadian.siswaTerlambat.length === 0 
                  ? 'Nihil.'
                  : printingReport.catatanKejadian.siswaTerlambat.map(st => `${st.namaSiswa} (${st.rombel}, Pkl ${st.jamDatang})`).join('; ')}
              </div>
              <div>
                <strong>2. Siswa Izin Keluar/Pulang Cepat: </strong>
                {printingReport.catatanKejadian.siswaIzinKeluarPulang.length === 0 
                  ? 'Nihil.'
                  : printingReport.catatanKejadian.siswaIzinKeluarPulang.map(el => `${el.namaSiswa} (${el.rombel}, Pkl ${el.jam}, alasan: ${el.alasan})`).join('; ')}
              </div>
              <div>
                <strong>3. Guru Tidak Hadir & Pengganti: </strong>
                {printingReport.catatanKejadian.guruTidakHadirDanKelasKosong.length === 0 
                  ? 'Nihil.'
                  : printingReport.catatanKejadian.guruTidakHadirDanKelasKosong.map(gt => `${gt.namaGuru} (Kelas ${gt.rombel}, Jam ke ${gt.jamKe})`).join('; ')}
              </div>
              <div>
                <strong>4. Tamu Sekolah: </strong>
                {printingReport.catatanKejadian.tamuSekolah.length === 0 
                  ? 'Nihil.'
                  : printingReport.catatanKejadian.tamuSekolah.map(tm => `${tm.nama} dari ${tm.instansi} (${tm.keperluan})`).join('; ')}
              </div>
              <div>
                <strong>5. Catatan Khusus Guru Piket: </strong>
                {printingReport.catatanKejadian.catatanLain || 'Kondisi kegiatan belajar mengajar berjalan kondusif, aman, dan tertib.'}
              </div>
            </div>

            {/* Tanda Tangan */}
            <div className="grid grid-cols-2 text-center text-xs mt-8">
              <div>
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala SMP Negeri 2 Kutasari</p>
                <div className="h-16" />
                <p className="font-bold underline">{school.kepalaSekolah}</p>
                <p>NIP. {school.nipKepalaSekolah}</p>
              </div>
              <div>
                <p>Kutasari, {printingReport.tanggal}</p>
                <p className="font-bold">Guru Piket Bertugas</p>
                <div className="h-16" />
                <p className="font-bold underline">{printingReport.namaGuruPiket[0]}</p>
                <p>NIP. 19780415 200801 1 012</p>
              </div>
            </div>

          </div>
        </PrintModal>
      )}

    </div>
  );
};
