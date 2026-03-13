import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Moon, Sun, Zap, ArrowRight, ShieldCheck, BrainCircuit, X, MapPin, GraduationCap, Linkedin, Github, Facebook, ArrowLeft } from 'lucide-react';

interface LandingPageProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setShowApp: (show: boolean) => void;
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
}

export function LandingPage({ darkMode, toggleDarkMode, setShowApp, showInfo, setShowInfo }: LandingPageProps) {
  return (
    <div className="min-h-screen font-sans selection:bg-emerald-100 bg-stone-50 dark:bg-stone-950 transition-colors duration-500 overflow-hidden relative bg-fixed">
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Sparkles size={20} />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-stone-900 dark:text-white">Life Admin</span>
        </div>
        <button 
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:scale-110 transition-all"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold mb-8">
            <Zap size={14} />
            <span>AI-Powered Document Simplifier</span>
          </div>
          <h1 className="text-6xl lg:text-7xl font-display font-bold text-stone-900 dark:text-white leading-[1.1] mb-8">
            Stop stressing over <span className="text-emerald-600">paperwork.</span>
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 leading-relaxed mb-12 max-w-xl">
            Life Admin turns complex legal letters, medical results, and insurance forms into clear, 5th-grade level English. Know your deadlines and next steps instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setShowApp(true)}
              className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all hover:-translate-y-1"
            >
              Get Started Now
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => setShowInfo(true)}
              className="px-10 py-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              How it works
            </button>
          </div>

          <div className="mt-16 flex items-center gap-8">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-stone-950 bg-stone-200 dark:bg-stone-800 overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
            <p className="text-stone-500 dark:text-stone-500 text-sm font-medium">
              Trusted by <span className="text-stone-900 dark:text-stone-200 font-bold">2,000+</span> people managing life admin.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 bg-white dark:bg-stone-900 rounded-[40px] p-8 shadow-2xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 dark:text-white">Secure Analysis</h3>
                <p className="text-sm text-stone-500">Privacy-focused document processing</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded-full w-full" />
              <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded-full w-[90%]" />
              <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded-full w-[95%]" />
            </div>

            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800/50">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold mb-3">
                <BrainCircuit size={18} />
                <span>Smart Simplification</span>
              </div>
              <p className="text-emerald-900 dark:text-emerald-100 text-sm leading-relaxed">
                "We turn complex jargon into clear, actionable steps so you can manage your life admin with zero stress."
              </p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-orange-400/20 rounded-full blur-2xl" />
          <div className="absolute bottom-[-40px] left-[20%] w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl" />
        </motion.div>
      </main>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-950/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-[32px] overflow-y-auto max-h-[85vh] shadow-2xl custom-scrollbar"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8">
                  <h2 className="text-3xl font-display font-bold text-stone-900 dark:text-white">About the Project</h2>
                  <button onClick={() => setShowInfo(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-4">The Mission</h3>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      We built Life Admin to reduce the anxiety caused by complex paperwork. Many people ignore important documents because they are hard to read, leading to missed deadlines and financial penalties. Our AI simplifies the language so everyone can take action with confidence.
                    </p>
                  </section>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                      <ShieldCheck className="text-emerald-600 mb-4" size={28} />
                      <h4 className="font-bold mb-2 dark:text-white">Privacy First</h4>
                      <p className="text-sm text-stone-500">Your documents are processed securely and never stored permanently.</p>
                    </div>
                    <div className="p-6 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-100 dark:border-stone-800">
                      <Zap className="text-blue-600 mb-4" size={28} />
                      <h4 className="font-bold mb-2 dark:text-white">Instant Results</h4>
                      <p className="text-sm text-stone-500">Get a summary, checklist, and draft reply in under 10 seconds.</p>
                    </div>
                  </div>

                  <section className="pt-8 border-t border-stone-100 dark:border-stone-800">
                    <h3 className="text-stone-400 font-bold uppercase tracking-widest text-xs mb-6">Created By</h3>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-600 overflow-hidden shadow-lg border-2 border-emerald-500/20">
                          <img 
                            src="https://github.com/nazmulhossain250.png" 
                            alt="Nazmul Hossain" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-lg dark:text-white">Nazmul Hossain</p>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Developer • CS Major</p>
                          <div className="flex items-center gap-3 mt-1 text-stone-500 text-xs">
                            <span className="flex items-center gap-1"><MapPin size={12} /> Dhaka, Bangladesh</span>
                            <span className="flex items-center gap-1"><GraduationCap size={12} /> CS Major</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a 
                          href="https://www.linkedin.com/in/nazmul-hossain-344514361" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all rounded-xl"
                          title="LinkedIn"
                        >
                          <Linkedin size={20} />
                        </a>
                        <a 
                          href="https://github.com/nazmulhossain250" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-900 hover:text-white dark:hover:bg-stone-700 transition-all rounded-xl"
                          title="GitHub"
                        >
                          <Github size={20} />
                        </a>
                        <a 
                          href="https://www.facebook.com/share/18CSHhQ49P/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-blue-700 hover:text-white dark:hover:bg-blue-700 transition-all rounded-xl"
                          title="Facebook"
                        >
                          <Facebook size={20} />
                        </a>
                      </div>
                    </div>
                  </section>

                  <div className="pt-8 flex justify-center">
                    <button 
                      onClick={() => setShowInfo(false)}
                      className="flex items-center gap-2 px-8 py-4 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-stone-900/10 dark:shadow-white/5"
                    >
                      <ArrowLeft size={20} />
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
