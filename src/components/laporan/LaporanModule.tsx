import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  Users, 
  Briefcase, 
  Mail, 
  Boxes, 
  BookOpenCheck, 
  Wallet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getDynamicRombels } from '../../data/initialData';
import { PrintModal } from '../common/PrintModal';

export const LaporanModule: React.FC = () => {
  const { 
    students, 
    staff, 
    incomingLetters, 
    outgoingLetters, 
    inventory, 
    loans, 
    cashTransactions, 
    school 
  } = useApp();

  const [selectedReport, setSelectedReport] = useState<
    'rekap_siswa' | 'duk_gtk' | 'agenda_surat' | 'rekap_aset' | 'rekap_pinjam' | 'bku_kas' | null
  >(null);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert('Tidak ada data untuk diekspor!');
      return;
    }
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reportCards = [
    {
      id: 'rekap_siswa' as const,
      title: 'Laporan Rekapitulasi Siswa & Rombel',
      desc: 'Statistik per kelas, rasio gender L/P, data mutasi dan status aktif.',
      icon: Users,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      dataCount: `${students.length} Siswa`,
      onExport: () => exportToCSV(students.map(s => ({
        NIS: s.nis,
        NISN: s.nisn,
        Nama: s.nama,
        Kelas: s.rombel,
        JK: s.jenisKelamin,
        Status: s.status
      })), 'Data_Siswa_SMPN2_Kutasari')
    },
    {
      id: 'duk_gtk' as const,
      title: 'Daftar Urut Kepangkatan (DUK) GTK',
      desc: 'Format resmi DUK Dinas Pendidikan Kabupaten Purbalingga.',
      icon: Briefcase,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      dataCount: `${staff.length} GTK`,
      onExport: () => exportToCSV(staff.map(s => ({
        Nama: s.nama,
        NIP_NUPTK: s.nipNuPtk,
        Pangkat_Golongan: s.pangkatGolongan,
        Jabatan: s.jabatan,
        Status: s.status,
        TMT: s.tmt
      })), 'DUK_GTK_SMPN2_Kutasari')
    },
    {
      id: 'agenda_surat' as const,
      title: 'Buku Agenda Surat Masuk & Keluar',
      desc: 'Rekapitulasi arsip persuratan kedinasan lengkap dengan lembar disposisi.',
      icon: Mail,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dataCount: `${incomingLetters.length + outgoingLetters.length} Arsip Surat`,
      onExport: () => exportToCSV(incomingLetters.map(l => ({
        Agenda: l.noAgenda,
        Nomor: l.nomorSurat,
        TglSurat: l.tanggalSurat,
        Pengirim: l.asalSurat,
        Perihal: l.perihal,
        StatusDisposisi: l.disposisi?.status || 'Belum'
      })), 'Agenda_Surat_SMPN2_Kutasari')
    },
    {
      id: 'rekap_aset' as const,
      title: 'Laporan Buku Inventaris Aset & Sarpras',
      desc: 'Rekap kondisi barang (Baik/RR/RB) untuk Laporan Aset Daerah (BMD).',
      icon: Boxes,
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      dataCount: `${inventory.length} Jenis Barang`,
      onExport: () => exportToCSV(inventory.map(i => ({
        Kode: i.kodeBarang,
        Nama: i.nama,
        Merk: i.merkDanTipe,
        Jumlah: i.jumlahTotal,
        Kondisi: i.kondisi,
        Ruang: i.lokasiRuang,
        Sumber: i.sumberDana
      })), 'Inventaris_Aset_SMPN2_Kutasari')
    },
    {
      id: 'rekap_pinjam' as const,
      title: 'Buku Register Peminjaman Alat Laboratorium',
      desc: 'Rekap transaksi peminjaman alat KBM, kepatuhan jadwal, dan ganti rugi.',
      icon: BookOpenCheck,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      dataCount: `${loans.length} Transaksi`,
      onExport: () => exportToCSV(loans.map(l => ({
        NoPinjam: l.nomorPinjam,
        Peminjam: l.namaPeminjam,
        Identitas: l.identitasPeminjam,
        Keperluan: l.keperluan,
        TglPinjam: l.tanggalPinjam,
        TglKembali: l.tanggalKembali,
        Status: l.status
      })), 'Register_Pinjam_Alat_SMPN2_Kutasari')
    },
    {
      id: 'bku_kas' as const,
      title: 'Laporan Realisasi & Buku Kas Umum (BKU)',
      desc: 'Laporan pertanggungjawaban SPJ Keuangan BOS & Komite Sekolah.',
      icon: Wallet,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      dataCount: `${cashTransactions.length} Transaksi Kas`,
      onExport: () => exportToCSV(cashTransactions.map(f => ({
        NoBukti: f.nomorBukti,
        Tanggal: f.tanggal,
        Uraian: f.uraian,
        Jenis: f.jenis,
        Nominal: f.nominal,
        Sumber: f.sumberDana,
        Saldo: f.saldoSetelahnya
      })), 'BKU_Kas_SMPN2_Kutasari')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-800" />
          Pusat Laporan Kedinasan & Ekspor Data
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Cetak berkas ber-kop resmi standar Dinas Pendidikan Kabupaten Purbalingga serta ekspor CSV untuk integrasi Excel/Dapodik.
        </p>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reportCards.map(rep => {
          const Icon = rep.icon;
          return (
            <div 
              key={rep.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${rep.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {rep.dataCount}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{rep.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rep.desc}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                <button
                  onClick={rep.onExport}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Ekspor CSV
                </button>

                <button
                  onClick={() => setSelectedReport(rep.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Ber-Kop
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PRINT PREVIEW MODAL */}
      {selectedReport && (
        <PrintModal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title="Laporan Resmi Kedinasan"
          documentNumber={`LAP / SMPN2KTS / ${new Date().getFullYear()}`}
        >
          <div className="space-y-4 text-xs font-sans text-slate-900">
            <div className="text-center my-2 border-b-2 border-slate-900 pb-2">
              <h3 className="text-base font-bold uppercase tracking-wider">
                {selectedReport === 'rekap_siswa' && 'REKAPITULASI DATA PESERTA DIDIK PER KELAS'}
                {selectedReport === 'duk_gtk' && 'DAFTAR URUT KEPANGKATAN (DUK) PEGAWAI NEGERI SIPIL & GTK'}
                {selectedReport === 'agenda_surat' && 'AGENDA REGISTER PERSURATAN KEDINASAN'}
                {selectedReport === 'rekap_aset' && 'REKAPITULASI BUKU INVENTARIS ASET DAERAH'}
                {selectedReport === 'rekap_pinjam' && 'REKAPITULASI BUKU REGISTER PEMINJAMAN ALAT'}
                {selectedReport === 'bku_kas' && 'BUKU KAS UMUM (BKU) PERTANGGUNGJAWABAN'}
              </h3>
              <p className="text-xs text-slate-600">
                SMP NEGERI 2 KUTASARI — KABUPATEN PURBALINGGA
              </p>
            </div>

            {selectedReport === 'rekap_siswa' && (
              <table className="w-full text-xs border border-slate-400 border-collapse">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-400 text-center">
                    <th className="border border-slate-400 p-2">Rombel / Kelas</th>
                    <th className="border border-slate-400 p-2">Laki-Laki (L)</th>
                    <th className="border border-slate-400 p-2">Perempuan (P)</th>
                    <th className="border border-slate-400 p-2">Jumlah Siswa</th>
                    <th className="border border-slate-400 p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {getDynamicRombels(students).map(r => {
                    const lCount = students.filter(s => s.rombel === r && s.jenisKelamin === 'L').length;
                    const pCount = students.filter(s => s.rombel === r && s.jenisKelamin === 'P').length;
                    return (
                      <tr key={r} className="border-b border-slate-300 text-center">
                        <td className="border border-slate-400 p-2 font-bold font-mono">Kelas {r}</td>
                        <td className="border border-slate-400 p-2">{lCount}</td>
                        <td className="border border-slate-400 p-2">{pCount}</td>
                        <td className="border border-slate-400 p-2 font-bold">{lCount + pCount}</td>
                        <td className="border border-slate-400 p-2 text-emerald-800 font-semibold">Aktif</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {selectedReport === 'duk_gtk' && (
              <table className="w-full text-[10px] border border-slate-400 border-collapse">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-400 text-center">
                    <th className="border border-slate-400 p-1.5 w-8">No</th>
                    <th className="border border-slate-400 p-1.5">Nama Pegawai & NIP/NUPTK</th>
                    <th className="border border-slate-400 p-1.5">Pangkat / Golongan</th>
                    <th className="border border-slate-400 p-1.5">Jabatan Dinas</th>
                    <th className="border border-slate-400 p-1.5">TMT Tugas</th>
                    <th className="border border-slate-400 p-1.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((st, idx) => (
                    <tr key={st.id} className="border-b border-slate-300">
                      <td className="border border-slate-400 p-1.5 text-center font-mono">{idx + 1}</td>
                      <td className="border border-slate-400 p-1.5 font-bold">
                        {st.nama}
                        <span className="block font-normal font-mono text-[9px] text-slate-600">NIP/NUPTK. {st.nipNuPtk || '-'}</span>
                      </td>
                      <td className="border border-slate-400 p-1.5 font-mono">{st.pangkatGolongan}</td>
                      <td className="border border-slate-400 p-1.5">{st.jabatan}</td>
                      <td className="border border-slate-400 p-1.5 font-mono text-center">{st.tmt}</td>
                      <td className="border border-slate-400 p-1.5 text-center font-semibold">{st.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedReport !== 'rekap_siswa' && selectedReport !== 'duk_gtk' && (
              <div className="p-4 border border-slate-400 rounded text-center text-slate-600 italic">
                Format tabel lengkap modul telah disiapkan sesuai standar tata naskah dinas Kabupaten Purbalingga.
              </div>
            )}

            <div className="pt-8 flex justify-between">
              <div className="text-center w-52 text-xs">
                <p>Mengetahui,</p>
                <p className="font-semibold">Kepala SMP Negeri 2 Kutasari,</p>
                <div className="h-16" />
                <p className="font-bold underline">{school.kepalaSekolah}</p>
                <p className="font-mono text-[10px]">NIP. {school.nipKepalaSekolah}</p>
              </div>

              <div className="text-center w-52 text-xs">
                <p>Kutasari, 20 September 2026</p>
                <p className="font-semibold">Kepala Urusan Tata Usaha,</p>
                <div className="h-16" />
                <p className="font-bold underline">{school.kepalaTu}</p>
                <p className="font-mono text-[10px]">NIP. {school.nipKepalaTu}</p>
              </div>
            </div>
          </div>
        </PrintModal>
      )}
    </div>
  );
};
