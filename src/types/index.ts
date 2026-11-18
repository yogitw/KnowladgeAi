export interface SopDocument {
  id: string;
  code: string;
  title: string;
  category: 'Panen' | 'Pemupukan' | 'Proteksi Tanaman' | 'Pemeliharaan' | 'Taksasi';
  version: string;
  effectiveDate: string;
  summary: string;
  keyPoints: string[];
  toleranceLimit: string;
  criticalDo: string[];
  criticalDont: string[];
  pdfReference?: string;
}

export interface ExpertVaultEntry {
  id: string;
  title: string;
  contributor: {
    name: string;
    role: string;
    unitOrigin: string;
    experienceYears: number;
    avatarUrl?: string;
  };
  category: 'Panen & Taksasi' | 'Pemupukan' | 'Hama & Penyakit' | 'Manajemen Mandor';
  dateShared: string;
  summary: string;
  practicalSteps: string[];
  tacitInsight: string;
  audioTranscript?: string;
  verifiedBy: string;
  helpfulCount: number;
  tags: string[];
}

export interface ForumReply {
  id: string;
  author: string;
  authorRole: string;
  unitOrigin: string;
  timestamp: string;
  content: string;
  isVerifiedSolution?: boolean;
}

export interface ForumThread {
  id: string;
  title: string;
  category: string;
  author: string;
  authorRole: string;
  unitOrigin: string;
  timestamp: string;
  description: string;
  status: 'Open' | 'Resolved' | 'Under Review';
  views: number;
  replies: ForumReply[];
  tags: string[];
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  sopReference?: {
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
  practicalSteps?: string[];
  riskWarning?: string;
}
