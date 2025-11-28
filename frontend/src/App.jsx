import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import Dice from './components/Dice';
import PlayerSetup from './components/PlayerSetup';
import GameLog from './components/GameLog';
import WinnerModal from './components/WinnerModal';
import { GAME_LADDERS, GAME_SNAKES } from './config/gameConfig';
import { cn } from './lib/utils';
import { User } from 'lucide-react';

function App() {
  const [gameStatus, setGameStatus] = useState('setup'); // setup, playing, finished
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [logs, setLogs] = useState([]);
  const [winner, setWinner] = useState(null);

  const addLog = (message) => {
    setLogs(prev => [...prev, message]);
  };

  const handleStartGame = (setupPlayers) => {
    setPlayers(setupPlayers);
    setGameStatus('playing');
    setCurrentPlayerIndex(0);
    setLogs([]);
    setWinner(null);
    setDiceValue(null);
    addLog("Game started!");
  };

  const handleRollDice = async () => {
    if (isRolling || gameStatus !== 'playing') return;

    setIsRolling(true);
    
    // Simulate roll time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(roll);
    setIsRolling(false);

    movePlayer(roll);
  };

  const movePlayer = async (roll) => {
    const player = players[currentPlayerIndex];
    let newPos = player.position + roll;
    
    addLog(`${player.name} rolled a ${roll}.`);

    // Bounce back rule or just stay put? 
    // Prompt says: "If a move would go beyond 100, ignore the move and keep the player in place."
    if (newPos > 100) {
      addLog(`${player.name} needs exact ${100 - player.position} to win. Stayed at ${player.position}.`);
      nextTurn();
      return;
    }

    // Initial Move
    updatePlayerPosition(player.id, newPos);
    
    // Check for win immediately if landed on 100
    if (newPos === 100) {
      handleWin(player);
      return;
    }

    // Wait a bit before checking snake/ladder for visual clarity
    await new Promise(resolve => setTimeout(resolve, 600));

    // Check Snake or Ladder
    const ladder = GAME_LADDERS.find(l => l.start === newPos);
    const snake = GAME_SNAKES.find(s => s.start === newPos);

    if (ladder) {
      addLog(`🪜 ${player.name} found a ladder! Climbing to ${ladder.end}.`);
      updatePlayerPosition(player.id, ladder.end);
      if (ladder.end === 100) {
        handleWin(player);
        return;
      }
    } else if (snake) {
      addLog(`🐍 ${player.name} bitten by a snake! Sliding down to ${snake.end}.`);
      updatePlayerPosition(player.id, snake.end);
    }

    nextTurn();
  };

  const updatePlayerPosition = (playerId, pos) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, position: pos } : p));
  };

  const handleWin = (player) => {
    setWinner(player);
    setGameStatus('finished');
    addLog(`🎉 ${player.name} WINS THE GAME!`);
  };

  const nextTurn = () => {
    setCurrentPlayerIndex(prev => (prev + 1) % players.length);
  };

  const handlePlayAgain = () => {
    setPlayers(prev => prev.map(p => ({ ...p, position: 1 })));
    setGameStatus('playing');
    setWinner(null);
    setLogs([]);
    setCurrentPlayerIndex(0);
    setDiceValue(null);
    addLog("Game restarted!");
  };

  const handleNewGame = () => {
    setGameStatus('setup');
    setWinner(null);
  };

  if (gameStatus === 'setup') {
    return <PlayerSetup onStartGame={handleStartGame} />;
  }

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Board */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center justify-center">
          <div className="mb-4 flex items-center justify-between w-full max-w-[600px]">
            <h1 className="text-2xl font-black text-primary tracking-tight">SNAKE & LADDER</h1>
            <div className="text-sm font-medium bg-white px-3 py-1 rounded-full shadow-sm border">
              Turn: <span className={currentPlayer.color.text}>{currentPlayer.name}</span>
            </div>
          </div>
          <Board players={players} />
        </div>

        {/* Right Column: Controls & Info */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          
          {/* Player List Card */}
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Players</h2>
            <div className="space-y-2">
              {players.map((p, idx) => (
                <div 
                  key={p.id} 
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg transition-all",
                    currentPlayerIndex === idx ? "bg-slate-100 ring-2 ring-primary ring-inset" : "bg-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm", p.color.value)}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className={cn("font-semibold text-sm", currentPlayerIndex === idx ? "text-slate-900" : "text-slate-500")}>
                        {p.name}
                      </p>
                      <p className="text-xs text-slate-400">Tile {p.position}</p>
                    </div>
                  </div>
                  {currentPlayerIndex === idx && (
                    <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                      YOUR TURN
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dice Control */}
          <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col items-center justify-center min-h-[200px]">
            <Dice 
              onRoll={handleRollDice} 
              disabled={gameStatus !== 'playing'} 
              rolling={isRolling}
              lastValue={diceValue}
            />
          </div>

          {/* Game Log */}
          <GameLog logs={logs} />

        </div>
      </div>

      <WinnerModal 
        winner={winner} 
        onPlayAgain={handlePlayAgain} 
        onNewGame={handleNewGame} 
      />
    </div>
  );
}

export default App;
