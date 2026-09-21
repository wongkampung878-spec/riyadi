import React, { useState } from 'react';
import { 
  BookOpenCheck, 
  Search, 
  Plus, 
  Printer, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  PenTool, 
  User, 
  Calendar, 
  Layers, 
  Trash2, 
  X,
  FileCheck,
  RotateCcw,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EquipmentLoan, LoanItemDetail, InventoryItem } from '../../types';
import { SignatureCanvas } from '../common/SignatureCanvas';
import { PrintModal } from '../common/PrintModal';

export const PinjamAlatModule: React.FC = () => {
  const { 
    loans, 
    createLoan, 
    returnLoan, 
    deleteLoan, 
    inventory, 
    staff, 
    students, 
    notifications,
    currentUser,
    school 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'daftar_pinjam' | 'pinjam_baru' | 'rekap_buku'>('daftar_pinjam');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');

  // Return Modal State
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedLoanForReturn, setSelectedLoanForReturn] = useState<EquipmentLoan | null>(null);
  const [returnData, setReturnData] = useState({
    tanggalKembali: new Date().toISOString().split('T')[0],
    jamKembali: '14:30',
    kondisiKembali: 'Baik' as 'Baik' | 'Rusak' | 'Hilang',
    keteranganKembali: '',
    tindakLanjutGantiRugi: '',
    namaPetugasPenerima: currentUser.name
  });

  // Print Modal State
  const [isPrintSlipOpen, setIsPrintSlipOpen] = useState(false);
  const [selectedLoanForPrint, setSelectedLoanForPrint] = useState<EquipmentLoan | null>(null);
  const [isPrintRegisterOpen, setIsPrintRegisterOpen] = useState(false);

  // New Loan Form State
  const [borrowerType, setBorrowerType] = useState<'guru_staf' | 'siswa'>('guru_staf');
  const [selectedBorrowerId, setSelectedBorrowerId] = useState('');
  const [borrowerNameManual, setBorrowerNameManual] = useState('');
  const [borrowerIdentityManual, setBorrowerIdentityManual] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [lokasiPenggunaan, setLokasiPenggunaan] = useState('Ruang Kelas 8B');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const [tanggalPinjam, setTanggalPinjam] = useState(todayStr);
  const [jamPinjam, setJamPinjam] = useState('07:30');
  const [rencanaTanggalKembali, setRencanaTanggalKembali] = useState(todayStr);
  const [rencanaJamKembali, setRencanaJamKembali] = useState('14:30');
  const [signatureData, setSignatureData] = useState<string>('');

  // Cart of loan items
  const [selectedCartItems, setSelectedCartItems] = useState<LoanItemDetail[]>([]);
  const [itemToAddId, setItemToAddId] = useState('');
  const [itemToAddQty, setItemToAddQty] = useState(1);

  // Filtered Loans
  const filteredLoans = loans.filter(l => {
    const matchesSearch = 
      l.nomorPinjam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.namaPeminjam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.keperluan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.items.some(i => i.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'semua' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Add Item to Cart
  const handleAddToCart = () => {
    if (!itemToAddId) return;
    const inv = inventory.find(i => i.id === itemToAddId);
    if (!inv) return;

    if (!inv.dapatDipinjamkan) {
      alert(`Barang "${inv.nama}" tidak diizinkan untuk dipinjamkan keluar ruangan!`);
      return;
    }
    if (inv.kondisi === 'Rusak Berat') {
      alert(`Barang "${inv.nama}" berstatus Rusak Berat, tidak dapat dipinjam!`);
      return;
    }
    if (inv.jumlahTersedia < itemToAddQty) {
      alert(`Stok tersedia hanya ${inv.jumlahTersedia} unit!`);
      return;
    }

    // Check if item already in cart
    const existingIndex = selectedCartItems.findIndex(i => i.itemId === inv.id);
    if (existingIndex >= 0) {
      const updated = [...selectedCartItems];
      updated[existingIndex].jumlah += itemToAddQty;
      setSelectedCartItems(updated);
    } else {
      setSelectedCartItems(prev => [
        ...prev,
        {
          itemId: inv.id,
          namaBarang: inv.nama,
          kodeBarang: inv.kodeBarang,
          jumlah: itemToAddQty,
          kondisiSaatPinjam: inv.kondisi
        }
      ]);
    }

    setItemToAddQty(1);
  };

  const handleRemoveFromCart = (index: number) => {
    setSelectedCartItems(prev => prev.filter((_, i) => i !== index));
  };

  // Submit New Loan
  const handleSubmitNewLoan = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCartItems.length === 0) {
      alert('Pilih minimal 1 barang untuk dipinjam!');
      return;
    }

    let peminjamNama = '';
    let peminjamIdentitas = '';

    if (borrowerType === 'guru_staf') {
      const staffMember = staff.find(s => s.id === selectedBorrowerId);
      if (!staffMember) {
        alert('Pilih Guru atau Staf peminjam!');
        return;
      }
      peminjamNama = staffMember.nama;
      peminjamIdentitas = `NIP/NUPTK: ${staffMember.nipNuPtk || '-'} (${staffMember.jabatan})`;
    } else {
      const student = students.find(s => s.id === selectedBorrowerId);
      if (!student) {
        alert('Pilih Siswa peminjam!');
        return;
      }
      peminjamNama = student.nama;
      peminjamIdentitas = `NISN: ${student.nisn} (Kelas ${student.rombel})`;
    }

    if (!keperluan) {
      alert('Tuliskan keperluan/kegiatan peminjaman alat!');
      return;
    }

    const result = createLoan({
      jenisPeminjam: borrowerType === 'guru_staf' ? 'Guru/Pegawai' : 'Siswa',
      peminjamId: selectedBorrowerId,
      namaPeminjam: peminjamNama,
      identitasPeminjam: peminjamIdentitas,
      noHpPeminjam: '081234567890',
      keperluan,
      tanggalPinjam,
      jamPinjam,
      rencanaTanggalKembali,
      rencanaJamKembali,
      items: selectedCartItems,
      namaPetugasPelayan: currentUser.name,
      tandaTanganUrl: signatureData
    });

    if (result.success && result.loan) {
      setSelectedLoanForPrint(result.loan);
      setSelectedCartItems([]);
      setKeperluan('');
      setSignatureData('');
      setActiveTab('daftar_pinjam');
      setIsPrintSlipOpen(true);
      alert(`Transaksi peminjaman ${result.loan.nomorPinjam} berhasil dibukukan!`);
    } else {
      alert(result.message || 'Gagal membuat peminjaman');
    }
  };

  // Open Return Modal
  const handleOpenReturnModal = (loan: EquipmentLoan) => {
    setSelectedLoanForReturn(loan);
    setReturnData({
      tanggalKembali: new Date().toISOString().split('T')[0],
      jamKembali: '14:30',
      kondisiKembali: 'Baik',
      keteranganKembali: 'Barang telah diperiksa kelengkapannya dan dalam kondisi prima.',
      tindakLanjutGantiRugi: '',
      namaPetugasPenerima: currentUser.name
    });
    setIsReturnModalOpen(true);
  };

  // Submit Return
  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanForReturn) return;

    returnLoan(selectedLoanForReturn.id, {
      ...returnData,
      namaPetugasPenerima: currentUser.name
    });

    setIsReturnModalOpen(false);
    alert('Pengembalian alat berhasil dicatat! Stok barang inventaris telah diperbarui.');
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpenCheck className="w-6 h-6 text-blue-700" />
            Buku Pinjam Alat Laboratorium & Sarpras
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Buku register digital peminjaman alat praktik/KBM dengan verifikasi stok otomatis dan tanda tangan digital.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('daftar_pinjam')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'daftar_pinjam' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Daftar Transaksi Pinjam</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800">
              {loans.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pinjam_baru')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pinjam_baru' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Peminjaman Baru (Multi-item)</span>
          </button>

          <button
            onClick={() => setActiveTab('rekap_buku')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'rekap_buku' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cetak Register Buku Pinjam
          </button>
        </div>
      </div>

      {/* TAB 1: DAFTAR TRANSAKSI PINJAM */}
      {activeTab === 'daftar_pinjam' && (
        <div className="space-y-4">
          {/* Action & Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari kode pinjam, nama peminjam, barang..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="semua">Semua Status</option>
                <option value="Dipinjam">Sedang Dipinjam</option>
                <option value="Terlambat">Terlambat</option>
                <option value="Sudah Kembali">Sudah Kembali</option>
                <option value="Rusak/Hilang">Rusak / Hilang</option>
              </select>
            </div>

            <button
              onClick={() => setActiveTab('pinjam_baru')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              Pinjam Alat Baru
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                    <th className="py-3 px-4">No. Pinjam</th>
                    <th className="py-3 px-4">Peminjam</th>
                    <th className="py-3 px-4">Daftar Barang & Jml</th>
                    <th className="py-3 px-4">Keperluan & Lokasi</th>
                    <th className="py-3 px-4">Tgl & Jam Pinjam</th>
                    <th className="py-3 px-4">Batas Kembali</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Slip</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLoans.map(loan => {
                    const isOverdue = loan.status === 'Terlambat' || 
                      (loan.status === 'Dipinjam' && loan.rencanaTanggalKembali < todayStr);

                    return (
                      <tr key={loan.id} className={`hover:bg-slate-50/70 ${isOverdue ? 'bg-red-50/20' : ''}`}>
                        <td className="py-3 px-4 font-mono font-bold text-blue-900">
                          {loan.nomorPinjam}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900 block">{loan.namaPeminjam}</span>
                          <span className="text-[10px] text-slate-500">{loan.identitasPeminjam}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            {loan.items.map((item, i) => (
                              <div key={i} className="text-[11px] font-medium text-slate-800">
                                • <span className="font-bold">{item.jumlah}x</span> {item.namaBarang}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <span className="font-medium text-slate-800 block line-clamp-1">{loan.keperluan}</span>
                          <span className="text-[10px] text-slate-500">Peminjam: {loan.identitasPeminjam}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700 text-[11px]">
                          {loan.tanggalPinjam} <span className="text-slate-400">({loan.jamPinjam})</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <span className={`font-semibold ${isOverdue ? 'text-red-700 font-bold' : 'text-slate-800'}`}>
                            {loan.rencanaTanggalKembali}
                          </span>
                          <span className="text-slate-400 block text-[10px]">pk {loan.rencanaJamKembali || '14:30'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            loan.status === 'Sudah Kembali' ? 'bg-emerald-100 text-emerald-800' :
                            loan.status === 'Rusak/Hilang' ? 'bg-purple-100 text-purple-800' :
                            isOverdue ? 'bg-red-600 text-white animate-pulse' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {isOverdue && loan.status === 'Dipinjam' ? 'TERLAMBAT' : loan.status}
                          </span>
                          {loan.tanggalKembali && (
                            <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                              Kembali: {loan.tanggalKembali}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedLoanForPrint(loan);
                              setIsPrintSlipOpen(true);
                            }}
                            className="p-1 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded cursor-pointer"
                            title="Cetak Bukti Transaksi Pinjam"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {loan.status === 'Dipinjam' || loan.status === 'Terlambat' ? (
                              <button
                                onClick={() => handleOpenReturnModal(loan)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Kembalikan
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Selesai</span>
                            )}
                            <button
                              onClick={() => {
                                if (window.confirm(`Hapus catatan transaksi ${loan.nomorPinjam}?`)) {
                                  deleteLoan(loan.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                              title="Hapus Transaksi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Menampilkan {filteredLoans.length} dari {loans.length} transaksi peminjaman</span>
              <span className="font-semibold text-slate-700">
                Alat Sedang Dipinjam: {loans.filter(l => l.status === 'Dipinjam' || l.status === 'Terlambat').length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FORM PEMINJAMAN BARU (MULTI-ITEM CHECKOUT & DIGITAL SIGNATURE) */}
      {activeTab === 'pinjam_baru' && (
        <form onSubmit={handleSubmitNewLoan} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kolom 1 & 2: Identitas & Pilihan Barang */}
            <div className="lg:col-span-2 space-y-5">
              {/* Card 1: Identitas Peminjam */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  1. Identitas Peminjam & Kegiatan
                </h3>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-slate-800">
                    <input
                      type="radio"
                      name="borrowerType"
                      checked={borrowerType === 'guru_staf'}
                      onChange={() => {
                        setBorrowerType('guru_staf');
                        setSelectedBorrowerId('');
                      }}
                      className="text-blue-600"
                    />
                    Guru / Staf GTK
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-slate-800">
                    <input
                      type="radio"
                      name="borrowerType"
                      checked={borrowerType === 'siswa'}
                      onChange={() => {
                        setBorrowerType('siswa');
                        setSelectedBorrowerId('');
                      }}
                      className="text-blue-600"
                    />
                    Siswa (Perwakilan Kelas / OSIS)
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Pilih Nama {borrowerType === 'guru_staf' ? 'Guru/Pegawai' : 'Siswa'} *
                    </label>
                    <select
                      required
                      value={selectedBorrowerId}
                      onChange={(e) => setSelectedBorrowerId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white"
                    >
                      <option value="">-- Pilih dari Master Data --</option>
                      {borrowerType === 'guru_staf' ? (
                        staff.map(st => (
                          <option key={st.id} value={st.id}>{st.nama} ({st.jabatan})</option>
                        ))
                      ) : (
                        students.filter(s => s.status === 'aktif').map(sd => (
                          <option key={sd.id} value={sd.id}>{sd.nama} - Kelas {sd.rombel} (NISN: {sd.nisn})</option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Lokasi Penggunaan Alat *</label>
                    <input
                      type="text"
                      required
                      value={lokasiPenggunaan}
                      onChange={(e) => setLokasiPenggunaan(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                      placeholder="Contoh: Ruang Kelas 8B / Lapangan Upacara / Lab IPA"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="font-semibold text-slate-700 block mb-1">Keperluan / Acara / Mata Pelajaran *</label>
                  <input
                    type="text"
                    required
                    value={keperluan}
                    onChange={(e) => setKeperluan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="Contoh: Praktikum Mikroskop Pembelahan Sel Kelas 7A"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tanggal Pinjam</label>
                    <input
                      type="date"
                      required
                      value={tanggalPinjam}
                      onChange={(e) => setTanggalPinjam(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Jam Pinjam</label>
                    <input
                      type="time"
                      required
                      value={jamPinjam}
                      onChange={(e) => setJamPinjam(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Rencana Kembali</label>
                    <input
                      type="date"
                      required
                      value={rencanaTanggalKembali}
                      onChange={(e) => setRencanaTanggalKembali(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Jam Kembali</label>
                    <input
                      type="time"
                      required
                      value={rencanaJamKembali}
                      onChange={(e) => setRencanaJamKembali(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Multi-Item Picker */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between border-b pb-2">
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    2. Pilih Barang yang Dipinjam (Bisa Lebih Dari 1)
                  </span>
                  <span className="text-xs font-semibold text-purple-700">
                    {selectedCartItems.length} Macam Barang Dipilih
                  </span>
                </h3>

                {/* Item Select Input */}
                <div className="flex flex-col sm:flex-row items-end gap-3 text-xs p-3 bg-purple-50/50 rounded-xl border border-purple-200">
                  <div className="flex-1 w-full">
                    <label className="font-semibold text-slate-700 block mb-1">Pilih Barang dari Inventaris</label>
                    <select
                      value={itemToAddId}
                      onChange={(e) => setItemToAddId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-purple-600"
                    >
                      <option value="">-- Pilih Barang Tersedia --</option>
                      {inventory.map(inv => (
                        <option 
                          key={inv.id} 
                          value={inv.id}
                          disabled={!inv.dapatDipinjamkan || inv.jumlahTersedia <= 0 || inv.kondisi === 'Rusak Berat'}
                        >
                          {inv.nama} ({inv.kodeBarang}) — Stok: {inv.jumlahTersedia} unit [{inv.kondisi}]
                          {!inv.dapatDipinjamkan ? ' (TIDAK DIPINJAMKAN)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <label className="font-semibold text-slate-700 block mb-1">Jumlah</label>
                    <input
                      type="number"
                      min={1}
                      value={itemToAddQty}
                      onChange={(e) => setItemToAddQty(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-center font-bold focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    Tambahkan
                  </button>
                </div>

                {/* Cart Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b text-slate-600 uppercase font-semibold text-[11px]">
                        <th className="py-2.5 px-3">Kode</th>
                        <th className="py-2.5 px-3">Nama Barang</th>
                        <th className="py-2.5 px-3 text-center">Jumlah</th>
                        <th className="py-2.5 px-3">Kondisi Saat Ini</th>
                        <th className="py-2.5 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedCartItems.map((cartItem, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{cartItem.kodeBarang}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{cartItem.namaBarang}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-blue-900">{cartItem.jumlah} Unit</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {cartItem.kondisiSaatPinjam}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveFromCart(idx)}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              title="Hapus dari daftar pinjam"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {selectedCartItems.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-400">
                            Belum ada barang yang ditambahkan ke keranjang pinjam.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Kolom 3: Tanda Tangan Digital & Submit Action */}
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b pb-2">
                  <PenTool className="w-4 h-4 text-emerald-600" />
                  3. Tanda Tangan Peminjam
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Peminjam menandatangani secara digital langsung pada layar (touchscreen / mouse) sebagai bukti serah terima resmi.
                </p>

                <SignatureCanvas
                  onSave={(url) => setSignatureData(url)}
                  initialValue={signatureData}
                />

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-[11px] space-y-1">
                  <p className="font-semibold text-slate-800">Aturan & Komitmen Peminjam:</p>
                  <p>1. Bertanggung jawab penuh atas keutuhan dan kebersihan barang.</p>
                  <p>2. Wajib mengembalikan tepat waktu sesuai jadwal.</p>
                  <p>3. Apabila rusak atau hilang, bersedia mengganti atau memperbaiki sesuai ketentuan.</p>
                </div>

                <button
                  type="submit"
                  disabled={selectedCartItems.length === 0}
                  className={`w-full py-3 text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    selectedCartItems.length > 0
                      ? 'bg-blue-700 hover:bg-blue-600 text-white shadow-blue-500/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <BookOpenCheck className="w-4 h-4" />
                  Konfirmasi & Terbitkan Slip Peminjaman
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: BUKU REGISTER PEMINJAMAN ALAT (CETAK LAPORAN RESMI) */}
      {activeTab === 'rekap_buku' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Buku Register Peminjaman Alat Laboratorium & Sarpras</h3>
              <p className="text-xs text-slate-500">Format register buku pinjam fisik kedinasan yang dapat dicetak per semester / bulan.</p>
            </div>

            <button
              onClick={() => setIsPrintRegisterOpen(true)}
              className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
            >
              <Printer className="w-4 h-4" />
              Cetak Buku Register Lengkap
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[11px]">
                    <th className="py-3 px-3">No</th>
                    <th className="py-3 px-3">No. Pinjam</th>
                    <th className="py-3 px-3">Tgl Pinjam</th>
                    <th className="py-3 px-3">Nama Peminjam & Jabatan/Kelas</th>
                    <th className="py-3 px-3">Barang & Jumlah</th>
                    <th className="py-3 px-3">Keperluan</th>
                    <th className="py-3 px-3">Tgl Kembali</th>
                    <th className="py-3 px-3">Kondisi Akhir</th>
                    <th className="py-3 px-3">Paraf Peminjam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loans.map((loan, idx) => (
                    <tr key={loan.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono text-center">{idx + 1}</td>
                      <td className="py-3 px-3 font-mono font-bold text-blue-900">{loan.nomorPinjam}</td>
                      <td className="py-3 px-3 font-mono">{loan.tanggalPinjam}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{loan.namaPeminjam}</span>
                        <span className="text-[10px] text-slate-500">{loan.identitasPeminjam}</span>
                      </td>
                      <td className="py-3 px-3">
                        {loan.items.map(i => `${i.jumlah}x ${i.namaBarang}`).join('; ')}
                      </td>
                      <td className="py-3 px-3 text-slate-700">{loan.keperluan}</td>
                      <td className="py-3 px-3 font-mono">{loan.tanggalKembali || '-'}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{loan.kondisiKembali || 'Sedang Dipinjam'}</td>
                      <td className="py-3 px-3 text-center">
                        {loan.tandaTanganUrl ? (
                          <img src={loan.tandaTanganUrl} alt="TTD" className="h-6 mx-auto object-contain" />
                        ) : (
                          <span className="text-slate-400 italic text-[10px]">[Paraf]</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FORM PENGEMBALIAN ALAT & PEMERIKSAAN KONDISI */}
      {isReturnModalOpen && selectedLoanForReturn && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-emerald-400" />
                Penerimaan & Pengembalian Alat
              </h3>
              <button onClick={() => setIsReturnModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReturn} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-900">{selectedLoanForReturn.nomorPinjam}</span>
                  <span className="text-slate-600 font-mono text-[11px]">Pinjam: {selectedLoanForReturn.tanggalPinjam}</span>
                </div>
                <p className="font-semibold text-slate-900">{selectedLoanForReturn.namaPeminjam} ({selectedLoanForReturn.identitasPeminjam})</p>
                <div className="pt-1 text-[11px] text-slate-700">
                  <span className="font-semibold">Daftar Barang: </span>
                  {selectedLoanForReturn.items.map(i => `${i.jumlah}x ${i.namaBarang}`).join(', ')}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Kembali Aktual</label>
                  <input
                    type="date"
                    required
                    value={returnData.tanggalKembali}
                    onChange={(e) => setReturnData({ ...returnData, tanggalKembali: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jam Kembali</label>
                  <input
                    type="time"
                    required
                    value={returnData.jamKembali}
                    onChange={(e) => setReturnData({ ...returnData, jamKembali: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kondisi Fisik Saat Pengembalian *</label>
                <select
                  value={returnData.kondisiKembali}
                  onChange={(e) => setReturnData({ ...returnData, kondisiKembali: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 font-bold"
                >
                  <option value="Baik">Baik (Lengkap dan berfungsi normal)</option>
                  <option value="Rusak">Rusak (Ada kerusakan fisik / fungsi)</option>
                  <option value="Hilang">Hilang (Barang tidak kembali)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catatan Pemeriksaan Petugas</label>
                <textarea
                  rows={2}
                  value={returnData.keteranganKembali}
                  onChange={(e) => setReturnData({ ...returnData, keteranganKembali: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
                  placeholder="Catatan kebersihan, aksesoris kabel, dll..."
                />
              </div>

              {/* If Rusak or Hilang, show tindak lanjut ganti rugi */}
              {returnData.kondisiKembali !== 'Baik' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
                  <label className="font-bold text-red-900 block text-xs">
                    Tindak Lanjut Kerusakan / Kehilangan (Ganti Rugi) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={returnData.tindakLanjutGantiRugi}
                    onChange={(e) => setReturnData({ ...returnData, tindakLanjutGantiRugi: e.target.value })}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:border-red-600 bg-white"
                    placeholder="Contoh: Peminjam bersedia mengganti unit baru selambat-lambatnya 7 hari kerja / biaya servis..."
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Pengembalian & Perbarui Stok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT: SLIP BUKTI PEMINJAMAN ALAT */}
      {isPrintSlipOpen && selectedLoanForPrint && (
        <PrintModal
          isOpen={isPrintSlipOpen}
          onClose={() => setIsPrintSlipOpen(false)}
          title="Bukti Peminjaman Alat Laboratorium & Sarana"
          documentNumber={selectedLoanForPrint.nomorPinjam}
        >
          <div className="space-y-4 text-xs font-sans text-slate-900">
            <div className="text-center my-2 border-b-2 border-slate-900 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider">
                BUKTI SERAH TERIMA PEMINJAMAN ALAT
              </h3>
              <p className="font-mono font-bold text-blue-900 text-sm mt-0.5">
                NO: {selectedLoanForPrint.nomorPinjam}
              </p>
            </div>

            <table className="w-full text-xs border border-slate-400 border-collapse">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-40 p-2 bg-slate-50 font-bold border-r border-slate-300">Nama Peminjam</td>
                  <td className="p-2 font-semibold uppercase">{selectedLoanForPrint.namaPeminjam}</td>
                  <td className="w-36 p-2 bg-slate-50 font-bold border-r border-l border-slate-300">Identitas</td>
                  <td className="p-2">{selectedLoanForPrint.identitasPeminjam}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 bg-slate-50 font-bold border-r border-slate-300">Tanggal & Jam Pinjam</td>
                  <td className="p-2 font-mono">{selectedLoanForPrint.tanggalPinjam} pk {selectedLoanForPrint.jamPinjam}</td>
                  <td className="p-2 bg-slate-50 font-bold border-r border-l border-slate-300">Batas Pengembalian</td>
                  <td className="p-2 font-mono font-bold text-red-800">{selectedLoanForPrint.rencanaTanggalKembali} pk {selectedLoanForPrint.rencanaJamKembali}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 bg-slate-50 font-bold border-r border-slate-300">Keperluan / KBM</td>
                  <td colSpan={3} className="p-2 font-medium">{selectedLoanForPrint.keperluan}</td>
                </tr>
                <tr>
                  <td className="p-2 bg-slate-50 font-bold border-r border-slate-300">Identitas Peminjam</td>
                  <td colSpan={3} className="p-2">{selectedLoanForPrint.identitasPeminjam}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4">
              <h4 className="font-bold text-xs uppercase mb-2">DAFTAR BARANG YANG DIPINJAM :</h4>
              <table className="w-full text-xs border border-slate-400 border-collapse">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-400 text-center">
                    <th className="border border-slate-400 p-2 w-12">No</th>
                    <th className="border border-slate-400 p-2">Kode Barang</th>
                    <th className="border border-slate-400 p-2">Nama Barang Inventaris</th>
                    <th className="border border-slate-400 p-2 w-20">Jumlah</th>
                    <th className="border border-slate-400 p-2 w-28">Kondisi Awal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLoanForPrint.items.map((it, idx) => (
                    <tr key={idx} className="border-b border-slate-300">
                      <td className="border border-slate-400 p-2 text-center font-mono">{idx + 1}</td>
                      <td className="border border-slate-400 p-2 font-mono font-bold">{it.kodeBarang}</td>
                      <td className="border border-slate-400 p-2 font-semibold">{it.namaBarang}</td>
                      <td className="border border-slate-400 p-2 text-center font-bold">{it.jumlah} Unit</td>
                      <td className="border border-slate-400 p-2 text-center font-medium">{it.kondisiSaatPinjam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-300 rounded text-[11px] space-y-0.5">
              <p className="font-bold">Ketentuan & Komitmen Peminjam:</p>
              <p>Barang diterima dalam kondisi baik dan lengkap. Apabila terjadi kerusakan atau kehilangan, peminjam bertanggung jawab sepenuhnya untuk memperbaiki atau mengganti sesuai standar sekolah.</p>
            </div>

            <div className="pt-6 flex justify-between">
              <div className="text-center w-52 text-xs">
                <p>Petugas Sarpras / TU,</p>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-slate-400 italic text-[10px]">[ Paraf Petugas ]</span>
                </div>
                <p className="font-bold underline">{selectedLoanForPrint.namaPetugasPelayan}</p>
                <p className="text-[10px] text-slate-500">Staf Administrasi Sarpras</p>
              </div>

              <div className="text-center w-52 text-xs">
                <p>Peminjam,</p>
                <div className="h-16 flex items-center justify-center">
                  {selectedLoanForPrint.tandaTanganUrl ? (
                    <img src={selectedLoanForPrint.tandaTanganUrl} alt="TTD" className="h-14 object-contain" />
                  ) : (
                    <span className="text-slate-400 italic text-[10px]">[ Tanda Tangan ]</span>
                  )}
                </div>
                <p className="font-bold underline">{selectedLoanForPrint.namaPeminjam}</p>
                <p className="text-[10px] text-slate-500">{selectedLoanForPrint.identitasPeminjam}</p>
              </div>
            </div>
          </div>
        </PrintModal>
      )}

      {/* PRINT: REGISTER BUKU PINJAM LENGKAP */}
      {isPrintRegisterOpen && (
        <PrintModal
          isOpen={isPrintRegisterOpen}
          onClose={() => setIsPrintRegisterOpen(false)}
          title="Buku Register Peminjaman Alat Sekolah"
          documentNumber="REG-PINJAM / SMPN2KTS / 2026"
        >
          <div className="space-y-4 text-xs font-sans text-slate-900">
            <div className="text-center my-2 border-b-2 border-slate-900 pb-2">
              <h3 className="text-base font-bold uppercase tracking-wider">
                BUKU REGISTER PEMINJAMAN ALAT LABORATORIUM & SARANA PRASARANA
              </h3>
              <p className="text-xs text-slate-600">
                SMP NEGERI 2 KUTASARI — TAHUN AJARAN 2026/2027
              </p>
            </div>

            <table className="w-full text-[10px] border border-slate-400 border-collapse">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-slate-400 text-center">
                  <th className="border border-slate-400 p-1.5 w-8">No</th>
                  <th className="border border-slate-400 p-1.5">No. Register</th>
                  <th className="border border-slate-400 p-1.5">Tgl Pinjam</th>
                  <th className="border border-slate-400 p-1.5">Nama Peminjam</th>
                  <th className="border border-slate-400 p-1.5">Nama & Jumlah Alat</th>
                  <th className="border border-slate-400 p-1.5">Keperluan</th>
                  <th className="border border-slate-400 p-1.5">Tgl Kembali</th>
                  <th className="border border-slate-400 p-1.5">Kondisi Akhir</th>
                  <th className="border border-slate-400 p-1.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan, idx) => (
                  <tr key={loan.id} className="border-b border-slate-300">
                    <td className="border border-slate-400 p-1.5 text-center font-mono">{idx + 1}</td>
                    <td className="border border-slate-400 p-1.5 font-mono font-bold">{loan.nomorPinjam}</td>
                    <td className="border border-slate-400 p-1.5 font-mono text-center">{loan.tanggalPinjam}</td>
                    <td className="border border-slate-400 p-1.5 font-semibold">{loan.namaPeminjam}</td>
                    <td className="border border-slate-400 p-1.5">
                      {loan.items.map(i => `${i.jumlah}x ${i.namaBarang}`).join('; ')}
                    </td>
                    <td className="border border-slate-400 p-1.5">{loan.keperluan}</td>
                    <td className="border border-slate-400 p-1.5 font-mono text-center">{loan.tanggalKembali || '-'}</td>
                    <td className="border border-slate-400 p-1.5 text-center">{loan.kondisiKembali || '-'}</td>
                    <td className="border border-slate-400 p-1.5 text-center font-bold">{loan.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-8 flex justify-between">
              <div className="text-center w-52 text-xs">
                <p>Mengetahui,</p>
                <p className="font-semibold">Kepala Sekolah,</p>
                <div className="h-16" />
                <p className="font-bold underline">{school.kepalaSekolah}</p>
                <p className="font-mono text-[10px]">NIP. {school.nipKepalaSekolah}</p>
              </div>

              <div className="text-center w-52 text-xs">
                <p>Kutasari, 20 September 2026</p>
                <p className="font-semibold">Pengelola Sarpras / Laboran,</p>
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
