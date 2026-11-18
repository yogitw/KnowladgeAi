import { SopDocument, ExpertVaultEntry, ForumThread } from '../types/index.ts';

export const OFFICIAL_SOPS: SopDocument[] = [
  {
    id: 'sop-01',
    code: 'SOP-TAN-01',
    title: 'Standar Operasional Pemanenan TBS & Kriteria Matang Panen',
    category: 'Panen',
    version: 'Rev. 4.2 - PTPN IV',
    effectiveDate: 'Januari 2024',
    summary: 'Pedoman penentuan kriteria matang panen Tandan Buah Segar (TBS) kelapa sawit, rotasi potong buah, pemotongan gagang mepet (C-shape), dan pengutipan brondolan di piringan hingga TPH.',
    keyPoints: [
      'Kriteria Matang Panen: Minimal 5 butir brondolan segar lepas secara alami di piringan (Fraksi 1 dan Fraksi 2).',
      'Rotasi Panen: Dijaga ketat 7 hari sekali untuk mencegah buah lewat matang (Fraksi 4-5) yang menaikkan kadar Asam Lemak Bebas (ALB).',
      'Pemotongan Gagang: Gagang tandan dipotong mepet membentuk pola V/C (maksimal 2 cm dari pangkal tandan).',
      'Kutipan Brondolan: Bersih 100% dari piringan, pasar pikul, dan ketiak pelepah, dikumpulkan di karung khusus.',
      'Penyusunan TPH: TBS disusun rapi 5-10 tandan per baris dengan nomor mandor dan kode ancak tercatat pada kartu spk.'
    ],
    toleranceLimit: 'Maksimal buah mentah (Fraksi 00 & 0) $\\le 2\\%$, buah lewat matang $\\le 5\\%$, sampah kotoran $\\le 1\\%$.',
    criticalDo: [
      'Gunakan dodos tajam untuk pokok $\\le 3$ meter dan egrek bergagang fiber untuk pokok $\\ge 4$ meter.',
      'Turunkan buah matang yang tersangkut di pelepah menggunakan kait pengait buah.',
      'Hitung dan catat ancak panen harian sebelum pukul 14.00 WIB.'
    ],
    criticalDont: [
      'Dilarang memanen buah mentah (Fraksi 00) dengan alasan mengejar tonase harian.',
      'Dilarang meninggalkan brondolan tercecer di piringan (mengundang hama babi dan menurunkan ekstraksi OER).',
      'Dilarang memotong pelepah berlebih (overpruning) yang menyisakan kurang dari 48-56 pelepah/pokok.'
    ],
    pdfReference: '/public/assets/aistudio/PlanterKnowledge_Hub_Proposal__1__43ac70af.pdf'
  },
  {
    id: 'sop-02',
    code: 'SOP-TAN-02',
    title: 'Tata Kelola Pemupukan Presisi Kelapa Sawit (TM & TBM)',
    category: 'Pemupukan',
    version: 'Rev. 5.1 - PTPN IV',
    effectiveDate: 'Maret 2024',
    summary: 'Standar aplikasi pemupukan anorganik (Urea, TSP/RP, MOP/KCl, Kieserit, dan Borat) berdasarkan rekomendasi hasil analisis daun (LSU) dan tanah (SSU).',
    keyPoints: [
      'Radius Penebaran: Disebar merata pada piringan melingkar selebar tajuk terluar (1.0 - 1.5 meter dari pangkal batang untuk TM).',
      'Kondisi Tanah: Hanya diaplikasikan pada saat tanah lembap/kapasitas lapang, curah hujan 100-250 mm/bulan.',
      'Urutan Aplikasi: Pupuk fosfat (RP/TSP) didahulukan, selang minimal 2-3 minggu sebelum pupuk nitrogen (Urea) untuk menghindari penguapan amonia.',
      'Borat (Mikro): Diberikan khusus pada pucuk pelepah atau piringan dekat batang dengan dosis 100-150 gr/pokok/tahun.',
      'Kalibrasi Takaran: Mandor wajib memeriksa kalibrasi mangkok takaran pupuk setiap pagi sebelum distribusi ke tenaga tebar.'
    ],
    toleranceLimit: 'Deviasi sebaran dosis per pokok maksimal $\\pm 5\\%$. Kehilangan pupuk tercecer di jalan $\\le 0.5\\%$.',
    criticalDo: [
      'Bersihkan gulma piringan minimal 1 minggu sebelum jadwal penaburan pupuk.',
      'Tutup kantong pupuk bekas dan kumpulkan di gudang limbah B3/afdeling sesuai SOP lingkungan.',
      'Gunakan APD lengkap: masker partikel, kacamata pelindung, dan sarung tangan karet saat menangani pupuk kimia.'
    ],
    criticalDont: [
      'Dilarang menabur pupuk saat kondisi banjir, tergenang air, atau kemarau kering ekstrim (>14 hari tanpa hujan).',
      'Dilarang menumpuk pupuk membukit di pangkal batang (dapat membakar jaringan kulit tanaman muda).',
      'Dilarang mencampur Urea dan Rock Phosphate dalam wadah tabur yang sama.'
    ]
  },
  {
    id: 'sop-03',
    code: 'SOP-PROT-01',
    title: 'Pengendalian Hama Ulat Pemakan Daun Kelapa Sawit (UPDKS / Ulat Api)',
    category: 'Proteksi Tanaman',
    version: 'Rev. 3.0 - PTPN IV',
    effectiveDate: 'Agustus 2023',
    summary: 'Prosedur pemantauan berkala (sensus rutin), penetapan ambang ekonomi, dan tindakan kuratif terpadu ulat api (Setothosea asigna, Darna trima, Setora nitens).',
    keyPoints: [
      'Sensus Rutin: Dilakukan setiap 2 minggu pada blok rawan dengan mengambil sampel 2 pelepah per pokok pada 1% populasi.',
      'Ambang Kritis Ekonomi: $\\ge 5$ ulat/pelepah untuk Setothosea asigna, atau $\\ge 10$ ulat/pelepah untuk Darna trima.',
      'Pengendalian Hayati: Penanaman tanaman inang musuh alami (Turnera subulata, Antigonon leptopus, Cassia cobanensis) di gawangan.',
      'Fogging (Pengasapan): Digunakan untuk kanopi tinggi dengan insektisida piretroid sintetis pada pagi hari (05.00-08.00) saat angin tenang.',
      'Injeksi Batang (Trunk Injection): Alternatif ramah lingkungan pada tanaman TM tua dengan bahan aktif asefat dosis 10-15 ml/pokok.'
    ],
    toleranceLimit: 'Penurunan populasi ulat pasca aplikasi minimal 90% dalam 72 jam evaluasi efikasi.',
    criticalDo: [
      'Laporkan hasil sensus blok darurat ke Asisten Tanaman dan Askep dalam 1x24 jam jika ambang terlampaui.',
      'Lakukan pengasapan searah hembusan angin untuk memaksimalkan liputan kabut racun ke mahkota pelepah.'
    ],
    criticalDont: [
      'Dilarang menyemprot insektisida kontak berspektrum luas pada siang hari terik (merusak predator predator sycanus).',
      'Dilarang membiarkan larva instar akhir memasuki fase kepompong di piringan tanpa pembersihan.'
    ]
  },
  {
    id: 'sop-04',
    code: 'SOP-PROT-02',
    title: 'Mitigasi Terpadu Kumbang Tanduk (Oryctes rhinoceros)',
    category: 'Proteksi Tanaman',
    version: 'Rev. 3.4 - PTPN IV',
    effectiveDate: 'Februari 2024',
    summary: 'Pengendalian terintegrasi kumbang tanduk pada areal Tanaman Belum Menghasilkan (TBM) dan replanting menggunakan feromon, penutup tanah legum, dan agens hayati.',
    keyPoints: [
      'Pemasangan Ferotrap: 1 unit ferotrap feromon agregasi per 2 hektar, dipasang pada tiang bambu setinggi 2.5-3 meter di pinggir jalan blok.',
      'Sanitasi Batang Tumbang: Cincangan batang sawit tua saat replanting wajib dipantau agar tidak menjadi sarang larva uret kumbang.',
      'Legume Cover Crops: Penanaman Mucuna bracteata yang rapat untuk menutup tumpukan kayu lapuk sehingga menghambat peletakan telur kumbang.',
      'Aplikasi Bioinsektisida: Tabur spora jamur Metarhizium anisopliae pada tumpukan seresah pembibitan dan gundukan cincangan.'
    ],
    toleranceLimit: 'Serangan pelepah muda berpola guntingan/kipas maksimal $\\le 3\\%$ dari total populasi blok TBM.',
    criticalDo: [
      'Ganti sachet feromon setiap 60-75 hari sekali atau saat cairan atraktan habis.',
      'Kumpulkan kumbang yang terperangkap dalam ember ferotrap setiap minggu dan musnahkan.'
    ],
    criticalDont: [
      'Dilarang membiarkan rumput alang-alang liar tumbuh di sekitar tiang ferotrap.',
      'Dilarang memotong pucuk muda kelapa sawit yang terserang tanpa sterilisasi luka getah.'
    ]
  },
  {
    id: 'sop-05',
    code: 'SOP-PROT-03',
    title: 'Protokol Sanitasi & Pengendalian Jamur Ganoderma boninense',
    category: 'Proteksi Tanaman',
    version: 'Rev. 4.0 - PTPN IV',
    effectiveDate: 'November 2023',
    summary: 'Penanganan pencegahan penyakit Busuk Pangkal Batang (BPB) akibat jamur Ganoderma boninense, mulai dari sensus pelepah patah sengklek hingga pembuatan lubang tanam standar (Big Hole).',
    keyPoints: [
      'Gejala Dini: Pelepah bawah sengklek menggantung lebih dari 3 tingkat, daun pucuk tidak membuka sempurna, pembentukan tubuh buah jamur putih-kecokelatan di pangkal batang.',
      'Sanitasi Lubang Tanam (Big Hole): Pembuatan lubang ukuran $1.5 \\times 1.5 \\times 1.5$ meter pada bekas pohon sakit sebelum replanting.',
      'Pembumbunan Tanah: Tanaman yang terserang stadium 1 dibumbun tanah setinggi 60-80 cm di sekeliling pangkal batang untuk merangsang akar adventif baru.',
      'Aplikasi Agens Hayati: Inokulasi Trichoderma viride / harzianum sebanyak 200-400 gr per lubang tanam saat penanaman.'
    ],
    toleranceLimit: 'Insidensi pohon mati akibat Ganoderma per tahun maksimal $\\le 0.8\\%$ per afdeling.',
    criticalDo: [
      'Beri tanda cat merah menyilang pada batang pohon yang terkonfirmasi positif Ganoderma.',
      'Lakukan isolasi parit isolasi sekeliling pokok sakit ukuran $4 \\times 4$ meter dengan kedalaman minimal 80 cm.'
    ],
    criticalDont: [
      'Dilarang memotong tubuh buah jamur dan membuangnya ke parit drainase (spora akan menyebar mengikuti arus air).',
      'Dilarang menggunakan tanah bekas pangkal pokok sakit sebagai media pembibitan.'
    ]
  },
  {
    id: 'sop-06',
    code: 'SOP-TAN-03',
    title: 'Metode Taksasi Produksi AKP (Angka Kerapatan Panen)',
    category: 'Taksasi',
    version: 'Rev. 2.1 - PTPN IV',
    effectiveDate: 'Oktober 2024',
    summary: 'Pedoman penghitungan AKP satu hari sebelum panen (H-1) untuk mengestimasi tonase TBS, kebutuhan truk angkut, dan alokasi pemanen per ancak.',
    keyPoints: [
      'Sampel Pokok: Dihitung pada 5-10% dari total populasi pokok di ancak panen (misal baris nomor 5, 15, 25).',
      'Rumus AKP: $\\text{AKP (\\%)} = \\frac{\\text{Jumlah Tandan Matang Disensus}}{\\text{Jumlah Pokok Sampel}} \\times 100\\%$.',
      'Estimasi Tandan: $\\text{Taksasi Tandan} = \\text{Jumlah Pokok Produktif Blok} \\times \\text{AKP (\\%)}$.',
      'Estimasi Tonase: $\\text{Estimasi Tonase (Kg)} = \\text{Taksasi Tandan} \\times \\text{BJR (Berat Janjang Rata-rata)}$.',
      'Waktu Sensus: Dilakukan oleh mandor panen pada sore hari H-1 pukul 14.30 - 17.00 WIB.'
    ],
    toleranceLimit: 'Selisih antara taksasi H-1 dengan realisasi timbangan pabrik (PKS) maksimal $\\pm 5\\%$.',
    criticalDo: [
      'Gunakan data BJR terkini yang diperbarui setiap awal bulan dari rekapitulasi slip timbang PKS.',
      'Koordinasikan kebutuhan unit armada truk pengangkut dengan mandor transport berdasarkan taksasi sore.'
    ],
    criticalDont: [
      'Dilarang mengira-ngira AKP dari kantor afdeling tanpa menyusuri baris sensus di blok.',
      'Dilarang menghitung tandan yang masih berada pada Fraksi 0 (hitam mengkilap tanpa brondolan lepas).'
    ]
  }
];

export const EXPERT_VAULT: ExpertVaultEntry[] = [
  {
    id: 'vault-01',
    title: 'Kiat Akurasi Taksasi AKP Saat Cuaca Ekstrim & Trik Membedakan Buah Mentah vs Masak di Pokok Tinggi',
    contributor: {
      name: 'Bpk. Sukardi',
      role: 'Purna Bakti Mantri Panen Senior (32 Tahun Pengabdian)',
      unitOrigin: 'Kebun Sei Karang - Afdeling III',
      experienceYears: 32
    },
    category: 'Panen & Taksasi',
    dateShared: '14 Oktober 2025',
    summary: 'Bagaimana menjaga deviasi taksasi panen di bawah 3% ketika musim hujan lebat sering menyamarkan brondolan yang tertutup lumpur dan genangan piringan.',
    tacitInsight: 'Karyawan baru sering tertipu warna merah mengkilap pada buah kelapa sawit varietas tenera muda di ketinggian 12 meter. Kiat saya: jangan hanya melihat warna kulit luar karena bias pantulan sinar matahari. Amati rekahan pada pangkal janjang buah dan periksa jatuhnya serasah kelopak di piringan. Jika ada 3-4 kelopak buah mengering rontok, hampir pasti tandan di atas sudah masuk Fraksi 1.',
    practicalSteps: [
      'Pada musim hujan, gunakan galah egrek untuk menyenggol perlahan bagian bawah tandan; jika getaran ringan melepaskan 1 butir brondolan, tandan sah dipotong.',
      'Saat piringan tergenang, amati permukaan genangan air; brondolan yang baru lepas akan terapung sesaat atau memercikkan butiran air khas dibanding buah busuk yang tenggelam pekat.',
      'Latih pemanen muda untuk membiasakan membilang baris zig-zag saat sensus H-1, bukan hanya melihat baris pasar rintis.'
    ],
    audioTranscript: 'Dulu waktu saya mulai tahun 1992 di Sei Karang, tidak ada aplikasi. Semuanya di kepala dan mata batin. Tapi kuncinya satu: kelapa sawit selalu memberi tanda sebelum buahnya sempurna matang. Rekahan tangkai itu jujur, tidak bisa dibohongi sinar matahari.',
    verifiedBy: 'Dewan Pakar Agronomi PTPN IV',
    helpfulCount: 148,
    tags: ['Taksasi AKP', 'Egrek Tinggi', 'Musim Hujan', 'Mutu TBS']
  },
  {
    id: 'vault-02',
    title: 'Metode Deteksi Dini Gejala Ganoderma Sebelum Pelepah Sengklek Melalui Analisis Tajuk Satu Sisi',
    contributor: {
      name: 'Ir. Bambang Hermanto',
      role: 'Purna Bakti Asisten Kepala (28 Tahun Pengabdian)',
      unitOrigin: 'Kebun Tanah Itam Hulu',
      experienceYears: 28
    },
    category: 'Hama & Penyakit',
    dateShared: '22 November 2025',
    summary: 'Pengalaman 28 tahun mengendalikan laju infeksi jamur Ganoderma boninense di lahan gambut dan mineral bekas kelapa sawit generasi kedua (replanting).',
    tacitInsight: 'Banyak mandor mengira Ganoderma baru bisa dipastikan kalau jamur basidiokarp sudah mekar di pangkal batang. Padahal pada tahap itu, lebih dari 60% jaringan pembuluh xilem di dalam batang sudah busuk hitam! Kiat rahasia lapangan: amati tajuk di pagi hari saat embun. Pokok yang mulai diserang Ganoderma stadium awal akan mengalami layu kusam asimetris (hanya separuh tajuk yang tampak layu, separuhnya lagi masih hijau normal). Inilah momen emas pembumbunan tanah dan isolasi parit.',
    practicalSteps: [
      'Jadwalkan sensus "Tajuk Asimetris" setiap rotasi 3 bulan oleh regu sensus proteksi tanaman.',
      'Begitu ditemukan pokok dengan gejala separuh layu, langsung gali parit isolasi 4x4 meter sedalam 80 cm, tanah galian dilempar ke arah dalam pokok sakit.',
      'Bumbun pangkal pokok sakit dengan tanah gembur subur setinggi 70 cm dan siram dengan suspensi Trichoderma 500 gram/pokok untuk merangsang akar udara baru.'
    ],
    audioTranscript: 'Kalau kita tunggu jamurnya keluar di kulit pohon, kita sudah terlambat menyelamatkan blok itu. Ganoderma itu ibarat kanker tersembunyi; lihat perubahan warna pucuk daun tombak yang mengering kusam.',
    verifiedBy: 'Bagian Riset & Proteksi Tanaman Regional III',
    helpfulCount: 215,
    tags: ['Ganoderma', 'Deteksi Dini', 'Biokontrol', 'Kesehatan Akar']
  },
  {
    id: 'vault-03',
    title: 'Teknik Kalibrasi Takaran Pupuk Mangkok Lokal agar Bobot Gram/Pokok Selaras SOP Tanpa Timbangan Portabel',
    contributor: {
      name: 'Bpk. Ahmad Dahlan',
      role: 'Mandor Satu Teladan (30 Tahun Pengabdian)',
      unitOrigin: 'Kebun Sawit Langkat',
      experienceYears: 30
    },
    category: 'Pemupukan',
    dateShared: '05 Januari 2026',
    summary: 'Cara praktis memastikan buruh tebar pupuk menabur dosis 2.25 kg NPK per pokok secara konsisten di lapangan berbukit tanpa repot membawa timbangan gantung.',
    tacitInsight: 'Di lapangan berbukit atau cuaca panas, tenaga tebar sering terburu-buru sehingga satu pokok kelebihan pupuk dan pokok lain kekurangan. Di kebun kami, kami memotong jeriken minyak 5 liter bekas menjadi mangkok takaran berpola garis spidol permanen merah, biru, dan kuning sesuai jenis pupuk (NPK, Urea, MOP). Kuncinya adalah density pupuk: 1 mangkok penuh Urea tidak sama beratnya dengan 1 mangkok penuh Rock Phosphate!',
    practicalSteps: [
      'Lakukan penimbangan awal 10 kali di gudang pupuk pagi hari untuk menentukan garis potong jeriken sesuai berat jenis masing-masing pupuk.',
      'Uji acak 5 pokok di tengah ancak tebar sebelum jam 11.00 WIB dengan mengumpulkan sisa tebaran di lembar terpal kontrol.',
      'Pastikan pupuk ditebar dengan ayunan lengan setengah lingkaran (180 derajat) di luar batas piringan bersih, bukan dilempar menumpuk.'
    ],
    audioTranscript: 'Mandor yang baik itu bukan yang cerewet di pos, tapi yang pagi-pagi sudah pegang spidol menandai batas mangkok takaran untuk anggotanya. Hasilnya pemupukan rata, daun hijau merata.',
    verifiedBy: 'Manajer Kebun Sawit Langkat',
    helpfulCount: 172,
    tags: ['Kalibrasi Pupuk', 'Efisiensi Dosis', 'Praktik Mandor', 'Zero Waste']
  },
  {
    id: 'vault-04',
    title: 'Manajemen Rotasi Ancak Panen Saat Musim Puncak (Peak Crop) Tanpa Mengorbankan Kualitas TBS',
    contributor: {
      name: 'Ibu Siti Rahma, SP',
      role: 'Mantan Kepala Seksi Agronomi & Panen (24 Tahun Pengabdian)',
      unitOrigin: 'Kebun Adolina',
      experienceYears: 24
    },
    category: 'Manajemen Mandor',
    dateShared: '18 Februari 2026',
    summary: 'Strategi pembagian ancak giring vs ancak tetap ketika produksi melonjak 160% dari kapasitas normal pemanen.',
    tacitInsight: 'Ketika musim puncak tiba, banyak pemanen tergoda meninggalkan brondolan karena mengejar jumlah janjang. Pendekatan saya: bentuk regu khusus "Brondolan Squad" dari tenaga harian lepas yang bertugas mengekor 30 menit di belakang pemanen utama. Hal ini menaikkan output janjang pemanen hingga 35% dan tetap menjaga losses brondolan di bawah 0.1%.',
    practicalSteps: [
      'Gunakan sistem rotasi 5/7 (5 hari panen, 2 hari rotasi ulang) pada blok dengan indeks kematangan tinggi.',
      'Sediakan karung brondolan bertanda pita warna khusus untuk membedakan hasil ancak pagi dan sore.',
      'Koordinasikan pemuatan truk langsung dari TPH tanpa menginap lebih dari 12 jam untuk mencegah lonjakan asam lemak bebas (ALB).'
    ],
    audioTranscript: 'Di musim puncak, musuh terbesar kita bukan tenaga yang kurang, tapi koordinasi antara pemotong buah dan pengutip brondolan. Kalau dipisahkan tugasnya, keduanya bisa kerja maksimal.',
    verifiedBy: 'General Manager Distrik Serdang',
    helpfulCount: 189,
    tags: ['Peak Crop', 'Ancak Panen', 'Brondolan', 'Manajemen SDM']
  }
];

export const INITIAL_FORUM_THREADS: ForumThread[] = [
  {
    id: 'thread-01',
    title: 'Penanganan Genangan Air di Gawangan Rendahan Lahan Pasiran Saat Musim Hujan Berkelanjutan',
    category: 'Agronomi & Drainase',
    author: 'Wahyu Hidayat',
    authorRole: 'Asisten Afdeling IV',
    unitOrigin: 'Kebun Adolina',
    timestamp: '2 jam yang lalu',
    description: 'Blok 14B dan 15A seluas 38 Ha mengalami genangan air setinggi 20-30 cm di pasar pikul pasca hujan deras 4 hari berturut-turut. Kegiatan panen terhambat karena angkong tidak bisa lewat dan penyerapan pupuk tertunda. Mohon masukan rekan-rekan afdeling lain untuk sodetan darurat tanpa merusak akar lateral sawit.',
    status: 'Resolved',
    views: 342,
    tags: ['Drainase', 'Pasar Pikul', 'Lahan Pasiran', 'Musim Hujan'],
    replies: [
      {
        id: 'reply-1',
        author: 'Rahmat Siregar, ST',
        authorRole: 'Asisten Kepala',
        unitOrigin: 'Kebun Pabatu',
        timestamp: '1 jam yang lalu',
        content: 'Halo Pak Wahyu. Kasus serupa kami tangani di Afdeling II Pabatu tahun lalu. Jangan membuat sodetan manual terlalu dalam di dekat pokok karena memutus akar serabut pengisap hara. Buat parit cacing (field drain) ukuran lebar 40 cm kedalaman 50 cm tepat di tengah gawangan mati (antara dua baris pelepah tumpukan), arahkan ke outlet drainase utama afdeling. Kami pakai mini excavator sewa afdeling 2 hari selesai dan genangan surut dalam 6 jam.',
        isVerifiedSolution: true
      },
      {
        id: 'reply-2',
        author: 'Junaedi',
        authorRole: 'Mandor Panen',
        unitOrigin: 'Kebun Sei Karang',
        timestamp: '45 menit yang lalu',
        content: 'Untuk sementara sebelum parit selesai, buat jembatan darurat (titi panen) menggunakan 2 batang kayu akasia yang diikat kawat di pasar pikul agar angkong brondolan tidak terbenam lumpur, Pak.'
      }
    ]
  },
  {
    id: 'thread-02',
    title: 'Populasi Ulat Kantung (Metisa plana) Mulai Melampaui Ambang Sensus di Perbatasan Areal Warga',
    category: 'Proteksi Hama',
    author: 'Dedi Kurniawan',
    authorRole: 'Asisten Tanaman',
    unitOrigin: 'Kebun Sei Karang',
    timestamp: '5 jam yang lalu',
    description: 'Hasil sensus kemarin di Blok 22 (perbatasan dengan kebun masyarakat yang tidak terawat) menunjukkan rata-rata 12 ulat kantung per pelepah pada pelepah nomor 17 dan 25. Daun mulai tampak kering terbakar. Apakah rekan-rekan menyarankan langsung fogging malam hari atau cukup injeksi batang?',
    status: 'Open',
    views: 218,
    tags: ['Ulat Kantung', 'Sensus Hama', 'Fogging', 'Perbatasan Kebun'],
    replies: [
      {
        id: 'reply-3',
        author: 'Ir. Bambang Hermanto',
        authorRole: 'Senior Agronomist (Purna Bakti)',
        unitOrigin: 'Advisor Regional III',
        timestamp: '3 jam yang lalu',
        content: 'Perhatikan arah angin dari kebun warga. Jika pokok sudah tinggi (>6 meter), fogging dengan mesin swingfog pada pukul 05.00 - 07.30 pagi saat inversi suhu atmosfer jauh lebih efektif daripada malam hari. Gunakan deltametrin dicampur solar dengan rasio 1:19. Untuk 2 baris terluar perbatasan warga, lakukan injeksi batang asefat agar menjadi benteng penahan migrasi larva baru.'
      }
    ]
  },
  {
    id: 'thread-03',
    title: 'Efektivitas Penggunaan Feromon Agregasi Sintetis vs Sanitasi Cincangan pada Replanting TBM-1',
    category: 'Replanting & TBM',
    author: 'Surya Pratama',
    authorRole: 'Staf Tanaman Baru',
    unitOrigin: 'Kebun Tanah Itam Hulu',
    timestamp: '1 hari yang lalu',
    description: 'Kami sedang mempersiapkan penanaman bibit kelapa sawit TBM-1 seluas 120 Ha bekas tanaman tua. Berapa jarak ideal ferotrap dari bibitan muda agar kumbang dewasa tidak malah tertarik mendekati pucuk bibit?',
    status: 'Resolved',
    views: 405,
    tags: ['Kumbang Tanduk', 'TBM', 'Replanting', 'Ferotrap'],
    replies: [
      {
        id: 'reply-4',
        author: 'Hendra Saputra',
        authorRole: 'Asisten Afdeling I',
        unitOrigin: 'Kebun Sawit Langkat',
        timestamp: '20 jam yang lalu',
        content: 'Catatan penting: Jangan pernah pasang tiang ferotrap DI DALAM blok bibitan muda! Pasang di batas tepi jalan utama atau gawangan luar dengan jarak minimal 50-70 meter dari bibit terdekat. Jika dipasang terlalu dekat, kumbang yang terbang mendekati sumber aroma feromon sering kali mampir dulu menggerek pupus daun bibit muda di sekitarnya sebelum masuk ember.',
        isVerifiedSolution: true
      }
    ]
  }
];
