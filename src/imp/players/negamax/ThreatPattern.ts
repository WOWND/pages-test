/**
 * Represents a pattern on the Gomoku board, usually for a threat such as a
 * four or a three (OXXXX and OOXXXO).
 */
export class ThreatPattern {
  private pattern: number[][];
  private patternSquares: number[];

  /**
   * Create a new threat pattern.
   * @param pattern Pattern represented as a 1D array, where 0 is an
   *                empty space and 1 refers to a stone being present
   * @param patternSquares The offensive/defensive squares of the
   *                       threat, i.e. the indices of all 0's in the
   *                       pattern array
   */
  constructor(pattern: number[], patternSquares: number[]) {
    // Store the pattern from each players perspective in pattern[][]
    this.pattern = [pattern, this.switchPattern(pattern)];
    this.patternSquares = patternSquares;
  }

  /**
   * Get the pattern from the perspective of a player.
   * @param playerIndex Player identifier (1 or 2)
   * @return Pattern array
   */
  getPattern(playerIndex: number): number[] {
    return this.pattern[playerIndex - 1];
  }

  /**
   * Return the offensive/defensive square indices in the pattern.
   * @return int[] containing all the square indices
   */
  getPatternSquares(): number[] {
    return this.patternSquares;
  }

  /**
   * Convert an input pattern to player 2's perspective.
   * @param pattern Input pattern array
   * @return Same array with every 1 turned into a 2
   */
  private switchPattern(pattern: number[]): number[] {
    const patternSwitched = new Array(pattern.length).fill(0);
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === 1) {
        patternSwitched[i] = 2;
      } else {
        patternSwitched[i] = pattern[i];
      }
    }
    return patternSwitched;
  }
}
