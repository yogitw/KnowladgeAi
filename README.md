# PlanterKnowledge Hub 🌿
### Internal Expert Repository & Operational SOP Copilot — PTPN IV Regional III
> **Inovasi 5G Innovation Challenge 2026**

Aplikasi pendamping operasional cerdas (*SOP Copilot*) dan sistem manajemen pengetahuan terpusat (*Knowledge Vault*) yang dirancang untuk asisten kebun, mandor, dan staf lini depan di lingkungan PT Perkebunan Nusantara IV (PTPN IV) Regional III. Mengintegrasikan Standar Operasional Prosedur (SOP) resmi kelapa sawit, retensi wawasan praktis (*tacit knowledge*) para planters senior, forum pemecah sekat informasi (*anti-silo*), serta interaksi suara langsung di tengah blok kebun (*hands-free voice interaction*).

---

## 🚀 Panduan Membuka & Menjalankan dari GitHub

### 1. Prasyarat Sistem
- **Node.js**: Versi `20.x` atau `22.x` (LTS direkomendasikan)
- **NPM**: Versi `10.x` atau lebih baru
- **Git**

### 2. Kloning Repositori & Instalasi Dependensi
```bash
# Clone repositori Anda dari GitHub
git clone https://github.com/<username-anda>/<nama-repo>.git
cd <nama-repo>

# Install seluruh dependensi
npm install
```

### 3. Konfigurasi Variabel Lingkungan (`.env`)
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Buka berkas `.env` dan masukkan API Key Gemini Anda (opsional, aplikasi memiliki mesin fallback cerdas bawaan jika kunci belum diisi):
```env
GEMINI_API_KEY="AIzaSy..."
PORT=3000
```
> 💡 *Catatan:* Kunci API Gemini bisa didapatkan gratis di [Google AI Studio](https://aistudio.google.com). Jika tidak diisi, AI Copilot akan tetap aktif menggunakan mesin agronomi heuristik resmi PTPN IV.

### 4. Menjalankan di Mode Pengembangan (Development)
```bash
npm run dev
```
Buka peramban (browser) di alamat:
👉 **`http://localhost:3000`**

### 5. Kompilasi & Menjalankan Mode Produksi
```bash
# Build frontend Vite & backend Express
npm run build

# Jalankan server produksi
npm start
```

---

## 🌟 Fitur Utama Aplikasi

### 1. 🎙️ AI Copilot SOP Operasional (Multimodal Suara & Teks)
- **Input Suara di Lapangan (*Hands-Free*)**: Mandor dan asisten dapat bertanya langsung lewat suara saat tangan memegang dodos/egrek atau memakai sarung tangan di kebun.
- **Auto-Send & Audio Read-Aloud**: Begitu selesai berbicara, pertanyaan otomatis dikirim dan intisari SOP langsung dibacakan kembali dengan audio suara berbahasa Indonesia.
- **Rujukan Resmi Terstandarisasi**: Mengutip langsung nomor SOP, pasal, batas toleransi, dan langkah kerja praktis di lapangan:
  - `SOP-TAN-01`: Panen TBS, Kriteria Matang (Fraksi 1-2, $\ge 5$ brondolan lepas di piringan), Potong Gagang V/C-shape maks 2 cm.
  - `SOP-TAN-02`: Pemupukan Presisi TM & TBM (Radius sebar tajuk 1–1.5 meter, kondisi tanah lembap, larangan menumpuk di batang).
  - `SOP-PROT-01`: Pengendalian Ulat Api/UPDKS (Ambang sensus $\ge 5$ ulat/pelepah, fogging pagi hari, injeksi batang asefat).
  - `SOP-PROT-02`: Mitigasi Kumbang Tanduk *Oryctes rhinoceros* (Ferotrap agregasi 1 unit / 2 Ha, penanaman *Mucuna bracteata*).
  - `SOP-PROT-03`: Sanitasi Jamur *Ganoderma boninense* (Deteksi dini tajuk asimetris, parit isolasi 4x4m kedalaman 80cm, pembumbunan, dan Trichoderma).
  - `SOP-TAN-03`: Metode Taksasi Produksi AKP H-1.

### 2. 🏛️ Expert Repository & Tacit Knowledge Vault
- Mengabadikan wawasan bertahun-tahun para mantri panen senior, mantan askep, dan pensiunan (seperti Bpk. Sukardi 32 thn pengabdian, Ir. Bambang Hermanto 28 thn, Bpk. Ahmad Dahlan 30 thn, Ibu Siti Rahma, SP 24 thn).
- Dilengkapi pemutar pesan suara sesepuh (*Senior Voice Memo*), intisari rahasia lapangan (*tacit insight*), dan formulir untuk mendokumentasikan wawasan senior baru.

### 3. 🌐 Forum Kolaborasi Lintas Afdeling (*Anti-Silo Mentality*)
- Memecah hambatan komunikasi antar afdeling dan kebun (Kebun Adolina, Kebun Pabatu, Kebun Sei Karang, Kebun Tanah Itam Hulu, Kebun Sawit Langkat).
- Fitur pelaporan kendala (drainase gambut, serangan hama perbatasan, ketiadaan tenaga panen) dan verifikasi solusi resmi oleh Asisten Kepala (*Verified by Askep*).

### 4. 🧮 Kalkulator Agronomi Lapangan
- **Kalkulator AKP**: Menghitung % kerapatan panen, estimasi tandan, estimasi tonase (Ton/Kg), alokasi tenaga pemanen (HK), dan ritase armada truk 6-ton.
- **Kalkulator Pemupukan Presisi**: Menghitung kebutuhan pupuk total (Kg dan karung @50kg), populasi pohon berdasarkan SPH (143/136), dan hari kerja penabur.
- **Kalkulator Proteksi Hama (OPT)**: Rekomendasi volume racun fogging/injeksi batang ulat api, rasio ferotrap, dan inokulasi Trichoderma.

### 5. 📄 Penampil Dokumen Proposal PDF
- Terintegrasi langsung dengan berkas PDF usulan inovasi 5G Innovation Challenge 2026 yang tersimpan secara lokal di `/public/assets/aistudio/PlanterKnowledge_Hub_Proposal__1__43ac70af.pdf`.

---

## 🛠️ Arsitektur Teknologi

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Web Speech API, Web Audio API Synthesis.
- **Backend**: Node.js, Express, TSX, Esbuild.
- **AI Engine**: Google GenAI SDK (`@google/genai`) model `gemini-3.8-flash` dengan system instruction agronomi terstandar PTPN IV.
- **Penyimpanan State**: In-memory data store yang mendukung penambahan data dinamis (Vault & Forum Threads).

---

## 📋 Skrip Perintah (`package.json`)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server dev full-stack (Express + Vite middleware) di port 3000 |
| `npm run build` | Melakukan build frontend Vite dan bundling backend `server.ts` menjadi `server.js` |
| `npm start` | Menjalankan build produksi `server.js` |
| `npm run lint` | Memeriksa tipe data TypeScript (`tsc --noEmit`) |
| `npm run clean` | Membersihkan folder `dist` dan berkas `server.js` |

---

## 📄 Lisensi & Hak Cipta
Hak Cipta © 2026 PT Perkebunan Nusantara IV (PTPN IV) Regional III.  
Diusulkan untuk kompetisi **5G Innovation Challenge 2026**.
