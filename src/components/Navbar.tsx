import React from 'react';
import { Leaf, Sparkles, FileText, BookOpen, MessageSquare, Calculator, Sun, Moon } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton.tsx';

interface NavbarProps {
  activeTab: 'copilot' | 'vault' | 'forum' | 'calculator' | 'catalogue';
  setActiveTab: (tab: 'copilot' | 'vault' | 'forum' | 'calculator' | 'catalogue') => void;
  onOpenPdf: () => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPdf,
  isDark,
  setIsDark,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-800 text-amber-400 flex items-center justify-center shadow-xs">
            <Leaf className="w-5 h-5" />
          </div>
          <button 
            onClick={() => setActiveTab('copilot')}
            className="text-left group transition-transform hover:opacity-95"
          >
            <div className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap">
              PlanterKnowledge Hub
            </div>
            <div className="text-[11px] font-medium text-emerald-800 dark:text-emerald-400 whitespace-nowrap">
              PTPN IV Regional III · 5G Challenge 2026
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line controls) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs lg:text-sm font-medium">
          <button
            onClick={() => setActiveTab('copilot')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'copilot'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            AI SOP Copilot
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'vault'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Expert Vault
          </button>

          <button
            onClick={() => setActiveTab('forum')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'forum'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Forum Afdeling
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'calculator'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Kalkulator Agronomi
          </button>

          <button
            onClick={() => setActiveTab('catalogue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              activeTab === 'catalogue'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Katalog SOP
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + PWA Install + Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton />

          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenPdf}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-xs whitespace-nowrap"
          >
            <FileText className="w-4 h-4" />
            Dokumen Proposal
          </button>
        </div>
      </div>

      {/* Mobile sub-bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('copilot')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'copilot' ? 'font-semibold text-emerald-800 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'}`}
        >
          Copilot
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'vault' ? 'font-semibold text-emerald-800 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'}`}
        >
          Vault
        </button>
        <button
          onClick={() => setActiveTab('forum')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'forum' ? 'font-semibold text-emerald-800 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'}`}
        >
          Forum
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'calculator' ? 'font-semibold text-emerald-800 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'}`}
        >
          Kalkulator
        </button>
        <button
          onClick={() => setActiveTab('catalogue')}
          className={`px-2 py-1 rounded whitespace-nowrap ${activeTab === 'catalogue' ? 'font-semibold text-emerald-800 dark:text-emerald-400' : 'text-stone-600 dark:text-stone-400'}`}
        >
          SOP
        </button>
      </div>
    </header>
  );
};
