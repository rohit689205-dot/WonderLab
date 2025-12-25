import React, { useState, useEffect } from 'react';
import { Scale, ArrowRight, Shuffle } from 'lucide-react';
import { generateDilemma } from '../../services/geminiService';
import { Dilemma } from '../../types';

export const AbsurdDilemmas: React.FC = () => {
  const [dilemma, setDilemma] = useState<Dilemma | null>(null);
  const [loading, setLoading] = useState(true);
  const [choice, setChoice] = useState<'A' | 'B' | null>(null);

  const fetchDilemma = async () => {
    setLoading(true);
    setChoice(null);
    try {
      const data = await generateDilemma();
      setDilemma(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDilemma();
  }, []);

  const handleChoose = (c: 'A' | 'B') => {
    setChoice(c);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-orange-50 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full z-10 flex flex-col items-center">
        <div className="mb-8 text-center">
          <div className="inline-block p-4 bg-orange-100 rounded-full mb-4 shadow-sm">
             <Scale className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Absurd Dilemmas</h1>
          <p className="text-slate-600">The hardest choices require the weirdest wills.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8 w-full min-h-[400px] flex flex-col relative transition-all duration-500">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-orange-400 animate-pulse">
               <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                 <Shuffle className="animate-spin" />
               </div>
               <p className="font-medium">Concocting a terrible scenario...</p>
            </div>
          ) : dilemma ? (
            <>
              <div className="flex-1 flex flex-col items-center justify-center text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug">
                  {dilemma.scenario}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => handleChoose('A')}
                  disabled={!!choice}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden group
                    ${choice === 'A' 
                      ? 'bg-orange-600 border-orange-600 text-white shadow-lg scale-105' 
                      : choice === 'B' 
                        ? 'bg-slate-50 border-slate-200 text-slate-400 grayscale opacity-50' 
                        : 'bg-white border-slate-200 hover:border-orange-400 hover:shadow-md text-slate-800'
                    }`}
                >
                  <div className="text-sm font-bold opacity-50 mb-1 uppercase tracking-wider">Option A</div>
                  <div className="text-lg font-bold">{dilemma.optionA}</div>
                  {choice === 'A' && <div className="absolute top-2 right-2"><ArrowRight /></div>}
                </button>

                <button
                  onClick={() => handleChoose('B')}
                  disabled={!!choice}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 relative overflow-hidden group
                    ${choice === 'B' 
                      ? 'bg-orange-600 border-orange-600 text-white shadow-lg scale-105' 
                      : choice === 'A' 
                        ? 'bg-slate-50 border-slate-200 text-slate-400 grayscale opacity-50' 
                        : 'bg-white border-slate-200 hover:border-orange-400 hover:shadow-md text-slate-800'
                    }`}
                >
                  <div className="text-sm font-bold opacity-50 mb-1 uppercase tracking-wider">Option B</div>
                  <div className="text-lg font-bold">{dilemma.optionB}</div>
                  {choice === 'B' && <div className="absolute top-2 right-2"><ArrowRight /></div>}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-red-500">Failed to load dilemma.</div>
          )}

          {choice && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center animate-in fade-in slide-in-from-bottom-4">
              <button 
                onClick={fetchDilemma}
                className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
              >
                <Shuffle size={18} /> Next Dilemma
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
