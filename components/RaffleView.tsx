
import React, { useState, useEffect, useRef } from 'react';
import { Participant } from '../types';
import { Trophy, RefreshCw, Settings, Gift, UserCheck, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  participants: Participant[];
}

const RaffleView: React.FC<Props> = ({ participants }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [availableNames, setAvailableNames] = useState<Participant[]>(participants);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [currentDisplayNames, setCurrentDisplayNames] = useState<string[]>([]);
  const [lastWinner, setLastWinner] = useState<Participant | null>(null);
  
  const spinInterval = useRef<number | null>(null);

  useEffect(() => {
    setAvailableNames(participants);
    setWinners([]);
    setLastWinner(null);
  }, [participants]);

  const startRaffle = () => {
    if (availableNames.length === 0) {
      alert("No more names left in the pool!");
      return;
    }

    setIsSpinning(true);
    setLastWinner(null);

    // Visual cycling logic
    let counter = 0;
    const maxCycles = 30;
    const interval = 80;

    spinInterval.current = window.setInterval(() => {
      // Pick random names for visual effect
      const randomNames = Array.from({ length: 5 }, () => 
        participants[Math.floor(Math.random() * participants.length)].name
      );
      setCurrentDisplayNames(randomNames);
      
      counter++;
      if (counter >= maxCycles) {
        finishRaffle();
      }
    }, interval);
  };

  const finishRaffle = () => {
    if (spinInterval.current) clearInterval(spinInterval.current);
    
    const winnerIndex = Math.floor(Math.random() * availableNames.length);
    const winner = availableNames[winnerIndex];
    
    setLastWinner(winner);
    setWinners(prev => [winner, ...prev]);
    
    if (!allowRepeat) {
      setAvailableNames(prev => prev.filter(p => p.id !== winner.id));
    }

    setIsSpinning(false);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#f43f5e', '#fbbf24']
    });
  };

  const resetPool = () => {
    if (confirm('Reset pool and clear winners list?')) {
      setAvailableNames(participants);
      setWinners([]);
      setLastWinner(null);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Settings & Stats */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" />
            Draw Options
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-sm font-medium">Allow Re-drawing</div>
              <button 
                onClick={() => setAllowRepeat(!allowRepeat)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${allowRepeat ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allowRepeat ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-bold">In Pool</div>
                <div className="text-2xl font-bold text-indigo-600">{availableNames.length}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-bold">Winners</div>
                <div className="text-2xl font-bold text-rose-600">{winners.length}</div>
              </div>
            </div>

            <button
              onClick={resetPool}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Draw History
            </button>
          </div>
        </div>

        {/* Recent Winners (Sidebar for desktop, bottom for mobile) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hidden lg:block">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            History
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {winners.length === 0 && <p className="text-slate-400 text-sm italic">No winners yet</p>}
            {winners.map((winner, i) => (
              <div key={`${winner.id}-${winners.length - i}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 animate-in slide-in-from-top-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs shrink-0">
                  #{winners.length - i}
                </div>
                <span className="font-medium text-slate-700 truncate">{winner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Raffle Area */}
      <div className="lg:col-span-2 space-y-8">
        <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 shadow-2xl overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Gift className="w-64 h-64 -rotate-12" />
          </div>
          <div className="absolute bottom-0 left-0 p-4 opacity-10">
            <Trophy className="w-48 h-48 rotate-12" />
          </div>

          <div className="relative z-10 space-y-8 w-full">
            <div className="space-y-2">
              <h2 className="text-indigo-100 font-medium tracking-widest uppercase text-sm">Lucky Draw</h2>
              <div className="h-24 flex items-center justify-center">
                {isSpinning ? (
                   <div className="text-4xl md:text-6xl font-black text-white overflow-hidden h-20">
                     <div className="slot-scroll">
                        {currentDisplayNames.map((name, i) => (
                          <div key={i} className="h-20 flex items-center justify-center">
                            {name}
                          </div>
                        ))}
                     </div>
                   </div>
                ) : lastWinner ? (
                  <div className="animate-in zoom-in duration-300">
                    <div className="text-4xl md:text-6xl font-black text-white drop-shadow-lg">
                      {lastWinner.name}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full text-indigo-100 text-sm backdrop-blur-md">
                      <UserCheck className="w-4 h-4" />
                      We have a winner!
                    </div>
                  </div>
                ) : (
                  <div className="text-white/40 text-4xl font-light italic">
                    Ready to spin?
                  </div>
                )}
              </div>
            </div>

            <button
              disabled={isSpinning || availableNames.length === 0}
              onClick={startRaffle}
              className={`group relative px-12 py-6 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-xl ${
                isSpinning ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-amber-400 hover:bg-amber-300 text-amber-950 hover:shadow-amber-400/20'
              }`}
            >
              {isSpinning ? 'DRAWING...' : 'SPIN NOW!'}
              {!isSpinning && <div className="absolute inset-0 rounded-2xl animate-pulse ring-4 ring-amber-400/50" />}
            </button>
          </div>
        </div>

        {/* Mobile History View */}
        <div className="lg:hidden bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">History</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {winners.map((winner, i) => (
                <div key={`${winner.id}-${i}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="font-bold text-amber-600">#{winners.length - i}</span>
                  <span className="font-medium text-slate-700 truncate">{winner.name}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaffleView;
