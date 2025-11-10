/**
 * Represents a move or position on the Gomoku board.
 */
export declare class Move {
    readonly row: number;
    readonly col: number;
    constructor(row: number, col: number);
    hashCode(): number;
    equals(obj: any): boolean;
    toString(): string;
}
//# sourceMappingURL=Move.d.ts.map