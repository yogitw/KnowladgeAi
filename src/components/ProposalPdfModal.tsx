import React from 'react';
import { X, FileText, Download, CheckCircle, ExternalLink, Sparkles, Building, Target, Lightbulb } from 'lucide-react';

interface ProposalPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProposalPdfModal: React.FC<ProposalPdfModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const pdfPath = `${import.meta.env.BASE_URL}assets/aistudio/PlanterKnowledge_Hub_Proposal__1__43ac70af.pdf`;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-4">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                <span>Dokumen Proposal Resmi</span>
                <span>·</span>
                <span>5G Innovation Challenge 2026</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                PlanterKnowledge Hub: Internal Expert Repository & Operational SOP Copilot
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfPath}
              download="PlanterKnowledge_Hub_Proposal_PTPN_IV.pdf"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh PDF Asli
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-800 dark:text-stone-200 text-xs sm:text-sm">
          {/* Executive Overview Banner */}
          <div className="p-4 rounded-xl bg-emerald-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Inisiasi Inovasi PTPN IV Regional III
              </div>
              <div className="text-lg font-bold mt-1">
                Kompetisi 5G Innovation Challenge 2026
              </div>
              <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
                Dokumen usulan inovasi aplikasi PlanterKnowledge Hub untuk mentransformasi operasional lini depan perkebunan kelapa sawit secara terpadu.
              </p>
            </div>
          </div>

          {/* 5 Points Grid based on OCR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Point 1 */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-2">
              <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-700" />
                1. Context / Customer
              </div>
              <ul className="space-y-1 text-xs text-stone-600 dark:text-stone-300">
                <li><strong>Customer:</strong> Para asisten kebun, mandor, staf operasional lini depan, serta pegawai baru di lingkungan PTPN IV Regional III.</li>
                <li><strong>Context:</strong> Membantu mereka mengakses SOP perkebunan secara instan dan mendokumentasikan pengetahuan taktis (tacit knowledge) dari para pegawai senior/pensiunan agar tidak hilang begitu saja ketika mereka meninggalkan perusahaan.</li>
              </ul>
            </div>

            {/* Point 2 */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-2">
              <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-600" />
                2. The Problem (Masalah yang Diselesaikan)
              </div>
              <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                <li><strong>Silo Mentality:</strong> Hambatan koordinasi dan pertukaran informasi antar divisi atau unit kebun yang terisolasi.</li>
                <li><strong>Kehilangan Pengetahuan (Knowledge Loss):</strong> Keahlian bertahun-tahun pegawai senior hilang saat pensiun tanpa dokumentasi digital terpusat.</li>
                <li><strong>Inefisiensi Lapangan:</strong> Kesulitan mencari rujukan SOP cepat saat kendala mendadak, memperlambat keputusan.</li>
              </ul>
            </div>

            {/* Point 3 */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-2">
              <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                3. Solution (Solusi Inovatif)
              </div>
              <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                <li><strong>AI Copilot SOP:</strong> Karyawan bertanya langsung lewat teks/suara mengenai aturan operasional (takaran pupuk, hama), sistem menampilkan rujukan SOP resmi instan.</li>
                <li><strong>Expert Repository & Vault:</strong> Mengabadikan video dokumentasi, kiat lapangan (best practices), dan catatan pengalaman pegawai senior.</li>
                <li><strong>Kolaborasi Lintas Unit:</strong> Memecah sekat informasi (silo mentality) dengan forum berbagi antar afdeling/unit kerja.</li>
              </ul>
            </div>

            {/* Point 4 & 5 */}
            <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-2">
              <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                4 & 5. Resources & Potential Impact
              </div>
              <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                <li><strong>Resources:</strong> Tim inovator internal (maks 4 orang lintas IT, tanaman, SDM), Dokumen SOP resmi perusahaan, platform web/mobile ringan.</li>
                <li><strong>GO AI (Digital Optimization):</strong> Menghilangkan pencarian manual dokumen, mempercepat orientasi pegawai baru secara agile.</li>
                <li><strong>Retensi Korporat:</strong> Menjaga aset intelektual pengalaman bertahun-tahun planters senior.</li>
                <li><strong>Feasibility:</strong> Dapat diwujudkan dalam waktu &lt; 1 tahun berbasis pemanfaatan teknologi digital internal.</li>
              </ul>
            </div>
          </div>

          {/* Direct Local PDF Preview / Frame */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-950 p-4 text-center">
            <div className="text-xs text-stone-600 dark:text-stone-400 mb-2">
              Dokumen tersimpan secara lokal pada sistem: <code className="font-mono text-emerald-800 dark:text-emerald-400">{pdfPath}</code>
            </div>
            <a
              href={pdfPath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Buka Berkas PDF di Tab Baru
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
