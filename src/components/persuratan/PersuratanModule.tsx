import React, { useState } from 'react';
import { 
  Mail, 
  Search, 
  Plus, 
  Printer, 
  Edit3, 
  Trash2, 
  Send, 
  Inbox, 
  FileText, 
  CheckCircle2, 
  Clock, 
  X,
  FileCheck,
  Building,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IncomingLetter, OutgoingLetter, ExpeditionEntry, LetterNature } from '../../types';
import { PrintModal } from '../common/PrintModal';

const standardClassifications = [
  { kode: '421', nama: 'Pendidikan', keterangan: 'Urusan umum bidang pendidikan' },
  { kode: '421.1', nama: 'Pendidikan Dasar', keterangan: 'Jenjang SD dan SMP' },
  { kode: '421.2', nama: 'Sekolah Menengah Pertama', keterangan: 'Pengelolaan internal SMP' },
  { kode: '421.3', nama: 'Kesiswaan & Kurikulum', keterangan: 'Kegiatan siswa, kalender pendidikan, kelulusan' },
  { kode: '421.4', nama: 'Ketenagaan / GTK', keterangan: 'Urusan guru dan tenaga kependidikan' },
  { kode: '421.5', nama: 'Sarana & Prasarana', keterangan: 'Gedung, aset, laboratorium, perpustakaan' },
  { kode: '005', nama: 'Undangan Kedinasan', keterangan: 'Surat undangan pertemuan / rapat kedinasan' },
  { kode: '800', nama: 'Kepegawaian Dinas', keterangan: 'KGB, mutasi, SK tugas, cuti pegawai' },
  { kode: '900', nama: 'Keuangan & Kas', keterangan: 'SPJ, BOS, buku kas umum, pajak' },
  { kode: 'lainnya', nama: 'Lainnya (diisi manual)', keterangan: 'Kode klasifikasi khusus dinas / input manual bebas (contoh: 028 aset, 090 humas, 180 hukum)' },
];

export const PersuratanModule: React.FC = () => {
  const { 
    incomingLetters, 
    addIncomingLetter, 
    updateIncomingLetter, 
    deleteIncomingLetter,
    updateDisposisi,
    outgoingLetters,
    addOutgoingLetter,
    updateOutgoingLetter,
    deleteOutgoingLetter,
    expeditions,
    addExpedition,
    currentUser,
    school
  } = useApp();

  const [activeTab, setActiveTab] = useState<'surat_masuk' | 'surat_keluar' | 'buku_ekspedisi' | 'klasifikasi'>('surat_masuk');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isIncomingModalOpen, setIsIncomingModalOpen] = useState(false);
  const [editingIncoming, setEditingIncoming] = useState<IncomingLetter | null>(null);

  const [isOutgoingModalOpen, setIsOutgoingModalOpen] = useState(false);
  const [editingOutgoing, setEditingOutgoing] = useState<OutgoingLetter | null>(null);
  const [isManualClassification, setIsManualClassification] = useState(false);
  const [manualClassificationCode, setManualClassificationCode] = useState('');

  const [isDisposisiModalOpen, setIsDisposisiModalOpen] = useState(false);
  const [selectedLetterForDisposisi, setSelectedLetterForDisposisi] = useState<IncomingLetter | null>(null);

  const [isExpeditionModalOpen, setIsExpeditionModalOpen] = useState(false);

  // Print Modals
  const [printDocType, setPrintDocType] = useState<'lembar_disposisi' | 'surat_keluar' | null>(null);
  const [selectedIncomingForPrint, setSelectedIncomingForPrint] = useState<IncomingLetter | null>(null);
  const [selectedOutgoingForPrint, setSelectedOutgoingForPrint] = useState<OutgoingLetter | null>(null);

  // Form: Surat Masuk
  const initialIncomingForm: Omit<IncomingLetter, 'id'> = {
    noAgenda: `AGD-${new Date().getFullYear()}-${String(incomingLetters.length + 1).padStart(3, '0')}`,
    tanggalTerima: new Date().toISOString().split('T')[0],
    tanggalSurat: new Date().toISOString().split('T')[0],
    nomorSurat: '',
    asalSurat: '',
    perihal: '',
    sifat: 'biasa',
    ringkasanIsi: '',
    fileAttachment: ''
  };
  const [incomingForm, setIncomingForm] = useState<Omit<IncomingLetter, 'id'>>(initialIncomingForm);

  // Form: Surat Keluar
  const initialOutgoingForm: Omit<OutgoingLetter, 'id' | 'nomorSurat'> = {
    kodeKlasifikasi: '421.3',
    tanggalSurat: new Date().toISOString().split('T')[0],
    tujuan: '',
    perihal: '',
    lampiran: '1 Berkas',
    pembuat: currentUser.name,
    statusApproval: 'Disetujui',
    isiSurat: ''
  };
  const [outgoingForm, setOutgoingForm] = useState(initialOutgoingForm);

  // Form: Disposisi
  const [disposisiForm, setDisposisiForm] = useState({
    tujuan: ['Wakasek Kurikulum', 'Kepala Urusan Tata Usaha'] as string[],
    isiDisposisi: 'Tindak lanjuti segera dan koordinasikan dengan pihak terkait.',
    catatan: '',
    status: 'Proses' as 'Belum' | 'Proses' | 'Selesai'
  });

  // Form: Ekspedisi
  const [expeditionForm, setExpeditionForm] = useState({
    outgoingLetterId: '',
    nomorSurat: '',
    tanggalKirim: new Date().toISOString().split('T')[0],
    tujuan: '',
    perihal: '',
    namaPenerima: 'Petugas Pos / Ekspedisi Purbalingga',
    statusPengiriman: 'Diterima' as 'Dalam Perjalanan' | 'Diterima',
    catatan: 'Diterima dalam kondisi baik dan dicap resmi'
  });

  // Filters
  const filteredIncoming = incomingLetters.filter(l => 
    l.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.noAgenda.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.asalSurat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOutgoing = outgoingLetters.filter(l => 
    l.perihal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.tujuan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Save Incoming
  const handleSaveIncoming = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomingForm.nomorSurat || !incomingForm.asalSurat || !incomingForm.perihal) {
      alert('Nomor surat, asal surat, dan perihal wajib diisi!');
      return;
    }

    if (editingIncoming) {
      updateIncomingLetter(editingIncoming.id, incomingForm);
    } else {
      addIncomingLetter(incomingForm);
    }
    setIsIncomingModalOpen(false);
  };

  // Handle Save Outgoing
  const handleSaveOutgoing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outgoingForm.tujuan || !outgoingForm.perihal) {
      alert('Tujuan dan perihal surat dinas wajib diisi!');
      return;
    }

    const finalCode = isManualClassification
      ? (manualClassificationCode.trim() || '421.3')
      : (outgoingForm.kodeKlasifikasi || '421.3');

    const letterPayload = {
      ...outgoingForm,
      kodeKlasifikasi: finalCode
    };

    if (editingOutgoing) {
      updateOutgoingLetter(editingOutgoing.id, letterPayload);
    } else {
      addOutgoingLetter(letterPayload);
    }
    setIsOutgoingModalOpen(false);
  };

  const handleOpenCreateOutgoing = () => {
    setEditingOutgoing(null);
    setOutgoingForm(initialOutgoingForm);
    setIsManualClassification(false);
    setManualClassificationCode('');
    setIsOutgoingModalOpen(true);
  };

  const handleOpenEditOutgoing = (letter: OutgoingLetter) => {
    setEditingOutgoing(letter);
    const isPredefined = standardClassifications.some(c => c.kode === letter.kodeKlasifikasi && c.kode !== 'lainnya');
    setOutgoingForm({
      kodeKlasifikasi: letter.kodeKlasifikasi || '421.3',
      tanggalSurat: letter.tanggalSurat,
      tujuan: letter.tujuan,
      perihal: letter.perihal,
      lampiran: letter.lampiran || '1 Berkas',
      pembuat: letter.pembuat,
      statusApproval: letter.statusApproval,
      isiSurat: letter.isiSurat || ''
    });
    if (!isPredefined && letter.kodeKlasifikasi) {
      setIsManualClassification(true);
      setManualClassificationCode(letter.kodeKlasifikasi);
    } else {
      setIsManualClassification(false);
      setManualClassificationCode('');
    }
    setIsOutgoingModalOpen(true);
  };

  // Handle Save Disposisi
  const handleSaveDisposisi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLetterForDisposisi) return;

    updateDisposisi(selectedLetterForDisposisi.id, {
      tanggalDisposisi: new Date().toISOString().split('T')[0],
      tujuan: disposisiForm.tujuan,
      isiDisposisi: disposisiForm.isiDisposisi,
      catatan: disposisiForm.catatan,
      status: disposisiForm.status
    });

    setIsDisposisiModalOpen(false);
  };

  const handleOpenDisposisiModal = (letter: IncomingLetter) => {
    setSelectedLetterForDisposisi(letter);
    if (letter.disposisi) {
      setDisposisiForm({
        tujuan: letter.disposisi.tujuan || [],
        isiDisposisi: letter.disposisi.isiDisposisi || 'Tindak lanjuti segera.',
        catatan: letter.disposisi.catatan || '',
        status: letter.disposisi.status || 'Proses'
      });
    } else {
      setDisposisiForm({
        tujuan: ['Kepala Urusan Tata Usaha'],
        isiDisposisi: 'Tindak lanjuti segera dan laporkan hasilnya.',
        catatan: 'Harap dikoordinasikan dengan bagian terkait.',
        status: 'Proses'
      });
    }
    setIsDisposisiModalOpen(true);
  };

  const handleSaveExpedition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expeditionForm.nomorSurat || !expeditionForm.tujuan) {
      alert('Nomor surat dan tujuan ekspedisi wajib diisi!');
      return;
    }

    addExpedition({
      outgoingLetterId: expeditionForm.outgoingLetterId || 'custom',
      tanggalKirim: expeditionForm.tanggalKirim,
      nomorSurat: expeditionForm.nomorSurat,
      perihal: expeditionForm.perihal,
      tujuan: expeditionForm.tujuan,
      namaPenerima: expeditionForm.namaPenerima,
      statusPengiriman: expeditionForm.statusPengiriman,
      catatan: expeditionForm.catatan
    });
    setIsExpeditionModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-800" />
            Persuratan & Kearsipan Kedinasan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Buku Agenda Surat Masuk, Lembar Disposisi Kepala Sekolah, Penomoran Surat Keluar Otomatis, dan Buku Ekspedisi.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('surat_masuk')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'surat_masuk' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Surat Masuk</span>
            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full text-[10px]">
              {incomingLetters.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('surat_keluar')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'surat_keluar' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Surat Keluar</span>
            <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px]">
              {outgoingLetters.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('buku_ekspedisi')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'buku_ekspedisi' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Buku Ekspedisi
          </button>

          <button
            onClick={() => setActiveTab('klasifikasi')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'klasifikasi' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kode Klasifikasi
          </button>
        </div>
      </div>

      {/* SEARCH & ACTION BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari perihal, nomor surat, nomor agenda, asal/tujuan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'surat_masuk' && (
            <button
              onClick={() => {
                setEditingIncoming(null);
                setIncomingForm(initialIncomingForm);
                setIsIncomingModalOpen(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Catat Surat Masuk
            </button>
          )}

          {activeTab === 'surat_keluar' && (
            <button
              onClick={handleOpenCreateOutgoing}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Buat Surat Keluar (Nomor Otomatis)
            </button>
          )}

          {activeTab === 'buku_ekspedisi' && (
            <button
              onClick={() => setIsExpeditionModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Catat Ekspedisi Pengiriman
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: SURAT MASUK */}
      {activeTab === 'surat_masuk' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                  <th className="py-3 px-4">No. Agenda</th>
                  <th className="py-3 px-4">Tgl Terima</th>
                  <th className="py-3 px-4">Nomor & Tgl Surat</th>
                  <th className="py-3 px-4">Asal Instansi</th>
                  <th className="py-3 px-4">Perihal & Sifat</th>
                  <th className="py-3 px-4">Disposisi Kepala Sekolah</th>
                  <th className="py-3 px-4 text-center">Cetak Disposisi</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIncoming.map(letter => (
                  <tr key={letter.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-blue-950">
                      {letter.noAgenda}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {letter.tanggalTerima}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block font-mono text-[11px]">{letter.nomorSurat}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Tgl: {letter.tanggalSurat}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {letter.asalSurat}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-semibold text-slate-900 block line-clamp-1">{letter.perihal}</span>
                      <span className={`inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                        letter.sifat === 'sangat_segera' ? 'bg-red-100 text-red-800' :
                        letter.sifat === 'segera' ? 'bg-amber-100 text-amber-800' :
                        letter.sifat === 'rahasia' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {letter.sifat.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {letter.disposisi ? (
                        <div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            letter.disposisi.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' :
                            letter.disposisi.status === 'Proses' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {letter.disposisi.status}
                          </span>
                          <span className="block text-[10px] text-slate-500 mt-0.5 truncate max-w-[160px]">
                            Kepada: {letter.disposisi.tujuan.join(', ')}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenDisposisiModal(letter)}
                          className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <FileCheck className="w-3 h-3" />
                          + Buat Disposisi
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedIncomingForPrint(letter);
                          setPrintDocType('lembar_disposisi');
                        }}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded cursor-pointer"
                        title="Cetak Lembar Disposisi Resmi"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenDisposisiModal(letter)}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded cursor-pointer"
                          title="Kelola Disposisi"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Hapus arsip surat masuk ini?')) {
                              deleteIncomingLetter(letter.id);
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded cursor-pointer"
                          title="Hapus Surat Masuk"
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
        </div>
      )}

      {/* TAB 2: SURAT KELUAR */}
      {activeTab === 'surat_keluar' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                  <th className="py-3 px-4">Nomor Surat Dinas</th>
                  <th className="py-3 px-4">Tanggal Surat</th>
                  <th className="py-3 px-4">Tujuan Surat</th>
                  <th className="py-3 px-4">Perihal</th>
                  <th className="py-3 px-4">Penandatangan</th>
                  <th className="py-3 px-4">Status Approval</th>
                  <th className="py-3 px-4 text-center">Cetak Lembar</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOutgoing.map(letter => (
                  <tr key={letter.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-blue-900">
                      {letter.nomorSurat}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{letter.tanggalSurat}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{letter.tujuan}</td>
                    <td className="py-3 px-4 max-w-xs">{letter.perihal}</td>
                    <td className="py-3 px-4 text-slate-700">{letter.pembuat}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        letter.statusApproval === 'Disetujui' ? 'bg-emerald-100 text-emerald-800' :
                        letter.statusApproval === 'Terkirim' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {letter.statusApproval}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedOutgoingForPrint(letter);
                          setPrintDocType('surat_keluar');
                        }}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded cursor-pointer"
                        title="Cetak Surat Keluar Resmi"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditOutgoing(letter)}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded cursor-pointer"
                          title="Edit Surat Keluar & Klasifikasi"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Hapus arsip surat keluar ini?')) {
                              deleteOutgoingLetter(letter.id);
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded cursor-pointer"
                          title="Hapus Surat Keluar"
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
        </div>
      )}

      {/* TAB 3: BUKU EKSPEDISI */}
      {activeTab === 'buku_ekspedisi' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Buku Ekspedisi Pengiriman Surat Keluar</h3>
              <p className="text-xs text-slate-500">Bukti serah terima surat dinas ke instansi tujuan atau kurir pos.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                  <th className="py-3 px-4">Tgl Kirim</th>
                  <th className="py-3 px-4">Nomor Surat Dinas</th>
                  <th className="py-3 px-4">Tujuan Surat</th>
                  <th className="py-3 px-4">Perihal</th>
                  <th className="py-3 px-4">Penerima / Kurir</th>
                  <th className="py-3 px-4">Status Pengiriman</th>
                  <th className="py-3 px-4">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expeditions.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono">{exp.tanggalKirim}</td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-900">{exp.nomorSurat}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{exp.tujuan}</td>
                    <td className="py-3 px-4 text-slate-700">{exp.perihal}</td>
                    <td className="py-3 px-4">{exp.namaPenerima || 'Petugas Pos'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        {exp.statusPengiriman}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{exp.catatan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: KODE KLASIFIKASI SURAT DINAS */}
      {activeTab === 'klasifikasi' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Pedoman Klasifikasi Kode Surat Dinas Pendidikan</h3>
              <p className="text-xs text-slate-500">Standar Permendagri & Tata Naskah Dinas Pemkab Purbalingga, dilengkapi opsi input manual bebas.</p>
            </div>
            <div className="text-xs bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 font-medium">
              Format Penomoran: <span className="font-mono font-bold">[Kode]/[Urut]/SMPN2KTS/[Tahun]</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {standardClassifications.map(c => {
              const isOther = c.kode === 'lainnya';
              return (
                <div 
                  key={c.kode} 
                  className={`p-3.5 rounded-xl border transition-all ${
                    isOther 
                      ? 'border-blue-300 bg-linear-to-br from-blue-50/80 to-indigo-50/50 shadow-xs ring-1 ring-blue-200' 
                      : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50'
                  } text-xs`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded ${
                      isOther ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-900'
                    }`}>
                      {isOther ? 'Bebas / Manual' : c.kode}
                    </span>
                    {isOther && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Diisi Manual
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-slate-900 mt-2.5 text-xs">{c.nama}</p>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{c.keterangan}</p>
                </div>
              );
            })}
          </div>

          {/* Panduan Kode Manual Tambahan Populer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-blue-600" />
              Contoh Referensi Kode Manual untuk Kebutuhan Khusus:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-[11px]">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="font-mono font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">028</span>
                <p className="font-semibold text-slate-800 mt-1">Perlengkapan & Aset</p>
                <p className="text-slate-500 text-[10px]">Inventarisasi, penghapusan aset, serah terima gedung</p>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="font-mono font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">090</span>
                <p className="font-semibold text-slate-800 mt-1">Humas & Protokoler</p>
                <p className="text-slate-500 text-[10px]">Kerjasama media, siaran pers, audiensi instansi</p>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="font-mono font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">180</span>
                <p className="font-semibold text-slate-800 mt-1">Hukum & Perjanjian</p>
                <p className="text-slate-500 text-[10px]">MoU dengan Puskesmas/Kepolisian, perjanjian kerjasama</p>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                <span className="font-mono font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">821</span>
                <p className="font-semibold text-slate-800 mt-1">Pengangkatan & Jabatan</p>
                <p className="text-slate-500 text-[10px]">SK penugasan internal, pembagian jam mengajar, pelantikan</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              * Saat membuat Surat Keluar, pilih opsi <strong>"Lainnya (diisi manual)"</strong> pada dropdown klasifikasi untuk mengetikkan kode angka yang diinginkan secara langsung.
            </p>
          </div>
        </div>
      )}

      {/* MODAL: INPUT SURAT MASUK */}
      {isIncomingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Inbox className="w-5 h-5 text-blue-400" />
                Catat Agenda Surat Masuk
              </h3>
              <button onClick={() => setIsIncomingModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIncoming} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nomor Agenda *</label>
                  <input
                    type="text"
                    required
                    value={incomingForm.noAgenda}
                    onChange={(e) => setIncomingForm({ ...incomingForm, noAgenda: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Terima</label>
                  <input
                    type="date"
                    required
                    value={incomingForm.tanggalTerima}
                    onChange={(e) => setIncomingForm({ ...incomingForm, tanggalTerima: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nomor Surat dari Pengirim *</label>
                  <input
                    type="text"
                    required
                    value={incomingForm.nomorSurat}
                    onChange={(e) => setIncomingForm({ ...incomingForm, nomorSurat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-600"
                    placeholder="Contoh: 421/102/2026"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Surat</label>
                  <input
                    type="date"
                    required
                    value={incomingForm.tanggalSurat}
                    onChange={(e) => setIncomingForm({ ...incomingForm, tanggalSurat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Asal Instansi / Pengirim *</label>
                <input
                  type="text"
                  required
                  value={incomingForm.asalSurat}
                  onChange={(e) => setIncomingForm({ ...incomingForm, asalSurat: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  placeholder="Dinas Pendidikan dan Kebudayaan Kab. Purbalingga"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Perihal / Hal *</label>
                <textarea
                  rows={2}
                  required
                  value={incomingForm.perihal}
                  onChange={(e) => setIncomingForm({ ...incomingForm, perihal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  placeholder="Isi ringkas perihal surat..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sifat Surat</label>
                  <select
                    value={incomingForm.sifat}
                    onChange={(e) => setIncomingForm({ ...incomingForm, sifat: e.target.value as LetterNature })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="biasa">Biasa</option>
                    <option value="segera">Segera / Penting</option>
                    <option value="sangat_segera">Sangat Segera / Kilat</option>
                    <option value="rahasia">Rahasia</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ringkasan / Catatan</label>
                  <input
                    type="text"
                    value={incomingForm.ringkasanIsi}
                    onChange={(e) => setIncomingForm({ ...incomingForm, ringkasanIsi: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="Ringkasan poin penting..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsIncomingModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Agenda Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LEMBAR DISPOSISI KEPALA SEKOLAH */}
      {isDisposisiModalOpen && selectedLetterForDisposisi && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                Lembar Disposisi Kepala Sekolah
              </h3>
              <button onClick={() => setIsDisposisiModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDisposisi} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-slate-800">
                <p className="font-bold">No. Agenda: {selectedLetterForDisposisi.noAgenda} | Asal: {selectedLetterForDisposisi.asalSurat}</p>
                <p className="text-[11px] mt-0.5">{selectedLetterForDisposisi.perihal}</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Diteruskan Kepada (Pejabat / Staf Dituju):</label>
                <div className="grid grid-cols-2 gap-2 p-2.5 border rounded-lg bg-slate-50">
                  {[
                    'Wakasek Kurikulum',
                    'Wakasek Kesiswaan',
                    'Wakasek Sarpras',
                    'Kepala Urusan Tata Usaha',
                    'Guru BK / Konselor',
                    'Bendahara Sekolah',
                    'Petugas Sarpras'
                  ].map(target => {
                    const isChecked = disposisiForm.tujuan.includes(target);
                    return (
                      <label key={target} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDisposisiForm({ ...disposisiForm, tujuan: [...disposisiForm.tujuan, target] });
                            } else {
                              setDisposisiForm({ ...disposisiForm, tujuan: disposisiForm.tujuan.filter(t => t !== target) });
                            }
                          }}
                          className="rounded text-blue-600"
                        />
                        <span className="text-[11px] text-slate-800">{target}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Instruksi / Petunjuk Disposisi:</label>
                <textarea
                  rows={2}
                  required
                  value={disposisiForm.isiDisposisi}
                  onChange={(e) => setDisposisiForm({ ...disposisiForm, isiDisposisi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  placeholder="Tindak lanjuti segera, koordinasikan, laporkan hasilnya..."
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catatan Tambahan Kepala Sekolah</label>
                <textarea
                  rows={2}
                  value={disposisiForm.catatan}
                  onChange={(e) => setDisposisiForm({ ...disposisiForm, catatan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  placeholder="Catatan tambahan khusus..."
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status Disposisi</label>
                <select
                  value={disposisiForm.status}
                  onChange={(e) => setDisposisiForm({ ...disposisiForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 font-semibold"
                >
                  <option value="Belum">Belum Didisposisi</option>
                  <option value="Proses">Dalam Proses Tindak Lanjut</option>
                  <option value="Selesai">Selesai Ditindaklanjuti</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsDisposisiModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Disposisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BUAT SURAT KELUAR */}
      {isOutgoingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-400" />
                Buat Surat Keluar (Nomor Otomatis)
              </h3>
              <button onClick={() => setIsOutgoingModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOutgoing} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kode Klasifikasi Surat *</label>
                  <select
                    value={isManualClassification ? 'lainnya' : outgoingForm.kodeKlasifikasi}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'lainnya') {
                        setIsManualClassification(true);
                        if (!manualClassificationCode) {
                          setManualClassificationCode('028');
                          setOutgoingForm(prev => ({ ...prev, kodeKlasifikasi: '028' }));
                        }
                      } else {
                        setIsManualClassification(false);
                        setOutgoingForm(prev => ({ ...prev, kodeKlasifikasi: val }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 font-mono"
                  >
                    {standardClassifications.map(c => (
                      <option key={c.kode} value={c.kode}>
                        {c.kode === 'lainnya' ? '— Lainnya (diisi manual) —' : `${c.kode} - ${c.nama}`}
                      </option>
                    ))}
                  </select>

                  {isManualClassification && (
                    <div className="mt-2.5 p-3 rounded-lg bg-blue-50/90 border border-blue-200">
                      <label className="font-bold text-blue-900 block mb-1 text-[11px]">
                        Kode Klasifikasi Surat (Diisi Manual) *
                      </label>
                      <input
                        type="text"
                        required
                        value={manualClassificationCode}
                        onChange={(e) => {
                          const val = e.target.value;
                          setManualClassificationCode(val);
                          setOutgoingForm(prev => ({ ...prev, kodeKlasifikasi: val }));
                        }}
                        className="w-full px-3 py-1.5 border border-blue-300 rounded-md font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        placeholder="Ketik kode manual, contoh: 028 (Aset), 090 (Humas), 180 (Hukum), 420.1, dll"
                      />
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-blue-800">
                        <span>Simulasi nomor surat:</span>
                        <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
                          {manualClassificationCode.trim() || 'KODE'}/[Nomor]/SMPN2KTS/{new Date().getFullYear()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Surat</label>
                  <input
                    type="date"
                    required
                    value={outgoingForm.tanggalSurat}
                    onChange={(e) => setOutgoingForm({ ...outgoingForm, tanggalSurat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tujuan Surat Dinas *</label>
                <input
                  type="text"
                  required
                  value={outgoingForm.tujuan}
                  onChange={(e) => setOutgoingForm({ ...outgoingForm, tujuan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  placeholder="Contoh: Orang Tua / Wali Siswa Kelas 9"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Perihal Surat *</label>
                <textarea
                  rows={2}
                  required
                  value={outgoingForm.perihal}
                  onChange={(e) => setOutgoingForm({ ...outgoingForm, perihal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  placeholder="Contoh: Undangan Rapat Pleno Komite Sekolah"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pembuat / Konseptor</label>
                  <input
                    type="text"
                    value={outgoingForm.pembuat}
                    onChange={(e) => setOutgoingForm({ ...outgoingForm, pembuat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Status Approval</label>
                  <select
                    value={outgoingForm.statusApproval}
                    onChange={(e) => setOutgoingForm({ ...outgoingForm, statusApproval: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  >
                    <option value="Draft">Draft Konsep</option>
                    <option value="Menunggu Approval">Menunggu Approval Kepala Sekolah</option>
                    <option value="Disetujui">Disetujui & Diterbitkan Nomor</option>
                    <option value="Terkirim">Telah Terkirim</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsOutgoingModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Generate & Terbitkan Nomor Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EKSPEDISI BARU */}
      {isExpeditionModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-400" />
                Catat Pengiriman Buku Ekspedisi
              </h3>
              <button onClick={() => setIsExpeditionModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpedition} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nomor Surat Dinas *</label>
                <input
                  type="text"
                  required
                  value={expeditionForm.nomorSurat}
                  onChange={(e) => setExpeditionForm({ ...expeditionForm, nomorSurat: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-blue-600"
                  placeholder="421.3/xxx/SMPN2KTS/2026"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tujuan Pengiriman *</label>
                <input
                  type="text"
                  required
                  value={expeditionForm.tujuan}
                  onChange={(e) => setExpeditionForm({ ...expeditionForm, tujuan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  placeholder="Dinas Pendidikan / Sekolah Lain..."
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Perihal Surat</label>
                <input
                  type="text"
                  value={expeditionForm.perihal}
                  onChange={(e) => setExpeditionForm({ ...expeditionForm, perihal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Penerima / Kurir</label>
                  <input
                    type="text"
                    value={expeditionForm.namaPenerima}
                    onChange={(e) => setExpeditionForm({ ...expeditionForm, namaPenerima: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Catatan / Bukti Serah Terima</label>
                  <input
                    type="text"
                    value={expeditionForm.catatan}
                    onChange={(e) => setExpeditionForm({ ...expeditionForm, catatan: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsExpeditionModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Catatan Ekspedisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT MODAL: LEMBAR DISPOSISI & SURAT KELUAR */}
      {printDocType === 'lembar_disposisi' && selectedIncomingForPrint && (
        <PrintModal
          isOpen={true}
          onClose={() => setPrintDocType(null)}
          title="Lembar Disposisi Kepala Sekolah"
          documentNumber={selectedIncomingForPrint.noAgenda}
        >
          <div className="space-y-4 text-xs font-sans text-slate-900">
            <div className="text-center my-2 border-b-2 border-slate-900 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider">
                LEMBAR DISPOSISI KEPALA SEKOLAH
              </h3>
            </div>

            <table className="w-full text-xs border border-slate-400 border-collapse mb-4">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-36 p-2 bg-slate-50 font-bold border-r border-slate-300">Surat Dari</td>
                  <td className="p-2 font-medium">{selectedIncomingForPrint.asalSurat}</td>
                  <td className="w-36 p-2 bg-slate-50 font-bold border-r border-l border-slate-300">Diterima Tanggal</td>
                  <td className="p-2 font-mono">{selectedIncomingForPrint.tanggalTerima}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 bg-slate-50 font-bold border-r border-slate-300">Tanggal Surat</td>
                  <td className="p-2 font-mono">{selectedIncomingForPrint.tanggalSurat}</td>
                  <td className="p-2 bg-slate-50 font-bold border-r border-l border-slate-300">Nomor Agenda</td>
                  <td className="p-2 font-mono font-bold text-blue-900">{selectedIncomingForPrint.noAgenda}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 bg-slate-50 font-bold border-r border-slate-300">Nomor Surat</td>
                  <td colSpan={3} className="p-2 font-mono font-bold">{selectedIncomingForPrint.nomorSurat}</td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 bg-slate-50 font-bold border-r border-slate-300">Perihal</td>
                  <td colSpan={3} className="p-2 font-medium">{selectedIncomingForPrint.perihal}</td>
                </tr>
                <tr>
                  <td className="p-2 bg-slate-50 font-bold border-r border-slate-300">Sifat Surat</td>
                  <td colSpan={3} className="p-2 uppercase font-bold text-blue-900">{selectedIncomingForPrint.sifat}</td>
                </tr>
              </tbody>
            </table>

            <div className="grid grid-cols-2 gap-4 border border-slate-400 p-4 rounded min-h-[160px]">
              <div>
                <h4 className="font-bold uppercase text-[11px] mb-2 pb-1 border-b text-slate-800">
                  DITERUSKAN KEPADA SDR :
                </h4>
                <ul className="space-y-1.5 text-xs">
                  {selectedIncomingForPrint.disposisi?.tujuan.map(p => (
                    <li key={p} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-800" />
                      <span className="font-semibold">{p}</span>
                    </li>
                  )) || <li className="text-slate-400 italic">Belum ditentukan</li>}
                </ul>
              </div>

              <div>
                <h4 className="font-bold uppercase text-[11px] mb-2 pb-1 border-b text-slate-800">
                  PETUNJUK / INSTRUKSI DISPOSISI :
                </h4>
                <p className="text-slate-800 font-medium">
                  {selectedIncomingForPrint.disposisi?.isiDisposisi || 'Tindak lanjuti segera sesuai ketentuan.'}
                </p>
                {selectedIncomingForPrint.disposisi?.catatan && (
                  <div className="mt-3 p-2 bg-slate-50 rounded border text-slate-700">
                    <span className="font-bold block text-[10px]">Catatan:</span>
                    {selectedIncomingForPrint.disposisi.catatan}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <div className="text-center w-64 text-xs font-sans">
                <p>Kutasari, {selectedIncomingForPrint.disposisi?.tanggalDisposisi || '20 September 2026'}</p>
                <p className="font-semibold mt-1">Kepala SMP Negeri 2 Kutasari,</p>
                <div className="h-16 flex items-center justify-center">
                  <span className="text-[10px] text-slate-400 italic">[ Paraf / Tanda Tangan ]</span>
                </div>
                <p className="font-bold underline">{school.kepalaSekolah}</p>
                <p className="font-mono text-[10px]">NIP. {school.nipKepalaSekolah}</p>
              </div>
            </div>
          </div>
        </PrintModal>
      )}

      {printDocType === 'surat_keluar' && selectedOutgoingForPrint && (
        <PrintModal
          isOpen={true}
          onClose={() => setPrintDocType(null)}
          title="Surat Keluar Kedinasan"
          documentNumber={selectedOutgoingForPrint.nomorSurat}
        >
          <div className="space-y-6 font-serif text-slate-900 leading-relaxed text-sm">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <table>
                <tbody>
                  <tr><td className="w-16 font-semibold">Nomor</td><td className="w-3">:</td><td className="font-mono font-bold text-blue-900">{selectedOutgoingForPrint.nomorSurat}</td></tr>
                  <tr><td className="font-semibold">Lampiran</td><td>:</td><td>{selectedOutgoingForPrint.lampiran || '-'}</td></tr>
                  <tr><td className="font-semibold">Perihal</td><td>:</td><td className="font-bold">{selectedOutgoingForPrint.perihal}</td></tr>
                </tbody>
              </table>

              <div className="text-right font-sans text-xs">
                <p>Kutasari, {selectedOutgoingForPrint.tanggalSurat}</p>
                <div className="text-left mt-3">
                  <p>Kepada Yth.</p>
                  <p className="font-bold">{selectedOutgoingForPrint.tujuan}</p>
                  <p className="text-slate-600">di Tempat</p>
                </div>
              </div>
            </div>

            <p className="text-justify indent-8 mt-6">
              Dengan hormat, sehubungan dengan agenda pelaksanaan kegiatan di lingkungan SMP Negeri 2 Kutasari, bersama ini kami sampaikan perihal dimaksud di atas.
            </p>

            <p className="text-justify indent-8">
              {selectedOutgoingForPrint.isiSurat || 'Demikian surat dinas ini kami sampaikan, atas perhatian dan kerjasama yang baik kami ucapkan terima kasih.'}
            </p>

            <div className="pt-8 flex justify-end">
              <div className="text-center w-64 text-xs font-sans">
                <p>Kepala SMP Negeri 2 Kutasari,</p>
                <div className="h-20" />
                <p className="font-bold underline text-sm">{school.kepalaSekolah}</p>
                <p className="font-mono text-[11px] text-slate-700">NIP. {school.nipKepalaSekolah}</p>
              </div>
            </div>
          </div>
        </PrintModal>
      )}
    </div>
  );
};
