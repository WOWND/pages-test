/**
 * Represents a field (intersection) on the Gomoku board.
 */
export class Field {
    constructor(row, col) {
        if (row === undefined || col === undefined) {
            this.row = 0;
            this.col = 0;
            this.index = 3; // out of bounds
        }
        else {
            this.row = row;
            this.col = col;
            this.index = 0; // empty
        }
    }
}
//# sourceMappingURL=Field.js.map