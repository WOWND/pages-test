// ========================
// Core Types and Interfaces
// ========================
// ========================
// Field Class
// ========================
class Field {
    constructor(row = 0, col = 0, outOfBounds = false) {
        this.row = row;
        this.col = col;
        this.index = outOfBounds ? 3 : 0;
    }
}
// ========================
// Cache Class (LRU Cache)
// ========================
class Cache {
    constructor(maxEntries) {
        this.maxEntries = maxEntries;
        this.cache = new Map();
    }
    get(key) {
        const value = this.cache.get(key);
        if (value !== undefined) {
            // Move to end (most recently used)
            this.cache.delete(key);
            this.cache.set(key, value);
        }
        return value;
    }
    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        else if (this.cache.size >= this.maxEntries) {
            // Remove least recently used (first item)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
    clear() {
        this.cache.clear();
    }
}
// ========================
// ThreatPattern Class
// ========================
class ThreatPattern {
    constructor(pattern, patternSquares) {
        this.pattern = [pattern, this.switchPattern(pattern)];
        this.patternSquares = patternSquares;
    }
    getPattern(playerIndex) {
        return this.pattern[playerIndex - 1];
    }
    getPatternSquares() {
        return this.patternSquares;
    }
    switchPattern(pattern) {
        return pattern.map(val => val === 1 ? 2 : val);
    }
}
// ========================
// ThreatUtils Class
// ========================
class ThreatUtils {
    constructor() {
        this.THREES = [
            new ThreatPattern([0, 1, 1, 1, 0, 0], [0, 4, 5]),
            new ThreatPattern([0, 0, 1, 1, 1, 0], [0, 1, 5]),
            new ThreatPattern([0, 1, 0, 1, 1, 0], [0, 2, 5]),
            new ThreatPattern([0, 1, 1, 0, 1, 0], [0, 3, 5])
        ];
        this.FOURS = [
            new ThreatPattern([1, 1, 1, 1, 0], [4]),
            new ThreatPattern([1, 1, 1, 0, 1], [3]),
            new ThreatPattern([1, 1, 0, 1, 1], [2]),
            new ThreatPattern([1, 0, 1, 1, 1], [1]),
            new ThreatPattern([0, 1, 1, 1, 1], [0])
        ];
        this.REFUTATIONS = [
            new ThreatPattern([1, 1, 1, 0, 0], [3, 4]),
            new ThreatPattern([1, 1, 0, 0, 1], [2, 3]),
            new ThreatPattern([1, 0, 0, 1, 1], [1, 2]),
            new ThreatPattern([0, 0, 1, 1, 1], [0, 1])
        ];
    }
    getThrees(state, field, playerIndex) {
        return this.getThreatMoves(this.THREES, state, field, playerIndex);
    }
    getFours(state, field, playerIndex) {
        return this.getThreatMoves(this.FOURS, state, field, playerIndex);
    }
    getRefutations(state, field, playerIndex) {
        return this.getThreatMoves(this.REFUTATIONS, state, field, playerIndex);
    }
    getThreatMoves(patternList, state, field, playerIndex) {
        const threatMoves = [];
        for (let direction = 0; direction < 4; direction++) {
            const directionArray = state.directions[field.row][field.col][direction];
            for (const pattern of patternList) {
                const patternIndex = this.matchPattern(directionArray, pattern.getPattern(playerIndex));
                if (patternIndex !== -1) {
                    for (const patternSquareIndex of pattern.getPatternSquares()) {
                        const patternSquareField = directionArray[patternIndex + patternSquareIndex];
                        threatMoves.push({
                            row: patternSquareField.row,
                            col: patternSquareField.col
                        });
                    }
                }
            }
        }
        return threatMoves;
    }
    matchPattern(direction, pattern) {
        for (let i = 0; i < direction.length; i++) {
            if (i + pattern.length <= direction.length) {
                let count = 0;
                for (let j = 0; j < pattern.length; j++) {
                    if (direction[i + j].index === pattern[j]) {
                        count++;
                    }
                    else {
                        break;
                    }
                }
                if (count === pattern.length) {
                    return i;
                }
            }
        }
        return -1;
    }
}
// ========================
// Evaluator Class
// ========================
class Evaluator {
    constructor() { }
    static getInstance() {
        if (!Evaluator.instance) {
            Evaluator.instance = new Evaluator();
        }
        return Evaluator.instance;
    }
    evaluateState(state, depth) {
        const playerIndex = state.currentIndex;
        const opponentIndex = playerIndex === 1 ? 2 : 1;
        // Check for terminal positions
        const terminal = state.terminal();
        if (terminal === playerIndex)
            return 10000 + depth;
        if (terminal === opponentIndex)
            return -10000 - depth;
        let score = 0;
        for (let i = 0; i < state.board.length; i++) {
            for (let j = 0; j < state.board[i].length; j++) {
                if (state.board[i][j].index === opponentIndex) {
                    score -= this.evaluateField(state, i, j, opponentIndex);
                }
                else if (state.board[i][j].index === playerIndex) {
                    score += this.evaluateField(state, i, j, playerIndex);
                }
            }
        }
        return score;
    }
    evaluateField(state, row, col, index) {
        let score = 0;
        for (let direction = 0; direction < 4; direction++) {
            score += this.scoreDirection(state.directions[row][col][direction], index);
        }
        return score;
    }
    scoreDirection(direction, index) {
        let score = 0;
        for (let i = 0; i + 4 < direction.length; i++) {
            let empty = 0;
            let stones = 0;
            for (let j = 0; j <= 4; j++) {
                if (direction[i + j].index === 0) {
                    empty++;
                }
                else if (direction[i + j].index === index) {
                    stones++;
                }
                else {
                    break;
                }
            }
            if (empty === 0 || empty === 5)
                continue;
            if (stones + empty === 5) {
                score += Evaluator.SCORES[empty];
            }
        }
        return score;
    }
}
Evaluator.SCORES = [19, 15, 11, 7, 3];
// ========================
// State Class
// ========================
class State {
    constructor(intersections) {
        // Initialize board
        this.board = [];
        for (let i = 0; i < intersections; i++) {
            this.board[i] = [];
            for (let j = 0; j < intersections; j++) {
                this.board[i][j] = new Field(i, j);
            }
        }
        // Initialize directions (4D array)
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
        this.zobristHash = 0;
        this.moveStack = [];
        // Initialize Zobrist keys
        this.zobristKeys = [];
        for (let i = 0; i < 2; i++) {
            this.zobristKeys[i] = [];
            for (let j = 0; j < intersections; j++) {
                this.zobristKeys[i][j] = [];
                for (let k = 0; k < intersections; k++) {
                    // Generate random 32-bit integer for Zobrist hashing
                    // Using smaller numbers to avoid precision issues
                    this.zobristKeys[i][j][k] = Math.floor(Math.random() * 0x7FFFFFFF);
                }
            }
        }
        this.generateDirections();
    }
    getZobristHash() {
        return this.zobristHash;
    }
    makeMove(move) {
        this.moveStack.push(move);
        this.board[move.row][move.col].index = this.currentIndex;
        this.zobristHash ^= this.zobristKeys[this.currentIndex - 1][move.row][move.col];
        this.currentIndex = this.currentIndex === 1 ? 2 : 1;
    }
    undoMove(move) {
        this.moveStack.pop();
        this.zobristHash ^= this.zobristKeys[this.board[move.row][move.col].index - 1][move.row][move.col];
        this.board[move.row][move.col].index = 0;
        this.currentIndex = this.currentIndex === 1 ? 2 : 1;
    }
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
    terminal() {
        if (this.moveStack.length === 0)
            return 0;
        const move = this.moveStack[this.moveStack.length - 1];
        const row = move.row;
        const col = move.col;
        const lastIndex = this.currentIndex === 1 ? 2 : 1;
        // Check if the last move formed a five
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
        // Check if board is full
        return this.moveStack.length === this.board.length * this.board.length ? 3 : 0;
    }
    getMoves() {
        return this.moveStack.length;
    }
    generateDirections() {
        const boardLength = this.board.length;
        for (let row = 0; row < boardLength; row++) {
            for (let col = 0; col < boardLength; col++) {
                // Center position
                this.directions[row][col][0][4] = this.board[row][col];
                this.directions[row][col][1][4] = this.board[row][col];
                this.directions[row][col][2][4] = this.board[row][col];
                this.directions[row][col][3][4] = this.board[row][col];
                for (let k = 0; k < 5; k++) {
                    // Diagonal 1 (top-left to bottom-right)
                    if (row - k >= 0 && col - k >= 0) {
                        this.directions[row][col][0][4 - k] = this.board[row - k][col - k];
                    }
                    else {
                        this.directions[row][col][0][4 - k] = new Field(0, 0, true);
                    }
                    if (row + k < boardLength && col + k < boardLength) {
                        this.directions[row][col][0][4 + k] = this.board[row + k][col + k];
                    }
                    else {
                        this.directions[row][col][0][4 + k] = new Field(0, 0, true);
                    }
                    // Diagonal 2 (top-right to bottom-left)
                    if (row - k >= 0 && col + k < boardLength) {
                        this.directions[row][col][1][4 - k] = this.board[row - k][col + k];
                    }
                    else {
                        this.directions[row][col][1][4 - k] = new Field(0, 0, true);
                    }
                    if (row + k < boardLength && col - k >= 0) {
                        this.directions[row][col][1][4 + k] = this.board[row + k][col - k];
                    }
                    else {
                        this.directions[row][col][1][4 + k] = new Field(0, 0, true);
                    }
                    // Vertical
                    if (row - k >= 0) {
                        this.directions[row][col][2][4 - k] = this.board[row - k][col];
                    }
                    else {
                        this.directions[row][col][2][4 - k] = new Field(0, 0, true);
                    }
                    if (row + k < boardLength) {
                        this.directions[row][col][2][4 + k] = this.board[row + k][col];
                    }
                    else {
                        this.directions[row][col][2][4 + k] = new Field(0, 0, true);
                    }
                    // Horizontal
                    if (col - k >= 0) {
                        this.directions[row][col][3][4 - k] = this.board[row][col - k];
                    }
                    else {
                        this.directions[row][col][3][4 - k] = new Field(0, 0, true);
                    }
                    if (col + k < boardLength) {
                        this.directions[row][col][3][4 + k] = this.board[row][col + k];
                    }
                    else {
                        this.directions[row][col][3][4 + k] = new Field(0, 0, true);
                    }
                }
            }
        }
    }
}
// ========================
// NegamaxPlayer Class (Main AI)
// ========================
class NegamaxPlayer {
    constructor(boardSize) {
        this.reducer = new ThreatUtils();
        this.evaluator = Evaluator.getInstance();
        this.moveTable = new Cache(1000000);
        this.timeLimit = 2000; // 2 seconds
        this.totalNodeCount = 0;
        this.nonLeafCount = 0;
        this.branchesExploredSum = 0;
        this.state = null;
        this.interrupted = false;
    }
    /**
     * Get the best move for the current game state
     */
    getMove(moves, boardSize) {
        // Reset performance counters
        this.totalNodeCount = 0;
        this.nonLeafCount = 0;
        this.branchesExploredSum = 0;
        this.interrupted = false;
        this.moveTable.clear();
        // Create internal state
        this.state = new State(boardSize);
        for (const move of moves) {
            this.state.makeMove(move);
        }
        // Run iterative deepening search
        const bestMove = this.iterativeDeepening(2, 10);
        this.printPerformanceInfo();
        return bestMove;
    }
    /**
     * Cancel the current search
     */
    cancelSearch() {
        this.interrupted = true;
    }
    getSortedMoves(state) {
        // Board is empty, return center move
        if (state.getMoves() === 0) {
            const center = Math.floor(state.board.length / 2);
            return [{ row: center, col: center }];
        }
        const playerIndex = state.currentIndex;
        const opponentIndex = state.currentIndex === 2 ? 1 : 2;
        const fours = new Set();
        const refutations = new Set();
        const opponentFours = new Set();
        const opponentThrees = new Set();
        // Check for threats
        for (let i = 0; i < state.board.length; i++) {
            for (let j = 0; j < state.board.length; j++) {
                if (state.board[i][j].index === opponentIndex) {
                    this.reducer.getFours(state, state.board[i][j], opponentIndex)
                        .forEach(m => opponentFours.add(`${m.row},${m.col}`));
                    this.reducer.getThrees(state, state.board[i][j], opponentIndex)
                        .forEach(m => opponentThrees.add(`${m.row},${m.col}`));
                }
                else if (state.board[i][j].index === playerIndex) {
                    this.reducer.getFours(state, state.board[i][j], playerIndex)
                        .forEach(m => fours.add(`${m.row},${m.col}`));
                    this.reducer.getRefutations(state, state.board[i][j], playerIndex)
                        .forEach(m => refutations.add(`${m.row},${m.col}`));
                }
            }
        }
        // Convert sets back to moves
        const fourMoves = Array.from(fours).map(s => {
            const [row, col] = s.split(',').map(Number);
            return { row, col };
        });
        const opponentFourMoves = Array.from(opponentFours).map(s => {
            const [row, col] = s.split(',').map(Number);
            return { row, col };
        });
        // Priority: our fours > opponent fours > opponent threes + refutations
        if (fourMoves.length > 0)
            return fourMoves;
        if (opponentFourMoves.length > 0)
            return opponentFourMoves;
        if (opponentThrees.size > 0) {
            // Combine opponent threes with refutations
            refutations.forEach(r => opponentThrees.add(r));
            return Array.from(opponentThrees).map(s => {
                const [row, col] = s.split(',').map(Number);
                return { row, col };
            });
        }
        // Get all valid moves with scores
        const scoredMoves = [];
        const entry = this.moveTable.get(state.getZobristHash());
        for (let i = 0; i < state.board.length; i++) {
            for (let j = 0; j < state.board.length; j++) {
                // Skip hash move for now
                if (entry && i === entry.move.row && j === entry.move.col) {
                    continue;
                }
                if (state.board[i][j].index === 0 && state.hasAdjacent(i, j, 2)) {
                    const score = this.evaluator.evaluateField(state, i, j, state.currentIndex);
                    scoredMoves.push({ move: { row: i, col: j }, score });
                }
            }
        }
        // Sort by score (highest first)
        scoredMoves.sort((a, b) => b.score - a.score);
        return scoredMoves.map(sm => sm.move);
    }
    negamax(state, depth, alpha, beta) {
        this.totalNodeCount++;
        // Check for timeout or interruption
        if (this.interrupted || (Date.now() - this.startTime) > this.timeLimit) {
            throw new Error("Search interrupted");
        }
        // Terminal node or depth limit reached
        if (state.terminal() !== 0 || depth === 0) {
            return this.evaluator.evaluateState(state, depth);
        }
        this.nonLeafCount++;
        let best = Number.MIN_SAFE_INTEGER;
        let bestMove = null;
        let count = 0;
        // Try hash move first
        const hashMoveEntry = this.moveTable.get(state.getZobristHash());
        if (hashMoveEntry) {
            count++;
            state.makeMove(hashMoveEntry.move);
            const value = -this.negamax(state, depth - 1, -beta, -alpha);
            state.undoMove(hashMoveEntry.move);
            if (value > best) {
                bestMove = hashMoveEntry.move;
                best = value;
            }
            if (best > alpha)
                alpha = best;
            if (best >= beta)
                return best;
        }
        // Get sorted moves
        const moves = this.getSortedMoves(state);
        for (const move of moves) {
            count++;
            state.makeMove(move);
            const value = -this.negamax(state, depth - 1, -beta, -alpha);
            state.undoMove(move);
            if (value > best) {
                bestMove = move;
                best = value;
            }
            if (best > alpha)
                alpha = best;
            if (best >= beta)
                break;
        }
        this.branchesExploredSum += count;
        if (bestMove) {
            this.putMoveEntry(state.getZobristHash(), bestMove, depth);
        }
        return best;
    }
    putMoveEntry(key, move, depth) {
        const moveEntry = this.moveTable.get(key);
        if (!moveEntry || depth > moveEntry.depth) {
            this.moveTable.put(key, { move, depth });
        }
    }
    searchMoves(state, moves, depth) {
        const scoredMoves = moves.map(move => ({
            move,
            score: Number.MIN_SAFE_INTEGER
        }));
        let alpha = -11000;
        const beta = 11000;
        let best = Number.MIN_SAFE_INTEGER;
        for (const scoredMove of scoredMoves) {
            state.makeMove(scoredMove.move);
            try {
                scoredMove.score = -this.negamax(state, depth - 1, -beta, -alpha);
            }
            catch (e) {
                state.undoMove(scoredMove.move);
                throw e;
            }
            state.undoMove(scoredMove.move);
            if (scoredMove.score > best)
                best = scoredMove.score;
            if (best > alpha)
                alpha = best;
            if (best >= beta)
                break;
        }
        // Sort by score (highest first)
        scoredMoves.sort((a, b) => b.score - a.score);
        console.log(`Depth: ${depth}, Best move: (${scoredMoves[0].move.row}, ${scoredMoves[0].move.col}), Score: ${scoredMoves[0].score}`);
        return scoredMoves.map(sm => sm.move);
    }
    iterativeDeepening(startDepth, endDepth) {
        if (!this.state)
            return null;
        this.startTime = Date.now();
        let moves = this.getSortedMoves(this.state);
        if (moves.length === 0)
            return null;
        if (moves.length === 1)
            return moves[0];
        for (let i = startDepth; i <= endDepth; i++) {
            try {
                moves = this.searchMoves(this.state, moves, i);
            }
            catch (e) {
                console.log(`Search interrupted at depth ${i}`);
                break;
            }
        }
        return moves[0];
    }
    printPerformanceInfo() {
        if (this.totalNodeCount > 0) {
            const duration = Date.now() - this.startTime;
            const nodesPerMs = this.totalNodeCount / (duration > 0 ? duration : 1);
            const avgBranches = this.branchesExploredSum / (this.nonLeafCount || 1);
            console.log(`Time: ${duration}ms`);
            console.log(`Nodes: ${this.totalNodeCount}`);
            console.log(`Nodes/ms: ${nodesPerMs.toFixed(2)}`);
            console.log(`Branches explored (avg): ${avgBranches.toFixed(2)}`);
        }
    }
}
// ========================
// Usage Example / Exports
// ========================
// Export the main AI class and types
export { NegamaxPlayer, State, Field };
// Example usage:
function exampleUsage() {
    const boardSize = 15; // 15x15 Gomoku board
    const ai = new NegamaxPlayer(boardSize);
    // Example game moves (alternating between players)
    const gameMoves = [
        { row: 7, col: 7 }, // Player 1
        { row: 7, col: 8 }, // Player 2
        { row: 8, col: 7 }, // Player 1
        { row: 6, col: 8 }, // Player 2
    ];
    // Get AI's best move
    const bestMove = ai.getMove(gameMoves, boardSize);
    if (bestMove) {
        console.log(`AI recommends: row=${bestMove.row}, col=${bestMove.col}`);
    }
    else {
        console.log("No valid move found");
    }
}
export function createAI(boardSize = 15) {
    const player = new NegamaxPlayer(boardSize);
    return {
        getMove: (moves, size) => player.getMove(moves, size),
        cancelSearch: () => player.cancelSearch()
    };
}
//# sourceMappingURL=gomoku-ai.js.map