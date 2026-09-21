import React, { useState } from 'react';
import { 
  Wallet, 
  Search, 
  Plus, 
  Printer, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  FileText, 
  Building, 
  TrendingUp, 
  PieChart as PieIcon, 
  Trash2, 
  X,
  CreditCard,
  Percent
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CashTransaction, CashFlowType } from '../../types';
import { PrintModal } from '../common/PrintModal';

export const KeuanganModule: React.FC = () => {
  const { 
    cashTransactions, 
    addCashTransaction, 
    deleteCashTransaction, 
    school,
    currentUser 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bku' | 'buku_pembantu' | 'realisasi_bos'>('bku');
  const [searchTerm, setSearchTerm] = useState('');
  const [sumberDanaFilter, setSumberDanaFilter] = useState('semua');
  const [jenisFilter, setJenisFilter] = useState('semua');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isKuitansiPrintOpen, setIsKuitansiPrintOpen] = useState(false);
  const [selectedTxForKuitansi, setSelectedTxForKuitansi] = useState<CashTransaction | null>(null);
  const [isPrintBKUOpen, setIsPrintBKUOpen] = useState(false);

  // Form State
  const initialForm: Omit<CashTransaction, 'id' | 'saldoSetelahnya'> = {
    nomorBukti: `BPU/${new Date().getFullYear()}/${String(cashTransactions.length + 1).padStart(3, '0')}`,
    tanggal: new Date().toISOString().split('T')[0],
    uraian: '',
    kodeRekening: '5.1.02.01.01',
    jenis: 'Pengeluaran',
    komponenAnggaran: 'Belanja Barang/Jasa',
    sumberDana: 'BOS Reguler',
    nominal: 500000,
    notaFile: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // Calculated totals
  const totalPenerimaan = cashTransactions
    .filter(f => f.jenis === 'Penerimaan')
    .reduce((sum, f) => sum + f.nominal, 0);

  const totalPengeluaran = cashTransactions
    .filter(f => f.jenis === 'Pengeluaran')
    .reduce((sum, f) => sum + f.nominal, 0);

  const saldoKasAkhir = totalPenerimaan - totalPengeluaran;

  // Filter list
  const filteredFinances = cashTransactions.filter((tx: CashTransaction) => {
    const matchesSearch = 
      tx.nomorBukti.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.uraian.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.kodeRekening.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSumber = sumberDanaFilter === 'semua' || tx.sumberDana === sumberDanaFilter;
    const matchesJenis = jenisFilter === 'semua' || tx.jenis === jenisFilter;

    return matchesSearch && matchesSumber && matchesJenis;
  });

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.uraian || formData.nominal <= 0) {
      alert('Uraian transaksi dan nominal valid wajib diisi!');
      return;
    }

    addCashTransaction(formData);
    setIsModalOpen(false);
    setFormData(initialForm);
    alert('Transaksi berhasil dibukukan ke dalam Buku Kas Umum (BKU)!');
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-teal-800" />
            Administrasi Keuangan & Kas Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Buku Kas Umum (BKU), Buku Pembantu Kas & Bank, Realisasi Anggaran BOS, dan Cetak Kuitansi Resmi.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('bku')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bku' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Buku Kas Umum (BKU)</span>
          </button>

          <button
            onClick={() => setActiveTab('buku_pembantu')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'buku_pembantu' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Buku Pembantu Kas / Bank</span>
          </button>

          <button
            onClick={() => setActiveTab('realisasi_bos')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'realisasi_bos' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Realisasi BOS</span>
          </button>
        </div>
      </div>

      {/* SUMMARY BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Penerimaan Kas</span>
            <p className="text-xl font-bold text-emerald-700 mt-0.5">{formatRupiah(totalPenerimaan)}</p>
            <span className="text-[10px] text-slate-400">Termasuk BOS Tahap 1 & Komite</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0 border border-red-100">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Belanja / Realisasi</span>
            <p className="text-xl font-bold text-red-700 mt-0.5">{formatRupiah(totalPengeluaran)}</p>
            <span className="text-[10px] text-slate-400">{cashTransactions.filter(f => f.jenis === 'Pengeluaran').length} Bukti Pengeluaran Kas</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sisa Saldo Kas Terakhir</span>
            <p className="text-xl font-bold text-teal-900 mt-0.5">{formatRupiah(saldoKasAkhir)}</p>
            <span className="text-[10px] text-teal-700 font-semibold">Tersimpan di Bank & Brankas Sekolah</span>
          </div>
        </div>
      </div>

      {/* SEARCH & ACTION BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari uraian transaksi, no. bukti, kode rekening..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-600 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={sumberDanaFilter}
            onChange={(e) => setSumberDanaFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold"
          >
            <option value="semua">Semua Sumber Dana</option>
            <option value="BOS Reguler">BOS Reguler</option>
            <option value="BOS Kinerja">BOS Kinerja</option>
            <option value="Dana Komite">Dana Komite</option>
          </select>

          <select
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold"
          >
            <option value="semua">Semua Arus Kas</option>
            <option value="Penerimaan">Penerimaan (+)</option>
            <option value="Pengeluaran">Pengeluaran (-)</option>
          </select>

          <button
            onClick={() => setIsPrintBKUOpen(true)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak BKU
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-600 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Catat Transaksi Kas
          </button>
        </div>
      </div>

      {/* TAB 1: BUKU KAS UMUM (BKU) */}
      {activeTab === 'bku' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3">No. Bukti / Rekening</th>
                  <th className="py-3 px-4">Uraian Transaksi</th>
                  <th className="py-3 px-3">Sumber Dana</th>
                  <th className="py-3 px-3 text-right">Penerimaan (Rp)</th>
                  <th className="py-3 px-3 text-right">Pengeluaran (Rp)</th>
                  <th className="py-3 px-3 text-right">Saldo Kas (Rp)</th>
                  <th className="py-3 px-3 text-center">Kuitansi</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFinances.map((tx: CashTransaction) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{tx.tanggal}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-900 block">{tx.nomorBukti}</span>
                      <span className="font-mono text-[10px] text-slate-400">{tx.kodeRekening}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-medium text-slate-900 block">{tx.uraian}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{tx.komponenAnggaran}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {tx.sumberDana}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-700">
                      {tx.jenis === 'Penerimaan' ? formatRupiah(tx.nominal) : '-'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-red-700">
                      {tx.jenis === 'Pengeluaran' ? formatRupiah(tx.nominal) : '-'}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {formatRupiah(tx.saldoSetelahnya)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedTxForKuitansi(tx);
                          setIsKuitansiPrintOpen(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded cursor-pointer"
                        title="Cetak Kuitansi Resmi"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm('Hapus transaksi ini dari BKU?')) {
                            deleteCashTransaction(tx.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded cursor-pointer"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BUKU PEMBANTU */}
      {activeTab === 'buku_pembantu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-700" />
              Buku Pembantu Kas Tunai
            </h3>
            <p className="text-xs text-slate-500">Mencatat seluruh arus uang tunai yang berada di bendahara / brankas sekolah.</p>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="text-[11px] text-emerald-800 font-semibold">Estimasi Saldo Tunai di Brankas:</span>
              <p className="text-lg font-bold text-emerald-900 font-mono mt-0.5">{formatRupiah(saldoKasAkhir * 0.25)}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-700" />
              Buku Pembantu Bank (BPD Jateng)
            </h3>
            <p className="text-xs text-slate-500">Mencatat transaksi transfer Giro Rekening Resmi SMP Negeri 2 Kutasari.</p>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-[11px] text-blue-800 font-semibold">Estimasi Saldo Rekening Giro:</span>
              <p className="text-lg font-bold text-blue-900 font-mono mt-0.5">{formatRupiah(saldoKasAkhir * 0.75)}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REALISASI BOS */}
      {activeTab === 'realisasi_bos' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Laporan Realisasi Komponen Penggunaan Dana BOS Reguler</h3>
            <p className="text-slate-500 text-xs">Sesuai Juknis BOS Kemendikbudristek untuk pelaporan ke Dinas Pendidikan.</p>
          </div>

          <div className="space-y-4">
            {[
              { nama: 'Pengembangan Sarana dan Prasarana Sekolah', persen: 32, realisasi: 38400000 },
              { nama: 'Kegiatan Pembelajaran dan Ekstrakurikuler', persen: 24, realisasi: 28800000 },
              { nama: 'Penyediaan Alat Multi Media & Pembelajaran', persen: 20, realisasi: 24000000 },
              { nama: 'Pemeliharaan Sarana dan Prasarana Sekolah', persen: 14, realisasi: 16800000 },
              { nama: 'Pembayaran Honor Guru & Tenaga Kependidikan', persen: 10, realisasi: 12000000 },
            ].map(item => (
              <div key={item.nama} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">{item.nama}</span>
                  <span className="font-bold text-slate-900 font-mono">{formatRupiah(item.realisasi)} ({item.persen}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${item.persen}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: INPUT TRANSAKSI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Wallet className="w-5 h-5 text-teal-400" />
                Catat Transaksi Kas & SPJ
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nomor Bukti Kas *</label>
                  <input
                    type="text"
                    required
                    value={formData.nomorBukti}
                    onChange={(e) => setFormData({ ...formData, nomorBukti: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Uraian Transaksi Kas *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.uraian}
                  onChange={(e) => setFormData({ ...formData, uraian: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  placeholder="Pembelian ATK administrasi TU semester ganjil..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jenis Arus Kas</label>
                  <select
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value as CashFlowType })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600 font-semibold"
                  >
                    <option value="Pengeluaran">Pengeluaran Kas (-)</option>
                    <option value="Penerimaan">Penerimaan Kas (+)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nominal (Rp) *</label>
                  <input
                    type="number"
                    min={1000}
                    required
                    value={formData.nominal}
                    onChange={(e) => setFormData({ ...formData, nominal: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sumber Dana</label>
                  <select
                    value={formData.sumberDana}
                    onChange={(e) => setFormData({ ...formData, sumberDana: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  >
                    <option value="BOS Reguler">BOS Reguler</option>
                    <option value="BOS Kinerja">BOS Kinerja</option>
                    <option value="Dana Komite">Dana Komite</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Komponen Anggaran</label>
                  <select
                    value={formData.komponenAnggaran}
                    onChange={(e) => setFormData({ ...formData, komponenAnggaran: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  >
                    <option value="Belanja Barang/Jasa">Belanja Barang/Jasa</option>
                    <option value="Pemeliharaan Sarpras">Pemeliharaan Sarpras</option>
                    <option value="Gaji/Honor">Gaji/Honor</option>
                    <option value="Kegiatan Kesiswaan">Kegiatan Kesiswaan</option>
                    <option value="Peralatan/Modal">Peralatan/Modal</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Transaksi Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT MODAL: KUITANSI RESMI */}
      {isKuitansiPrintOpen && selectedTxForKuitansi && (
        <PrintModal
          isOpen={true}
          onClose={() => setIsKuitansiPrintOpen(false)}
          title="Kuitansi Pembayaran Resmi"
          documentNumber={selectedTxForKuitansi.nomorBukti}
        >
          <div className="space-y-4 text-xs font-sans text-slate-900">
            <div className="text-center my-2 border-b-2 border-slate-900 pb-2">
              <h3 className="text-base font-bold uppercase tracking-wider">
                KUITANSI / BUKTI PEMBAYARAN KAS
              </h3>
              <p className="text-xs font-mono">Nomor: {selectedTxForKuitansi.nomorBukti}</p>
            </div>

            <table className="w-full text-xs border border-slate-400 border-collapse mb-4">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-40 p-2.5 bg-slate-50 font-bold border-r border-slate-300">Telah Terima Dari</td>
                  <td className="p-2.5 font-semibold">Bendahara SMP Negeri 2 Kutasari</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2.5 bg-slate-50 font-bold border-r border-slate-300">Uang Sejumlah</td>
                  <td className="p-2.5 font-mono font-bold text-sm bg-slate-50 text-blue-950">
                    {formatRupiah(selectedTxForKuitansi.nominal)}
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2.5 bg-slate-50 font-bold border-r border-slate-300">Untuk Pembayaran</td>
                  <td className="p-2.5">{selectedTxForKuitansi.uraian}</td>
                </tr>
                <tr>
                  <td className="p-2.5 bg-slate-50 font-bold border-r border-slate-300">Beban Anggaran</td>
                  <td className="p-2.5 font-mono">{selectedTxForKuitansi.sumberDana} (Rekening: {selectedTxForKuitansi.kodeRekening})</td>
                </tr>
              </tbody>
            </table>

            <div className="pt-8 flex justify-between">
              <div className="text-center w-52 text-xs">
                <p>Setuju Dibayar,</p>
                <p className="font-semibold">Kepala SMP Negeri 2 Kutasari,</p>
                <div className="h-16" />
                <p className="font-bold underline">{school.kepalaSekolah}</p>
                <p className="font-mono text-[10px]">NIP. {school.nipKepalaSekolah}</p>
              </div>

              <div className="text-center w-52 text-xs">
                <p>Lunas Dibayar Tgl {selectedTxForKuitansi.tanggal},</p>
                <p className="font-semibold">Bendahara Sekolah,</p>
                <div className="h-16" />
                <p className="font-bold underline">{school.kepalaTu}</p>
                <p className="font-mono text-[10px]">NIP. {school.nipKepalaTu}</p>
              </div>
            </div>
          </div>
        </PrintModal>
      )}

      {/* PRINT MODAL: BUKU KAS UMUM (BKU) */}
      {isPrintBKUOpen && (
        <PrintModal
          isOpen={true}
          onClose={() => setIsPrintBKUOpen(false)}
          title="Buku Kas Umum (BKU)"
          documentNumber={`BKU / SMPN2KTS / ${new Date().getFullYear()}`}
        >
          <div className="space-y-4 text-xs font-sans text-slate-900">
            <div className="text-center my-2 border-b-2 border-slate-900 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider">
                BUKU KAS UMUM (BKU) BULANAN
              </h3>
              <p className="text-xs text-slate-600">SUMBER DANA: BOS REGULER & KOMITE</p>
            </div>

            <table className="w-full text-[10px] border border-slate-400 border-collapse">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-slate-400 text-center">
                  <th className="border border-slate-400 p-1.5 w-16">Tanggal</th>
                  <th className="border border-slate-400 p-1.5 w-24">No. Bukti</th>
                  <th className="border border-slate-400 p-1.5">Uraian Transaksi</th>
                  <th className="border border-slate-400 p-1.5 w-24">Penerimaan (Rp)</th>
                  <th className="border border-slate-400 p-1.5 w-24">Pengeluaran (Rp)</th>
                  <th className="border border-slate-400 p-1.5 w-28">Saldo Kas (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {cashTransactions.map(tx => (
                  <tr key={tx.id} className="border-b border-slate-300">
                    <td className="border border-slate-400 p-1 font-mono text-center">{tx.tanggal}</td>
                    <td className="border border-slate-400 p-1 font-mono">{tx.nomorBukti}</td>
                    <td className="border border-slate-400 p-1">{tx.uraian}</td>
                    <td className="border border-slate-400 p-1 font-mono text-right">{tx.jenis === 'Penerimaan' ? formatRupiah(tx.nominal) : '-'}</td>
                    <td className="border border-slate-400 p-1 font-mono text-right">{tx.jenis === 'Pengeluaran' ? formatRupiah(tx.nominal) : '-'}</td>
                    <td className="border border-slate-400 p-1 font-mono text-right font-bold">{formatRupiah(tx.saldoSetelahnya)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

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
                <p className="font-semibold">Bendahara Sekolah,</p>
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
