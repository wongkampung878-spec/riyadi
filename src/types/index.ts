export type UserRole = 
  | 'kepala_sekolah' 
  | 'kepala_tu' 
  | 'staf_tu' 
  | 'guru' 
  | 'sarpras_laboran';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar?: string;
  assignedClass?: string; // For teachers/wali kelas (misal: '8A')
  assignedModules?: string[]; // For Staf TU (misal: ['kesiswaan', 'persuratan'])
  isActive: boolean;
}

export type Gender = 'L' | 'P';

export type StudentStatus = 'aktif' | 'lulus' | 'mutasi_keluar' | 'putus_sekolah';

export interface Student {
  id: string;
  nisn: string;
  nis: string;
  nama: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  jenisKelamin: Gender;
  agama: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
  alamat: string;
  namaAyah: string;
  pekerjaanAyah: string;
  namaIbu: string;
  pekerjaanIbu: string;
  namaWali?: string;
  pekerjaanWali?: string;
  noHpOrtu: string;
  asalSd: string;
  tahunMasuk: number;
  kelas: string; // '7', '8', '9'
  rombel: string; // '7A', '7B', '8A', etc.
  status: StudentStatus;
  catatanMutasi?: {
    jenis: 'masuk' | 'keluar';
    tanggal: string;
    sekolahTujuanAsal: string;
    nomorSurat: string;
    alasan: string;
  };
}

export interface StudentAttendanceRecap {
  rombel: string;
  bulan: string; // '2026-09'
  totalSiswa: number;
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  persentaseHadir: number;
  tingkat?: string;
  waliKelas?: string;
  jumlahSiswa?: number;
}

export type StaffStatus = 'PNS' | 'PPPK' | 'GTT' | 'PTT';

export interface Staff {
  id: string;
  nipNuPtk: string;
  nama: string;
  gelar: string;
  status: StaffStatus;
  pangkatGolongan: string; // e.g. "Pembina / IV/a", "Penata Muda / III/a", "-"
  jabatan: string; // e.g. "Kepala Sekolah", "Guru Madya", "Pengadministrasi Kesiswaan"
  tmt: string; // YYYY-MM-DD
  pendidikanTerakhir: string; // e.g. "S1 Pendidikan Matematika - UNY"
  mapelDiampu?: string;
  noHp: string;
  alamat: string;
  tmtKgbBerikutnya?: string; // KGB (Kenaikan Gaji Berkala) YYYY-MM-DD
  tmtPangkatBerikutnya?: string; // Kenaikan Pangkat YYYY-MM-DD
  riwayatPangkat: Array<{
    golongan: string;
    tmt: string;
    noSk: string;
  }>;
  riwayatPendidikan: Array<{
    jenjang: string;
    jurusan: string;
    institusi: string;
    tahunLulus: number;
  }>;
  riwayatDiklat: Array<{
    namaDiklat: string;
    penyelenggara: string;
    tahun: number;
    jamPelajaran: number;
  }>;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  jenisCuti: 'Tahunan' | 'Sakit' | 'Melahirkan' | 'Alasan Penting' | 'Besar';
  tanggalMulai: string;
  tanggalSelesai: string;
  jumlahHari: number;
  alasan: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
  disetujuiOleh?: string;
  tanggalPengajuan: string;
}

export type LetterNature = 'biasa' | 'segera' | 'sangat_segera' | 'rahasia';

export interface IncomingLetter {
  id: string;
  noAgenda: string;
  tanggalTerima: string;
  nomorSurat: string;
  tanggalSurat: string;
  asalSurat: string;
  perihal: string;
  sifat: LetterNature;
  ringkasanIsi: string;
  fileAttachment?: string;
  disposisi?: {
    tujuan: string[]; // e.g. ["Kepala TU", "Waka Kesiswaan"]
    isiDisposisi: string;
    catatan?: string;
    tanggalDisposisi: string;
    status: 'Belum' | 'Proses' | 'Selesai';
  };
}

export interface OutgoingLetter {
  id: string;
  nomorSurat: string;
  tanggalSurat: string;
  tujuan: string;
  perihal: string;
  pembuat: string;
  statusApproval: 'Draft' | 'Menunggu Approval' | 'Disetujui' | 'Terkirim';
  isiSurat?: string;
  lampiran?: string;
  kodeKlasifikasi: string; // e.g. "421.3"
}

export interface ExpeditionEntry {
  id: string;
  outgoingLetterId: string;
  nomorSurat: string;
  tanggalKirim: string;
  tujuan: string;
  perihal: string;
  namaPenerima?: string;
  statusPengiriman: 'Dalam Perjalanan' | 'Diterima';
  catatan?: string;
}

export type ItemCondition = 'Baik' | 'Rusak Ringan' | 'Rusak Berat';

export interface InventoryItem {
  id: string;
  kodeBarang: string;
  nama: string;
  kategori: 'Alat Lab IPA' | 'TIK & Multimedia' | 'Olahraga' | 'Kesenian' | 'Audio Sound' | 'Kebersihan' | 'Mebel & Kantor';
  merkDanTipe: string;
  tahunPerolehan: number;
  sumberDana: 'BOS Reguler' | 'BOS Kinerja' | 'BOS Afirmasi' | 'DAK' | 'Komite' | 'Hibah/Lainnya';
  jumlahTotal: number;
  jumlahTersedia: number;
  satuan: string; // 'Unit', 'Set', 'Buah', 'Pcs'
  kondisi: ItemCondition;
  lokasiRuang: string; // 'Lab IPA', 'Lab Komputer', 'Ruang Guru', 'Ruang TU', etc.
  dapatDipinjamkan: boolean;
  keterangan?: string;
}

export interface LoanItemDetail {
  itemId: string;
  kodeBarang: string;
  namaBarang: string;
  jumlah: number;
  kondisiSaatPinjam: ItemCondition;
}

export type LoanStatus = 'Dipinjam' | 'Sudah Kembali' | 'Terlambat' | 'Rusak/Hilang';

export interface EquipmentLoan {
  id: string;
  nomorPinjam: string; // e.g. PJM/2026/09/001
  tanggalPinjam: string; // YYYY-MM-DD
  jamPinjam: string; // HH:mm
  jenisPeminjam: 'Guru/Pegawai' | 'Siswa' | 'Pihak Luar';
  peminjamId?: string; // Staff or Student ID if internal
  namaPeminjam: string;
  identitasPeminjam: string; // e.g. "Guru IPA (SMPN 2 KTS)" / "Siswa Kelas 8B" / "Pengurus Komite"
  noHpPeminjam: string;
  items: LoanItemDetail[];
  keperluan: string; // e.g. "Praktikum IPA Uji Makanan Kelas 8A"
  rencanaTanggalKembali: string; // YYYY-MM-DD
  rencanaJamKembali: string; // HH:mm
  namaPetugasPelayan: string;
  tandaTanganUrl?: string; // Data URL of signature canvas
  catatanPinjam?: string;
  
  // Return fields
  status: LoanStatus;
  tanggalKembali?: string;
  jamKembali?: string;
  kondisiKembali?: 'Baik' | 'Rusak' | 'Hilang';
  keteranganKembali?: string;
  tindakLanjutGantiRugi?: string;
  namaPetugasPenerima?: string;
}

export type CashFlowType = 'Penerimaan' | 'Pengeluaran';

export interface CashTransaction {
  id: string;
  nomorBukti: string;
  tanggal: string;
  uraian: string;
  kodeRekening: string; // e.g. "5.1.02.01.01"
  sumberDana: 'BOS Reguler' | 'BOS Kinerja' | 'Dana Komite' | 'Lainnya';
  jenis: CashFlowType;
  nominal: number;
  saldoSetelahnya: number;
  komponenAnggaran: 'Gaji/Honor' | 'Belanja Barang/Jasa' | 'Pemeliharaan Sarpras' | 'Kegiatan Kesiswaan' | 'Peralatan/Modal';
  notaFile?: string;
}

export interface SchoolIdentity {
  namaSekolah: string;
  npsn: string;
  nss: string;
  akreditasi: string;
  alamatLengkap: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  kepalaTu: string;
  nipKepalaTu: string;
  tahunAjaranAktif: string; // e.g. "2026/2027"
  semesterAktif: 'Ganjil' | 'Genap';
  lamaPinjamMaksimalHari: number;
  formatNomorPinjam: string;
  formatNomorSuratKeluar: string;
}

// ==========================================
// PIKET HARIAN TYPES
// ==========================================

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export interface PiketClassRecap {
  rombel: string; // '7A', '7B', etc.
  jumlahSiswa: number;
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  dispensasi: number;
  persentaseHadir: number;
}

export interface PiketAbsentStudent {
  id: string;
  studentId?: string;
  namaSiswa: string;
  nis: string;
  rombel: string;
  keterangan: 'Sakit' | 'Izin' | 'Alpa' | 'Dispensasi';
  alasan: string;
  buktiFotoUrl?: string;
}

export interface PiketLateStudent {
  id: string;
  namaSiswa: string;
  rombel: string;
  jamDatang: string;
  tindakanSanksi: string;
}

export interface PiketEarlyLeaveStudent {
  id: string;
  namaSiswa: string;
  rombel: string;
  jam: string;
  alasan: string;
  penjemput: string;
}

export interface PiketTeacherAbsence {
  id: string;
  namaGuru: string;
  jamKe: string;
  rombel: string;
  guruPenggantiTugas: string;
}

export interface PiketSchoolGuest {
  id: string;
  nama: string;
  instansi: string;
  keperluan: string;
  jam: string;
}

export interface PiketIncidents {
  siswaTerlambat: PiketLateStudent[];
  siswaIzinKeluarPulang: PiketEarlyLeaveStudent[];
  guruTidakHadirDanKelasKosong: PiketTeacherAbsence[];
  tamuSekolah: PiketSchoolGuest[];
  catatanLain: string;
  fotoDokumentasi?: string[];
}

export interface PiketReport {
  id: string;
  nomorLaporan: string; // e.g. "PKT/2026/09/21/001"
  tanggal: string; // YYYY-MM-DD
  hari: DayOfWeek;
  guruPiketIds: string[];
  namaGuruPiket: string[];
  jamMasuk: string; // "06:45"
  jamPulang: string; // "14:30"
  tahunAjaran: string; // "2026/2027"
  semester: 'Ganjil' | 'Genap';
  status: 'Draft' | 'Terkirim';
  rekapKelas: PiketClassRecap[];
  detailSiswaTidakHadir: PiketAbsentStudent[];
  catatanKejadian: PiketIncidents;
  tandaTanganGuruUrl?: string;
  verifikasiKepalaSekolah?: {
    diverifikasi: boolean;
    tanggalVerifikasi?: string;
    catatan?: string;
    namaKepalaSekolah?: string;
  };
  createdAt: string;
}

export interface JadwalPiketItem {
  id: string;
  hari: DayOfWeek;
  guruIds: string[];
  namaGuru: string[];
  koordinator: string;
  jamTugas: string;
}

// ==========================================
// MUTASI SISWA TYPES
// ==========================================

export type MutationType = 'masuk' | 'keluar';

export interface SubjectScore {
  mataPelajaran: string;
  nilai: number;
  kkm: number;
}

export interface StudentMutation {
  id: string;
  nomorMutasi: string; // e.g. "MTS-M/2026/09/001" or "MTS-K/2026/09/001"
  jenis: MutationType;
  tanggalMutasi: string; // YYYY-MM-DD
  tanggalEfektif: string; // YYYY-MM-DD
  studentId?: string; // If mutasi keluar or linked student
  nisn: string;
  nis: string;
  namaSiswa: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: Gender;
  agama: 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
  alamat: string;
  anakKe?: number;
  jumlahSaudara?: number;
  namaAyah: string;
  pekerjaanAyah: string;
  pendidikanAyah?: string;
  penghasilanAyah?: string;
  namaIbu: string;
  pekerjaanIbu: string;
  pendidikanIbu?: string;
  penghasilanIbu?: string;
  namaWali?: string;
  noHpOrtu: string;
  
  // Origin School (For Mutasi Masuk)
  asalSekolah?: {
    namaSekolah: string;
    npsn?: string;
    alamat?: string;
    alamatSekolah?: string;
    kabupatenKota?: string;
    provinsi?: string;
    kelasAsal?: string;
    nomorSuratPindah?: string;
    tanggalSuratPindah?: string;
  };

  // Destination School (For Mutasi Keluar)
  tujuanSekolah?: {
    namaSekolah: string;
    npsn?: string;
    alamat?: string;
    kabupatenKota?: string;
    provinsi?: string;
  };

  kelasTujuan?: string; // '7', '8', '9'
  rombelTujuan?: string; // '7A' - '9D'
  alasan: string;
  tahunAjaran?: string;
  semester?: 'Ganjil' | 'Genap';

  // Checklist Berkas Mutasi
  kelengkapanBerkas?: {
    suratPindahSekolahAsal?: boolean;
    suratRekomendasiDinas?: boolean;
    fotokopiRapor?: boolean;
    fotokopiAktaKelahiran?: boolean;
    fotokopiKartuKeluarga?: boolean;
    suratBebasMasalah?: boolean;
  };

  // Administration Clearance
  keteranganAdministrasi?: {
    statusLunas: boolean;
    catatanTunggakan?: string;
    pinjamanBarangTerselesaikan: boolean;
    catatanBarang?: string;
  };

  // File Uploads
  berkasUpload?: {
    suratPindah?: string;
    raporTerakhir?: string;
    aktaKelahiran?: string;
    kartuKeluarga?: string;
    suratKetNisn?: string;
    suratPermohonanOrtu?: string;
  };

  nilaiRaporAsal?: SubjectScore[];
  petugasPencatat: string;
  createdAt: string;
}

// ==========================================
// REKAP KEHADIRAN IMPORT LOG TYPES
// ==========================================

export interface SpreadsheetImportLog {
  id: string;
  tanggal: string; // YYYY-MM-DD
  waktu: string; // HH:mm
  namaPengguna: string;
  namaFile: string;
  tipeImport: 'rekap_per_rombel' | 'presensi_harian_siswa' | 'presensi_bulanan_matriks';
  rombel: string; // 'Semua' or '8A'
  periode: string; // e.g. "September 2026"
  jumlahBerhasil: number;
  jumlahGagal: number;
  snapshotSebelumnya: StudentAttendanceRecap[];
  catatan: string;
}

