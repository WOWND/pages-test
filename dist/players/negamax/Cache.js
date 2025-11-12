/**
 * LRU Cache implementation for transposition table
 */
export class Cache extends Map {
    constructor(maxEntries) {
        super();
        this.accessOrder = [];
        this.maxEntries = maxEntries;
    }
    get(key) {
        const value = super.get(key);
        if (value !== undefined) {
            // Move to end (most recently used)
            const index = this.accessOrder.indexOf(key);
            if (index > -1) {
                this.accessOrder.splice(index, 1);
            }
            this.accessOrder.push(key);
        }
        return value;
    }
    set(key, value) {
        if (super.has(key)) {
            // Update existing
            const index = this.accessOrder.indexOf(key);
            if (index > -1) {
                this.accessOrder.splice(index, 1);
            }
            this.accessOrder.push(key);
        }
        else {
            // Add new
            if (this.size >= this.maxEntries) {
                // Remove least recently used
                const lru = this.accessOrder.shift();
                if (lru !== undefined) {
                    super.delete(lru);
                }
            }
            this.accessOrder.push(key);
        }
        return super.set(key, value);
    }
    clear() {
        super.clear();
        this.accessOrder = [];
    }
}
//# sourceMappingURL=Cache.js.map