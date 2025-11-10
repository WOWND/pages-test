import { GameInfo } from '../../core/GameInfo';
import { Move } from '../../core/Move';
/**
 * Negamax player with alpha-beta pruning and further optimisations
 */
export declare class NegamaxPlayer {
    private reducer;
    private evaluator;
    private moveTable;
    private time;
    private startTime;
    private totalNodeCount;
    private nonLeafCount;
    private branchesExploredSum;
    private state;
    private info;
    private interrupted;
    constructor(info: GameInfo);
    /**
     * Generate a list of sorted and pruned moves for this state
     */
    private getSortedMoves;
    /**
     * Run the negamax algorithm for a node in the game tree
     */
    private negamax;
    /**
     * Place the best move found from a state into the hash table
     */
    private putMoveEntry;
    /**
     * Run a depth-limited negamax search on a set of moves
     */
    private searchMoves;
    /**
     * Run negamax for an increasing depth
     */
    private iterativeDeepening;
    /**
     * Get the best move for the current game state
     */
    getMove(moves: Move[]): Move | null;
    /**
     * Cancel the current search
     */
    cancelSearch(): void;
    /**
     * Print performance information
     */
    private printPerformanceInfo;
    /**
     * Print the result of a search
     */
    private printSearchInfo;
}
//# sourceMappingURL=NegamaxPlayer.d.ts.map