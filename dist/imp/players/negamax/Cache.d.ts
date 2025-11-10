/**
 * LRU Cache implementation for transposition table
 */
export declare class Cache<K, V> extends Map<K, V> {
    private maxEntries;
    private accessOrder;
    constructor(maxEntries: number);
    get(key: K): V | undefined;
    set(key: K, value: V): this;
    clear(): void;
}
//# sourceMappingURL=Cache.d.ts.map