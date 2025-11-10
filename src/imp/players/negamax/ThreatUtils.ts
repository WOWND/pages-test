import { Move } from '../../core/Move';
import { State } from './State';
import { Field } from './Field';
import { ThreatPattern } from './ThreatPattern';

/**
 * Used to search for threats in a Gomoku game
 */
export class ThreatUtils {
  private REFUTATIONS: ThreatPattern[];
  private THREES: ThreatPattern[];
  private FOURS: ThreatPattern[];

  constructor() {
    this.THREES = [];
    this.FOURS = [];
    this.REFUTATIONS = [];

    // Three patterns (straight three and broken three)
    this.THREES.push(new ThreatPattern([0, 1, 1, 1, 0, 0], [0, 4, 5]));
    this.THREES.push(new ThreatPattern([0, 0, 1, 1, 1, 0], [0, 1, 5]));
    this.THREES.push(new ThreatPattern([0, 1, 0, 1, 1, 0], [0, 2, 5]));
    this.THREES.push(new ThreatPattern([0, 1, 1, 0, 1, 0], [0, 3, 5]));

    // Four patterns
    this.FOURS.push(new ThreatPattern([1, 1, 1, 1, 0], [4]));
    this.FOURS.push(new ThreatPattern([1, 1, 1, 0, 1], [3]));
    this.FOURS.push(new ThreatPattern([1, 1, 0, 1, 1], [2]));
    this.FOURS.push(new ThreatPattern([1, 0, 1, 1, 1], [1]));
    this.FOURS.push(new ThreatPattern([0, 1, 1, 1, 1], [0]));

    // Refutation patterns
    this.REFUTATIONS.push(new ThreatPattern([1, 1, 1, 0, 0], [3, 4]));
    this.REFUTATIONS.push(new ThreatPattern([1, 1, 0, 0, 1], [2, 3]));
    this.REFUTATIONS.push(new ThreatPattern([1, 0, 0, 1, 1], [1, 2]));
    this.REFUTATIONS.push(new ThreatPattern([0, 0, 1, 1, 1], [0, 1]));
  }

  /**
   * Check a field for a broken three or a straight three pattern
   */
  getThrees(state: State, field: Field, playerIndex: number): Move[] {
    return this.getThreatMoves(this.THREES, state, field, playerIndex);
  }

  /**
   * Check a field for a four pattern
   */
  getFours(state: State, field: Field, playerIndex: number): Move[] {
    return this.getThreatMoves(this.FOURS, state, field, playerIndex);
  }
  
  /**
   * Check a field for a pattern which can turn into a four
   */
  getRefutations(state: State, field: Field, playerIndex: number): Move[] {
    return this.getThreatMoves(this.REFUTATIONS, state, field, playerIndex);
  }

  /**
   * Search for threats around a field in a game state
   */
  private getThreatMoves(
    patternList: ThreatPattern[], 
    state: State, 
    field: Field, 
    playerIndex: number
  ): Move[] {
    const threatMoves: Move[] = [];
    
    // Loop around the field in every direction
    for (let direction = 0; direction < 4; direction++) {
      const directionArray = state.directions[field.row][field.col][direction];
      
      for (const pattern of patternList) {
        // Try to find the pattern
        const patternIndex = this.matchPattern(
          directionArray, 
          pattern.getPattern(playerIndex)
        );
        
        if (patternIndex !== -1) {
          // Found pattern, get the squares in the pattern
          for (const patternSquareIndex of pattern.getPatternSquares()) {
            const patternSquareField = directionArray[patternIndex + patternSquareIndex];
            threatMoves.push(new Move(patternSquareField.row, patternSquareField.col));
          }
        }
      }
    }
    
    return threatMoves;
  }

  /**
   * Search for a pattern in a field array
   */
  private matchPattern(direction: Field[], pattern: number[]): number {
    for (let i = 0; i < direction.length; i++) {
      // Check if the pattern lies within the bounds of the direction
      if (i + (pattern.length - 1) < direction.length) {
        let count = 0;
        for (let j = 0; j < pattern.length; j++) {
          if (direction[i + j].index === pattern[j]) {
            count++;
          } else {
            break;
          }
        }
        // Every element was the same, return the start index
        if (count === pattern.length) {
          return i;
        }
      } else {
        break;
      }
    }
    return -1;
  }
}
