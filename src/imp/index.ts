import { GameInfo } from './core/GameInfo';
import { NegamaxPlayer } from './players/negamax/NegamaxPlayer';
import { GomokuGame } from './Game';

// Main exports
export { Move } from './core/Move';
export { GameInfo } from './core/GameInfo';
export { GomokuGame } from './Game';
export { NegamaxPlayer } from './players/negamax/NegamaxPlayer';

// Type exports
export { Field } from './players/negamax/Field';
export { State } from './players/negamax/State';
export { Evaluator } from './players/negamax/Evaluator';
export { ThreatUtils } from './players/negamax/ThreatUtils';
export { ThreatPattern } from './players/negamax/ThreatPattern';

// Convenience function for creating AI
export function createAI(boardSize: number = 15, timeout: number = 2000): NegamaxPlayer {
  const gameInfo = new GameInfo(boardSize, timeout);
  return new NegamaxPlayer(gameInfo);
}

// Example usage
if (require.main === module) {
  console.log("Gomoku AI - TypeScript Implementation");
  console.log("=====================================\n");
  
  const game = new GomokuGame(15);
  game.initAI();
  
  // Demo game
  console.log("Starting demo game...\n");
  
  // Human move
  game.makeMove(7, 7);
  game.printBoard();
  
  // AI move
  game.makeAIMove();
  game.printBoard();
  
  // Continue playing...
  game.makeMove(8, 8);
  game.printBoard();
  
  game.makeAIMove();
  game.printBoard();
}
