import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import { ExperimentMetadata } from '../../types';

interface GenericExperimentProps {
  metadata: ExperimentMetadata;
}

export const GenericExperiment: React.FC<GenericExperimentProps> = ({ metadata }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple particle simulation for the "Game" view
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId: number;
    let particles: {x: number, y: number, vx: number, vy: number, color: string, radius: number}[] = [];
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
        if (canvas.parentElement) {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }
    };
    
    window.addEventListener('resize', resize);
    resize();

    const colors = ['#ef4444', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

    const createParticles = () => {
        particles = [];
        for(let i=0; i<60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                radius: Math.random() * 5 + 2
            });
        }
    };
    createParticles();

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
        if (!ctx) return;
        
        // Trail effect
        ctx.fillStyle = 'rgba(15, 23, 42, 0.2)'; // Slate-900 with opacity
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            // Physics
            p.x += p.vx;
            p.y += p.vy;

            // Wall collision
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            // Mouse interaction
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < 100) {
                p.vx -= dx * 0.005;
                p.vy -= dy * 0.005;
            }

            // Draw
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });

        // Overlay Text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.font = 'bold 8vw Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(metadata.title.toUpperCase(), canvas.width/2, canvas.height/2);

        ctx.fillStyle = 'white';
        ctx.font = '16px monospace';
        ctx.fillText(`SIMULATION RUNNING | ENTITIES: ${particles.length}`, canvas.width/2, canvas.height - 40);

        animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, metadata.title]);

  if (isPlaying) {
    return (
        <div className={`w-full h-full bg-slate-950 relative flex flex-col animate-in fade-in duration-500 ${isFullscreen ? 'fixed inset-0 z-[100]' : ''}`}>
            {/* Game Toolbar */}
            <div className="bg-slate-900 text-white p-3 flex justify-between items-center px-6 border-b border-slate-800 shadow-md z-10">
                <div className="font-bold flex items-center gap-3 text-lg">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${metadata.color.includes('bg-') ? metadata.color : 'bg-purple-600 text-white'}`}>
                        {metadata.icon ? <metadata.icon size={18} /> : <Gamepad2 size={18} />}
                    </div>
                    {metadata.title}
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsFullscreen(!isFullscreen)} 
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <Minimize2 size={20}/> : <Maximize2 size={20}/>}
                    </button>
                    <button 
                        onClick={() => setIsPlaying(false)} 
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-red-900/20"
                    >
                        Exit Game
                    </button>
                </div>
            </div>
            
            {/* Game Canvas Container */}
            <div className="flex-1 relative overflow-hidden bg-slate-950">
                <canvas ref={canvasRef} className="block w-full h-full" />
                
                {/* Simulated Loading Overlay (Fades out) */}
                <div className="absolute inset-0 bg-black flex items-center justify-center animate-out fade-out duration-1000 fill-mode-forwards pointer-events-none z-20">
                    <div className="text-purple-500 font-mono animate-pulse">Initializing Game Engine...</div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-900 text-white p-8 animate-fade-in overflow-y-auto">
      <div className="bg-slate-800 p-8 md:p-12 rounded-3xl flex flex-col items-center text-center max-w-2xl shadow-2xl border border-slate-700 relative overflow-hidden mt-10 mb-10">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500" />
        
        <div className={`w-28 h-28 rounded-3xl mb-8 shadow-2xl ${metadata.color.replace('text-', 'bg-').replace('bg-', 'text-white ')} flex items-center justify-center overflow-hidden relative group ring-4 ring-slate-700/50`}>
             {metadata.coverImage ? (
                 <img src={metadata.coverImage} alt={metadata.title} className="w-full h-full object-cover" />
            ) : metadata.icon ? (
                 <metadata.icon size={56} />
            ) : (
                 <Gamepad2 size={56} />
            )}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">{metadata.title}</h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-lg">{metadata.description}</p>
        
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 w-full text-left max-w-md shadow-inner">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"/>
                <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                <div className="w-3 h-3 rounded-full bg-green-500"/>
                <span className="ml-auto text-xs font-mono text-slate-500 opacity-60">console output</span>
            </div>
            <div className="space-y-3 font-mono text-sm">
                <div className="text-slate-500 flex justify-between"><span>// System check</span> <span>OK</span></div>
                <div className="text-blue-400">Loading assets... <span className="text-green-400 float-right">Done</span></div>
                <div className="text-purple-400">Initializing physics... <span className="text-green-400 float-right">Done</span></div>
                <div className="text-slate-300 mt-2 border-t border-slate-700/50 pt-2">Game Ready. Waiting for user input.</div>
            </div>
        </div>

        <button 
            onClick={() => setIsPlaying(true)}
            className="mt-10 bg-white text-slate-900 px-12 py-4 rounded-full font-black text-lg hover:scale-105 hover:bg-purple-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center gap-3 group active:scale-95"
        >
            <Gamepad2 size={24} className="group-hover:rotate-12 transition-transform" /> 
            Start Game
        </button>
      </div>
    </div>
  );
};
