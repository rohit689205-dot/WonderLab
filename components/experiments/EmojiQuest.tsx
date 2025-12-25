import React, { useState, useEffect, useRef } from 'react';
import { Sword, Shield, Zap, Heart, Skull, Trophy } from 'lucide-react';

interface Fighter {
  hp: number;
  maxHp: number;
  attack: number;
  name: string;
  emoji: string;
}

const ENEMIES = [
  { name: "Slime", emoji: "🦠" },
  { name: "Rat", emoji: "🐀" },
  { name: "Bat", emoji: "🦇" },
  { name: "Spider", emoji: "🕷️" },
  { name: "Snake", emoji: "🐍" },
  { name: "Wolf", emoji: "🐺" },
  { name: "Bear", emoji: "🐻" },
  { name: "Ghost", emoji: "👻" },
  { name: "Ogre", emoji: "👹" },
  { name: "Dragon", emoji: "🐲" },
];

export const EmojiQuest: React.FC = () => {
  // Player State
  const [player, setPlayer] = useState<Fighter>({ hp: 20, maxHp: 20, attack: 1, name: "Hero", emoji: "🧑‍🚀" });
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [gold, setGold] = useState(0);
  const [stage, setStage] = useState(1);
  const [isDead, setIsDead] = useState(false);

  // Enemy State
  const [enemy, setEnemy] = useState<Fighter>({ hp: 10, maxHp: 10, attack: 1, name: "Slime", emoji: "🦠" });
  
  // Animation States
  const [playerHit, setPlayerHit] = useState(false);
  const [enemyHit, setEnemyHit] = useState(false);
  const [combatLog, setCombatLog] = useState<string[]>(["Welcome to the Arena!"]);

  const maxXp = level * 50;

  // Spawning logic
  const spawnEnemy = (currentStage: number) => {
    const type = ENEMIES[Math.min(Math.floor((currentStage - 1) / 5), ENEMIES.length - 1)];
    const scaling = Math.pow(1.2, currentStage - 1);
    
    setEnemy({
      name: type.name,
      emoji: type.emoji,
      maxHp: Math.floor(10 * scaling),
      hp: Math.floor(10 * scaling),
      attack: Math.floor(1 + (currentStage * 0.5)),
    });
  };

  const addLog = (msg: string) => {
    setCombatLog(prev => [msg, ...prev].slice(0, 3));
  };

  // Player Attack
  const attackEnemy = () => {
    if (isDead) return;

    // Crit chance
    const isCrit = Math.random() < 0.1;
    const damage = isCrit ? player.attack * 2 : player.attack;

    setEnemyHit(true);
    setTimeout(() => setEnemyHit(false), 200);

    setEnemy(prev => {
      const newHp = prev.hp - damage;
      if (newHp <= 0) {
        // Enemy defeated
        handleVictory(prev);
        return { ...prev, hp: 0 };
      }
      return { ...prev, hp: newHp };
    });

    if (isCrit) addLog(`CRITICAL HIT! Dealt ${damage} dmg!`);
  };

  const handleVictory = (defeatedEnemy: Fighter) => {
    const goldDrop = Math.floor(defeatedEnemy.maxHp / 2) + stage;
    const xpDrop = 10 + stage * 2;
    
    setGold(prev => prev + goldDrop);
    setXp(prev => {
      const newXp = prev + xpDrop;
      if (newXp >= maxXp) {
        levelUp(newXp);
        return 0; // Handled in levelUp but simplifying here
      }
      return newXp;
    });
    
    addLog(`Defeated ${defeatedEnemy.name}! +${goldDrop}g`);
    setStage(prev => prev + 1);
    
    // Slight delay before next enemy
    setTimeout(() => spawnEnemy(stage + 1), 500);
  };

  const levelUp = (currentXp: number) => {
    setLevel(prev => prev + 1);
    setPlayer(prev => ({
      ...prev,
      maxHp: prev.maxHp + 10,
      hp: prev.maxHp + 10,
      attack: prev.attack + 1
    }));
    addLog("LEVEL UP! Stats increased!");
    setXp(currentXp - maxXp);
  };

  // Enemy Attack (Interval)
  useEffect(() => {
    if (isDead) return;

    const interval = setInterval(() => {
      if (enemy.hp > 0) {
        setPlayerHit(true);
        setTimeout(() => setPlayerHit(false), 200);

        setPlayer(prev => {
          const dmg = Math.max(1, enemy.attack - Math.floor(level / 2)); // Simple defense
          const newHp = prev.hp - dmg;
          if (newHp <= 0) {
            setIsDead(true);
            addLog(`You were killed by ${enemy.name}...`);
            return { ...prev, hp: 0 };
          }
          return { ...prev, hp: newHp };
        });
      }
    }, 2000); // Enemy attacks every 2 seconds

    return () => clearInterval(interval);
  }, [enemy, isDead, level]);

  const restart = () => {
    setPlayer({ hp: 20, maxHp: 20, attack: 1, name: "Hero", emoji: "🧑‍🚀" });
    setLevel(1);
    setXp(0);
    setGold(0);
    setStage(1);
    setIsDead(false);
    spawnEnemy(1);
    setCombatLog(["A new hero arises!"]);
  };

  const buyUpgrade = (type: 'atk' | 'hp') => {
    const cost = 20 * level;
    if (gold >= cost) {
      setGold(prev => prev - cost);
      if (type === 'atk') {
        setPlayer(prev => ({ ...prev, attack: prev.attack + 1 }));
        addLog("Upgraded Weapon!");
      } else {
        setPlayer(prev => ({ ...prev, maxHp: prev.maxHp + 10, hp: prev.hp + 10 }));
        addLog("Upgraded Armor!");
      }
    }
  };

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col items-center relative overflow-hidden font-sans">
      
      {/* Top HUD */}
      <div className="w-full max-w-2xl bg-slate-800 p-4 shadow-lg flex justify-between items-center z-10 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Level {level}</span>
            <div className="w-32 h-3 bg-slate-700 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(xp / maxXp) * 100}%` }} />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-yellow-400 font-bold flex items-center gap-1">
            <span>{gold}</span> <span className="text-xs">GOLD</span>
          </div>
          <div className="text-slate-400 text-xs font-mono">STAGE {stage}</div>
        </div>
      </div>

      {/* Combat Arena */}
      <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center relative p-8 gap-12">
        
        {isDead ? (
          <div className="text-center animate-in zoom-in duration-300">
            <Skull className="w-24 h-24 text-red-500 mx-auto mb-4" />
            <h2 className="text-4xl font-black text-red-500 mb-2">GAME OVER</h2>
            <p className="text-slate-400 mb-8">You survived until Stage {stage}</p>
            <button 
              onClick={restart}
              className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="w-full flex justify-between items-center px-4 md:px-12">
            
            {/* Player */}
            <div className="flex flex-col items-center gap-4 relative">
              <div className="w-full h-2 bg-slate-700 rounded-full mb-1">
                <div 
                  className="h-full bg-green-500 transition-all duration-300" 
                  style={{ width: `${(player.hp / player.maxHp) * 100}%` }} 
                />
              </div>
              <div className={`text-6xl md:text-8xl transition-transform duration-100 cursor-pointer ${playerHit ? 'translate-x-[-10px] text-red-500' : ''}`} onClick={attackEnemy}>
                {player.emoji}
              </div>
              <div className="font-bold">{player.name}</div>
              <div className="flex gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Sword size={12}/> {player.attack}</span>
                <span className="flex items-center gap-1"><Heart size={12}/> {player.hp}</span>
              </div>
            </div>

            {/* VS */}
            <div className="text-2xl font-black text-slate-700 italic">VS</div>

            {/* Enemy */}
            <div className="flex flex-col items-center gap-4 relative">
              <div className="w-full h-2 bg-slate-700 rounded-full mb-1">
                 <div 
                  className="h-full bg-red-500 transition-all duration-300" 
                  style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} 
                />
              </div>
              <div 
                className={`text-6xl md:text-8xl transition-transform duration-100 ${enemyHit ? 'scale-90 opacity-80 brightness-150' : ''}`}
                onClick={attackEnemy}
              >
                {enemy.emoji}
              </div>
              <div className="font-bold text-red-400">{enemy.name}</div>
              <div className="flex gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Sword size={12}/> {enemy.attack}</span>
                <span className="flex items-center gap-1"><Heart size={12}/> {enemy.hp}</span>
              </div>
            </div>

          </div>
        )}
        
        {/* Combat Log */}
        <div className="absolute bottom-40 w-full text-center space-y-1 pointer-events-none">
          {combatLog.map((log, i) => (
            <div key={i} className="text-sm font-mono opacity-60 text-yellow-100/80 animate-in slide-in-from-bottom-2 fade-in">{log}</div>
          ))}
        </div>

      </div>

      {/* Controls / Upgrades */}
      <div className="w-full max-w-2xl bg-slate-800 p-6 rounded-t-3xl shadow-2xl border-t border-slate-700">
        <button 
          onClick={attackEnemy}
          disabled={isDead}
          className="w-full bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-black text-xl py-6 rounded-2xl mb-6 shadow-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ATTACK!
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => buyUpgrade('atk')}
            disabled={gold < 20 * level || isDead}
            className="bg-slate-700 hover:bg-slate-600 p-4 rounded-xl flex items-center justify-between group disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-lg text-yellow-400"><Sword size={20}/></div>
              <div className="text-left">
                <div className="font-bold text-sm">Sharpness</div>
                <div className="text-xs text-slate-400">+1 ATK</div>
              </div>
            </div>
            <div className="font-mono text-yellow-400 text-sm group-hover:scale-110 transition-transform">{20 * level}g</div>
          </button>

          <button 
            onClick={() => buyUpgrade('hp')}
            disabled={gold < 20 * level || isDead}
            className="bg-slate-700 hover:bg-slate-600 p-4 rounded-xl flex items-center justify-between group disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2 rounded-lg text-green-400"><Shield size={20}/></div>
              <div className="text-left">
                <div className="font-bold text-sm">Vitality</div>
                <div className="text-xs text-slate-400">+10 HP</div>
              </div>
            </div>
            <div className="font-mono text-yellow-400 text-sm group-hover:scale-110 transition-transform">{20 * level}g</div>
          </button>
        </div>
      </div>
    </div>
  );
};
