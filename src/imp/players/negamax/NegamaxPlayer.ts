import { GameInfo } from '../../core/GameInfo.js';
import { Move } from '../../core/Move.js';
import { State } from './State.js';
import { ThreatUtils } from './ThreatUtils.js';
import { Evaluator } from './Evaluator.js';
import { Cache } from './Cache.js';

interface MoveEntry {
  move: Move;
  depth: number;
}

interface ScoredMove {
  move: Move;
  score: number;
}

/**
 * Negamax player with alpha-beta pruning and further optimisations
 */
export class NegamaxPlayer {
  private reducer: ThreatUtils;
  private evaluator: Evaluator;
  private moveTable: Cache<number, MoveEntry>;
  
  private time: number; // nanoseconds
  private startTime: number;
  
  private totalNodeCount: number;
  private nonLeafCount: number;
  private branchesExploredSum: number;
  
  private state: State | null;
  private info: GameInfo;
  private interrupted: boolean;

  constructor(info: GameInfo) {
    this.info = info;
    this.reducer = new ThreatUtils();
    this.evaluator = Evaluator.getInstance();
    this.time = info.getTimeout() * 1000000; // Convert ms to ns
    this.moveTable = new Cache<number, MoveEntry>(1000000);
    this.totalNodeCount = 0;
    this.nonLeafCount = 0;
    this.branchesExploredSum = 0;
    this.state = null;
    this.startTime = 0;
    this.interrupted = false;
  }

  /**
   * Generate a list of sorted and pruned moves for this state
   */
  private getSortedMoves(state: State): Move[] {
    // Board is empty, return a move in the middle of the board
    if (state.getMoves() === 0) {
      const center = Math.floor(state.board.length / 2);
      return [new Move(center, center)];
    }

    const playerIndex = state.currentIndex;
    const opponentIndex = state.currentIndex === 2 ? 1 : 2;

    const fours = new Set<string>();
    const refutations = new Set<string>();
    const opponentFours = new Set<string>();
    const opponentThrees = new Set<string>();

    // Check for threats first and respond to them if they exist
    for (let i = 0; i < state.board.length; i++) {
      for (let j = 0; j < state.board.length; j++) {
        if (state.board[i][j].index === opponentIndex) {
          const fourMoves = this.reducer.getFours(state, state.board[i][j], opponentIndex);
          fourMoves.forEach(m => opponentFours.add(`${m.row},${m.col}`));
          
          const threeMoves = this.reducer.getThrees(state, state.board[i][j], opponentIndex);
          threeMoves.forEach(m => opponentThrees.add(`${m.row},${m.col}`));
        } else if (state.board[i][j].index === playerIndex) {
          const fourMoves = this.reducer.getFours(state, state.board[i][j], playerIndex);
          fourMoves.forEach(m => fours.add(`${m.row},${m.col}`));
          
          const refuteMoves = this.reducer.getRefutations(state, state.board[i][j], playerIndex);
          refuteMoves.forEach(m => refutations.add(`${m.row},${m.col}`));
        }
      }
    }

    // Convert sets to arrays
    const fourArray = Array.from(fours).map(s => {
      const [row, col] = s.split(',').map(Number);
      return new Move(row, col);
    });

    // We have a four on the board, play it
    if (fourArray.length > 0) {
      return fourArray;
    }
    
    // Opponent has a four, defend against it
    const opponentFourArray = Array.from(opponentFours).map(s => {
      const [row, col] = s.split(',').map(Number);
      return new Move(row, col);
    });
    
    if (opponentFourArray.length > 0) {
      return opponentFourArray;
    }
    
    // Opponent has a three, defend against it and add refutation moves
    if (opponentThrees.size > 0) {
      refutations.forEach(r => opponentThrees.add(r));
      return Array.from(opponentThrees).map(s => {
        const [row, col] = s.split(',').map(Number);
        return new Move(row, col);
      });
    }

    const scoredMoves: ScoredMove[] = [];
    const entry = this.moveTable.get(state.getZobristHash());
    
    // Grab closest moves
    for (let i = 0; i < state.board.length; i++) {
      for (let j = 0; j < state.board.length; j++) {
        // Ignore hash move (will be tried first)
        if (entry && i === entry.move.row && j === entry.move.col) {
          continue;
        }
        
        if (state.board[i][j].index === 0) {
          if (state.hasAdjacent(i, j, 2)) {
            const score = this.evaluator.evaluateField(state, i, j, state.currentIndex);
            scoredMoves.push({ move: new Move(i, j), score });
          }
        }
      }
    }

    // Sort based on move score (highest first)
    scoredMoves.sort((a, b) => b.score - a.score);
    return scoredMoves.map(sm => sm.move);
  }

  /**
   * Run the negamax algorithm for a node in the game tree
   */
  private negamax(state: State, depth: number, alpha: number, beta: number): number {
    this.totalNodeCount++;
    
    if (this.interrupted || (performance.now() - this.startTime) > (this.time / 1000000)) {
      throw new Error("Search interrupted");
    }
    
    if (state.terminal() !== 0 || depth === 0) {
      return this.evaluator.evaluateState(state, depth);
    }
    
    this.nonLeafCount++;

    let value: number;
    let best = -Infinity;
    let count = 0;
    let bestMove: Move | null = null;

    // Try the move from a previous search
    const hashMoveEntry = this.moveTable.get(state.getZobristHash());
    if (hashMoveEntry) {
      count++;
      state.makeMove(hashMoveEntry.move);
      value = -this.negamax(state, depth - 1, -beta, -alpha);
      state.undoMove(hashMoveEntry.move);
      
      if (value > best) {
        bestMove = hashMoveEntry.move;
        best = value;
      }
      if (best > alpha) alpha = best;
      if (best >= beta) return best;
    }

    // No cut-off from hash move, get sorted moves
    const moves = this.getSortedMoves(state);

    for (const move of moves) {
      count++;
      state.makeMove(move);
      value = -this.negamax(state, depth - 1, -beta, -alpha);
      state.undoMove(move);
      
      if (value > best) {
        bestMove = move;
        best = value;
      }
      if (best > alpha) alpha = best;
      if (best >= beta) {
        break;
      }
    }
    
    this.branchesExploredSum += count;
    
    if (bestMove) {
      this.putMoveEntry(state.getZobristHash(), bestMove, depth);
    }
    
    return best;
  }

  /**
   * Place the best move found from a state into the hash table
   */
  private putMoveEntry(key: number, move: Move, depth: number): void {
    const moveEntry = this.moveTable.get(key);
    if (!moveEntry) {
      this.moveTable.set(key, { move, depth });
    } else if (depth > moveEntry.depth) {
      this.moveTable.set(key, { move, depth });
    }
  }

  /**
   * Run a depth-limited negamax search on a set of moves
   */
  private searchMoves(state: State, moves: Move[], depth: number): Move[] {
    const scoredMoves: ScoredMove[] = moves.map(move => ({
      move,
      score: -Infinity
    }));

    let alpha = -11000;
    const beta = 11000;
    let best = -Infinity;

    for (const scoredMove of scoredMoves) {
      state.makeMove(scoredMove.move);
      scoredMove.score = -this.negamax(state, depth - 1, -beta, -alpha);
      state.undoMove(scoredMove.move);
      
      if (scoredMove.score > best) best = scoredMove.score;
      if (best > alpha) alpha = best;
      if (best >= beta) break;
    }

    // Sort by score (highest first)
    scoredMoves.sort((a, b) => b.score - a.score);
    
    this.printSearchInfo(scoredMoves[0].move, scoredMoves[0].score, depth);
    
    return scoredMoves.map(sm => sm.move);
  }

  /**
   * Run negamax for an increasing depth
   */
  private iterativeDeepening(startDepth: number, endDepth: number): Move | null {
    this.startTime = performance.now();
    let moves = this.getSortedMoves(this.state!);
    
    if (moves.length === 0) return null;
    if (moves.length === 1) return moves[0];
    
    for (let i = startDepth; i <= endDepth; i++) {
      try {
        moves = this.searchMoves(this.state!, moves, i);
      } catch (e) {
        console.log(`Search interrupted at depth ${i}`);
        break;
      }
    }
    
    return moves[0];
  }
  
  /**
   * Get the best move for the current game state
   */
  getMove(moves: Move[]): Move | null {
    // Reset performance counts, clear the hash table
    this.totalNodeCount = 0;
    this.nonLeafCount = 0;
    this.branchesExploredSum = 0;
    this.interrupted = false;
    this.moveTable.clear();

    // Create a new internal state object, sync with the game state
    this.state = new State(this.info.getSize());
    for (const move of moves) {
      this.state.makeMove(move);
    }

    // Run a depth increasing search
    const best = this.iterativeDeepening(2, 10);
    this.printPerformanceInfo();
    return best;
  }

  /**
   * Cancel the current search
   */
  cancelSearch(): void {
    this.interrupted = true;
  }

  /**
   * Print performance information
   */
  private printPerformanceInfo(): void {
    if (this.totalNodeCount > 0) {
      const duration = performance.now() - this.startTime;
      const nodesPerMs = this.totalNodeCount / (duration > 0 ? duration : 1);
      const avgBranches = this.branchesExploredSum / (this.nonLeafCount || 1);
      
      console.log(`[AI Performance]`);
      console.log(`  Time: ${duration.toFixed(0)}ms`);
      console.log(`  Nodes: ${this.totalNodeCount}`);
      console.log(`  Nodes/ms: ${nodesPerMs.toFixed(2)}`);
      console.log(`  Avg branches: ${avgBranches.toFixed(2)}`);
    }
  }
  
  /**
   * Print the result of a search
   */
  private printSearchInfo(bestMove: Move, score: number, depth: number): void {
    console.log(`[Depth ${depth}] Best: ${bestMove.toString()}, Score: ${score}`);
  }
}
