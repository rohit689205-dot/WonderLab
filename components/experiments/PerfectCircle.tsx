import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RefreshCcw, Trophy } from 'lucide-react';
import { Point } from '../../types';

export const PerfectCircle: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [center, setCenter] = useState<Point | null>(null);
  const [radius, setRadius] = useState<number | null>(null);
  const [message, setMessage] = useState("Draw a circle.");

  const reset = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw center point guide
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#e5e7eb';
    ctx.fill();

    setPoints([]);
    setScore(null);
    setCenter(null);
    setRadius(null);
    setMessage("Draw a circle around the dot.");
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.offsetWidth;
        canvasRef.current.height = containerRef.current.offsetHeight;
        reset();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [reset]);

  const calculateScore = (pts: Point[]) => {
    if (pts.length < 20) return null;

    // 1. Calculate centroid (center of the drawn shape)
    let sumX = 0, sumY = 0;
    pts.forEach(p => { sumX += p.x; sumY += p.y; });
    const centerX = sumX / pts.length;
    const centerY = sumY / pts.length;

    // 2. Calculate average radius from that centroid
    let totalDist = 0;
    const dists = pts.map(p => {
      const d = Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2));
      totalDist += d;
      return d;
    });
    const avgRadius = totalDist / pts.length;

    // 3. Calculate variance/deviation
    let deviationSum = 0;
    dists.forEach(d => {
      deviationSum += Math.pow(d - avgRadius, 2);
    });
    const variance = Math.sqrt(deviationSum / pts.length);

    // 4. Calculate closure error (distance between start and end)
    const start = pts[0];
    const end = pts[pts.length - 1];
    const closureDist = Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
    
    // Penalize if the circle isn't closed (relative to radius)
    const closurePenalty = Math.min((closureDist / avgRadius) * 50, 50);

    // Score formula
    // Perfect circle has 0 variance. 
    // We normalize variance relative to radius size to be fair to small/big circles.
    const normalizedVariance = (variance / avgRadius) * 100;
    
    let rawScore = 100 - (normalizedVariance * 2) - closurePenalty;
    if (rawScore < 0) rawScore = 0;
    
    setCenter({ x: centerX, y: centerY });
    setRadius(avgRadius);
    
    return Math.round(rawScore * 10) / 10;
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (score !== null) {
      reset();
      return;
    }
    setIsDrawing(true);
    setPoints([]);
    setMessage("Keep going...");
    
    // Initial draw
    const { x, y } = getCoordinates(e);
    setPoints([{ x, y }]);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const { x, y } = getCoordinates(e);
    const newPoints = [...points, { x, y }];
    setPoints(newPoints);

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#9333ea'; // Purple-600
      
      ctx.beginPath();
      if (points.length > 0) {
        ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
      } else {
        ctx.moveTo(x, y);
      }
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const calculatedScore = calculateScore(points);
    if (calculatedScore !== null) {
      setScore(calculatedScore);
      
      // Draw the "perfect" comparison circle
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && center && radius) {
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(156, 163, 175, 0.5)'; // Gray-400, 50%
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (calculatedScore > 95) setMessage("Unbelievable!");
      else if (calculatedScore > 90) setMessage("So close!");
      else if (calculatedScore > 80) setMessage("Great job!");
      else setMessage("Try again!");
    } else {
      setMessage("Too short. Try again.");
      setTimeout(reset, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 relative overflow-hidden">
      <div className="absolute top-8 z-10 text-center pointer-events-none select-none">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">{score !== null ? `${score}%` : ''}</h1>
        <p className="text-xl text-slate-500">{message}</p>
      </div>

      <div ref={containerRef} className="w-full h-full max-w-2xl max-h-[600px] bg-white rounded-3xl shadow-sm border border-slate-200 m-4 relative cursor-crosshair touch-none">
         <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full rounded-3xl"
        />
        
        {score !== null && (
          <button 
            onClick={reset}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
          >
            <RefreshCcw size={20} /> Try Again
          </button>
        )}
      </div>
      
      <div className="absolute bottom-4 text-slate-400 text-sm flex items-center gap-2">
         <Trophy size={14} /> Global High Score: 98.4%
      </div>
    </div>
  );
};
