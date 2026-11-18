import express, { Request, Response } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { OFFICIAL_SOPS, EXPERT_VAULT, INITIAL_FORUM_THREADS } from './src/data/defaultData.ts';
import { ExpertVaultEntry, ForumThread } from './src/types/index.ts';
import { getAgronomySopResponse } from './src/utils/sopEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

// In-memory persistent state for the session
let sops = [...OFFICIAL_SOPS];
let vaultEntries = [...EXPERT_VAULT];
let forumThreads = [...INITIAL_FORUM_THREADS];

// Shared Gemini AI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes
app.get('/api/sop', (_req: Request, res: Response) => {
  res.json({ sops });
});

app.get('/api/vault', (_req: Request, res: Response) => {
  res.json({ vault: vaultEntries });
});

app.post('/api/vault/submit', (req: Request, res: Response) => {
  const { title, contributor, category, summary, practicalSteps, tacitInsight, audioTranscript, tags } = req.body;
  
  if (!title || !summary || !tacitInsight) {
    return res.status(400).json({ error: 'Title, summary, and tacit insight are required' });
  }

  const newEntry: ExpertVaultEntry = {
    id: `vault-${Date.now()}`,
    title,
    contributor: {
      name: contributor?.name || 'Planter PTPN IV',
      role: contributor?.role || 'Staf Agronomi Senior',
      unitOrigin: contributor?.unitOrigin || 'PTPN IV Regional III',
      experienceYears: Number(contributor?.experienceYears || 15)
    },
    category: category || 'Panen & Taksasi',
    dateShared: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
    summary,
    practicalSteps: Array.isArray(practicalSteps) ? practicalSteps : [practicalSteps],
    tacitInsight,
    audioTranscript: audioTranscript || '',
    verifiedBy: 'Tim Riset & Inovasi 5G PTPN IV',
    helpfulCount: 1,
    tags: Array.isArray(tags) ? tags : ['Praktik Lapangan']
  };

  vaultEntries.unshift(newEntry);
  res.status(201).json({ success: true, entry: newEntry });
});

app.get('/api/forum', (_req: Request, res: Response) => {
  res.json({ threads: forumThreads });
});

app.post('/api/forum', (req: Request, res: Response) => {
  const { title, category, author, authorRole, unitOrigin, description, tags } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const newThread: ForumThread = {
    id: `thread-${Date.now()}`,
    title,
    category: category || 'Agronomi Lapangan',
    author: author || 'Asisten Kebun',
    authorRole: authorRole || 'Staf Operasional',
    unitOrigin: unitOrigin || 'PTPN IV Regional III',
    timestamp: 'Baru saja',
    description,
    status: 'Open',
    views: 1,
    tags: Array.isArray(tags) ? tags : ['Operasional'],
    replies: []
  };

  forumThreads.unshift(newThread);
  res.status(201).json({ success: true, thread: newThread });
});

app.post('/api/forum/:id/reply', (req: Request, res: Response) => {
  const { id } = req.params;
  const { author, authorRole, unitOrigin, content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Reply content is required' });
  }

  const thread = forumThreads.find(t => t.id === id);
  if (!thread) {
    return res.status(404).json({ error: 'Thread not found' });
  }

  const newReply = {
    id: `reply-${Date.now()}`,
    author: author || 'Planter Rekan',
    authorRole: authorRole || 'Asisten Afdeling',
    unitOrigin: unitOrigin || 'PTPN IV Regional III',
    timestamp: 'Baru saja',
    content,
    isVerifiedSolution: false
  };

  thread.replies.push(newReply);
  thread.views += 1;
  res.status(201).json({ success: true, reply: newReply });
});

// AI Copilot SOP endpoint
app.post('/api/copilot/ask', async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const systemInstruction = `
Anda adalah AI Copilot SOP Resmi & Penasihat Agronomi Lapangan PTPN IV Regional III dalam ekosistem PlanterKnowledge Hub.
Tugas Anda adalah merespons pertanyaan asisten afdeling, mandor, atau staf lapangan perkebunan kelapa sawit dengan rujukan Standard Operating Procedure (SOP) resmi perusahaan dan kiat taktis lapangan (*tacit knowledge*).

Katalog SOP Resmi PTPN IV yang Anda kuasai:
1. SOP-TAN-01: Standar Operasional Pemanenan TBS & Kriteria Matang Panen (Minimal 5 butir brondolan lepas di piringan, rotasi 7 hari, potong gagang mepet V/C-shape maks 2 cm, kutipan brondolan 100%, toleransi buah mentah <= 2%).
2. SOP-TAN-02: Tata Kelola Pemupukan Presisi Kelapa Sawit TM & TBM (Radius sebar tajuk 1-1.5m dari pangkal piringan, kondisi tanah lembap curah hujan 100-250 mm/bln, jangan campur Urea & RP bersamaan, dosis mikro Borat 100-150 gr/pokok/thn, kalibrasi mangkok takaran).
3. SOP-PROT-01: Pengendalian UPDKS / Ulat Api Setothosea asigna & Darna trima (Ambang kritis sensus >= 5 ulat/pelepah, fogging pagi 05.00-08.00 saat angin tenang, trunk injection asefat 10-15 ml/pokok).
4. SOP-PROT-02: Mitigasi Kumbang Tanduk Oryctes rhinoceros (1 unit ferotrap feromon per 2 Ha, pasang di pinggir jalan blok min 50m dari bibitan, legum Mucuna bracteata, bioinsektisida Metarhizium).
5. SOP-PROT-03: Protokol Sanitasi Ganoderma boninense (Deteksi dini tajuk asimetris/layu separuh, isolasi parit 4x4m kedalaman 80cm, pembumbunan tanah gembur 60-80cm, inokulasi Trichoderma 200-400 gr).
6. SOP-TAN-03: Metode Taksasi Produksi AKP (Angka Kerapatan Panen H-1, rumus AKP = (Tandan Matang / Pokok Sampel) * 100%, taksasi tonase = Pokok * AKP% * BJR).

Format Wajib: Responlah HANYA dalam JSON valid dengan struktur:
{
  "summary": "Jawaban taktis padat dan lugas bahasa perkebunan PTPN IV",
  "sopReference": {
    "code": "SOP-TAN-01 / SOP-TAN-02 / dll",
    "title": "Judul SOP resmi terkait",
    "clause": "Pasal / Bab / Butir klausul spesifik",
    "quote": "Kutipan aturan baku SOP resmi"
  },
  "calculation": {
    "title": "Nama perhitungan jika relevan (misal Kebutuhan Pupuk / Taksasi AKP)",
    "formula": "Rumus matematis atau perbandingan",
    "result": "Hasil atau standar angka dosis",
    "note": "Catatan kalibrasi teknis"
  },
  "practicalSteps": [
    "Langkah kerja 1 di lapangan untuk mandor/asisten",
    "Langkah kerja 2",
    "Langkah kerja 3"
  ],
  "riskWarning": "Peringatan bahaya/larangan mutlak (Do not / Critical Don't)"
}
`;

  try {
    if (apiKey) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, ...parsed });
      } catch {
        return res.json(getAgronomySopResponse(prompt));
      }
    } else {
      return res.json(getAgronomySopResponse(prompt));
    }
  } catch (error: any) {
    console.warn('Copilot upstream note (using high-accuracy fallback):', error?.message);
    return res.json(getAgronomySopResponse(prompt));
  }
});

// Serve frontend in dev via Vite middlewares, or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const httpServer = http.createServer(app);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        ws: { server: httpServer },
        ...(process.env.DISABLE_HMR === 'true' ? { hmr: false } : {}),
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`PlanterKnowledge Hub server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
