import { Move } from '../../core/Move';
import { State } from './State';
import { Field } from './Field';
/**
 * Used to search for threats in a Gomoku game
 */
export declare class ThreatUtils {
    private REFUTATIONS;
    private THREES;
    private FOURS;
    constructor();
    /**
     * Check a field for a broken three or a straight three pattern
     */
    getThrees(state: State, field: Field, playerIndex: number): Move[];
    /**
     * Check a field for a four pattern
     */
    getFours(state: State, field: Field, playerIndex: number): Move[];
    /**
     * Check a field for a pattern which can turn into a four
     */
    getRefutations(state: State, field: Field, playerIndex: number): Move[];
    /**
     * Search for threats around a field in a game state
     */
    private getThreatMoves;
    /**
     * Search for a pattern in a field array
     */
    private matchPattern;
}
//# sourceMappingURL=ThreatUtils.d.ts.map