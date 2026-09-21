import { 
  PiketReport, 
  JadwalPiketItem, 
  StudentMutation, 
  SpreadsheetImportLog 
} from '../types';

export const initialJadwalPiket: JadwalPiketItem[] = [
  {
    id: 'jp-senin',
    hari: 'Senin',
    guruIds: ['stf-003', 'stf-005'],
    namaGuru: ['Sugito, S.Pd', 'Siti Rahayu, S.Pd'],
    koordinator: 'Sugito, S.Pd',
    jamTugas: '06:30 - 14:30 WIB'
  },
  {
    id: 'jp-selasa',
    hari: 'Selasa',
    guruIds: ['stf-004', 'stf-008'],
    namaGuru: ['Endah Retnowati, S.Pd', 'Agus Setiawan, S.Pd'],
    koordinator: 'Endah Retnowati, S.Pd',
    jamTugas: '06:45 - 14:30 WIB'
  },
  {
    id: 'jp-rabu',
    hari: 'Rabu',
    guruIds: ['stf-006', 'stf-011'],
    namaGuru: ['Dra. Hj. Nurhidayati, M.Pd', 'Dwi Lestari, S.Pd'],
    koordinator: 'Dra. Hj. Nurhidayati, M.Pd',
    jamTugas: '06:45 - 14:30 WIB'
  },
  {
    id: 'jp-kamis',
    hari: 'Kamis',
    guruIds: ['stf-007', 'stf-013'],
    namaGuru: ['Budi Santoso, S.Pd', 'Eko Sulistyo, S.Pd'],
    koordinator: 'Budi Santoso, S.Pd',
    jamTugas: '06:45 - 14:30 WIB'
  },
  {
    id: 'jp-jumat',
    hari: 'Jumat',
    guruIds: ['stf-009', 'stf-010'],
    namaGuru: ['Rina Kusuma Dewi, S.Pd', 'Hadi Suwito, S.Ag'],
    koordinator: 'Hadi Suwito, S.Ag',
    jamTugas: '06:30 - 11:30 WIB'
  },
  {
    id: 'jp-sabtu',
    hari: 'Sabtu',
    guruIds: ['stf-012', 'stf-003'],
    namaGuru: ['Anisa Nurul Aini, S.Pd', 'Sugito, S.Pd'],
    koordinator: 'Anisa Nurul Aini, S.Pd',
    jamTugas: '06:45 - 13:00 WIB'
  }
];

// Helper to generate 19 rombels default recap
const defaultRombels = [
  '7A', '7B', '7C', '7D', '7E', '7F',
  '8A', '8B', '8C', '8D', '8E', '8F', '8G',
  '9A', '9B', '9C', '9D', '9E', '9F'
];

export const initialPiketReports: PiketReport[] = [
  {
    id: 'pkt-20260921-001',
    nomorLaporan: 'PKT/2026/09/21/001',
    tanggal: '2026-09-21',
    hari: 'Senin',
    guruPiketIds: ['stf-003', 'stf-005'],
    namaGuruPiket: ['Sugito, S.Pd', 'Siti Rahayu, S.Pd'],
    jamMasuk: '06:30',
    jamPulang: '14:30',
    tahunAjaran: '2026/2027',
    semester: 'Ganjil',
    status: 'Terkirim',
    rekapKelas: [
      { rombel: '7A', jumlahSiswa: 32, hadir: 31, sakit: 1, izin: 0, alpa: 0, dispensasi: 0, persentaseHadir: 96.9 },
      { rombel: '7B', jumlahSiswa: 32, hadir: 30, sakit: 1, izin: 1, alpa: 0, dispensasi: 0, persentaseHadir: 93.8 },
      { rombel: '7C', jumlahSiswa: 32, hadir: 32, sakit: 0, izin: 0, alpa: 0, dispensasi: 0, persentaseHadir: 100 },
      { rombel: '7D', jumlahSiswa: 32, hadir: 31, sakit: 0, izin: 1, alpa: 0, dispensasi: 0, persentaseHadir: 96.9 },
      { rombel: '7E', jumlahSiswa: 32, hadir: 31, sakit: 1, izin: 0, alpa: 0, dispensasi: 0, persentaseHadir: 96.9 },
      { rombel: '7F', jumlahSiswa: 32, hadir: 32, sakit: 0, izin: 0, alpa: 0, dispensasi: 0, persentaseHadir: 100 },
      { rombel: '8A', jumlahSiswa: 32, hadir: 30, sakit: 1, izin: 0, alpa: 1, dispensasi: 0, persentaseHadir: 93.8 },
      { rombel: '8B', jumlahSiswa: 32, hadir: 31, sakit: 0, izin: 1, alpa: 0, dispensasi: 0, persentaseHadir: 96.9 },
      { rombel: '8C', jumlahSiswa: 32, hadir: 32, sakit: 0, izin: 0, alpa: 0, dispensasi: 0, persentaseHadir: 100 },
      { rombel: '8D', jumlahSiswa: 32, hadir: 30, sakit: 2, izin: 0, alpa: 0, dispensasi: 0, persentaseHadir: 93.8 },
      { rombel: '8E', jumlahSiswa: 32, hadir: 31, sakit: 1, izin: 0, alpa: 0, dispensasi: 0, persentaseHadir: 96.9 },
      { rombel: '8F', jumlahSiswa: 32, hadir: 32, sakit: 0, izin: 0, alpa: 0, dispensasi: 0, persentaseHadir: 100 },
      { rombel: '8G', jumlahSiswa: 31, hadir: 30, sakit: 1, izin: 0, alpa: 0, dispensasi: 0, persentaseHadir: 96.8 },
      { rombel: '9A', jumlahSiswa: 32, hadir: 29, sakit: 1, izin: 0, alpa: 0, dispensasi: 2, persentaseHadir: 96.9 },
      { rombel: '9B', jumlahSiswa: 32, hadir: 32, sakit: 0, izin: 0, alpa: 0, dispensasi: 0, persentaseHadir: 100 },
      { rombel: '9C', jumlahSiswa: 32, hadir: 31, sakit: 1, izin: 0, alpa: 0, dispensasi: 0, persentaseHadir: 96.9 },
      { rombel: '9D', jumlahSiswa: 32, hadir: 31, sakit: 0, izin: 1, alpa: 0, dispensasi: 0, persentaseHadir: 96.9 },
      { rombel: '9E', jumlahSiswa: 32, hadir: 32, sakit: 0, izin: 0, alpa: 0, dispensasi: 0, persentaseHadir: 100 },
      { rombel: '9F', jumlahSiswa: 32, hadir: 31, sakit: 1, izin: 0, alpa: 0, dispensasi: 0, persentaseHadir: 96.9 },
    ],
    detailSiswaTidakHadir: [
      {
        id: 'abs-01',
        namaSiswa: 'Dimas Setiawan',
        nis: '8409',
        rombel: '8A',
        keterangan: 'Alpa',
        alasan: 'Tanpa keterangan, orang tua dihubungi belum merespons'
      },
      {
        id: 'abs-02',
        namaSiswa: 'Fadhil Muhammad',
        nis: '8413',
        rombel: '8A',
        keterangan: 'Sakit',
        alasan: 'Demam tinggi, surat dokter dari Klinik Pratama Kutasari'
      },
      {
        id: 'abs-03',
        namaSiswa: 'Bagas Aditya Rahman',
        nis: '8405',
        rombel: '7A',
        keterangan: 'Sakit',
        alasan: 'Radang tenggorokan'
      },
      {
        id: 'abs-04',
        namaSiswa: 'Muhammad Rizky Ramadhan',
        nis: '8423',
        rombel: '9A',
        keterangan: 'Dispensasi',
        alasan: 'Mewakili sekolah dalam Babak Final OSN Matematika Tingkat Kabupaten'
      },
      {
        id: 'abs-05',
        namaSiswa: 'Naufal Arya Pratama',
        nis: '8425',
        rombel: '9A',
        keterangan: 'Dispensasi',
        alasan: 'Mewakili sekolah dalam Babak Final OSN IPA Tingkat Kabupaten'
      }
    ],
    catatanKejadian: {
      siswaTerlambat: [
        {
          id: 'lt-01',
          namaSiswa: 'Rehan Maulana',
          rombel: '8C',
          jamDatang: '07:15',
          tindakanSanksi: 'Pembinaan piket, membaca Asmaul Husna, lapor ke BK'
        },
        {
          id: 'lt-02',
          namaSiswa: 'Gilang Ramadhan',
          rombel: '7B',
          jamDatang: '07:20',
          tindakanSanksi: 'Dicatat di buku saku tata tertib, dibina di pos piket'
        }
      ],
      siswaIzinKeluarPulang: [
        {
          id: 'el-01',
          namaSiswa: 'Citra Dewi Anggraini',
          rombel: '8A',
          jam: '10:30',
          alasan: 'Mengalami pusing hebat dan mual di UKS',
          penjemput: 'Ibu Kandung (Ny. Maryam)'
        }
      ],
      guruTidakHadirDanKelasKosong: [
        {
          id: 'ta-01',
          namaGuru: 'Agus Setiawan, S.Pd',
          jamKe: '3 - 4',
          rombel: '8B',
          guruPenggantiTugas: 'Tugas Bahasa Inggris modul Bab 3 dikerjakan didampingi Sugito, S.Pd'
        }
      ],
      tamuSekolah: [
        {
          id: 'gs-01',
          nama: 'Drs. H. Mulyono, M.Pd',
          instansi: 'Pengawas SMP Dinas Pendidikan Kab. Purbalingga',
          keperluan: 'Monitoring KBM dan Supervisi Administrasi Guru',
          jam: '08:45 - 11:30'
        },
        {
          id: 'gs-02',
          nama: 'drg. Tri Hapsari',
          instansi: 'Puskesmas Kutasari',
          keperluan: 'Koordinasi program penjaringan kesehatan gigi siswa kelas 7',
          jam: '09:15 - 10:00'
        }
      ],
      catatanLain: 'Upacara bendera hari Senin berlangsung khidmat dan tertib. Cuaca cerah dan seluruh siswa mengikuti upacara dengan seragam lengkap.'
    },
    verifikasiKepalaSekolah: {
      diverifikasi: true,
      tanggalVerifikasi: '2026-09-21 14:15',
      catatan: 'Laporan piket lengkap dan tertib. Tindak lanjuti siswa 8A alpa bersama wali kelas.',
      namaKepalaSekolah: 'Drs. H. Bambang Sudarmo, M.Pd.'
    },
    createdAt: '2026-09-21T07:00:00.000Z'
  },
  {
    id: 'pkt-20260919-002',
    nomorLaporan: 'PKT/2026/09/19/002',
    tanggal: '2026-09-19',
    hari: 'Sabtu',
    guruPiketIds: ['stf-012', 'stf-003'],
    namaGuruPiket: ['Anisa Nurul Aini, S.Pd', 'Sugito, S.Pd'],
    jamMasuk: '06:45',
    jamPulang: '13:00',
    tahunAjaran: '2026/2027',
    semester: 'Ganjil',
    status: 'Terkirim',
    rekapKelas: defaultRombels.map(r => ({
      rombel: r,
      jumlahSiswa: 32,
      hadir: 31,
      sakit: 1,
      izin: 0,
      alpa: 0,
      dispensasi: 0,
      persentaseHadir: 96.9
    })),
    detailSiswaTidakHadir: [
      {
        id: 'abs-06',
        namaSiswa: 'Dewi Ayu Lestari',
        nis: '8408',
        rombel: '8B',
        keterangan: 'Sakit',
        alasan: 'Sakit flu demam'
      }
    ],
    catatanKejadian: {
      siswaTerlambat: [],
      siswaIzinKeluarPulang: [],
      guruTidakHadirDanKelasKosong: [],
      tamuSekolah: [
        {
          id: 'gs-03',
          nama: 'Bapak Subur',
          instansi: 'Pengurus Komite Sekolah',
          keperluan: 'Konsultasi persiapan peringatan Hari Pramuka sekolah',
          jam: '09:00 - 10:30'
        }
      ],
      catatanLain: 'Kegiatan Senam Sehat Bersama dan Sabtu Bersih berjalan lancar.'
    },
    verifikasiKepalaSekolah: {
      diverifikasi: true,
      tanggalVerifikasi: '2026-09-19 12:45',
      catatan: 'Terima kasih atas dedikasi guru piket sabtu.',
      namaKepalaSekolah: 'Drs. H. Bambang Sudarmo, M.Pd.'
    },
    createdAt: '2026-09-19T07:00:00.000Z'
  },
  {
    id: 'pkt-20260918-003',
    nomorLaporan: 'PKT/2026/09/18/003',
    tanggal: '2026-09-18',
    hari: 'Jumat',
    guruPiketIds: ['stf-009', 'stf-010'],
    namaGuruPiket: ['Rina Kusuma Dewi, S.Pd', 'Hadi Suwito, S.Ag'],
    jamMasuk: '06:30',
    jamPulang: '11:45',
    tahunAjaran: '2026/2027',
    semester: 'Ganjil',
    status: 'Terkirim',
    rekapKelas: defaultRombels.map(r => ({
      rombel: r,
      jumlahSiswa: 32,
      hadir: 30,
      sakit: 1,
      izin: 1,
      alpa: 0,
      dispensasi: 0,
      persentaseHadir: 93.8
    })),
    detailSiswaTidakHadir: [
      {
        id: 'abs-07',
        namaSiswa: 'Bayu Aji Pamungkas',
        nis: '8406',
        rombel: '7C',
        keterangan: 'Izin',
        alasan: 'Ada hajatan keluarga di Cilacap'
      }
    ],
    catatanKejadian: {
      siswaTerlambat: [
        {
          id: 'lt-03',
          namaSiswa: 'Wahyu Nugraha',
          rombel: '9B',
          jamDatang: '07:05',
          tindakanSanksi: 'Membantu persiapan sholat Jumat di Musholla'
        }
      ],
      siswaIzinKeluarPulang: [],
      guruTidakHadirDanKelasKosong: [],
      tamuSekolah: [],
      catatanLain: 'Sholat Jumat berjamaah di Musholla Nurul Ilmi SMPN 2 Kutasari berjalan khusyuk.'
    },
    verifikasiKepalaSekolah: {
      diverifikasi: true,
      tanggalVerifikasi: '2026-09-18 11:30',
      catatan: 'Disetujui.',
      namaKepalaSekolah: 'Drs. H. Bambang Sudarmo, M.Pd.'
    },
    createdAt: '2026-09-18T06:30:00.000Z'
  },
  {
    id: 'pkt-20260917-004',
    nomorLaporan: 'PKT/2026/09/17/004',
    tanggal: '2026-09-17',
    hari: 'Kamis',
    guruPiketIds: ['stf-007', 'stf-013'],
    namaGuruPiket: ['Budi Santoso, S.Pd', 'Eko Sulistyo, S.Pd'],
    jamMasuk: '06:45',
    jamPulang: '14:30',
    tahunAjaran: '2026/2027',
    semester: 'Ganjil',
    status: 'Terkirim',
    rekapKelas: defaultRombels.map(r => ({
      rombel: r,
      jumlahSiswa: 32,
      hadir: 31,
      sakit: 0,
      izin: 1,
      alpa: 0,
      dispensasi: 0,
      persentaseHadir: 96.9
    })),
    detailSiswaTidakHadir: [],
    catatanKejadian: {
      siswaTerlambat: [],
      siswaIzinKeluarPulang: [],
      guruTidakHadirDanKelasKosong: [],
      tamuSekolah: [],
      catatanLain: 'KBM berjalan tertib lancar.'
    },
    verifikasiKepalaSekolah: {
      diverifikasi: true,
      tanggalVerifikasi: '2026-09-17 14:00',
      catatan: 'Tertib dan rapi.',
      namaKepalaSekolah: 'Drs. H. Bambang Sudarmo, M.Pd.'
    },
    createdAt: '2026-09-17T07:00:00.000Z'
  },
  {
    id: 'pkt-20260916-005',
    nomorLaporan: 'PKT/2026/09/16/005',
    tanggal: '2026-09-16',
    hari: 'Rabu',
    guruPiketIds: ['stf-006', 'stf-011'],
    namaGuruPiket: ['Dra. Hj. Nurhidayati, M.Pd', 'Dwi Lestari, S.Pd'],
    jamMasuk: '06:45',
    jamPulang: '14:30',
    tahunAjaran: '2026/2027',
    semester: 'Ganjil',
    status: 'Terkirim',
    rekapKelas: defaultRombels.map(r => ({
      rombel: r,
      jumlahSiswa: 32,
      hadir: 30,
      sakit: 1,
      izin: 1,
      alpa: 0,
      dispensasi: 0,
      persentaseHadir: 93.8
    })),
    detailSiswaTidakHadir: [],
    catatanKejadian: {
      siswaTerlambat: [],
      siswaIzinKeluarPulang: [],
      guruTidakHadirDanKelasKosong: [],
      tamuSekolah: [],
      catatanLain: 'Seluruh kelas terisi guru pengampu.'
    },
    verifikasiKepalaSekolah: {
      diverifikasi: true,
      tanggalVerifikasi: '2026-09-16 14:10',
      catatan: 'Baik.',
      namaKepalaSekolah: 'Drs. H. Bambang Sudarmo, M.Pd.'
    },
    createdAt: '2026-09-16T07:00:00.000Z'
  },
  {
    id: 'pkt-20260915-006',
    nomorLaporan: 'PKT/2026/09/15/006',
    tanggal: '2026-09-15',
    hari: 'Selasa',
    guruPiketIds: ['stf-004', 'stf-008'],
    namaGuruPiket: ['Endah Retnowati, S.Pd', 'Agus Setiawan, S.Pd'],
    jamMasuk: '06:45',
    jamPulang: '14:30',
    tahunAjaran: '2026/2027',
    semester: 'Ganjil',
    status: 'Terkirim',
    rekapKelas: defaultRombels.map(r => ({
      rombel: r,
      jumlahSiswa: 32,
      hadir: 31,
      sakit: 1,
      izin: 0,
      alpa: 0,
      dispensasi: 0,
      persentaseHadir: 96.9
    })),
    detailSiswaTidakHadir: [],
    catatanKejadian: {
      siswaTerlambat: [],
      siswaIzinKeluarPulang: [],
      guruTidakHadirDanKelasKosong: [],
      tamuSekolah: [],
      catatanLain: 'Kondisi lingkungan sekolah bersih dan kondusif.'
    },
    verifikasiKepalaSekolah: {
      diverifikasi: true,
      tanggalVerifikasi: '2026-09-15 14:00',
      catatan: 'Diverifikasi.',
      namaKepalaSekolah: 'Drs. H. Bambang Sudarmo, M.Pd.'
    },
    createdAt: '2026-09-15T07:00:00.000Z'
  },
  {
    id: 'pkt-20260914-007',
    nomorLaporan: 'PKT/2026/09/14/007',
    tanggal: '2026-09-14',
    hari: 'Senin',
    guruPiketIds: ['stf-003', 'stf-005'],
    namaGuruPiket: ['Sugito, S.Pd', 'Siti Rahayu, S.Pd'],
    jamMasuk: '06:30',
    jamPulang: '14:30',
    tahunAjaran: '2026/2027',
    semester: 'Ganjil',
    status: 'Terkirim',
    rekapKelas: defaultRombels.map(r => ({
      rombel: r,
      jumlahSiswa: 32,
      hadir: 30,
      sakit: 2,
      izin: 0,
      alpa: 0,
      dispensasi: 0,
      persentaseHadir: 93.8
    })),
    detailSiswaTidakHadir: [],
    catatanKejadian: {
      siswaTerlambat: [],
      siswaIzinKeluarPulang: [],
      guruTidakHadirDanKelasKosong: [],
      tamuSekolah: [],
      catatanLain: 'Upacara Senin terlaksana lancar.'
    },
    verifikasiKepalaSekolah: {
      diverifikasi: true,
      tanggalVerifikasi: '2026-09-14 14:30',
      catatan: 'Terima kasih.',
      namaKepalaSekolah: 'Drs. H. Bambang Sudarmo, M.Pd.'
    },
    createdAt: '2026-09-14T07:00:00.000Z'
  },
  {
    id: 'pkt-20260912-008',
    nomorLaporan: 'PKT/2026/09/12/008',
    tanggal: '2026-09-12',
    hari: 'Sabtu',
    guruPiketIds: ['stf-012', 'stf-003'],
    namaGuruPiket: ['Anisa Nurul Aini, S.Pd', 'Sugito, S.Pd'],
    jamMasuk: '06:45',
    jamPulang: '13:00',
    tahunAjaran: '2026/2027',
    semester: 'Ganjil',
    status: 'Terkirim',
    rekapKelas: defaultRombels.map(r => ({
      rombel: r,
      jumlahSiswa: 32,
      hadir: 31,
      sakit: 1,
      izin: 0,
      alpa: 0,
      dispensasi: 0,
      persentaseHadir: 96.9
    })),
    detailSiswaTidakHadir: [],
    catatanKejadian: {
      siswaTerlambat: [],
      siswaIzinKeluarPulang: [],
      guruTidakHadirDanKelasKosong: [],
      tamuSekolah: [],
      catatanLain: 'Pramuka ekstrakurikuler wajib kelas 7 dan 8 berjalan tertib.'
    },
    verifikasiKepalaSekolah: {
      diverifikasi: true,
      tanggalVerifikasi: '2026-09-12 12:50',
      catatan: 'Bagus.',
      namaKepalaSekolah: 'Drs. H. Bambang Sudarmo, M.Pd.'
    },
    createdAt: '2026-09-12T07:00:00.000Z'
  },
  {
    id: 'pkt-20260911-009',
    nomorLaporan: 'PKT/2026/09/11/009',
    tanggal: '2026-09-11',
    hari: 'Jumat',
    guruPiketIds: ['stf-009', 'stf-010'],
    namaGuruPiket: ['Rina Kusuma Dewi, S.Pd', 'Hadi Suwito, S.Ag'],
    jamMasuk: '06:30',
    jamPulang: '11:45',
    tahunAjaran: '2026/2027',
    semester: 'Ganjil',
    status: 'Terkirim',
    rekapKelas: defaultRombels.map(r => ({
      rombel: r,
      jumlahSiswa: 32,
      hadir: 32,
      sakit: 0,
      izin: 0,
      alpa: 0,
      dispensasi: 0,
      persentaseHadir: 100
    })),
    detailSiswaTidakHadir: [],
    catatanKejadian: {
      siswaTerlambat: [],
      siswaIzinKeluarPulang: [],
      guruTidakHadirDanKelasKosong: [],
      tamuSekolah: [],
      catatanLain: 'Kehadiran 100% di sebagian besar kelas.'
    },
    verifikasiKepalaSekolah: {
      diverifikasi: true,
      tanggalVerifikasi: '2026-09-11 11:40',
      catatan: 'Apresiasi untuk kehadiran 100%.',
      namaKepalaSekolah: 'Drs. H. Bambang Sudarmo, M.Pd.'
    },
    createdAt: '2026-09-11T06:30:00.000Z'
  },
  {
    id: 'pkt-20260910-010',
    nomorLaporan: 'PKT/2026/09/10/010',
    tanggal: '2026-09-10',
    hari: 'Kamis',
    guruPiketIds: ['stf-007', 'stf-013'],
    namaGuruPiket: ['Budi Santoso, S.Pd', 'Eko Sulistyo, S.Pd'],
    jamMasuk: '06:45',
    jamPulang: '14:30',
    tahunAjaran: '2026/2027',
    semester: 'Ganjil',
    status: 'Terkirim',
    rekapKelas: defaultRombels.map(r => ({
      rombel: r,
      jumlahSiswa: 32,
      hadir: 30,
      sakit: 1,
      izin: 1,
      alpa: 0,
      dispensasi: 0,
      persentaseHadir: 93.8
    })),
    detailSiswaTidakHadir: [],
    catatanKejadian: {
      siswaTerlambat: [],
      siswaIzinKeluarPulang: [],
      guruTidakHadirDanKelasKosong: [],
      tamuSekolah: [],
      catatanLain: 'Lancar dan tertib.'
    },
    verifikasiKepalaSekolah: {
      diverifikasi: true,
      tanggalVerifikasi: '2026-09-10 14:15',
      catatan: 'Disetujui.',
      namaKepalaSekolah: 'Drs. H. Bambang Sudarmo, M.Pd.'
    },
    createdAt: '2026-09-10T07:00:00.000Z'
  }
];

// ==========================================
// INITIAL STUDENT MUTATIONS DATA
// ==========================================

export const initialStudentMutations: StudentMutation[] = [
  // Mutasi Masuk 1
  {
    id: 'mts-m-001',
    nomorMutasi: 'MTS-M/2026/08/001',
    jenis: 'masuk',
    tanggalMutasi: '2026-08-04',
    tanggalEfektif: '2026-08-05',
    nisn: '0115543210',
    nis: '8433',
    namaSiswa: 'Rian Fajar Kusuma',
    nik: '3303021408110001',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2011-08-14',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'Desa Karangcegak RT 02 RW 01, Kec. Kutasari',
    anakKe: 2,
    jumlahSaudara: 3,
    namaAyah: 'Slamet Kusuma',
    pekerjaanAyah: 'PNS / Guru',
    pendidikanAyah: 'S1 Pendidikan',
    penghasilanAyah: 'Rp 4.000.000 - Rp 6.000.000',
    namaIbu: 'Sri Mulyani',
    pekerjaanIbu: 'Pedagang',
    pendidikanIbu: 'SMA',
    penghasilanIbu: 'Rp 2.000.000 - Rp 3.000.000',
    noHpOrtu: '081329871101',
    asalSekolah: {
      namaSekolah: 'SMP Negeri 1 Bobotsari',
      npsn: '20303154',
      alamat: 'Jl. Pemuda No. 12, Bobotsari',
      kabupatenKota: 'Kabupaten Purbalingga',
      provinsi: 'Jawa Tengah',
      kelasAsal: 'Kelas 8',
      nomorSuratPindah: '421.3/145/SMPN1BBT/2026',
      tanggalSuratPindah: '2026-08-01'
    },
    kelasTujuan: '8',
    rombelTujuan: '8B',
    alasan: 'Orang tua pindah tugas kedinasan ke wilayah Kecamatan Kutasari',
    keteranganAdministrasi: {
      statusLunas: true,
      pinjamanBarangTerselesaikan: true
    },
    berkasUpload: {
      suratPindah: 'surat_pindah_rian_bbt.pdf',
      raporTerakhir: 'rapor_semester_2_rian.pdf',
      aktaKelahiran: 'akta_rian.pdf',
      kartuKeluarga: 'kk_slamet_kusuma.pdf',
      suratKetNisn: 'nisn_rian.pdf'
    },
    nilaiRaporAsal: [
      { mataPelajaran: 'PAI & Budi Pekerti', nilai: 88, kkm: 75 },
      { mataPelajaran: 'Pendidikan Pancasila', nilai: 85, kkm: 75 },
      { mataPelajaran: 'Bahasa Indonesia', nilai: 84, kkm: 75 },
      { mataPelajaran: 'Matematika', nilai: 82, kkm: 70 },
      { mataPelajaran: 'IPA', nilai: 86, kkm: 75 },
      { mataPelajaran: 'IPS', nilai: 85, kkm: 75 },
      { mataPelajaran: 'Bahasa Inggris', nilai: 83, kkm: 70 }
    ],
    petugasPencatat: 'Siti Aminah, A.Md (Staf TU Kesiswaan)',
    createdAt: '2026-08-04T09:00:00.000Z'
  },
  // Mutasi Masuk 2
  {
    id: 'mts-m-002',
    nomorMutasi: 'MTS-M/2026/08/002',
    jenis: 'masuk',
    tanggalMutasi: '2026-08-18',
    tanggalEfektif: '2026-08-19',
    nisn: '0129876541',
    nis: '7433',
    namaSiswa: 'Zahra Amelia Safitri',
    nik: '3303055209120002',
    tempatLahir: 'Banyumas',
    tanggalLahir: '2012-09-12',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'Desa Cendana RT 03 RW 02, Kec. Kutasari',
    anakKe: 1,
    jumlahSaudara: 2,
    namaAyah: 'Agus Triyono',
    pekerjaanAyah: 'Wiraswasta',
    pendidikanAyah: 'D3 Teknik',
    penghasilanAyah: 'Rp 3.500.000',
    namaIbu: 'Dewi Kartika',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    pendidikanIbu: 'SMA',
    noHpOrtu: '085747123987',
    asalSekolah: {
      namaSekolah: 'SMP Negeri 3 Purbalingga',
      npsn: '20303180',
      alamat: 'Jl. Tentara Pelajar No. 4, Purbalingga',
      kabupatenKota: 'Kabupaten Purbalingga',
      provinsi: 'Jawa Tengah',
      kelasAsal: 'Kelas 7',
      nomorSuratPindah: '421.3/210/SMPN3PBG/2026',
      tanggalSuratPindah: '2026-08-15'
    },
    kelasTujuan: '7',
    rombelTujuan: '7C',
    alasan: 'Pindah domisili keluarga mengikuti kakek-nenek di Kutasari',
    keteranganAdministrasi: {
      statusLunas: true,
      pinjamanBarangTerselesaikan: true
    },
    petugasPencatat: 'Siti Aminah, A.Md',
    createdAt: '2026-08-18T10:30:00.000Z'
  },
  // Mutasi Masuk 3
  {
    id: 'mts-m-003',
    nomorMutasi: 'MTS-M/2026/09/001',
    jenis: 'masuk',
    tanggalMutasi: '2026-09-02',
    tanggalEfektif: '2026-09-03',
    nisn: '0106549870',
    nis: '9433',
    namaSiswa: 'Farhan Maulana Hakim',
    nik: '3303051902100003',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2010-02-19',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'Desa Tobong RT 01 RW 03, Kec. Kutasari',
    anakKe: 3,
    jumlahSaudara: 3,
    namaAyah: 'Drs. Lukman Hakim',
    pekerjaanAyah: 'Karyawan Swasta',
    namaIbu: 'Hj. Anisah',
    pekerjaanIbu: 'PNS',
    noHpOrtu: '081229001122',
    asalSekolah: {
      namaSekolah: 'SMP Muhammadiyah 1 Purbalingga',
      npsn: '20303165',
      alamat: 'Jl. Piere Tendean, Purbalingga',
      kabupatenKota: 'Kabupaten Purbalingga',
      provinsi: 'Jawa Tengah',
      kelasAsal: 'Kelas 9',
      nomorSuratPindah: '421.3/088/SMP.MUH.1/2026',
      tanggalSuratPindah: '2026-08-30'
    },
    kelasTujuan: '9',
    rombelTujuan: '9A',
    alasan: 'Mendekatkan jarak tempuh sekolah dengan rumah tinggal',
    keteranganAdministrasi: {
      statusLunas: true,
      pinjamanBarangTerselesaikan: true
    },
    petugasPencatat: 'Karyono, S.AP',
    createdAt: '2026-09-02T08:15:00.000Z'
  },
  // Mutasi Masuk 4
  {
    id: 'mts-m-004',
    nomorMutasi: 'MTS-M/2026/09/002',
    jenis: 'masuk',
    tanggalMutasi: '2026-09-08',
    tanggalEfektif: '2026-09-09',
    nisn: '0118877665',
    nis: '8434',
    namaSiswa: 'Nadia Salsabila Azzahra',
    nik: '3303056011110004',
    tempatLahir: 'Bekasi',
    tanggalLahir: '2011-11-20',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'Desa Karanglewas RT 04 RW 01, Kec. Kutasari',
    anakKe: 1,
    jumlahSaudara: 1,
    namaAyah: 'Wahyudi Santoso',
    pekerjaanAyah: 'Wiraswasta',
    namaIbu: 'Nurjanah',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrtu: '081399881122',
    asalSekolah: {
      namaSekolah: 'SMP Negeri 4 Bekasi',
      npsn: '20223012',
      alamat: 'Jl. KH. Noer Ali, Bekasi',
      kabupatenKota: 'Kota Bekasi',
      provinsi: 'Jawa Barat',
      kelasAsal: 'Kelas 8',
      nomorSuratPindah: '421.3/340/SMPN4BKS/2026',
      tanggalSuratPindah: '2026-09-01'
    },
    kelasTujuan: '8',
    rombelTujuan: '8D',
    alasan: 'Orang tua pensiun dini dari perantauan dan menetap kembali di kampung halaman',
    keteranganAdministrasi: {
      statusLunas: true,
      pinjamanBarangTerselesaikan: true
    },
    petugasPencatat: 'Siti Aminah, A.Md',
    createdAt: '2026-09-08T11:00:00.000Z'
  },
  // Mutasi Masuk 5
  {
    id: 'mts-m-005',
    nomorMutasi: 'MTS-M/2026/09/003',
    jenis: 'masuk',
    tanggalMutasi: '2026-09-15',
    tanggalEfektif: '2026-09-16',
    nisn: '0121122334',
    nis: '7434',
    namaSiswa: 'Bima Arya Pangestu',
    nik: '3303050804120005',
    tempatLahir: 'Cilacap',
    tanggalLahir: '2012-04-08',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'Desa Meri RT 02 RW 02, Kec. Kutasari',
    anakKe: 2,
    jumlahSaudara: 2,
    namaAyah: 'Pangestu Adi',
    pekerjaanAyah: 'Karyawan BUMN (Pertamina)',
    namaIbu: 'Tri Wulandari',
    pekerjaanIbu: 'Bidan',
    noHpOrtu: '081227654321',
    asalSekolah: {
      namaSekolah: 'SMP Negeri 1 Cilacap',
      npsn: '20300451',
      alamat: 'Jl. Jenderal Sudirman No. 15, Cilacap',
      kabupatenKota: 'Kabupaten Cilacap',
      provinsi: 'Jawa Tengah',
      kelasAsal: 'Kelas 7',
      nomorSuratPindah: '421.3/198/SMPN1CLP/2026',
      tanggalSuratPindah: '2026-09-10'
    },
    kelasTujuan: '7',
    rombelTujuan: '7B',
    alasan: 'Mengikuti mutasi kerja orang tua ke Purbalingga',
    keteranganAdministrasi: {
      statusLunas: true,
      pinjamanBarangTerselesaikan: true
    },
    petugasPencatat: 'Siti Aminah, A.Md',
    createdAt: '2026-09-15T09:45:00.000Z'
  },

  // Mutasi Keluar 1
  {
    id: 'mts-k-001',
    nomorMutasi: 'MTS-K/2026/08/001',
    jenis: 'keluar',
    tanggalMutasi: '2026-08-14',
    tanggalEfektif: '2026-08-15',
    studentId: 'std-mut-01',
    nisn: '0112345699',
    nis: '8399',
    namaSiswa: 'Gilang Ramadhan Saputra',
    nik: '3303051509110099',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2011-09-15',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 01 RW 01 Desa Kutasari',
    namaAyah: 'Saputra Jaya',
    pekerjaanAyah: 'TNI-AD',
    namaIbu: 'Ratna Sari',
    pekerjaanIbu: 'Persit / IRT',
    noHpOrtu: '081328900111',
    tujuanSekolah: {
      namaSekolah: 'SMP Negeri 1 Cilacap',
      npsn: '20300451',
      alamat: 'Jl. Jenderal Sudirman No. 15',
      kabupatenKota: 'Kabupaten Cilacap',
      provinsi: 'Jawa Tengah'
    },
    kelasTujuan: '8',
    rombelTujuan: '8A',
    alasan: 'Mengikuti orang tua pindah tugas kedinasan ke Kodim 0703/Cilacap',
    keteranganAdministrasi: {
      statusLunas: true,
      catatanTunggakan: 'Bebas tunggakan SPP/Komite',
      pinjamanBarangTerselesaikan: true,
      catatanBarang: 'Buku paket pelajaran lengkap dikembalikan ke perpus'
    },
    berkasUpload: {
      suratPermohonanOrtu: 'surat_permohonan_ortu_saputra.pdf',
      suratPindah: 'skp_421.3_089_smpn2kts_2026.pdf'
    },
    petugasPencatat: 'Siti Aminah, A.Md',
    createdAt: '2026-08-14T08:30:00.000Z'
  },
  // Mutasi Keluar 2
  {
    id: 'mts-k-002',
    nomorMutasi: 'MTS-K/2026/08/002',
    jenis: 'keluar',
    tanggalMutasi: '2026-08-25',
    tanggalEfektif: '2026-08-26',
    studentId: 'std-mut-02',
    nisn: '0104433221',
    nis: '9390',
    namaSiswa: 'Salma Aulia Ramadhani',
    nik: '3303054506100090',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2010-06-05',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'Desa Tobong RT 03 RW 01, Kec. Kutasari',
    namaAyah: 'Sudirman',
    pekerjaanAyah: 'Wiraswasta',
    namaIbu: 'Sulastri',
    pekerjaanIbu: 'Pedagang',
    noHpOrtu: '085812345678',
    tujuanSekolah: {
      namaSekolah: 'SMP Negeri 2 Purwokerto',
      npsn: '20302145',
      alamat: 'Jl. Gereja No. 20, Purwokerto',
      kabupatenKota: 'Kabupaten Banyumas',
      provinsi: 'Jawa Tengah'
    },
    kelasTujuan: '9',
    rombelTujuan: '9B',
    alasan: 'Pindah alamat keluarga menetap di Purwokerto',
    keteranganAdministrasi: {
      statusLunas: true,
      pinjamanBarangTerselesaikan: true
    },
    petugasPencatat: 'Karyono, S.AP',
    createdAt: '2026-08-25T13:10:00.000Z'
  },
  // Mutasi Keluar 3
  {
    id: 'mts-k-003',
    nomorMutasi: 'MTS-K/2026/09/001',
    jenis: 'keluar',
    tanggalMutasi: '2026-09-05',
    tanggalEfektif: '2026-09-06',
    studentId: 'std-mut-03',
    nisn: '0123344556',
    nis: '7395',
    namaSiswa: 'Kevin Arya Mahendra',
    nik: '3303051210120095',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2012-10-12',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'Desa Cendana RT 01 RW 02, Kutasari',
    namaAyah: 'Mahendra Putra',
    pekerjaanAyah: 'Karyawan Swasta',
    namaIbu: 'Endang Sulistyowati',
    pekerjaanIbu: 'Guru',
    noHpOrtu: '081234009988',
    tujuanSekolah: {
      namaSekolah: 'MTs Negeri 1 Purbalingga',
      npsn: '20364912',
      alamat: 'Jl. Letkol Isdiman No. 45, Purbalingga',
      kabupatenKota: 'Kabupaten Purbalingga',
      provinsi: 'Jawa Tengah'
    },
    kelasTujuan: '7',
    rombelTujuan: '7A',
    alasan: 'Pilihan orang tua mendalami pendidikan keagamaan di madrasah tsanawiyah berasrama (boarding)',
    keteranganAdministrasi: {
      statusLunas: true,
      pinjamanBarangTerselesaikan: true
    },
    petugasPencatat: 'Siti Aminah, A.Md',
    createdAt: '2026-09-05T10:00:00.000Z'
  },
  // Mutasi Keluar 4
  {
    id: 'mts-k-004',
    nomorMutasi: 'MTS-K/2026/09/002',
    jenis: 'keluar',
    tanggalMutasi: '2026-09-12',
    tanggalEfektif: '2026-09-13',
    studentId: 'std-mut-04',
    nisn: '0117766554',
    nis: '8380',
    namaSiswa: 'Putri Ayu Wandira',
    nik: '3303054803110080',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2011-03-08',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'Desa Karangcegak RT 01 RW 03, Kutasari',
    namaAyah: 'Wandira',
    pekerjaanAyah: 'Buruh Bangunan',
    namaIbu: 'Kasih',
    pekerjaanIbu: 'Pedagang Sayur',
    noHpOrtu: '087812998833',
    tujuanSekolah: {
      namaSekolah: 'SMP Negeri 1 Padamara',
      npsn: '20303190',
      alamat: 'Jl. Raya Padamara, Padamara',
      kabupatenKota: 'Kabupaten Purbalingga',
      provinsi: 'Jawa Tengah'
    },
    kelasTujuan: '8',
    rombelTujuan: '8C',
    alasan: 'Pindah rumah ke tempat tinggal baru di Desa Karangjambe Kec. Padamara',
    keteranganAdministrasi: {
      statusLunas: true,
      pinjamanBarangTerselesaikan: true
    },
    petugasPencatat: 'Siti Aminah, A.Md',
    createdAt: '2026-09-12T09:20:00.000Z'
  },
  // Mutasi Keluar 5
  {
    id: 'mts-k-005',
    nomorMutasi: 'MTS-K/2026/09/003',
    jenis: 'keluar',
    tanggalMutasi: '2026-09-18',
    tanggalEfektif: '2026-09-19',
    studentId: 'std-mut-05',
    nisn: '0109988776',
    nis: '9375',
    namaSiswa: 'Danang Tri Saputra',
    nik: '3303052204100075',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2010-04-22',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'Desa Tobong RT 02 RW 02, Kutasari',
    namaAyah: 'Saputro',
    pekerjaanAyah: 'Sopir Truk',
    namaIbu: 'Suratmi',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrtu: '081329876543',
    tujuanSekolah: {
      namaSekolah: 'SMP Negeri 1 Kutasari',
      npsn: '20303184',
      alamat: 'Jl. Raya Kutasari No. 1, Kutasari',
      kabupatenKota: 'Kabupaten Purbalingga',
      provinsi: 'Jawa Tengah'
    },
    kelasTujuan: '9',
    rombelTujuan: '9C',
    alasan: 'Menyesuaikan domisili tempat tinggal dekat pusat kecamatan',
    keteranganAdministrasi: {
      statusLunas: true,
      pinjamanBarangTerselesaikan: true
    },
    petugasPencatat: 'Karyono, S.AP',
    createdAt: '2026-09-18T14:00:00.000Z'
  }
];

// ==========================================
// INITIAL SPREADSHEET IMPORT LOGS
// ==========================================

export const initialImportLogs: SpreadsheetImportLog[] = [
  {
    id: 'log-imp-001',
    tanggal: '2026-09-01',
    waktu: '08:30',
    namaPengguna: 'Siti Aminah, A.Md',
    namaFile: 'rekap_presensi_agustus_2026.xlsx',
    tipeImport: 'rekap_per_rombel',
    rombel: 'Semua Rombel (7A-9D)',
    periode: 'Agustus 2026',
    jumlahBerhasil: 12,
    jumlahGagal: 0,
    snapshotSebelumnya: [],
    catatan: 'Impor rekapitulasi kehadiran bulanan bulan Agustus 2026 dari format Excel dinas'
  },
  {
    id: 'log-imp-002',
    tanggal: '2026-09-10',
    waktu: '11:15',
    namaPengguna: 'Sugito, S.Pd',
    namaFile: 'presensi_harian_kelas8a_minggu1.xlsx',
    tipeImport: 'presensi_harian_siswa',
    rombel: 'Kelas 8A',
    periode: 'September 2026',
    jumlahBerhasil: 32,
    jumlahGagal: 0,
    snapshotSebelumnya: [],
    catatan: 'Sinkronisasi presensi harian siswa rombel 8A minggu ke-1'
  },
  {
    id: 'log-imp-003',
    tanggal: '2026-09-18',
    waktu: '14:20',
    namaPengguna: 'Siti Aminah, A.Md',
    namaFile: 'update_presensi_rekap_september_w2.xlsx',
    tipeImport: 'rekap_per_rombel',
    rombel: 'Semua Rombel (7A-9D)',
    periode: 'September 2026',
    jumlahBerhasil: 12,
    jumlahGagal: 0,
    snapshotSebelumnya: [],
    catatan: 'Update data kehadiran sementara bulan September minggu ke-2'
  }
];
