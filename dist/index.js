import { GameInfo } from './core/GameInfo.js';
import { NegamaxPlayer } from './players/negamax/NegamaxPlayer.js';
// Main exports
export { Move } from './core/Move.js';
export { GameInfo } from './core/GameInfo.js';
export { GomokuGame } from './Game.js';
export { NegamaxPlayer } from './players/negamax/NegamaxPlayer.js';
// Type exports
export { Field } from './players/negamax/Field.js';
export { State } from './players/negamax/State.js';
export { Evaluator } from './players/negamax/Evaluator.js';
export { ThreatUtils } from './players/negamax/ThreatUtils.js';
export { ThreatPattern } from './players/negamax/ThreatPattern.js';
// Convenience function for creating AI
export function createAI(boardSize = 15, timeout = 20000) {
    const gameInfo = new GameInfo(boardSize, timeout);
    return new NegamaxPlayer(gameInfo);
}
//# sourceMappingURL=index.js.map