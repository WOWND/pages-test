import { State } from './State';
/**
 * Evaluation function for Gomoku board positions
 */
export declare class Evaluator {
    private static instance;
    private static readonly SCORES;
    private constructor();
    /**
     * Get the evaluator instance
     */
    static getInstance(): Evaluator;
    /**
     * Given some array representing a direction on the board,
     * calculate a score based on how many possible fives can be formed
     */
    private scoreDirection;
    /**
     * Evaluate a state from the perspective of the current player
     */
    evaluateState(state: State, depth: number): number;
    /**
     * Evaluate a specific field on the board
     */
    evaluateField(state: State, row: number, col: number, index: number): number;
}
//# sourceMappingURL=Evaluator.d.ts.map