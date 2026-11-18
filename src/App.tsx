import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { SopCopilotView } from './components/SopCopilotView.tsx';
import { ExpertVaultView } from './components/ExpertVaultView.tsx';
import { ForumAfdelingView } from './components/ForumAfdelingView.tsx';
import { AgronomyCalculatorView } from './components/AgronomyCalculatorView.tsx';
import { SopCatalogueView } from './components/SopCatalogueView.tsx';
import { ProposalPdfModal } from './components/ProposalPdfModal.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { SopDocument, ExpertVaultEntry, ForumThread } from './types/index.ts';
import { OFFICIAL_SOPS, EXPERT_VAULT, INITIAL_FORUM_THREADS } from './data/defaultData.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'copilot' | 'vault' | 'forum' | 'calculator' | 'catalogue'>('copilot');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isPdfOpen, setIsPdfOpen] = useState<boolean>(false);
  const [selectedSopCode, setSelectedSopCode] = useState<string>('SOP-TAN-01');

  // Application Data States (hydrated from localStorage when available)
  const [sops, setSops] = useState<SopDocument[]>(OFFICIAL_SOPS);
  const [vaultEntries, setVaultEntries] = useState<ExpertVaultEntry[]>(() => {
    try {
      const saved = localStorage.getItem('pk_vault_entries');
      return saved ? JSON.parse(saved) : EXPERT_VAULT;
    } catch {
      return EXPERT_VAULT;
    }
  });
  const [forumThreads, setForumThreads] = useState<ForumThread[]>(() => {
    try {
      const saved = localStorage.getItem('pk_forum_threads');
      return saved ? JSON.parse(saved) : INITIAL_FORUM_THREADS;
    } catch {
      return INITIAL_FORUM_THREADS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pk_vault_entries', JSON.stringify(vaultEntries));
    } catch {
      // ignore storage quota
    }
  }, [vaultEntries]);

  useEffect(() => {
    try {
      localStorage.setItem('pk_forum_threads', JSON.stringify(forumThreads));
    } catch {
      // ignore storage quota
    }
  }, [forumThreads]);

  // Sync dark class on document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Load server-side data on mount when Express backend is present
  useEffect(() => {
    const fetchJsonIfOk = async (url: string) => {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    };

    const fetchData = async () => {
      try {
        const [sopRes, vaultRes, forumRes] = await Promise.allSettled([
          fetchJsonIfOk('/api/sop'),
          fetchJsonIfOk('/api/vault'),
          fetchJsonIfOk('/api/forum')
        ]);

        if (sopRes.status === 'fulfilled' && sopRes.value?.sops) {
          setSops(sopRes.value.sops);
        }
        if (vaultRes.status === 'fulfilled' && vaultRes.value?.vault) {
          setVaultEntries(vaultRes.value.vault);
        }
        if (forumRes.status === 'fulfilled' && forumRes.value?.threads) {
          setForumThreads(forumRes.value.threads);
        }
      } catch {
        // Static hosting mode uses local default dataset + localStorage
      }
    };

    fetchData();
  }, []);

  // Handler for adding new expert vault entry
  const handleAddNewVaultEntry = async (entryData: Partial<ExpertVaultEntry>) => {
    try {
      const res = await fetch('/api/vault/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && data.entry) {
        setVaultEntries(prev => [data.entry, ...prev]);
      } else {
        throw new Error(data.error);
      }
    } catch {
      // Local fallback (GitHub Pages / offline)
      const fallbackEntry: ExpertVaultEntry = {
        id: `vault-${Date.now()}`,
        title: entryData.title || 'Kiat Lapangan',
        contributor: entryData.contributor || {
          name: 'Planter Senior',
          role: 'Purna Bakti',
          unitOrigin: 'PTPN IV Regional III',
          experienceYears: 20
        },
        category: entryData.category || 'Panen & Taksasi',
        dateShared: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
        summary: entryData.summary || '',
        practicalSteps: entryData.practicalSteps || [],
        tacitInsight: entryData.tacitInsight || '',
        verifiedBy: 'Dewan Riset PTPN IV',
        helpfulCount: 1,
        tags: entryData.tags || ['Praktik Lapangan']
      };
      setVaultEntries(prev => [fallbackEntry, ...prev]);
    }
  };

  // Handler for creating new forum thread
  const handleAddNewThread = async (threadData: Partial<ForumThread>) => {
    try {
      const res = await fetch('/api/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(threadData)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && data.thread) {
        setForumThreads(prev => [data.thread, ...prev]);
      } else {
        throw new Error(data.error);
      }
    } catch {
      const fallbackThread: ForumThread = {
        id: `thread-${Date.now()}`,
        title: threadData.title || '',
        category: threadData.category || 'Agronomi',
        author: threadData.author || 'Asisten Lapangan',
        authorRole: threadData.authorRole || 'Staf',
        unitOrigin: threadData.unitOrigin || 'PTPN IV Regional III',
        timestamp: 'Baru saja',
        description: threadData.description || '',
        status: 'Open',
        views: 1,
        tags: threadData.tags || [],
        replies: []
      };
      setForumThreads(prev => [fallbackThread, ...prev]);
    }
  };

  // Handler for adding reply to thread
  const handleAddReply = async (threadId: string, content: string, author: string, unit: string) => {
    try {
      const res = await fetch(`/api/forum/${threadId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, author, unitOrigin: unit })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && data.reply) {
        setForumThreads(prev => prev.map(t => {
          if (t.id === threadId) {
            return {
              ...t,
              views: t.views + 1,
              replies: [...t.replies, data.reply]
            };
          }
          return t;
        }));
      } else {
        throw new Error(data.error);
      }
    } catch {
      const fallbackReply = {
        id: `reply-${Date.now()}`,
        author: author || 'Rekan Planter',
        authorRole: 'Asisten Afdeling',
        unitOrigin: unit || 'PTPN IV Regional III',
        timestamp: 'Baru saja',
        content,
        isVerifiedSolution: false
      };
      setForumThreads(prev => prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            views: t.views + 1,
            replies: [...t.replies, fallbackReply]
          };
        }
        return t;
      }));
    }
  };

  // Jump to SOP Catalogue with specific code
  const handleSelectSopFromCopilot = (code: string) => {
    setSelectedSopCode(code);
    setActiveTab('catalogue');
  };

  // Jump from Catalogue to Copilot with pre-consultation
  const handleConsultCopilot = (sopCode: string, title: string) => {
    setActiveTab('copilot');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors selection:bg-emerald-800 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPdf={() => setIsPdfOpen(true)}
        isDark={isDark}
        setIsDark={setIsDark}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 pb-12">
        {activeTab === 'copilot' && (
          <SopCopilotView
            sops={sops}
            onSelectSop={handleSelectSopFromCopilot}
            onOpenCalculator={() => setActiveTab('calculator')}
          />
        )}

        {activeTab === 'vault' && (
          <ExpertVaultView
            entries={vaultEntries}
            onAddNewEntry={handleAddNewVaultEntry}
          />
        )}

        {activeTab === 'forum' && (
          <ForumAfdelingView
            threads={forumThreads}
            onAddNewThread={handleAddNewThread}
            onAddReply={handleAddReply}
          />
        )}

        {activeTab === 'calculator' && (
          <AgronomyCalculatorView />
        )}

        {activeTab === 'catalogue' && (
          <SopCatalogueView
            sops={sops}
            initialSelectedCode={selectedSopCode}
            onConsultCopilot={handleConsultCopilot}
            onOpenPdf={() => setIsPdfOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-6 text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              PlanterKnowledge Hub
            </span>
            <span>·</span>
            <span>PT Perkebunan Nusantara IV (PTPN IV) Regional III</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Inovasi 5G Challenge 2026</span>
            <span>·</span>
            <span>Agronomi Presisi & Retensi Pengetahuan Korporat</span>
          </div>
        </div>
      </footer>

      {/* Attached Proposal PDF Modal */}
      <ProposalPdfModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
      />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
