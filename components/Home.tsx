import React from 'react';
import { ExperimentMetadata, ViewState } from '../types';
import { ArrowRight, Lock, Gamepad2 } from 'lucide-react';

interface HomeProps {
  experiments: ExperimentMetadata[];
  onSelect: (view: ViewState | string) => void;
}

export const Home: React.FC<HomeProps> = ({ experiments, onSelect }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col animate-fade-in">
      {/* Hero */}
      <header className="pt-20 pb-12 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6">
          Wonder<span className="text-purple-600">Lab</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          A collection of digital toys, interactive curiosities, and AI experiments designed to waste your time efficiently.
        </p>
      </header>

      {/* Grid */}
      <main className="flex-1 px-4 md:px-8 pb-20 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((exp) => (
            <div 
              key={exp.id}
              onClick={() => onSelect(exp.id)}
              className="group bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 p-3 rounded-bl-2xl text-xs font-bold uppercase tracking-wider z-10 ${exp.color.includes('purple') ? 'bg-purple-50 text-purple-600' : exp.color.includes('blue') ? 'bg-blue-50 text-blue-600' : exp.color.includes('red') ? 'bg-red-50 text-red-600' : exp.color.includes('green') ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                {exp.tag}
              </div>

              <div className={`w-16 h-16 rounded-2xl ${exp.color} flex items-center justify-center mb-6 overflow-hidden relative`}>
                {exp.coverImage ? (
                    <img src={exp.coverImage} alt={exp.title} className="w-full h-full object-cover" />
                ) : exp.icon ? (
                    <exp.icon size={32} />
                ) : (
                    <Gamepad2 size={32} />
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                {exp.title}
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                {exp.description}
              </p>

              <div className="flex items-center text-slate-900 font-bold text-sm">
                Play Now <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-8 text-slate-400 text-sm flex flex-col items-center gap-2">
        <p>Inspired by neal.fun • Built with Gemini AI</p>
        <button 
          onClick={() => onSelect(ViewState.ADMIN_LOGIN)}
          className="flex items-center gap-1 opacity-50 hover:opacity-100 hover:text-purple-600 transition-all text-xs"
        >
          <Lock size={10} /> Admin Access
        </button>
      </footer>
    </div>
  );
};
