/**
 * Represents a field (intersection) on the Gomoku board.
 */
export class Field {
  // Location of the field relative to the rest of the board
  public readonly row: number;
  public readonly col: number;
  
  // The index (state) of the field, 0 if empty, 1/2 if player 1/2 has
  // occupied it, and 3 if out of bounds
  public index: number;

  /**
   * Default constructor for a field, set to out of bounds.
   */
  constructor();
  /**
   * Create a field with a row/column identifier.
   */
  constructor(row: number, col: number);
  constructor(row?: number, col?: number) {
    if (row === undefined || col === undefined) {
      this.row = 0;
      this.col = 0;
      this.index = 3; // out of bounds
    } else {
      this.row = row;
      this.col = col;
      this.index = 0; // empty
    }
  }
}
