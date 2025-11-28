import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PLAYER_COLORS } from '../config/gameConfig';
import { cn } from '../lib/utils';

const PlayerSetup = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = React.useState(2);
  const [names, setNames] = React.useState({
    0: "Player 1",
    1: "Player 2",
    2: "Player 3",
    3: "Player 4"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const players = [];
    for (let i = 0; i < playerCount; i++) {
      players.push({
        id: i,
        name: names[i] || `Player ${i + 1}`,
        color: PLAYER_COLORS[i],
        position: 1,
      });
    }
    onStartGame(players);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-primary">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-black text-primary tracking-tight">SNAKE & LADDER</CardTitle>
          <CardDescription className="text-lg">Classic board game for friends</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base">Number of Players</Label>
              <div className="flex gap-2">
                {[2, 3, 4].map((num) => (
                  <Button
                    key={num}
                    type="button"
                    variant={playerCount === num ? "default" : "outline"}
                    className={cn("flex-1 h-12 text-lg", playerCount === num && "ring-2 ring-offset-2 ring-primary")}
                    onClick={() => setPlayerCount(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base">Player Names</Label>
              {Array.from({ length: playerCount }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-full flex-shrink-0", PLAYER_COLORS[idx].value)} />
                  <Input
                    value={names[idx]}
                    onChange={(e) => setNames({ ...names, [idx]: e.target.value })}
                    placeholder={`Player ${idx + 1}`}
                    className="h-11"
                  />
                </div>
              ))}
            </div>

            <Button type="submit" size="lg" className="w-full text-lg font-bold h-14 mt-4">
              START GAME
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerSetup;
