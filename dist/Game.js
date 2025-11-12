import { Move } from './core/Move.js';
import { GameInfo } from './core/GameInfo.js';
import { NegamaxPlayer } from './players/negamax/NegamaxPlayer.js';
/**
 * Main Gomoku Game class
 */
export class GomokuGame {
    // 2000ms -> 5000ms로 수정
    constructor(boardSize = 15, aiTimeout = 5000) {
        this.boardSize = boardSize;
        this.board = this.createEmptyBoard();
        this.currentPlayer = 1;
        this.moves = [];
        this.gameOver = false;
        this.winner = 0;
        this.gameInfo = new GameInfo(boardSize, aiTimeout);
        this.ai = null;
    }
    /**
     * Initialize AI player
     */
    initAI() {
        this.ai = new NegamaxPlayer(this.gameInfo);
        console.log("=================");
    }
    /**
     * Create empty board
     */
    createEmptyBoard() {
        const board = [];
        for (let i = 0; i < this.boardSize; i++) {
            board[i] = new Array(this.boardSize).fill(0);
        }
        return board;
    }
    /**
     * Make a move on the board
     */
    makeMove(row, col) {
        if (this.gameOver) {
            return false;
        }
        if (!this.isValidMove(row, col)) {
            return false;
        }
        // Place the stone
        this.board[row][col] = this.currentPlayer;
        this.moves.push(new Move(row, col));
        // Check for win
        if (this.checkWin(row, col)) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
            return true;
        }
        // Check for draw
        if (this.moves.length === this.boardSize * this.boardSize) {
            this.gameOver = true;
            this.winner = 0;
            return true;
        }
        // Switch player
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        return true;
    }
    /**
     * Get AI move
     */
    getAIMove() {
        if (!this.ai) {
            console.error("AI not initialized!");
            return null;
        }
        console.log("AI is computing move...");
        const startTime = performance.now();
        // AI가 현재 moves 리스트를 기반으로 수를 계산합니다.
        const move = this.ai.getMove(this.moves);
        const elapsed = performance.now() - startTime;
        console.log(`AI computed move in ${elapsed.toFixed(0)}ms`);
        return move;
    }
    /**
     * Make AI move automatically
     */
    makeAIMove() {
        const move = this.getAIMove();
        if (move) {
            console.log(`AI plays at ${move.toString()}`);
            return this.makeMove(move.row, move.col);
        }
        return false;
    }
    /**
     * Check if move is valid
     */
    isValidMove(row, col) {
        return row >= 0 && row < this.boardSize &&
            col >= 0 && col < this.boardSize &&
            this.board[row][col] === 0;
    }
    /**
     * Check if current player wins with the last move
     */
    checkWin(row, col) {
        const player = this.board[row][col];
        // Check all 4 directions
        const directions = [
            [[0, 1], [0, -1]], // Horizontal
            [[1, 0], [-1, 0]], // Vertical
            [[1, 1], [-1, -1]], // Diagonal \
            [[1, -1], [-1, 1]] // Diagonal /
        ];
        for (const direction of directions) {
            let count = 1;
            for (const [dr, dc] of direction) {
                let r = row + dr;
                let c = col + dc;
                while (r >= 0 && r < this.boardSize &&
                    c >= 0 && c < this.boardSize &&
                    this.board[r][c] === player) {
                    count++;
                    r += dr;
                    c += dc;
                }
            }
            if (count >= 5) {
                return true;
            }
        }
        return false;
    }
    /**
     * Print board to console
     */
    printBoard() {
        console.log("\n   ", Array.from({ length: this.boardSize }, (_, i) => i.toString().padStart(2, ' ')).join(' '));
        for (let i = 0; i < this.boardSize; i++) {
            const row = this.board[i].map(cell => {
                if (cell === 0)
                    return ' ·';
                if (cell === 1)
                    return ' ●';
                return ' ○';
            }).join('');
            console.log(i.toString().padStart(2, ' ') + ' ' + row);
        }
        console.log();
    }
    // Getters
    getBoard() {
        return this.board.map(row => [...row]);
    }
    getCurrentPlayer() {
        return this.currentPlayer;
    }
    isGameOver() {
        return this.gameOver;
    }
    getWinner() {
        return this.winner;
    }
    getMoves() {
        return [...this.moves];
    }
    reset() {
        this.board = this.createEmptyBoard();
        this.currentPlayer = 1;
        this.moves = [];
        this.gameOver = false;
        this.winner = 0;
    }
}
//# sourceMappingURL=Game.js.map