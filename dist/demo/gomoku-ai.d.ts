interface Move {
    row: number;
    col: number;
}
declare class Field {
    readonly row: number;
    readonly col: number;
    index: number;
    constructor(row?: number, col?: number, outOfBounds?: boolean);
}
declare class State {
    board: Field[][];
    directions: Field[][][][];
    currentIndex: number;
    private zobristHash;
    private zobristKeys;
    private moveStack;
    constructor(intersections: number);
    getZobristHash(): number;
    makeMove(move: Move): void;
    undoMove(move: Move): void;
    hasAdjacent(row: number, col: number, distance: number): boolean;
    terminal(): number;
    getMoves(): number;
    private generateDirections;
}
declare class NegamaxPlayer {
    private reducer;
    private evaluator;
    private moveTable;
    private timeLimit;
    private startTime;
    private totalNodeCount;
    private nonLeafCount;
    private branchesExploredSum;
    private state;
    private interrupted;
    constructor(boardSize: number);
    /**
     * Get the best move for the current game state
     */
    getMove(moves: Move[], boardSize: number): Move | null;
    /**
     * Cancel the current search
     */
    cancelSearch(): void;
    private getSortedMoves;
    private negamax;
    private putMoveEntry;
    private searchMoves;
    private iterativeDeepening;
    private printPerformanceInfo;
}
export { NegamaxPlayer, Move, State, Field };
export interface GomokuAI {
    getMove(moves: Move[], boardSize: number): Move | null;
    cancelSearch(): void;
}
export declare function createAI(boardSize?: number): GomokuAI;
//# sourceMappingURL=gomoku-ai.d.ts.map