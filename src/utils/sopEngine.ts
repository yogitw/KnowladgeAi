import { OFFICIAL_SOPS } from '../data/defaultData.ts';

export interface AgronomySopResult {
  success: boolean;
  summary: string;
  sopReference: {
    code: string;
    title: string;
    clause: string;
    quote: string;
  };
  calculation?: {
    title: string;
    formula: string;
    result: string;
    note?: string;
  };
  practicalSteps: string[];
  riskWarning: string;
}

export function getAgronomySopResponse(prompt: string): AgronomySopResult {
  const p = prompt.toLowerCase();
  let matchedSop = OFFICIAL_SOPS[0];
  let summary = 'Berdasarkan pedoman operasional PTPN IV Regional III, pekerjaan harus disesuaikan dengan instruksi kerja terstandar di Buku Saku Mandor.';
  let steps = [
    'Periksa kondisi lapangan di ancak kerja sebelum memulai kegiatan.',
    'Gunakan alat pelindung diri dan peralatan yang telah dikalibrasi.',
    'Laporkan hasil akhir ke Mandor Satu sebelum pukul 14.00 WIB.'
  ];
  let warning = 'Penyimpangan dosis atau kriteria mutu akan dikenakan sanksi denda ketidakteraturan panen/pemupukan.';
  let calc: AgronomySopResult['calculation'] = undefined;

  if (p.includes('pupuk') || p.includes('urea') || p.includes('npk') || p.includes('dosis') || p.includes('borat') || p.includes('kieserit')) {
    matchedSop = OFFICIAL_SOPS[1];
    summary = 'Pemupukan kelapa sawit mengacu pada SOP-TAN-02 dengan radius tabur selebar tajuk terluar (1.0-1.5 meter dari pangkal piringan). Penaburan hanya dilakukan pada tanah lembap (curah hujan 100-250 mm/bulan). Dosis per pokok disesuaikan rekomendasi LSU (contoh: 2.25 kg NPK/pokok pada TM).';
    steps = [
      'Bersihkan gulma piringan dan pasar pikul minimal 1 minggu sebelum jadwal pupuk.',
      'Ukur kalibrasi mangkok takar jeriken di gudang pupuk pagi hari sebelum distribusi ke tenaga tebar.',
      'Tebar melingkar merata di luar piringan, jangan menumpuk di pangkal pokok.'
    ];
    calc = {
      title: 'Kebutuhan Pupuk Blok TM',
      formula: 'Luas Blok (Ha) x SPH (136-143 pokok/Ha) x Dosis Rekomendasi LSU (Kg/pokok)',
      result: 'Contoh: 25 Ha x 143 pokok x 2.25 kg NPK = 8.043,75 kg (161 karung @50kg)',
      note: 'Wajib dipastikan deviasi tebar per pokok maksimal ±5%.'
    };
    warning = 'DILARANG menabur pupuk saat air menggenang atau curah hujan ekstrim karena pupuk akan terbuang terbawa erosi limpasan.';
  } else if (p.includes('ulat') || p.includes('api') || p.includes('updks') || p.includes('fogging') || p.includes('kantung')) {
    matchedSop = OFFICIAL_SOPS[2];
    summary = 'Pengendalian Ulat Api (Setothosea asigna) mengacu pada SOP-PROT-01. Ambang kritis sensus darurat adalah >= 5 ulat/pelepah (atau >= 10 untuk Darna trima). Dilakukan fogging pagi hari atau injeksi batang.';
    steps = [
      'Lakukan sensus darurat pada 1% pokok sampel untuk memetakan luasan serangan.',
      'Jika ambang >= 5 ulat/pelepah, jadwalkan fogging mesin swingfog pukul 05.00-08.00 pagi searah angin.',
      'Pada tanaman TM tua (>6m), terapkan injeksi batang bahan aktif asefat 10-15 ml/pokok.'
    ];
    warning = 'Dilarang melakukan fogging pada siang hari terik karena hembusan angin memecah kabut racun dan mematikan serangga penyerbukan Elaeidobius kamerunicus.';
  } else if (p.includes('kumbang') || p.includes('oryctes') || p.includes('ferotrap') || p.includes('tbm')) {
    matchedSop = OFFICIAL_SOPS[3];
    summary = 'Pengendalian Oryctes rhinoceros mengacu pada SOP-PROT-02 menggunakan ferotrap feromon sintetis agregasi 1 unit per 2 Hektar pada tiang setinggi 2.5-3m di pinggir jalan blok.';
    steps = [
      'Pasang tiang ferotrap setinggi 2.5-3 meter di pinggir jalan batas blok, bukan di dalam barisan bibit muda.',
      'Ganti sachet feromon setiap 60-75 hari sekali atau saat daya tarik habis.',
      'Tanam Mucuna bracteata rapat untuk menutup tumpukan kayu lapuk sisa replanting.'
    ];
    warning = 'Jangan memasang ferotrap di tengah-tengah bibit muda karena akan mengundang kawanan kumbang merusak titik tumbuh bibit.';
  } else if (p.includes('ganoderma') || p.includes('busuk pangkal') || p.includes('sengklek')) {
    matchedSop = OFFICIAL_SOPS[4];
    summary = 'Penanganan Ganoderma boninense mengacu pada SOP-PROT-03 dengan strategi deteksi dini tajuk asimetris dan sanitasi lubang besar (Big Hole 1.5x1.5x1.5m).';
    steps = [
      'Sensus berkala pohon bergejala tajuk layu satu sisi atau daun tombak tidak membuka.',
      'Gali parit isolasi sekeliling pokok sakit ukuran 4x4 meter dengan kedalaman minimal 80 cm.',
      'Bumbun tanah gembur setinggi 60-80 cm dan inokulasi Trichoderma 200-400 gr/pokok.'
    ];
    warning = 'Dilarang memotong tubuh buah jamur dan membuangnya ke parit drainase karena spora akan menyebar luas terbawa aliran air ke blok lain.';
  } else if (p.includes('akp') || p.includes('taksasi') || p.includes('rumus') || p.includes('tonase')) {
    matchedSop = OFFICIAL_SOPS[5];
    summary = 'Taksasi AKP (Angka Kerapatan Panen) mengacu pada SOP-TAN-03 yang dilaksanakan sore hari H-1 pukul 14.30-17.00 WIB pada 5-10% populasi pokok sampel.';
    steps = [
      'Susuri baris sensus standar (misalnya baris 5, 15, 25) dan hitung tandan Fraksi 1-3 yang siap dipanen esok hari.',
      'Hitung persentase AKP = (Tandan Matang / Pokok Sampel) x 100%, lalu kalikan populasi pokok blok dan BJR bulan berjalan.',
      'Laporkan kebutuhan armada truk pengangkut dan jumlah tenaga pemanen ke Mandor Transport sebelum malam.'
    ];
    calc = {
      title: 'Rumus Taksasi Produksi AKP H-1',
      formula: 'Taksasi Tonase (Kg) = Populasi Pokok x (Tandan Matang / Sampel) x BJR (Kg)',
      result: 'Toleransi selisih realisasi timbangan PKS maksimal ±5%',
      note: 'Gunakan BJR terkini dari rekapitulasi timbangan pabrik awal bulan.'
    };
    warning = 'Dilarang mengira-ngira angka AKP dari kantor afdeling tanpa turun menyusuri baris sensus di blok.';
  } else if (p.includes('panen') || p.includes('fraksi') || p.includes('brondolan') || p.includes('tbs')) {
    matchedSop = OFFICIAL_SOPS[0];
    summary = 'Standar Panen TBS mengacu pada SOP-TAN-01. Kriteria matang panen adalah minimal 5 butir brondolan lepas alami di piringan (Fraksi 1). Rotasi dijaga ketat 7 hari sekali dengan pemotongan gagang mepet (C-shape maks 2 cm).';
    steps = [
      'Potong gagang buah mepet (maksimal 2 cm berbentuk cangkir V/C-shape).',
      'Kutip 100% brondolan di piringan, ketiak pelepah, dan pasar pikul tanpa ada yang tertinggal.',
      'Susun rapi di TPH dengan barisan 5-10 tandan per kelompok dan beri tanda nomor pemanen.'
    ];
    calc = {
      title: 'Toleransi Mutu Buah TPH',
      formula: 'Buah Mentah <= 2%, Buah Masak >= 90%, Buah Lewat Matang <= 5%, Gagang Panjang 0%',
      result: 'SOP Mutu Standar PKS PTPN IV',
      note: 'Buah mentah yang dipotong akan dikenakan denda pemotongan upah panen.'
    };
    warning = 'DILARANG memotong buah mentah (Fraksi 00) demi mengejar target tonase karena merusak rendemen minyak sawit (OER) di PKS.';
  }

  return {
    success: true,
    summary,
    sopReference: {
      code: matchedSop.code,
      title: matchedSop.title,
      clause: 'Bab Ketentuan Lapangan & Standar Baku',
      quote: matchedSop.summary
    },
    calculation: calc,
    practicalSteps: steps,
    riskWarning: warning
  };
}
