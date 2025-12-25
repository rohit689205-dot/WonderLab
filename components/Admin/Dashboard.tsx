import React, { useState, useRef } from 'react';
import { Users, Clock, Activity, Settings, BarChart3, Gamepad2, Upload, Edit, Trash2, Plus, X, Save, CheckCircle, Image as ImageIcon, FileArchive } from 'lucide-react';
import { ExperimentMetadata, ViewState } from '../../types';

interface AdminDashboardProps {
  secondsWasted: number;
  onLogout: () => void;
  experiments: ExperimentMetadata[];
  setExperiments: (experiments: ExperimentMetadata[]) => void;
}

type Tab = 'dashboard' | 'games';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ secondsWasted, onLogout, experiments, setExperiments }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gameBundleInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: 'Game' as 'AI' | 'Interactive' | 'Game',
    coverImage: '' as string
  });
  const [gameFileName, setGameFileName] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleEdit = (exp: ExperimentMetadata) => {
    setEditingId(exp.id);
    setFormData({
      title: exp.title,
      description: exp.description,
      tag: exp.tag,
      coverImage: exp.coverImage || ''
    });
    setGameFileName(''); // No bundle upload needed for metadata edit usually
    setUploadProgress(100); 
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      tag: 'Game',
      coverImage: ''
    });
    setGameFileName('');
    setUploadProgress(0);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      setExperiments(experiments.filter(e => e.id !== id));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGameBundleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGameFileName(file.name);
    }
  };

  const simulateUpload = () => {
    if (editingId) {
      saveGame();
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          saveGame();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const saveGame = () => {
    if (editingId) {
      setExperiments(experiments.map(e => 
        e.id === editingId 
        ? { ...e, title: formData.title, description: formData.description, tag: formData.tag, coverImage: formData.coverImage }
        : e
      ));
    } else {
      const newGame: ExperimentMetadata = {
        id: `custom-game-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        tag: formData.tag,
        icon: undefined, // No default icon if using image, will fallback in UI
        coverImage: formData.coverImage,
        color: 'bg-indigo-100 text-indigo-600'
      };
      setExperiments([...experiments, newGame]);
    }
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 animate-fade-in overflow-y-auto">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl">
             <div className="bg-purple-500 w-8 h-8 rounded-lg flex items-center justify-center">W</div>
             WonderLab Admin
          </div>
          <button 
            onClick={onLogout} 
            className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 md:p-8">
        
        {/* Tab Switcher */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'dashboard' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('games')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'games' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            Game Library
          </button>
        </div>

        {activeTab === 'dashboard' ? (
          /* DASHBOARD VIEW */
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-black text-slate-900 mb-2">Dashboard</h1>
              <p className="text-slate-500">Overview of application metrics and controls.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Clock size={24} /></div>
                  <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">+12%</span>
                </div>
                <div className="text-3xl font-black text-slate-800 mb-1">{secondsWasted}s</div>
                <div className="text-sm text-slate-500 font-medium">Total Session Duration</div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Users size={24} /></div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Live</span>
                </div>
                <div className="text-3xl font-black text-slate-800 mb-1">1</div>
                <div className="text-sm text-slate-500 font-medium">Active Users (You)</div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Activity size={24} /></div>
                  <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded">Ok</span>
                </div>
                <div className="text-3xl font-black text-slate-800 mb-1">99.9%</div>
                <div className="text-sm text-slate-500 font-medium">Uptime Reliability</div>
              </div>
            </div>
          </>
        ) : (
          /* GAMES MANAGEMENT VIEW */
          <>
             <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Game Library</h1>
                <p className="text-slate-500">Manage, update, and upload new experiments.</p>
              </div>
              <button 
                onClick={handleCreate}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Upload size={18} /> Upload Game
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Game</th>
                    <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Tag</th>
                    <th className="p-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {experiments.map(exp => (
                    <tr key={exp.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl ${exp.color} flex items-center justify-center overflow-hidden bg-slate-100`}>
                            {exp.coverImage ? (
                                <img src={exp.coverImage} alt={exp.title} className="w-full h-full object-cover" />
                            ) : exp.icon ? (
                                <exp.icon size={24} />
                            ) : (
                                <Gamepad2 size={24} />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{exp.title}</div>
                            <div className="text-sm text-slate-500 truncate max-w-xs">{exp.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 uppercase">
                          {exp.tag}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(exp)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(exp.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
              {editingId ? <Edit size={24} className="text-blue-500"/> : <Upload size={24} className="text-purple-500"/>}
              {editingId ? 'Edit Game Details' : 'Upload New Game'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Game Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  placeholder="e.g., Flappy Bird 2"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none transition-all"
                  placeholder="Short description of the game..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tag</label>
                <select 
                  value={formData.tag}
                  onChange={e => setFormData({...formData, tag: e.target.value as any})}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white transition-all"
                >
                  <option value="Game">Game</option>
                  <option value="Interactive">Interactive</option>
                  <option value="AI">AI</option>
                </select>
              </div>

              {/* Logo Section */}
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Game Logo</label>
                 <div className="flex gap-4 items-center">
                    <div 
                        className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden cursor-pointer hover:border-purple-400 transition-colors relative"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {formData.coverImage ? (
                            <img src={formData.coverImage} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                            <ImageIcon className="text-slate-400" />
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-slate-500 mb-2">Click the box to upload a logo or cover image for your game card.</p>
                        {formData.coverImage && (
                            <button 
                                onClick={() => setFormData({...formData, coverImage: ''})}
                                className="text-xs text-red-500 font-bold hover:underline"
                            >
                                Remove Image
                            </button>
                        )}
                    </div>
                 </div>
              </div>

              {!editingId && (
                <div 
                    onClick={() => gameBundleInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-purple-400 transition-colors cursor-pointer bg-slate-50 mt-4 relative group"
                >
                   <input 
                        type="file" 
                        ref={gameBundleInputRef} 
                        className="hidden" 
                        accept=".zip,.rar"
                        onChange={handleGameBundleUpload}
                   />
                   <div className={`transition-colors duration-300 ${gameFileName ? 'text-green-500' : 'text-slate-400'}`}>
                      {gameFileName ? <FileArchive size={32} className="mx-auto mb-2" /> : <Gamepad2 size={32} className="mx-auto mb-2" />}
                   </div>
                   
                   {gameFileName ? (
                       <div className="animate-fade-in">
                           <p className="text-sm font-bold text-slate-800 break-all">{gameFileName}</p>
                           <p className="text-xs text-green-600 font-bold mt-1">Ready to upload</p>
                           <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setGameFileName('');
                                if(gameBundleInputRef.current) gameBundleInputRef.current.value = '';
                            }}
                            className="text-xs text-red-400 hover:text-red-600 mt-2 hover:underline z-10 relative"
                           >
                            Remove
                           </button>
                       </div>
                   ) : (
                       <>
                           <p className="text-sm font-bold text-slate-600">Drag & drop game bundle (.zip)</p>
                           <p className="text-xs text-slate-400">or click to browse</p>
                       </>
                   )}
                </div>
              )}

              {/* Progress Bar for Upload */}
              {!editingId && (isUploading || uploadProgress > 0) && (
                <div className="bg-slate-100 rounded-full h-2 overflow-hidden mt-4">
                  <div 
                    className="bg-green-500 h-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={simulateUpload}
                  disabled={!formData.title || !formData.description || isUploading}
                  className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? <Activity className="animate-spin" /> : editingId ? <Save size={18} /> : <Upload size={18} />}
                  {isUploading ? 'Uploading...' : editingId ? 'Save Changes' : 'Upload Game'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
