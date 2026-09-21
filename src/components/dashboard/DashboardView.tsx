import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Mail, 
  Boxes, 
  BookOpenCheck, 
  Wallet, 
  AlertTriangle, 
  Clock, 
  ArrowUpRight, 
  PlusCircle, 
  CheckCircle,
  FileText,
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getDynamicRombels } from '../../data/initialData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { 
    students, 
    staff, 
    incomingLetters, 
    inventory, 
    loans, 
    cashTransactions, 
    notifications,
    setActiveModule,
    school
  } = useApp();

  // 1. Calculations for Metric Cards
  const totalStudents = students.filter(s => s.status === 'aktif').length;
  const maleStudents = students.filter(s => s.status === 'aktif' && s.jenisKelamin === 'L').length;
  const femaleStudents = students.filter(s => s.status === 'aktif' && s.jenisKelamin === 'P').length;

  const totalStaff = staff.length;
  const pnsStaff = staff.filter(s => s.status === 'PNS').length;
  const pppkStaff = staff.filter(s => s.status === 'PPPK').length;
  const honorerStaff = staff.filter(s => s.status === 'GTT' || s.status === 'PTT').length;

  const pendingDisposisiCount = incomingLetters.filter(l => !l.disposisi || l.disposisi.status === 'Belum').length;
  
  const totalAssetsCount = inventory.reduce((acc, curr) => acc + curr.jumlahTotal, 0);
  const damagedAssetsCount = inventory.filter(i => i.kondisi === 'Rusak Ringan' || i.kondisi === 'Rusak Berat').length;

  const activeLoans = loans.filter(l => l.status === 'Dipinjam' || l.status === 'Terlambat');
  const overdueLoansCount = notifications.overdueLoans.length;

  const lastCashBalance = cashTransactions.length > 0 
    ? cashTransactions[cashTransactions.length - 1].saldoSetelahnya 
    : 0;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // 2. Chart Data: Siswa per Rombel
  const activeRombels = getDynamicRombels(students);
  const rombelCounts: Record<string, number> = {};
  activeRombels.forEach(r => {
    rombelCounts[r] = 0;
  });
  students.forEach(s => {
    if (s.status === 'aktif') {
      const r = (s.rombel || '').trim().toUpperCase();
      if (r) {
        rombelCounts[r] = (rombelCounts[r] || 0) + 1;
      }
    }
  });

  const studentChartData = Object.entries(rombelCounts).map(([rombel, jumlah]) => ({
    rombel,
    jumlah: jumlah
  }));

  // 3. Chart Data: Tren Surat Masuk 6 Bulan Terakhir
  const letterTrendData = [
    { bulan: 'Apr', surat: 14 },
    { bulan: 'Mei', surat: 18 },
    { bulan: 'Jun', surat: 22 },
    { bulan: 'Jul', surat: 29 }, // Awal tahun ajaran baru
    { bulan: 'Agu', surat: 26 },
    { bulan: 'Sep', surat: 19 }  // Berjalan
  ];

  return (
    <div className="space-y-6">
      {/* Banner Selamat Datang */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/40">
              SIMTU Terpusat
            </span>
            <span className="text-xs text-blue-200">Kabupaten Purbalingga</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Selamat Datang di SIMTU {school.namaSekolah}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200/90 mt-1 max-w-2xl leading-relaxed">
            Sistem Informasi Manajemen Tata Usaha untuk efisiensi kesiswaan, kepegawaian GTK, 
            persuratan, sarana prasarana, buku pinjam alat, dan pencatatan kas umum sekolah.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold rainbow-animated-text drop-shadow-xs tracking-wide">
              Pengembang Sistem: Purwanto, S.Pd (spendaku221)
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveModule('pinjam_alat')}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpenCheck className="w-4 h-4" />
            + Peminjaman Alat
          </button>
          <button
            onClick={() => setActiveModule('persuratan')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            + Catat Surat Masuk
          </button>
        </div>
      </div>

      {/* 6 Kartu Ringkas Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Siswa */}
        <div 
          onClick={() => setActiveModule('kesiswaan')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Siswa Aktif</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalStudents}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            <span className="font-semibold text-blue-700">{maleStudents} L</span> • <span className="font-semibold text-pink-600">{femaleStudents} P</span>
          </p>
        </div>

        {/* GTK */}
        <div 
          onClick={() => setActiveModule('kepegawaian')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Pegawai</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalStaff}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {pnsStaff} PNS • {pppkStaff} PPPK • {honorerStaff} Honorer
          </p>
        </div>

        {/* Surat Masuk Belum Disposisi */}
        <div 
          onClick={() => setActiveModule('persuratan')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Belum Didisposisi</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {pendingDisposisiCount}
            {pendingDisposisiCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                Segera
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Total {incomingLetters.length} agenda surat
          </p>
        </div>

        {/* Barang Inventaris */}
        <div 
          onClick={() => setActiveModule('sarpras')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-purple-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Barang Sarpras</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{inventory.length} item</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalAssetsCount} unit • <span className="text-red-600 font-semibold">{damagedAssetsCount} rusak</span>
          </p>
        </div>

        {/* Alat Sedang Dipinjam */}
        <div 
          onClick={() => setActiveModule('pinjam_alat')}
          className={`bg-white p-4 rounded-xl border shadow-xs hover:border-blue-400 transition-all cursor-pointer group ${
            overdueLoansCount > 0 ? 'border-red-300 bg-red-50/20' : 'border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Alat Dipinjam</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BookOpenCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeLoans.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {overdueLoansCount > 0 ? (
              <span className="text-red-600 font-bold animate-pulse">
                {overdueLoansCount} Terlambat!
              </span>
            ) : (
              <span>Tertib sesuai jadwal</span>
            )}
          </p>
        </div>

        {/* Saldo Kas BKU */}
        <div 
          onClick={() => setActiveModule('keuangan')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Saldo Kas Umum</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900 truncate" title={formatRupiah(lastCashBalance)}>
            {formatRupiah(lastCashBalance)}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            BOS & Komite Aktif
          </p>
        </div>
      </div>

      {/* Grid: 2 Kolom Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafik Jumlah Siswa Per Kelas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Distribusi Siswa per Rombel (Kelas 7, 8, 9)
              </h3>
              <p className="text-xs text-slate-500">Tahun Ajaran 2026/2027</p>
            </div>
            <button
              onClick={() => setActiveModule('kesiswaan')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              Lihat Kesiswaan <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="rombel" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 40]} />
                <Tooltip 
                  formatter={(val: any) => [`${val ?? 0} Siswa`, 'Jumlah']}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="jumlah" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grafik Tren Surat Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Tren Penerimaan Surat Masuk (6 Bulan Terakhir)
              </h3>
              <p className="text-xs text-slate-500">Aktivitas agenda dinas & instansi terkait</p>
            </div>
            <button
              onClick={() => setActiveModule('persuratan')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              Lihat Persuratan <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={letterTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(val: any) => [`${val ?? 0} Surat`, 'Jumlah Masuk']}
                />
                <Line type="monotone" dataKey="surat" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid Bawah: Peringatan & Agenda Prioritas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1: Peminjaman Alat Jatuh Tempo & Terlambat */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Status Peminjaman Kritis
              </h3>
              <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                {notifications.overdueLoans.length + notifications.dueTodayLoans.length} Alat
              </span>
            </div>

            <div className="space-y-3">
              {notifications.overdueLoans.map(loan => (
                <div key={loan.id} className="p-3 rounded-xl bg-red-50/70 border border-red-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-900">{loan.nomorPinjam}</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-red-600 text-white rounded">
                      TERLAMBAT
                    </span>
                  </div>
                  <p className="font-medium text-slate-800 mt-1">{loan.namaPeminjam} ({loan.identitasPeminjam})</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    {loan.items.map(i => `${i.jumlah}x ${i.namaBarang}`).join(', ')}
                  </p>
                  <p className="text-[10px] text-red-700 font-semibold mt-1">
                    Jadwal kembali: {loan.rencanaTanggalKembali} pk {loan.rencanaJamKembali}
                  </p>
                </div>
              ))}

              {notifications.dueTodayLoans.map(loan => (
                <div key={loan.id} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900">{loan.nomorPinjam}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-600 text-white rounded">
                      HARI INI
                    </span>
                  </div>
                  <p className="font-medium text-slate-800 mt-1">{loan.namaPeminjam}</p>
                  <p className="text-slate-600 text-[11px]">
                    {loan.items.map(i => `${i.jumlah}x ${i.namaBarang}`).join(', ')}
                  </p>
                  <p className="text-[10px] text-amber-800 font-medium mt-1">
                    Batas pengembalian pukul {loan.rencanaJamKembali || '15:00'} WIB
                  </p>
                </div>
              ))}

              {notifications.overdueLoans.length === 0 && notifications.dueTodayLoans.length === 0 && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                  Semua peminjaman alat dalam jadwal normal.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveModule('pinjam_alat')}
            className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 text-center transition-colors cursor-pointer"
          >
            Buka Buku Pinjam Alat
          </button>
        </div>

        {/* Kolom 2: Pengingat Kepegawaian (KGB & Pangkat H-90) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Pengingat GTK (KGB & Pangkat H-90)
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {notifications.impendingKgb.length + notifications.impendingPangkat.length} Pegawai
              </span>
            </div>

            <div className="space-y-3">
              {notifications.impendingKgb.slice(0, 3).map(staffMember => (
                <div key={staffMember.id} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950">{staffMember.nama}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      KGB
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{staffMember.jabatan} • {staffMember.pangkatGolongan}</p>
                  <p className="text-[10px] text-emerald-800 font-semibold mt-1">
                    TMT KGB: {staffMember.tmtKgbBerikutnya} (Siapkan berkas SK)
                  </p>
                </div>
              ))}

              {notifications.impendingPangkat.slice(0, 2).map(staffMember => (
                <div key={staffMember.id} className="p-3 rounded-xl bg-blue-50/50 border border-blue-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950">{staffMember.nama}</span>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                      Pangkat
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{staffMember.pangkatGolongan}</p>
                  <p className="text-[10px] text-blue-800 font-semibold mt-1">
                    TMT Pangkat: {staffMember.tmtPangkatBerikutnya}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveModule('kepegawaian')}
            className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 text-center transition-colors cursor-pointer"
          >
            Lihat Data Kepegawaian (DUK)
          </button>
        </div>

        {/* Kolom 3: Surat Masuk & Disposisi Terkini */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Surat Masuk Menunggu Disposisi
              </h3>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                {incomingLetters.length} Total
              </span>
            </div>

            <div className="space-y-3">
              {incomingLetters.slice(0, 3).map(letter => (
                <div key={letter.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-900 font-mono text-[11px]">{letter.noAgenda}</span>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      letter.sifat === 'sangat_segera' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {letter.sifat}
                    </span>
                  </div>
                  <p className="font-medium text-slate-800 mt-1 line-clamp-1">{letter.perihal}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">Dari: {letter.asalSurat}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">{letter.tanggalTerima}</span>
                    <span className={`font-semibold ${letter.disposisi ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {letter.disposisi ? 'Sudah Ada Disposisi' : 'Belum Didisposisi'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveModule('persuratan')}
            className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 text-center transition-colors cursor-pointer"
          >
            Buka Agenda Persuratan
          </button>
        </div>
      </div>
    </div>
  );
};
