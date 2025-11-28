import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

const Dice = ({ onRoll, disabled, rolling, lastValue }) => {
  const [displayValue, setDisplayValue] = useState(1);

  useEffect(() => {
    if (rolling) {
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 100);
      return () => clearInterval(interval);
    } else if (lastValue) {
      setDisplayValue(lastValue);
    }
  }, [rolling, lastValue]);

  const DiceIcon = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6][displayValue - 1];

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={rolling ? { rotate: 360, scale: [1, 1.2, 1] } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, repeat: rolling ? Infinity : 0 }}
        className="relative"
      >
        <div className="w-20 h-20 bg-white rounded-2xl shadow-xl border-2 border-slate-200 flex items-center justify-center">
          <DiceIcon className={cn("w-12 h-12", rolling ? "text-slate-400" : "text-primary")} />
        </div>
      </motion.div>
      
      <Button 
        onClick={onRoll} 
        disabled={disabled || rolling}
        size="lg"
        variant="game"
        className="w-full text-lg font-bold tracking-wider"
      >
        {rolling ? "ROLLING..." : "ROLL DICE"}
      </Button>
    </div>
  );
};

export default Dice;
