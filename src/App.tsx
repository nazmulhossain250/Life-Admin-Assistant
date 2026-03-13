/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft,
  Loader2, 
  AlertCircle,
  X,
  ChevronRight,
  Sparkles,
  Moon,
  Sun,
  Info,
  Github,
  Twitter,
  Heart,
  ShieldCheck,
  Zap,
  BrainCircuit,
  Linkedin,
  Facebook,
  MapPin,
  GraduationCap,
  Download,
  Printer,
  HeartPulse,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { analyzeDocument, chatWithDocument } from './services/gemini';
import { generateAndDownloadPDF, generatePDFBlob } from './utils/pdfGenerator';
import { AnalysisResult, ChatMessage } from './types';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';

export default function App() {
  const [showApp, setShowApp] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'report' | 'discussion' | 'checklist'>('report');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (result) {
      await generateAndDownloadPDF(result, setError, setPdfLoading);
    }
  };

  const handlePreviewPDF = async () => {
    if (!result) return;
    setPdfLoading(true);
    try {
      const blob = await generatePDFBlob(result);
      if (blob) {
        const url = URL.createObjectURL(blob);
        setPdfPreviewUrl(url);
      }
    } catch (err) {
      console.error('Failed to generate PDF preview:', err);
      setError('Failed to load PDF preview.');
    } finally {
      setPdfLoading(false);
    }
  };

  const closePdfPreview = () => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Handle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload an image of the document.');
      return;
    }
    setFile(selectedFile);
    setError(null);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to 0.8 quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPreview(compressedDataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!preview || !file) return;

    setLoading(true);
    setError(null);
    try {
      const analysis = await analyzeDocument(preview, file.type);
      setResult(analysis);
      setChatHistory([
        { role: 'model', text: `I've analyzed your ${analysis.documentType} document. Here's a brief summary: ${analysis.simplifiedText}. You can ask me any follow-up questions about it below!` }
      ]);
    } catch (err: any) {
      console.error(err);
      setError(`Failed to analyze: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim() || !result || chatLoading) return;

    const newMessage: ChatMessage = { role: 'user', text: userMessage };
    setChatHistory(prev => [...prev, newMessage]);
    setUserMessage('');
    setChatLoading(true);

    try {
      const historyForGemini = chatHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));
      
      const response = await chatWithDocument(userMessage, result, historyForGemini);
      setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    closePdfPreview();
    setChatHistory([]);
    setUserMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  if (!showApp) {
    return (
      <LandingPage 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        setShowApp={setShowApp}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
      />
    );
  }

  return (
    <div className="min-h-screen font-sans selection:bg-emerald-100 bg-stone-50 dark:bg-stone-950 transition-colors duration-300 bg-fixed">
      <Header 
        setShowApp={setShowApp} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        showReset={!!result} 
        onReset={reset} 
      />

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-900 dark:text-white mb-4">
                  Understand any document in seconds.
                </h2>
                <p className="text-stone-600 dark:text-stone-400 text-lg">
                  Upload a photo of a legal letter, medical result, or insurance form. 
                  We'll simplify it and tell you exactly what to do next.
                </p>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile) processFile(droppedFile);
                }}
                className={`
                  relative group cursor-pointer
                  aspect-video md:aspect-[21/9] rounded-3xl border-2 border-dashed 
                  transition-all duration-300 flex flex-col items-center justify-center gap-4
                  ${preview ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-stone-300 dark:border-stone-800 hover:border-emerald-400 hover:bg-stone-50 dark:hover:bg-stone-900'}
                `}
              >
                {preview ? (
                  <div className="relative w-full h-full p-4">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-full object-contain rounded-xl shadow-lg"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); reset(); }}
                      className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Upload size={28} />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-stone-900 dark:text-white">Click to upload or drag and drop</p>
                      <p className="text-sm text-stone-500">PNG, JPG or JPEG (max. 10MB)</p>
                    </div>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="mt-10 flex justify-center">
                <button
                  disabled={!preview || loading}
                  onClick={handleAnalyze}
                  className={`
                    px-8 py-4 rounded-full font-bold text-lg flex items-center gap-3 transition-all
                    ${!preview || loading 
                      ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-none hover:-translate-y-0.5 active:translate-y-0'}
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Simplify Document
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-5xl mx-auto pb-20"
            >
              {/* Tab Navigation */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-12 p-2 bg-white dark:bg-stone-900 rounded-[2rem] border-2 border-stone-100 dark:border-stone-800 shadow-xl shadow-stone-900/5">
                <button 
                  onClick={() => setActiveTab('report')}
                  className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-display font-bold transition-all ${
                    activeTab === 'report' 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                      : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <FileText size={20} />
                  Simplified Report
                </button>
                <button 
                  onClick={() => setActiveTab('discussion')}
                  className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-display font-bold transition-all ${
                    activeTab === 'discussion' 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                      : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <BrainCircuit size={20} />
                  Discussion
                </button>
                <button 
                  onClick={() => setActiveTab('checklist')}
                  className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-display font-bold transition-all ${
                    activeTab === 'checklist' 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                      : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <CheckCircle2 size={20} />
                  Checklist & Management
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[600px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'report' && (
                  <motion.div
                    key="report-tab"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    <section className="bg-white dark:bg-stone-900 rounded-[2.5rem] overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/30 shadow-2xl shadow-emerald-500/5">
                      <div className="bg-emerald-50/50 dark:bg-emerald-900/10 px-10 py-6 border-b border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <FileText size={20} />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-stone-900 dark:text-white uppercase tracking-widest text-sm">Analysis</h3>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.2em]">Simplified Report</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-stone-800 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all shadow-sm"
                          >
                            <Download size={14} />
                            Download PDF
                          </button>
                          <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-[0.2em] rounded-full border border-emerald-200 dark:border-emerald-800/50">
                            {result.documentType}
                          </span>
                        </div>
                      </div>
                      <div className="p-10">
                        <div className="prose prose-stone dark:prose-invert max-w-none">
                          <h2 className="text-4xl font-display font-bold text-stone-900 dark:text-white mb-8 leading-tight flex items-center gap-4">
                            <Sparkles size={32} className="text-emerald-500" />
                            Quick Summary
                          </h2>
                          <div className="text-stone-700 dark:text-stone-300 text-xl leading-relaxed markdown-body">
                            <ReactMarkdown>{result.simplifiedText}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </section>
                  </motion.div>
                )}

                  {activeTab === 'discussion' && (
                    <motion.div
                      key="discussion"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="max-w-3xl mx-auto"
                    >
                    <section className="bg-white dark:bg-stone-900 rounded-[2.5rem] overflow-hidden border-2 border-stone-100 dark:border-stone-800 shadow-2xl shadow-stone-900/5">
                      <div className="bg-stone-50/50 dark:bg-stone-950/30 px-10 py-6 border-b border-stone-100 dark:border-stone-800 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-stone-900 dark:bg-stone-800 text-white flex items-center justify-center">
                          <BrainCircuit size={20} />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-stone-900 dark:text-white uppercase tracking-widest text-sm">AI Assistant</h3>
                          <p className="text-[10px] text-stone-500 dark:text-stone-500 font-black uppercase tracking-[0.2em]">Discussion & Questions</p>
                        </div>
                      </div>
                      <div className="p-10">
                        <div className="bg-stone-50 dark:bg-stone-950/50 rounded-3xl p-8 mb-8 h-[500px] overflow-y-auto custom-scrollbar flex flex-col gap-6 border border-stone-100 dark:border-stone-800">
                          {chatHistory.map((msg, idx) => (
                            <div 
                              key={idx} 
                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`
                                max-w-[80%] p-5 rounded-2xl text-base leading-relaxed shadow-sm
                                ${msg.role === 'user' 
                                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-100 dark:border-stone-700 rounded-tl-none'}
                              `}>
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                              </div>
                            </div>
                          ))}
                          {chatLoading && (
                            <div className="flex justify-start">
                              <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl rounded-tl-none border border-stone-100 dark:border-stone-700 shadow-sm">
                                <Loader2 className="animate-spin text-emerald-600" size={24} />
                              </div>
                            </div>
                          )}
                          <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="relative">
                          <input 
                            type="text" 
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            placeholder="Ask a follow-up question about your report..."
                            className="w-full bg-stone-50 dark:bg-stone-950 border-2 border-stone-100 dark:border-stone-800 rounded-[1.5rem] px-8 py-5 pr-20 text-lg focus:outline-none focus:border-emerald-500 transition-all dark:text-white shadow-inner"
                          />
                          <button 
                            type="submit"
                            disabled={!userMessage.trim() || chatLoading}
                            className="absolute right-3 top-3 bottom-3 px-6 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center"
                          >
                            <ArrowRight size={24} />
                          </button>
                        </form>
                      </div>
                    </section>
                  </motion.div>
                )}

                  {activeTab === 'checklist' && (
                    <motion.div
                      key="checklist"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                    <div className="space-y-12">
                    {/* Medical Insights First if available */}
                    {result.diseaseManagement && (
                      <section className="bg-white dark:bg-stone-900 rounded-[2.5rem] overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/30 shadow-2xl shadow-emerald-500/5">
                        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 px-10 py-6 border-b border-emerald-100 dark:border-emerald-900/30 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                            <HeartPulse size={20} />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-stone-900 dark:text-white uppercase tracking-widest text-sm">Medical Guidance</h3>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.2em]">Management & Lifestyle</p>
                          </div>
                        </div>
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-emerald-50/30 dark:bg-emerald-900/10 rounded-3xl p-8 border border-emerald-100 dark:border-emerald-900/20">
                            <h4 className="text-emerald-800 dark:text-emerald-300 font-display font-bold text-lg mb-4 flex items-center gap-2">
                              <HeartPulse size={20} />
                              What to do
                            </h4>
                            <div className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed markdown-body">
                              <ReactMarkdown>{result.diseaseManagement}</ReactMarkdown>
                            </div>
                          </div>
                          <div className="bg-stone-50/50 dark:bg-stone-800/20 rounded-3xl p-8 border border-stone-100 dark:border-stone-800">
                            <h4 className="text-stone-800 dark:text-stone-200 font-display font-bold text-lg mb-4 flex items-center gap-2">
                              <Activity size={20} />
                              Lifestyle & Maintenance
                            </h4>
                            <div className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed markdown-body">
                              <ReactMarkdown>{result.lifestyleMaintenance}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </section>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Checklist Window */}
                      <section className="bg-white dark:bg-stone-900 rounded-[2.5rem] overflow-hidden border-2 border-stone-100 dark:border-stone-800 shadow-xl shadow-stone-900/5">
                        <div className="bg-stone-50/50 dark:bg-stone-950/30 px-8 py-5 border-b border-stone-100 dark:border-stone-800 flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 size={16} />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-stone-900 dark:text-white uppercase tracking-widest text-xs">Next Steps</h3>
                            <p className="text-[9px] text-stone-500 dark:text-stone-500 font-black uppercase tracking-[0.2em]">Your Checklist</p>
                          </div>
                        </div>
                        <div className="p-8 space-y-6">
                          {result.checklist.map((item, idx) => (
                            <div key={idx} className="flex gap-5 group">
                              <div className="mt-1 w-8 h-8 rounded-xl border-2 border-stone-100 dark:border-stone-800 flex-shrink-0 group-hover:border-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-all flex items-center justify-center text-xs font-black text-stone-400 group-hover:text-emerald-600">
                                {idx + 1}
                              </div>
                              <p className="text-stone-700 dark:text-stone-300 font-medium leading-relaxed pt-1 text-lg">{item}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Original Document Window */}
                      <section className="bg-white dark:bg-stone-900 rounded-[2.5rem] overflow-hidden border-2 border-stone-100 dark:border-stone-800 shadow-xl shadow-stone-900/5">
                        <div className="bg-stone-50/50 dark:bg-stone-950/30 px-8 py-5 border-b border-stone-100 dark:border-stone-800 flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500 flex items-center justify-center">
                            <FileText size={16} />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-stone-900 dark:text-white uppercase tracking-widest text-xs">Reference</h3>
                            <p className="text-[9px] text-stone-500 dark:text-stone-500 font-black uppercase tracking-[0.2em]">Original Document</p>
                          </div>
                        </div>
                        <div className="p-8">
                          <div className="relative group rounded-3xl overflow-hidden border border-stone-100 dark:border-stone-800 shadow-inner">
                            <img 
                              src={preview || ''} 
                              alt="Original" 
                              className="w-full h-auto grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 cursor-zoom-in scale-105 group-hover:scale-100"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-emerald-600/0 group-hover:bg-emerald-600/5 transition-all pointer-events-none" />
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

              {result.draftReply && activeTab === 'report' && (
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 bg-stone-900 dark:bg-stone-950 rounded-[2.5rem] overflow-hidden border border-stone-800 shadow-2xl"
                >
                  <div className="bg-white/5 px-10 py-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-white uppercase tracking-widest text-sm">Response Draft</h3>
                        <p className="text-[10px] text-stone-500 font-black uppercase tracking-[0.2em]">Ready to send</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(result.draftReply || '');
                      }}
                      className="px-6 py-2 bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                    >
                      Copy Draft
                    </button>
                  </div>
                  <div className="p-10">
                    <div className="bg-white/5 rounded-3xl p-8 font-mono text-base text-stone-300 leading-relaxed whitespace-pre-wrap border border-white/10 shadow-inner">
                      {result.draftReply}
                    </div>
                  </div>
                </motion.section>
              )}
              
              <div className="flex justify-center pt-12">
                <button 
                  onClick={() => {
                    reset();
                    setActiveTab('report');
                  }}
                  className="px-10 py-4 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-2xl font-bold hover:bg-stone-200 dark:hover:bg-stone-700 transition-all flex items-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Analyze Another Document
                </button>
              </div>

              {/* Download Segment */}
              <div className="p-8 bg-stone-50 dark:bg-stone-900 rounded-[2rem] border border-stone-200 dark:border-stone-800 text-center mt-12">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText size={32} />
                </div>
                <h3 className="font-display font-bold text-2xl text-stone-900 dark:text-white mb-4">
                  Need a copy for your records?
                </h3>
                <p className="text-stone-600 dark:text-stone-400 mb-8 max-w-md mx-auto">
                  Download a clean, professional PDF report of this analysis to save, print, or share with others.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handlePreviewPDF}
                    disabled={pdfLoading}
                    className={`flex items-center gap-2 px-8 py-4 font-bold rounded-2xl transition-all shadow-lg ${
                      pdfLoading 
                        ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
                        : 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-stone-900/10 dark:shadow-white/5 hover:scale-105'
                    }`}
                  >
                    {pdfLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText size={20} />
                        View PDF Report
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => generateAndDownloadPDF(result, setError, setPdfLoading)}
                    disabled={pdfLoading}
                    className={`flex items-center gap-2 px-8 py-4 font-bold rounded-2xl transition-all border-2 ${
                      pdfLoading 
                        ? 'bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
                        : 'bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}
                  >
                    <Download size={20} />
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* PDF Downloading Overlay */}
      <AnimatePresence>
        {pdfLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white"
          >
            <div className="bg-stone-800 p-12 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col items-center gap-6 max-w-sm text-center">
              <div className="w-20 h-20 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Loader2 className="animate-spin" size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold mb-2">Generating PDF</h3>
                <p className="text-stone-400">Please wait while we prepare your professional report...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-12 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-stone-400">
            <Heart size={14} className="text-red-500" />
            <span className="text-xs font-bold uppercase tracking-widest">Built for the community</span>
          </div>
          <p className="text-stone-500 dark:text-stone-500 text-sm max-w-2xl mx-auto">
            Life Admin Assistant uses AI to help you understand documents. 
            Always verify important legal or medical information with a professional.
          </p>
        </div>
      </footer>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {pdfPreviewUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-stone-100 dark:bg-stone-900 w-full max-w-5xl h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-stone-200 dark:border-stone-800"
            >
              <div className="flex items-center justify-between p-4 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
                <h3 className="font-display font-bold text-lg text-stone-900 dark:text-white flex items-center gap-2">
                  <FileText className="text-emerald-600" size={20} />
                  PDF Preview
                </h3>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      if (!pdfPreviewUrl) return;
                      // Open PDF in new tab and trigger print
                      const printWindow = window.open(pdfPreviewUrl, '_blank');
                      if (printWindow) {
                        printWindow.onload = () => {
                          printWindow.print();
                        };
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold rounded-xl transition-all text-sm"
                  >
                    <Printer size={16} />
                    Print
                  </button>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = pdfPreviewUrl;
                      link.download = `LifeAdmin_Report_${new Date().getTime()}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all text-sm"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button onClick={closePdfPreview} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors text-stone-500">
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 w-full relative">
                <iframe 
                  src={`${pdfPreviewUrl}#toolbar=0`} 
                  className="absolute inset-0 w-full h-full bg-stone-100 dark:bg-stone-900"
                  title="PDF Preview"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
