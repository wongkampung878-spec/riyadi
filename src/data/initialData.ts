import { 
  SchoolIdentity, 
  User, 
  Student, 
  Staff, 
  IncomingLetter, 
  OutgoingLetter, 
  ExpeditionEntry,
  InventoryItem, 
  EquipmentLoan, 
  CashTransaction, 
  LeaveRequest,
  StudentAttendanceRecap
} from '../types';

export const initialSchoolIdentity: SchoolIdentity = {
  namaSekolah: 'SMP NEGERI 2 KUTASARI',
  npsn: '20303185',
  nss: '201030303033',
  akreditasi: 'A (Amat Baik)',
  alamatLengkap: 'Jl. Raya Tobong - Kutasari, Desa Tobong',
  desaKelurahan: 'Tobong',
  kecamatan: 'Kec. Kutasari',
  kabupaten: 'Kabupaten Purbalingga',
  provinsi: 'Jawa Tengah',
  kodePos: '53361',
  telepon: '(0281) 895123',
  email: 'smpn2kutasari@purbalinggakab.go.id',
  website: 'https://smpn2kutasari.sch.id',
  kepalaSekolah: 'Drs. H. Bambang Sudarmo, M.Pd.',
  nipKepalaSekolah: '19680415 199412 1 002',
  kepalaTu: 'Karyono, S.AP',
  nipKepalaTu: '19740812 200701 1 015',
  tahunAjaranAktif: '2026/2027',
  semesterAktif: 'Ganjil',
  lamaPinjamMaksimalHari: 7,
  formatNomorPinjam: 'PJM/{TAHUN}/{BULAN}/{NO}',
  formatNomorSuratKeluar: '421.3/{NO}/SMPN2KTS/{TAHUN}'
};

export const initialUsers: User[] = [
  {
    id: 'user-ks',
    name: 'Drs. H. Bambang Sudarmo, M.Pd.',
    email: 'kepsek@smpn2kutasari.sch.id',
    role: 'kepala_sekolah',
    roleTitle: 'Kepala Sekolah',
    isActive: true
  },
  {
    id: 'user-ktu',
    name: 'Karyono, S.AP',
    email: 'ktu@smpn2kutasari.sch.id',
    role: 'kepala_tu',
    roleTitle: 'Kepala Tata Usaha',
    isActive: true
  },
  {
    id: 'user-staf1',
    name: 'Siti Aminah, A.Md',
    email: 'siti.tu@smpn2kutasari.sch.id',
    role: 'staf_tu',
    roleTitle: 'Staf TU (Kesiswaan & Persuratan)',
    assignedModules: ['kesiswaan', 'persuratan', 'laporan'],
    isActive: true
  },
  {
    id: 'user-staf2',
    name: 'Ahmad Fauzi, S.E.',
    email: 'bendahara@smpn2kutasari.sch.id',
    role: 'staf_tu',
    roleTitle: 'Staf TU (Bendahara Keuangan)',
    assignedModules: ['keuangan', 'laporan'],
    isActive: true
  },
  {
    id: 'user-guru1',
    name: 'Sugito, S.Pd',
    email: 'sugito46@guru.smp.belajar.id',
    role: 'guru',
    roleTitle: 'Guru IPA / Wali Kelas 8A',
    assignedClass: '8A',
    isActive: true
  },
  {
    id: 'user-guru2',
    name: 'Endah Retnowati, S.Pd',
    email: 'endah.retno@guru.smp.belajar.id',
    role: 'guru',
    roleTitle: 'Guru Bhs Indonesia / Wali Kelas 7B',
    assignedClass: '7B',
    isActive: true
  },
  {
    id: 'user-sarpras',
    name: 'Tri Wahyudi, S.Kom',
    email: 'sarpras@smpn2kutasari.sch.id',
    role: 'sarpras_laboran',
    roleTitle: 'Pengelola Sarpras & Laboran',
    isActive: true
  }
];

export const initialStudents: Student[] = [
  {
    id: 'std-001',
    nisn: '0112345671',
    nis: '8401',
    nama: 'Aditya Pratama Nugroho',
    nik: '3303051205110001',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2011-05-12',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 02 RW 01 Desa Kutasari, Kec. Kutasari',
    namaAyah: 'Budi Nugroho',
    pekerjaanAyah: 'Petani / Pekebun',
    namaIbu: 'Sri Wahyuni',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrtu: '081228123401',
    asalSd: 'SD Negeri 1 Kutasari',
    tahunMasuk: 2024,
    kelas: '8',
    rombel: '8A',
    status: 'aktif'
  },
  {
    id: 'std-002',
    nisn: '0112345672',
    nis: '8402',
    nama: 'Anindya Putri Kirana',
    nik: '3303054807110002',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2011-07-08',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'RT 04 RW 02 Desa Tobong, Kec. Kutasari',
    namaAyah: 'Haryanto',
    pekerjaanAyah: 'Pedagang Kelontong',
    namaIbu: 'Siti Maryam',
    pekerjaanIbu: 'Pedagang',
    noHpOrtu: '081391234502',
    asalSd: 'SD Negeri 1 Tobong',
    tahunMasuk: 2024,
    kelas: '8',
    rombel: '8A',
    status: 'aktif'
  },
  {
    id: 'std-003',
    nisn: '0122345673',
    nis: '8501',
    nama: 'Bagas Surya Ramadhan',
    nik: '3303051509120003',
    tempatLahir: 'Banyumas',
    tanggalLahir: '2012-09-15',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 01 RW 03 Desa Karangreja, Kec. Kutasari',
    namaAyah: 'Supriyanto',
    pekerjaanAyah: 'Karyawan Swasta',
    namaIbu: 'Mursiti',
    pekerjaanIbu: 'Buruh Industri Rambut',
    noHpOrtu: '085747123003',
    asalSd: 'SD Negeri 2 Karangreja',
    tahunMasuk: 2025,
    kelas: '7',
    rombel: '7A',
    status: 'aktif'
  },
  {
    id: 'std-004',
    nisn: '0122345674',
    nis: '8502',
    nama: 'Cantika Dewi Anggraeni',
    nik: '3303055403120004',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2012-03-14',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'RT 03 RW 01 Desa Cendana, Kec. Kutasari',
    namaAyah: 'Triyono',
    pekerjaanAyah: 'Perangkat Desa',
    namaIbu: 'Daryanti',
    pekerjaanIbu: 'Guru Honorer',
    noHpOrtu: '082136987004',
    asalSd: 'SD Negeri 1 Cendana',
    tahunMasuk: 2025,
    kelas: '7',
    rombel: '7B',
    status: 'aktif'
  },
  {
    id: 'std-005',
    nisn: '0102345675',
    nis: '8301',
    nama: 'Dimas Wahyu Saputra',
    nik: '3303052011100005',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2010-11-20',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 02 RW 04 Desa Meri, Kec. Kutasari',
    namaAyah: 'Sukardi',
    pekerjaanAyah: 'Tukang Kayu',
    namaIbu: 'Rasitem',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrtu: '081327456005',
    asalSd: 'SD Negeri 1 Meri',
    tahunMasuk: 2023,
    kelas: '9',
    rombel: '9A',
    status: 'aktif'
  },
  {
    id: 'std-006',
    nisn: '0112345676',
    nis: '8403',
    nama: 'Eka Nur Laila',
    nik: '3303056108110006',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2011-08-21',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'RT 05 RW 02 Desa Sumingkir, Kec. Kutasari',
    namaAyah: 'Mulyadi',
    pekerjaanAyah: 'Buruh Bangunan',
    namaIbu: 'Sunarti',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrtu: '085227891006',
    asalSd: 'SD Negeri 1 Sumingkir',
    tahunMasuk: 2024,
    kelas: '8',
    rombel: '8B',
    status: 'aktif'
  },
  {
    id: 'std-007',
    nisn: '0122345677',
    nis: '8503',
    nama: 'Fajar Maulana Malik',
    nik: '3303051001120007',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2012-01-10',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 01 RW 01 Desa Limbangan, Kec. Kutasari',
    namaAyah: 'Rokhmat',
    pekerjaanAyah: 'Wiraswasta Bengkel',
    namaIbu: 'Khotimah',
    pekerjaanIbu: 'Penjahit',
    noHpOrtu: '081234567007',
    asalSd: 'SD Negeri 2 Limbangan',
    tahunMasuk: 2025,
    kelas: '7',
    rombel: '7A',
    status: 'aktif'
  },
  {
    id: 'std-008',
    nisn: '0102345678',
    nis: '8302',
    nama: 'Gita Maharani',
    nik: '3303054504100008',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2010-04-05',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'RT 03 RW 03 Desa Karangklesem, Kec. Kutasari',
    namaAyah: 'Agus Santoso',
    pekerjaanAyah: 'PNS Guru SD',
    namaIbu: 'Widaningsih',
    pekerjaanIbu: 'PNS Perawat',
    noHpOrtu: '081392812008',
    asalSd: 'SD Negeri 1 Karangklesem',
    tahunMasuk: 2023,
    kelas: '9',
    rombel: '9B',
    status: 'aktif'
  },
  {
    id: 'std-009',
    nisn: '0112345679',
    nis: '8404',
    nama: 'Habib Rizki Ramadhan',
    nik: '3303051909110009',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2011-09-19',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 02 RW 02 Desa Candiwulan, Kec. Kutasari',
    namaAyah: 'Teguh Iman',
    pekerjaanAyah: 'Pedagang Sayur',
    namaIbu: 'Nurjanah',
    pekerjaanIbu: 'Pedagang',
    noHpOrtu: '085876543009',
    asalSd: 'SD Negeri 1 Candiwulan',
    tahunMasuk: 2024,
    kelas: '8',
    rombel: '8C',
    status: 'aktif'
  },
  {
    id: 'std-010',
    nisn: '0122345680',
    nis: '8504',
    nama: 'Indah Permatasari',
    nik: '3303055212120010',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2012-12-12',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'RT 04 RW 01 Desa Kutasari, Kec. Kutasari',
    namaAyah: 'Bambang Irawan',
    pekerjaanAyah: 'Sopir Angkutan',
    namaIbu: 'Kusmiati',
    pekerjaanIbu: 'Buruh Pabrik Bulu Mata',
    noHpOrtu: '087712345010',
    asalSd: 'SD Negeri 2 Kutasari',
    tahunMasuk: 2025,
    kelas: '7',
    rombel: '7C',
    status: 'aktif'
  },
  {
    id: 'std-011',
    nisn: '0102345681',
    nis: '8303',
    nama: 'Joko Susilo',
    nik: '3303050808100011',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2010-08-08',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 01 RW 02 Desa Munjul, Kec. Kutasari',
    namaAyah: 'Suparman',
    pekerjaanAyah: 'Petani Penderes Nira',
    namaIbu: 'Karsiti',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrtu: '085325890011',
    asalSd: 'SD Negeri 1 Munjul',
    tahunMasuk: 2023,
    kelas: '9',
    rombel: '9A',
    status: 'aktif'
  },
  {
    id: 'std-012',
    nisn: '0112345682',
    nis: '8405',
    nama: 'Kurnia Fitriani',
    nik: '3303056006110012',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2011-06-20',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'RT 03 RW 02 Desa Karangaren, Kec. Kutasari',
    namaAyah: 'Darsono',
    pekerjaanAyah: 'Buruh Tani',
    namaIbu: 'Darmi',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrtu: '081298765012',
    asalSd: 'SD Negeri 1 Karangaren',
    tahunMasuk: 2024,
    kelas: '8',
    rombel: '8A',
    status: 'aktif'
  },
  {
    id: 'std-013',
    nisn: '0122345683',
    nis: '8505',
    nama: 'Lukman Hakim',
    nik: '3303051402120013',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2012-02-14',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 02 RW 03 Desa Tobong, Kec. Kutasari',
    namaAyah: 'Zainuddin',
    pekerjaanAyah: 'PNS Kemenag',
    namaIbu: 'Mutmainah',
    pekerjaanIbu: 'Guru MI',
    noHpOrtu: '081328901013',
    asalSd: 'MI Ma\'arif NU Tobong',
    tahunMasuk: 2025,
    kelas: '7',
    rombel: '7A',
    status: 'aktif'
  },
  {
    id: 'std-014',
    nisn: '0102345684',
    nis: '8304',
    nama: 'Melani Putri Astuti',
    nik: '3303054205100014',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2010-05-02',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'RT 01 RW 04 Desa Kutasari, Kec. Kutasari',
    namaAyah: 'Taryo',
    pekerjaanAyah: 'Wiraswasta Mebel',
    namaIbu: 'Rohimah',
    pekerjaanIbu: 'Pedagang',
    noHpOrtu: '085741230014',
    asalSd: 'SD Negeri 1 Kutasari',
    tahunMasuk: 2023,
    kelas: '9',
    rombel: '9C',
    status: 'aktif'
  },
  {
    id: 'std-015',
    nisn: '0112345685',
    nis: '8406',
    nama: 'Naufal Dwi Cahyo',
    nik: '3303052510110015',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2011-10-25',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 03 RW 01 Desa Cendana, Kec. Kutasari',
    namaAyah: 'Subandi',
    pekerjaanAyah: 'Karyawan Koperasi',
    namaIbu: 'Warsiti',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrtu: '081225678015',
    asalSd: 'SD Negeri 2 Cendana',
    tahunMasuk: 2024,
    kelas: '8',
    rombel: '8B',
    status: 'aktif'
  },
  {
    id: 'std-016',
    nisn: '0122345686',
    nis: '8506',
    nama: 'Olivia Septiani',
    nik: '3303055909120016',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2012-09-19',
    jenisKelamin: 'P',
    agama: 'Kristen',
    alamat: 'RT 02 RW 02 Desa Meri, Kec. Kutasari',
    namaAyah: 'Yohanes Joko',
    pekerjaanAyah: 'Wiraswasta Bengkel Bubut',
    namaIbu: 'Maria Ulfah',
    pekerjaanIbu: 'Karyawan Swasta',
    noHpOrtu: '081390123016',
    asalSd: 'SD Kristen Purbalingga',
    tahunMasuk: 2025,
    kelas: '7',
    rombel: '7B',
    status: 'aktif'
  },
  {
    id: 'std-017',
    nisn: '0102345687',
    nis: '8305',
    nama: 'Panji Pangestu',
    nik: '3303050403100017',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2010-03-04',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 04 RW 03 Desa Sumingkir, Kec. Kutasari',
    namaAyah: 'Pangadi',
    pekerjaanAyah: 'Petani Padi',
    namaIbu: 'Pariyah',
    pekerjaanIbu: 'Buruh Tani',
    noHpOrtu: '085291234017',
    asalSd: 'SD Negeri 2 Sumingkir',
    tahunMasuk: 2023,
    kelas: '9',
    rombel: '9B',
    status: 'aktif'
  },
  {
    id: 'std-018',
    nisn: '0112345688',
    nis: '8407',
    nama: 'Qonita Az-Zahra',
    nik: '3303054101110018',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2011-01-01',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'RT 01 RW 01 Desa Karangreja, Kec. Kutasari',
    namaAyah: 'Mustofa',
    pekerjaanAyah: 'Ustadz / Wiraswasta',
    namaIbu: 'Fatimah',
    pekerjaanIbu: 'Guru TPQ',
    noHpOrtu: '087834567018',
    asalSd: 'SD Negeri 1 Karangreja',
    tahunMasuk: 2024,
    kelas: '8',
    rombel: '8D',
    status: 'aktif'
  },
  {
    id: 'std-019',
    nisn: '0122345689',
    nis: '8507',
    nama: 'Rifki Pratama',
    nik: '3303051606120019',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2012-06-16',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 03 RW 03 Desa Limbangan, Kec. Kutasari',
    namaAyah: 'Kasmuri',
    pekerjaanAyah: 'Buruh Harian Lepas',
    namaIbu: 'Sarinah',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrtu: '081230987019',
    asalSd: 'SD Negeri 1 Limbangan',
    tahunMasuk: 2025,
    kelas: '7',
    rombel: '7C',
    status: 'aktif'
  },
  {
    id: 'std-020',
    nisn: '0102345690',
    nis: '8306',
    nama: 'Salsabila Khairunnisa',
    nik: '3303055507100020',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2010-07-15',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'RT 02 RW 01 Desa Kutasari, Kec. Kutasari',
    namaAyah: 'Wahid Hasyim',
    pekerjaanAyah: 'Apoteker',
    namaIbu: 'Lilis Suryani',
    pekerjaanIbu: 'Bidan Desa',
    noHpOrtu: '081391567020',
    asalSd: 'SD Negeri 1 Kutasari',
    tahunMasuk: 2023,
    kelas: '9',
    rombel: '9A',
    status: 'aktif'
  },
  {
    id: 'std-021',
    nisn: '0112345691',
    nis: '8408',
    nama: 'Tegar Arya Bima',
    nik: '3303051804110021',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2011-04-18',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 05 RW 02 Desa Tobong, Kec. Kutasari',
    namaAyah: 'Waryono',
    pekerjaanAyah: 'Supir Truk Pasir',
    namaIbu: 'Turinah',
    pekerjaanIbu: 'Pedagang Warung',
    noHpOrtu: '085869012021',
    asalSd: 'SD Negeri 1 Tobong',
    tahunMasuk: 2024,
    kelas: '8',
    rombel: '8A',
    status: 'aktif'
  },
  {
    id: 'std-022',
    nisn: '0122345692',
    nis: '8508',
    nama: 'Ulfa Novitasari',
    nik: '3303056311120022',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2012-11-23',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'RT 01 RW 03 Desa Cendana, Kec. Kutasari',
    namaAyah: 'Yanto',
    pekerjaanAyah: 'Buruh Bangunan',
    namaIbu: 'Marsinah',
    pekerjaanIbu: 'Buruh Gendong Pasar',
    noHpOrtu: '085641234022',
    asalSd: 'SD Negeri 1 Cendana',
    tahunMasuk: 2025,
    kelas: '7',
    rombel: '7D',
    status: 'aktif'
  },
  {
    id: 'std-023',
    nisn: '0102345693',
    nis: '8307',
    nama: 'Vino Alamsyah',
    nik: '3303051110100023',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2010-10-11',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 03 RW 02 Desa Candiwulan, Kec. Kutasari',
    namaAyah: 'Kusworo',
    pekerjaanAyah: 'Peternak Ayam',
    namaIbu: 'Sumiati',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrtu: '081229012023',
    asalSd: 'SD Negeri 1 Candiwulan',
    tahunMasuk: 2023,
    kelas: '9',
    rombel: '9C',
    status: 'aktif'
  },
  {
    id: 'std-024',
    nisn: '0112345694',
    nis: '8409',
    nama: 'Wulan Tri Handayani',
    nik: '3303054902110024',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2011-02-09',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'RT 02 RW 04 Desa Munjul, Kec. Kutasari',
    namaAyah: 'Handoko',
    pekerjaanAyah: 'PNS Kantor Camat',
    namaIbu: 'Tri Astuti',
    pekerjaanIbu: 'PNS Dinas Kesehatan',
    noHpOrtu: '081329876024',
    asalSd: 'SD Negeri 1 Munjul',
    tahunMasuk: 2024,
    kelas: '8',
    rombel: '8C',
    status: 'aktif'
  },
  {
    id: 'std-025',
    nisn: '0122345695',
    nis: '8509',
    nama: 'Yoga Danuarta',
    nik: '3303052808120025',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2012-08-28',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 04 RW 02 Desa Karangaren, Kec. Kutasari',
    namaAyah: 'Danu Suwito',
    pekerjaanAyah: 'Pedagang Buah',
    namaIbu: 'Suparni',
    pekerjaanIbu: 'Pedagang Buah',
    noHpOrtu: '087765432025',
    asalSd: 'SD Negeri 2 Karangaren',
    tahunMasuk: 2025,
    kelas: '7',
    rombel: '7A',
    status: 'aktif'
  },
  {
    id: 'std-026',
    nisn: '0102345696',
    nis: '8308',
    nama: 'Zahra Aulia Rahma',
    nik: '3303055701100026',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2010-01-17',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'RT 01 RW 01 Desa Kutasari, Kec. Kutasari',
    namaAyah: 'Rahmat Hidayat',
    pekerjaanAyah: 'Wiraswasta Sablon',
    namaIbu: 'Nur Laila',
    pekerjaanIbu: 'Penjahit',
    noHpOrtu: '085211223026',
    asalSd: 'SD Negeri 1 Kutasari',
    tahunMasuk: 2023,
    kelas: '9',
    rombel: '9B',
    status: 'aktif'
  },
  {
    id: 'std-027',
    nisn: '0112345697',
    nis: '8410',
    nama: 'Aldo Bagus Firmansyah',
    nik: '3303050903110027',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2011-03-09',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 02 RW 02 Desa Karangreja, Kec. Kutasari',
    namaAyah: 'Firman',
    pekerjaanAyah: 'Sopir Ekspedisi',
    namaIbu: 'Eni Susanti',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrtu: '081234098027',
    asalSd: 'SD Negeri 1 Karangreja',
    tahunMasuk: 2024,
    kelas: '8',
    rombel: '8D',
    status: 'aktif'
  },
  {
    id: 'std-028',
    nisn: '0122345698',
    nis: '8510',
    nama: 'Bela Safitri',
    nik: '3303054410120028',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2012-10-04',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'RT 03 RW 01 Desa Tobong, Kec. Kutasari',
    namaAyah: 'Safrudin',
    pekerjaanAyah: 'Karyawan Swasta',
    namaIbu: 'Fitriani',
    pekerjaanIbu: 'Buruh Pabrik Plastik',
    noHpOrtu: '081398760028',
    asalSd: 'SD Negeri 1 Tobong',
    tahunMasuk: 2025,
    kelas: '7',
    rombel: '7D',
    status: 'aktif'
  },
  {
    id: 'std-029',
    nisn: '0092345699',
    nis: '8199',
    nama: 'Candra Wijaya',
    nik: '3303051707090029',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2009-07-17',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 01 RW 04 Desa Meri, Kec. Kutasari',
    namaAyah: 'Wijaya Kusuma',
    pekerjaanAyah: 'Wiraswasta Logam',
    namaIbu: 'Endang',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrtu: '085712398029',
    asalSd: 'SD Negeri 1 Meri',
    tahunMasuk: 2022,
    kelas: '9',
    rombel: '9D',
    status: 'lulus'
  },
  {
    id: 'std-030',
    nisn: '0112345700',
    nis: '8411',
    nama: 'Dian Anggraini',
    nik: '3303055611110030',
    tempatLahir: 'Cilacap',
    tanggalLahir: '2011-11-16',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'RT 02 RW 03 Desa Limbangan, Kec. Kutasari',
    namaAyah: 'Rizal Efendi',
    pekerjaanAyah: 'Karyawan BUMN PLN',
    namaIbu: 'Susilowati',
    pekerjaanIbu: 'Guru Honorer',
    noHpOrtu: '081299887030',
    asalSd: 'SD Negeri 1 Kroya',
    tahunMasuk: 2024,
    kelas: '8',
    rombel: '8B',
    status: 'mutasi_keluar',
    catatanMutasi: {
      jenis: 'keluar',
      tanggal: '2026-08-14',
      sekolahTujuanAsal: 'SMP Negeri 1 Cilacap',
      nomorSurat: '421.3/089/SMPN2KTS/2026',
      alasan: 'Mengikuti kepindahan tugas dinas orang tua ke Kab. Cilacap'
    }
  },
  {
    id: 'std-031',
    nisn: '0122345701',
    nis: '8511',
    nama: 'Farel Rizqullah',
    nik: '3303052203120031',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2012-03-22',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 04 RW 02 Desa Sumingkir, Kec. Kutasari',
    namaAyah: 'Rizki Santoso',
    pekerjaanAyah: 'Wiraswasta Material',
    namaIbu: 'Nur Khasanah',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noHpOrtu: '082187654031',
    asalSd: 'SD Negeri 1 Sumingkir',
    tahunMasuk: 2025,
    kelas: '7',
    rombel: '7B',
    status: 'aktif'
  },
  {
    id: 'std-032',
    nisn: '0112345702',
    nis: '8412',
    nama: 'Hilmy Azhar Nugraha',
    nik: '3303051307110032',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '2011-07-13',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'RT 01 RW 02 Desa Candiwulan, Kec. Kutasari',
    namaAyah: 'Azhar Syarif',
    pekerjaanAyah: 'Wiraswasta Mebel',
    namaIbu: 'Siti Aminah',
    pekerjaanIbu: 'Penjahit Pakaian',
    noHpOrtu: '081344556032',
    asalSd: 'SD Negeri 1 Candiwulan',
    tahunMasuk: 2024,
    kelas: '8',
    rombel: '8C',
    status: 'aktif'
  }
];

export const initialStaff: Staff[] = [
  {
    id: 'stf-001',
    nipNuPtk: '19680415 199412 1 002',
    nama: 'Drs. H. Bambang Sudarmo',
    gelar: 'M.Pd.',
    status: 'PNS',
    pangkatGolongan: 'Pembina Utama Muda / IV/c',
    jabatan: 'Kepala Sekolah',
    tmt: '2021-08-01',
    pendidikanTerakhir: 'S2 Manajemen Pendidikan - UNNES',
    mapelDiampu: 'Pendidikan Pancasila & Kewarganegaraan',
    noHp: '081227123901',
    alamat: 'Jl. Letkol Isdiman No. 45, Purbalingga',
    tmtKgbBerikutnya: '2026-11-01', // H-42 days! Kenaikan Gaji Berkala
    tmtPangkatBerikutnya: '2027-10-01',
    riwayatPangkat: [
      { golongan: 'IV/c', tmt: '2023-10-01', noSk: '821.2/045/BKD/2023' },
      { golongan: 'IV/b', tmt: '2019-10-01', noSk: '821.2/112/BKD/2019' }
    ],
    riwayatPendidikan: [
      { jenjang: 'S2', jurusan: 'Manajemen Pendidikan', institusi: 'Universitas Negeri Semarang', tahunLulus: 2012 },
      { jenjang: 'S1', jurusan: 'PPKn', institusi: 'IKIP Negeri Semarang', tahunLulus: 1993 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Diklat Penguatan Kepala Sekolah Berkelanjutan', penyelenggara: 'LPMP Jawa Tengah', tahun: 2022, jamPelajaran: 72 }
    ]
  },
  {
    id: 'stf-002',
    nipNuPtk: '19740812 200701 1 015',
    nama: 'Karyono',
    gelar: 'S.AP',
    status: 'PNS',
    pangkatGolongan: 'Penata Tingkat I / III/d',
    jabatan: 'Kepala Tata Usaha',
    tmt: '2018-03-01',
    pendidikanTerakhir: 'S1 Administrasi Publik - Universitas Terbuka',
    noHp: '081391234888',
    alamat: 'Desa Bojanegara RT 03 RW 01, Kec. Padamara, Purbalingga',
    tmtKgbBerikutnya: '2026-10-15', // H-25 days alert!
    tmtPangkatBerikutnya: '2026-12-01', // H-72 days alert!
    riwayatPangkat: [
      { golongan: 'III/d', tmt: '2022-10-01', noSk: '823/189/BKPSDM/2022' },
      { golongan: 'III/c', tmt: '2018-10-01', noSk: '823/074/BKPSDM/2018' }
    ],
    riwayatPendidikan: [
      { jenjang: 'S1', jurusan: 'Ilmu Administrasi Publik', institusi: 'Universitas Terbuka', tahunLulus: 2015 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Bimtek Manajemen Administrasi Sekolah Digital', penyelenggara: 'Dinas Pendidikan Kab. Purbalingga', tahun: 2024, jamPelajaran: 36 }
    ]
  },
  {
    id: 'stf-003',
    nipNuPtk: '19790610 200801 1 011',
    nama: 'Sugito',
    gelar: 'S.Pd',
    status: 'PNS',
    pangkatGolongan: 'Penata Tingkat I / III/d',
    jabatan: 'Waka Kurikulum & Guru Madya',
    tmt: '2008-01-01',
    pendidikanTerakhir: 'S1 Pendidikan Fisika - UNS Surakarta',
    mapelDiampu: 'Ilmu Pengetahuan Alam (IPA)',
    noHp: '081327890123',
    alamat: 'Desa Kutasari RT 01 RW 02, Kec. Kutasari',
    tmtKgbBerikutnya: '2027-02-01',
    tmtPangkatBerikutnya: '2026-11-15', // H-56 days alert!
    riwayatPangkat: [
      { golongan: 'III/d', tmt: '2022-04-01', noSk: '823/090/BKPSDM/2022' }
    ],
    riwayatPendidikan: [
      { jenjang: 'S1', jurusan: 'Pendidikan Fisika', institusi: 'Universitas Sebelas Maret', tahunLulus: 2004 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Pelatihan Implementasi Kurikulum Merdeka Jenjang SMP', penyelenggara: 'BGP Provinsi Jawa Tengah', tahun: 2023, jamPelajaran: 64 }
    ]
  },
  {
    id: 'stf-004',
    nipNuPtk: '19810314 200902 2 008',
    nama: 'Endah Retnowati',
    gelar: 'S.Pd',
    status: 'PNS',
    pangkatGolongan: 'Penata / III/c',
    jabatan: 'Waka Kesiswaan & Guru Muda',
    tmt: '2009-02-01',
    pendidikanTerakhir: 'S1 Pendidikan Bahasa & Sastra Indonesia - UNY',
    mapelDiampu: 'Bahasa Indonesia',
    noHp: '081226789456',
    alamat: 'Desa Gemuruh RT 02 RW 01, Kec. Padamara',
    tmtKgbBerikutnya: '2027-03-01',
    tmtPangkatBerikutnya: '2027-04-01',
    riwayatPangkat: [
      { golongan: 'III/c', tmt: '2023-04-01', noSk: '823/110/BKPSDM/2023' }
    ],
    riwayatPendidikan: [
      { jenjang: 'S1', jurusan: 'Pendidikan Bhs dan Sastra Indonesia', institusi: 'Universitas Negeri Yogyakarta', tahunLulus: 2005 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Workshop Penguatan Literasi Siswa SMP', penyelenggara: 'Balai Bahasa Jawa Tengah', tahun: 2023, jamPelajaran: 32 }
    ]
  },
  {
    id: 'stf-005',
    nipNuPtk: '19850520 201101 1 012',
    nama: 'Bambang Trianto',
    gelar: 'S.Pd, M.Pd.',
    status: 'PNS',
    pangkatGolongan: 'Penata / III/c',
    jabatan: 'Waka Sarana Prasarana & Guru',
    tmt: '2011-01-01',
    pendidikanTerakhir: 'S2 Pendidikan Matematika - Universitas Ahmad Dahlan',
    mapelDiampu: 'Matematika',
    noHp: '085227112233',
    alamat: 'Perum Kutasari Permai Blok B No. 12',
    tmtKgbBerikutnya: '2026-10-30', // H-40 days alert!
    tmtPangkatBerikutnya: '2027-10-01',
    riwayatPangkat: [
      { golongan: 'III/c', tmt: '2022-10-01', noSk: '823/145/BKPSDM/2022' }
    ],
    riwayatPendidikan: [
      { jenjang: 'S2', jurusan: 'Pendidikan Matematika', institusi: 'Universitas Ahmad Dahlan', tahunLulus: 2019 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Pengelolaan Sarana Prasarana Berbasis Aset Digital', penyelenggara: 'Dindikbud Purbalingga', tahun: 2024, jamPelajaran: 40 }
    ]
  },
  {
    id: 'stf-006',
    nipNuPtk: '19881112 201502 2 003',
    nama: 'Siti Aminah',
    gelar: 'A.Md',
    status: 'PNS',
    pangkatGolongan: 'Pengatur Tingkat I / II/d',
    jabatan: 'Pengadministrasi Kesiswaan & Persuratan',
    tmt: '2015-02-01',
    pendidikanTerakhir: 'D3 Administrasi Perkantoran - Politeknik Negeri Semarang',
    noHp: '085747890111',
    alamat: 'Desa Tobong RT 01 RW 01, Kec. Kutasari',
    tmtKgbBerikutnya: '2027-02-01',
    tmtPangkatBerikutnya: '2027-04-01',
    riwayatPangkat: [
      { golongan: 'II/d', tmt: '2023-04-01', noSk: '823/040/BKPSDM/2023' }
    ],
    riwayatPendidikan: [
      { jenjang: 'D3', jurusan: 'Administrasi Perkantoran', institusi: 'Politeknik Negeri Semarang', tahunLulus: 2012 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Tata Kelola Kearsipan Dinamis Instansi Pemerintah', penyelenggara: 'Dinas Arsip dan Perpustakaan Purbalingga', tahun: 2023, jamPelajaran: 30 }
    ]
  },
  {
    id: 'stf-007',
    nipNuPtk: '19900918 202012 1 007',
    nama: 'Ahmad Fauzi',
    gelar: 'S.E.',
    status: 'PNS',
    pangkatGolongan: 'Penata Muda / III/a',
    jabatan: 'Pengadministrasi Keuangan (Bendahara BOS)',
    tmt: '2020-12-01',
    pendidikanTerakhir: 'S1 Akuntansi - Universitas Jenderal Soedirman',
    noHp: '081329008877',
    alamat: 'Desa Karangcegak RT 02 RW 02, Kec. Kutasari',
    tmtKgbBerikutnya: '2026-12-15', // H-86 days alert!
    tmtPangkatBerikutnya: '2028-10-01',
    riwayatPangkat: [
      { golongan: 'III/a', tmt: '2020-12-01', noSk: '813.3/210/BKPSDM/2020' }
    ],
    riwayatPendidikan: [
      { jenjang: 'S1', jurusan: 'Akuntansi', institusi: 'Universitas Jenderal Soedirman', tahunLulus: 2016 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Bimtek Pertanggungjawaban Keuangan Dana BOS dan ARKAS', penyelenggara: 'BPKAD & Dindikbud Purbalingga', tahun: 2024, jamPelajaran: 48 }
    ]
  },
  {
    id: 'stf-008',
    nipNuPtk: '19920405 202221 1 009',
    nama: 'Tri Wahyudi',
    gelar: 'S.Kom',
    status: 'PPPK',
    pangkatGolongan: 'Ahli Pertama / IX',
    jabatan: 'Pranata Komputer & Pengelola Laboran/Sarpras',
    tmt: '2022-04-01',
    pendidikanTerakhir: 'S1 Teknik Informatika - Institut Teknologi Telkom Purwokerto',
    mapelDiampu: 'Informatika',
    noHp: '085870123999',
    alamat: 'Desa Meri RT 03 RW 01, Kec. Kutasari',
    tmtKgbBerikutnya: '2027-04-01',
    tmtPangkatBerikutnya: '2027-04-01',
    riwayatPangkat: [
      { golongan: 'Golongan IX', tmt: '2022-04-01', noSk: '810/088/PPPK/2022' }
    ],
    riwayatPendidikan: [
      { jenjang: 'S1', jurusan: 'Teknik Informatika', institusi: 'IT Telkom Purwokerto', tahunLulus: 2017 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Pengelolaan Laboratorium IPA & Komputer SMP', penyelenggara: 'Pusdatin Kemdikbudristek', tahun: 2023, jamPelajaran: 40 }
    ]
  },
  {
    id: 'stf-009',
    nipNuPtk: '19910815 202221 2 018',
    nama: 'Dewi Lestari',
    gelar: 'S.Pd',
    status: 'PPPK',
    pangkatGolongan: 'Ahli Pertama / IX',
    jabatan: 'Guru Bahasa Inggris',
    tmt: '2022-04-01',
    pendidikanTerakhir: 'S1 Pendidikan Bahasa Inggris - Universitas Muhammadiyah Purwokerto',
    mapelDiampu: 'Bahasa Inggris',
    noHp: '081229876543',
    alamat: 'Desa Cendana RT 04 RW 02, Kec. Kutasari',
    tmtKgbBerikutnya: '2027-04-01',
    tmtPangkatBerikutnya: '2027-04-01',
    riwayatPangkat: [
      { golongan: 'Golongan IX', tmt: '2022-04-01', noSk: '810/102/PPPK/2022' }
    ],
    riwayatPendidikan: [
      { jenjang: 'S1', jurusan: 'Pendidikan Bahasa Inggris', institusi: 'UMP Purwokerto', tahunLulus: 2015 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Interactive English Teaching Methodology', penyelenggara: 'British Council & Dindikbud', tahun: 2023, jamPelajaran: 32 }
    ]
  },
  {
    id: 'stf-010',
    nipNuPtk: '19870312 201903 1 005',
    nama: 'Rahmat Santoso',
    gelar: 'S.Pd.Jas',
    status: 'PNS',
    pangkatGolongan: 'Penata Muda Tingkat I / III/b',
    jabatan: 'Guru PJOK',
    tmt: '2019-03-01',
    pendidikanTerakhir: 'S1 Pendidikan Kepelatihan Olahraga - UNY',
    mapelDiampu: 'Pendidikan Jasmani, Olahraga & Kesehatan',
    noHp: '085227654321',
    alamat: 'Desa Limbangan RT 01 RW 03, Kec. Kutasari',
    tmtKgbBerikutnya: '2027-03-01',
    tmtPangkatBerikutnya: '2027-04-01',
    riwayatPangkat: [
      { golongan: 'III/b', tmt: '2023-04-01', noSk: '823/078/BKPSDM/2023' }
    ],
    riwayatPendidikan: [
      { jenjang: 'S1', jurusan: 'Pendidikan Kepelatihan Olahraga', institusi: 'UNY', tahunLulus: 2013 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Pencegahan Cedera & Pertolongan Pertama di Lingkungan Sekolah', penyelenggara: 'KONI & PMI Purbalingga', tahun: 2024, jamPelajaran: 24 }
    ]
  },
  {
    id: 'stf-011',
    nipNuPtk: '19860904 201406 2 002',
    nama: 'Nurul Hidayati',
    gelar: 'S.Pd.I',
    status: 'PNS',
    pangkatGolongan: 'Penata Muda Tingkat I / III/b',
    jabatan: 'Guru PAI & Budi Pekerti',
    tmt: '2014-06-01',
    pendidikanTerakhir: 'S1 Pendidikan Agama Islam - IAIN Saifuddin Zuhri Purwokerto',
    mapelDiampu: 'Pendidikan Agama Islam',
    noHp: '081391827364',
    alamat: 'Desa Karangreja RT 02 RW 01, Kec. Kutasari',
    tmtKgbBerikutnya: '2026-11-10', // H-51 days alert!
    tmtPangkatBerikutnya: '2027-10-01',
    riwayatPangkat: [
      { golongan: 'III/b', tmt: '2022-10-01', noSk: '823/118/BKPSDM/2022' }
    ],
    riwayatPendidikan: [
      { jenjang: 'S1', jurusan: 'Pendidikan Agama Islam', institusi: 'UIN Saizu Purwokerto', tahunLulus: 2010 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Penguatan Karakter dan Moderasi Beragama', penyelenggara: 'Kemenag Kab. Purbalingga', tahun: 2023, jamPelajaran: 36 }
    ]
  },
  {
    id: 'stf-012',
    nipNuPtk: '19950722 202421 2 031',
    nama: 'Rizka Nur Azizah',
    gelar: 'S.Pd',
    status: 'PPPK',
    pangkatGolongan: 'Ahli Pertama / IX',
    jabatan: 'Guru Seni Budaya',
    tmt: '2024-03-01',
    pendidikanTerakhir: 'S1 Pendidikan Seni Tari & Musik - UNNES',
    mapelDiampu: 'Seni Budaya & Prakarya',
    noHp: '087712398711',
    alamat: 'Kelurahan Purbalingga Wetan, Purbalingga',
    tmtKgbBerikutnya: '2028-03-01',
    tmtPangkatBerikutnya: '2029-04-01',
    riwayatPangkat: [
      { golongan: 'Golongan IX', tmt: '2024-03-01', noSk: '810/012/PPPK/2024' }
    ],
    riwayatPendidikan: [
      { jenjang: 'S1', jurusan: 'Pendidikan Seni Tari', institusi: 'Universitas Negeri Semarang', tahunLulus: 2020 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Orientasi PPPK Angkatan 2024', penyelenggara: 'BPSDMD Provinsi Jawa Tengah', tahun: 2024, jamPelajaran: 45 }
    ]
  },
  {
    id: 'stf-013',
    nipNuPtk: '19820210 202321 1 004',
    nama: 'Eko Sulistyo',
    gelar: 'S.Pd',
    status: 'PPPK',
    pangkatGolongan: 'Ahli Pertama / IX',
    jabatan: 'Guru IPS',
    tmt: '2023-04-01',
    pendidikanTerakhir: 'S1 Pendidikan Sejarah - Universitas Sanata Dharma',
    mapelDiampu: 'Ilmu Pengetahuan Sosial (IPS)',
    noHp: '081228456123',
    alamat: 'Desa Sumingkir RT 01 RW 02, Kec. Kutasari',
    tmtKgbBerikutnya: '2027-04-01',
    tmtPangkatBerikutnya: '2028-04-01',
    riwayatPangkat: [
      { golongan: 'Golongan IX', tmt: '2023-04-01', noSk: '810/076/PPPK/2023' }
    ],
    riwayatPendidikan: [
      { jenjang: 'S1', jurusan: 'Pendidikan Sejarah', institusi: 'Universitas Sanata Dharma', tahunLulus: 2007 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Pemanfaatan Media Berbasis Kearifan Lokal Banyumas', penyelenggara: 'MGMP IPS SMP Kab. Purbalingga', tahun: 2023, jamPelajaran: 32 }
    ]
  },
  {
    id: 'stf-014',
    nipNuPtk: '2021010199001',
    nama: 'Wahyudin',
    gelar: '',
    status: 'PTT',
    pangkatGolongan: '-',
    jabatan: 'Tenaga Kebersihan & Penjaga Sekolah',
    tmt: '2019-07-01',
    pendidikanTerakhir: 'SMA Negeri 1 Kutasari',
    noHp: '085876543999',
    alamat: 'Desa Tobong RT 02 RW 01, Kec. Kutasari',
    riwayatPangkat: [],
    riwayatPendidikan: [
      { jenjang: 'SMA', jurusan: 'IPS', institusi: 'SMA Negeri 1 Kutasari', tahunLulus: 2014 }
    ],
    riwayatDiklat: []
  },
  {
    id: 'stf-015',
    nipNuPtk: '2022030199002',
    nama: 'Supriyadi',
    gelar: '',
    status: 'PTT',
    pangkatGolongan: '-',
    jabatan: 'Petugas Keamanan / Satpam Sekolah',
    tmt: '2021-01-01',
    pendidikanTerakhir: 'SMK Negeri 1 Purbalingga',
    noHp: '081399887766',
    alamat: 'Desa Kutasari RT 03 RW 03, Kec. Kutasari',
    riwayatPangkat: [],
    riwayatPendidikan: [
      { jenjang: 'SMK', jurusan: 'Teknik Mekanik Otomotif', institusi: 'SMK Negeri 1 Purbalingga', tahunLulus: 2016 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Pelatihan Gada Pratama Satpam', penyelenggara: 'Polres Purbalingga & BUJP', tahun: 2021, jamPelajaran: 232 }
    ]
  },
  {
    id: 'stf-016',
    nipNuPtk: '2023071599003',
    nama: 'Wahyu Hidayat',
    gelar: 'S.Pd',
    status: 'GTT',
    pangkatGolongan: '-',
    jabatan: 'Guru Bahasa Jawa',
    tmt: '2023-07-15',
    pendidikanTerakhir: 'S1 Pendidikan Bahasa dan Sastra Jawa - UNNES',
    mapelDiampu: 'Muatan Lokal Bahasa Jawa',
    noHp: '087812345999',
    alamat: 'Desa Candiwulan RT 01 RW 01, Kec. Kutasari',
    riwayatPangkat: [],
    riwayatPendidikan: [
      { jenjang: 'S1', jurusan: 'Pendidikan Bahasa Jawa', institusi: 'Universitas Negeri Semarang', tahunLulus: 2022 }
    ],
    riwayatDiklat: [
      { namaDiklat: 'Pelatihan Aksara Jawa dan Sastra Gagrag Banyumasan', penyelenggara: 'Dewan Kesenian Purbalingga', tahun: 2024, jamPelajaran: 24 }
    ]
  }
];

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'cuti-001',
    staffId: 'stf-004',
    staffName: 'Endah Retnowati, S.Pd',
    jenisCuti: 'Tahunan',
    tanggalMulai: '2026-09-24',
    tanggalSelesai: '2026-09-26',
    jumlahHari: 3,
    alasan: 'Keperluan mengurus wisuda anak di Universitas Gadjah Mada Yogyakarta',
    status: 'Disetujui',
    disetujuiOleh: 'Drs. H. Bambang Sudarmo, M.Pd.',
    tanggalPengajuan: '2026-09-18'
  },
  {
    id: 'cuti-002',
    staffId: 'stf-009',
    staffName: 'Dewi Lestari, S.Pd',
    jenisCuti: 'Sakit',
    tanggalMulai: '2026-09-19',
    tanggalSelesai: '2026-09-21',
    jumlahHari: 3,
    alasan: 'Sakit demam berdarah opname di RSUD dr. R. Goeteng Taroenadibrata',
    status: 'Disetujui',
    disetujuiOleh: 'Drs. H. Bambang Sudarmo, M.Pd.',
    tanggalPengajuan: '2026-09-19'
  },
  {
    id: 'cuti-003',
    staffId: 'stf-006',
    staffName: 'Siti Aminah, A.Md',
    jenisCuti: 'Alasan Penting',
    tanggalMulai: '2026-09-28',
    tanggalSelesai: '2026-09-29',
    jumlahHari: 2,
    alasan: 'Mendampingi orang tua kontrol medis ke RSUP dr. Kariadi Semarang',
    status: 'Menunggu',
    tanggalPengajuan: '2026-09-20'
  }
];

export const initialIncomingLetters: IncomingLetter[] = [
  {
    id: 'sm-001',
    noAgenda: 'SM/2026/09/081',
    tanggalTerima: '2026-09-18',
    nomorSurat: '421/1420/2026',
    tanggalSurat: '2026-09-15',
    asalSurat: 'Dinas Pendidikan dan Kebudayaan Kabupaten Purbalingga',
    perihal: 'Undangan Rapat Koordinasi ANBK Jenjang SMP Tahun 2026',
    sifat: 'segera',
    ringkasanIsi: 'Permohonan kehadiran Kepala Sekolah dan Proktor/Teknisi untuk rapat koordinasi teknis pelaksanaan Asesmen Nasional Berbasis Komputer.',
    disposisi: {
      tujuan: ['Waka Kurikulum', 'Pranata Komputer (Proktor)'],
      isiDisposisi: 'Hadiri bersama proktor ANBK dan siapkan laporan kesiapan sarana lab komputer.',
      tanggalDisposisi: '2026-09-19',
      status: 'Proses'
    }
  },
  {
    id: 'sm-002',
    noAgenda: 'SM/2026/09/082',
    tanggalTerima: '2026-09-19',
    nomorSurat: '440/312/PKM.KTS/2026',
    tanggalSurat: '2026-09-17',
    asalSurat: 'Puskesmas Kutasari Kabupaten Purbalingga',
    perihal: 'Jadwal Pemeriksaan Kesehatan Berkala dan Skrining Anemia Siswi',
    sifat: 'biasa',
    ringkasanIsi: 'Pemberitahuan pelaksanaan skrining kesehatan siswa kelas 7 dan pembagian tablet tambah darah untuk siswi putri.',
    disposisi: {
      tujuan: ['Waka Kesiswaan', 'Pembina UKS'],
      isiDisposisi: 'Koordinasikan dengan wali kelas 7 dan siapkan ruang UKS untuk tim Puskesmas.',
      tanggalDisposisi: '2026-09-20',
      status: 'Belum'
    }
  },
  {
    id: 'sm-003',
    noAgenda: 'SM/2026/09/083',
    tanggalTerima: '2026-09-20',
    nomorSurat: 'B/184/IX/2026/SEK.KTS',
    tanggalSurat: '2026-09-19',
    asalSurat: 'Kepolisian Sektor (Polsek) Kutasari Purbalingga',
    perihal: 'Sosialisasi Bahaya Kenakalan Remaja dan Tertib Lalu Lintas Pelajar',
    sifat: 'biasa',
    ringkasanIsi: 'Penawaran program pembina upacara hari Senin dari Kapolsek Kutasari dilanjutkan penyuluhan kamtibmas bagi seluruh pelajar.',
    disposisi: {
      tujuan: ['Waka Kesiswaan', 'Guru BK'],
      isiDisposisi: 'Jadwalkan untuk upacara bendera hari Senin pekan depan.',
      tanggalDisposisi: '2026-09-20',
      status: 'Proses'
    }
  },
  {
    id: 'sm-004',
    noAgenda: 'SM/2026/09/084',
    tanggalTerima: '2026-09-20',
    nomorSurat: '045/03/KWARAN/2026',
    tanggalSurat: '2026-09-18',
    asalSurat: 'Kwartir Ranting Gerakan Pramuka Kutasari',
    perihal: 'Edaran Lomba Tingkat II (LT II) Penggalang Kwartir Ranting Kutasari',
    sifat: 'segera',
    ringkasanIsi: 'Undangan pendaftaran regu penggalang putra dan putri SMP/MTs se-Kecamatan Kutasari dalam perkemahan LT II.',
    disposisi: {
      tujuan: ['Pembina Pramuka'],
      isiDisposisi: 'Siapkan 1 regu putra dan 1 regu putri terbaik untuk mewakili pangkalan.',
      tanggalDisposisi: '2026-09-20',
      status: 'Belum'
    }
  },
  {
    id: 'sm-005',
    noAgenda: 'SM/2026/09/085',
    tanggalTerima: '2026-09-20',
    nomorSurat: '800/2281/2026',
    tanggalSurat: '2026-09-19',
    asalSurat: 'Badan Kepegawaian dan Pengembangan SDM (BKPSDM) Kab. Purbalingga',
    perihal: 'Pemberitahuan Batas Akhir Usul Kenaikan Pangkat PNS Periode Desember 2026',
    sifat: 'sangat_segera',
    ringkasanIsi: 'Batas akhir unggah berkas usulan kenaikan pangkat PNS di aplikasi SIASN adalah tanggal 30 September 2026.',
    disposisi: {
      tujuan: ['Kepala Tata Usaha', 'Pengadministrasi Kepegawaian'],
      isiDisposisi: 'Segera cek GTK yang memenuhi syarat dan selesaikan upload berkas sebelum tanggal 28 September.',
      tanggalDisposisi: '2026-09-20',
      status: 'Proses'
    }
  },
  {
    id: 'sm-006',
    noAgenda: 'SM/2026/09/086',
    tanggalTerima: '2026-09-16',
    nomorSurat: '012/KOMITE-SMP2/IX/2026',
    tanggalSurat: '2026-09-15',
    asalSurat: 'Komite Sekolah SMP Negeri 2 Kutasari',
    perihal: 'Laporan Monitoring Renovasi Paving Lapangan Upacara',
    sifat: 'biasa',
    ringkasanIsi: 'Laporan progres pemasangan paving blok lapangan upacara telah mencapai 100% dan siap diserahterimakan.',
    disposisi: {
      tujuan: ['Waka Sarpras', 'Kepala TU'],
      isiDisposisi: 'Lakukan pemeriksaan fisik bersama dan buat berita acara serah terima pekerjaan.',
      tanggalDisposisi: '2026-09-17',
      status: 'Selesai'
    }
  }
];

export const initialOutgoingLetters: OutgoingLetter[] = [
  {
    id: 'sk-001',
    nomorSurat: '421.3/095/SMPN2KTS/2026',
    tanggalSurat: '2026-09-19',
    tujuan: 'Kepala Dinas Pendidikan dan Kebudayaan Kab. Purbalingga',
    perihal: 'Laporan Kesiapan Sarana Asesmen Nasional Berbasis Komputer (ANBK)',
    pembuat: 'Karyono, S.AP',
    statusApproval: 'Disetujui',
    kodeKlasifikasi: '421.3',
    isiSurat: 'Menyampaikan rekapitulasi kesiapan 40 unit laptop/PC klien, 2 unit server, dan jaringan internet 100 Mbps di SMPN 2 Kutasari.'
  },
  {
    id: 'sk-002',
    nomorSurat: '421.3/096/SMPN2KTS/2026',
    tanggalSurat: '2026-09-20',
    tujuan: 'Orang Tua / Wali Murid Kelas VII, VIII, dan IX',
    perihal: 'Pemberitahuan Pelaksanaan Penilaian Tengah Semester (PTS) Ganjil',
    pembuat: 'Siti Aminah, A.Md',
    statusApproval: 'Disetujui',
    kodeKlasifikasi: '421.3',
    isiSurat: 'Pemberitahuan jadwal pelaksanaan PTS Ganjil tahun ajaran 2026/2027 yang akan diselenggarakan mulai tanggal 28 September s.d. 03 Oktober 2026.'
  },
  {
    id: 'sk-003',
    nomorSurat: '421.3/097/SMPN2KTS/2026',
    tanggalSurat: '2026-09-20',
    tujuan: 'Kepala Puskesmas Kutasari',
    perihal: 'Konfirmasi Jadwal Skrining Kesehatan dan UKS',
    pembuat: 'Siti Aminah, A.Md',
    statusApproval: 'Menunggu Approval',
    kodeKlasifikasi: '421.3',
    isiSurat: 'Konfirmasi penyediaan tempat dan pendampingan skrining kesehatan siswa kelas VII pada hari Rabu, 23 September 2026.'
  },
  {
    id: 'sk-004',
    nomorSurat: '090/098/SMPN2KTS/2026',
    tanggalSurat: '2026-09-20',
    tujuan: 'Sugito, S.Pd dan Tri Wahyudi, S.Kom',
    perihal: 'Surat Tugas Rapat Koordinasi ANBK di Aula Dindikbud Purbalingga',
    pembuat: 'Karyono, S.AP',
    statusApproval: 'Disetujui',
    kodeKlasifikasi: '090',
    isiSurat: 'Memerintahkan Waka Kurikulum dan Pranata Komputer menghadiri Rakor ANBK pada hari Selasa, 22 September 2026.'
  },
  {
    id: 'sk-005',
    nomorSurat: '421.3/099/SMPN2KTS/2026',
    tanggalSurat: '2026-09-20',
    tujuan: 'Pengurus Komite SMP Negeri 2 Kutasari',
    perihal: 'Undangan Rapat Pleno Evaluasi Program Kerja Triwulan III',
    pembuat: 'Siti Aminah, A.Md',
    statusApproval: 'Draft',
    kodeKlasifikasi: '005',
    isiSurat: 'Undangan rapat bersama Komite dan perwakilan wali murid mengenai rencana peringatan Bulan Bahasa dan Hari Pahlawan.'
  }
];

export const initialExpeditions: ExpeditionEntry[] = [
  {
    id: 'exp-001',
    outgoingLetterId: 'sk-001',
    nomorSurat: '421.3/095/SMPN2KTS/2026',
    tanggalKirim: '2026-09-19',
    tujuan: 'Dinas Pendidikan dan Kebudayaan Kab. Purbalingga (Bagian SMP)',
    perihal: 'Laporan Kesiapan Sarana ANBK',
    namaPenerima: 'Wahyono (Staf Subbag Perencanaan Dindikbud)',
    statusPengiriman: 'Diterima',
    catatan: 'Diserahkan langsung oleh petugas TU, paraf dan cap dinas lengkap.'
  },
  {
    id: 'exp-002',
    outgoingLetterId: 'sk-004',
    nomorSurat: '090/098/SMPN2KTS/2026',
    tanggalKirim: '2026-09-20',
    tujuan: 'Sugito, S.Pd (Waka Kurikulum)',
    perihal: 'Surat Tugas Rakor ANBK',
    namaPenerima: 'Sugito, S.Pd',
    statusPengiriman: 'Diterima'
  }
];

export const initialInventory: InventoryItem[] = [
  {
    id: 'inv-001',
    kodeBarang: 'BRG/ELK/001',
    nama: 'LCD Proyektor Epson EB-X500',
    kategori: 'TIK & Multimedia',
    merkDanTipe: 'Epson EB-X500 3600 Lumens',
    tahunPerolehan: 2023,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 6,
    jumlahTersedia: 4,
    satuan: 'Unit',
    kondisi: 'Baik',
    lokasiRuang: 'Lab Komputer',
    dapatDipinjamkan: true,
    keterangan: 'Lengkap tas, kabel HDMI 10 meter, remote control'
  },
  {
    id: 'inv-002',
    kodeBarang: 'BRG/ELK/002',
    nama: 'Layar Proyektor Tripod 70 inch',
    kategori: 'TIK & Multimedia',
    merkDanTipe: 'World Screen Portable Tripod 70x70',
    tahunPerolehan: 2023,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 4,
    jumlahTersedia: 3,
    satuan: 'Unit',
    kondisi: 'Baik',
    lokasiRuang: 'Lab Komputer',
    dapatDipinjamkan: true
  },
  {
    id: 'inv-003',
    kodeBarang: 'BRG/ELK/003',
    nama: 'Laptop Asus ExpertBook Core i5',
    kategori: 'TIK & Multimedia',
    merkDanTipe: 'Asus ExpertBook B1400 8GB/512GB SSD',
    tahunPerolehan: 2024,
    sumberDana: 'BOS Kinerja',
    jumlahTotal: 15,
    jumlahTersedia: 12,
    satuan: 'Unit',
    kondisi: 'Baik',
    lokasiRuang: 'Lab Komputer',
    dapatDipinjamkan: true,
    keterangan: 'Untuk pembelajaran digital dan ujian ANBK'
  },
  {
    id: 'inv-004',
    kodeBarang: 'BRG/SND/001',
    nama: 'Sound System Portable Baretone 15 Inch',
    kategori: 'Audio Sound',
    merkDanTipe: 'Baretone MAX15HB Wireless Mic x2',
    tahunPerolehan: 2022,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 2,
    jumlahTersedia: 1,
    satuan: 'Unit',
    kondisi: 'Baik',
    lokasiRuang: 'Ruang TU',
    dapatDipinjamkan: true,
    keterangan: 'Aki baterai baru diganti, mic wireless 2 buah berfungsi jernih'
  },
  {
    id: 'inv-005',
    kodeBarang: 'BRG/SND/002',
    nama: 'Megaphone / Toa Corong Portable',
    kategori: 'Audio Sound',
    merkDanTipe: 'TOA ZR-2015W dengan Sirene',
    tahunPerolehan: 2023,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 3,
    jumlahTersedia: 2,
    satuan: 'Unit',
    kondisi: 'Baik',
    lokasiRuang: 'Ruang Guru',
    dapatDipinjamkan: true,
    keterangan: 'Biasa untuk upacara, senam, dan kegiatan kepramukaan'
  },
  {
    id: 'inv-006',
    kodeBarang: 'BRG/LAB/001',
    nama: 'Mikroskop Siswa Monokuler 1600x',
    kategori: 'Alat Lab IPA',
    merkDanTipe: 'Yazumi XSP-12 dengan Lampu LED',
    tahunPerolehan: 2021,
    sumberDana: 'DAK',
    jumlahTotal: 12,
    jumlahTersedia: 10,
    satuan: 'Unit',
    kondisi: 'Baik',
    lokasiRuang: 'Lab IPA',
    dapatDipinjamkan: true,
    keterangan: 'Disimpan di lemari kaca Lab IPA'
  },
  {
    id: 'inv-007',
    kodeBarang: 'BRG/LAB/002',
    nama: 'Torso Model Tubuh Manusia Lengkap',
    kategori: 'Alat Lab IPA',
    merkDanTipe: 'Pudak Scientific Model Anatomi 85cm',
    tahunPerolehan: 2022,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 3,
    jumlahTersedia: 2,
    satuan: 'Buah',
    kondisi: 'Baik',
    lokasiRuang: 'Lab IPA',
    dapatDipinjamkan: true
  },
  {
    id: 'inv-008',
    kodeBarang: 'BRG/LAB/003',
    nama: 'Kit Percobaan Optik & Lensa Siswa',
    kategori: 'Alat Lab IPA',
    merkDanTipe: 'Pudak Scientific Kit Optik SMP',
    tahunPerolehan: 2021,
    sumberDana: 'DAK',
    jumlahTotal: 6,
    jumlahTersedia: 6,
    satuan: 'Set',
    kondisi: 'Baik',
    lokasiRuang: 'Lab IPA',
    dapatDipinjamkan: true
  },
  {
    id: 'inv-009',
    kodeBarang: 'BRG/LAB/004',
    nama: 'Neraca Ohaus 4 Lengan 311 Gram',
    kategori: 'Alat Lab IPA',
    merkDanTipe: 'Ohaus MB311 Ketelitian 0.01g',
    tahunPerolehan: 2020,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 8,
    jumlahTersedia: 7,
    satuan: 'Unit',
    kondisi: 'Baik',
    lokasiRuang: 'Lab IPA',
    dapatDipinjamkan: true
  },
  {
    id: 'inv-010',
    kodeBarang: 'BRG/OLG/001',
    nama: 'Bola Voli Turnamen PU Molten V5M5000',
    kategori: 'Olahraga',
    merkDanTipe: 'Molten V5M5000 Original FIVB Approved',
    tahunPerolehan: 2024,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 10,
    jumlahTersedia: 6,
    satuan: 'Buah',
    kondisi: 'Baik',
    lokasiRuang: 'Gudang Olahraga',
    dapatDipinjamkan: true
  },
  {
    id: 'inv-011',
    kodeBarang: 'BRG/OLG/002',
    nama: 'Bola Sepak / Futsal Size 4',
    kategori: 'Olahraga',
    merkDanTipe: 'Specs Illuzion II Original',
    tahunPerolehan: 2023,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 8,
    jumlahTersedia: 5,
    satuan: 'Buah',
    kondisi: 'Baik',
    lokasiRuang: 'Gudang Olahraga',
    dapatDipinjamkan: true
  },
  {
    id: 'inv-012',
    kodeBarang: 'BRG/OLG/003',
    nama: 'Stopwatch Digital Presisi 1/100s',
    kategori: 'Olahraga',
    merkDanTipe: 'Casio HS-70W Original Water Resistant',
    tahunPerolehan: 2023,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 6,
    jumlahTersedia: 6,
    satuan: 'Buah',
    kondisi: 'Baik',
    lokasiRuang: 'Gudang Olahraga',
    dapatDipinjamkan: true
  },
  {
    id: 'inv-013',
    kodeBarang: 'BRG/OLG/004',
    nama: 'Matras Senam Lantai Busa Rebonded 10cm',
    kategori: 'Olahraga',
    merkDanTipe: 'Kettler Matras Senam 200x100x10 cm',
    tahunPerolehan: 2022,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 6,
    jumlahTersedia: 5,
    satuan: 'Buah',
    kondisi: 'Rusak Ringan',
    lokasiRuang: 'Gudang Olahraga',
    dapatDipinjamkan: true,
    keterangan: 'Ada sedikit robek jahitan di 1 matras pada sisi kanan'
  },
  {
    id: 'inv-014',
    kodeBarang: 'BRG/KSN/001',
    nama: 'Gitar Akustik Yamaha F310',
    kategori: 'Kesenian',
    merkDanTipe: 'Yamaha F310 Natural Finishing',
    tahunPerolehan: 2023,
    sumberDana: 'Komite',
    jumlahTotal: 6,
    jumlahTersedia: 4,
    satuan: 'Unit',
    kondisi: 'Baik',
    lokasiRuang: 'Ruang Kesenian',
    dapatDipinjamkan: true,
    keterangan: 'Lengkap softcase busa'
  },
  {
    id: 'inv-015',
    kodeBarang: 'BRG/KSN/002',
    nama: 'Keyboard Musik Synthesizer Yamaha PSR-E373',
    kategori: 'Kesenian',
    merkDanTipe: 'Yamaha PSR-E373 61 Keys + Stand + Adaptor',
    tahunPerolehan: 2022,
    sumberDana: 'Komite',
    jumlahTotal: 2,
    jumlahTersedia: 2,
    satuan: 'Unit',
    kondisi: 'Baik',
    lokasiRuang: 'Ruang Kesenian',
    dapatDipinjamkan: true
  },
  {
    id: 'inv-016',
    kodeBarang: 'BRG/KSN/003',
    nama: 'Perangkat Gamelan Pelog Slendro Kuningan',
    kategori: 'Kesenian',
    merkDanTipe: 'Gamelan Gaya Banyumasan 1 Pangkon',
    tahunPerolehan: 2019,
    sumberDana: 'Hibah/Lainnya',
    jumlahTotal: 1,
    jumlahTersedia: 1,
    satuan: 'Set',
    kondisi: 'Baik',
    lokasiRuang: 'Aula Sekolah',
    dapatDipinjamkan: false,
    keterangan: 'Hanya dipakai di Aula, tidak dapat dipinjam keluar gedung'
  },
  {
    id: 'inv-017',
    kodeBarang: 'BRG/KBR/001',
    nama: 'Mesin Pemotong Rumput Dorong Mesin Bensin',
    kategori: 'Kebersihan',
    merkDanTipe: 'Honda GXV160 4-Tak 5.5 HP',
    tahunPerolehan: 2021,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 1,
    jumlahTersedia: 0,
    satuan: 'Unit',
    kondisi: 'Rusak Berat',
    lokasiRuang: 'Gudang Sarpras',
    dapatDipinjamkan: false,
    keterangan: 'Piston macet dan karburator rusak, menunggu penghapusan/afkir aset'
  },
  {
    id: 'inv-018',
    kodeBarang: 'BRG/KBR/002',
    nama: 'Mesin Pompa Air Jet Pump Shimitzu',
    kategori: 'Kebersihan',
    merkDanTipe: 'Shimizu PC-268 BIT 250 Watt',
    tahunPerolehan: 2023,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 2,
    jumlahTersedia: 2,
    satuan: 'Unit',
    kondisi: 'Baik',
    lokasiRuang: 'Gudang Sarpras',
    dapatDipinjamkan: false
  },
  {
    id: 'inv-019',
    kodeBarang: 'BRG/TND/001',
    nama: 'Tenda Regu Pramuka Dome Kapasitas 8 Orang',
    kategori: 'Olahraga',
    merkDanTipe: 'Great Outdoor Dome Double Layer 3x3m',
    tahunPerolehan: 2023,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 8,
    jumlahTersedia: 4,
    satuan: 'Set',
    kondisi: 'Baik',
    lokasiRuang: 'Gudang Sarpras',
    dapatDipinjamkan: true,
    keterangan: 'Lengkap pasak besi dan tas packing'
  },
  {
    id: 'inv-020',
    kodeBarang: 'BRG/ELK/004',
    nama: 'Printer Multifungsi Epson EcoTank L3210',
    kategori: 'TIK & Multimedia',
    merkDanTipe: 'Epson L3210 Print Scan Copy',
    tahunPerolehan: 2024,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 4,
    jumlahTersedia: 4,
    satuan: 'Unit',
    kondisi: 'Baik',
    lokasiRuang: 'Ruang TU',
    dapatDipinjamkan: false,
    keterangan: 'Khusus cetak administrasi sekolah di Ruang TU'
  },
  {
    id: 'inv-021',
    kodeBarang: 'BRG/LAB/005',
    nama: 'Resonansi Tabung Bunyi & Garpu Tala',
    kategori: 'Alat Lab IPA',
    merkDanTipe: 'Pudak Scientific Frekuensi 440Hz',
    tahunPerolehan: 2022,
    sumberDana: 'DAK',
    jumlahTotal: 4,
    jumlahTersedia: 4,
    satuan: 'Set',
    kondisi: 'Baik',
    lokasiRuang: 'Lab IPA',
    dapatDipinjamkan: true
  }
];

export const initialLoans: EquipmentLoan[] = [
  {
    id: 'pjm-001',
    nomorPinjam: 'PJM/2026/09/001',
    tanggalPinjam: '2026-09-18',
    jamPinjam: '08:30',
    jenisPeminjam: 'Guru/Pegawai',
    peminjamId: 'stf-003',
    namaPeminjam: 'Sugito, S.Pd',
    identitasPeminjam: 'Guru IPA / NIP. 19790610 200801 1 011',
    noHpPeminjam: '081327890123',
    items: [
      { itemId: 'inv-006', kodeBarang: 'BRG/LAB/001', namaBarang: 'Mikroskop Siswa Monokuler 1600x', jumlah: 2, kondisiSaatPinjam: 'Baik' },
      { itemId: 'inv-007', kodeBarang: 'BRG/LAB/002', namaBarang: 'Torso Model Tubuh Manusia Lengkap', jumlah: 1, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Praktikum Pengamatan Sel Daun dan Anatomi Organ Kelas 8A',
    rencanaTanggalKembali: '2026-09-20',
    rencanaJamKembali: '13:00',
    namaPetugasPelayan: 'Tri Wahyudi, S.Kom',
    status: 'Dipinjam',
    catatanPinjam: 'Kondisi mikroskop lensa bersih tanpa jamur, torso lengkap'
  },
  {
    id: 'pjm-002',
    nomorPinjam: 'PJM/2026/09/002',
    tanggalPinjam: '2026-09-19',
    jamPinjam: '07:15',
    jenisPeminjam: 'Guru/Pegawai',
    peminjamId: 'stf-004',
    namaPeminjam: 'Endah Retnowati, S.Pd',
    identitasPeminjam: 'Waka Kesiswaan & Guru Bhs Indonesia',
    noHpPeminjam: '081226789456',
    items: [
      { itemId: 'inv-001', kodeBarang: 'BRG/ELK/001', namaBarang: 'LCD Proyektor Epson EB-X500', jumlah: 1, kondisiSaatPinjam: 'Baik' },
      { itemId: 'inv-002', kodeBarang: 'BRG/ELK/002', namaBarang: 'Layar Proyektor Tripod 70 inch', jumlah: 1, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Tayangan Pembelajaran Menulis Puisi di Ruang Multimedia',
    rencanaTanggalKembali: '2026-09-20',
    rencanaJamKembali: '14:30',
    namaPetugasPelayan: 'Tri Wahyudi, S.Kom',
    status: 'Dipinjam',
    catatanPinjam: 'Kabel power dan HDMI ada'
  },
  {
    id: 'pjm-003',
    nomorPinjam: 'PJM/2026/09/003',
    tanggalPinjam: '2026-09-12',
    jamPinjam: '13:00',
    jenisPeminjam: 'Guru/Pegawai',
    peminjamId: 'stf-010',
    namaPeminjam: 'Rahmat Santoso, S.Pd.Jas',
    identitasPeminjam: 'Guru PJOK',
    noHpPeminjam: '085227654321',
    items: [
      { itemId: 'inv-010', kodeBarang: 'BRG/OLG/001', namaBarang: 'Bola Voli Turnamen PU Molten V5M5000', jumlah: 4, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Latihan Ekstrakurikuler Bola Voli Persiapan O2SN Sub-Rayon',
    rencanaTanggalKembali: '2026-09-16', // TERLAMBAT! Rencana 16 Sept, hari ini 20 Sept
    rencanaJamKembali: '16:00',
    namaPetugasPelayan: 'Tri Wahyudi, S.Kom',
    status: 'Terlambat',
    catatanPinjam: 'Bola dalam kantong jaring'
  },
  {
    id: 'pjm-004',
    nomorPinjam: 'PJM/2026/09/004',
    tanggalPinjam: '2026-09-15',
    jamPinjam: '09:00',
    jenisPeminjam: 'Siswa',
    peminjamId: 'std-001',
    namaPeminjam: 'Aditya Pratama Nugroho',
    identitasPeminjam: 'Ketua OSIS / Siswa Kelas 8A',
    noHpPeminjam: '081228123401',
    items: [
      { itemId: 'inv-004', kodeBarang: 'BRG/SND/001', namaBarang: 'Sound System Portable Baretone 15 Inch', jumlah: 1, kondisiSaatPinjam: 'Baik' },
      { itemId: 'inv-005', kodeBarang: 'BRG/SND/002', namaBarang: 'Megaphone / Toa Corong Portable', jumlah: 1, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Rapat Kerja Pengurus OSIS dan Gladi Bersih Pemilihan Ketua OSIS',
    rencanaTanggalKembali: '2026-09-17',
    rencanaJamKembali: '16:00',
    namaPetugasPelayan: 'Tri Wahyudi, S.Kom',
    status: 'Sudah Kembali',
    tanggalKembali: '2026-09-17',
    jamKembali: '16:15',
    kondisiKembali: 'Baik',
    keteranganKembali: 'Kembali lengkap bersama 2 mic wireless dan kabel charger',
    namaPetugasPenerima: 'Tri Wahyudi, S.Kom'
  },
  {
    id: 'pjm-005',
    nomorPinjam: 'PJM/2026/09/005',
    tanggalPinjam: '2026-09-16',
    jamPinjam: '10:00',
    jenisPeminjam: 'Guru/Pegawai',
    peminjamId: 'stf-012',
    namaPeminjam: 'Rizka Nur Azizah, S.Pd',
    identitasPeminjam: 'Guru Seni Budaya',
    noHpPeminjam: '087712398711',
    items: [
      { itemId: 'inv-014', kodeBarang: 'BRG/KSN/001', namaBarang: 'Gitar Akustik Yamaha F310', jumlah: 2, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Praktik Akor Gitar Lagu Daerah Kelas 8B dan 8C',
    rencanaTanggalKembali: '2026-09-22',
    rencanaJamKembali: '14:00',
    namaPetugasPelayan: 'Tri Wahyudi, S.Kom',
    status: 'Dipinjam',
    catatanPinjam: 'Senar lengkap dan ada softcase'
  },
  {
    id: 'pjm-006',
    nomorPinjam: 'PJM/2026/09/006',
    tanggalPinjam: '2026-09-10',
    jamPinjam: '14:00',
    jenisPeminjam: 'Pihak Luar',
    namaPeminjam: 'Bambang Kusumo',
    identitasPeminjam: 'Ketua Karang Taruna Desa Tobong',
    noHpPeminjam: '085811223344',
    items: [
      { itemId: 'inv-019', kodeBarang: 'BRG/TND/001', namaBarang: 'Tenda Regu Pramuka Dome Kapasitas 8 Orang', jumlah: 4, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Kemah Bakti Pemuda Karang Taruna di Bumi Perkemahan Munjulluhur',
    rencanaTanggalKembali: '2026-09-14',
    rencanaJamKembali: '10:00',
    namaPetugasPelayan: 'Tri Wahyudi, S.Kom',
    status: 'Rusak/Hilang',
    tanggalKembali: '2026-09-14',
    jamKembali: '15:30',
    kondisiKembali: 'Rusak',
    keteranganKembali: '1 tenda robek terpal atapnya dan 2 pasak besi hilang akibat angin kencang',
    tindakLanjutGantiRugi: 'Pihak Karang Taruna telah mengganti biaya perbaikan tenda sebesar Rp 150.000 dan membeli 2 pasak baru.',
    namaPetugasPenerima: 'Tri Wahyudi, S.Kom'
  },
  {
    id: 'pjm-007',
    nomorPinjam: 'PJM/2026/09/007',
    tanggalPinjam: '2026-09-19',
    jamPinjam: '11:00',
    jenisPeminjam: 'Guru/Pegawai',
    peminjamId: 'stf-008',
    namaPeminjam: 'Tri Wahyudi, S.Kom',
    identitasPeminjam: 'Pranata Komputer / Guru Informatika',
    noHpPeminjam: '085870123999',
    items: [
      { itemId: 'inv-003', kodeBarang: 'BRG/ELK/003', namaBarang: 'Laptop Asus ExpertBook Core i5', jumlah: 3, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Bimtek Daring Pembelajaran Berbasis AI untuk Guru di Ruang Rapat',
    rencanaTanggalKembali: '2026-09-21',
    rencanaJamKembali: '16:00',
    namaPetugasPelayan: 'Karyono, S.AP',
    status: 'Dipinjam',
    catatanPinjam: 'Lengkap charger original dan mouse USB'
  },
  {
    id: 'pjm-008',
    nomorPinjam: 'PJM/2026/09/008',
    tanggalPinjam: '2026-09-14',
    jamPinjam: '08:00',
    jenisPeminjam: 'Guru/Pegawai',
    peminjamId: 'stf-010',
    namaPeminjam: 'Rahmat Santoso, S.Pd.Jas',
    identitasPeminjam: 'Guru PJOK',
    noHpPeminjam: '085227654321',
    items: [
      { itemId: 'inv-011', kodeBarang: 'BRG/OLG/002', namaBarang: 'Bola Sepak / Futsal Size 4', jumlah: 3, kondisiSaatPinjam: 'Baik' },
      { itemId: 'inv-013', kodeBarang: 'BRG/OLG/003', namaBarang: 'Matras Senam Lantai Busa Rebonded 10cm', jumlah: 1, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Ujian Praktik Senam Lantai Roll Depan dan Passing Futsal Kelas 9A',
    rencanaTanggalKembali: '2026-09-15',
    rencanaJamKembali: '14:00',
    namaPetugasPelayan: 'Tri Wahyudi, S.Kom',
    status: 'Sudah Kembali',
    tanggalKembali: '2026-09-15',
    jamKembali: '13:45',
    kondisiKembali: 'Baik',
    keteranganKembali: 'Kondisi barang bersih dan tersimpan kembali di gudang olahraga',
    namaPetugasPenerima: 'Tri Wahyudi, S.Kom'
  },
  {
    id: 'pjm-009',
    nomorPinjam: 'PJM/2026/09/009',
    tanggalPinjam: '2026-09-20',
    jamPinjam: '07:30',
    jenisPeminjam: 'Guru/Pegawai',
    peminjamId: 'stf-005',
    namaPeminjam: 'Bambang Trianto, S.Pd, M.Pd.',
    identitasPeminjam: 'Waka Sarpras & Guru Matematika',
    noHpPeminjam: '085227112233',
    items: [
      { itemId: 'inv-001', kodeBarang: 'BRG/ELK/001', namaBarang: 'LCD Proyektor Epson EB-X500', jumlah: 1, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Presentasi Progres Realisasi Belanja Modal Sarpras kepada Komite',
    rencanaTanggalKembali: '2026-09-20', // JATUH TEMPO HARI INI
    rencanaJamKembali: '15:00',
    namaPetugasPelayan: 'Tri Wahyudi, S.Kom',
    status: 'Dipinjam',
    catatanPinjam: 'Diambil dari Lab Komputer'
  },
  {
    id: 'pjm-010',
    nomorPinjam: 'PJM/2026/09/010',
    tanggalPinjam: '2026-09-11',
    jamPinjam: '10:00',
    jenisPeminjam: 'Guru/Pegawai',
    peminjamId: 'stf-003',
    namaPeminjam: 'Sugito, S.Pd',
    identitasPeminjam: 'Guru IPA / Waka Kurikulum',
    noHpPeminjam: '081327890123',
    items: [
      { itemId: 'inv-009', kodeBarang: 'BRG/LAB/004', namaBarang: 'Neraca Ohaus 4 Lengan 311 Gram', jumlah: 1, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Pengukuran Massa Zat Praktikum Kimia Dasar Kelas 7A',
    rencanaTanggalKembali: '2026-09-13',
    rencanaJamKembali: '13:00',
    namaPetugasPelayan: 'Tri Wahyudi, S.Kom',
    status: 'Sudah Kembali',
    tanggalKembali: '2026-09-13',
    jamKembali: '12:30',
    kondisiKembali: 'Baik',
    keteranganKembali: 'Neraca telah terkalibrasi normal',
    namaPetugasPenerima: 'Tri Wahyudi, S.Kom'
  },
  {
    id: 'pjm-011',
    nomorPinjam: 'PJM/2026/09/011',
    tanggalPinjam: '2026-09-08',
    jamPinjam: '09:00',
    jenisPeminjam: 'Guru/Pegawai',
    peminjamId: 'stf-011',
    namaPeminjam: 'Nurul Hidayati, S.Pd.I',
    identitasPeminjam: 'Guru PAI',
    noHpPeminjam: '081391827364',
    items: [
      { itemId: 'inv-004', kodeBarang: 'BRG/SND/001', namaBarang: 'Sound System Portable Baretone 15 Inch', jumlah: 1, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Peringatan Maulid Nabi Muhammad SAW di Musholla Sekolah',
    rencanaTanggalKembali: '2026-09-08',
    rencanaJamKembali: '15:00',
    namaPetugasPelayan: 'Tri Wahyudi, S.Kom',
    status: 'Sudah Kembali',
    tanggalKembali: '2026-09-08',
    jamKembali: '14:40',
    kondisiKembali: 'Baik',
    keteranganKembali: 'Kembali lengkap dan rapi',
    namaPetugasPenerima: 'Tri Wahyudi, S.Kom'
  },
  {
    id: 'pjm-012',
    nomorPinjam: 'PJM/2026/09/012',
    tanggalPinjam: '2026-09-13',
    jamPinjam: '08:00',
    jenisPeminjam: 'Siswa',
    peminjamId: 'std-005',
    namaPeminjam: 'Dimas Wahyu Saputra',
    identitasPeminjam: 'Siswa Kelas 9A / Koordinator Pramuka Garuda',
    noHpPeminjam: '081327456005',
    items: [
      { itemId: 'inv-005', kodeBarang: 'BRG/SND/002', namaBarang: 'Megaphone / Toa Corong Portable', jumlah: 1, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Latihan Baris Berbaris dan Semaphore Pasukan Penggalang',
    rencanaTanggalKembali: '2026-09-14',
    rencanaJamKembali: '17:00',
    namaPetugasPelayan: 'Tri Wahyudi, S.Kom',
    status: 'Sudah Kembali',
    tanggalKembali: '2026-09-14',
    jamKembali: '16:30',
    kondisiKembali: 'Baik',
    namaPetugasPenerima: 'Tri Wahyudi, S.Kom'
  },
  {
    id: 'pjm-013',
    nomorPinjam: 'PJM/2026/09/013',
    tanggalPinjam: '2026-09-05',
    jamPinjam: '09:00',
    jenisPeminjam: 'Guru/Pegawai',
    peminjamId: 'stf-009',
    namaPeminjam: 'Dewi Lestari, S.Pd',
    identitasPeminjam: 'Guru Bahasa Inggris',
    noHpPeminjam: '081229876543',
    items: [
      { itemId: 'inv-001', kodeBarang: 'BRG/ELK/001', namaBarang: 'LCD Proyektor Epson EB-X500', jumlah: 1, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Listening Comprehension Exercise Kelas 9B',
    rencanaTanggalKembali: '2026-09-05',
    rencanaJamKembali: '13:00',
    namaPetugasPelayan: 'Tri Wahyudi, S.Kom',
    status: 'Sudah Kembali',
    tanggalKembali: '2026-09-05',
    jamKembali: '12:45',
    kondisiKembali: 'Baik',
    namaPetugasPenerima: 'Tri Wahyudi, S.Kom'
  },
  {
    id: 'pjm-014',
    nomorPinjam: 'PJM/2026/09/014',
    tanggalPinjam: '2026-09-02',
    jamPinjam: '10:00',
    jenisPeminjam: 'Guru/Pegawai',
    peminjamId: 'stf-013',
    namaPeminjam: 'Eko Sulistyo, S.Pd',
    identitasPeminjam: 'Guru IPS',
    noHpPeminjam: '081228456123',
    items: [
      { itemId: 'inv-001', kodeBarang: 'BRG/ELK/001', namaBarang: 'LCD Proyektor Epson EB-X500', jumlah: 1, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Pemutaran Dokumenter Sejarah Kemerdekaan Indonesia Kelas 7C',
    rencanaTanggalKembali: '2026-09-02',
    rencanaJamKembali: '14:00',
    namaPetugasPelayan: 'Tri Wahyudi, S.Kom',
    status: 'Sudah Kembali',
    tanggalKembali: '2026-09-02',
    jamKembali: '13:50',
    kondisiKembali: 'Baik',
    namaPetugasPenerima: 'Tri Wahyudi, S.Kom'
  },
  {
    id: 'pjm-015',
    nomorPinjam: 'PJM/2026/09/015',
    tanggalPinjam: '2026-08-25',
    jamPinjam: '08:30',
    jenisPeminjam: 'Pihak Luar',
    namaPeminjam: 'Sutardi, S.Pd',
    identitasPeminjam: 'Kepala SD Negeri 1 Tobong',
    noHpPeminjam: '081329123888',
    items: [
      { itemId: 'inv-004', kodeBarang: 'BRG/SND/001', namaBarang: 'Sound System Portable Baretone 15 Inch', jumlah: 1, kondisiSaatPinjam: 'Baik' }
    ],
    keperluan: 'Peringatan HUT Kemerdekaan RI Tingkat Gugus SD Kutasari',
    rencanaTanggalKembali: '2026-08-26',
    rencanaJamKembali: '14:00',
    namaPetugasPelayan: 'Karyono, S.AP',
    status: 'Sudah Kembali',
    tanggalKembali: '2026-08-26',
    jamKembali: '13:30',
    kondisiKembali: 'Baik',
    keteranganKembali: 'Diserahkan dalam kondisi bersih dan utuh',
    namaPetugasPenerima: 'Tri Wahyudi, S.Kom'
  }
];

export const initialCashTransactions: CashTransaction[] = [
  {
    id: 'kas-001',
    nomorBukti: 'BKM/BOS/2026/07/001',
    tanggal: '2026-07-15',
    uraian: 'Penerimaan Dana BOS Reguler Tahap II Tahun Anggaran 2026',
    kodeRekening: '4.1.04.01.01',
    sumberDana: 'BOS Reguler',
    jenis: 'Penerimaan',
    nominal: 185600000,
    saldoSetelahnya: 185600000,
    komponenAnggaran: 'Belanja Barang/Jasa'
  },
  {
    id: 'kas-002',
    nomorBukti: 'BKK/BOS/2026/07/002',
    tanggal: '2026-07-20',
    uraian: 'Pembayaran Honorarium Guru Tidak Tetap (GTT) & Pegawai Tidak Tetap (PTT) Bulan Juli 2026',
    kodeRekening: '5.1.02.02.01',
    sumberDana: 'BOS Reguler',
    jenis: 'Pengeluaran',
    nominal: 14500000,
    saldoSetelahnya: 171100000,
    komponenAnggaran: 'Gaji/Honor'
  },
  {
    id: 'kas-003',
    nomorBukti: 'BKK/BOS/2026/07/003',
    tanggal: '2026-07-25',
    uraian: 'Belanja Alat Tulis Kantor (ATK) Administrasi TU & Kesiswaan Awal Tahun Ajaran 2026/2027',
    kodeRekening: '5.1.02.01.01',
    sumberDana: 'BOS Reguler',
    jenis: 'Pengeluaran',
    nominal: 6850000,
    saldoSetelahnya: 164250000,
    komponenAnggaran: 'Belanja Barang/Jasa'
  },
  {
    id: 'kas-004',
    nomorBukti: 'BKM/KOM/2026/08/001',
    tanggal: '2026-08-05',
    uraian: 'Penerimaan Sumbangan Sukarela Peningkatan Sarana dari Komite Sekolah',
    kodeRekening: '4.1.04.02.01',
    sumberDana: 'Dana Komite',
    jenis: 'Penerimaan',
    nominal: 25000000,
    saldoSetelahnya: 189250000,
    komponenAnggaran: 'Pemeliharaan Sarpras'
  },
  {
    id: 'kas-005',
    nomorBukti: 'BKK/KOM/2026/08/002',
    tanggal: '2026-08-12',
    uraian: 'Pembayaran Pekerjaan Pavingisasi Halaman Lapangan Upacara (Termin I)',
    kodeRekening: '5.2.03.01.02',
    sumberDana: 'Dana Komite',
    jenis: 'Pengeluaran',
    nominal: 18000000,
    saldoSetelahnya: 171250000,
    komponenAnggaran: 'Pemeliharaan Sarpras'
  },
  {
    id: 'kas-006',
    nomorBukti: 'BKK/BOS/2026/08/003',
    tanggal: '2026-08-20',
    uraian: 'Pembayaran Honorarium GTT & PTT Bulan Agustus 2026',
    kodeRekening: '5.1.02.02.01',
    sumberDana: 'BOS Reguler',
    jenis: 'Pengeluaran',
    nominal: 14500000,
    saldoSetelahnya: 156750000,
    komponenAnggaran: 'Gaji/Honor'
  },
  {
    id: 'kas-007',
    nomorBukti: 'BKK/BOS/2026/08/004',
    tanggal: '2026-08-24',
    uraian: 'Pembayaran Langganan Daya & Jasa (Listrik PLN, Internet IndiHome 100 Mbps, Air PDAM) Agustus',
    kodeRekening: '5.1.02.02.03',
    sumberDana: 'BOS Reguler',
    jenis: 'Pengeluaran',
    nominal: 4200000,
    saldoSetelahnya: 152550000,
    komponenAnggaran: 'Belanja Barang/Jasa'
  },
  {
    id: 'kas-008',
    nomorBukti: 'BKK/BOS/2026/08/005',
    tanggal: '2026-08-28',
    uraian: 'Belanja Konsumsi & Perlengkapan Lomba Peringatan HUT RI ke-81 Siswa',
    kodeRekening: '5.1.02.01.04',
    sumberDana: 'BOS Reguler',
    jenis: 'Pengeluaran',
    nominal: 5400000,
    saldoSetelahnya: 147150000,
    komponenAnggaran: 'Kegiatan Kesiswaan'
  },
  {
    id: 'kas-009',
    nomorBukti: 'BKM/KIN/2026/09/001',
    tanggal: '2026-09-04',
    uraian: 'Penerimaan Dana BOS Kinerja Sekolah Berprestasi Tahun 2026',
    kodeRekening: '4.1.04.01.02',
    sumberDana: 'BOS Kinerja',
    jenis: 'Penerimaan',
    nominal: 60000000,
    saldoSetelahnya: 207150000,
    komponenAnggaran: 'Peralatan/Modal'
  },
  {
    id: 'kas-010',
    nomorBukti: 'BKK/BOS/2026/09/002',
    tanggal: '2026-09-10',
    uraian: 'Servis Berkala & Penggantian Tinta Master Printer Ruang TU serta Pemeliharaan AC Ruang Guru',
    kodeRekening: '5.1.02.03.01',
    sumberDana: 'BOS Reguler',
    jenis: 'Pengeluaran',
    nominal: 3150000,
    saldoSetelahnya: 204000000,
    komponenAnggaran: 'Pemeliharaan Sarpras'
  },
  {
    id: 'kas-011',
    nomorBukti: 'BKK/BOS/2026/09/003',
    tanggal: '2026-09-18',
    uraian: 'Penggandaan Naskah Soal & Lembar Jawab Penilaian Tengah Semester (PTS) Ganjil 2026/2027',
    kodeRekening: '5.1.02.01.02',
    sumberDana: 'BOS Reguler',
    jenis: 'Pengeluaran',
    nominal: 7200000,
    saldoSetelahnya: 196800000,
    komponenAnggaran: 'Kegiatan Kesiswaan'
  },
  {
    id: 'kas-012',
    nomorBukti: 'BKK/BOS/2026/09/004',
    tanggal: '2026-09-20',
    uraian: 'Pembayaran Honorarium GTT & PTT Bulan September 2026',
    kodeRekening: '5.1.02.02.01',
    sumberDana: 'BOS Reguler',
    jenis: 'Pengeluaran',
    nominal: 14500000,
    saldoSetelahnya: 182300000,
    komponenAnggaran: 'Gaji/Honor'
  }
];

export const DEFAULT_OFFICIAL_ROMBELS = [
  '7A', '7B', '7C', '7D', '7E', '7F',
  '8A', '8B', '8C', '8D', '8E', '8F', '8G',
  '9A', '9B', '9C', '9D', '9E', '9F'
] as const;

export const initialAttendanceRecap: StudentAttendanceRecap[] = [
  { rombel: '7A', bulan: '2026-09', totalSiswa: 32, hadir: 94, sakit: 3, izin: 2, alpa: 1, persentaseHadir: 94.0 },
  { rombel: '7B', bulan: '2026-09', totalSiswa: 32, hadir: 96, sakit: 2, izin: 1, alpa: 1, persentaseHadir: 96.0 },
  { rombel: '7C', bulan: '2026-09', totalSiswa: 32, hadir: 93, sakit: 4, izin: 2, alpa: 1, persentaseHadir: 93.0 },
  { rombel: '7D', bulan: '2026-09', totalSiswa: 32, hadir: 95, sakit: 2, izin: 2, alpa: 1, persentaseHadir: 95.0 },
  { rombel: '7E', bulan: '2026-09', totalSiswa: 32, hadir: 95, sakit: 2, izin: 1, alpa: 1, persentaseHadir: 95.0 },
  { rombel: '7F', bulan: '2026-09', totalSiswa: 32, hadir: 96, sakit: 2, izin: 1, alpa: 1, persentaseHadir: 96.0 },
  { rombel: '8A', bulan: '2026-09', totalSiswa: 32, hadir: 97, sakit: 2, izin: 1, alpa: 0, persentaseHadir: 97.0 },
  { rombel: '8B', bulan: '2026-09', totalSiswa: 31, hadir: 95, sakit: 3, izin: 1, alpa: 1, persentaseHadir: 95.0 },
  { rombel: '8C', bulan: '2026-09', totalSiswa: 32, hadir: 94, sakit: 3, izin: 2, alpa: 1, persentaseHadir: 94.0 },
  { rombel: '8D', bulan: '2026-09', totalSiswa: 32, hadir: 96, sakit: 2, izin: 1, alpa: 1, persentaseHadir: 96.0 },
  { rombel: '8E', bulan: '2026-09', totalSiswa: 32, hadir: 95, sakit: 2, izin: 1, alpa: 1, persentaseHadir: 95.0 },
  { rombel: '8F', bulan: '2026-09', totalSiswa: 32, hadir: 96, sakit: 2, izin: 1, alpa: 1, persentaseHadir: 96.0 },
  { rombel: '8G', bulan: '2026-09', totalSiswa: 31, hadir: 94, sakit: 3, izin: 1, alpa: 2, persentaseHadir: 94.0 },
  { rombel: '9A', bulan: '2026-09', totalSiswa: 32, hadir: 98, sakit: 1, izin: 1, alpa: 0, persentaseHadir: 98.0 },
  { rombel: '9B', bulan: '2026-09', totalSiswa: 32, hadir: 96, sakit: 2, izin: 1, alpa: 1, persentaseHadir: 96.0 },
  { rombel: '9C', bulan: '2026-09', totalSiswa: 32, hadir: 95, sakit: 3, izin: 1, alpa: 1, persentaseHadir: 95.0 },
  { rombel: '9D', bulan: '2026-09', totalSiswa: 31, hadir: 96, sakit: 2, izin: 1, alpa: 1, persentaseHadir: 96.0 },
  { rombel: '9E', bulan: '2026-09', totalSiswa: 32, hadir: 97, sakit: 1, izin: 1, alpa: 1, persentaseHadir: 97.0 },
  { rombel: '9F', bulan: '2026-09', totalSiswa: 32, hadir: 95, sakit: 2, izin: 2, alpa: 1, persentaseHadir: 95.0 }
];

export const initialClasses = [
  '7A', '7B', '7C', '7D', '7E', '7F',
  '8A', '8B', '8C', '8D', '8E', '8F', '8G',
  '9A', '9B', '9C', '9D', '9E', '9F'
];

/**
 * Mendapatkan daftar rombel dinamis:
 * Menggabungkan rombel standar resmi SMPN 2 Kutasari (7A-7F, 8A-8G, 9A-9F)
 * dengan seluruh rombel yang ada pada data siswa (hasil impor ataupun entri manual).
 */
export function getDynamicRombels(students?: Array<{ rombel?: string }>): string[] {
  const base = [
    '7A', '7B', '7C', '7D', '7E', '7F',
    '8A', '8B', '8C', '8D', '8E', '8F', '8G',
    '9A', '9B', '9C', '9D', '9E', '9F'
  ];
  if (!students || students.length === 0) return base;

  const fromStudents = students
    .map(s => (s.rombel || '').trim().toUpperCase().replace(/\s+/g, ''))
    .filter(r => r.length > 0);

  const combined = Array.from(new Set([...base, ...fromStudents]));

  return combined.sort((a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });
}

export const initialRooms = [
  'Lab IPA',
  'Lab Komputer',
  'Ruang Guru',
  'Ruang TU',
  'Ruang Kepala Sekolah',
  'Ruang BK',
  'Ruang UKS',
  'Perpustakaan',
  'Aula Sekolah',
  'Ruang Kesenian',
  'Gudang Olahraga',
  'Gudang Sarpras',
  'Ruang Kelas 7A',
  'Ruang Kelas 8A',
  'Ruang Kelas 9A'
];

export const initialSubjects = [
  'Pendidikan Agama dan Budi Pekerti',
  'Pendidikan Pancasila (PPKn)',
  'Bahasa Indonesia',
  'Matematika',
  'Ilmu Pengetahuan Alam (IPA)',
  'Ilmu Pengetahuan Sosial (IPS)',
  'Bahasa Inggris',
  'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)',
  'Informatika',
  'Seni Budaya',
  'Prakarya',
  'Muatan Lokal Bahasa Jawa'
];
