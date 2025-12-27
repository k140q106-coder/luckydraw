
import React, { useState, useCallback } from 'react';
import { View, Participant } from './types';
import SetupView from './components/SetupView';
import RaffleView from './components/RaffleView';
import GroupingView from './components/GroupingView';
import { Layout, Users, Trophy, Settings2, Trash2, Home } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<View>('setup');
  const [participants, setParticipants] = useState<Participant[]>([]);

  const handleSetParticipants = (names: string[]) => {
    const newParticipants = names
      .filter(n => n.trim().length > 0)
      .map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim()
      }));
    setParticipants(newParticipants);
  };

  const clearParticipants = () => {
    if (confirm('Are you sure you want to clear the list?')) {
      setParticipants([]);
      setView('setup');
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-20">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('setup')}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Settings2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight hidden sm:block">
              HR <span className="text-indigo-600">EventPro</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('setup')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                view === 'setup' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Names</span>
            </button>
            <button
              disabled={participants.length === 0}
              onClick={() => setView('raffle')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                view === 'raffle' ? 'bg-rose-100 text-rose-700 font-medium' : 'hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Raffle</span>
            </button>
            <button
              disabled={participants.length === 0}
              onClick={() => setView('grouping')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                view === 'grouping' ? 'bg-amber-100 text-amber-700 font-medium' : 'hover:bg-slate-100'
              }`}
            >
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">Groups</span>
            </button>
          </div>

          {participants.length > 0 && (
            <button
              onClick={clearParticipants}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Clear all names"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === 'setup' && (
          <SetupView 
            participants={participants} 
            onUpdateParticipants={handleSetParticipants}
            onContinue={() => setView('raffle')}
          />
        )}
        {view === 'raffle' && (
          <RaffleView participants={participants} />
        )}
        {view === 'grouping' && (
          <GroupingView participants={participants} />
        )}
      </main>

      {/* Mobile Sticky Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
         <button onClick={() => setView('setup')} className={`flex flex-col items-center gap-1 ${view === 'setup' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <Home className="w-6 h-6" />
            <span className="text-[10px]">Home</span>
         </button>
         <button 
          disabled={participants.length === 0} 
          onClick={() => setView('raffle')} 
          className={`flex flex-col items-center gap-1 disabled:opacity-30 ${view === 'raffle' ? 'text-rose-600' : 'text-slate-400'}`}
         >
            <Trophy className="w-6 h-6" />
            <span className="text-[10px]">Raffle</span>
         </button>
         <button 
          disabled={participants.length === 0} 
          onClick={() => setView('grouping')} 
          className={`flex flex-col items-center gap-1 disabled:opacity-30 ${view === 'grouping' ? 'text-amber-600' : 'text-slate-400'}`}
         >
            <Layout className="w-6 h-6" />
            <span className="text-[10px]">Groups</span>
         </button>
      </div>
    </div>
  );
};

export default App;
