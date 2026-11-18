import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, Mic, MicOff, Volume2, VolumeX, Sparkles, AlertTriangle, 
  CheckCircle2, BookOpen, Calculator, RefreshCw, ChevronRight, FileText,
  Radio, X, Check, Volume1, ArrowRight, Activity
} from 'lucide-react';
import { CopilotMessage, SopDocument } from '../types/index.ts';
import { getAgronomySopResponse } from '../utils/sopEngine.ts';

interface SopCopilotViewProps {
  onSelectSop: (code: string) => void;
  onOpenCalculator: () => void;
  sops: SopDocument[];
}

export const SopCopilotView: React.FC<SopCopilotViewProps> = ({
  onSelectSop,
  onOpenCalculator,
  sops
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      timestamp: '07:00 WIB',
      text: 'Selamat pagi rekan planter PTPN IV Regional III. Saya adalah AI Copilot SOP Operasional. Siap membantu konsultasi aturan baku panen TBS, takaran pemupukan presisi, ambang batas sensus hama ulat api, sanitasi Ganoderma, serta taksasi AKP langsung di lapangan.',
      sopReference: {
        code: 'SOP PTPN IV Regional III',
        title: 'Standar Operasional Tanaman Kelapa Sawit Terintegrasi',
        clause: 'Ketentuan Umum Operasional Mandor & Asisten Kebun',
        quote: 'Seluruh kegiatan operasional kebun wajib patuh pada norma baku agronomi demi menjaga kesinambungan produksi dan mutu CPO.'
      },
      practicalSteps: [
        'Ajukan pertanyaan dengan mengetik atau menekan tombol mikrofon suara di bawah.',
        'Sistem akan menampilkan rujukan resmi nomor SOP, pasal, dan langkah kerja terukur.',
        'Gunakan tombol Mode Suara Lapangan untuk interaksi hands-free saat memegang alat di ancak kebun.'
      ]
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  // Hands-Free Field Voice Assistant State
  const [isHandsFreeOpen, setIsHandsFreeOpen] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'processing' | 'answering'>('idle');
  const [autoSpeakResponse, setAutoSpeakResponse] = useState(true);
  const [recognitionSupported, setRecognitionSupported] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const quickScenarios = [
    { label: 'Kriteria Matang Panen TBS', query: 'Bagaimana kriteria kematangan panen TBS dan batas toleransi buah mentah sesuai SOP-TAN-01?' },
    { label: 'Takaran Pupuk NPK TM', query: 'Berapa takaran pupuk NPK untuk TM kelapa sawit dan radius sebar tajuk yang benar di piringan?' },
    { label: 'Darurat Ulat Api', query: 'Bagaimana penanganan darurat hama ulat api jika hasil sensus melampaui ambang batas ekonomi?' },
    { label: 'Deteksi Dini Ganoderma', query: 'Bagaimana cara mendeteksi Ganoderma stadium awal pada tajuk dan prosedur pembuatan parit isolasi?' },
    { label: 'Taksasi AKP H-1', query: 'Jelaskan rumus taksasi AKP untuk menghitung estimasi tonase panen esok hari.' }
  ];

  // Voice Test Presets for Field Assistant
  const fieldVoicePresets = [
    'Berapa takaran pupuk NPK untuk TM umur 7 tahun dan radius sebarnya?',
    'Apa batas toleransi buah mentah di TPH menurut SOP panen?',
    'Bagaimana tindakan darurat jika sensus ulat api lebih dari 5 ekor?',
    'Kapan waktu paling efektif fogging ulat api di kebun?',
    'Berapa jarak aman pemasangan ferotrap kumbang dari bibit muda?',
    'Bagaimana ciri tajuk asimetris pohon sawit terserang Ganoderma?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Audio chimes for field workers
  const playChime = useCallback((type: 'start' | 'stop' | 'success') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'start') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'stop') {
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.1); // A5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch {
      // Audio cue fallback ignore
    }
  }, []);

  // Text-to-Speech audio playback
  const handleToggleSpeak = useCallback((msgId: string, textToSpeak: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'id-ID';
    utterance.rate = 1.05;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  }, [speakingMessageId]);

  // Core Send Message function
  const handleSendMessage = async (textToSend?: string, shouldAutoSpeak = autoSpeakResponse) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);
    setVoiceStatus('processing');

    try {
      let data: any;
      try {
        const response = await fetch('/api/copilot/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: query })
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        data = await response.json();
      } catch {
        // Static hosting (GitHub Pages / offline) fallback
        data = getAgronomySopResponse(query);
      }

      if (data?.success) {
        const assistantMsg: CopilotMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          text: data.summary,
          sopReference: data.sopReference,
          calculation: data.calculation,
          practicalSteps: data.practicalSteps,
          riskWarning: data.riskWarning
        };
        setMessages(prev => [...prev, assistantMsg]);
        setVoiceStatus('answering');
        playChime('success');

        // Hands-free Voice read out
        if (shouldAutoSpeak) {
          const speechSummary = `${data.summary}. Rujukan resmi: ${data.sopReference?.code || 'SOP PTPN IV'}.`;
          handleToggleSpeak(assistantMsg.id, speechSummary);
        }
      } else {
        throw new Error(data?.error || 'Gagal memproses jawaban');
      }
    } catch {
      const fallback = getAgronomySopResponse(query);
      const fallbackMsg: CopilotMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
        text: fallback.summary,
        sopReference: fallback.sopReference,
        calculation: fallback.calculation,
        practicalSteps: fallback.practicalSteps,
        riskWarning: fallback.riskWarning
      };
      setMessages(prev => [...prev, fallbackMsg]);
      setVoiceStatus('idle');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setVoiceStatus('idle');
      }, 2500);
    }
  };

  // Initialize Speech Recognition
  const initSpeechRecognition = useCallback((onFinalResult: (transcript: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus('listening');
        playChime('start');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          setVoiceTranscript(final);
          setInterimTranscript('');
          onFinalResult(final);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        setIsListening(false);
        setVoiceStatus('idle');
        playChime('stop');
      };

      recognition.onend = () => {
        setIsListening(false);
        if (voiceStatus === 'listening') {
          setVoiceStatus('idle');
        }
      };

      return recognition;
    } catch {
      setRecognitionSupported(false);
      return null;
    }
  }, [playChime, voiceStatus]);

  // Toggle Standard Input Bar Voice
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setVoiceStatus('idle');
      playChime('stop');
      return;
    }

    const rec = initSpeechRecognition((finalText) => {
      setInputPrompt(finalText);
      setIsListening(false);
      setVoiceStatus('idle');
      playChime('stop');
    });

    if (rec) {
      recognitionRef.current = rec;
      try {
        rec.start();
      } catch {
        setIsListening(false);
      }
    } else {
      // Graceful simulation fallback for environments without microphone permissions
      setIsListening(true);
      setVoiceStatus('listening');
      playChime('start');
      setTimeout(() => {
        const simulatedText = 'Berapa takaran pupuk NPK untuk TM umur 7 tahun dan radius sebarnya?';
        setInputPrompt(simulatedText);
        setIsListening(false);
        setVoiceStatus('idle');
        playChime('stop');
      }, 2000);
    }
  };

  // Start Hands-Free Voice Listening in Dedicated Modal
  const startHandsFreeListening = () => {
    setVoiceTranscript('');
    setInterimTranscript('');

    const rec = initSpeechRecognition((finalText) => {
      setVoiceTranscript(finalText);
      setIsListening(false);
      playChime('stop');
      // Auto-send immediately for hands-free field convenience
      handleSendMessage(finalText, autoSpeakResponse);
    });

    if (rec) {
      recognitionRef.current = rec;
      try {
        rec.start();
      } catch (err) {
        console.warn('Error starting speech:', err);
      }
    } else {
      // Simulation mode in hands-free modal
      setIsListening(true);
      setVoiceStatus('listening');
      playChime('start');
      setTimeout(() => {
        const sample = 'Bagaimana kriteria kematangan panen TBS dan batas toleransi buah mentah sesuai SOP-TAN-01?';
        setVoiceTranscript(sample);
        setIsListening(false);
        playChime('stop');
        handleSendMessage(sample, autoSpeakResponse);
      }, 2200);
    }
  };

  const stopHandsFreeListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setVoiceStatus('idle');
    playChime('stop');
  };

  // Open Hands-Free Modal and start listening
  const handleOpenHandsFree = () => {
    setIsHandsFreeOpen(true);
    setTimeout(() => {
      startHandsFreeListening();
    }, 300);
  };

  const toggleStep = (stepKey: string) => {
    setCheckedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Banner / Context Bar */}
      <div className="mb-6 p-4 rounded-xl border border-emerald-900/10 dark:border-emerald-700/20 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
            <span>5G Innovation Challenge 2026</span>
            <span>·</span>
            <span>PTPN IV Regional III</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Operational SOP Copilot
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mt-0.5">
            Asisten cerdas lini depan untuk asisten kebun, mandor, dan staf lapangan. Dilengkapi pengenalan suara instan tanpa perlu mengetik manual saat berada di tengah blok kebun.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Prominent Voice Mode Button */}
          <button
            onClick={handleOpenHandsFree}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-lg transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <Mic className="w-4 h-4 text-emerald-950 animate-pulse" />
            Mode Suara Lapangan (Hands-Free)
          </button>

          <button
            onClick={onOpenCalculator}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 rounded-lg border border-emerald-600/30 transition-colors whitespace-nowrap"
          >
            <Calculator className="w-4 h-4 text-amber-300" />
            Kalkulator Agronomi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Conversation Stream (3 Columns on desktop) */}
        <div className="lg:col-span-3 flex flex-col h-[700px] bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden">
          {/* Top Bar with Hands-Free quick toggle & Quick Scenario Chips */}
          <div className="px-4 py-2.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex items-center justify-between gap-3 overflow-x-auto text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-600 dark:text-stone-400 font-medium whitespace-nowrap shrink-0">
                Skenario Cepat:
              </span>
              {quickScenarios.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sc.query)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-md bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 whitespace-nowrap transition-colors"
                >
                  {sc.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleOpenHandsFree}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-700 whitespace-nowrap shrink-0 ml-auto"
            >
              <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              Bicara di Kebun
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 mb-1 px-1">
                  <span className="font-medium text-stone-700 dark:text-stone-300">
                    {msg.sender === 'user' ? 'Anda (Planter Lapangan)' : 'AI Copilot SOP PTPN IV'}
                  </span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-2xl rounded-xl p-4 sm:p-5 transition-all ${
                    msg.sender === 'user'
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  }`}
                >
                  {/* Text Body */}
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </div>

                  {/* SOP Reference Citation Box */}
                  {msg.sopReference && (
                    <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                            Rujukan: {msg.sopReference.code}
                          </span>
                        </div>
                        <button
                          onClick={() => onSelectSop(msg.sopReference!.code)}
                          className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          Buka Bab SOP
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                        {msg.sopReference.title}
                      </div>
                      <div className="text-[11px] text-emerald-800 dark:text-emerald-400 mt-0.5">
                        {msg.sopReference.clause}
                      </div>
                      <blockquote className="mt-2 text-xs italic text-stone-600 dark:text-stone-300 bg-white/70 dark:bg-stone-900/50 p-2 rounded border border-emerald-100 dark:border-emerald-900/40">
                        "{msg.sopReference.quote}"
                      </blockquote>
                    </div>
                  )}

                  {/* Calculation Box */}
                  {msg.calculation && (
                    <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300 mb-1">
                        <Calculator className="w-4 h-4" />
                        {msg.calculation.title}
                      </div>
                      <div className="text-xs font-mono tabular-nums text-stone-700 dark:text-stone-300">
                        <strong>Rumus:</strong> {msg.calculation.formula}
                      </div>
                      <div className="text-xs font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400 mt-1">
                        <strong>Hasil:</strong> {msg.calculation.result}
                      </div>
                      {msg.calculation.note && (
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                          {msg.calculation.note}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Practical Field Action Steps */}
                  {msg.practicalSteps && msg.practicalSteps.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700">
                      <div className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Langkah Kerja Mandor & Staf di Lapangan:
                      </div>
                      <div className="space-y-1.5">
                        {msg.practicalSteps.map((step, sIdx) => {
                          const stepKey = `${msg.id}-step-${sIdx}`;
                          const isDone = !!checkedSteps[stepKey];
                          return (
                            <button
                              key={sIdx}
                              onClick={() => toggleStep(stepKey)}
                              className={`w-full text-left flex items-start gap-2.5 p-2 rounded-md transition-colors ${
                                isDone 
                                  ? 'bg-emerald-50/80 dark:bg-emerald-950/20 text-stone-500 dark:text-stone-400 line-through'
                                  : 'hover:bg-stone-100 dark:hover:bg-stone-700/50 text-stone-800 dark:text-stone-200'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-xs font-semibold ${
                                isDone
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                              }`}>
                                {sIdx + 1}
                              </span>
                              <span className="text-xs leading-relaxed">
                                {step}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Risk Warning Box */}
                  {msg.riskWarning && (
                    <div className="mt-3 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-rose-900 dark:text-rose-300">
                          Peringatan Kritis (Critical Don't):
                        </div>
                        <div className="text-xs text-rose-800 dark:text-rose-200 mt-0.5">
                          {msg.riskWarning}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Audio Read-Aloud Action */}
                  {msg.sender === 'assistant' && (
                    <div className="mt-3 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <span className="text-[11px]">Dukungan Suara 5G Edge</span>
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.text)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors"
                      >
                        {speakingMessageId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-500" />
                            <span>Hentikan Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Dengarkan SOP</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-400 flex items-center justify-center shrink-0 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                  <span>AI Copilot sedang memverifikasi klausul SOP PTPN IV dan menghitung norma teknis...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            {/* Live speech feedback bar if active */}
            {isListening && (
              <div className="mb-2 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <span className="font-semibold">Mendengarkan suara Anda di kebun...</span>
                  {interimTranscript && (
                    <span className="italic text-stone-600 dark:text-stone-300">
                      "{interimTranscript}"
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className="text-[11px] text-rose-700 font-bold hover:underline"
                >
                  Selesai Bicara
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Voice Input Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                title="Tekan untuk bertanya lewat suara langsung"
                className={`p-3 rounded-lg border transition-all flex items-center justify-center relative ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-4 ring-rose-300 dark:ring-rose-900/50'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 animate-pulse" />
                ) : (
                  <Mic className="w-5 h-5 text-emerald-800 dark:text-emerald-300" />
                )}
                {isListening && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                  </span>
                )}
              </button>

              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={isListening ? 'Mendengarkan suara Anda... (Bicara sekarang)' : 'Tanyakan SOP lewat suara atau ketik (contoh: takaran pupuk NPK, sensus ulat api, toleransi panen)...'}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-600 dark:placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-700"
              />

              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className="px-4 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-sm flex items-center gap-2 transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Kirim</span>
              </button>
            </form>

            <div className="text-[11px] text-stone-600 dark:text-stone-400 mt-2 flex items-center justify-between px-1">
              <span className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-emerald-700" />
                Dukungan Input Suara Lapangan Bahasa Indonesia Aktif
              </span>
              <button
                type="button"
                onClick={handleOpenHandsFree}
                className="text-emerald-800 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                Buka Layar Penuh Hands-Free
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Drawer: Quick SOP Index & Plantation Stats */}
        <div className="space-y-6">
          {/* Hands-Free Quick Callout Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-xl p-5 shadow-xs border border-emerald-800/60">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Radio className="w-4 h-4 animate-pulse" />
              Fitur 5G Lini Depan
            </div>
            <h3 className="text-base font-bold text-white">
              Mode Suara Tanpa Ketik
            </h3>
            <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
              Saat tangan memegang dodos/egrek atau bersarung tangan di kebun, asisten dapat menekan tombol suara dan bertanya langsung. Jawaban akan langsung dibacakan via audio.
            </p>
            <button
              onClick={handleOpenHandsFree}
              className="mt-4 w-full py-2 px-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Mic className="w-4 h-4" />
              Mulai Tanya Lewat Suara
            </button>
          </div>

          {/* Quick SOP Catalogue Card */}
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                SOP Resmi Aktif
              </h2>
              <span className="text-xs text-stone-600 dark:text-stone-400">
                {sops.length} Dokumen
              </span>
            </div>

            <div className="space-y-2">
              {sops.slice(0, 5).map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectSop(s.code)}
                  className="w-full text-left p-2.5 rounded-lg border border-stone-100 dark:border-stone-800 hover:border-emerald-600 dark:hover:border-emerald-500 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-white dark:hover:bg-stone-800 transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                    <span>{s.code}</span>
                    <span className="text-[10px] text-stone-600 dark:text-stone-400 font-normal">{s.category}</span>
                  </div>
                  <div className="text-xs text-stone-800 dark:text-stone-200 font-medium line-clamp-1 mt-0.5 group-hover:text-emerald-900 dark:group-hover:text-emerald-300">
                    {s.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Field Norms Reference */}
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Norma Baku Lapangan
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                <div className="font-semibold text-stone-800 dark:text-stone-200">
                  Rotasi Panen TBS
                </div>
                <div className="text-stone-600 dark:text-stone-400 mt-0.5">
                  Interval 7 hari sekali. Memotong gagang mepet V-shape maks 2 cm.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                <div className="font-semibold text-stone-800 dark:text-stone-200">
                  Ambang Kritis Ulat Api
                </div>
                <div className="text-stone-600 dark:text-stone-400 mt-0.5">
                  ≥ 5 ulat/pelepah (Setothosea asigna). Wajib fogging/injeksi 1x24 jam.
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                <div className="font-semibold text-stone-800 dark:text-stone-200">
                  Radius Penebaran Pupuk
                </div>
                <div className="text-stone-600 dark:text-stone-400 mt-0.5">
                  1.0 - 1.5 meter melingkar dari pangkal piringan di bawah tajuk aktif.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED HANDS-FREE FIELD VOICE ASSISTANT MODAL */}
      {isHandsFreeOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => {
                stopHandsFreeListening();
                setIsHandsFreeOpen(false);
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Status */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2">
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Voice Copilot · Asisten Lapangan 5G</span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Bicara Langsung di Kebun
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm">
              Sampaikan pertanyaan mengenai SOP operasional. Pertanyaan Anda akan otomatis dikirim dan dibacakan kembali.
            </p>

            {/* Big Pulsing Microphone Centerpiece */}
            <div className="my-8 relative flex items-center justify-center">
              {/* Outer wave rings */}
              {isListening && (
                <>
                  <div className="absolute w-36 h-36 rounded-full bg-rose-500/10 animate-ping" />
                  <div className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-pulse" />
                </>
              )}
              {voiceStatus === 'processing' && (
                <div className="absolute w-32 h-32 rounded-full bg-amber-500/20 animate-spin" />
              )}

              <button
                onClick={isListening ? stopHandsFreeListening : startHandsFreeListening}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl relative z-10 ${
                  isListening
                    ? 'bg-rose-600 text-white scale-105 ring-8 ring-rose-200 dark:ring-rose-950/60'
                    : voiceStatus === 'processing'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-10 h-10 animate-bounce" />
                ) : voiceStatus === 'processing' ? (
                  <RefreshCw className="w-10 h-10 animate-spin" />
                ) : (
                  <Mic className="w-10 h-10 text-amber-300" />
                )}
              </button>
            </div>

            {/* Live Status Label */}
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 mb-4 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              {isListening
                ? 'Mendengarkan... Silakan bicara sekarang'
                : voiceStatus === 'processing'
                ? 'Menganalisis SOP & Menghitung Norma...'
                : voiceStatus === 'answering'
                ? 'Jawaban Siap & Sedang Dibacakan'
                : 'Tekan mikrofon untuk mulai bicara'}
            </div>

            {/* Real-time Transcript display */}
            <div className="w-full min-h-[70px] p-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 flex flex-col justify-center mb-5">
              {voiceTranscript ? (
                <div className="font-medium text-emerald-900 dark:text-emerald-300">
                  "{voiceTranscript}"
                </div>
              ) : interimTranscript ? (
                <div className="italic text-stone-500 animate-pulse">
                  "{interimTranscript}..."
                </div>
              ) : (
                <div className="text-stone-400 italic">
                  Contoh: "Berapa takaran pupuk NPK untuk TM umur 7 tahun?"
                </div>
              )}
            </div>

            {/* Quick Test Voice Prompts for Field Staff */}
            <div className="w-full text-left mb-4">
              <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1.5 flex items-center justify-between">
                <span>Atau pilih pertanyaan cepat di lapangan:</span>
                <span className="text-emerald-700 dark:text-emerald-400 text-[10px]">1-Sentuhan Langsung</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {fieldVoicePresets.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => {
                      setVoiceTranscript(preset);
                      stopHandsFreeListening();
                      handleSendMessage(preset, autoSpeakResponse);
                    }}
                    className="w-full text-left p-2 rounded-lg text-xs bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-800 dark:text-stone-200 transition-colors flex items-center justify-between group"
                  >
                    <span className="line-clamp-1">{preset}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Hands-Free Settings (Auto-speak toggle) */}
            <div className="w-full pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSpeakResponse}
                  onChange={(e) => setAutoSpeakResponse(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-700 w-4 h-4"
                />
                <span>Otomatis Bacakan Jawaban (Text-to-Speech)</span>
              </label>

              <button
                onClick={() => {
                  stopHandsFreeListening();
                  setIsHandsFreeOpen(false);
                }}
                className="px-3 py-1 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 rounded font-semibold text-stone-700 dark:text-stone-300"
              >
                Lihat di Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
