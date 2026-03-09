import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';
import { 
  Frown, Annoyed, Meh, Smile, Laugh, Heart,
  HeartPulse, Wind, Brain, Activity, 
  ArrowRight, ArrowLeft, RefreshCw, CheckCircle2
} from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const moods = [
  { id: 'terrible', label: 'Terrible', icon: Frown, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  { id: 'bad', label: 'Bad', icon: Annoyed, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { id: 'okay', label: 'Okay', icon: Meh, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { id: 'good', label: 'Good', icon: Smile, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { id: 'great', label: 'Great', icon: Laugh, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
];

const symptomsList = [
  { id: 'racing_heart', label: 'Racing Heart', icon: HeartPulse },
  { id: 'shallow_breathing', label: 'Shallow Breathing', icon: Wind },
  { id: 'muscle_tension', label: 'Muscle Tension', icon: Activity },
  { id: 'brain_fog', label: 'Brain Fog', icon: Brain },
  { id: 'restlessness', label: 'Restlessness', icon: Activity },
  { id: 'nausea', label: 'Nausea', icon: Activity },
  { id: 'sweating', label: 'Sweating', icon: Activity },
  { id: 'chest_tightness', label: 'Chest Tightness', icon: Activity },
];

export default function App() {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(5);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [session, setSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep((s) => Math.min(s + 1, 5));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const toggleSymptom = (id: string) => {
    setSymptoms((prev) => 
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const generateSession = async () => {
    setLoading(true);
    setStep(4); // Loading step
    try {
      const prompt = `
        You are a compassionate, expert somatic therapist. 
        A user has come to you for a guided somatic session.
        Here is their current state:
        - Mood: ${mood}
        - Intensity of mood/anxiety (1-10): ${intensity}
        - Physical symptoms of anxiety: ${symptoms.length > 0 ? symptoms.join(', ') : 'None specified'}

        Please provide a gentle, comprehensive, step-by-step somatic experiencing session tailored to these specific symptoms and intensity.
        The tone should be warm, grounding, and safe.
        Use Markdown formatting. Include:
        1. A brief, validating opening.
        2. A grounding exercise (e.g., orienting to the room, feeling the ground).
        3. A specific somatic practice targeting their symptoms (e.g., if racing heart, maybe a specific breathing or containment hold; if tension, maybe pandiculation or slow release).
        4. A gentle closing.
        Keep it practical and easy to follow in the moment.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setSession(response.text || "I'm sorry, I couldn't generate a session right now. Please try again.");
      setStep(5); // Result step
    } catch (error) {
      console.error("Error generating session:", error);
      setSession("An error occurred while generating your session. Please try again.");
      setStep(5);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setMood(null);
    setIntensity(5);
    setSymptoms([]);
    setSession(null);
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card p-8 sm:p-12 text-center"
            >
              <h1 className="font-serif text-4xl sm:text-5xl mb-4 text-[#3a3a2a]">How are you feeling?</h1>
              <p className="text-[#5A5A40] mb-10 text-lg">Select the face that best matches your current mood.</p>
              
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12">
                {moods.map((m) => {
                  const Icon = m.icon;
                  const isSelected = mood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMood(m.id)}
                      className={`flex flex-col items-center p-4 rounded-2xl transition-all duration-300 border-2 ${
                        isSelected 
                          ? `${m.bg} ${m.border} scale-110 shadow-md` 
                          : 'border-transparent hover:bg-black/5'
                      }`}
                    >
                      <Icon className={`w-12 h-12 sm:w-16 sm:h-16 mb-3 ${isSelected ? m.color : 'text-gray-400'}`} strokeWidth={1.5} />
                      <span className={`text-sm font-medium ${isSelected ? m.color : 'text-gray-500'}`}>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handleNext} 
                  disabled={!mood}
                  className="olive-button flex items-center gap-2"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card p-8 sm:p-12 text-center"
            >
              <h1 className="font-serif text-4xl sm:text-5xl mb-4 text-[#3a3a2a]">How intense is it?</h1>
              <p className="text-[#5A5A40] mb-12 text-lg">On a scale from 1 to 10, how strong is this feeling right now?</p>
              
              <div className="mb-16 px-4">
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-4 px-1 font-medium">
                    <span>1 (Mild)</span>
                    <span className="text-xl font-serif text-[#3a3a2a] -mt-2">{intensity}</span>
                    <span>10 (Overwhelming)</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={handlePrev} className="text-[#5A5A40] hover:text-black font-medium flex items-center gap-2 px-4 py-2">
                  <ArrowLeft size={18} /> Back
                </button>
                <button onClick={handleNext} className="olive-button flex items-center gap-2">
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card p-8 sm:p-12 text-center"
            >
              <h1 className="font-serif text-4xl sm:text-5xl mb-4 text-[#3a3a2a]">What are you noticing?</h1>
              <p className="text-[#5A5A40] mb-10 text-lg">Select any physical sensations you are experiencing right now.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
                {symptomsList.map((s) => {
                  const Icon = s.icon;
                  const isSelected = symptoms.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSymptom(s.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                        isSelected 
                          ? 'border-[#5A5A40] bg-[#5A5A40]/5 text-[#5A5A40]' 
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2" strokeWidth={1.5} />
                      <span className="text-sm font-medium">{s.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 absolute top-2 right-2 text-[#5A5A40]" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button onClick={handlePrev} className="text-[#5A5A40] hover:text-black font-medium flex items-center gap-2 px-4 py-2">
                  <ArrowLeft size={18} /> Back
                </button>
                <button onClick={generateSession} className="olive-button flex items-center gap-2">
                  Create Session <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="card p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="w-32 h-32 rounded-full bg-[#5A5A40]/10 flex items-center justify-center mb-8"
              >
                <div className="w-16 h-16 rounded-full bg-[#5A5A40]/20" />
              </motion.div>
              <h2 className="font-serif text-3xl text-[#3a3a2a] mb-2">Creating your safe space...</h2>
              <p className="text-[#5A5A40]">Take a slow, deep breath while we prepare your session.</p>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-8 sm:p-12"
            >
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                <h1 className="font-serif text-3xl text-[#3a3a2a]">Your Somatic Session</h1>
                <button onClick={reset} className="text-[#5A5A40] hover:text-black flex items-center gap-2 text-sm font-medium bg-gray-50 px-4 py-2 rounded-full">
                  <RefreshCw size={16} /> Start Over
                </button>
              </div>
              
              <div className="markdown-body text-[#2c2c24]">
                <Markdown>{session}</Markdown>
              </div>
              
              <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                <p className="text-[#5A5A40] italic font-serif text-lg">"You are safe in this moment."</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <footer className="mt-12 text-center pb-8">
          <div className="flex items-center justify-center gap-2 text-[#5A5A40]/40">
            <div className="h-[1px] w-8 bg-[#5A5A40]/10"></div>
            <p className="font-serif italic text-sm tracking-widest uppercase flex items-center gap-1.5">
              Created with <Heart size={12} className="fill-[#5A5A40]/20 stroke-[#5A5A40]/40" /> by Afnan
            </p>
            <div className="h-[1px] w-8 bg-[#5A5A40]/10"></div>
          </div>
        </footer>
      </div>
    </div>
  );
}
