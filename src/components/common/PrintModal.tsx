import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { Letterhead } from './Letterhead';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  documentNumber?: string;
  children: React.ReactNode;
  hideLetterhead?: boolean;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  title,
  documentNumber,
  children,
  hideLetterhead = false
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden print:border-none print:shadow-none print:max-h-none print:max-w-none print:rounded-none">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white no-print">
          <div>
            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
              <Printer className="w-4 h-4 text-blue-400" />
              {title}
            </h3>
            {documentNumber && (
              <p className="text-xs text-slate-300 font-mono">No: {documentNumber}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / Simpan PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paper Document Preview Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 print:bg-white print:p-0">
          <div className="max-w-[210mm] mx-auto bg-white p-6 sm:p-10 shadow-md border border-slate-200 text-slate-900 min-h-[297mm] print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none">
            {!hideLetterhead && <Letterhead />}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
