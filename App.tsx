import React, { useState, useEffect } from 'react';
import { ViewState, ExperimentMetadata } from './types';
import { EXPERIMENTS } from './constants';
import { Home } from './components/Home';
import { PerfectCircle } from './components/experiments/PerfectCircle';
import { ExplainSimple } from './components/experiments/ExplainSimple';
import { SpendBudget } from './components/experiments/SpendBudget';
import { AbsurdDilemmas } from './components/experiments/AbsurdDilemmas';
import { InfiniteCraft } from './components/experiments/InfiniteCraft';
import { EmojiQuest } from './components/experiments/EmojiQuest';
import { AdminLogin } from './components/Admin/Login';
import { AdminDashboard } from './components/Admin/Dashboard';
import { GenericExperiment } from './components/experiments/GenericExperiment';
import { X, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState | string>(ViewState.HOME);
  const [secondsWasted, setSecondsWasted] = useState(0);
  const [experiments, setExperiments] = useState<ExperimentMetadata[]>(EXPERIMENTS);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (view !== ViewState.HOME && view !== ViewState.ADMIN_LOGIN) {
      interval = setInterval(() => {
        setSecondsWasted(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.HOME:
        return <Home experiments={experiments} onSelect={setView} />;
      case ViewState.EXPERIMENT_CIRCLE:
        return <PerfectCircle />;
      case ViewState.EXPERIMENT_EXPLAIN:
        return <ExplainSimple />;
      case ViewState.EXPERIMENT_SPEND:
        return <SpendBudget />;
      case ViewState.EXPERIMENT_DILEMMA:
        return <AbsurdDilemmas />;
      case ViewState.EXPERIMENT_CRAFT:
        return <InfiniteCraft />;
      case ViewState.EXPERIMENT_QUEST:
        return <EmojiQuest />;
      case ViewState.ADMIN_LOGIN:
        return <AdminLogin onLogin={() => setView(ViewState.ADMIN_DASHBOARD)} onBack={() => setView(ViewState.HOME)} />;
      case ViewState.ADMIN_DASHBOARD:
        return (
          <AdminDashboard 
            secondsWasted={secondsWasted} 
            onLogout={() => setView(ViewState.HOME)} 
            experiments={experiments}
            setExperiments={setExperiments}
          />
        );
      default:
        // Check if it's a dynamic experiment ID
        const activeExp = experiments.find(e => e.id === view);
        if (activeExp) {
          return <GenericExperiment metadata={activeExp} />;
        }
        // Fallback to home
        return <Home experiments={experiments} onSelect={setView} />;
    }
  };

  const isExperiment = view !== ViewState.HOME && view !== ViewState.ADMIN_LOGIN && view !== ViewState.ADMIN_DASHBOARD;

  return (
    <div className="w-full h-screen overflow-hidden bg-slate-50 relative font-sans">
      {isExperiment && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 animate-fade-in">
           <div className="bg-slate-900/90 text-white font-mono px-4 py-2 rounded-full shadow-lg border border-slate-700 flex items-center gap-2 backdrop-blur-sm">
             <Clock size={14} className="text-slate-400" />
             <span className="font-bold tracking-widest">{formatTime(secondsWasted)}</span>
           </div>

          <button
            onClick={() => setView(ViewState.HOME)}
            className="p-2 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-800 rounded-full shadow-lg border border-slate-200 transition-all hover:rotate-90"
            aria-label="Close experiment"
          >
            <X size={24} />
          </button>
        </div>
      )}
      
      <div 
        key={String(view)} 
        className={`w-full h-full ${view === ViewState.HOME || view === ViewState.ADMIN_DASHBOARD ? 'overflow-y-auto' : 'overflow-hidden'} animate-fade-in`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
