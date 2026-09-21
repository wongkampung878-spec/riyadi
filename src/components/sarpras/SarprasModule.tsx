import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  Plus, 
  Printer, 
  Edit3, 
  Trash2, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Download, 
  X,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InventoryItem } from '../../types';
import { PrintModal } from '../common/PrintModal';

export const SarprasModule: React.FC = () => {
  const { 
    inventory, 
    addInventory, 
    updateInventory, 
    deleteInventory, 
    school 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'buku_inventaris' | 'kir' | 'rekap_aset'>('buku_inventaris');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('semua');
  const [conditionFilter, setConditionFilter] = useState('semua');
  const [loanableFilter, setLoanableFilter] = useState('semua');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Print
  const [isPrintKIR, setIsPrintKIR] = useState(false);
  const [kirRoom, setKirRoom] = useState('Lab Komputer 1');

  // Form State
  const initialForm: Omit<InventoryItem, 'id'> = {
    kodeBarang: `SAR-${Math.floor(Math.random() * 899 + 100)}`,
    nama: '',
    kategori: 'TIK & Multimedia',
    merkDanTipe: '',
    tahunPerolehan: 2024,
    sumberDana: 'BOS Reguler',
    jumlahTotal: 1,
    jumlahTersedia: 1,
    satuan: 'Unit',
    kondisi: 'Baik',
    lokasiRuang: 'Lab Komputer 1',
    dapatDipinjamkan: true,
    keterangan: ''
  };
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>(initialForm);

  // Filter list
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.merkDanTipe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lokasiRuang.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLoc = locationFilter === 'semua' || item.lokasiRuang === locationFilter;
    const matchesCond = conditionFilter === 'semua' || item.kondisi === conditionFilter;
    const matchesLoan = loanableFilter === 'semua' || 
      (loanableFilter === 'bisa' ? item.dapatDipinjamkan : !item.dapatDipinjamkan);

    return matchesSearch && matchesLoc && matchesCond && matchesLoan;
  });

  const handleOpenModal = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.kodeBarang) {
      alert('Nama barang dan kode inventaris wajib diisi!');
      return;
    }

    if (editingItem) {
      updateInventory(editingItem.id, formData);
    } else {
      addInventory({
        ...formData,
        jumlahTersedia: formData.jumlahTotal
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus aset "${name}" dari Buku Inventaris?`)) {
      deleteInventory(id);
    }
  };

  // Distinct rooms
  const allRooms = Array.from(new Set(inventory.map(i => i.lokasiRuang))).sort();

  return (
    <div className="space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-purple-700" />
            Sarana & Prasarana Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Buku Inventaris Barang, Kartu Inventaris Ruangan (KIR), Kondisi Aset, dan Integrasi Peminjaman.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('buku_inventaris')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'buku_inventaris' ? 'bg-white text-purple-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Buku Inventaris Barang
          </button>
          <button
            onClick={() => setActiveTab('kir')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'kir' ? 'bg-white text-purple-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kartu Inventaris Ruangan (KIR)
          </button>
          <button
            onClick={() => setActiveTab('rekap_aset')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'rekap_aset' ? 'bg-white text-purple-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rekap Kondisi & Aset
          </button>
        </div>
      </div>

      {/* TAB 1: BUKU INVENTARIS BARANG */}
      {activeTab === 'buku_inventaris' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari kode, nama barang, merk, ruang..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-purple-600 cursor-pointer"
              >
                <option value="semua">Semua Ruangan</option>
                {allRooms.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-purple-600 cursor-pointer"
              >
                <option value="semua">Semua Kondisi</option>
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>

              <select
                value={loanableFilter}
                onChange={(e) => setLoanableFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:border-purple-600 cursor-pointer"
              >
                <option value="semua">Status Peminjaman</option>
                <option value="bisa">Bisa Dipinjamkan</option>
                <option value="tidak">Tidak Dipinjamkan</option>
              </select>
            </div>

            <button
              onClick={() => handleOpenModal()}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-600 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              Tambah Barang Sarpras
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                    <th className="py-3 px-4">Kode Aset</th>
                    <th className="py-3 px-4">Nama Barang & Merk</th>
                    <th className="py-3 px-4">Kategori & Sumber</th>
                    <th className="py-3 px-4">Lokasi Ruang</th>
                    <th className="py-3 px-4 text-center">Stok (Tersedia / Total)</th>
                    <th className="py-3 px-4">Kondisi Fisik</th>
                    <th className="py-3 px-4">Status Pinjam</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {item.kodeBarang}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-purple-950 block">{item.nama}</span>
                        <span className="text-[11px] text-slate-500">{item.merkDanTipe} ({item.tahunPerolehan})</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-800 block">{item.kategori}</span>
                        <span className="text-[10px] text-slate-500">{item.sumberDana}</span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {item.lokasiRuang}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-mono font-bold text-sm ${
                          item.jumlahTersedia === 0 ? 'text-red-600' : 'text-slate-900'
                        }`}>
                          {item.jumlahTersedia}
                        </span>
                        <span className="text-slate-400 font-mono text-xs"> / {item.jumlahTotal}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-800' :
                          item.kondisi === 'Rusak Ringan' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.kondisi}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {item.dapatDipinjamkan ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                            Bisa Dipinjam
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400">
                            Khusus Ruangan
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded cursor-pointer"
                            title="Edit Barang"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.nama)}
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded cursor-pointer"
                            title="Hapus Barang"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Menampilkan {filteredInventory.length} dari {inventory.length} item inventaris</span>
              <span>Total unit terdaftar: {inventory.reduce((a, b) => a + b.jumlahTotal, 0)} unit</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KARTU INVENTARIS RUANGAN (KIR) */}
      {activeTab === 'kir' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Kartu Inventaris Ruangan (KIR)</h3>
              <p className="text-xs text-slate-500">Daftar sarana dan barang inventaris yang ditempatkan pada masing-masing ruangan.</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={kirRoom}
                onChange={(e) => setKirRoom(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-800 cursor-pointer"
              >
                {allRooms.map(r => (
                  <option key={r} value={r}>Ruang: {r}</option>
                ))}
              </select>

              <button
                onClick={() => setIsPrintKIR(true)}
                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Lembar KIR
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wide text-slate-800">
                Daftar Barang di Ruangan: {kirRoom}
              </span>
              <span className="text-xs text-slate-500">
                {inventory.filter(i => i.lokasiRuang === kirRoom).length} Macam Barang
              </span>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-semibold text-[11px]">
                  <th className="py-2.5 px-4">No</th>
                  <th className="py-2.5 px-4">Kode Barang</th>
                  <th className="py-2.5 px-4">Nama Barang</th>
                  <th className="py-2.5 px-4">Merk / Model</th>
                  <th className="py-2.5 px-4">Tahun</th>
                  <th className="py-2.5 px-4 text-center">Jumlah</th>
                  <th className="py-2.5 px-4">Kondisi</th>
                  <th className="py-2.5 px-4">Sumber Dana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.filter(i => i.lokasiRuang === kirRoom).map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{item.kodeBarang}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{item.nama}</td>
                    <td className="py-2.5 px-4 text-slate-600">{item.merkDanTipe}</td>
                    <td className="py-2.5 px-4 text-slate-600">{item.tahunPerolehan}</td>
                    <td className="py-2.5 px-4 text-center font-bold">{item.jumlahTotal}</td>
                    <td className="py-2.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-800' :
                        item.kondisi === 'Rusak Ringan' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.kondisi}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{item.sumberDana}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REKAP KONDISI & ASET */}
      {activeTab === 'rekap_aset' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-xs font-semibold text-emerald-700">Kondisi Baik</span>
              <p className="text-2xl font-bold text-emerald-950 mt-1">
                {inventory.filter(i => i.kondisi === 'Baik').reduce((a, b) => a + b.jumlahTotal, 0)} Unit
              </p>
              <p className="text-[11px] text-emerald-700 mt-1">
                {inventory.filter(i => i.kondisi === 'Baik').length} item jenis barang
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-xs font-semibold text-amber-700">Rusak Ringan</span>
              <p className="text-2xl font-bold text-amber-950 mt-1">
                {inventory.filter(i => i.kondisi === 'Rusak Ringan').reduce((a, b) => a + b.jumlahTotal, 0)} Unit
              </p>
              <p className="text-[11px] text-amber-700 mt-1">Perlu pemeliharaan / servis</p>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <span className="text-xs font-semibold text-red-700">Rusak Berat (Usul Hapus)</span>
              <p className="text-2xl font-bold text-red-950 mt-1">
                {inventory.filter(i => i.kondisi === 'Rusak Berat').reduce((a, b) => a + b.jumlahTotal, 0)} Unit
              </p>
              <p className="text-[11px] text-red-700 mt-1">Siap diajukan SK Penghapusan Aset</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm mb-3">Daftar Barang yang Memerlukan Perbaikan / Penghapusan</h4>
            <div className="divide-y divide-slate-100 text-xs">
              {inventory.filter(i => i.kondisi !== 'Baik').map(item => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-900 mr-2">{item.kodeBarang}</span>
                    <span className="font-semibold text-slate-900">{item.nama} ({item.merkDanTipe})</span>
                    <span className="text-slate-500 block text-[11px]">Ruang: {item.lokasiRuang} • Sumber: {item.sumberDana}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.kondisi === 'Rusak Ringan' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.kondisi} ({item.jumlahTotal} unit)
                    </span>
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="px-2 py-1 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 rounded font-semibold cursor-pointer"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INPUT / EDIT BARANG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Boxes className="w-5 h-5 text-purple-400" />
                {editingItem ? 'Edit Barang Inventaris' : 'Tambah Barang Inventaris Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kode Inventaris *</label>
                  <input
                    type="text"
                    required
                    value={formData.kodeBarang}
                    onChange={(e) => setFormData({ ...formData, kodeBarang: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                  >
                    <option value="Alat Lab IPA">Alat Lab IPA</option>
                    <option value="TIK & Multimedia">TIK & Multimedia</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Kesenian">Kesenian</option>
                    <option value="Audio Sound">Audio Sound</option>
                    <option value="Kebersihan">Kebersihan</option>
                    <option value="Mebel & Kantor">Mebel & Kantor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Barang *</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                  placeholder="Contoh: Proyektor LCD Epson"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Merk / Tipe</label>
                  <input
                    type="text"
                    value={formData.merkDanTipe}
                    onChange={(e) => setFormData({ ...formData, merkDanTipe: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tahun Perolehan</label>
                  <input
                    type="number"
                    value={formData.tahunPerolehan}
                    onChange={(e) => setFormData({ ...formData, tahunPerolehan: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jumlah Unit</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.jumlahTotal}
                    onChange={(e) => setFormData({ ...formData, jumlahTotal: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kondisi</label>
                  <select
                    value={formData.kondisi}
                    onChange={(e) => setFormData({ ...formData, kondisi: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sumber Dana</label>
                  <select
                    value={formData.sumberDana}
                    onChange={(e) => setFormData({ ...formData, sumberDana: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                  >
                    <option value="BOS Reguler">BOS Reguler</option>
                    <option value="BOS Kinerja">BOS Kinerja</option>
                    <option value="BOS Afirmasi">BOS Afirmasi</option>
                    <option value="DAK">DAK</option>
                    <option value="Komite">Komite</option>
                    <option value="Hibah/Lainnya">Hibah/Lainnya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lokasi Ruang</label>
                  <input
                    type="text"
                    required
                    value={formData.lokasiRuang}
                    onChange={(e) => setFormData({ ...formData, lokasiRuang: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600"
                    placeholder="Lab IPA / Lab Komputer"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dapatDipinjamkan}
                      onChange={(e) => setFormData({ ...formData, dapatDipinjamkan: e.target.checked })}
                      className="rounded text-purple-600"
                    />
                    <span className="font-semibold text-slate-800">Dapat Dipinjamkan untuk KBM</span>
                  </label>
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
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Simpan Barang Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT: KARTU INVENTARIS RUANGAN (KIR) */}
      {isPrintKIR && (
        <PrintModal
          isOpen={isPrintKIR}
          onClose={() => setIsPrintKIR(false)}
          title={`Kartu Inventaris Ruangan (KIR) — ${kirRoom}`}
          documentNumber={`KIR / 2026 / ${kirRoom.replace(/\s+/g, '-')}`}
        >
          <div className="space-y-4 text-xs font-sans text-slate-900">
            <div className="text-center my-2 border-b-2 border-slate-900 pb-2">
              <h3 className="text-base font-bold uppercase tracking-wider">
                KARTU INVENTARIS RUANGAN (KIR)
              </h3>
              <p className="font-bold text-sm text-slate-800 mt-0.5 uppercase">
                RUANGAN : {kirRoom}
              </p>
              <p className="text-[11px] text-slate-600">
                SMP NEGERI 2 KUTASARI — TAHUN ANGGARAN 2026
              </p>
            </div>

            <table className="w-full text-xs border border-slate-400 border-collapse">
              <thead>
                <tr className="bg-slate-100 font-bold border-b border-slate-400 text-center">
                  <th className="border border-slate-400 p-2">No</th>
                  <th className="border border-slate-400 p-2">Kode Barang</th>
                  <th className="border border-slate-400 p-2">Nama Barang / Jenis</th>
                  <th className="border border-slate-400 p-2">Merk / Model</th>
                  <th className="border border-slate-400 p-2">Tahun</th>
                  <th className="border border-slate-400 p-2">Jml Unit</th>
                  <th className="border border-slate-400 p-2">Keadaan Barang</th>
                  <th className="border border-slate-400 p-2">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {inventory.filter(i => i.lokasiRuang === kirRoom).map((item, idx) => (
                  <tr key={item.id} className="border-b border-slate-300">
                    <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                    <td className="border border-slate-400 p-2 font-mono font-bold">{item.kodeBarang}</td>
                    <td className="border border-slate-400 p-2 font-semibold">{item.nama}</td>
                    <td className="border border-slate-400 p-2">{item.merkDanTipe}</td>
                    <td className="border border-slate-400 p-2 text-center">{item.tahunPerolehan}</td>
                    <td className="border border-slate-400 p-2 text-center font-bold">{item.jumlahTotal}</td>
                    <td className="border border-slate-400 p-2 text-center font-semibold">{item.kondisi}</td>
                    <td className="border border-slate-400 p-2">{item.sumberDana}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-8 flex justify-between">
              <div className="text-center w-56 text-xs">
                <p>Mengetahui,</p>
                <p className="font-semibold">Kepala Sekolah,</p>
                <div className="h-16" />
                <p className="font-bold underline">{school.kepalaSekolah}</p>
                <p className="font-mono text-[10px]">NIP. {school.nipKepalaSekolah}</p>
              </div>

              <div className="text-center w-56 text-xs">
                <p>Kutasari, 20 September 2026</p>
                <p className="font-semibold">Pengurus Barang / Petugas Ruang,</p>
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
