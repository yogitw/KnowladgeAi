import React, { useState } from 'react';
import { 
  MessageSquare, PlusCircle, CheckCircle2, ChevronDown, 
  Send, User, Search, Eye, X, CornerDownRight, Check
} from 'lucide-react';
import { ForumThread } from '../types/index.ts';

interface ForumAfdelingViewProps {
  threads: ForumThread[];
  onAddNewThread: (thread: Partial<ForumThread>) => Promise<void>;
  onAddReply: (threadId: string, replyContent: string, author: string, unit: string) => Promise<void>;
}

export const ForumAfdelingView: React.FC<ForumAfdelingViewProps> = ({
  threads,
  onAddNewThread,
  onAddReply
}) => {
  const [selectedUnit, setSelectedUnit] = useState('Semua Unit');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(threads[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('Asisten Lapangan');
  const [replyUnit, setReplyUnit] = useState('Kebun Adolina');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // New Thread Modal
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Agronomi & Drainase');
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('Asisten Afdeling');
  const [newUnit, setNewUnit] = useState('Kebun Adolina');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('');
  const [isSubmittingThread, setIsSubmittingThread] = useState(false);

  const units = ['Semua Unit', 'Kebun Adolina', 'Kebun Pabatu', 'Kebun Sei Karang', 'Kebun Tanah Itam Hulu', 'Kebun Sawit Langkat'];

  const filteredThreads = threads.filter((t) => {
    const matchesUnit = selectedUnit === 'Semua Unit' || t.unitOrigin.includes(selectedUnit);
    const matchesStatus = selectedStatus === 'Semua Status' || 
      (selectedStatus === 'Terselesaikan' && t.status === 'Resolved') ||
      (selectedStatus === 'Butuh Solusi' && t.status === 'Open');
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.tags.some(tag => tag.toLowerCase().includes(query));
    return matchesUnit && matchesStatus && matchesQuery;
  });

  const handleSendReply = async (threadId: string) => {
    if (!replyText.trim() || isSubmittingReply) return;
    setIsSubmittingReply(true);
    try {
      await onAddReply(threadId, replyText.trim(), replyAuthor, replyUnit);
      setReplyText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || isSubmittingThread) return;

    setIsSubmittingThread(true);
    try {
      const tagList = newTags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await onAddNewThread({
        title: newTitle,
        category: newCategory,
        author: newAuthor || 'Planter PTPN IV',
        authorRole: newRole,
        unitOrigin: newUnit,
        description: newDescription,
        tags: tagList.length > 0 ? tagList : ['Operasional']
      });

      setShowNewThreadModal(false);
      setNewTitle('');
      setNewDescription('');
      setNewTags('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingThread(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Title & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-800 dark:text-emerald-400 uppercase">
            <span>Memecah Silo Mentality Antar Unit Kerja</span>
            <span>·</span>
            <span>PTPN IV Regional III</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
            Forum Kolaborasi Lintas Afdeling
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
            Ruang bertukar solusi agronomis langsung antar afdeling dan unit kebun. Permasalahan drainase, hama, maupun kendala panen dapat dipecahkan bersama tanpa sekat birokrasi.
          </p>
        </div>

        <button
          onClick={() => setShowNewThreadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          Buka Diskusi Kendala Lapangan
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Unit selector */}
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
          >
            {units.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>

          {/* Status selector */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg">
            {['Semua Status', 'Butuh Solusi', 'Terselesaikan'].map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                  selectedStatus === st
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-semibold shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-600 dark:text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari topik diskusi atau afdeling..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-600 dark:placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* Threads List */}
      <div className="space-y-4">
        {filteredThreads.map((thread) => {
          const isExpanded = expandedThreadId === thread.id;

          return (
            <div
              key={thread.id}
              className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden transition-all"
            >
              {/* Thread Header Row */}
              <div
                onClick={() => setExpandedThreadId(isExpanded ? null : thread.id)}
                className="p-4 sm:p-5 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                      {thread.unitOrigin}
                    </span>
                    <span className="text-stone-300 dark:text-stone-700">·</span>
                    <span className="text-stone-500 dark:text-stone-400">
                      Oleh {thread.author} ({thread.authorRole})
                    </span>
                    <span className="text-stone-300 dark:text-stone-700">·</span>
                    <span className="text-stone-500 dark:text-stone-400">
                      {thread.timestamp}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    {thread.status === 'Resolved' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-emerald-600" />
                        Terselesaikan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                        Butuh Solusi
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
                  {thread.title}
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                  {thread.description}
                </p>

                <div className="flex items-center justify-between mt-3 text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                      {thread.replies.length} Solusi
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-stone-400" />
                      {thread.views} Dilihat
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-medium text-emerald-800 dark:text-emerald-400">
                    <span>{isExpanded ? 'Tutup Diskusi' : 'Buka Diskusi & Beri Solusi'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Expanded Discussion Details & Replies */}
              {isExpanded && (
                <div className="p-4 sm:p-6 bg-stone-50/70 dark:bg-stone-900/80 border-t border-stone-200 dark:border-stone-800 space-y-4">
                  {/* Full problem statement */}
                  <div className="p-4 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <div className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Uraian Lengkap Kendala di Lapangan:
                    </div>
                    <div className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line">
                      {thread.description}
                    </div>
                  </div>

                  {/* Replies List */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                      Solusi & Rekomendasi Lintas Unit ({thread.replies.length}):
                    </div>

                    {thread.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-xl border transition-all ${
                          reply.isVerifiedSolution
                            ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                            : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                              {reply.author.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                                <span>{reply.author}</span>
                                {reply.isVerifiedSolution && (
                                  <span className="text-[10px] bg-emerald-700 text-white font-semibold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    Solusi Terverifikasi Askep
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                                {reply.authorRole} · {reply.unitOrigin}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-stone-600 dark:text-stone-400">
                            {reply.timestamp}
                          </span>
                        </div>

                        <div className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed pl-9">
                          {reply.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Reply Form */}
                  <div className="p-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <div className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-2 flex items-center gap-1.5">
                      <CornerDownRight className="w-3.5 h-3.5 text-emerald-700" />
                      Tulis Rekomendasi Solusi Anda untuk Afdeling Ini:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        value={replyAuthor}
                        onChange={(e) => setReplyAuthor(e.target.value)}
                        placeholder="Nama & Jabatan Anda"
                        className="px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                      />
                      <select
                        value={replyUnit}
                        onChange={(e) => setReplyUnit(e.target.value)}
                        className="px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                      >
                        <option value="Kebun Adolina">Kebun Adolina</option>
                        <option value="Kebun Pabatu">Kebun Pabatu</option>
                        <option value="Kebun Sei Karang">Kebun Sei Karang</option>
                        <option value="Kebun Tanah Itam Hulu">Kebun Tanah Itam Hulu</option>
                        <option value="Kebun Sawit Langkat">Kebun Sawit Langkat</option>
                      </select>
                    </div>

                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Bagikan langkah kerja atau pengalaman praktis di unit Anda untuk memecahkan kendala ini..."
                      className="w-full px-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                    />

                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleSendReply(thread.id)}
                        disabled={!replyText.trim() || isSubmittingReply}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Solusi Lintas Unit</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredThreads.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-8">
          <MessageSquare className="w-8 h-8 mx-auto text-stone-400 mb-2" />
          <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            Belum ada diskusi yang cocok
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Buka diskusi baru untuk meminta masukan dari rekan afdeling lain.
          </p>
        </div>
      )}

      {/* Modal: New Thread */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl max-w-lg w-full p-6 shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 mb-4">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Buka Diskusi Kendala Lapangan
              </h3>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                  Judul Kendala / Topik Lapangan:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Genangan Air di Pasar Pikul Blok 15 Pasca Hujan Lebat"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    Nama Anda:
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Contoh: Rian Pratama"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    Jabatan:
                  </label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    Asal Unit Kebun:
                  </label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="Kebun Adolina">Kebun Adolina</option>
                    <option value="Kebun Pabatu">Kebun Pabatu</option>
                    <option value="Kebun Sei Karang">Kebun Sei Karang</option>
                    <option value="Kebun Tanah Itam Hulu">Kebun Tanah Itam Hulu</option>
                    <option value="Kebun Sawit Langkat">Kebun Sawit Langkat</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    Kategori:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="Agronomi & Drainase">Agronomi & Drainase</option>
                    <option value="Proteksi Hama">Proteksi Hama</option>
                    <option value="Panen & Mutu TBS">Panen & Mutu TBS</option>
                    <option value="Pemupukan">Pemupukan</option>
                    <option value="Logistik & Transport">Logistik & Transport</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                  Uraian Detail Kondisi di Lapangan:
                </label>
                <textarea
                  rows={4}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Jelaskan nomor blok, luasan terpengaruh, gejala fisik, dan kendala operasional yang dihadapi..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 dark:text-stone-200 mb-1">
                  Tag Kata Kunci (pisahkan dengan koma):
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Drainase, Angkong, Musim Hujan"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingThread}
                  className="px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors"
                >
                  {isSubmittingThread ? 'Mempublikasikan...' : 'Publikasikan ke Forum'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
