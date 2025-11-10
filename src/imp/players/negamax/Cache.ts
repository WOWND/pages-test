/**
 * LRU Cache implementation for transposition table
 */
export class Cache<K, V> extends Map<K, V> {
  private maxEntries: number;
  private accessOrder: K[] = [];

  constructor(maxEntries: number) {
    super();
    this.maxEntries = maxEntries;
  }

  override get(key: K): V | undefined {
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

  override set(key: K, value: V): this {
    if (super.has(key)) {
      // Update existing
      const index = this.accessOrder.indexOf(key);
      if (index > -1) {
        this.accessOrder.splice(index, 1);
      }
      this.accessOrder.push(key);
    } else {
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

  override clear(): void {
    super.clear();
    this.accessOrder = [];
  }
}
