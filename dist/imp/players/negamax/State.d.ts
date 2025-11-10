import { Field } from './Field';
import { Move } from '../../core/Move';
/**
 * Internal game state representation for the AI.
 */
export declare class State {
    readonly board: Field[][];
    readonly directions: Field[][][][];
    currentIndex: number;
    private zobristHash;
    private readonly zobristKeys;
    private moveStack;
    /**
     * Create a new state.
     * @param intersections Number of intersections on the board
     */
    constructor(intersections: number);
    /**
     * Return the Zobrist hash for this state
     */
    getZobristHash(): number;
    /**
     * Apply a move to this state.
     */
    makeMove(move: Move): void;
    /**
     * Undo a move on this state.
     */
    undoMove(move: Move): void;
    /**
     * Return whether or not this field has occupied fields around it
     */
    hasAdjacent(row: number, col: number, distance: number): boolean;
    /**
     * Generate the 4D board directions array
     */
    private generateDirections;
    /**
     * Determine if this state is terminal
     */
    terminal(): number;
    /**
     * Get the total number of moves made on this state
     */
    getMoves(): number;
    /**
     * Get a field instance on the board at a given row/col position
     */
    getField(row: number, col: number): Field;
}
//# sourceMappingURL=State.d.ts.map