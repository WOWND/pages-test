#!/usr/bin/env ts-node
/**
 * Quick test script for Gomoku AI
 * Run with: npx ts-node test-ai.ts
 */
import { Move } from './gomoku-ai-typescript';
declare class SimpleGomokuTest {
    private boardSize;
    private board;
    private moves;
    private ai;
    private currentPlayer;
    constructor(boardSize?: number);
    private createEmptyBoard;
    printBoard(): void;
    makeMove(row: number, col: number): boolean;
    checkWin(row: number, col: number): boolean;
    getAIMove(): Promise<Move | null>;
    runTest1_OpeningMoves(): Promise<void>;
    runTest2_DefensiveMoves(): Promise<void>;
    runTest3_WinningMove(): Promise<void>;
    runAllTests(): Promise<void>;
    private pause;
}
export { SimpleGomokuTest };
//# sourceMappingURL=test-ai.d.ts.map