#!/usr/bin/env ts-node
/**
 * Quick test script for Gomoku AI
 * Run with: npx ts-node test-ai.ts
 */
import { NegamaxPlayer } from './gomoku-ai-typescript';
import * as readline from 'readline';
class SimpleGomokuTest {
    constructor(boardSize = 15) {
        this.boardSize = boardSize;
        this.board = this.createEmptyBoard();
        this.moves = [];
        this.ai = new NegamaxPlayer(boardSize);
        this.currentPlayer = 1;
    }
    createEmptyBoard() {
        return Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(0));
    }
    printBoard() {
        console.clear();
        console.log('\n🎮 GOMOKU AI TEST 🎮\n');
        // Column numbers
        console.log('   ', Array.from({ length: this.boardSize }, (_, i) => i.toString().padStart(2, ' ')).join(' '));
        // Board
        for (let i = 0; i < this.boardSize; i++) {
            const row = this.board[i].map(cell => {
                if (cell === 0)
                    return ' ·';
                if (cell === 1)
                    return ' ⚫';
                return ' ⚪';
            }).join('');
            console.log(i.toString().padStart(2, ' ') + ' ' + row);
        }
        console.log('\nMoves:', this.moves.length);
        console.log('Current player:', this.currentPlayer === 1 ? 'Black ⚫' : 'White ⚪');
    }
    makeMove(row, col) {
        if (this.board[row][col] !== 0) {
            console.log('❌ Invalid move! Cell is occupied.');
            return false;
        }
        this.board[row][col] = this.currentPlayer;
        this.moves.push({ row, col });
        if (this.checkWin(row, col)) {
            this.printBoard();
            console.log(`\n🎉 Player ${this.currentPlayer === 1 ? 'Black ⚫' : 'White ⚪'} wins!\n`);
            return true;
        }
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        return false;
    }
    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            [[0, 1], [0, -1]],
            [[1, 0], [-1, 0]],
            [[1, 1], [-1, -1]],
            [[1, -1], [-1, 1]]
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
            if (count >= 5)
                return true;
        }
        return false;
    }
    async getAIMove() {
        console.log('\n🤔 AI is thinking...');
        const startTime = Date.now();
        const move = this.ai.getMove(this.moves, this.boardSize);
        const elapsed = Date.now() - startTime;
        console.log(`✨ AI decided in ${elapsed}ms`);
        return move;
    }
    async runTest1_OpeningMoves() {
        console.log('\n📝 Test 1: Opening Moves\n');
        console.log('Testing if AI plays reasonable opening moves...\n');
        this.board = this.createEmptyBoard();
        this.moves = [];
        this.currentPlayer = 1;
        // Human plays center
        this.makeMove(7, 7);
        this.printBoard();
        // AI should play nearby
        const aiMove = await this.getAIMove();
        if (aiMove) {
            console.log(`AI plays: (${aiMove.row}, ${aiMove.col})`);
            const distance = Math.max(Math.abs(aiMove.row - 7), Math.abs(aiMove.col - 7));
            if (distance <= 2) {
                console.log('✅ Good opening move (near center)');
            }
            else {
                console.log('⚠️  Unusual opening move (far from center)');
            }
            this.makeMove(aiMove.row, aiMove.col);
            this.printBoard();
        }
    }
    async runTest2_DefensiveMoves() {
        console.log('\n📝 Test 2: Defensive Moves\n');
        console.log('Testing if AI blocks threats...\n');
        this.board = this.createEmptyBoard();
        this.moves = [];
        this.currentPlayer = 1;
        // Create a threat (3 in a row)
        this.makeMove(7, 7); // Black
        this.makeMove(8, 8); // White
        this.makeMove(7, 8); // Black
        this.makeMove(8, 9); // White
        this.makeMove(7, 9); // Black - THREE IN A ROW!
        this.printBoard();
        console.log('\n⚠️  Black has three in a row! AI (White) should block...');
        const aiMove = await this.getAIMove();
        if (aiMove) {
            console.log(`AI blocks at: (${aiMove.row}, ${aiMove.col})`);
            if ((aiMove.row === 7 && aiMove.col === 10) ||
                (aiMove.row === 7 && aiMove.col === 6)) {
                console.log('✅ Correct defensive move!');
            }
            else {
                console.log('⚠️  AI made a different move');
            }
            this.makeMove(aiMove.row, aiMove.col);
            this.printBoard();
        }
    }
    async runTest3_WinningMove() {
        console.log('\n📝 Test 3: Winning Move\n');
        console.log('Testing if AI takes winning moves...\n');
        this.board = this.createEmptyBoard();
        this.moves = [];
        this.currentPlayer = 1;
        // Set up a winning position for AI (White)
        this.makeMove(7, 7); // Black
        this.makeMove(8, 8); // White
        this.makeMove(7, 8); // Black
        this.makeMove(8, 9); // White
        this.makeMove(6, 6); // Black
        this.makeMove(8, 10); // White
        this.makeMove(6, 7); // Black
        this.makeMove(8, 11); // White - FOUR IN A ROW!
        this.makeMove(5, 5); // Black
        this.printBoard();
        console.log('\n🎯 White has four in a row! AI should win...');
        const aiMove = await this.getAIMove();
        if (aiMove) {
            console.log(`AI plays winning move at: (${aiMove.row}, ${aiMove.col})`);
            if ((aiMove.row === 8 && aiMove.col === 7) ||
                (aiMove.row === 8 && aiMove.col === 12)) {
                console.log('✅ Correct winning move!');
            }
            else {
                console.log('⚠️  AI missed the winning move');
            }
            this.makeMove(aiMove.row, aiMove.col);
            this.printBoard();
        }
    }
    async runAllTests() {
        console.log('='.repeat(50));
        console.log('🧪 GOMOKU AI TEST SUITE');
        console.log('='.repeat(50));
        await this.runTest1_OpeningMoves();
        await this.pause(2000);
        await this.runTest2_DefensiveMoves();
        await this.pause(2000);
        await this.runTest3_WinningMove();
        console.log('\n' + '='.repeat(50));
        console.log('✅ All tests completed!');
        console.log('='.repeat(50));
    }
    pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
// Interactive play mode
async function playInteractive() {
    const game = new SimpleGomokuTest(15);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const askMove = () => {
        return new Promise((resolve) => {
            rl.question('Your move (row,col) or "ai" for AI move: ', resolve);
        });
    };
    game.printBoard();
    while (true) {
        const input = await askMove();
        if (input.toLowerCase() === 'quit') {
            console.log('Thanks for playing!');
            break;
        }
        if (input.toLowerCase() === 'ai') {
            const aiMove = await game.getAIMove();
            if (aiMove) {
                if (game.makeMove(aiMove.row, aiMove.col)) {
                    break; // Game over
                }
            }
        }
        else {
            const [row, col] = input.split(',').map(n => parseInt(n.trim()));
            if (!isNaN(row) && !isNaN(col)) {
                if (game.makeMove(row, col)) {
                    break; // Game over
                }
            }
            else {
                console.log('Invalid input! Use format: row,col (e.g., 7,7)');
            }
        }
        game.printBoard();
    }
    rl.close();
}
// Main execution
async function main() {
    const args = process.argv.slice(2);
    if (args[0] === '--test') {
        const tester = new SimpleGomokuTest(15);
        await tester.runAllTests();
    }
    else if (args[0] === '--play') {
        await playInteractive();
    }
    else {
        console.log(`
🎮 Gomoku AI Test Script
========================

Usage:
  npx ts-node test-ai.ts --test    Run automated tests
  npx ts-node test-ai.ts --play    Play interactive game

Options:
  --test    Run automated test suite
  --play    Play against the AI interactively
    `);
        // Run a quick demo
        console.log('\nRunning quick demo...\n');
        const demo = new SimpleGomokuTest(9);
        // Demo moves
        demo.makeMove(4, 4);
        const aiMove = await demo.getAIMove();
        if (aiMove) {
            demo.makeMove(aiMove.row, aiMove.col);
        }
        demo.printBoard();
    }
}
// Run if executed directly
if (require.main === module) {
    main().catch(console.error);
}
export { SimpleGomokuTest };
//# sourceMappingURL=test-ai.js.map