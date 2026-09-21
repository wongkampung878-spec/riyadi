import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  SchoolIdentity, 
  Student, 
  Staff, 
  IncomingLetter, 
  OutgoingLetter, 
  ExpeditionEntry,
  InventoryItem, 
  EquipmentLoan, 
  CashTransaction, 
  LeaveRequest,
  StudentAttendanceRecap,
  UserRole,
  PiketReport,
  JadwalPiketItem,
  StudentMutation,
  SpreadsheetImportLog
} from '../types';
import { 
  initialSchoolIdentity, 
  initialUsers, 
  initialStudents, 
  initialStaff, 
  initialIncomingLetters, 
  initialOutgoingLetters, 
  initialExpeditions,
  initialInventory, 
  initialLoans, 
  initialCashTransactions, 
  initialLeaveRequests,
  initialAttendanceRecap
} from '../data/initialData';
import {
  initialPiketReports,
  initialJadwalPiket,
  initialStudentMutations,
  initialImportLogs
} from '../data/piketAndMutationData';

const STORAGE_KEY_PREFIX = 'simtu_smpn2kts_';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  activeModule: string;
  setActiveModule: (module: string) => void;
  
  // Data State
  school: SchoolIdentity;
  updateSchool: (data: Partial<SchoolIdentity>) => void;
  
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  deleteAllStudents: (options?: { resetAttendance?: boolean; resetMutations?: boolean }) => { count: number };
  cleanCorruptStudents: () => number;
  importStudents: (newStudents: Omit<Student, 'id'>[]) => void;
  replaceStudents: (newStudents: Omit<Student, 'id'>[]) => void;
  
  staff: Staff[];
  addStaff: (staffMember: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, data: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'tanggalPengajuan' | 'status'>) => void;
  updateLeaveStatus: (id: string, status: 'Disetujui' | 'Ditolak', approverName: string) => void;
  
  incomingLetters: IncomingLetter[];
  addIncomingLetter: (letter: Omit<IncomingLetter, 'id'>) => void;
  updateIncomingLetter: (id: string, data: Partial<IncomingLetter>) => void;
  deleteIncomingLetter: (id: string) => void;
  updateDisposisi: (id: string, disposisi: IncomingLetter['disposisi']) => void;
  
  outgoingLetters: OutgoingLetter[];
  addOutgoingLetter: (letter: Omit<OutgoingLetter, 'id' | 'nomorSurat'>) => OutgoingLetter;
  updateOutgoingLetter: (id: string, data: Partial<OutgoingLetter>) => void;
  deleteOutgoingLetter: (id: string) => void;
  
  expeditions: ExpeditionEntry[];
  addExpedition: (entry: Omit<ExpeditionEntry, 'id'>) => void;
  updateExpedition: (id: string, data: Partial<ExpeditionEntry>) => void;
  
  inventory: InventoryItem[];
  addInventory: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventory: (id: string, data: Partial<InventoryItem>) => void;
  deleteInventory: (id: string) => void;
  
  loans: EquipmentLoan[];
  createLoan: (loanData: Omit<EquipmentLoan, 'id' | 'nomorPinjam' | 'status'>) => { success: boolean; message?: string; loan?: EquipmentLoan };
  returnLoan: (loanId: string, returnData: {
    tanggalKembali: string;
    jamKembali: string;
    kondisiKembali: 'Baik' | 'Rusak' | 'Hilang';
    keteranganKembali?: string;
    tindakLanjutGantiRugi?: string;
    namaPetugasPenerima: string;
  }) => void;
  deleteLoan: (id: string) => void;
  
  cashTransactions: CashTransaction[];
  addCashTransaction: (trx: Omit<CashTransaction, 'id' | 'saldoSetelahnya'>) => void;
  deleteCashTransaction: (id: string) => void;
  
  attendanceRecaps: StudentAttendanceRecap[];
  updateAttendanceRecap: (rombel: string, data: Partial<StudentAttendanceRecap>) => void;
  bulkUpdateAttendance: (newRecaps: StudentAttendanceRecap[], logInfo: { namaFile: string; tipe: SpreadsheetImportLog['tipeImport']; rombel: string; catatan: string }) => void;
  rollbackAttendanceImport: (logId: string) => { success: boolean; message: string };

  // Piket Harian
  piketReports: PiketReport[];
  addPiketReport: (report: Omit<PiketReport, 'id' | 'nomorLaporan' | 'createdAt'>) => PiketReport;
  updatePiketReport: (id: string, data: Partial<PiketReport>) => void;
  deletePiketReport: (id: string) => void;
  verifyPiketReport: (id: string, catatan: string, namaKepalaSekolah: string) => void;
  jadwalPiket: JadwalPiketItem[];
  updateJadwalPiket: (items: JadwalPiketItem[]) => void;

  // Mutasi Siswa
  mutations: StudentMutation[];
  addMutationMasuk: (data: Omit<StudentMutation, 'id' | 'nomorMutasi' | 'createdAt'>) => { success: boolean; message: string; mutation?: StudentMutation };
  addMutationKeluar: (data: Omit<StudentMutation, 'id' | 'nomorMutasi' | 'createdAt'>) => { success: boolean; message: string; mutation?: StudentMutation };
  deleteMutation: (id: string) => void;

  // Spreadsheet Import Logs
  importLogs: SpreadsheetImportLog[];
  addImportLog: (log: Omit<SpreadsheetImportLog, 'id'>) => void;
  
  // Stats & Notifications
  notifications: {
    urgentDisposisi: IncomingLetter[];
    overdueLoans: EquipmentLoan[];
    dueTodayLoans: EquipmentLoan[];
    impendingKgb: Staff[];
    impendingPangkat: Staff[];
    damagedAssets: InventoryItem[];
  };
  
  // Backup & Reset
  exportDatabaseToJson: () => void;
  importDatabaseFromJson: (jsonString: string) => boolean;
  resetToFactoryData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from LocalStorage or Fallback
  const loadData = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [school, setSchool] = useState<SchoolIdentity>(() => loadData('school', initialSchoolIdentity));
  const [users, setUsers] = useState<User[]>(() => loadData('users', initialUsers));
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = loadData<User | null>('currentUser', null);
    if (saved) return saved;
    // Default to Kepala TU for full access
    return initialUsers.find(u => u.role === 'kepala_tu') || initialUsers[0];
  });
  const [activeModule, setActiveModule] = useState<string>('dashboard');

  const [students, setStudents] = useState<Student[]>(() => loadData('students', initialStudents));
  const [staff, setStaff] = useState<Staff[]>(() => loadData('staff', initialStaff));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => loadData('leaves', initialLeaveRequests));
  const [incomingLetters, setIncomingLetters] = useState<IncomingLetter[]>(() => loadData('incoming_letters', initialIncomingLetters));
  const [outgoingLetters, setOutgoingLetters] = useState<OutgoingLetter[]>(() => loadData('outgoing_letters', initialOutgoingLetters));
  const [expeditions, setExpeditions] = useState<ExpeditionEntry[]>(() => loadData('expeditions', initialExpeditions));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadData('inventory', initialInventory));
  const [loans, setLoans] = useState<EquipmentLoan[]>(() => loadData('loans', initialLoans));
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>(() => loadData('cash', initialCashTransactions));
  const [attendanceRecaps, setAttendanceRecaps] = useState<StudentAttendanceRecap[]>(() => loadData('attendance', initialAttendanceRecap));
  const [piketReports, setPiketReports] = useState<PiketReport[]>(() => loadData('piket_reports', initialPiketReports));
  const [jadwalPiket, setJadwalPiket] = useState<JadwalPiketItem[]>(() => loadData('jadwal_piket', initialJadwalPiket));
  const [mutations, setMutations] = useState<StudentMutation[]>(() => loadData('mutations', initialStudentMutations));
  const [importLogs, setImportLogs] = useState<SpreadsheetImportLog[]>(() => loadData('import_logs', initialImportLogs));

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'school', JSON.stringify(school));
  }, [school]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'leaves', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'incoming_letters', JSON.stringify(incomingLetters));
  }, [incomingLetters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'outgoing_letters', JSON.stringify(outgoingLetters));
  }, [outgoingLetters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'expeditions', JSON.stringify(expeditions));
  }, [expeditions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'cash', JSON.stringify(cashTransactions));
  }, [cashTransactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'attendance', JSON.stringify(attendanceRecaps));
  }, [attendanceRecaps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'piket_reports', JSON.stringify(piketReports));
  }, [piketReports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'jadwal_piket', JSON.stringify(jadwalPiket));
  }, [jadwalPiket]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'mutations', JSON.stringify(mutations));
  }, [mutations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'import_logs', JSON.stringify(importLogs));
  }, [importLogs]);

  // Switch Role Utility
  const switchRole = (role: UserRole) => {
    const foundUser = users.find(u => u.role === role);
    if (foundUser) {
      setCurrentUser(foundUser);
    }
  };

  // School update
  const updateSchool = (data: Partial<SchoolIdentity>) => {
    setSchool(prev => ({ ...prev, ...data }));
  };

  // User CRUD
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...data }));
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`
    };
    setStudents(prev => [newStudent, ...prev]);
  };

  const updateStudent = (id: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const deleteAllStudents = (options?: { resetAttendance?: boolean; resetMutations?: boolean }) => {
    const count = students.length;
    setStudents([]);
    if (options?.resetAttendance) {
      setAttendanceRecaps(prev => prev.map(r => ({
        ...r,
        hadir: 0,
        sakit: 0,
        izin: 0,
        alpa: 0,
        jumlahSiswa: 0,
        totalSiswa: 0,
        persentaseHadir: 0
      })));
    }
    if (options?.resetMutations) {
      setMutations([]);
    }
    return { count };
  };

  const cleanCorruptStudents = () => {
    const isCorrupt = (s: Student) => {
      // Check for replacement character \uFFFD in nama, nisn, or nis
      if (/\uFFFD/.test(s.nama) || /\uFFFD/.test(s.nisn) || /\uFFFD/.test(s.nis)) return true;
      // Check for binary non-printable control characters
      if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(s.nama)) return true;
      // Check for garbage binary strings with almost no letters
      const letters = s.nama.replace(/[^a-zA-Z]/g, '');
      if (letters.length < 2 && s.nama.length > 3) return true;
      return false;
    };
    const corruptCount = students.filter(isCorrupt).length;
    if (corruptCount > 0) {
      setStudents(prev => prev.filter(s => !isCorrupt(s)));
    }
    return corruptCount;
  };

  const replaceStudents = (newStudents: Omit<Student, 'id'>[]) => {
    const formatted = newStudents.map((s, idx) => ({
      ...s,
      id: `std-${Date.now()}-${idx}`
    }));
    setStudents(formatted);
  };

  const importStudents = (newStudents: Omit<Student, 'id'>[]) => {
    const formatted = newStudents.map((s, idx) => ({
      ...s,
      id: `std-${Date.now()}-${idx}`
    }));
    setStudents(prev => [...formatted, ...prev]);
  };

  // Staff CRUD
  const addStaff = (staffData: Omit<Staff, 'id'>) => {
    const newStaff: Staff = {
      ...staffData,
      id: `stf-${Date.now()}`
    };
    setStaff(prev => [...prev, newStaff]);
  };

  const updateStaff = (id: string, data: Partial<Staff>) => {
    setStaff(prev => prev.map(st => st.id === id ? { ...st, ...data } : st));
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(st => st.id !== id));
  };

  // Leave Requests
  const addLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'tanggalPengajuan' | 'status'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newLeave: LeaveRequest = {
      ...req,
      id: `cuti-${Date.now()}`,
      status: 'Menunggu',
      tanggalPengajuan: today
    };
    setLeaveRequests(prev => [newLeave, ...prev]);
  };

  const updateLeaveStatus = (id: string, status: 'Disetujui' | 'Ditolak', approverName: string) => {
    setLeaveRequests(prev => prev.map(l => l.id === id ? { ...l, status, disetujuiOleh: approverName } : l));
  };

  // Incoming Letters
  const addIncomingLetter = (letterData: Omit<IncomingLetter, 'id'>) => {
    const newLetter: IncomingLetter = {
      ...letterData,
      id: `sm-${Date.now()}`
    };
    setIncomingLetters(prev => [newLetter, ...prev]);
  };

  const updateIncomingLetter = (id: string, data: Partial<IncomingLetter>) => {
    setIncomingLetters(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const deleteIncomingLetter = (id: string) => {
    setIncomingLetters(prev => prev.filter(l => l.id !== id));
  };

  const updateDisposisi = (id: string, disposisi: IncomingLetter['disposisi']) => {
    setIncomingLetters(prev => prev.map(l => l.id === id ? { ...l, disposisi } : l));
  };

  // Outgoing Letters
  const addOutgoingLetter = (letterData: Omit<OutgoingLetter, 'id' | 'nomorSurat'>) => {
    const currentYear = new Date().getFullYear();
    const countThisYear = outgoingLetters.filter(l => l.tanggalSurat.startsWith(String(currentYear))).length + 1;
    const padded = String(countThisYear + 99).padStart(3, '0');
    const classification = letterData.kodeKlasifikasi?.trim() || '421.3';
    const autoNumber = `${classification}/${padded}/SMPN2KTS/${currentYear}`;
    
    const newLetter: OutgoingLetter = {
      ...letterData,
      id: `sk-${Date.now()}`,
      nomorSurat: autoNumber
    };
    setOutgoingLetters(prev => [newLetter, ...prev]);
    return newLetter;
  };

  const updateOutgoingLetter = (id: string, data: Partial<OutgoingLetter>) => {
    setOutgoingLetters(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const deleteOutgoingLetter = (id: string) => {
    setOutgoingLetters(prev => prev.filter(l => l.id !== id));
  };

  // Expeditions
  const addExpedition = (entry: Omit<ExpeditionEntry, 'id'>) => {
    const newEntry: ExpeditionEntry = {
      ...entry,
      id: `exp-${Date.now()}`
    };
    setExpeditions(prev => [newEntry, ...prev]);
  };

  const updateExpedition = (id: string, data: Partial<ExpeditionEntry>) => {
    setExpeditions(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  };

  // Inventory
  const addInventory = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`
    };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventory = (id: string, data: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  };

  const deleteInventory = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  // Loans (EQUIPMENT LOAN WORKFLOW)
  const createLoan = (loanData: Omit<EquipmentLoan, 'id' | 'nomorPinjam' | 'status'>) => {
    // 1. Validate availability & condition
    for (const requestedItem of loanData.items) {
      const found = inventory.find(i => i.id === requestedItem.itemId);
      if (!found) {
        return { success: false, message: `Barang ${requestedItem.namaBarang} tidak ditemukan di master data!` };
      }
      if (!found.dapatDipinjamkan) {
        return { success: false, message: `Barang ${found.nama} berstatus TIDAK DAPAT DIPINJAMKAN!` };
      }
      if (found.kondisi === 'Rusak Berat') {
        return { success: false, message: `Barang ${found.nama} berkondisi Rusak Berat, tidak dapat dipinjam!` };
      }
      if (found.jumlahTersedia < requestedItem.jumlah) {
        return { 
          success: false, 
          message: `Stok ${found.nama} tidak mencukupi! Tersedia: ${found.jumlahTersedia}, Diminta: ${requestedItem.jumlah}` 
        };
      }
    }

    // 2. Generate auto loan code
    const now = new Date();
    const yearStr = now.getFullYear();
    const monthStr = String(now.getMonth() + 1).padStart(2, '0');
    const seq = String(loans.length + 1).padStart(3, '0');
    const nomorPinjam = `PJM/${yearStr}/${monthStr}/${seq}`;

    const newLoan: EquipmentLoan = {
      ...loanData,
      id: `pjm-${Date.now()}`,
      nomorPinjam,
      status: 'Dipinjam'
    };

    // 3. Decrement available stock in inventory
    setInventory(prev => prev.map(invItem => {
      const match = loanData.items.find(it => it.itemId === invItem.id);
      if (match) {
        return {
          ...invItem,
          jumlahTersedia: Math.max(0, invItem.jumlahTersedia - match.jumlah)
        };
      }
      return invItem;
    }));

    setLoans(prev => [newLoan, ...prev]);
    return { success: true, loan: newLoan };
  };

  const returnLoan = (loanId: string, returnData: {
    tanggalKembali: string;
    jamKembali: string;
    kondisiKembali: 'Baik' | 'Rusak' | 'Hilang';
    keteranganKembali?: string;
    tindakLanjutGantiRugi?: string;
    namaPetugasPenerima: string;
  }) => {
    const targetLoan = loans.find(l => l.id === loanId);
    if (!targetLoan) return;

    const newStatus: EquipmentLoan['status'] = 
      returnData.kondisiKembali === 'Baik' ? 'Sudah Kembali' : 'Rusak/Hilang';

    // Update loan transaction
    setLoans(prev => prev.map(l => {
      if (l.id === loanId) {
        return {
          ...l,
          ...returnData,
          status: newStatus
        };
      }
      return l;
    }));

    // Update inventory stock and condition
    setInventory(prev => prev.map(invItem => {
      const match = targetLoan.items.find(it => it.itemId === invItem.id);
      if (match) {
        let updatedJumlahTersedia = invItem.jumlahTersedia;
        let updatedJumlahTotal = invItem.jumlahTotal;
        let updatedKondisi = invItem.kondisi;

        if (returnData.kondisiKembali === 'Baik') {
          // Return back to available
          updatedJumlahTersedia = Math.min(invItem.jumlahTotal, invItem.jumlahTersedia + match.jumlah);
        } else if (returnData.kondisiKembali === 'Rusak') {
          // Put back in inventory, but set condition to Rusak Ringan/Berat
          updatedJumlahTersedia = Math.min(invItem.jumlahTotal, invItem.jumlahTersedia + match.jumlah);
          updatedKondisi = 'Rusak Ringan';
        } else if (returnData.kondisiKembali === 'Hilang') {
          // Deduct from total
          updatedJumlahTotal = Math.max(0, invItem.jumlahTotal - match.jumlah);
        }

        return {
          ...invItem,
          jumlahTotal: updatedJumlahTotal,
          jumlahTersedia: updatedJumlahTersedia,
          kondisi: updatedKondisi
        };
      }
      return invItem;
    }));
  };

  const deleteLoan = (id: string) => {
    setLoans(prev => prev.filter(l => l.id !== id));
  };

  // Cash Transactions
  const addCashTransaction = (trxData: Omit<CashTransaction, 'id' | 'saldoSetelahnya'>) => {
    const lastTrx = cashTransactions[cashTransactions.length - 1];
    const prevSaldo = lastTrx ? lastTrx.saldoSetelahnya : 0;
    const newSaldo = trxData.jenis === 'Penerimaan'
      ? prevSaldo + trxData.nominal
      : prevSaldo - trxData.nominal;

    const newTrx: CashTransaction = {
      ...trxData,
      id: `kas-${Date.now()}`,
      saldoSetelahnya: newSaldo
    };

    setCashTransactions(prev => [...prev, newTrx]);
  };

  const deleteCashTransaction = (id: string) => {
    setCashTransactions(prev => prev.filter(c => c.id !== id));
  };

  // Attendance
  const updateAttendanceRecap = (rombel: string, data: Partial<StudentAttendanceRecap>) => {
    setAttendanceRecaps(prev => prev.map(a => a.rombel === rombel ? { ...a, ...data } : a));
  };

  const bulkUpdateAttendance = (
    newRecaps: StudentAttendanceRecap[], 
    logInfo: { namaFile: string; tipe: SpreadsheetImportLog['tipeImport']; rombel: string; catatan: string }
  ) => {
    const previousSnapshot = JSON.parse(JSON.stringify(attendanceRecaps));

    setAttendanceRecaps(prev => {
      return prev.map(existing => {
        const match = newRecaps.find(nr => nr.rombel === existing.rombel);
        return match ? { ...existing, ...match } : existing;
      });
    });

    // Log the import
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);

    const newLog: SpreadsheetImportLog = {
      id: `log-imp-${Date.now()}`,
      tanggal: dateStr,
      waktu: timeStr,
      namaPengguna: currentUser.name,
      namaFile: logInfo.namaFile,
      tipeImport: logInfo.tipe,
      rombel: logInfo.rombel,
      periode: 'September 2026',
      jumlahBerhasil: newRecaps.length,
      jumlahGagal: 0,
      snapshotSebelumnya: previousSnapshot,
      catatan: logInfo.catatan
    };

    setImportLogs(prev => [newLog, ...prev]);
  };

  const rollbackAttendanceImport = (logId: string) => {
    const targetLog = importLogs.find(l => l.id === logId);
    if (!targetLog) {
      return { success: false, message: 'Log impor tidak ditemukan.' };
    }

    if (!targetLog.snapshotSebelumnya || targetLog.snapshotSebelumnya.length === 0) {
      return { success: false, message: 'Tidak ada snapshot data cadangan untuk log ini.' };
    }

    setAttendanceRecaps(targetLog.snapshotSebelumnya);
    setImportLogs(prev => prev.map(l => l.id === logId ? { ...l, catatan: `${l.catatan} (DIBATALKAN / ROLLBACK)` } : l));

    return { success: true, message: `Berhasil membatalkan impor dari file "${targetLog.namaFile}". Data presensi dikembalikan ke kondisi sebelum impor.` };
  };

  const addImportLog = (log: Omit<SpreadsheetImportLog, 'id'>) => {
    const newLog: SpreadsheetImportLog = {
      ...log,
      id: `log-imp-${Date.now()}`
    };
    setImportLogs(prev => [newLog, ...prev]);
  };

  // Piket Methods
  const addPiketReport = (reportData: Omit<PiketReport, 'id' | 'nomorLaporan' | 'createdAt'>): PiketReport => {
    const seq = String(piketReports.length + 1).padStart(3, '0');
    const dateFormatted = reportData.tanggal.replace(/-/g, '/');
    const nomorLaporan = `PKT/${dateFormatted}/${seq}`;
    const newReport: PiketReport = {
      ...reportData,
      id: `pkt-${Date.now()}`,
      nomorLaporan,
      createdAt: new Date().toISOString()
    };

    // Real-time sync: reflect absent counts into attendanceRecaps
    if (reportData.rekapKelas && reportData.rekapKelas.length > 0) {
      setAttendanceRecaps(prev => prev.map(item => {
        const classPiket = reportData.rekapKelas.find(rk => rk.rombel === item.rombel);
        if (classPiket) {
          return {
            ...item,
            sakit: item.sakit + classPiket.sakit,
            izin: item.izin + classPiket.izin,
            alpa: item.alpa + classPiket.alpa,
          };
        }
        return item;
      }));
    }

    setPiketReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const updatePiketReport = (id: string, data: Partial<PiketReport>) => {
    setPiketReports(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deletePiketReport = (id: string) => {
    setPiketReports(prev => prev.filter(p => p.id !== id));
  };

  const verifyPiketReport = (id: string, catatan: string, namaKepalaSekolah: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setPiketReports(prev => prev.map(p => p.id === id ? {
      ...p,
      verifikasiKepalaSekolah: {
        diverifikasi: true,
        tanggalVerifikasi: nowStr,
        catatan,
        namaKepalaSekolah
      }
    } : p));
  };

  const updateJadwalPiket = (items: JadwalPiketItem[]) => {
    setJadwalPiket(items);
  };

  // Mutasi Siswa Methods
  const addMutationMasuk = (data: Omit<StudentMutation, 'id' | 'nomorMutasi' | 'createdAt'>) => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const seq = String(mutations.filter(m => m.jenis === 'masuk').length + 1).padStart(3, '0');
    const nomorMutasi = `MTS-M/${year}/${month}/${seq}`;

    const newMutation: StudentMutation = {
      ...data,
      id: `mts-m-${Date.now()}`,
      nomorMutasi,
      createdAt: new Date().toISOString()
    };

    // Add student to active students in Buku Induk
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      nisn: data.nisn,
      nis: data.nis,
      nama: data.namaSiswa,
      nik: data.nik,
      tempatLahir: data.tempatLahir,
      tanggalLahir: data.tanggalLahir,
      jenisKelamin: data.jenisKelamin,
      agama: data.agama,
      alamat: data.alamat,
      namaAyah: data.namaAyah,
      pekerjaanAyah: data.pekerjaanAyah,
      namaIbu: data.namaIbu,
      pekerjaanIbu: data.pekerjaanIbu,
      namaWali: data.namaWali,
      noHpOrtu: data.noHpOrtu,
      asalSd: data.asalSekolah?.namaSekolah || 'Sekolah Asal',
      tahunMasuk: new Date().getFullYear(),
      kelas: data.kelasTujuan || '7',
      rombel: data.rombelTujuan || '7A',
      status: 'aktif',
      catatanMutasi: {
        jenis: 'masuk',
        tanggal: data.tanggalMutasi,
        sekolahTujuanAsal: data.asalSekolah?.namaSekolah || '-',
        nomorSurat: data.asalSekolah?.nomorSuratPindah || nomorMutasi,
        alasan: data.alasan
      }
    };

    setStudents(prev => [newStudent, ...prev]);
    setMutations(prev => [newMutation, ...prev]);

    return { 
      success: true, 
      message: `Siswa mutasi masuk ${data.namaSiswa} berhasil dimasukkan ke Buku Induk dan ditempatkan pada rombel ${newStudent.rombel}.`, 
      mutation: newMutation 
    };
  };

  const addMutationKeluar = (data: Omit<StudentMutation, 'id' | 'nomorMutasi' | 'createdAt'>) => {
    const targetStudent = students.find(s => s.id === data.studentId || s.nisn === data.nisn);
    
    // Check loans
    const unreturnedLoan = loans.find(l => 
      (l.status === 'Dipinjam' || l.status === 'Terlambat') && 
      (l.peminjamId === data.studentId || (targetStudent && l.namaPeminjam.toLowerCase().includes(targetStudent.nama.toLowerCase())))
    );

    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const seq = String(mutations.filter(m => m.jenis === 'keluar').length + 1).padStart(3, '0');
    const nomorMutasi = `MTS-K/${year}/${month}/${seq}`;

    const newMutation: StudentMutation = {
      ...data,
      id: `mts-k-${Date.now()}`,
      nomorMutasi,
      keteranganAdministrasi: {
        statusLunas: data.keteranganAdministrasi?.statusLunas ?? true,
        catatanTunggakan: data.keteranganAdministrasi?.catatanTunggakan || 'Bebas administrasi sekolah',
        pinjamanBarangTerselesaikan: !unreturnedLoan,
        catatanBarang: unreturnedLoan ? `PERINGATAN: Memiliki barang pinjaman aktif (${unreturnedLoan.nomorPinjam} - ${unreturnedLoan.items.map(i => i.namaBarang).join(', ')})` : 'Bebas pinjaman alat sarpras'
      },
      createdAt: new Date().toISOString()
    };

    // Update student status to mutasi_keluar in Buku Induk
    if (targetStudent) {
      updateStudent(targetStudent.id, {
        status: 'mutasi_keluar',
        catatanMutasi: {
          jenis: 'keluar',
          tanggal: data.tanggalMutasi,
          sekolahTujuanAsal: data.tujuanSekolah?.namaSekolah || '-',
          nomorSurat: nomorMutasi,
          alasan: data.alasan
        }
      });
    }

    // Auto record Outgoing Letter for institutional integration
    addOutgoingLetter({
      tanggalSurat: data.tanggalMutasi,
      tujuan: data.tujuanSekolah?.namaSekolah || 'Sekolah Tujuan',
      perihal: `Surat Keterangan Pindah Sekolah a.n ${data.namaSiswa} (NISN: ${data.nisn})`,
      pembuat: 'Staf TU Kesiswaan',
      statusApproval: 'Disetujui',
      kodeKlasifikasi: '421.3',
      isiSurat: `Menerangkan kepindahan siswa atas nama ${data.namaSiswa} ke ${data.tujuanSekolah?.namaSekolah || 'sekolah tujuan'}.`
    });

    setMutations(prev => [newMutation, ...prev]);

    return { 
      success: true, 
      message: unreturnedLoan 
        ? `Mutasi keluar tercatat dengan PERINGATAN: Siswa masih memiliki barang pinjaman (${unreturnedLoan.nomorPinjam})!` 
        : `Mutasi keluar ${data.namaSiswa} berhasil diproses. Status di Buku Induk diperbarui menjadi 'Mutasi Keluar'.`, 
      mutation: newMutation 
    };
  };

  const deleteMutation = (id: string) => {
    setMutations(prev => prev.filter(m => m.id !== id));
  };

  // Compute Notifications & Alerts
  const todayStr = '2026-09-20'; // Current system date for SIMTU

  const urgentDisposisi = incomingLetters.filter(l => 
    !l.disposisi || l.disposisi.status === 'Belum' || l.sifat === 'sangat_segera'
  );

  const overdueLoans = loans.filter(l => {
    if (l.status === 'Terlambat') return true;
    if (l.status === 'Dipinjam' && l.rencanaTanggalKembali < todayStr) return true;
    return false;
  });

  const dueTodayLoans = loans.filter(l => 
    l.status === 'Dipinjam' && l.rencanaTanggalKembali === todayStr
  );

  // GTK H-90 calculation
  const impendingKgb = staff.filter(s => {
    if (!s.tmtKgbBerikutnya) return false;
    const diffDays = Math.ceil((new Date(s.tmtKgbBerikutnya).getTime() - new Date(todayStr).getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 90;
  });

  const impendingPangkat = staff.filter(s => {
    if (!s.tmtPangkatBerikutnya) return false;
    const diffDays = Math.ceil((new Date(s.tmtPangkatBerikutnya).getTime() - new Date(todayStr).getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 90;
  });

  const damagedAssets = inventory.filter(i => i.kondisi === 'Rusak Ringan' || i.kondisi === 'Rusak Berat');

  // Backup & Reset functions
  const exportDatabaseToJson = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      school,
      users,
      students,
      staff,
      leaveRequests,
      incomingLetters,
      outgoingLetters,
      expeditions,
      inventory,
      loans,
      cashTransactions,
      attendanceRecaps,
      piketReports,
      jadwalPiket,
      mutations,
      importLogs
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BACKUP_SIMTU_SMPN2_KUTASARI_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importDatabaseFromJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.school) setSchool(data.school);
      if (data.users) setUsers(data.users);
      if (data.students) setStudents(data.students);
      if (data.staff) setStaff(data.staff);
      if (data.leaveRequests) setLeaveRequests(data.leaveRequests);
      if (data.incomingLetters) setIncomingLetters(data.incomingLetters);
      if (data.outgoingLetters) setOutgoingLetters(data.outgoingLetters);
      if (data.expeditions) setExpeditions(data.expeditions);
      if (data.inventory) setInventory(data.inventory);
      if (data.loans) setLoans(data.loans);
      if (data.cashTransactions) setCashTransactions(data.cashTransactions);
      if (data.attendanceRecaps) setAttendanceRecaps(data.attendanceRecaps);
      if (data.piketReports) setPiketReports(data.piketReports);
      if (data.jadwalPiket) setJadwalPiket(data.jadwalPiket);
      if (data.mutations) setMutations(data.mutations);
      if (data.importLogs) setImportLogs(data.importLogs);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const resetToFactoryData = () => {
    setSchool(initialSchoolIdentity);
    setUsers(initialUsers);
    setCurrentUser(initialUsers.find(u => u.role === 'kepala_tu') || initialUsers[0]);
    setStudents(initialStudents);
    setStaff(initialStaff);
    setLeaveRequests(initialLeaveRequests);
    setIncomingLetters(initialIncomingLetters);
    setOutgoingLetters(initialOutgoingLetters);
    setExpeditions(initialExpeditions);
    setInventory(initialInventory);
    setLoans(initialLoans);
    setCashTransactions(initialCashTransactions);
    setAttendanceRecaps(initialAttendanceRecap);
    setPiketReports(initialPiketReports);
    setJadwalPiket(initialJadwalPiket);
    setMutations(initialStudentMutations);
    setImportLogs(initialImportLogs);
    
    // Clear custom localStorage keys
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(k);
      }
    });
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      switchRole,
      activeModule,
      setActiveModule,
      school,
      updateSchool,
      users,
      addUser,
      updateUser,
      deleteUser,
      students,
      addStudent,
      updateStudent,
      deleteStudent,
      deleteAllStudents,
      cleanCorruptStudents,
      importStudents,
      replaceStudents,
      staff,
      addStaff,
      updateStaff,
      deleteStaff,
      leaveRequests,
      addLeaveRequest,
      updateLeaveStatus,
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
      updateExpedition,
      inventory,
      addInventory,
      updateInventory,
      deleteInventory,
      loans,
      createLoan,
      returnLoan,
      deleteLoan,
      cashTransactions,
      addCashTransaction,
      deleteCashTransaction,
      attendanceRecaps,
      updateAttendanceRecap,
      bulkUpdateAttendance,
      rollbackAttendanceImport,
      piketReports,
      addPiketReport,
      updatePiketReport,
      deletePiketReport,
      verifyPiketReport,
      jadwalPiket,
      updateJadwalPiket,
      mutations,
      addMutationMasuk,
      addMutationKeluar,
      deleteMutation,
      importLogs,
      addImportLog,
      notifications: {
        urgentDisposisi,
        overdueLoans,
        dueTodayLoans,
        impendingKgb,
        impendingPangkat,
        damagedAssets
      },
      exportDatabaseToJson,
      importDatabaseFromJson,
      resetToFactoryData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
