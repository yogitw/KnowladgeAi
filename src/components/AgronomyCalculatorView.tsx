import React, { useState } from 'react';
import { Calculator, Truck, Users, Leaf, ArrowRight, ShieldAlert, Sparkles, Check } from 'lucide-react';

export const AgronomyCalculatorView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'akp' | 'pupuk' | 'hama'>('akp');

  // AKP Calculator State
  const [sampleTrees, setSampleTrees] = useState<number>(100);
  const [matureBunches, setMatureBunches] = useState<number>(18);
  const [totalTreesInBlock, setTotalTreesInBlock] = useState<number>(3575); // ~25 Ha * 143 SPH
  const [bjr, setBjr] = useState<number>(16.5); // kg
  const [harvesterNorm, setHarvesterNorm] = useState<number>(1200); // kg/HK

  // Fertilizer Calculator State
  const [blockAreaHa, setBlockAreaHa] = useState<number>(25);
  const [sph, setSph] = useState<number>(143);
  const [fertilizerType, setFertilizerType] = useState<string>('NPK 13-6-27-4+0.5B');
  const [dosePerTreeKg, setDosePerTreeKg] = useState<number>(2.25);
  const [spreaderCapacityPerDay, setSpreaderCapacityPerDay] = useState<number>(250); // pokok/HK

  // Pest / Proteksi State
  const [pestAreaHa, setPestAreaHa] = useState<number>(30);
  const [targetPest, setTargetPest] = useState<'ulat_api' | 'oryctes' | 'ganoderma'>('ulat_api');
  const [applicationMethod, setApplicationMethod] = useState<'fogging' | 'trunk_injection'>('fogging');

  // AKP Calculations
  const calculatedAkpPercent = sampleTrees > 0 ? (matureBunches / sampleTrees) * 100 : 0;
  const estimatedBunches = Math.round(totalTreesInBlock * (calculatedAkpPercent / 100));
  const estimatedTonnageKg = Math.round(estimatedBunches * bjr);
  const estimatedTonnageTon = (estimatedTonnageKg / 1000).toFixed(2);
  const requiredHarvesters = harvesterNorm > 0 ? Math.ceil(estimatedTonnageKg / harvesterNorm) : 0;
  const truckTrips = Math.ceil(estimatedTonnageKg / 6000); // 6 ton per truck trip

  // Fertilizer Calculations
  const totalTreesFertilizer = Math.round(blockAreaHa * sph);
  const totalFertilizerKg = Math.round(totalTreesFertilizer * dosePerTreeKg);
  const totalFertilizerBags50kg = Math.ceil(totalFertilizerKg / 50);
  const spreaderManDays = spreaderCapacityPerDay > 0 ? Math.ceil(totalTreesFertilizer / spreaderCapacityPerDay) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-800 dark:text-emerald-400 uppercase">
          <span>Kalkulator Operasional Presisi</span>
          <span>·</span>
          <span>PTPN IV Regional III</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
          Kalkulator Agronomi & Perencanaan Lapangan
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
          Alat hitung standar norma kebun kelapa sawit untuk mengeliminasi kesalahan taksasi, memastikan pemupukan presisi, dan menentukan kebutuhan tenaga kerja panen harian.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-stone-200 dark:border-stone-800 pb-3">
        <button
          onClick={() => setActiveTab('akp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'akp'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Calculator className="w-4 h-4 text-amber-400" />
          Taksasi AKP & Panen H-1
        </button>

        <button
          onClick={() => setActiveTab('pupuk')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'pupuk'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Leaf className="w-4 h-4 text-amber-400" />
          Kebutuhan Pemupukan Blok
        </button>

        <button
          onClick={() => setActiveTab('hama')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'hama'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          Dosis Proteksi Hama (OPT)
        </button>
      </div>

      {/* Tab 1: AKP & Harvest Estimation */}
      {activeTab === 'akp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              Parameter Sensus AKP (SOP-TAN-03)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Jumlah Pokok Sampel Sensus:
              </label>
              <input
                type="number"
                min="10"
                value={sampleTrees}
                onChange={(e) => setSampleTrees(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
              <span className="text-[11px] text-stone-500">Standar: 5-10% dari populasi blok</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Tandan Matang Disensus (Fraksi 1-3):
              </label>
              <input
                type="number"
                min="0"
                value={matureBunches}
                onChange={(e) => setMatureBunches(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
              <span className="text-[11px] text-stone-500">Minimal 5 brondolan jatuh di piringan</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Populasi Pokok Produktif Blok:
              </label>
              <input
                type="number"
                min="100"
                value={totalTreesInBlock}
                onChange={(e) => setTotalTreesInBlock(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
              <span className="text-[11px] text-stone-500">Contoh: Blok 25 Ha x 143 SPH = 3.575 pokok</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                BJR (Berat Janjang Rata-rata, Kg):
              </label>
              <input
                type="number"
                step="0.1"
                min="5"
                value={bjr}
                onChange={(e) => setBjr(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
              <span className="text-[11px] text-stone-500">Data PKS bulan berjalan</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Target Output Pemanen (Kg/HK):
              </label>
              <input
                type="number"
                step="50"
                value={harvesterNorm}
                onChange={(e) => setHarvesterNorm(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
              <span className="text-[11px] text-stone-500">Norma kerja pemanen PTPN IV: 1.000 - 1.400 kg</span>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: AKP % */}
              <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Angka Kerapatan Panen (AKP)
                </div>
                <div className="text-3xl font-extrabold font-mono tabular-nums text-emerald-800 dark:text-emerald-400 mt-2">
                  {calculatedAkpPercent.toFixed(1)}%
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  Kategori: {calculatedAkpPercent >= 20 ? 'Kerapatan Tinggi (Peak Crop)' : calculatedAkpPercent >= 12 ? 'Kerapatan Sedang (Normal)' : 'Kerapatan Rendah'}
                </div>
              </div>

              {/* Card 2: Estimasi Tandan */}
              <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Taksasi Tandan Matang (Janjang)
                </div>
                <div className="text-3xl font-extrabold font-mono tabular-nums text-stone-900 dark:text-stone-100 mt-2">
                  {estimatedBunches.toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  Janjang siap potong pada rotasi panen esok hari
                </div>
              </div>

              {/* Card 3: Estimasi Tonase */}
              <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Estimasi Produksi Tonase
                </div>
                <div className="text-3xl font-extrabold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-2">
                  {estimatedTonnageTon} Ton
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 mt-1 font-mono">
                  ({estimatedTonnageKg.toLocaleString('id-ID')} Kg TBS)
                </div>
              </div>

              {/* Card 4: Kebutuhan Pemanen & Truk */}
              <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Alokasi Tenaga & Transport
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div>
                    <span className="text-2xl font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
                      {requiredHarvesters}
                    </span>
                    <span className="text-xs text-stone-600 dark:text-stone-400 ml-1">Pemanen (HK)</span>
                  </div>
                  <div className="h-8 w-px bg-stone-200 dark:border-stone-700" />
                  <div>
                    <span className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
                      {truckTrips}
                    </span>
                    <span className="text-xs text-stone-600 dark:text-stone-400 ml-1">Ritase Truk (6T)</span>
                  </div>
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  Kebutuhan angkong: {requiredHarvesters} unit operasional
                </div>
              </div>
            </div>

            {/* Field Implementation Notes */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 p-5 text-xs space-y-2">
              <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Ketentuan SOP-TAN-03 untuk Mandor Panen:
              </div>
              <ul className="space-y-1 text-stone-700 dark:text-stone-300 list-disc list-inside">
                <li>Sensus dilakukan H-1 pukul 14.30 - 17.00 WIB menyusuri baris sensus (misal baris 5, 15, 25).</li>
                <li>Hanya buah Fraksi 1 (minimal 5 brondolan lepas di piringan) yang dihitung sebagai tandan matang.</li>
                <li>Deviasi taksasi dengan realisasi timbangan PKS wajib di bawah ±5%.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Fertilizer Dosage Calculator */}
      {activeTab === 'pupuk' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
              Parameter Blok Pemupukan (SOP-TAN-02)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Luas Blok (Hektar):
              </label>
              <input
                type="number"
                min="1"
                value={blockAreaHa}
                onChange={(e) => setBlockAreaHa(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Kerapatan Pokok / SPH (Pokok/Ha):
              </label>
              <select
                value={sph}
                onChange={(e) => setSph(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value={143}>143 Pokok/Ha (Segitiga Sama Sisi 9.0 x 9.0 m)</option>
                <option value={136}>136 Pokok/Ha (Segitiga 9.2 x 9.2 m)</option>
                <option value={128}>128 Pokok/Ha (Lahan Rendahan/Gambut)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Jenis Pupuk:
              </label>
              <select
                value={fertilizerType}
                onChange={(e) => setFertilizerType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="NPK 13-6-27-4+0.5B">NPK 13-6-27-4+0.5B (TM)</option>
                <option value="Urea (46% N)">Urea (46% N)</option>
                <option value="MOP / KCl (60% K2O)">MOP / KCl (60% K2O)</option>
                <option value="Rock Phosphate (28% P2O5)">Rock Phosphate (28% P2O5)</option>
                <option value="Kieserit (27% MgO)">Kieserit (27% MgO)</option>
                <option value="Borat / Fertibor (Mikro)">Borat / Fertibor (150 gr/pokok)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Dosis Rekomendasi (Kg per Pokok):
              </label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                value={dosePerTreeKg}
                onChange={(e) => setDosePerTreeKg(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
              <span className="text-[11px] text-stone-500">Berdasarkan hasil analisa daun (LSU)</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Kapasitas Sebar Pekerja (Pokok/HK):
              </label>
              <input
                type="number"
                step="25"
                value={spreaderCapacityPerDay}
                onChange={(e) => setSpreaderCapacityPerDay(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Total Populasi Pokok Blok
                </div>
                <div className="text-3xl font-extrabold font-mono tabular-nums text-stone-900 dark:text-stone-100 mt-2">
                  {totalTreesFertilizer.toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  Luas {blockAreaHa} Ha × {sph} SPH
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Total Pupuk Dikeluarkan dari Gudang
                </div>
                <div className="text-3xl font-extrabold font-mono tabular-nums text-emerald-800 dark:text-emerald-400 mt-2">
                  {totalFertilizerBags50kg}
                  <span className="text-base font-normal text-stone-600 dark:text-stone-400 ml-1.5">Karung (@50 Kg)</span>
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 mt-1 font-mono">
                  Setara {(totalFertilizerKg / 1000).toFixed(2)} Ton ({totalFertilizerKg.toLocaleString('id-ID')} Kg)
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Alokasi Tenaga Kerja Tebar (HK)
                </div>
                <div className="text-3xl font-extrabold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-2">
                  {spreaderManDays} HK
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  Jika 5 orang penabur: selesai dalam {Math.ceil(spreaderManDays / 5)} hari kerja
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  Radius Tebar Sesuai SOP
                </div>
                <div className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-2">
                  1.0 - 1.5 Meter
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  Melingkar merata di bawah tajuk aktif terluar, tidak menumpuk di batang.
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 p-5 text-xs space-y-2">
              <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Peringatan Cuaca Pemupukan (SOP-TAN-02):
              </div>
              <p className="text-stone-700 dark:text-stone-300">
                Pupuk TIDAK BOLEH ditebar jika dalam 14 hari tidak turun hujan (kemarau ekstrim) atau jika piringan tergenang air banjir. Mandor wajib mengukur kalibrasi mangkok takaran jeriken di pagi hari sebelum memulai pekerjaan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pest Protection Dosage */}
      {activeTab === 'hama' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Parameter Pengendalian Hama & Penyakit
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Target Organisme Pengganggu (OPT):
              </label>
              <select
                value={targetPest}
                onChange={(e) => setTargetPest(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              >
                <option value="ulat_api">Ulat Api (Setothosea asigna / Darna trima)</option>
                <option value="oryctes">Kumbang Tanduk (Oryctes rhinoceros)</option>
                <option value="ganoderma">Busuk Pangkal Batang (Ganoderma boninense)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Luas Blok Terserang (Ha):
              </label>
              <input
                type="number"
                min="1"
                value={pestAreaHa}
                onChange={(e) => setPestAreaHa(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>

            {targetPest === 'ulat_api' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Metode Pengendalian:
                </label>
                <select
                  value={applicationMethod}
                  onChange={(e) => setApplicationMethod(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="fogging">Pengasapan / Fogging (Kanopi Tinggi)</option>
                  <option value="trunk_injection">Injeksi Batang / Trunk Injection (Asefat)</option>
                </select>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs">
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3">
                Rekomendasi Dosis & Norma Operasional PTPN IV:
              </h4>

              {targetPest === 'ulat_api' && (
                <div className="space-y-3 text-xs">
                  {applicationMethod === 'fogging' ? (
                    <>
                      <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        <div className="font-semibold text-stone-900 dark:text-stone-100">
                          Bahan Aktif Insektisida Fogging (Deltametrin 25 EC / Lamda Sihalotrin)
                        </div>
                        <div className="text-stone-600 dark:text-stone-400 mt-1">
                          Rasio campuran: 1 Liter Insektisida dicampur 19 Liter Solar / Diesel per 2 Ha.
                        </div>
                        <div className="font-mono text-emerald-800 dark:text-emerald-400 font-bold mt-1">
                          Kebutuhan untuk {pestAreaHa} Ha: {(pestAreaHa / 2).toFixed(1)} Liter Insektisida + {((pestAreaHa / 2) * 19).toFixed(0)} Liter Solar.
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        <div className="font-semibold text-stone-900 dark:text-stone-100">
                          Waktu Pelaksanaan Fogging:
                        </div>
                        <div className="text-stone-600 dark:text-stone-400 mt-1">
                          Pagi hari (pukul 05.00 - 08.00 WIB) saat kondisi inversi suhu dan angin tenang (&lt; 5 km/jam) agar kabut racun melayang di mahkota pelepah.
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                        <div className="font-semibold text-stone-900 dark:text-stone-100">
                          Bahan Aktif Trunk Injection (Asefat 75 SP)
                        </div>
                        <div className="text-stone-600 dark:text-stone-400 mt-1">
                          Dosis: 10 - 15 gram dilarutkan air per lubang bor per pokok.
                        </div>
                        <div className="font-mono text-emerald-800 dark:text-emerald-400 font-bold mt-1">
                          Kebutuhan untuk {pestAreaHa} Ha ({pestAreaHa * 143} pokok): {((pestAreaHa * 143 * 12.5) / 1000).toFixed(1)} Kg Asefat.
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {targetPest === 'oryctes' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <div className="font-semibold text-stone-900 dark:text-stone-100">
                      Instalasi Ferotrap Agregasi (SOP-PROT-02)
                    </div>
                    <div className="text-stone-600 dark:text-stone-400 mt-1">
                      Kebutuhan ferotrap: 1 unit per 2 Hektar.
                    </div>
                    <div className="font-mono text-emerald-800 dark:text-emerald-400 font-bold mt-1">
                      Kebutuhan untuk {pestAreaHa} Ha: {Math.ceil(pestAreaHa / 2)} Unit Ferotrap + Sachet Feromon.
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <div className="font-semibold text-stone-900 dark:text-stone-100">
                      Penempatan Tiang:
                    </div>
                    <div className="text-stone-600 dark:text-stone-400 mt-1">
                      Dipasang di pinggir jalan batas blok setinggi 2.5 - 3 meter, minimal 50 meter dari bibitan kelapa sawit muda.
                    </div>
                  </div>
                </div>
              )}

              {targetPest === 'ganoderma' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <div className="font-semibold text-stone-900 dark:text-stone-100">
                      Parit Isolasi & Pembumbunan (SOP-PROT-03)
                    </div>
                    <div className="text-stone-600 dark:text-stone-400 mt-1">
                      Buat parit isolasi 4 x 4 meter sedalam minimal 80 cm sekeliling pokok stadium 1. Bumbun tanah gembur setinggi 60-80 cm.
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                    <div className="font-semibold text-stone-900 dark:text-stone-100">
                      Inokulasi Hayati (Trichoderma sp.)
                    </div>
                    <div className="text-stone-600 dark:text-stone-400 mt-1">
                      Dosis 200 - 400 gram per pokok sakit dan disebar pada 4 pokok sehat tetangga terdekat sebagai sabuk proteksi hayati.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
