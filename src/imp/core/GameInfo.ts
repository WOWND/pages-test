/**
 * Game information and settings
 */
export class GameInfo {
  private size: number;
  private timeout: number; // in milliseconds

  constructor(size: number = 15, timeout: number = 20000) {
    this.size = size;
    this.timeout = timeout;
  }

  getSize(): number {
    return this.size;
  }

  getTimeout(): number {
    return this.timeout;
  }

  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }
}
