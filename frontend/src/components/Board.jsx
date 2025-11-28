import React, { useState, useEffect } from 'react';
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
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-80">
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="#22c55e" />
          </marker>
        </defs>
        
        {/* Ladders */}
        {GAME_LADDERS.map((ladder, idx) => {
          const start = getCoordinates(ladder.start);
          const end = getCoordinates(ladder.end);
          const x1 = `${(start.col + 0.5) * 10}%`;
          const y1 = `${(start.row + 0.5) * 10}%`;
          const x2 = `${(end.col + 0.5) * 10}%`;
          const y2 = `${(end.row + 0.5) * 10}%`;
          
          return (
            <g key={`ladder-${idx}`}>
              <line 
                x1={x1} y1={y1} x2={x2} y2={y2} 
                stroke="#22c55e" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeDasharray="4 2"
              />
              <line 
                x1={x1} y1={y1} x2={x2} y2={y2} 
                stroke="rgba(34, 197, 94, 0.3)" 
                strokeWidth="12" 
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Snakes */}
        {GAME_SNAKES.map((snake, idx) => {
          const start = getCoordinates(snake.start);
          const end = getCoordinates(snake.end);
          const x1 = (start.col + 0.5) * 10;
          const y1 = (start.row + 0.5) * 10;
          const x2 = (end.col + 0.5) * 10;
          const y2 = (end.row + 0.5) * 10;
          
          // Create a curvy path for the snake
          const midX = (x1 + x2) / 2 + (Math.random() > 0.5 ? 5 : -5);
          const midY = (y1 + y2) / 2;
          
          return (
            <g key={`snake-${idx}`}>
              <path
                d={`M ${x1}% ${y1}% Q ${midX}% ${midY}% ${x2}% ${y2}%`}
                stroke="#ef4444"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx={`${x1}%`} cy={`${y1}%`} r="1.5%" fill="#ef4444" />
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
            // We can use the player index to create a small offset
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
