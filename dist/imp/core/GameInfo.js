/**
 * Game information and settings
 */
export class GameInfo {
    constructor(size = 15, timeout = 2000) {
        this.size = size;
        this.timeout = timeout;
    }
    getSize() {
        return this.size;
    }
    getTimeout() {
        return this.timeout;
    }
    setTimeout(timeout) {
        this.timeout = timeout;
    }
}
//# sourceMappingURL=GameInfo.js.map