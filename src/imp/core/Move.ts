/**
 * Represents a move or position on the Gomoku board.
 */
export class Move {
  public readonly row: number;
  public readonly col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  hashCode(): number {
    return this.row * 31 + this.col;
  }

  equals(obj: any): boolean {
    if (obj instanceof Move) {
      return obj.row === this.row && obj.col === this.col;
    }
    return false;
  }

  toString(): string {
    return `(${this.row},${this.col})`;
  }
}
