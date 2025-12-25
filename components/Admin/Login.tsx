import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Hardcoded credentials for demo purposes
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Invalid credentials (Try: admin / admin)');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-100 animate-fade-in p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 transition-all duration-500 hover:shadow-2xl">
        <div className="flex items-center gap-3 mb-6 text-slate-800 border-b border-slate-100 pb-4">
           <div className="bg-slate-100 p-2 rounded-lg">
             <Lock className="w-6 h-6 text-purple-600" />
           </div>
           <h2 className="text-2xl font-bold tracking-tight">Admin Portal</h2>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="group">
            <label className="block text-sm font-bold text-slate-700 mb-1 group-focus-within:text-purple-600 transition-colors">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-300 focus:-translate-y-1 bg-slate-50 focus:bg-white"
              placeholder="admin"
              autoFocus
            />
          </div>
          <div className="group">
            <label className="block text-sm font-bold text-slate-700 mb-1 group-focus-within:text-purple-600 transition-colors">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-300 focus:-translate-y-1 bg-slate-50 focus:bg-white"
              placeholder="•••••"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm font-medium animate-pulse bg-red-50 p-2 rounded-lg border border-red-100">{error}</p>}

          <div className="flex gap-3 mt-4">
            <button 
              type="button" 
              onClick={onBack}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 px-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all duration-300 flex justify-center items-center gap-2 hover:shadow-lg hover:-translate-y-1 active:scale-95 active:translate-y-0"
            >
              Login <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
