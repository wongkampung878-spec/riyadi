import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  Printer, 
  Edit3, 
  Trash2, 
  FileText, 
  ArrowRightLeft, 
  Calendar,
  CheckCircle2,
  X,
  Eye,
  FileSpreadsheet,
  Copy,
  Check,
  FileCheck,
  HelpCircle,
  Info,
  ClipboardPaste,
  AlertTriangle,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  Database,
  Lock,
  Unlock,
  KeyRound,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useApp } from '../../context/AppContext';
import { Student, StudentStatus } from '../../types';
import { getDynamicRombels } from '../../data/initialData';
import { PrintModal } from '../common/PrintModal';
import { AttendanceSpreadsheetImportModal } from './AttendanceSpreadsheetImportModal';
import { MutasiModule } from '../mutasi/MutasiModule';

export const KesiswaanModule: React.FC = () => {
  const { 
    students, 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    deleteAllStudents,
    cleanCorruptStudents,
    importStudents,
    replaceStudents,
    attendanceRecaps,
    school,
    currentUser
  } = useApp();

  const isAdmin = ['kepala_sekolah', 'kepala_tu', 'staf_tu'].includes(currentUser.role);

  // Proteksi Edit Administrasi Kesiswaan (Sandi: Spendaku212)
  const [isEditUnlocked, setIsEditUnlocked] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingEditAction, setPendingEditAction] = useState<(() => void) | null>(null);

  const handleProtectedAction = (action: () => void) => {
    if (isEditUnlocked) {
      action();
    } else {
      setPendingEditAction(() => action);
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
      if (pendingEditAction) {
        pendingEditAction();
        setPendingEditAction(null);
      }
    } else {
      setPasswordError('Sandi otorisasi salah! Silakan periksa kembali kata sandi Anda.');
    }
  };

  const [activeTab, setActiveTab] = useState<'buku_induk' | 'rombel' | 'mutasi' | 'kehadiran'>('buku_induk');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('aktif');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Modal Hapus Seluruh Siswa (Tahun Ajaran Baru)
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [backupBeforeDelete, setBackupBeforeDelete] = useState(true);
  const [resetAttendanceOption, setResetAttendanceOption] = useState(true);
  const [resetMutationsOption, setResetMutationsOption] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState<string | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  // Template & Import Modal states
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateActiveTab, setTemplateActiveTab] = useState<'download' | 'paste' | 'upload'>('download');
  const [pasteInput, setPasteInput] = useState('');
  const [copiedStatus, setCopiedStatus] = useState(false);
  const [isAttendanceImportOpen, setIsAttendanceImportOpen] = useState(false);

  // Import Preview & Validation state
  const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false);
  const [previewStudents, setPreviewStudents] = useState<Omit<Student, 'id'>[]>([]);
  const [previewFileName, setPreviewFileName] = useState('');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [importSuccessAlert, setImportSuccessAlert] = useState<string | null>(null);
  const [importErrorAlert, setImportErrorAlert] = useState<string | null>(null);
  
  // Print Modal states
  const [printDocType, setPrintDocType] = useState<'buku_induk' | 'surat_aktif' | 'surat_pindah' | 'skl' | 'sktm' | null>(null);
  const [selectedStudentForPrint, setSelectedStudentForPrint] = useState<Student | null>(null);

  // Form State
  const initialFormState: Omit<Student, 'id'> = {
    nisn: '',
    nis: '',
    nama: '',
    nik: '',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2012-01-01',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: '',
    namaAyah: '',
    pekerjaanAyah: '',
    namaIbu: '',
    pekerjaanIbu: '',
    noHpOrtu: '',
    asalSd: '',
    tahunMasuk: 2025,
    kelas: '7',
    rombel: '7A',
    status: 'aktif'
  };

  const [formData, setFormData] = useState<Omit<Student, 'id'>>(initialFormState);

  // Dynamic Rombels: Menggabungkan rombel standar SMPN 2 Kutasari (7A-7F, 8A-8G, 9A-9F) dengan data hasil import/database
  const availableRombels = useMemo(() => getDynamicRombels(students), [students]);
  const [selectedRombelLevel, setSelectedRombelLevel] = useState<'semua' | '7' | '8' | '9'>('semua');

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nisn.includes(searchTerm) ||
      student.nis.includes(searchTerm) ||
      student.alamat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === 'semua' || student.rombel === selectedClass;
    const matchesStatus = selectedStatus === 'semua' || student.status === selectedStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleOpenForm = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData(student);
    } else {
      setEditingStudent(null);
      setFormData(initialFormState);
    }
    setIsFormOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nisn || !formData.nis) {
      alert('Nama, NISN, dan NIS wajib diisi!');
      return;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent(formData);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus data siswa "${name}" dari Buku Induk?`)) {
      deleteStudent(id);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'NISN', 'NIS', 'Nama', 'NIK', 'Tempat Lahir', 'Tanggal Lahir', 'L/P', 'Agama', 'Alamat', 'Nama Ayah', 'Pekerjaan Ayah', 'Nama Ibu', 'Pekerjaan Ibu', 'No HP', 'Asal SD', 'Tahun Masuk', 'Kelas', 'Rombel', 'Status'];
    const rows = filteredStudents.map(s => [
      s.id,
      `'${s.nisn}`,
      `'${s.nis}`,
      `"${s.nama}"`,
      `'${s.nik}`,
      `"${s.tempatLahir}"`,
      s.tanggalLahir,
      s.jenisKelamin,
      s.agama,
      `"${s.alamat}"`,
      `"${s.namaAyah}"`,
      `"${s.pekerjaanAyah}"`,
      `"${s.namaIbu}"`,
      `"${s.pekerjaanIbu}"`,
      `'${s.noHpOrtu}`,
      `"${s.asalSd}"`,
      s.tahunMasuk,
      s.kelas,
      s.rombel,
      s.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DATA_SISWA_SMPN2_KUTASARI_${selectedClass}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Unduh Cadangan Lengkap Seluruh Siswa (Backup sebelum reset/hapus tahun ajaran baru)
  const handleExportAllStudentsBackup = () => {
    const headers = ['ID', 'NISN', 'NIS', 'Nama Lengkap', 'NIK', 'Tempat Lahir', 'Tanggal Lahir', 'L/P', 'Agama', 'Alamat', 'Nama Ayah', 'Pekerjaan Ayah', 'Nama Ibu', 'Pekerjaan Ibu', 'No HP Ortu', 'Asal SD', 'Tahun Masuk', 'Kelas', 'Rombel', 'Status'];
    const rows = students.map(s => [
      s.id,
      `'${s.nisn}`,
      `'${s.nis}`,
      `"${s.nama.replace(/"/g, '""')}"`,
      `'${s.nik}`,
      `"${s.tempatLahir.replace(/"/g, '""')}"`,
      s.tanggalLahir,
      s.jenisKelamin,
      s.agama,
      `"${s.alamat.replace(/"/g, '""')}"`,
      `"${s.namaAyah.replace(/"/g, '""')}"`,
      `"${s.pekerjaanAyah.replace(/"/g, '""')}"`,
      `"${s.namaIbu.replace(/"/g, '""')}"`,
      `"${s.pekerjaanIbu.replace(/"/g, '""')}"`,
      `'${s.noHpOrtu}`,
      `"${(s.asalSd || '').replace(/"/g, '""')}"`,
      s.tahunMasuk,
      s.kelas,
      s.rombel,
      s.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `CADANGAN_DATA_SISWA_SMPN2_KUTASARI_${dateStr}_TAHUN_AJARAN_BARU.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Eksekusi Hapus Seluruh Siswa untuk Tahun Ajaran Baru
  const handleExecuteDeleteAllStudents = async () => {
    if (deleteConfirmationText.trim() !== 'HAPUS') {
      alert('Harap ketik kata "HAPUS" persis untuk mengonfirmasi tindakan.');
      return;
    }

    try {
      setIsDeletingAll(true);
      setDeleteErrorMessage(null);

      // 1. Cadangan Otomatis jika dicentang
      if (backupBeforeDelete && students.length > 0) {
        handleExportAllStudentsBackup();
      }

      // Jeda singkat untuk indikator loading dan proses aman
      await new Promise(resolve => setTimeout(resolve, 800));

      const countBefore = students.length;
      const result = deleteAllStudents({
        resetAttendance: resetAttendanceOption,
        resetMutations: resetMutationsOption
      });

      setIsDeletingAll(false);
      setIsDeleteAllModalOpen(false);
      setDeleteConfirmationText('');
      setDeleteSuccessMessage(
        `Sukses: Seluruh ${result.count ?? countBefore} data siswa telah berhasil dihapus. Database kesiswaan telah disegarkan dan siap menerima data siswa baru untuk tahun ajaran berikutnya.`
      );

      setTimeout(() => {
        setDeleteSuccessMessage(null);
      }, 10000);
    } catch (err: any) {
      setIsDeletingAll(false);
      setDeleteErrorMessage('Terjadi kesalahan saat menghapus data siswa: ' + (err?.message || 'Proses gagal. Silakan coba kembali.'));
    }
  };

  // Download Sample Template Excel (.xlsx) Resmi SMPN 2 Kutasari
  const handleDownloadExcelTemplate = () => {
    try {
      const wb = XLSX.utils.book_new();

      const headers = [
        'No',
        'NISN (*)',
        'NIS (*)',
        'Nama Lengkap Siswa (*)',
        'NIK (16 Digit)',
        'Tempat Lahir',
        'Tanggal Lahir (YYYY-MM-DD) (*)',
        'Jenis Kelamin (L/P) (*)',
        'Agama',
        'Alamat Lengkap',
        'Nama Ayah Kandung',
        'Pekerjaan Ayah',
        'Nama Ibu Kandung',
        'Pekerjaan Ibu',
        'No. HP / WA Ortu',
        'Asal SD / MI',
        'Tahun Masuk',
        'Kelas (7/8/9)',
        'Rombel (*)'
      ];

      const sampleData = [
        [1, '0123456789', '8550', 'Aditya Pratama', '3303051508120001', 'Purbalingga', '2012-08-15', 'L', 'Islam', 'Desa Meri RT 02 RW 01 Kec. Kutasari', 'Bambang Irawan', 'Petani', 'Siti Aminah', 'Pedagang', '081234567890', 'SDN 1 Meri', 2025, '7', '7A'],
        [2, '0123456790', '8551', 'Annisa Rahmawati', '3303055209120002', 'Purbalingga', '2012-09-12', 'P', 'Islam', 'Desa Kutasari RT 05 RW 02 Kec. Kutasari', 'Supriyanto', 'Wiraswasta', 'Nur Hayati', 'Guru', '081398765432', 'SDN 2 Kutasari', 2025, '7', '7F'],
        [3, '0123456791', '8552', 'Bagas Dwi Saputra', '3303051010120003', 'Banyumas', '2012-10-10', 'L', 'Islam', 'Desa Karangreja RT 01 RW 04 Kec. Kutasari', 'Wahyudi', 'Karyawan Swasta', 'Sri Mulyani', 'Ibu Rumah Tangga', '085212345678', 'SDN 1 Karangreja', 2025, '8', '8A'],
        [4, '0123456792', '8553', 'Citra Dewi Lestari', '3303054511120004', 'Purbalingga', '2012-11-05', 'P', 'Islam', 'Desa Tobong RT 03 RW 01 Kec. Kutasari', 'Ahmad Fauzi', 'PNS', 'Dewi Sartika', 'Bidan', '087812349999', 'SDN 1 Tobong', 2025, '8', '8G'],
        [5, '0123456793', '8554', 'Dika Kurniawan', '3303052012120005', 'Purbalingga', '2012-12-20', 'L', 'Islam', 'Desa Karanglewas RT 04 RW 02 Kec. Kutasari', 'Joko Widodo', 'Peternak', 'Sumiyati', 'Pedagang', '089611223344', 'SDN 2 Karanglewas', 2025, '9', '9F']
      ];

      const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);

      ws['!cols'] = [
        { wch: 6 },
        { wch: 14 },
        { wch: 10 },
        { wch: 28 },
        { wch: 20 },
        { wch: 16 },
        { wch: 18 },
        { wch: 8 },
        { wch: 12 },
        { wch: 38 },
        { wch: 20 },
        { wch: 18 },
        { wch: 20 },
        { wch: 18 },
        { wch: 16 },
        { wch: 20 },
        { wch: 14 },
        { wch: 8 },
        { wch: 10 }
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'BUKU_INDUK_SISWA');

      const petunjuk = [
        ['PETUNJUK PENGISIAN TEMPLATE EXCEL BUKU INDUK SISWA SMP NEGERI 2 KUTASARI'],
        [''],
        ['1. Format berkas ini dibuat khusus untuk kemudahan input data siswa SIMTU SMPN 2 Kutasari.'],
        ['2. Kolom bertanda (*) WAJIB DIISI: NISN, NIS, Nama Lengkap Siswa, Tanggal Lahir, Jenis Kelamin (L/P), dan Rombel.'],
        ['3. Penulisan NISN 10 digit, NIK 16 digit, dan No HP diawali tanda petik tunggal (\') jika diketik manual agar angka 0 di depan tidak hilang.'],
        ['4. Format Tanggal Lahir disarankan: YYYY-MM-DD (contoh: 2012-08-15) atau format Tanggal standar Microsoft Excel.'],
        ['5. Kolom Jenis Kelamin diisi "L" untuk Laki-laki atau "P" untuk Perempuan.'],
        ['6. Kolom Rombel diisi nama rombel resmi SMPN 2 Kutasari: Kelas 7 (7A, 7B, 7C, 7D, 7E, 7F), Kelas 8 (8A, 8B, 8C, 8D, 8E, 8F, 8G), Kelas 9 (9A, 9B, 9C, 9D, 9E, 9F).'],
        ['7. Hapus 5 baris contoh siswa di atas sebelum mengisi data siswa riil sekolah Anda, atau biarkan tertimpa saat import.'],
        ['8. Simpan berkas sebagai file Excel (.xlsx atau .xls) lalu impor kembali pada menu Kesiswaan.']
      ];
      const wsPetunjuk = XLSX.utils.aoa_to_sheet(petunjuk);
      wsPetunjuk['!cols'] = [{ wch: 100 }];
      XLSX.utils.book_append_sheet(wb, wsPetunjuk, 'PETUNJUK_PENGISIAN');

      XLSX.writeFile(wb, 'TEMPLATE_BUKU_INDUK_SISWA_SMPN2_KUTASARI.xlsx');
    } catch (err) {
      console.error('Gagal generate Excel template:', err);
      handleDownloadTemplate();
    }
  };

  // Download Sample Template CSV
  const handleDownloadTemplate = () => {
    const headers = ['NISN', 'NIS', 'Nama Lengkap', 'NIK', 'Tempat Lahir', 'Tanggal Lahir (YYYY-MM-DD)', 'Jenis Kelamin (L/P)', 'Agama', 'Alamat Lengkap', 'Nama Ayah', 'Pekerjaan Ayah', 'Nama Ibu', 'Pekerjaan Ibu', 'No HP Ortu', 'Asal SD', 'Tahun Masuk', 'Kelas (7/8/9)', 'Rombel (7A/8A/dsb)'];
    const sampleRow = ['0123456789', '8550', 'Budi Santoso', '3303051010120001', 'Purbalingga', '2012-10-10', 'L', 'Islam', 'Desa Tobong RT 01 RW 01 Kec. Kutasari', 'Joko Susanto', 'Petani', 'Siti Fatimah', 'Pedagang', '081234567890', 'SDN 1 Tobong', '2025', '7', '7A'];
    
    const csvContent = '\uFEFF' + [headers.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'TEMPLATE_IMPORT_SISWA_SMPN2KTS.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to normalize religion field to Student['agama']
  const normalizeAgama = (val?: string): Student['agama'] => {
    if (!val) return 'Islam';
    const clean = val.trim().toLowerCase();
    if (clean.includes('kristen') || clean.includes('protestan')) return 'Kristen';
    if (clean.includes('katolik')) return 'Katolik';
    if (clean.includes('hindu')) return 'Hindu';
    if (clean.includes('bud')) return 'Buddha';
    if (clean.includes('kong')) return 'Konghucu';
    return 'Islam';
  };

  // Helper untuk menormalisasi Rombel & Kelas secara cerdas:
  // Mendukung: 7A-7F, 8A-8G, 9A-9F, angka romawi (VII, VIII, IX), serta jika kolom rombel hanya berisi huruf 'A'-'G'
  const normalizeStudentRombel = (rawRombel?: any, rawKelas?: any): { rombel: string; kelas: string } => {
    let rStr = String(rawRombel || '').trim().toUpperCase().replace(/[\s\-_]/g, '');
    let kStr = String(rawKelas || '').trim().toUpperCase().replace(/[\s\-_]/g, '');

    rStr = rStr.replace(/^KELAS/i, '').replace(/^ROMBEL/i, '');
    kStr = kStr.replace(/^KELAS/i, '').replace(/^ROMBEL/i, '');

    // Konversi angka romawi: VIII -> 8, VII -> 7, IX -> 9
    rStr = rStr.replace(/^VIII/i, '8').replace(/^VII/i, '7').replace(/^IX/i, '9');
    kStr = kStr.replace(/^VIII/i, '8').replace(/^VII/i, '7').replace(/^IX/i, '9');

    // Jika kolom rombel hanya berupa huruf tunggal 'A'-'Z' dan kolom kelas berupa angka 7/8/9
    if (/^[A-Z]$/.test(rStr) && /^[789]$/.test(kStr)) {
      rStr = kStr + rStr;
    }

    // Jika kolom kelas justru berisi nama rombel lengkap (cth: '8G') dan kolom rombel kosong
    if (/^[789][A-Z]$/.test(kStr) && !/^[789][A-Z]$/.test(rStr)) {
      rStr = kStr;
    }

    // Cocokkan pola angka jenjang (7/8/9) diikuti huruf rombel (A/B/C/D/E/F/G/dsb)
    const match = rStr.match(/([789])([A-Z]+)/);
    if (match) {
      return {
        rombel: `${match[1]}${match[2]}`,
        kelas: match[1]
      };
    }

    // Fallback: Jika hanya jenjang yang terdeteksi
    if (/^[789]$/.test(rStr) || /^[789]$/.test(kStr)) {
      const tingkat = /^[789]$/.test(rStr) ? rStr : kStr;
      return {
        rombel: `${tingkat}A`,
        kelas: tingkat
      };
    }

    return {
      rombel: '7A',
      kelas: '7'
    };
  };

  // Helper to detect if a student record is corrupted by binary characters from invalid import
  const isCorruptStudent = (s: Student): boolean => {
    if (/\uFFFD/.test(s.nama) || /\uFFFD/.test(s.nisn) || /\uFFFD/.test(s.nis)) return true;
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(s.nama)) return true;
    const letters = s.nama.replace(/[^a-zA-Z]/g, '');
    if (letters.length < 2 && s.nama.length > 3) return true;
    return false;
  };

  const corruptStudentsCount = students.filter(isCorruptStudent).length;

  const handleCleanCorruptData = () => {
    handleProtectedAction(() => {
      const removed = cleanCorruptStudents();
      setDeleteSuccessMessage(`Berhasil membersihkan ${removed} data siswa rusak/karakter biner tidak terbaca!`);
    });
  };

  // Helper to check if a string is a valid student name and not binary garbage
  const isValidStudentName = (nama: any): boolean => {
    if (!nama) return false;
    const str = String(nama).trim();
    if (str.length < 2) return false;
    const lower = str.toLowerCase();
    if (
      lower.includes('nama lengkap') || 
      lower.includes('nama siswa') || 
      lower.includes('peserta didik') || 
      lower.includes('petunjuk') || 
      lower.includes('smp negeri') || 
      lower.includes('format template')
    ) {
      return false;
    }
    if (/\uFFFD/.test(str)) return false;
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(str)) return false;
    const letters = str.replace(/[^a-zA-Z]/g, '');
    if (letters.length < 2) return false;
    return true;
  };

  // Helper to format date from Excel cells or text
  const formatExcelDate = (val: any): string => {
    if (!val) return '2012-01-01';
    if (val instanceof Date && !isNaN(val.getTime())) {
      const y = val.getFullYear();
      const m = String(val.getMonth() + 1).padStart(2, '0');
      const d = String(val.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    const str = String(val).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    const dmy = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
    if (dmy) {
      const d = dmy[1].padStart(2, '0');
      const m = dmy[2].padStart(2, '0');
      const y = dmy[3];
      return `${y}-${m}-${d}`;
    }
    const num = Number(str);
    if (!isNaN(num) && num > 20000 && num < 60000) {
      const date = new Date((num - (25567 + 2)) * 86400 * 1000);
      if (!isNaN(date.getTime())) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
    }
    return '2012-01-01';
  };

  // Helper to clean numeric string like NISN, NIS, NIK, No HP
  const cleanNumericStr = (val: any, padLength?: number): string => {
    if (val === null || val === undefined) return '';
    let s = String(val).trim().replace(/^'/, '').replace(/\.0+$/, '');
    s = s.replace(/[^\d]/g, '');
    if (padLength && s.length === padLength - 1) {
      s = '0' + s;
    }
    return s;
  };

  // Robust parser for Excel workbooks (.xlsx, .xls, .csv) using SheetJS
  const parseStudentSpreadsheet = (buffer: ArrayBuffer): Omit<Student, 'id'>[] => {
    const result: Omit<Student, 'id'>[] = [];
    try {
      const data = new Uint8Array(buffer);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      
      let sheetName = workbook.SheetNames[0];
      const candidate = workbook.SheetNames.find(n => 
        n.toLowerCase().includes('siswa') || n.toLowerCase().includes('induk')
      );
      if (candidate) sheetName = candidate;

      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) return [];

      const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: '' });
      if (!rawRows || rawRows.length === 0) return [];

      // Find header row index by looking for column keywords
      let headerRowIdx = -1;
      let colMap: Record<string, number> = {};

      for (let r = 0; r < Math.min(rawRows.length, 15); r++) {
        const row = rawRows[r];
        if (!Array.isArray(row)) continue;
        const rowTexts = row.map(c => String(c || '').trim().toLowerCase());
        
        const hasNama = rowTexts.some(t => t.includes('nama') || t.includes('peserta didik'));
        const hasNisnOrNis = rowTexts.some(t => t.includes('nisn') || t.includes('nis') || t.includes('rombel') || t.includes('kelas'));

        if (hasNama && hasNisnOrNis) {
          headerRowIdx = r;
          rowTexts.forEach((t, colIdx) => {
            if ((t.includes('nama') || t.includes('peserta didik')) && !t.includes('ayah') && !t.includes('ibu') && !t.includes('wali') && !t.includes('sekolah') && colMap.nama === undefined) {
              colMap.nama = colIdx;
            } else if (t.includes('nisn') && colMap.nisn === undefined) {
              colMap.nisn = colIdx;
            } else if ((t === 'nis' || t.includes('induk') || t.includes('nipd')) && colMap.nis === undefined) {
              colMap.nis = colIdx;
            } else if ((t.includes('nik') || t.includes('ktp')) && colMap.nik === undefined) {
              colMap.nik = colIdx;
            } else if ((t.includes('tempat') || t.includes('tmp')) && colMap.tempatLahir === undefined) {
              colMap.tempatLahir = colIdx;
            } else if ((t.includes('tanggal') || t.includes('tgl') || (t.includes('lahir') && !t.includes('tempat'))) && colMap.tanggalLahir === undefined) {
              colMap.tanggalLahir = colIdx;
            } else if ((t.includes('jk') || t.includes('jenis kelamin') || t.includes('kelamin') || t.includes('l/p')) && colMap.jk === undefined) {
              colMap.jk = colIdx;
            } else if (t.includes('agama') && colMap.agama === undefined) {
              colMap.agama = colIdx;
            } else if ((t.includes('alamat') || t.includes('domisili') || t.includes('desa')) && colMap.alamat === undefined) {
              colMap.alamat = colIdx;
            } else if ((t.includes('ayah') || t.includes('bapak')) && t.includes('nama') && colMap.namaAyah === undefined) {
              colMap.namaAyah = colIdx;
            } else if ((t.includes('ayah') || t.includes('bapak')) && (t.includes('pekerjaan') || t.includes('kerja')) && colMap.pekerjaanAyah === undefined) {
              colMap.pekerjaanAyah = colIdx;
            } else if (t.includes('ibu') && t.includes('nama') && colMap.namaIbu === undefined) {
              colMap.namaIbu = colIdx;
            } else if (t.includes('ibu') && (t.includes('pekerjaan') || t.includes('kerja')) && colMap.pekerjaanIbu === undefined) {
              colMap.pekerjaanIbu = colIdx;
            } else if ((t.includes('hp') || t.includes('telp') || t.includes('wa') || t.includes('telepon')) && colMap.noHp === undefined) {
              colMap.noHp = colIdx;
            } else if ((t.includes('asal') || t.includes('sd') || t.includes('sekolah')) && colMap.asalSd === undefined) {
              colMap.asalSd = colIdx;
            } else if (t.includes('tahun') && colMap.tahunMasuk === undefined) {
              colMap.tahunMasuk = colIdx;
            } else if (t.includes('kelas') && !t.includes('wali') && colMap.kelas === undefined) {
              colMap.kelas = colIdx;
            } else if (t.includes('rombel') && colMap.rombel === undefined) {
              colMap.rombel = colIdx;
            }
          });
          break;
        }
      }

      // Default column mapping if header text matching wasn't found
      if (headerRowIdx === -1) {
        headerRowIdx = 0;
        colMap = {
          nisn: 1,
          nis: 2,
          nama: 3,
          nik: 4,
          tempatLahir: 5,
          tanggalLahir: 6,
          jk: 7,
          agama: 8,
          alamat: 9,
          namaAyah: 10,
          pekerjaanAyah: 11,
          namaIbu: 12,
          pekerjaanIbu: 13,
          noHp: 14,
          asalSd: 15,
          tahunMasuk: 16,
          kelas: 17,
          rombel: 18
        };
      }

      const startRow = headerRowIdx + 1;
      for (let r = startRow; r < rawRows.length; r++) {
        const row = rawRows[r];
        if (!Array.isArray(row) || row.length === 0) continue;

        const namaCell = colMap.nama !== undefined ? row[colMap.nama] : row[3];
        if (!isValidStudentName(namaCell)) continue;

        const nama = String(namaCell).trim();
        let rawNisn = colMap.nisn !== undefined ? row[colMap.nisn] : row[1];
        let rawNis = colMap.nis !== undefined ? row[colMap.nis] : row[2];
        let rawNik = colMap.nik !== undefined ? row[colMap.nik] : row[4];
        let rawTempat = colMap.tempatLahir !== undefined ? row[colMap.tempatLahir] : row[5];
        let rawTanggal = colMap.tanggalLahir !== undefined ? row[colMap.tanggalLahir] : row[6];
        let rawJk = colMap.jk !== undefined ? row[colMap.jk] : row[7];
        let rawAgama = colMap.agama !== undefined ? row[colMap.agama] : row[8];
        let rawAlamat = colMap.alamat !== undefined ? row[colMap.alamat] : row[9];
        let rawNamaAyah = colMap.namaAyah !== undefined ? row[colMap.namaAyah] : row[10];
        let rawPekAyah = colMap.pekerjaanAyah !== undefined ? row[colMap.pekerjaanAyah] : row[11];
        let rawNamaIbu = colMap.namaIbu !== undefined ? row[colMap.namaIbu] : row[12];
        let rawPekIbu = colMap.pekerjaanIbu !== undefined ? row[colMap.pekerjaanIbu] : row[13];
        let rawNoHp = colMap.noHp !== undefined ? row[colMap.noHp] : row[14];
        let rawAsalSd = colMap.asalSd !== undefined ? row[colMap.asalSd] : row[15];
        let rawTahun = colMap.tahunMasuk !== undefined ? row[colMap.tahunMasuk] : row[16];
        let rawKelas = colMap.kelas !== undefined ? row[colMap.kelas] : row[17];
        let rawRombel = colMap.rombel !== undefined ? row[colMap.rombel] : row[18];

        const nisn = cleanNumericStr(rawNisn, 10) || `012${Math.floor(Math.random() * 899999 + 100000)}`;
        const nis = cleanNumericStr(rawNis) || `${Math.floor(Math.random() * 800 + 8000)}`;
        const nik = cleanNumericStr(rawNik, 16) || '3303051234567890';
        const tempatLahir = String(rawTempat || 'Purbalingga').trim();
        const tanggalLahir = formatExcelDate(rawTanggal);
        
        const jkStr = String(rawJk || 'L').trim().toUpperCase();
        const jenisKelamin: 'L' | 'P' = (jkStr === 'P' || jkStr.startsWith('PER') || jkStr === 'WANITA') ? 'P' : 'L';
        const agama = normalizeAgama(String(rawAgama || 'Islam'));
        const alamat = String(rawAlamat || 'Kec. Kutasari, Kab. Purbalingga').trim();

        // Normalisasi Rombel & Kelas menggunakan normalizeStudentRombel
        const { rombel, kelas } = normalizeStudentRombel(rawRombel, rawKelas);

        result.push({
          nisn,
          nis,
          nama,
          nik,
          tempatLahir,
          tanggalLahir,
          jenisKelamin,
          agama,
          alamat,
          namaAyah: String(rawNamaAyah || 'Wali Siswa').trim(),
          pekerjaanAyah: String(rawPekAyah || 'Wiraswasta').trim(),
          namaIbu: String(rawNamaIbu || 'Ibu Siswa').trim(),
          pekerjaanIbu: String(rawPekIbu || 'Ibu Rumah Tangga').trim(),
          noHpOrtu: cleanNumericStr(rawNoHp) || '08123456789',
          asalSd: String(rawAsalSd || 'SD Negeri di Kutasari').trim(),
          tahunMasuk: Number(rawTahun) || new Date().getFullYear(),
          kelas,
          rombel,
          status: 'aktif'
        });
      }
    } catch (err) {
      console.error('Gagal membaca spreadsheet:', err);
    }
    return result;
  };

  // Parser for pasted text from Excel (tab-delimited or comma-separated)
  const parsePastedStudentText = (rawText: string): Omit<Student, 'id'>[] => {
    const result: Omit<Student, 'id'>[] = [];
    if (!rawText.trim()) return result;

    const lines = rawText.split(/\r?\n/).filter(line => line.trim().length > 0);
    for (const line of lines) {
      let delimiter = '\t';
      if (line.includes('\t')) delimiter = '\t';
      else if (line.includes(';') && !line.includes(',')) delimiter = ';';
      else if (line.includes(',')) delimiter = ',';

      const parts = line.split(delimiter).map(p => p.trim().replace(/^"|"$/g, '').replace(/^'/, ''));
      if (parts.length >= 2) {
        // Cek jika kolom pertama adalah nomor urut
        const hasNumPrefix = /^\d+$/.test(parts[0]) && parts.length >= 3 && parts[0].length <= 3;
        const offset = hasNumPrefix ? 1 : 0;
        const namaCandidate = parts[offset + 2] || parts[offset + 1] || parts[1];

        if (isValidStudentName(namaCandidate)) {
          const nisn = cleanNumericStr(parts[offset], 10) || `012${Math.floor(Math.random() * 899999 + 100000)}`;
          const nis = cleanNumericStr(parts[offset + 1]) || `${Math.floor(Math.random() * 800 + 8000)}`;
          const nama = namaCandidate;
          const nik = cleanNumericStr(parts[offset + 3], 16) || '3303051234567890';
          const tempatLahir = parts[offset + 4] || 'Purbalingga';
          const tanggalLahir = formatExcelDate(parts[offset + 5]);
          const jkStr = (parts[offset + 6] || 'L').toUpperCase();
          const jenisKelamin: 'L' | 'P' = (jkStr === 'P' || jkStr.startsWith('PER')) ? 'P' : 'L';
          const agama = normalizeAgama(parts[offset + 7]);
          const alamat = parts[offset + 8] || 'Kec. Kutasari, Kab. Purbalingga';

          const { rombel, kelas } = normalizeStudentRombel(parts[offset + 17], parts[offset + 16]);

          result.push({
            nisn,
            nis,
            nama,
            nik,
            tempatLahir,
            tanggalLahir,
            jenisKelamin,
            agama,
            alamat,
            namaAyah: parts[offset + 9] || 'Wali Siswa',
            pekerjaanAyah: parts[offset + 10] || 'Wiraswasta',
            namaIbu: parts[offset + 11] || 'Ibu Siswa',
            pekerjaanIbu: parts[offset + 12] || 'Ibu Rumah Tangga',
            noHpOrtu: cleanNumericStr(parts[offset + 13]) || '08123456789',
            asalSd: parts[offset + 14] || 'SD Negeri di Kutasari',
            tahunMasuk: Number(parts[offset + 15]) || new Date().getFullYear(),
            kelas,
            rombel,
            status: 'aktif'
          });
        }
      }
    }
    return result;
  };

  // Handle File Import: Read as ArrayBuffer for clean Excel (.xlsx/.xls) parsing
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const buffer = event.target?.result as ArrayBuffer;
        const imported = parseStudentSpreadsheet(buffer);

        if (imported.length > 0) {
          setPreviewStudents(imported);
          setPreviewFileName(file.name);
          setImportMode('append');
          setIsImportPreviewOpen(true);
          setIsTemplateModalOpen(false);
        } else {
          setImportErrorAlert(
            `File "${file.name}" tidak memuat data siswa yang dapat dikenali. Pastikan file berformat Excel (.xlsx/.xls) atau CSV dengan susunan kolom sesuai Template Resmi SMPN 2 Kutasari.`
          );
        }
      } catch (err: any) {
        console.error('Error membaca file import:', err);
        setImportErrorAlert(`Gagal memproses file "${file.name}": ${err?.message || 'Format tidak didukung'}`);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  // Handle Pasted Data Import from Excel
  const handleImportPastedData = () => {
    if (!pasteInput.trim()) {
      alert('Silakan tempel (paste) data dari lembar kerja Excel terlebih dahulu!');
      return;
    }
    const imported = parsePastedStudentText(pasteInput);
    if (imported.length > 0) {
      setPreviewStudents(imported);
      setPreviewFileName('Data Tempel Clipboard Excel');
      setImportMode('append');
      setIsImportPreviewOpen(true);
      setIsTemplateModalOpen(false);
    } else {
      alert('Tidak ada data siswa yang valid terdeteksi dari teks yang ditempelkan. Pastikan kolom memuat Nama Siswa, NISN, NIS, dan Rombel.');
    }
  };

  // Handle Final Confirmation from Import Preview Dialog
  const handleConfirmImport = () => {
    handleProtectedAction(() => {
      if (previewStudents.length === 0) return;
      if (importMode === 'replace') {
        replaceStudents(previewStudents);
        setImportSuccessAlert(`Buku Induk berhasil diperbarui secara penuh dengan ${previewStudents.length} data siswa baru dari ${previewFileName}!`);
      } else {
        importStudents(previewStudents);
        setImportSuccessAlert(`Berhasil menambahkan ${previewStudents.length} siswa baru ke dalam Buku Induk dari ${previewFileName}!`);
      }
      setIsImportPreviewOpen(false);
      setPreviewStudents([]);
      setPasteInput('');
    });
  };

  // Open Document Print
  const handlePrintDocument = (docType: 'buku_induk' | 'surat_aktif' | 'surat_pindah' | 'skl' | 'sktm', student: Student) => {
    setSelectedStudentForPrint(student);
    setPrintDocType(docType);
  };

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-700" />
            Administrasi Kesiswaan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Buku Induk, pembagian rombongan belajar, mutasi, kehadiran bulanan, dan penerbitan surat resmi siswa.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Tombol Proteksi Edit Kesiswaan (Sandi: Spendaku212) */}
          {!isEditUnlocked ? (
            <button
              onClick={() => {
                setPendingEditAction(null);
                setPasswordInput('');
                setPasswordError(null);
                setIsPasswordModalOpen(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Aksi edit diproteksi kata sandi Spendaku212. Klik untuk membuka otorisasi."
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Proteksi Edit: Terkunci</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditUnlocked(false)}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs group"
              title="Akses edit kesiswaan terbuka (Spendaku212). Klik untuk mengunci kembali."
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Akses Edit: Terbuka</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-200/60 px-1.5 py-0.5 rounded ml-0.5 group-hover:bg-emerald-300">
                Kunci
              </span>
            </button>
          )}

          {/* Tombol Hapus Seluruh Siswa (Akses Khusus Admin) */}
          {isAdmin && (
            <button
              onClick={() => {
                setDeleteConfirmationText('');
                setDeleteErrorMessage(null);
                setIsDeleteAllModalOpen(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 hover:border-red-600 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs group"
              title="Aksi Khusus: Hapus seluruh data siswa untuk persiapan tahun ajaran baru (Akses Admin)"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600 group-hover:text-white transition-colors" />
              <span>Hapus Seluruh Siswa</span>
              <span className="text-[10px] bg-red-200/80 group-hover:bg-red-700 text-red-800 group-hover:text-red-100 px-1.5 py-0.5 rounded font-mono">
                T.A Baru
              </span>
            </button>
          )}

          {/* Tab Navigation */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200">
            <button
              onClick={() => setActiveTab('buku_induk')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'buku_induk' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buku Induk Siswa
            </button>
            <button
              onClick={() => setActiveTab('rombel')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'rombel' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rombel & Kelas
            </button>
            <button
              onClick={() => setActiveTab('mutasi')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'mutasi' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mutasi Siswa
            </button>
            <button
              onClick={() => setActiveTab('kehadiran')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'kehadiran' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rekap Kehadiran
            </button>
          </div>
        </div>
      </div>

      {/* Alert Notifikasi Sukses Hapus Seluruh Siswa */}
      {deleteSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-150">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-950">Aksi Berhasil!</p>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">{deleteSuccessMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setDeleteSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Alert Notifikasi Sukses Impor Siswa */}
      {importSuccessAlert && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-150">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-950">Impor Data Siswa Berhasil!</p>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">{importSuccessAlert}</p>
            </div>
          </div>
          <button
            onClick={() => setImportSuccessAlert(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Alert Error Impor */}
      {importErrorAlert && (
        <div className="bg-rose-50 border border-rose-300 text-rose-900 px-4 py-3 rounded-xl flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-150">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-rose-950">Kendala Berkas Impor</p>
              <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">{importErrorAlert}</p>
            </div>
          </div>
          <button
            onClick={() => setImportErrorAlert(null)}
            className="text-rose-700 hover:text-rose-900 p-1 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Alert Terdeteksi Data Siswa Rusak / Karakter Biner Tidak Terbaca */}
      {corruptStudentsCount > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 text-amber-950 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs animate-in fade-in duration-150">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-950">
                Terdeteksi {corruptStudentsCount} Data Siswa Rusak (Karakter Biner Tidak Terbaca)
              </h4>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                Terdapat baris data siswa yang rusak seperti tanda tanya (??) atau karakter acak akibat file Excel yang sebelumnya dibaca sebagai teks mentah. Bersihkan data rusak ini secara aman dengan satu klik.
              </p>
            </div>
          </div>
          <button
            onClick={handleCleanCorruptData}
            className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Bersihkan {corruptStudentsCount} Data Rusak
          </button>
        </div>
      )}

      {/* TAB 1: BUKU INDUK SISWA */}
      {activeTab === 'buku_induk' && (
        <div className="space-y-4">
          {/* BANNER TAHUN AJARAN BARU JIKA DATA SISWA KOSONG */}
          {students.length === 0 && (
            <div className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 border-2 border-dashed border-blue-300 rounded-2xl p-7 text-center shadow-xs">
              <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Buku Induk Kosong (Siap Tahun Ajaran Baru)</h3>
              <p className="text-xs text-slate-600 max-w-lg mx-auto mt-1 mb-5 leading-relaxed">
                Seluruh data siswa telah dibersihkan untuk pergantian tahun ajaran baru. Anda dapat langsung mengimpor daftar peserta didik baru menggunakan file Excel resmi atau menambahkan siswa secara manual.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setTemplateActiveTab('upload');
                    setIsTemplateModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <Upload className="w-4 h-4" />
                  Impor Data Siswa Baru (Excel / CSV)
                </button>
                <button
                  onClick={handleDownloadExcelTemplate}
                  className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  Unduh Template Excel Resmi (.xls)
                </button>
                <button
                  onClick={() => handleProtectedAction(() => handleOpenForm())}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                  Tambah Siswa Manual
                </button>
              </div>
            </div>
          )}

          {/* Action & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama, NISN, NIS, alamat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              {/* Filter Kelas */}
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="semua">Semua Rombel ({availableRombels.length} Rombel)</option>
                {availableRombels.map(r => (
                  <option key={r} value={r}>Rombel {r}</option>
                ))}
              </select>

              {/* Filter Status */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="semua">Semua Status</option>
                <option value="aktif">Siswa Aktif</option>
                <option value="lulus">Sudah Lulus</option>
                <option value="mutasi_keluar">Mutasi Keluar</option>
                <option value="putus_sekolah">Putus Sekolah</option>
              </select>
            </div>

            {/* Right Buttons: Add, Excel Template, Import, Export */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsTemplateModalOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Format & Panduan Template Excel Buku Induk Siswa"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                Template Excel
              </button>

              <button
                onClick={handleDownloadTemplate}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Unduh Format Template CSV Standar"
              >
                Template CSV
              </button>

              <div className="relative inline-flex items-center">
                <button
                  onClick={() => {
                    setTemplateActiveTab('upload');
                    setIsTemplateModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Import Siswa dari Excel / CSV"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Import Siswa
                </button>
              </div>

              <button
                onClick={handleExportCsv}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                title="Ekspor Siswa ke CSV/Excel"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>

              <button
                onClick={() => handleProtectedAction(() => handleOpenForm())}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Tambah Siswa
              </button>
            </div>
          </div>

          {/* Tabel Buku Induk Siswa */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold tracking-wider text-[11px]">
                    <th className="py-3 px-4">No</th>
                    <th className="py-3 px-4">NISN / NIS</th>
                    <th className="py-3 px-4">Nama Lengkap & NIK</th>
                    <th className="py-3 px-4">L/P</th>
                    <th className="py-3 px-4">Kelas/Rombel</th>
                    <th className="py-3 px-4">Tempat, Tanggal Lahir</th>
                    <th className="py-3 px-4">Orang Tua & Alamat</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Cetak Surat</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, idx) => (
                      <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-slate-900 block">{student.nisn}</span>
                          <span className="text-[10px] text-slate-500 font-mono">NIS: {student.nis}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-blue-950 block">{student.nama}</span>
                          <span className="text-[10px] text-slate-500 font-mono">NIK: {student.nik}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            student.jenisKelamin === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                          }`}>
                            {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {student.rombel}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {student.tempatLahir}, {student.tanggalLahir}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-800 font-medium block">{student.namaAyah} ({student.pekerjaanAyah})</span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">{student.alamat}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            student.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' :
                            student.status === 'lulus' ? 'bg-blue-100 text-blue-800' :
                            student.status === 'mutasi_keluar' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {student.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handlePrintDocument('buku_induk', student)}
                              title="Cetak Lembar Buku Induk"
                              className="p-1 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handlePrintDocument('surat_aktif', student)}
                              title="Cetak Surat Keterangan Aktif"
                              className="p-1 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleProtectedAction(() => handleOpenForm(student))}
                              className={`p-1 rounded cursor-pointer transition-colors ${
                                isEditUnlocked 
                                  ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50' 
                                  : 'text-slate-500 hover:text-amber-700 hover:bg-amber-50'
                              }`}
                              title={isEditUnlocked ? "Edit Data Siswa" : "Edit Siswa (Terproteksi Sandi: Spendaku212)"}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleProtectedAction(() => handleDelete(student.id, student.nama))}
                              className="p-1 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                              title={isEditUnlocked ? "Hapus Siswa" : "Hapus Siswa (Terproteksi Sandi: Spendaku212)"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-10 text-center text-slate-400">
                        {students.length === 0 ? (
                          <div className="space-y-1.5 py-4">
                            <p className="font-semibold text-slate-700 text-sm">Buku Induk Siswa Masih Kosong</p>
                            <p className="text-xs text-slate-500 max-w-md mx-auto">
                              Seluruh data siswa telah dibersihkan. Gunakan tombol "Impor Data Siswa Baru" di atas untuk memasukkan data siswa tahun ajaran baru.
                            </p>
                          </div>
                        ) : (
                          'Tidak ada data siswa yang cocok dengan filter pencarian.'
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Record summary */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Menampilkan {filteredStudents.length} dari {students.length} siswa</span>
              <span className="font-medium text-slate-700">Tahun Ajaran: {school.tahunAjaranAktif}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROMBEL & KELAS */}
      {activeTab === 'rombel' && (() => {
        const displayedRombels = availableRombels.filter(r => {
          if (selectedRombelLevel === 'semua') return true;
          return r.startsWith(selectedRombelLevel);
        });

        const activeStudentsList = students.filter(s => s.status === 'aktif');
        const displayedStudents = activeStudentsList.filter(s => displayedRombels.includes(s.rombel));
        const totalL = displayedStudents.filter(s => s.jenisKelamin === 'L').length;
        const totalP = displayedStudents.filter(s => s.jenisKelamin === 'P').length;

        const count7 = availableRombels.filter(r => r.startsWith('7')).length;
        const count8 = availableRombels.filter(r => r.startsWith('8')).length;
        const count9 = availableRombels.filter(r => r.startsWith('9')).length;

        return (
          <div className="space-y-4">
            {/* Header & Filter Level */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Rombongan Belajar (Rombel) SMP Negeri 2 Kutasari — TA {school.tahunAjaranAktif}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Struktur Resmi: Kelas 7 (7A-7F: 6 Rombel), Kelas 8 (8A-8G: 7 Rombel), Kelas 9 (9A-9F: 6 Rombel) — Total {availableRombels.length} Rombel
                  </p>
                </div>

                {/* Level Tabs */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setSelectedRombelLevel('semua')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      selectedRombelLevel === 'semua'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua ({availableRombels.length})
                  </button>
                  <button
                    onClick={() => setSelectedRombelLevel('7')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      selectedRombelLevel === '7'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Kelas 7 ({count7})
                  </button>
                  <button
                    onClick={() => setSelectedRombelLevel('8')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      selectedRombelLevel === '8'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Kelas 8 ({count8})
                  </button>
                  <button
                    onClick={() => setSelectedRombelLevel('9')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      selectedRombelLevel === '9'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Kelas 9 ({count9})
                  </button>
                </div>
              </div>

              {/* Quick Summary Pill Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">Jumlah Rombel</span>
                  <span className="text-xl font-bold text-slate-900 mt-0.5 block">{displayedRombels.length} Kelas</span>
                </div>
                <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3">
                  <span className="text-[11px] font-medium text-blue-700 uppercase tracking-wider block">Total Siswa Aktif</span>
                  <span className="text-xl font-bold text-blue-900 mt-0.5 block">{displayedStudents.length} Siswa</span>
                </div>
                <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3">
                  <span className="text-[11px] font-medium text-sky-700 uppercase tracking-wider block">Laki-Laki (L)</span>
                  <span className="text-xl font-bold text-sky-900 mt-0.5 block">{totalL} Siswa</span>
                </div>
                <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3">
                  <span className="text-[11px] font-medium text-rose-700 uppercase tracking-wider block">Perempuan (P)</span>
                  <span className="text-xl font-bold text-rose-900 mt-0.5 block">{totalP} Siswa</span>
                </div>
              </div>

              {/* Rombel Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
                {displayedRombels.map(rombel => {
                  const rombelStudents = students.filter(s => s.rombel === rombel && s.status === 'aktif');
                  const lCount = rombelStudents.filter(s => s.jenisKelamin === 'L').length;
                  const pCount = rombelStudents.filter(s => s.jenisKelamin === 'P').length;
                  const total = rombelStudents.length;
                  const lPercent = total > 0 ? Math.round((lCount / total) * 100) : 50;

                  const isK7 = rombel.startsWith('7');
                  const isK8 = rombel.startsWith('8');

                  return (
                    <div 
                      key={rombel} 
                      className={`p-4 rounded-xl border transition-all duration-150 bg-white hover:shadow-md ${
                        isK7 ? 'border-slate-200 hover:border-blue-400' :
                        isK8 ? 'border-slate-200 hover:border-emerald-400' :
                        'border-slate-200 hover:border-purple-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                            isK7 ? 'bg-blue-100 text-blue-700' :
                            isK8 ? 'bg-emerald-100 text-emerald-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {rombel}
                          </div>
                          <span className="font-bold text-slate-900 text-sm">Kelas {rombel}</span>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          total > 0 
                            ? 'bg-slate-100 text-slate-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {total} Siswa
                        </span>
                      </div>

                      {/* Gender Bar */}
                      <div className="mt-3">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                          {total > 0 ? (
                            <>
                              <div style={{ width: `${lPercent}%` }} className="bg-sky-500 h-full" title={`L: ${lCount} (${lPercent}%)`} />
                              <div style={{ width: `${100 - lPercent}%` }} className="bg-rose-400 h-full" title={`P: ${pCount} (${100 - lPercent}%)`} />
                            </>
                          ) : (
                            <div className="w-full bg-slate-200 h-full" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-600 mt-1.5">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                            L: <strong className="text-slate-800">{lCount}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
                            P: <strong className="text-slate-800">{pCount}</strong>
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedClass(rombel);
                          setActiveTab('buku_induk');
                        }}
                        className="mt-3.5 w-full py-1.5 text-xs text-blue-700 bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/60 rounded-lg font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Buka Roster Siswa
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 3: MUTASI SISWA */}
      {activeTab === 'mutasi' && (
        <div className="space-y-4">
          <MutasiModule />
        </div>
      )}

      {/* TAB 4: REKAP KEHADIRAN SISWA BULANAN */}
      {activeTab === 'kehadiran' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Rekap Kehadiran Presensi Siswa Bulanan per Kelas</h3>
              <p className="text-xs text-slate-500">Bulan September 2026 • Tahun Ajaran {school.tahunAjaranAktif}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAttendanceImportOpen(true)}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <ClipboardPaste className="w-4 h-4" />
                Import dari Spreadsheet
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                  <th className="py-3 px-4">Kelas / Rombel</th>
                  <th className="py-3 px-4">Total Siswa</th>
                  <th className="py-3 px-4 text-emerald-700">Hadir (%)</th>
                  <th className="py-3 px-4 text-amber-700">Sakit</th>
                  <th className="py-3 px-4 text-blue-700">Izin</th>
                  <th className="py-3 px-4 text-red-700">Alpa</th>
                  <th className="py-3 px-4">Tingkat Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceRecaps.map(recap => (
                  <tr key={recap.rombel} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Kelas {recap.rombel}</td>
                    <td className="py-3 px-4">{recap.totalSiswa} Siswa</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{recap.persentaseHadir}%</td>
                    <td className="py-3 px-4 text-amber-700">{recap.sakit} hari</td>
                    <td className="py-3 px-4 text-blue-700">{recap.izin} hari</td>
                    <td className="py-3 px-4 text-red-700 font-semibold">{recap.alpa} hari</td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-slate-100 rounded-full h-2 max-w-[120px]">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full" 
                          style={{ width: `${recap.persentaseHadir}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH / EDIT SISWA */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru (Buku Induk)'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NIK (Nomor Induk Kependudukan) *</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-600"
                    placeholder="16 Digit NIK"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NISN *</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-600"
                    placeholder="10 Digit NISN"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NIS Lokal Sekolah *</label>
                  <input
                    type="text"
                    required
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-600"
                    placeholder="Contoh: 8550"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.tempatLahir}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Agama</label>
                  <select
                    value={formData.agama}
                    onChange={(e) => setFormData({ ...formData, agama: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kelas</label>
                  <select
                    value={formData.kelas}
                    onChange={(e) => {
                      const newKelas = e.target.value;
                      const matchingRombel = availableRombels.find(r => r.startsWith(newKelas)) || `${newKelas}A`;
                      setFormData({ 
                        ...formData, 
                        kelas: newKelas,
                        rombel: formData.rombel.startsWith(newKelas) ? formData.rombel : matchingRombel
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="7">Kelas 7</option>
                    <option value="8">Kelas 8</option>
                    <option value="9">Kelas 9</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Rombongan Belajar</label>
                  <select
                    value={formData.rombel}
                    onChange={(e) => {
                      const newRombel = e.target.value;
                      setFormData({ 
                        ...formData, 
                        rombel: newRombel,
                        kelas: newRombel.charAt(0) || formData.kelas
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    {availableRombels.map(r => (
                      <option key={r} value={r}>Rombel {r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Ayah</label>
                  <input
                    type="text"
                    value={formData.namaAyah}
                    onChange={(e) => setFormData({ ...formData, namaAyah: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pekerjaan Ayah</label>
                  <input
                    type="text"
                    value={formData.pekerjaanAyah}
                    onChange={(e) => setFormData({ ...formData, pekerjaanAyah: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Ibu</label>
                  <input
                    type="text"
                    value={formData.namaIbu}
                    onChange={(e) => setFormData({ ...formData, namaIbu: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pekerjaan Ibu</label>
                  <input
                    type="text"
                    value={formData.pekerjaanIbu}
                    onChange={(e) => setFormData({ ...formData, pekerjaanIbu: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">No. HP Orang Tua / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.noHpOrtu}
                    onChange={(e) => setFormData({ ...formData, noHpOrtu: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-600"
                    placeholder="08xxxxxxxx"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Asal Sekolah Dasar (SD/MI)</label>
                  <input
                    type="text"
                    value={formData.asalSd}
                    onChange={(e) => setFormData({ ...formData, asalSd: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="SD Negeri 1 Kutasari"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alamat Tempat Tinggal Lengkap</label>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  placeholder="RT/RW, Dusun/Desa, Kecamatan..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Simpan Siswa Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT MODAL PREVIEW FOR OFFICIAL LETTERS */}
      {printDocType && selectedStudentForPrint && (
        <PrintModal
          isOpen={!!printDocType}
          onClose={() => setPrintDocType(null)}
          title={
            printDocType === 'buku_induk' ? 'Lembar Buku Induk Siswa' :
            printDocType === 'surat_aktif' ? 'Surat Keterangan Siswa Aktif' :
            printDocType === 'surat_pindah' ? 'Surat Keterangan Pindah Sekolah' :
            printDocType === 'skl' ? 'Surat Keterangan Lulus (SKL)' :
            'Surat Keterangan Tidak Mampu (SKTM)'
          }
          documentNumber={`421.3/${selectedStudentForPrint.nis}/SMPN2KTS/2026`}
        >
          {/* FORMAT CETAK 1: SURAT KETERANGAN SISWA AKTIF */}
          {printDocType === 'surat_aktif' && (
            <div className="space-y-6 font-serif text-slate-900 leading-relaxed text-sm">
              <div className="text-center my-4">
                <h3 className="text-base font-bold uppercase underline tracking-wider">
                  SURAT KETERANGAN SISWA AKTIF
                </h3>
                <p className="text-xs font-mono font-semibold text-slate-700 mt-1">
                  Nomor: 421.3 / 112 / SMPN2KTS / 2026
                </p>
              </div>

              <p>Yang bertanda tangan di bawah ini:</p>

              <table className="w-full text-xs sm:text-sm ml-4 space-y-1">
                <tbody>
                  <tr>
                    <td className="w-44 py-1 font-semibold">Nama</td>
                    <td className="w-4">:</td>
                    <td className="font-bold">{school.kepalaSekolah}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">NIP</td>
                    <td>:</td>
                    <td className="font-mono">{school.nipKepalaSekolah}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Jabatan</td>
                    <td>:</td>
                    <td>Kepala Sekolah</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Unit Kerja</td>
                    <td>:</td>
                    <td>{school.namaSekolah}</td>
                  </tr>
                </tbody>
              </table>

              <p>Dengan ini menerangkan dengan sesungguhnya bahwa:</p>

              <table className="w-full text-xs sm:text-sm ml-4">
                <tbody>
                  <tr>
                    <td className="w-44 py-1 font-semibold">Nama Siswa</td>
                    <td className="w-4">:</td>
                    <td className="font-bold uppercase">{selectedStudentForPrint.nama}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">NISN / NIS</td>
                    <td>:</td>
                    <td className="font-mono">{selectedStudentForPrint.nisn} / {selectedStudentForPrint.nis}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">NIK</td>
                    <td>:</td>
                    <td className="font-mono">{selectedStudentForPrint.nik}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Tempat, Tanggal Lahir</td>
                    <td>:</td>
                    <td>{selectedStudentForPrint.tempatLahir}, {selectedStudentForPrint.tanggalLahir}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Jenis Kelamin</td>
                    <td>:</td>
                    <td>{selectedStudentForPrint.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Kelas / Rombel</td>
                    <td>:</td>
                    <td className="font-bold">{selectedStudentForPrint.rombel} (Tingkat {selectedStudentForPrint.kelas})</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Nama Orang Tua / Wali</td>
                    <td>:</td>
                    <td>{selectedStudentForPrint.namaAyah} / {selectedStudentForPrint.namaIbu}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Alamat Tempat Tinggal</td>
                    <td>:</td>
                    <td>{selectedStudentForPrint.alamat}</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-justify indent-8">
                Adalah benar-benar siswa aktif terdaftar pada SMP Negeri 2 Kutasari, Kabupaten Purbalingga pada Tahun Ajaran 
                {school.tahunAjaranAktif} Semester {school.semesterAktif} dan berkelakuan baik dalam mengikuti kegiatan belajar mengajar.
              </p>

              <p className="text-justify indent-8">
                Demikian surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.
              </p>

              {/* Tanda Tangan Resmi Kepala Sekolah */}
              <div className="pt-8 flex justify-end">
                <div className="text-center w-64 font-sans text-xs">
                  <p>Kutasari, 20 September 2026</p>
                  <p className="font-semibold text-slate-800 mt-1">Kepala SMP Negeri 2 Kutasari,</p>
                  <div className="h-20 flex items-center justify-center">
                    <span className="text-slate-300 italic text-[11px]">[ Tanda Tangan & Cap Dinas ]</span>
                  </div>
                  <p className="font-bold underline text-sm">{school.kepalaSekolah}</p>
                  <p className="font-mono text-[11px] text-slate-700">NIP. {school.nipKepalaSekolah}</p>
                </div>
              </div>
            </div>
          )}

          {/* FORMAT CETAK 2: BUKU INDUK SISWA LEMBAR RESMI */}
          {printDocType === 'buku_induk' && (
            <div className="space-y-4 text-xs font-sans text-slate-900 leading-normal">
              <div className="text-center border-b pb-2 mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  LEMBAR BUKU INDUK SISWA (KLAPPER)
                </h3>
                <p className="font-mono text-slate-600">Nomor Induk Siswa Nasional: {selectedStudentForPrint.nisn} | NIS: {selectedStudentForPrint.nis}</p>
              </div>

              <div className="border border-slate-300 rounded-lg p-4 space-y-4">
                <div>
                  <h4 className="font-bold text-xs uppercase bg-slate-100 p-1.5 rounded text-blue-950 mb-2">
                    A. KETERANGAN PRIBADI SISWA
                  </h4>
                  <table className="w-full text-xs">
                    <tbody>
                      <tr><td className="w-48 py-1 text-slate-600">1. Nama Lengkap Siswa</td><td className="w-3">:</td><td className="font-bold text-slate-900">{selectedStudentForPrint.nama}</td></tr>
                      <tr><td className="py-1 text-slate-600">2. NIK</td><td>:</td><td className="font-mono">{selectedStudentForPrint.nik}</td></tr>
                      <tr><td className="py-1 text-slate-600">3. Jenis Kelamin</td><td>:</td><td>{selectedStudentForPrint.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td></tr>
                      <tr><td className="py-1 text-slate-600">4. Tempat, Tanggal Lahir</td><td>:</td><td>{selectedStudentForPrint.tempatLahir}, {selectedStudentForPrint.tanggalLahir}</td></tr>
                      <tr><td className="py-1 text-slate-600">5. Agama</td><td>:</td><td>{selectedStudentForPrint.agama}</td></tr>
                      <tr><td className="py-1 text-slate-600">6. Alamat Tempat Tinggal</td><td>:</td><td>{selectedStudentForPrint.alamat}</td></tr>
                      <tr><td className="py-1 text-slate-600">7. Sekolah Asal (SD/MI)</td><td>:</td><td>{selectedStudentForPrint.asalSd}</td></tr>
                      <tr><td className="py-1 text-slate-600">8. Diterima pada Tanggal / TA</td><td>:</td><td>15 Juli {selectedStudentForPrint.tahunMasuk} / TA {selectedStudentForPrint.tahunMasuk}/{selectedStudentForPrint.tahunMasuk + 1}</td></tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase bg-slate-100 p-1.5 rounded text-blue-950 mb-2">
                    B. KETERANGAN ORANG TUA / WALI
                  </h4>
                  <table className="w-full text-xs">
                    <tbody>
                      <tr><td className="w-48 py-1 text-slate-600">1. Nama Ayah Kandung</td><td className="w-3">:</td><td className="font-semibold">{selectedStudentForPrint.namaAyah}</td></tr>
                      <tr><td className="py-1 text-slate-600">2. Pekerjaan Ayah</td><td>:</td><td>{selectedStudentForPrint.pekerjaanAyah}</td></tr>
                      <tr><td className="py-1 text-slate-600">3. Nama Ibu Kandung</td><td>:</td><td className="font-semibold">{selectedStudentForPrint.namaIbu}</td></tr>
                      <tr><td className="py-1 text-slate-600">4. Pekerjaan Ibu</td><td>:</td><td>{selectedStudentForPrint.pekerjaanIbu}</td></tr>
                      <tr><td className="py-1 text-slate-600">5. Nomor Telepon / HP</td><td>:</td><td className="font-mono">{selectedStudentForPrint.noHpOrtu}</td></tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase bg-slate-100 p-1.5 rounded text-blue-950 mb-2">
                    C. CATATAN KESISWAAN & AKADEMIK
                  </h4>
                  <p className="text-[11px] text-slate-700">
                    Siswa terdaftar aktif pada rombel {selectedStudentForPrint.rombel}. Catatan kepribadian dan nilai tersimpan dalam buku induk ledger sekolah.
                  </p>
                </div>
              </div>

              <div className="pt-6 flex justify-between items-end">
                <div className="w-24 h-32 border border-slate-300 flex items-center justify-center text-slate-400 text-[10px] text-center p-2 bg-slate-50">
                  Pas Foto 3x4 Siswa
                </div>
                <div className="text-center font-sans text-xs">
                  <p>Kutasari, 20 September 2026</p>
                  <p className="font-semibold mt-1">Kepala Urusan Tata Usaha,</p>
                  <div className="h-16 flex items-center justify-center">
                    <span className="text-slate-300 italic text-[10px]">[ Cap Tata Usaha ]</span>
                  </div>
                  <p className="font-bold underline">{school.kepalaTu}</p>
                  <p className="font-mono text-[10px]">NIP. {school.nipKepalaTu}</p>
                </div>
              </div>
            </div>
          )}

          {/* FORMAT CETAK 3: SURAT MUTASI KELUAR */}
          {printDocType === 'surat_pindah' && (
            <div className="space-y-6 font-serif text-slate-900 leading-relaxed text-sm">
              <div className="text-center my-4">
                <h3 className="text-base font-bold uppercase underline tracking-wider">
                  SURAT KETERANGAN PINDAH SEKOLAH
                </h3>
                <p className="text-xs font-mono font-semibold text-slate-700 mt-1">
                  Nomor: 421.3 / 089 / SMPN2KTS / 2026
                </p>
              </div>

              <p>Kepala SMP Negeri 2 Kutasari, Kabupaten Purbalingga menerangkan bahwa:</p>

              <table className="w-full text-xs sm:text-sm ml-4">
                <tbody>
                  <tr><td className="w-44 py-1 font-semibold">Nama Siswa</td><td className="w-4">:</td><td className="font-bold uppercase">{selectedStudentForPrint.nama}</td></tr>
                  <tr><td className="py-1 font-semibold">NISN / NIS</td><td>:</td><td className="font-mono">{selectedStudentForPrint.nisn} / {selectedStudentForPrint.nis}</td></tr>
                  <tr><td className="py-1 font-semibold">Tingkat / Kelas</td><td>:</td><td>Kelas {selectedStudentForPrint.kelas} ({selectedStudentForPrint.rombel})</td></tr>
                  <tr><td className="py-1 font-semibold">Nama Orang Tua</td><td>:</td><td>{selectedStudentForPrint.namaAyah}</td></tr>
                </tbody>
              </table>

              <p className="text-justify indent-8">
                Telah mengajukan permohonan pindah sekolah atas kehendak sendiri / orang tua ke:
              </p>

              <div className="ml-8 p-3 border-l-2 border-blue-900 bg-slate-50 text-xs">
                <p className="font-bold">Sekolah Tujuan : {selectedStudentForPrint.catatanMutasi?.sekolahTujuanAsal || 'SMP Negeri 1 Cilacap'}</p>
                <p>Alasan : {selectedStudentForPrint.catatanMutasi?.alasan || 'Mengikuti orang tua pindah tugas dinas'}</p>
              </div>

              <p className="text-justify indent-8">
                Bersama ini kami lampirkan Buku Laporan Pendidikan (Rapor) siswa yang bersangkutan. Surat tanda penerimaan dari sekolah tujuan mohon dikirimkan kembali ke SMP Negeri 2 Kutasari.
              </p>

              <div className="pt-8 flex justify-end">
                <div className="text-center w-64 font-sans text-xs">
                  <p>Kutasari, 20 September 2026</p>
                  <p className="font-semibold text-slate-800 mt-1">Kepala Sekolah,</p>
                  <div className="h-20" />
                  <p className="font-bold underline text-sm">{school.kepalaSekolah}</p>
                  <p className="font-mono text-[11px] text-slate-700">NIP. {school.nipKepalaSekolah}</p>
                </div>
              </div>
            </div>
          )}
        </PrintModal>
      )}

      {/* MODAL TEMPLATE EXCEL & PANDUAN IMPOR DATA SISWA */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-2xs">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    Template Excel & Impor Data Buku Induk Siswa
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                      Tahun Ajaran 2025/2026
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Format resmi Microsoft Excel (.xls) dan CSV untuk administrasi kesiswaan SMPN 2 Kutasari.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200 bg-white px-6 pt-3 gap-2 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setTemplateActiveTab('download')}
                className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  templateActiveTab === 'download'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                1. Unduh Template Excel & CSV
              </button>
              <button
                onClick={() => setTemplateActiveTab('paste')}
                className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  templateActiveTab === 'paste'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                2. Tempel (Paste) Langsung dari Excel
              </button>
              <button
                onClick={() => setTemplateActiveTab('upload')}
                className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  templateActiveTab === 'upload'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                3. Unggah File (Upload)
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 flex-1">
              {/* TAB 1: UNDUH TEMPLATE */}
              {templateActiveTab === 'download' && (
                <div className="space-y-6">
                  {/* Download Options Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Excel Card */}
                    <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                            <span className="font-bold text-slate-900 text-sm">Microsoft Excel (.xls)</span>
                          </div>
                          <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                            Direkomendasikan
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px] mb-4">
                          Dilengkapi kop surat resmi SMP Negeri 2 Kutasari, banner petunjuk pengisian warna kuning, proteksi otomatis angka 0 di awal (NISN, NIK, No HP tidak terpotong), serta 5 baris contoh data siswa riil.
                        </p>
                      </div>
                      <button
                        onClick={handleDownloadExcelTemplate}
                        className="w-full py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Unduh Template Excel (.xls)
                      </button>
                    </div>

                    {/* CSV Card */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-colors flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <span className="font-bold text-slate-900 text-sm">File CSV Standar (.csv)</span>
                          </div>
                          <span className="text-[10px] font-medium bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                            Format Ringkas
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px] mb-4">
                          Format Comma-Separated Values dengan dukungan UTF-8 BOM, cocok untuk import otomatis atau olah data cepat menggunakan software spreadsheet lainnya.
                        </p>
                      </div>
                      <button
                        onClick={handleDownloadTemplate}
                        className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Unduh Template CSV (.csv)
                      </button>
                    </div>
                  </div>

                  {/* Petunjuk Teknis Kolom */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-600" />
                        <span className="font-bold text-slate-800 text-xs">Struktur & Ketentuan 19 Kolom Template</span>
                      </div>
                      <button
                        onClick={() => {
                          const headers = 'NISN\tNIS\tNama Lengkap\tNIK\tTempat Lahir\tTanggal Lahir\tJenis Kelamin\tAgama\tAlamat Lengkap\tNama Ayah\tPekerjaan Ayah\tNama Ibu\tPekerjaan Ibu\tNo HP Ortu\tAsal SD\tTahun Masuk\tKelas\tRombel';
                          navigator.clipboard.writeText(headers);
                          setCopiedStatus(true);
                          setTimeout(() => setCopiedStatus(false), 2500);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-blue-700 bg-white border border-slate-200 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {copiedStatus ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Salin Judul Kolom
                          </>
                        )}
                      </button>
                    </div>

                    <div className="overflow-x-auto max-h-72">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
                            <th className="p-2 w-10 text-center">No</th>
                            <th className="p-2">Nama Kolom</th>
                            <th className="p-2 w-28">Tipe Data</th>
                            <th className="p-2 w-24">Status</th>
                            <th className="p-2">Ketentuan & Contoh Isian</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 text-center text-slate-400 font-mono">1</td>
                            <td className="p-2 font-semibold text-slate-900">NISN</td>
                            <td className="p-2 font-mono text-slate-500">Teks / Angka</td>
                            <td className="p-2"><span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">Wajib (*)</span></td>
                            <td className="p-2 text-slate-600">10 digit angka resmi Dapodik, cth: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">0123456789</code></td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 text-center text-slate-400 font-mono">2</td>
                            <td className="p-2 font-semibold text-slate-900">NIS</td>
                            <td className="p-2 font-mono text-slate-500">Teks / Angka</td>
                            <td className="p-2"><span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">Wajib (*)</span></td>
                            <td className="p-2 text-slate-600">Nomor Induk Lokal sekolah, cth: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">8550</code></td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 text-center text-slate-400 font-mono">3</td>
                            <td className="p-2 font-semibold text-slate-900">Nama Lengkap Siswa</td>
                            <td className="p-2 font-mono text-slate-500">Teks</td>
                            <td className="p-2"><span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">Wajib (*)</span></td>
                            <td className="p-2 text-slate-600">Sesuai Akta Kelahiran / Ijazah SD, cth: <strong>Aditya Pratama</strong></td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 text-center text-slate-400 font-mono">4</td>
                            <td className="p-2 font-semibold text-slate-900">NIK</td>
                            <td className="p-2 font-mono text-slate-500">Teks</td>
                            <td className="p-2 text-slate-400">Opsional</td>
                            <td className="p-2 text-slate-600">16 digit NIK kependudukan KK, cth: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">3303051508120001</code></td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 text-center text-slate-400 font-mono">5</td>
                            <td className="p-2 font-semibold text-slate-900">Tempat Lahir</td>
                            <td className="p-2 font-mono text-slate-500">Teks</td>
                            <td className="p-2 text-slate-400">Opsional</td>
                            <td className="p-2 text-slate-600">Kota/Kabupaten lahir, cth: <em>Purbalingga, Banyumas</em></td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 text-center text-slate-400 font-mono">6</td>
                            <td className="p-2 font-semibold text-slate-900">Tanggal Lahir</td>
                            <td className="p-2 font-mono text-slate-500">Date</td>
                            <td className="p-2"><span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">Wajib (*)</span></td>
                            <td className="p-2 text-slate-600">Format: <strong>YYYY-MM-DD</strong>, contoh: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">2012-08-15</code></td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 text-center text-slate-400 font-mono">7</td>
                            <td className="p-2 font-semibold text-slate-900">Jenis Kelamin</td>
                            <td className="p-2 font-mono text-slate-500">Enum (L / P)</td>
                            <td className="p-2"><span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">Wajib (*)</span></td>
                            <td className="p-2 text-slate-600">Hanya diisi huruf <strong>L</strong> (Laki-laki) atau <strong>P</strong> (Perempuan)</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 text-center text-slate-400 font-mono">8</td>
                            <td className="p-2 font-semibold text-slate-900">Agama</td>
                            <td className="p-2 font-mono text-slate-500">Teks</td>
                            <td className="p-2 text-slate-400">Opsional</td>
                            <td className="p-2 text-slate-600">cth: Islam, Kristen, Katolik, Hindu, Buddha, Konghucu</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 text-center text-slate-400 font-mono">9</td>
                            <td className="p-2 font-semibold text-slate-900">Alamat Lengkap</td>
                            <td className="p-2 font-mono text-slate-500">Teks</td>
                            <td className="p-2 text-slate-400">Opsional</td>
                            <td className="p-2 text-slate-600">Nama Desa, RT/RW, Dusun, Kecamatan (cth: Desa Meri RT 02 RW 01)</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 text-center text-slate-400 font-mono">10</td>
                            <td className="p-2 font-semibold text-slate-900">Nama & Pekerjaan Orang Tua</td>
                            <td className="p-2 font-mono text-slate-500">Teks</td>
                            <td className="p-2 text-slate-400">Opsional</td>
                            <td className="p-2 text-slate-600">Ayah, Ibu, Pekerjaan Ayah/Ibu, dan No HP aktif orang tua/wali</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 text-center text-slate-400 font-mono">11</td>
                            <td className="p-2 font-semibold text-slate-900">Asal SD / Tahun Masuk</td>
                            <td className="p-2 font-mono text-slate-500">Teks / Angka</td>
                            <td className="p-2 text-slate-400">Opsional</td>
                            <td className="p-2 text-slate-600">cth: SDN 1 Kutasari, Tahun: 2025</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 text-center text-slate-400 font-mono">12</td>
                            <td className="p-2 font-semibold text-slate-900">Kelas & Rombel</td>
                            <td className="p-2 font-mono text-slate-500">Teks</td>
                            <td className="p-2"><span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">Wajib (*)</span></td>
                            <td className="p-2 text-slate-600">Kelas: 7, 8, atau 9. Rombel: <strong>7A, 7B, 7C, 7D, 8A, 8B, 9A, dsb</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TEMPEL (PASTE) DARI EXCEL */}
              {templateActiveTab === 'paste' && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 flex items-start gap-2.5">
                    <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-xs">Cara Cepat Impor dari Excel:</h5>
                      <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                        1. Buka spreadsheet Excel Anda. Blok baris data siswa yang ingin dimasukkan (tanpa baris judul kolom).<br/>
                        2. Tekan <strong>Ctrl + C</strong> (Copy).<br/>
                        3. Klik pada kotak teks di bawah lalu tekan <strong>Ctrl + V</strong> (Paste), lalu klik tombol Impor Siswa.
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-slate-800 text-xs">
                        Tempelkan (Paste) Teks dari Excel di Sini:
                      </label>
                      {pasteInput && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {parsePastedStudentText(pasteInput).length} data siswa terdeteksi
                        </span>
                      )}
                    </div>
                    <textarea
                      value={pasteInput}
                      onChange={(e) => setPasteInput(e.target.value)}
                      rows={8}
                      placeholder="Contoh format paste dari Excel:&#10;0123456789	8550	Aditya Pratama	3303051508120001	Purbalingga	2012-08-15	L	Islam	Desa Meri RT 02 RW 01	Bambang	Petani	Siti	Pedagang	081234567890	SDN 1 Meri	2025	7	7A"
                      className="w-full p-3 font-mono text-[11px] border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                    />
                  </div>

                  {/* Preview detected rows */}
                  {pasteInput && parsePastedStudentText(pasteInput).length > 0 && (
                    <div className="border border-slate-200 rounded-xl p-3 bg-white">
                      <h5 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Pratinjau Data yang Terdeteksi ({parsePastedStudentText(pasteInput).length} Siswa):
                      </h5>
                      <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 text-[11px]">
                        {parsePastedStudentText(pasteInput).slice(0, 5).map((st, idx) => (
                          <div key={idx} className="py-1.5 flex items-center justify-between">
                            <span className="font-semibold text-slate-900">{idx + 1}. {st.nama}</span>
                            <span className="text-slate-500 font-mono">NISN: {st.nisn} | Rombel: {st.rombel} | JK: {st.jenisKelamin}</span>
                          </div>
                        ))}
                        {parsePastedStudentText(pasteInput).length > 5 && (
                          <div className="py-1.5 text-center text-slate-400 italic">
                            ... dan {parsePastedStudentText(pasteInput).length - 5} siswa lainnya
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPasteInput('')}
                      className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                    >
                      Bersihkan
                    </button>
                    <button
                      type="button"
                      onClick={handleImportPastedData}
                      disabled={!pasteInput.trim() || parsePastedStudentText(pasteInput).length === 0}
                      className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                    >
                      <FileCheck className="w-4 h-4" />
                      Pratinjau & Impor Data ({parsePastedStudentText(pasteInput).length})
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: UNGGAH FILE SPREADSHEET */}
              {templateActiveTab === 'upload' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center bg-slate-50/70 hover:bg-emerald-50/30 transition-colors">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                      <FileSpreadsheet className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">
                      Pilih atau Seret File Excel / CSV Anda ke Sini
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                      Mendukung file berformat <strong className="text-slate-700">.xlsx</strong> atau <strong className="text-slate-700">.xls</strong> (Template Excel Resmi SMPN 2 Kutasari), serta file <strong className="text-slate-700">.csv</strong>.
                    </p>
                    <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer shadow-xs transition-colors">
                      <Upload className="w-4 h-4" />
                      Pilih File Spreadsheet
                      <input
                        type="file"
                        accept=".xls,.xlsx,.csv,.tsv,.txt"
                        onChange={handleImportFile}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h5 className="font-bold text-slate-800 text-xs mb-1">Catatan Penting Pengunggahan:</h5>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1">
                      <li>Pastikan susunan kolom tidak diubah dari template bawaan.</li>
                      <li>Jika ada siswa dengan NISN atau NIS yang sudah ada di Buku Induk, data akan diperbarui atau ditambahkan sebagai entri baru.</li>
                      <li>Data langsung tersimpan di sistem SIMTU SMPN 2 Kutasari.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>Format kompatibel Microsoft Excel 2007 - 2024 & Google Spreadsheet</span>
              </div>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL IMPORT PRESENSI SPREADSHEET */}
      <AttendanceSpreadsheetImportModal
        isOpen={isAttendanceImportOpen}
        onClose={() => setIsAttendanceImportOpen(false)}
      />

      {/* MODAL KONFIRMASI HAPUS SELURUH SISWA (TAHUN AJARAN BARU) */}
      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-red-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-5 text-white flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Hapus Seluruh Siswa (Tahun Ajaran Baru)</h3>
                  <p className="text-xs text-red-100 mt-0.5">
                    Aksi administratif pembaruan data siswa SMPN 2 Kutasari
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isDeletingAll && setIsDeleteAllModalOpen(false)}
                disabled={isDeletingAll}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 cursor-pointer disabled:opacity-50 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Ringkasan & Peringatan */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-950">
                  <p className="font-bold text-sm text-red-800">
                    Peringatan: {students.length} Data Siswa Akan Dihapus
                  </p>
                  <p className="mt-1 leading-relaxed text-red-700">
                    Tindakan ini akan mengosongkan seluruh data Buku Induk siswa untuk persiapan tahun ajaran berikutnya. 
                    Tindakan ini <strong>tidak dapat dibatalkan</strong> setelah dikonfirmasi.
                  </p>
                </div>
              </div>

              {/* 1. Opsi Cadangan Data Otomatis */}
              <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  1. Cadangan Data Siswa
                </h4>
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={backupBeforeDelete}
                    onChange={(e) => setBackupBeforeDelete(e.target.checked)}
                    disabled={isDeletingAll}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      Unduh cadangan data siswa (Excel/CSV) otomatis sebelum dihapus
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Sistem akan mengunduh seluruh {students.length} biodata siswa ke komputer Anda sebelum proses penghapusan dijalankan.
                    </span>
                  </div>
                </label>
              </div>

              {/* 2. Opsi Data Turunan Siswa */}
              <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-purple-600" />
                  2. Opsi Data Terkait Siswa
                </h4>

                {/* Presensi Rombel */}
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={resetAttendanceOption}
                    onChange={(e) => setResetAttendanceOption(e.target.checked)}
                    disabled={isDeletingAll}
                    className="mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      Kosongkan rekapitulasi kehadiran/presensi rombel kelas
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Centang untuk mereset angka presensi (H/S/I/A) menjadi 0 untuk tahun ajaran baru. Jika tidak dicentang, rekap disimpan sebagai arsip tahun ajaran sebelumnya.
                    </span>
                  </div>
                </label>

                {/* Mutasi Siswa */}
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={resetMutationsOption}
                    onChange={(e) => setResetMutationsOption(e.target.checked)}
                    disabled={isDeletingAll}
                    className="mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      Kosongkan juga riwayat Buku Mutasi Siswa
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Default tidak dicentang agar riwayat SKP dan mutasi lama tetap tersimpan sebagai arsip historis sekolah.
                    </span>
                  </div>
                </label>
              </div>

              {/* 3. Kolom Konfirmasi Pengaman */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  3. Pengaman: Ketik kata <span className="font-mono text-red-600 bg-red-100 px-1.5 py-0.5 rounded border border-red-300 font-extrabold">HAPUS</span> pada kolom di bawah ini:
                </label>
                <input
                  type="text"
                  placeholder="Ketik HAPUS"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  disabled={isDeletingAll}
                  className="w-full px-3.5 py-2 text-sm border-2 border-slate-300 focus:border-red-500 rounded-xl font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-red-100"
                />
                <p className="text-[11px] text-slate-500">
                  Tombol konfirmasi di bawah hanya akan aktif setelah Anda mengetik kata <strong>HAPUS</strong> dalam huruf besar.
                </p>
              </div>

              {/* Error Message jika gagal */}
              {deleteErrorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{deleteErrorMessage}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteAllModalOpen(false)}
                disabled={isDeletingAll}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-300 rounded-xl cursor-pointer transition-colors disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleExecuteDeleteAllStudents}
                disabled={deleteConfirmationText.trim() !== 'HAPUS' || isDeletingAll || students.length === 0}
                className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isDeletingAll ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memproses Penghapusan...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Konfirmasi Hapus Seluruh Siswa ({students.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PRATINJAU & KONFIRMASI IMPOR DATA SISWA */}
      {isImportPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 text-white flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <FileSpreadsheet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Pratinjau Hasil Impor Siswa</h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Sumber: <span className="font-semibold text-white">{previewFileName}</span> &bull; Terdeteksi{' '}
                    <strong className="text-white">{previewStudents.length} siswa valid</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImportPreviewOpen(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Ringkasan Data */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] text-slate-500 font-medium block">Total Data Valid</span>
                  <span className="text-xl font-bold text-slate-900">{previewStudents.length}</span>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-[11px] text-blue-600 font-medium block">Laki-laki (L)</span>
                  <span className="text-xl font-bold text-blue-900">
                    {previewStudents.filter(s => s.jenisKelamin === 'L').length}
                  </span>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-[11px] text-rose-600 font-medium block">Perempuan (P)</span>
                  <span className="text-xl font-bold text-rose-900">
                    {previewStudents.filter(s => s.jenisKelamin === 'P').length}
                  </span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-[11px] text-amber-700 font-medium block">Buku Induk Saat Ini</span>
                  <span className="text-xl font-bold text-amber-900">{students.length} Siswa</span>
                </div>
              </div>

              {/* Pilihan Metode Impor */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Pilih Cara Penggabungan Data ke Buku Induk:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      importMode === 'append'
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">
                        Tambahkan ke Buku Induk (Append)
                      </span>
                      <span className="text-[11px] text-slate-600 mt-0.5 block leading-relaxed">
                        Data {students.length} siswa yang sudah ada tetap dipertahankan. Data baru ({previewStudents.length}) akan digabungkan ke Buku Induk.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      importMode === 'replace'
                        ? 'border-red-600 bg-red-50/50 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-xs text-red-900 block">
                        Gantikan Seluruh Buku Induk (Tahun Ajaran Baru)
                      </span>
                      <span className="text-[11px] text-slate-600 mt-0.5 block leading-relaxed">
                        Data Buku Induk lama ({students.length} siswa) akan digantikan sepenuhnya dengan {previewStudents.length} siswa dari file ini.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Tabel Pratinjau 15 Baris Pertama */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    Pratinjau Data yang Akan Masuk ({Math.min(previewStudents.length, 15)} dari {previewStudents.length} Siswa):
                  </span>
                  <span className="text-[10px] text-slate-500">Menampilkan 15 baris sampel</span>
                </div>
                <div className="overflow-x-auto max-h-60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-2 px-3">No</th>
                        <th className="py-2 px-3">NISN</th>
                        <th className="py-2 px-3">NIS</th>
                        <th className="py-2 px-3">Nama Lengkap</th>
                        <th className="py-2 px-3 text-center">JK</th>
                        <th className="py-2 px-3">Rombel</th>
                        <th className="py-2 px-3">Tempat, Tgl Lahir</th>
                        <th className="py-2 px-3">Orang Tua</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {previewStudents.slice(0, 15).map((st, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          <td className="py-2 px-3 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2 px-3 font-mono font-medium text-slate-700">{st.nisn}</td>
                          <td className="py-2 px-3 font-mono text-slate-600">{st.nis || '-'}</td>
                          <td className="py-2 px-3 font-bold text-slate-900">{st.nama}</td>
                          <td className="py-2 px-3 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              st.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {st.jenisKelamin}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-medium text-blue-700">{st.rombel || st.kelas}</td>
                          <td className="py-2 px-3 text-slate-600">{st.tempatLahir}, {st.tanggalLahir}</td>
                          <td className="py-2 px-3 text-slate-600">{st.namaAyah || st.namaIbu || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsImportPreviewOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-300 rounded-xl cursor-pointer transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmImport}
                className={`px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer ${
                  importMode === 'replace'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {importMode === 'replace'
                    ? `Gantikan Buku Induk dengan ${previewStudents.length} Siswa Ini`
                    : `Simpan & Tambahkan ${previewStudents.length} Siswa ke Buku Induk`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PROTEKSI EDIT ADMINISTRASI KESISWAAN (SPENDAKU212) */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-700 p-5 text-white flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Proteksi Edit Kesiswaan</h3>
                  <p className="text-xs text-amber-100 mt-0.5">
                    Memerlukan otorisasi sandi pengaman untuk mengedit data
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPasswordModalOpen(false);
                  setPasswordError(null);
                  setPendingEditAction(null);
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
                    setPendingEditAction(null);
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
                  Buka Kunci Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
