import { Field } from './Field';
/**
 * Internal game state representation for the AI.
 */
export class State {
    /**
     * Create a new state.
     * @param intersections Number of intersections on the board
     */
    constructor(intersections) {
        this.board = [];
        for (let i = 0; i < intersections; i++) {
            this.board[i] = [];
            for (let j = 0; j < intersections; j++) {
                this.board[i][j] = new Field(i, j);
            }
        }
        this.directions = [];
        for (let i = 0; i < intersections; i++) {
            this.directions[i] = [];
            for (let j = 0; j < intersections; j++) {
                this.directions[i][j] = [];
                for (let k = 0; k < 4; k++) {
                    this.directions[i][j][k] = new Array(9);
                }
            }
        }
        this.currentIndex = 1;
        this.zobristKeys = [];
        this.zobristHash = 0;
        this.moveStack = [];
        // Generate Zobrist keys
        for (let i = 0; i < 2; i++) {
            this.zobristKeys[i] = [];
            for (let j = 0; j < intersections; j++) {
                this.zobristKeys[i][j] = [];
                for (let k = 0; k < intersections; k++) {
                    this.zobristKeys[i][j][k] = Math.floor(Math.random() * 0x7FFFFFFF);
                }
            }
        }
        this.generateDirections(this.board);
    }
    /**
     * Return the Zobrist hash for this state
     */
    getZobristHash() {
        return this.zobristHash;
    }
    /**
     * Apply a move to this state.
     */
    makeMove(move) {
        this.moveStack.push(move);
        this.board[move.row][move.col].index = this.currentIndex;
        this.zobristHash ^= this.zobristKeys[this.board[move.row][move.col].index - 1][move.row][move.col];
        this.currentIndex = this.currentIndex === 1 ? 2 : 1;
    }
    /**
     * Undo a move on this state.
     */
    undoMove(move) {
        this.moveStack.pop();
        this.zobristHash ^= this.zobristKeys[this.board[move.row][move.col].index - 1][move.row][move.col];
        this.board[move.row][move.col].index = 0;
        this.currentIndex = this.currentIndex === 1 ? 2 : 1;
    }
    /**
     * Return whether or not this field has occupied fields around it
     */
    hasAdjacent(row, col, distance) {
        for (let i = 0; i < 4; i++) {
            for (let j = 1; j <= distance; j++) {
                if (this.directions[row][col][i][4 + j].index === 1 ||
                    this.directions[row][col][i][4 - j].index === 1 ||
                    this.directions[row][col][i][4 + j].index === 2 ||
                    this.directions[row][col][i][4 - j].index === 2) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Generate the 4D board directions array
     */
    generateDirections(board) {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board.length; col++) {
                this.directions[row][col][0][4] = board[row][col];
                this.directions[row][col][1][4] = board[row][col];
                this.directions[row][col][2][4] = board[row][col];
                this.directions[row][col][3][4] = board[row][col];
                for (let k = 0; k < 5; k++) {
                    // Diagonal 1, top left
                    if (row - k >= 0 && col - k >= 0) {
                        this.directions[row][col][0][4 - k] = board[row - k][col - k];
                    }
                    else {
                        this.directions[row][col][0][4 - k] = new Field();
                    }
                    // Diagonal 1, bottom right
                    if (row + k < board.length && col + k < board.length) {
                        this.directions[row][col][0][4 + k] = board[row + k][col + k];
                    }
                    else {
                        this.directions[row][col][0][4 + k] = new Field();
                    }
                    // Diagonal 2, top right
                    if (row - k >= 0 && col + k < board.length) {
                        this.directions[row][col][1][4 - k] = board[row - k][col + k];
                    }
                    else {
                        this.directions[row][col][1][4 - k] = new Field();
                    }
                    // Diagonal 2, bottom left
                    if (row + k < board.length && col - k >= 0) {
                        this.directions[row][col][1][4 + k] = board[row + k][col - k];
                    }
                    else {
                        this.directions[row][col][1][4 + k] = new Field();
                    }
                    // Vertical top
                    if (row - k >= 0) {
                        this.directions[row][col][2][4 - k] = board[row - k][col];
                    }
                    else {
                        this.directions[row][col][2][4 - k] = new Field();
                    }
                    // Vertical bottom
                    if (row + k < board.length) {
                        this.directions[row][col][2][4 + k] = board[row + k][col];
                    }
                    else {
                        this.directions[row][col][2][4 + k] = new Field();
                    }
                    // Horizontal left
                    if (col - k >= 0) {
                        this.directions[row][col][3][4 - k] = board[row][col - k];
                    }
                    else {
                        this.directions[row][col][3][4 - k] = new Field();
                    }
                    // Horizontal right
                    if (col + k < board.length) {
                        this.directions[row][col][3][4 + k] = board[row][col + k];
                    }
                    else {
                        this.directions[row][col][3][4 + k] = new Field();
                    }
                }
            }
        }
    }
    /**
     * Determine if this state is terminal
     */
    terminal() {
        if (this.moveStack.length === 0)
            return 0;
        const move = this.moveStack[this.moveStack.length - 1];
        const row = move.row;
        const col = move.col;
        const lastIndex = this.currentIndex === 1 ? 2 : 1;
        // Check around the last move placed to see if it formed a five
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 6; j++) {
                if (this.directions[row][col][i][j].index === lastIndex) {
                    let count = 0;
                    for (let k = 1; k < 5; k++) {
                        if (this.directions[row][col][i][j + k].index === lastIndex) {
                            count++;
                        }
                        else {
                            break;
                        }
                    }
                    if (count === 4)
                        return lastIndex;
                }
            }
        }
        return this.moveStack.length === this.board.length * this.board.length ? 3 : 0;
    }
    /**
     * Get the total number of moves made on this state
     */
    getMoves() {
        return this.moveStack.length;
    }
    /**
     * Get a field instance on the board at a given row/col position
     */
    getField(row, col) {
        return this.board[row][col];
    }
}
//# sourceMappingURL=State.js.map