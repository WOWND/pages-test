/**
 * Represents a pattern on the Gomoku board, usually for a threat such as a
 * four or a three (OXXXX and OOXXXO).
 */
export declare class ThreatPattern {
    private pattern;
    private patternSquares;
    /**
     * Create a new threat pattern.
     * @param pattern Pattern represented as a 1D array, where 0 is an
     *                empty space and 1 refers to a stone being present
     * @param patternSquares The offensive/defensive squares of the
     *                       threat, i.e. the indices of all 0's in the
     *                       pattern array
     */
    constructor(pattern: number[], patternSquares: number[]);
    /**
     * Get the pattern from the perspective of a player.
     * @param playerIndex Player identifier (1 or 2)
     * @return Pattern array
     */
    getPattern(playerIndex: number): number[];
    /**
     * Return the offensive/defensive square indices in the pattern.
     * @return int[] containing all the square indices
     */
    getPatternSquares(): number[];
    /**
     * Convert an input pattern to player 2's perspective.
     * @param pattern Input pattern array
     * @return Same array with every 1 turned into a 2
     */
    private switchPattern;
}
//# sourceMappingURL=ThreatPattern.d.ts.map