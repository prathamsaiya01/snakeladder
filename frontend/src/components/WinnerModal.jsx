import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Trophy } from "lucide-react";

const WinnerModal = ({ winner, onPlayAgain, onNewGame }) => {
  if (!winner) return null;

  return (
    <Dialog open={!!winner}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center animate-bounce">
            <Trophy className="w-10 h-10 text-yellow-600" />
          </div>
          <DialogTitle className="text-3xl font-black text-primary">
            {winner.name} Wins!
          </DialogTitle>
          <DialogDescription className="text-lg">
            Congratulations! You've reached tile 100.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6 w-full">
          <Button onClick={onPlayAgain} className="flex-1" size="lg">
            Play Again
          </Button>
          <Button onClick={onNewGame} variant="outline" className="flex-1" size="lg">
            Change Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WinnerModal;
