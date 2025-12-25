import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, StopCircle } from 'lucide-react';
import { streamExplanation } from '../../services/geminiService';

export const ExplainSimple: React.FC = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnswer('');

    try {
      const stream = await streamExplanation(query);
      
      for await (const chunk of stream) {
        setAnswer(prev => prev + chunk);
      }
    } catch (err) {
      console.error(err);
      setError("The AI brain is having a nap. Try again later!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [answer]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-blue-50 px-4">
      <div className="max-w-xl w-full flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Explain Like I'm 5</h1>
          <p className="text-slate-600 text-lg">Enter a complex topic, get a simple answer.</p>
        </div>

        {/* Output Area */}
        <div className="flex-1 bg-white rounded-t-3xl shadow-lg border-x border-t border-slate-100 p-8 overflow-y-auto relative no-scrollbar" ref={scrollRef}>
          {answer ? (
             <div className="prose prose-lg prose-blue max-w-none">
              <p className="text-2xl leading-relaxed text-slate-800 font-medium font-serif">
                {answer}
                {isLoading && <span className="inline-block w-2 h-6 bg-blue-500 ml-1 animate-pulse"/>}
              </p>
             </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-300 flex-col gap-4">
               <div className="text-6xl opacity-20">🤔</div>
               <p>Examples: "Quantum Physics", "Inflation", "Why is the sky blue?"</p>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
              {error}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 rounded-b-3xl shadow-lg border-x border-b border-slate-100">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to understand?"
              className="w-full bg-slate-100 text-slate-900 px-6 py-4 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-14 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
            >
              {isLoading ? <StopCircle className="animate-pulse" /> : <Send size={20} />}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
