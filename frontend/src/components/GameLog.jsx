import React, { useEffect, useRef } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '../lib/utils';

const GameLog = ({ logs }) => {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [logs]);

  return (
    <div className="bg-white rounded-xl border shadow-sm h-[200px] flex flex-col">
      <div className="p-3 border-b bg-slate-50 rounded-t-xl">
        <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">Game Log</h3>
      </div>
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-2">
          {logs.length === 0 && (
            <p className="text-sm text-slate-400 italic text-center mt-4">Game started! Roll the dice.</p>
          )}
          {logs.map((log, idx) => (
            <div key={idx} className="text-sm flex items-start gap-2">
              <span className="text-slate-300 font-mono text-xs mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
              <span className={cn(
                "text-slate-600",
                log.includes("wins") && "font-bold text-green-600",
                log.includes("Snake") && "text-red-500",
                log.includes("Ladder") && "text-green-600"
              )}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default GameLog;
