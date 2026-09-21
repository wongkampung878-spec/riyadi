import React from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolLogo } from './SchoolLogo';

interface LetterheadProps {
  showBorder?: boolean;
}

export const Letterhead: React.FC<LetterheadProps> = ({ showBorder = true }) => {
  const { school } = useApp();

  return (
    <div className="w-full text-black mb-6">
      <div className="flex items-center justify-between gap-4 pb-2">
        {/* Logo Resmi SMP Negeri 2 Kutasari */}
        <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
          <SchoolLogo className="w-18 h-18 drop-shadow-xs" />
        </div>

        {/* Kop Surat Header Text */}
        <div className="flex-1 text-center font-serif">
          <h4 className="text-sm font-semibold tracking-wider uppercase text-slate-800">
            PEMERINTAH KABUPATEN PURBALINGGA
          </h4>
          <h3 className="text-base font-bold tracking-wide uppercase text-slate-900">
            DINAS PENDIDIKAN DAN KEBUDAYAAN
          </h3>
          <h2 className="text-xl font-extrabold tracking-widest uppercase text-blue-950 mt-0.5">
            {school.namaSekolah}
          </h2>
          <p className="text-xs text-slate-700 font-sans mt-1">
            {school.alamatLengkap}, {school.kecamatan}, {school.kabupaten}, {school.provinsi} {school.kodePos}
          </p>
          <p className="text-[11px] text-slate-600 font-sans">
            Telepon: {school.telepon} | Pos-el: {school.email} | Laman: {school.website}
          </p>
        </div>

        {/* Right Seal / Akreditasi Badge */}
        <div className="w-20 h-20 flex-shrink-0 flex flex-col items-center justify-center text-center">
          <div className="border border-slate-700 rounded px-2 py-1 bg-slate-50">
            <span className="text-[9px] block text-slate-500 font-sans font-semibold">NPSN</span>
            <span className="text-xs font-mono font-bold text-slate-900">{school.npsn}</span>
            <span className="text-[8px] block font-bold text-emerald-700 uppercase">Akreditasi A</span>
          </div>
        </div>
      </div>

      {showBorder && (
        <div className="w-full">
          <div className="border-t-2 border-slate-900 w-full mb-0.5" />
          <div className="border-t border-slate-800 w-full" />
        </div>
      )}
    </div>
  );
};
