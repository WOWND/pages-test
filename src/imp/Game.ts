import { Move } from './core/Move';
import { GameInfo } from './core/GameInfo';
import { NegamaxPlayer } from './players/negamax/NegamaxPlayer';

/**
 * Main Gomoku Game class
 */
export class GomokuGame {
  private board: number[][];
  private boardSize: number;
  private currentPlayer: number;
  private moves: Move[];
  private gameOver: boolean;
  private winner: number;
  private ai: NegamaxPlayer | null;
  private gameInfo: GameInfo;

  constructor(boardSize: number = 15, aiTimeout: number = 2000) {
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
  initAI(): void {
    this.ai = new NegamaxPlayer(this.gameInfo);
  }

  /**
   * Create empty board
   */
  private createEmptyBoard(): number[][] {
    const board: number[][] = [];
    for (let i = 0; i < this.boardSize; i++) {
      board[i] = new Array(this.boardSize).fill(0);
    }
    return board;
  }

  /**
   * Make a move on the board
   */
  makeMove(row: number, col: number): boolean {
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
  getAIMove(): Move | null {
    if (!this.ai) {
      console.error("AI not initialized!");
      return null;
    }

    console.log("AI is computing move...");
    const startTime = performance.now();
    
    const move = this.ai.getMove(this.moves);
    
    const elapsed = performance.now() - startTime;
    console.log(`AI computed move in ${elapsed.toFixed(0)}ms`);
    
    return move;
  }

  /**
   * Make AI move automatically
   */
  makeAIMove(): boolean {
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
  private isValidMove(row: number, col: number): boolean {
    return row >= 0 && row < this.boardSize &&
           col >= 0 && col < this.boardSize &&
           this.board[row][col] === 0;
  }

  /**
   * Check if current player wins with the last move
   */
  private checkWin(row: number, col: number): boolean {
    const player = this.board[row][col];
    
    // Check all 4 directions
    const directions = [
      [[0, 1], [0, -1]],   // Horizontal
      [[1, 0], [-1, 0]],   // Vertical
      [[1, 1], [-1, -1]],  // Diagonal \
      [[1, -1], [-1, 1]]   // Diagonal /
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
  printBoard(): void {
    console.log("\n   ", Array.from({ length: this.boardSize }, (_, i) => 
      i.toString().padStart(2, ' ')).join(' '));
    
    for (let i = 0; i < this.boardSize; i++) {
      const row = this.board[i].map(cell => {
        if (cell === 0) return ' ·';
        if (cell === 1) return ' ●';
        return ' ○';
      }).join('');
      console.log(i.toString().padStart(2, ' ') + ' ' + row);
    }
    console.log();
  }

  // Getters
  getBoard(): number[][] {
    return this.board.map(row => [...row]);
  }

  getCurrentPlayer(): number {
    return this.currentPlayer;
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  getWinner(): number {
    return this.winner;
  }

  getMoves(): Move[] {
    return [...this.moves];
  }

  reset(): void {
    this.board = this.createEmptyBoard();
    this.currentPlayer = 1;
    this.moves = [];
    this.gameOver = false;
    this.winner = 0;
  }
}
