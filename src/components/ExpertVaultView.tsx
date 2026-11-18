import React, { useState } from 'react';
import { 
  BookOpen, ThumbsUp, PlusCircle, Search, Volume2, 
  VolumeX, CheckCircle, Award, Sparkles, Filter, X
} from 'lucide-react';
import { ExpertVaultEntry } from '../types/index.ts';

interface ExpertVaultViewProps {
  entries: ExpertVaultEntry[];
  onAddNewEntry: (entry: Partial<ExpertVaultEntry>) => Promise<void>;
}

export const ExpertVaultView: React.FC<ExpertVaultViewProps> = ({
  entries,
  onAddNewEntry
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  // New entry form state
  const [formTitle, setFormTitle] = useState('');
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formUnit, setFormUnit] = useState('Kebun Sei Karang');
  const [formExp, setFormExp] = useState('25');
  const [formCategory, setFormCategory] = useState<ExpertVaultEntry['category']>('Panen & Taksasi');
  const [formSummary, setFormSummary] = useState('');
  const [formTacit, setFormTacit] = useState('');
  const [formSteps, setFormSteps] = useState('');
  const [formAudioTranscript, setFormAudioTranscript] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Semua', 'Panen & Taksasi', 'Pemupukan', 'Hama & Penyakit', 'Manajemen Mandor'];

  const filteredEntries = entries.filter((entry) => {
    const matchesCat = selectedCategory === 'Semua' || entry.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      entry.title.toLowerCase().includes(query) ||
      entry.contributor.name.toLowerCase().includes(query) ||
      entry.summary.toLowerCase().includes(query) ||
      entry.tags.some(t => t.toLowerCase().includes(query));
    return matchesCat && matchesQuery;
  });

  const handleToggleAudio = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (activeAudioId === id) {
      window.speechSynthesis.cancel();
      setActiveAudioId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95; // calm veteran tone

    utterance.onend = () => setActiveAudioId(null);
    utterance.onerror = () => setActiveAudioId(null);

    setActiveAudioId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleVoteHelpful = (id: string, initialCount: number) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [id]: (prev[id] || initialCount) + 1
    }));
  };

  const handleSubmitNewVault = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formName || !formSummary || !formTacit) return;

    setIsSubmitting(true);
    try {
      const stepsArray = formSteps
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      await onAddNewEntry({
        title: formTitle,
        contributor: {
          name: formName,
          role: formRole || 'Planter Senior',
          unitOrigin: formUnit,
          experienceYears: Number(formExp) || 20
        },
        category: formCategory,
        summary: formSummary,
        tacitInsight: formTacit,
        practicalSteps: stepsArray.length > 0 ? stepsArray : ['Terapkan pemeriksaan berkala di ancak kerja.'],
        audioTranscript: formAudioTranscript || formTacit,
        tags: [formCategory, formUnit]
      });

      setShowSubmitModal(false);
      // Reset form
      setFormTitle('');
      setFormName('');
      setFormRole('');
      setFormSummary('');
      setFormTacit('');
      setFormSteps('');
      setFormAudioTranscript('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-800 dark:text-emerald-400 uppercase">
            <span>Retensi Pengetahuan Korporat</span>
            <span>·</span>
            <span>PTPN IV Regional III</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
            Expert Repository & Tacit Knowledge Vault
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
            Mengabadikan keahlian bertahun-tahun para mantri, asisten kebun senior, dan pensiunan agar kiat taktis lapangan tidak hilang dan dapat dipelajari generasi baru.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          Abadikan Kiat Planter Senior
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Categories (Functional buttons) */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600 dark:text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kiat, nama planter, atau hama..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-600 dark:placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* Grid of Expert Knowledge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEntries.map((entry) => {
          const votes = helpfulVotes[entry.id] ?? entry.helpfulCount;
          const isAudioPlaying = activeAudioId === entry.id;

          return (
            <div
              key={entry.id}
              className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-600/60 dark:hover:border-emerald-500/60 transition-all"
            >
              <div>
                {/* Contributor Profile Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-sm border-2 border-amber-400/30 shrink-0">
                      {entry.contributor.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <span title="Verifikasi Planter Senior">
                          <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-400">
                        {entry.contributor.role}
                      </div>
                      <div className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
                        {entry.contributor.unitOrigin} · {entry.contributor.experienceYears} Thn Pengabdian
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 shrink-0">
                    {entry.category}
                  </span>
                </div>

                {/* Article Title */}
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-2 leading-snug">
                  {entry.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                  {entry.summary}
                </p>

                {/* Tacit Insight Callout (The core field wisdom) */}
                <div className="mt-4 p-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    Intisari Pengalaman Lapangan (Tacit Knowledge):
                  </div>
                  <div className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed italic">
                    "{entry.tacitInsight}"
                  </div>
                </div>

                {/* Practical Steps Checklist */}
                {entry.practicalSteps && entry.practicalSteps.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                      Kiat & Prosedur Praktis:
                    </div>
                    <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                      {entry.practicalSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
                {/* Audio Recording Playback Button */}
                <button
                  onClick={() => handleToggleAudio(entry.id, entry.audioTranscript || entry.tacitInsight)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isAudioPlaying
                      ? 'bg-amber-500 text-stone-950 font-semibold'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700'
                  }`}
                >
                  {isAudioPlaying ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Hentikan Rekaman Suara</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Putar Pesan Suara Senior</span>
                    </>
                  )}
                </button>

                {/* Helpful count */}
                <button
                  onClick={() => handleVoteHelpful(entry.id, entry.helpfulCount)}
                  className="flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="tabular-nums font-mono">{votes}</span>
                  <span className="hidden sm:inline">Bermanfaat</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-8">
          <BookOpen className="w-8 h-8 mx-auto text-stone-400 mb-2" />
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            Tidak ada kiat yang cocok dengan pencarian
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Coba ubah kata kunci atau pilih kategori lain.
          </p>
        </div>
      )}

      {/* Modal: Abadikan Pengetahuan Senior */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl max-w-xl w-full p-6 shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Dokumentasi Kiat Lapangan Planter Senior
                </h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewVault} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                  Judul Kiat / Pengalaman Praktis:
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Trik Menghitung Kerapatan Panen di Lahan Bergelombang"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    Nama Kontributor Senior:
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Bpk. Marpaung"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    Jabatan Terakhir / Pengabdian:
                  </label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="Contoh: Mantan Asisten Tanaman (27 Thn)"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    Unit Asal Kebun:
                  </label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="Kebun Sei Karang">Kebun Sei Karang</option>
                    <option value="Kebun Tanah Itam Hulu">Kebun Tanah Itam Hulu</option>
                    <option value="Kebun Adolina">Kebun Adolina</option>
                    <option value="Kebun Pabatu">Kebun Pabatu</option>
                    <option value="Kebun Sawit Langkat">Kebun Sawit Langkat</option>
                    <option value="Kebun Marjandi">Kebun Marjandi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    Kategori Pengetahuan:
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="Panen & Taksasi">Panen & Taksasi</option>
                    <option value="Pemupukan">Pemupukan</option>
                    <option value="Hama & Penyakit">Hama & Penyakit</option>
                    <option value="Manajemen Mandor">Manajemen Mandor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                  Ringkasan Masalah Lapangan:
                </label>
                <textarea
                  rows={2}
                  required
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Jelaskan kondisi kendala lapangan yang ingin diselesaikan..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-800 dark:text-emerald-400 mb-1">
                  Intisari Kiat Praktis (Tacit Knowledge):
                </label>
                <textarea
                  rows={3}
                  required
                  value={formTacit}
                  onChange={(e) => setFormTacit(e.target.value)}
                  placeholder="Kiat rahasia lapangan yang tidak tertulis eksplisit di buku teks..."
                  className="w-full px-3 py-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/20 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                  Langkah-Langkah Kerja Lapangan (1 langkah per baris):
                </label>
                <textarea
                  rows={3}
                  value={formSteps}
                  onChange={(e) => setFormSteps(e.target.value)}
                  placeholder="Langkah 1: Periksa kelopak jatuh&#10;Langkah 2: Kalibrasi takaran mangkok&#10;Langkah 3: Pantau ancak panen jam 13.00"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan ke Expert Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
