import { State } from './State';
import { Field } from './Field';

/**
 * Evaluation function for Gomoku board positions
 */
export class Evaluator {
  private static instance: Evaluator;
  private static readonly SCORES = [19, 15, 11, 7, 3];

  private constructor() {}

  /**
   * Get the evaluator instance
   */
  static getInstance(): Evaluator {
    if (!Evaluator.instance) {
      Evaluator.instance = new Evaluator();
    }
    return Evaluator.instance;
  }

  /**
   * Given some array representing a direction on the board, 
   * calculate a score based on how many possible fives can be formed
   */
  private scoreDirection(direction: Field[], index: number): number {
    let score = 0;

    // Pass a window of 5 across the field array
    for (let i = 0; (i + 4) < direction.length; i++) {
      let empty = 0;
      let stones = 0;
      let blocked = false;
      
      for (let j = 0; j <= 4; j++) {
        if (direction[i + j].index === 0) {
          empty++;
        } else if (direction[i + j].index === index) {
          stones++;
        } else {
          // Opponent stone or out of bounds
          blocked = true;
          break;
        }
      }
      
      // Skip if blocked, already formed five, or empty window
      if (blocked || empty === 0 || empty === 5) {
        continue;
      }

      // Window contains only empty spaces and player stones
      if (stones + empty === 5) {
        score += Evaluator.SCORES[empty];
      }
    }
    return score;
  }

  /**
   * Evaluate a state from the perspective of the current player
   */
  evaluateState(state: State, depth: number): number {
    const playerIndex = state.currentIndex;
    const opponentIndex = playerIndex === 1 ? 2 : 1;

    // Check for a winning/losing position
    const terminal = state.terminal();
    if (terminal === playerIndex) return 10000 + depth;
    if (terminal === opponentIndex) return -10000 - depth;
    if (terminal === 3) return 0; // Draw

    // Evaluate each field separately
    let score = 0;
    for (let i = 0; i < state.board.length; i++) {
      for (let j = 0; j < state.board.length; j++) {
        if (state.board[i][j].index === opponentIndex) {
          score -= this.evaluateField(state, i, j, opponentIndex);
        } else if (state.board[i][j].index === playerIndex) {
          score += this.evaluateField(state, i, j, playerIndex);
        }
      }
    }
    return score;
  }

  /**
   * Evaluate a specific field on the board
   */
  evaluateField(state: State, row: number, col: number, index: number): number {
    let score = 0;
    for (let direction = 0; direction < 4; direction++) {
      score += this.scoreDirection(
        state.directions[row][col][direction],
        index
      );
    }
    return score;
  }
}
