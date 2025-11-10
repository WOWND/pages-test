type NonNullableElement = HTMLElement & {
    appendChild: (node: Node) => Node;
};
interface AppState {
    count: number;
}
declare const root: NonNullableElement | null;
declare function create<K extends keyof HTMLElementTagNameMap>(tag: K, options?: {
    className?: string;
    text?: string;
}): HTMLElementTagNameMap[K];
declare function isNumberLike(value: unknown): value is number;
declare function safeParseNumber(value: string): number | null;
declare function renderApp(container: NonNullableElement, state: AppState): void;
//# sourceMappingURL=main.d.ts.map