import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, AlertTriangle, ShieldCheck, 
  Search, ArrowRight, ExternalLink, Sparkles 
} from 'lucide-react';
import { SopDocument } from '../types/index.ts';

interface SopCatalogueViewProps {
  sops: SopDocument[];
  onConsultCopilot: (sopCode: string, title: string) => void;
  onOpenPdf: () => void;
  initialSelectedCode?: string;
}

export const SopCatalogueView: React.FC<SopCatalogueViewProps> = ({
  sops,
  onConsultCopilot,
  onOpenPdf,
  initialSelectedCode
}) => {
  const [selectedCode, setSelectedCode] = useState<string>(
    initialSelectedCode || sops[0]?.code || 'SOP-TAN-01'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const selectedSop = sops.find(s => s.code === selectedCode) || sops[0];

  const filteredSops = sops.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.code.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-800 dark:text-emerald-400 uppercase">
            <span>Repositori Dokumen Resmi</span>
            <span>·</span>
            <span>PTPN IV Regional III</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
            Katalog Standar Operasional Prosedur (SOP)
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
            Arsip digital resmi standar agronomi kelapa sawit untuk seluruh asisten afdeling, mandor, dan staf pengawasan kebun.
          </p>
        </div>

        <button
          onClick={onOpenPdf}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-lg text-xs font-semibold transition-colors shadow-xs shrink-0"
        >
          <FileText className="w-4 h-4" />
          Lihat Dokumen Proposal 5G
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SOP Index List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600 dark:text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode SOP atau judul..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-600 dark:placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredSops.map((sop) => {
              const isSelected = selectedSop?.code === sop.code;
              return (
                <button
                  key={sop.id}
                  onClick={() => setSelectedCode(sop.code)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-emerald-600/50 text-stone-900 dark:text-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-mono font-bold ${isSelected ? 'text-amber-300' : 'text-emerald-800 dark:text-emerald-400'}`}>
                      {sop.code}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-emerald-900/80 text-emerald-100' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}>
                      {sop.category}
                    </span>
                  </div>
                  <div className={`text-xs font-semibold line-clamp-2 ${isSelected ? 'text-white' : 'text-stone-900 dark:text-stone-100'}`}>
                    {sop.title}
                  </div>
                  <div className={`text-[11px] mt-1.5 ${isSelected ? 'text-emerald-200' : 'text-stone-500 dark:text-stone-400'}`}>
                    {sop.version} · {sop.effectiveDate}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full SOP Document Inspector (8 Cols) */}
        {selectedSop && (
          <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-6">
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400 text-sm">
                    {selectedSop.code}
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">·</span>
                  <span className="text-stone-500 dark:text-stone-400">
                    Kategori: {selectedSop.category}
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">·</span>
                  <span className="text-stone-500 dark:text-stone-400">
                    {selectedSop.version}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {selectedSop.title}
                </h2>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Berlaku Efektif: {selectedSop.effectiveDate} · Dokumen Resmi PTPN IV Regional III
                </div>
              </div>

              <button
                onClick={() => onConsultCopilot(selectedSop.code, selectedSop.title)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shrink-0 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Konsultasikan ke Copilot
              </button>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                Ringkasan Eksekutif & Tujuan Standar
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-4 rounded-xl border border-stone-200 dark:border-stone-700/60">
                {selectedSop.summary}
              </p>
            </div>

            {/* Key Clauses */}
            <div>
              <h3 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                Poin Baku & Ketentuan Operasional
              </h3>
              <div className="space-y-2">
                {selectedSop.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg border border-stone-100 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-800/30 text-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="text-stone-800 dark:text-stone-200 leading-relaxed">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tolerance Limit */}
            <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
              <div className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                Batas Toleransi Deviasi Lapangan:
              </div>
              <div className="text-xs font-mono text-stone-800 dark:text-stone-200">
                {selectedSop.toleranceLimit}
              </div>
            </div>

            {/* Critical Dos and Don'ts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Critical Do */}
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Wajib Dilakukan (Mandatory Do):
                </div>
                <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                  {selectedSop.criticalDo.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Critical Don't */}
              <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 space-y-2">
                <div className="text-xs font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Dilarang Keras (Critical Don't):
                </div>
                <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                  {selectedSop.criticalDont.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold shrink-0">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
