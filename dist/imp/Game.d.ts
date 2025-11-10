import { Move } from './core/Move';
/**
 * Main Gomoku Game class
 */
export declare class GomokuGame {
    private board;
    private boardSize;
    private currentPlayer;
    private moves;
    private gameOver;
    private winner;
    private ai;
    private gameInfo;
    constructor(boardSize?: number, aiTimeout?: number);
    /**
     * Initialize AI player
     */
    initAI(): void;
    /**
     * Create empty board
     */
    private createEmptyBoard;
    /**
     * Make a move on the board
     */
    makeMove(row: number, col: number): boolean;
    /**
     * Get AI move
     */
    getAIMove(): Move | null;
    /**
     * Make AI move automatically
     */
    makeAIMove(): boolean;
    /**
     * Check if move is valid
     */
    private isValidMove;
    /**
     * Check if current player wins with the last move
     */
    private checkWin;
    /**
     * Print board to console
     */
    printBoard(): void;
    getBoard(): number[][];
    getCurrentPlayer(): number;
    isGameOver(): boolean;
    getWinner(): number;
    getMoves(): Move[];
    reset(): void;
}
//# sourceMappingURL=Game.d.ts.map