/**
 * Represents a move or position on the Gomoku board.
 */
export class Move {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    hashCode() {
        return this.row * 31 + this.col;
    }
    equals(obj) {
        if (obj instanceof Move) {
            return obj.row === this.row && obj.col === this.col;
        }
        return false;
    }
    toString() {
        return `(${this.row},${this.col})`;
    }
}
//# sourceMappingURL=Move.js.map