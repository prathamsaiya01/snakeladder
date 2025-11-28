import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_LADDERS, GAME_SNAKES } from '../config/gameConfig';
import { cn } from '../lib/utils';

const Board = ({ players }) => {
  // Helper to get tile number based on grid position (0-9, 0-9)
  const getTileNumber = (row, col) => {
    const rowFromBottom = 9 - row;
    if (rowFromBottom % 2 === 0) {
      // Even row from bottom (0, 2, 4...) -> Left to Right
      return rowFromBottom * 10 + col + 1;
    } else {
      // Odd row from bottom (1, 3, 5...) -> Right to Left
      return (rowFromBottom + 1) * 10 - col;
    }
  };

  // Helper to get grid coordinates (row, col) from tile number
  const getCoordinates = (tileNum) => {
    if (tileNum < 1 || tileNum > 100) return { row: 9, col: 0 }; // Fallback
    const rowFromBottom = Math.floor((tileNum - 1) / 10);
    const row = 9 - rowFromBottom;
    let col;
    if (rowFromBottom % 2 === 0) {
      col = (tileNum - 1) % 10;
    } else {
      col = 9 - ((tileNum - 1) % 10);
    }
    return { row, col };
  };

  // Generate grid cells
  const gridCells = [];
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const tileNum = getTileNumber(row, col);
      gridCells.push({ row, col, tileNum });
    }
  }

  return (
    <div className="relative w-full max-w-[600px] aspect-square bg-white rounded-xl shadow-2xl border-4 border-slate-800 overflow-hidden mx-auto">
      {/* Grid Layer */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
        {gridCells.map((cell) => {
          const isEven = (cell.row + cell.col) % 2 === 0;
          return (
            <div
              key={cell.tileNum}
              className={cn(
                "relative flex items-center justify-center text-[10px] sm:text-xs font-bold select-none",
                isEven ? "bg-slate-100 text-slate-400" : "bg-white text-slate-300",
                cell.tileNum === 1 && "bg-green-100 text-green-600",
                cell.tileNum === 100 && "bg-yellow-100 text-yellow-600"
              )}
            >
              <span className="absolute top-0.5 left-1 opacity-50">{cell.tileNum}</span>
              {cell.tileNum === 1 && <span className="text-xs font-extrabold">START</span>}
              {cell.tileNum === 100 && <span className="text-xs font-extrabold">WIN</span>}
            </div>
          );
        })}
      </div>

      {/* Snakes and Ladders SVG Layer */}
      {/* Using viewBox 0 0 100 100 to map easily to the 10x10 grid percentages */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-90" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gradient for Snakes */}
          <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          
          {/* Pattern for Ladders */}
          <pattern id="ladderPattern" width="2" height="2" patternUnits="userSpaceOnUse">
             <line x1="0" y1="0" x2="0" y2="2" stroke="#22c55e" strokeWidth="0.5" />
          </pattern>
        </defs>
        
        {/* Ladders */}
        {GAME_LADDERS.map((ladder, idx) => {
          const start = getCoordinates(ladder.start);
          const end = getCoordinates(ladder.end);
          
          // Coordinates in 0-100 space
          const x1 = (start.col + 0.5) * 10;
          const y1 = (start.row + 0.5) * 10;
          const x2 = (end.col + 0.5) * 10;
          const y2 = (end.row + 0.5) * 10;
          
          return (
            <g key={`ladder-${idx}`}>
              {/* Rails */}
              <line 
                x1={x1 - 1.5} y1={y1} x2={x2 - 1.5} y2={y2} 
                stroke="#22c55e" 
                strokeWidth="0.8" 
                strokeLinecap="round"
              />
              <line 
                x1={x1 + 1.5} y1={y1} x2={x2 + 1.5} y2={y2} 
                stroke="#22c55e" 
                strokeWidth="0.8" 
                strokeLinecap="round"
              />
              {/* Rungs - simplified as a thick dashed line in the middle for visual effect */}
              <line 
                x1={x1} y1={y1} x2={x2} y2={y2} 
                stroke="#22c55e" 
                strokeWidth="3" 
                strokeDasharray="1 1"
                opacity="0.5"
              />
            </g>
          );
        })}

        {/* Snakes */}
        {GAME_SNAKES.map((snake, idx) => {
          const start = getCoordinates(snake.start); // Head
          const end = getCoordinates(snake.end);     // Tail
          
          const x1 = (start.col + 0.5) * 10;
          const y1 = (start.row + 0.5) * 10;
          const x2 = (end.col + 0.5) * 10;
          const y2 = (end.row + 0.5) * 10;
          
          // Control points for a wavy S-curve
          // We calculate a midpoint and offset it to create a curve
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          
          // Direction vector
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.sqrt(dx*dx + dy*dy);
          
          // Normal vector (perpendicular)
          const nx = -dy / len;
          const ny = dx / len;
          
          // Amplitude of the curve
          const amp = 5; 
          
          // Control point 1
          const cp1x = midX + nx * amp;
          const cp1y = midY + ny * amp;

          // For a more complex wiggle, we could use a cubic bezier or multiple Qs
          // Simple Quadratic: M start Q cp end
          
          return (
            <g key={`snake-${idx}`}>
              {/* Snake Body */}
              <path
                d={`M ${x1} ${y1} Q ${cp1x} ${cp1y} ${x2} ${y2}`}
                stroke="url(#snakeGradient)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                className="drop-shadow-sm"
              />
              
              {/* Snake Head (Start) */}
              <circle cx={x1} cy={y1} r="2" fill="#ef4444" />
              {/* Eyes */}
              <circle cx={x1 - 0.6} cy={y1 - 0.5} r="0.5" fill="white" />
              <circle cx={x1 + 0.6} cy={y1 - 0.5} r="0.5" fill="white" />
              <circle cx={x1 - 0.6} cy={y1 - 0.5} r="0.2" fill="black" />
              <circle cx={x1 + 0.6} cy={y1 - 0.5} r="0.2" fill="black" />
              
              {/* Snake Tail (End) - small taper */}
              <circle cx={x2} cy={y2} r="0.8" fill="#991b1b" />
            </g>
          );
        })}
      </svg>

      {/* Players Layer */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <AnimatePresence>
          {players.map((player, index) => {
            const coords = getCoordinates(player.position);
            // Offset players slightly if they are on the same tile so they don't overlap perfectly
            const offsetMap = [
              { x: -15, y: -15 },
              { x: 15, y: -15 },
              { x: -15, y: 15 },
              { x: 15, y: 15 },
            ];
            const offset = offsetMap[index % 4];

            return (
              <motion.div
                key={player.id}
                initial={false}
                animate={{
                  left: `calc(${coords.col * 10 + 5}% + ${offset.x}px)`,
                  top: `calc(${coords.row * 10 + 5}% + ${offset.y}px)`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={cn(
                  "absolute w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2",
                  player.color.value,
                  player.color.border
                )}
              >
                <span className="text-[10px] font-bold text-white">{player.name.charAt(0)}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Board;
