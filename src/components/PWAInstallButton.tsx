import React, { useState } from 'react';
import { Smartphone, Download, X, Share, MoreVertical, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Hide when already running as an installed standalone app
  if (isInstalled) {
    return null;
  }

  const handleAction = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleAction}
        title="Pasang sebagai Aplikasi di HP atau Buat APK Android"
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs whitespace-nowrap shrink-0"
      >
        <Smartphone className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden lg:inline">Pasang di HP</span>
        <span className="lg:hidden">App HP</span>
      </button>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Pasang PlanterHub di HP
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Akses cepat tanpa browser & dukungan cache offline kebun
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs space-y-2 text-stone-700 dark:text-stone-200">
                <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <Share className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  Langkah di iPhone / iPad (Safari):
                </div>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Ketuk tombol <strong>Bagikan (Share)</strong> di bilah bawah Safari.</li>
                  <li>Gulir ke bawah dan pilih <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.</li>
                  <li>Ketuk <strong>Tambah (Add)</strong> di pojok kanan atas.</li>
                </ol>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-2 text-stone-700 dark:text-stone-200">
                <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <MoreVertical className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  Pasang Langsung di Android (Chrome):
                </div>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Buka URL aplikasi ini di <strong>Google Chrome</strong> HP Anda (bukan di dalam preview iframe).</li>
                  <li>Ketuk ikon titik tiga (<strong>⋮</strong>) di pojok kanan atas Chrome.</li>
                  <li>Pilih <strong>Instal aplikasi (Install app)</strong> atau <strong>Tambahkan ke layar utama</strong>.</li>
                </ol>
              </div>
            )}

            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs space-y-2 text-stone-700 dark:text-stone-200">
              <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-amber-600" />
                Ingin File Installer .APK?
              </div>
              <p className="leading-relaxed">
                Aplikasi ini sudah memenuhi standar <strong>PWA Manifest & Service Worker</strong>. Setelah aplikasi di-deploy ke URL publik, masukkan URL-nya ke layanan gratis <strong>PWABuilder</strong> untuk mengunduh file <code>.apk</code> siap pasang di Android.
              </p>
              <a
                href="https://www.pwabuilder.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-400 hover:underline pt-1"
              >
                Buka PWABuilder.com
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      )}
    </>
  );
};
