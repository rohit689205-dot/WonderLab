import React, { useState, useRef, useEffect } from 'react';
import { CraftElement, InstanceElement } from '../../types';
import { INITIAL_ELEMENTS } from '../../constants';
import { combineElements } from '../../services/geminiService';
import { Plus, Trash2, Loader2, Sparkles } from 'lucide-react';

export const InfiniteCraft: React.FC = () => {
  const [inventory, setInventory] = useState<CraftElement[]>(INITIAL_ELEMENTS);
  const [workspace, setWorkspace] = useState<InstanceElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastCreation, setLastCreation] = useState<string | null>(null);

  // Dragging state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Add an item from inventory to workspace
  const addToWorkspace = (element: CraftElement) => {
    // Randomize position slightly in the center
    const workspaceRect = workspaceRef.current?.getBoundingClientRect();
    const x = workspaceRect ? workspaceRect.width / 2 + (Math.random() * 40 - 20) - 50 : 100;
    const y = workspaceRect ? workspaceRect.height / 2 + (Math.random() * 40 - 20) - 25 : 100;

    const newInstance: InstanceElement = {
      ...element,
      id: Math.random().toString(36).substr(2, 9),
      x,
      y
    };
    setWorkspace(prev => [...prev, newInstance]);
  };

  const handlePointerDown = (e: React.PointerEvent, id: string, initialX: number, initialY: number) => {
    e.stopPropagation();
    e.preventDefault();
    setDraggingId(id);
    dragOffset.current = { x: e.clientX - initialX, y: e.clientY - initialY };
    
    // Move to top of stack
    setWorkspace(prev => {
        const item = prev.find(i => i.id === id);
        if (!item) return prev;
        const others = prev.filter(i => i.id !== id);
        return [...others, item];
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !workspaceRef.current) return;
    
    const rect = workspaceRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.current.x;
    const newY = e.clientY - rect.top - dragOffset.current.y;

    setWorkspace(prev => prev.map(el => 
      el.id === draggingId ? { ...el, x: newX, y: newY } : el
    ));
  };

  const handlePointerUp = async (e: React.PointerEvent) => {
    if (!draggingId) return;

    const draggedElement = workspace.find(el => el.id === draggingId);
    setDraggingId(null);

    if (!draggedElement) return;

    // Check for collisions
    const collisionThreshold = 60; // Distance in pixels
    let target: InstanceElement | null = null;

    for (const el of workspace) {
      if (el.id === draggingId) continue;
      const dx = el.x - draggedElement.x;
      const dy = el.y - draggedElement.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < collisionThreshold) {
        target = el;
        break;
      }
    }

    if (target) {
      await combine(draggedElement, target);
    }
  };

  const combine = async (elem1: InstanceElement, elem2: InstanceElement) => {
    // Remove both elements
    setWorkspace(prev => prev.filter(el => el.id !== elem1.id && el.id !== elem2.id));
    setLoading(true);

    try {
      const result = await combineElements(elem1.name, elem2.name);
      
      const newX = (elem1.x + elem2.x) / 2;
      const newY = (elem1.y + elem2.y) / 2;

      const newInstance: InstanceElement = {
        ...result,
        id: Math.random().toString(36).substr(2, 9),
        x: newX,
        y: newY
      };

      setWorkspace(prev => [...prev, newInstance]);
      setLastCreation(`${elem1.emoji} + ${elem2.emoji} = ${result.name}`);

      // Add to inventory if unique
      setInventory(prev => {
        if (prev.some(i => i.name === result.name)) return prev;
        return [...prev, result];
      });

    } catch (e) {
      console.error(e);
      // If fails, put them back? Or just leave them consumed (oops)
    } finally {
      setLoading(false);
    }
  };

  const clearWorkspace = () => {
    setWorkspace([]);
  };

  return (
    <div 
      className="flex flex-col md:flex-row w-full h-full bg-slate-900 text-white overflow-hidden relative" 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Sidebar / Inventory */}
      <div className="w-full md:w-64 bg-slate-800 border-r border-slate-700 flex flex-col z-20 shadow-xl max-h-[30vh] md:max-h-full">
        <div className="p-4 border-b border-slate-700 font-bold flex justify-between items-center">
          <span>Elements ({inventory.length})</span>
          <span className="text-xs text-slate-400">Drag to play</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 grid grid-cols-2 gap-2 content-start no-scrollbar">
          {inventory.map((item, idx) => (
            <button
              key={`${item.name}-${idx}`}
              onClick={() => addToWorkspace(item)}
              className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg flex items-center gap-2 text-sm text-left transition-colors select-none"
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="truncate">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 relative bg-slate-900 overflow-hidden touch-none" ref={workspaceRef}>
        
        {/* Helper Text */}
        {workspace.length === 0 && !loading && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-700 pointer-events-none select-none">
            <p className="text-xl font-medium">Drag elements here to combine them</p>
          </div>
        )}

        {/* Floating status */}
        {loading && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse z-30">
            <Loader2 className="animate-spin" size={16} /> Creating...
          </div>
        )}

        {lastCreation && !loading && (
           <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800/80 text-white px-4 py-2 rounded-full shadow-lg border border-slate-700 flex items-center gap-2 z-30 animate-in fade-in slide-in-from-top-4 duration-500">
             <Sparkles size={14} className="text-yellow-400" /> {lastCreation}
           </div>
        )}
        
        {/* Render Instances */}
        {workspace.map((el) => (
          <div
            key={el.id}
            onPointerDown={(e) => handlePointerDown(e, el.id, el.x, el.y)}
            style={{ 
              transform: `translate(${el.x}px, ${el.y}px)`,
              touchAction: 'none'
            }}
            className={`absolute cursor-grab active:cursor-grabbing bg-white text-slate-900 px-4 py-2 rounded-full shadow-lg border-2 border-slate-200 select-none flex items-center gap-2 hover:scale-105 transition-transform ${draggingId === el.id ? 'z-50 scale-110 shadow-xl border-indigo-500' : 'z-10'}`}
          >
            <span className="text-2xl pointer-events-none">{el.emoji}</span>
            <span className="font-bold pointer-events-none">{el.name}</span>
          </div>
        ))}

        {/* Controls */}
        <button 
          onClick={clearWorkspace}
          className="absolute bottom-6 right-6 p-4 bg-slate-800 rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors shadow-lg z-20"
          title="Clear Workspace"
        >
          <Trash2 size={24} />
        </button>
      </div>
    </div>
  );
};
