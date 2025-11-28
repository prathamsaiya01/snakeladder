export const BOARD_SIZE = 100;

// Standard Snake & Ladder configuration
export const LADDERS = {
  3: 22,
  5: 8,
  11: 26,
  20: 29,
  17: 4, // Wait, 17->4 is a snake. Let's separate them clearly.
};

// Explicit Ladders (Start -> End, where End > Start)
export const GAME_LADDERS = [
  { start: 3, end: 22 },
  { start: 5, end: 8 },
  { start: 11, end: 26 },
  { start: 20, end: 29 },
  { start: 27, end: 1 }, // Snake? No, 27->1 is snake.
  // Let's define a clean set
  { start: 4, end: 14 },
  { start: 9, end: 31 },
  { start: 21, end: 42 },
  { start: 28, end: 84 },
  { start: 51, end: 67 },
  { start: 71, end: 91 },
  { start: 80, end: 100 }, // Winner ladder!
];

// Explicit Snakes (Start -> End, where End < Start)
export const GAME_SNAKES = [
  { start: 17, end: 7 },
  { start: 54, end: 34 },
  { start: 62, end: 19 },
  { start: 64, end: 60 },
  { start: 87, end: 24 },
  { start: 93, end: 73 },
  { start: 95, end: 75 },
  { start: 98, end: 79 },
];

export const PLAYER_COLORS = [
  { name: "Red", value: "bg-red-500", border: "border-red-700", text: "text-red-600" },
  { name: "Blue", value: "bg-blue-500", border: "border-blue-700", text: "text-blue-600" },
  { name: "Green", value: "bg-green-500", border: "border-green-700", text: "text-green-600" },
  { name: "Yellow", value: "bg-yellow-400", border: "border-yellow-600", text: "text-yellow-600" },
];
