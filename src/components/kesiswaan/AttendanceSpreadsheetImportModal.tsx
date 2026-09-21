import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  ClipboardPaste, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  ArrowRight, 
  RotateCcw,
  Info,
  Check,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useApp } from '../../context/AppContext';
import { StudentAttendanceRecap, SpreadsheetImportLog } from '../../types';

interface AttendanceSpreadsheetImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AttendanceSpreadsheetImportModal: React.FC<AttendanceSpreadsheetImportModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    attendanceRecaps, 
    bulkUpdateAttendance, 
    importLogs, 
    rollbackAttendanceImport,
    school
  } = useApp();

  const [activeTab, setActiveTab] = useState<'download' | 'upload' | 'paste' | 'logs'>('download');
  const [importType, setImportType] = useState<SpreadsheetImportLog['tipeImport']>('rekap_per_rombel');
  
  // Paste input
  const [pasteText, setPasteText] = useState('');
  
  // Parsed preview data
  const [parsedRecaps, setParsedRecaps] = useState<StudentAttendanceRecap[]>([]);
  const [sourceFileName, setSourceFileName] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const [rollbackSuccessMessage, setRollbackSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Download Excel Template
  const handleDownloadTemplate = () => {
    const templateData = attendanceRecaps.map(item => ({
      'Tingkat': item.rombel.charAt(0),
      'Rombel': item.rombel,
      'Wali Kelas': item.waliKelas || `Wali Kelas ${item.rombel}`,
      'Jumlah Siswa': item.totalSiswa || 32,
      'Hadir (H)': item.hadir,
      'Sakit (S)': item.sakit,
      'Izin (I)': item.izin,
      'Alpa (A)': item.alpa
    }));

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 10 },
      { wch: 10 },
      { wch: 28 },
      { wch: 14 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Presensi');

    // Also add an instruction sheet
    const petunjukData = [
      { 'Petunjuk Pengisian': '1. Jangan mengubah nama kolom pada baris pertama (header).' },
      { 'Petunjuk Pengisian': '2. Kolom Rombel harus sesuai dengan nama kelas resmi SMPN 2 Kutasari (7A-7F, 8A-8G, 9A-9F).' },
      { 'Petunjuk Pengisian': '3. Isikan angka bulat pada kolom Hadir, Sakit, Izin, dan Alpa.' },
      { 'Petunjuk Pengisian': '4. Persentase kehadiran akan dihitung otomatis oleh SIMTU SMPN 2 Kutasari.' },
      { 'Petunjuk Pengisian': '5. Simpan file sebagai Excel (.xlsx) atau CSV kemudian unggah ke aplikasi SIMTU.' }
    ];
    const petunjukSheet = XLSX.utils.json_to_sheet(petunjukData);
    XLSX.utils.book_append_sheet(workbook, petunjukSheet, 'Petunjuk');

    XLSX.writeFile(workbook, `Template_Rekap_Presensi_SMPN2_Kutasari_${new Date().getFullYear()}.xlsx`);
  };

  // 2. Process file upload (.xlsx, .xls, .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSourceFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json<any>(worksheet);

        validateAndSetData(rawJson, file.name);
      } catch (err) {
        setValidationErrors(['Gagal membaca file spreadsheet. Pastikan format file valid (.xlsx, .xls, atau .csv).']);
      }
    };

    reader.readAsBinaryString(file);
  };

  // 3. Process pasted text from clipboard
  const handleProcessPaste = () => {
    if (!pasteText.trim()) {
      setValidationErrors(['Silakan tempel (paste) data dari spreadsheet terlebih dahulu.']);
      return;
    }

    try {
      const lines = pasteText.trim().split(/\r\n|\n|\r/);
      if (lines.length < 2) {
        setValidationErrors(['Data yang ditempelkan minimal harus memiliki 1 baris header dan 1 baris data.']);
        return;
      }

      // Check delimiter (tab or comma or semicolon)
      const firstLine = lines[0];
      const delimiter = firstLine.includes('\t') ? '\t' : (firstLine.includes(';') ? ';' : ',');
      const headers = firstLine.split(delimiter).map(h => h.trim().toLowerCase());

      const dataRows = lines.slice(1).map(line => {
        const values = line.split(delimiter).map(v => v.trim());
        const rowObj: any = {};
        headers.forEach((h, idx) => {
          rowObj[h] = values[idx] || '';
        });
        return rowObj;
      });

      validateAndSetData(dataRows, 'Pasted_Data_Clipboard.txt');
    } catch (err) {
      setValidationErrors(['Format data yang ditempelkan tidak sesuai. Pastikan menyalin dari tabel Excel / Google Sheets.']);
    }
  };

  // Normalizer & Validator
  const validateAndSetData = (rows: any[], sourceName: string) => {
    const errors: string[] = [];
    const validRecaps: StudentAttendanceRecap[] = [];

    if (!rows || rows.length === 0) {
      errors.push('Spreadsheet tidak memiliki baris data.');
      setValidationErrors(errors);
      return;
    }

    // Process each row
    rows.forEach((row, idx) => {
      // Find keys leniently
      const keys = Object.keys(row);
      const rombelKey = keys.find(k => k.toLowerCase().includes('rombel') || k.toLowerCase().includes('kelas'));
      const jmlKey = keys.find(k => k.toLowerCase().includes('jumlah') || k.toLowerCase().includes('total'));
      const hadirKey = keys.find(k => k.toLowerCase().includes('hadir') || k.toLowerCase() === 'h');
      const sakitKey = keys.find(k => k.toLowerCase().includes('sakit') || k.toLowerCase() === 's');
      const izinKey = keys.find(k => k.toLowerCase().includes('izin') || k.toLowerCase() === 'i');
      const alpaKey = keys.find(k => k.toLowerCase().includes('alpa') || k.toLowerCase() === 'a' || k.toLowerCase().includes('alpha'));

      const rawRombel = rombelKey ? String(row[rombelKey]).trim().toUpperCase() : '';
      
      // Normalize rombel e.g. "VII A" -> "7A", "8-A" -> "8A", "8A" -> "8A"
      let normalizedRombel = rawRombel.replace(/[^0-9A-Za-z]/g, '');
      if (normalizedRombel.startsWith('VII')) normalizedRombel = normalizedRombel.replace('VII', '7');
      else if (normalizedRombel.startsWith('VIII')) normalizedRombel = normalizedRombel.replace('VIII', '8');
      else if (normalizedRombel.startsWith('IX')) normalizedRombel = normalizedRombel.replace('IX', '9');

      // Find existing rombel match
      const existing = attendanceRecaps.find(a => a.rombel.toUpperCase() === normalizedRombel || a.rombel.toUpperCase() === rawRombel);
      
      if (!existing && !normalizedRombel) {
        // Skip empty row
        return;
      }

      const targetRombel = existing ? existing.rombel : normalizedRombel;
      const totalSiswa = jmlKey ? parseInt(String(row[jmlKey])) || (existing?.totalSiswa || 32) : (existing?.totalSiswa || 32);
      const hadir = hadirKey ? parseInt(String(row[hadirKey])) || 0 : (existing?.hadir || 0);
      const sakit = sakitKey ? parseInt(String(row[sakitKey])) || 0 : 0;
      const izin = izinKey ? parseInt(String(row[izinKey])) || 0 : 0;
      const alpa = alpaKey ? parseInt(String(row[alpaKey])) || 0 : 0;

      // Validate counts
      if (hadir + sakit + izin + alpa > totalSiswa) {
        errors.push(`Baris ${idx + 1} (${targetRombel}): Total kehadiran (${hadir + sakit + izin + alpa}) melebihi jumlah siswa (${totalSiswa}).`);
      }

      const calculatedPercentage = totalSiswa > 0 ? parseFloat(((hadir / totalSiswa) * 100).toFixed(1)) : 0;

      validRecaps.push({
        rombel: targetRombel,
        bulan: existing?.bulan || '2026-09',
        tingkat: targetRombel.startsWith('7') ? '7' : (targetRombel.startsWith('8') ? '8' : '9'),
        waliKelas: existing?.waliKelas || `Wali Kelas ${targetRombel}`,
        totalSiswa,
        jumlahSiswa: totalSiswa,
        hadir,
        sakit,
        izin,
        alpa,
        persentaseHadir: calculatedPercentage
      });
    });

    if (validRecaps.length === 0) {
      errors.push('Tidak ditemukan data rombel yang cocok dengan struktur kelas SMPN 2 Kutasari (7A-7F, 8A-8G, 9A-9F).');
    }

    setValidationErrors(errors);
    setParsedRecaps(validRecaps);
    setSourceFileName(sourceName);
    setImportSuccessMessage(null);
  };

  // 4. Save parsed data to AppContext
  const handleConfirmImport = () => {
    if (parsedRecaps.length === 0) return;

    bulkUpdateAttendance(parsedRecaps, {
      namaFile: sourceFileName || 'Spreadsheet_Import.xlsx',
      tipe: importType,
      rombel: parsedRecaps.length === attendanceRecaps.length ? 'Semua Rombel (19 Rombel)' : `${parsedRecaps.length} Rombel`,
      catatan: `Berhasil mengimpor ${parsedRecaps.length} data rombel via Spreadsheet`
    });

    setImportSuccessMessage(`Berhasil memperbarui data presensi untuk ${parsedRecaps.length} rombel!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // 5. Rollback Handler
  const handleRollback = (logId: string) => {
    const res = rollbackAttendanceImport(logId);
    if (res.success) {
      setRollbackSuccessMessage(res.message);
      setTimeout(() => setRollbackSuccessMessage(null), 4000);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-4xl w-full flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in duration-150">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Import Rekap Kehadiran Siswa dari Spreadsheet
              </h3>
              <p className="text-xs text-slate-500">
                Mendukung Microsoft Excel (.xlsx, .xls), CSV, dan Paste langsung dari Google Sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('download')}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'download'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              1. Download Template
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'upload'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              2. Unggah Berkas Excel
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'paste'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              3. Paste dari Google Sheets
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'logs'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Riwayat & Rollback ({importLogs.length})
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 py-2">
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
              Format: Rekap Bulanan Rombel
            </span>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: DOWNLOAD TEMPLATE */}
          {activeTab === 'download' && (
            <div className="space-y-6">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-emerald-950 mb-1">
                      Unduh Format Resmi Excel Rekap Kehadiran
                    </h4>
                    <p className="text-xs text-emerald-800 leading-relaxed mb-4">
                      File template sudah memuat seluruh daftar 12 Rombel aktif (VII A s.d. IX D) SMPN 2 Kutasari, wali kelas, serta jumlah siswa per kelas. Cukup isi kolom Hadir, Sakit, Izin, dan Alpa.
                    </p>
                    <button
                      onClick={handleDownloadTemplate}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Template Excel (.xlsx)
                    </button>
                  </div>
                </div>
              </div>

              {/* Table Structure Guide */}
              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Struktur Kolom Template:
                </h5>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Kolom</th>
                        <th className="px-3 py-2">Contoh Nilai</th>
                        <th className="px-3 py-2">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="px-3 py-2 font-mono font-semibold text-slate-800">Tingkat</td>
                        <td className="px-3 py-2">7 / 8 / 9</td>
                        <td className="px-3 py-2">Jenjang kelas</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono font-semibold text-slate-800">Rombel</td>
                        <td className="px-3 py-2">7A-7F, 8A-8G, 9A-9F</td>
                        <td className="px-3 py-2">Wajib diisi sesuai nama rombel resmi</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono font-semibold text-slate-800">Jumlah Siswa</td>
                        <td className="px-3 py-2">32</td>
                        <td className="px-3 py-2">Kapasitas rombel</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono font-semibold text-emerald-700">Hadir (H)</td>
                        <td className="px-3 py-2">30</td>
                        <td className="px-3 py-2">Akumulasi siswa hadir dalam periode</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono font-semibold text-amber-700">Sakit (S)</td>
                        <td className="px-3 py-2">1</td>
                        <td className="px-3 py-2">Siswa dengan surat keterangan dokter/sakit</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono font-semibold text-blue-700">Izin (I)</td>
                        <td className="px-3 py-2">1</td>
                        <td className="px-3 py-2">Siswa berizin keperluan keluarga</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-mono font-semibold text-rose-700">Alpa (A)</td>
                        <td className="px-3 py-2">0</td>
                        <td className="px-3 py-2">Tanpa keterangan</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => setActiveTab('upload')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Lanjut ke Unggah Berkas
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD FILE */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-8 text-center transition-colors bg-slate-50/50">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">
                  Pilih atau Tarik Berkas Spreadsheet ke Sini
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Mendukung file Excel (.xlsx, .xls) atau teks (.csv) hingga ukuran 10 MB
                </p>

                <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors">
                  <FileSpreadsheet className="w-4 h-4" />
                  Pilih File dari Komputer
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {sourceFileName && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    File terpilih: <span className="font-bold">{sourceFileName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PASTE DIRECTLY */}
          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Buka Google Sheets atau Excel Anda, blok seluruh tabel (termasuk baris judul kolom), tekan <strong>Ctrl + C</strong>, lalu tempel (<strong>Ctrl + V</strong>) ke dalam kotak di bawah ini.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tempelkan Baris Data (Tab-Delimited):
                </label>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="Rombel	Jumlah Siswa	Hadir	Sakit	Izin	Alpa&#10;7A	32	30	1	1	0&#10;7B	32	31	1	0	0&#10;..."
                  rows={8}
                  className="w-full text-xs font-mono p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleProcessPaste}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                >
                  <ClipboardPaste className="w-4 h-4" />
                  Proses & Validasi Data Tempelan
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: RIWAYAT IMPORT & ROLLBACK */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              {rollbackSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {rollbackSuccessMessage}
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Sistem Pencatatan & Snapshot Otomatis</span>
                  <p className="text-[11px] text-slate-500">Setiap proses import menyimpan cadangan data sebelumnya sehingga dapat dipulihkan sewaktu-waktu.</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2.5">Waktu & Tanggal</th>
                      <th className="px-3 py-2.5">Petugas</th>
                      <th className="px-3 py-2.5">Nama File</th>
                      <th className="px-3 py-2.5">Cakupan Rombel</th>
                      <th className="px-3 py-2.5">Hasil</th>
                      <th className="px-3 py-2.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {importLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-mono">
                          {log.tanggal} <span className="text-slate-400">{log.waktu}</span>
                        </td>
                        <td className="px-3 py-2 font-medium text-slate-800">{log.namaPengguna}</td>
                        <td className="px-3 py-2 max-w-[150px] truncate" title={log.namaFile}>
                          {log.namaFile}
                        </td>
                        <td className="px-3 py-2">{log.rombel}</td>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <Check className="w-3 h-3" />
                            {log.jumlahBerhasil} Rombel
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          {log.snapshotSebelumnya && log.snapshotSebelumnya.length > 0 && !log.catatan.includes('DIBATALKAN') ? (
                            <button
                              onClick={() => handleRollback(log.id)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold rounded border border-rose-200 cursor-pointer transition-colors"
                              title="Kembalikan data ke sebelum import ini dilakukan"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Rollback
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">
                              {log.catatan.includes('DIBATALKAN') ? 'Telah Dibatalkan' : 'Snapshot lama'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {importLogs.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-slate-400">
                          Belum ada catatan riwayat import spreadsheet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Validation Alert */}
          {validationErrors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Catatan / Peringatan Validasi:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success Notification */}
          {importSuccessMessage && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3.5 text-xs text-emerald-900 flex items-center gap-2.5 font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              {importSuccessMessage}
            </div>
          )}

          {/* PREVIEW TABLE OF PARSED DATA */}
          {parsedRecaps.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Pratinjau Data yang Akan Diimpor ({parsedRecaps.length} Rombel)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Periksa kembali angka sebelum menyimpan ke rekap kehadiran aktif.
                  </p>
                </div>
                <button
                  onClick={handleConfirmImport}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simpan & Terapkan Data Ini
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-60 overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Rombel</th>
                      <th className="px-3 py-2">Wali Kelas</th>
                      <th className="px-3 py-2 text-center">Jml Siswa</th>
                      <th className="px-3 py-2 text-center text-emerald-700">Hadir</th>
                      <th className="px-3 py-2 text-center text-amber-700">Sakit</th>
                      <th className="px-3 py-2 text-center text-blue-700">Izin</th>
                      <th className="px-3 py-2 text-center text-rose-700">Alpa</th>
                      <th className="px-3 py-2 text-center">% Hadir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {parsedRecaps.map((row) => (
                      <tr key={row.rombel} className="hover:bg-slate-50">
                        <td className="px-3 py-1.5 font-bold text-slate-900">{row.rombel}</td>
                        <td className="px-3 py-1.5 text-slate-600">{row.waliKelas}</td>
                        <td className="px-3 py-1.5 text-center font-medium">{row.jumlahSiswa}</td>
                        <td className="px-3 py-1.5 text-center font-semibold text-emerald-700">{row.hadir}</td>
                        <td className="px-3 py-1.5 text-center text-amber-700">{row.sakit}</td>
                        <td className="px-3 py-1.5 text-center text-blue-700">{row.izin}</td>
                        <td className="px-3 py-1.5 text-center text-rose-700">{row.alpa}</td>
                        <td className="px-3 py-1.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            row.persentaseHadir >= 95 ? 'bg-emerald-100 text-emerald-800' :
                            row.persentaseHadir >= 90 ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {row.persentaseHadir}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            SMPN 2 Kutasari &bull; Modul Presensi & Rekapitulasi Kehadiran
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            >
              Tutup
            </button>
            {parsedRecaps.length > 0 && (
              <button
                onClick={handleConfirmImport}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Simpan & Terapkan Data ({parsedRecaps.length} Rombel)
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
