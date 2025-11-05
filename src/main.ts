type NonNullableElement = HTMLElement & { appendChild: (node: Node) => Node };

interface AppState {
    count: number;
}

const root = document.getElementById('root') as NonNullableElement | null;

function create<K extends keyof HTMLElementTagNameMap>(tag: K, options?: {
    className?: string;
    text?: string;
}): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag);
    if (options?.className) el.className = options.className;
    if (options?.text) el.textContent = options.text;
    return el;
}

function isNumberLike(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value);
}

function safeParseNumber(value: string): number | null {
    const n = Number(value);
    return isNumberLike(n) ? n : null;
}

function renderApp(container: NonNullableElement, state: AppState) {
    container.innerHTML = '';

    const title = create('h1', { text: '타입스크립트 테스트 🚀' });
    const subtitle = create('p', { text: '카운터 + 제곱 계산기 + 시계' });

    // 카운터 영역
    const counterBox = create('div', { className: 'box' });
    const countLabel = create('span', { className: 'count', text: state.count.toString() });
    const incBtn = create('button', { text: '+1' });
    const decBtn = create('button', { text: '-1' });
    const resetBtn = create('button', { text: 'reset' });

    incBtn.addEventListener('click', () => {
        state.count += 1;
        countLabel.textContent = state.count.toString();
    });
    decBtn.addEventListener('click', () => {
        state.count -= 1;
        countLabel.textContent = state.count.toString();
    });
    resetBtn.addEventListener('click', () => {
        state.count = 0;
        countLabel.textContent = state.count.toString();
    });

    counterBox.appendChild(create('h2', { text: '카운터' }));
    const counterRow = create('div');
    counterRow.appendChild(decBtn);
    counterRow.appendChild(countLabel);
    counterRow.appendChild(incBtn);
    counterRow.appendChild(resetBtn);
    counterBox.appendChild(counterRow);

    // 제곱 계산기
    const calcBox = create('div', { className: 'box' });
    calcBox.appendChild(create('h2', { text: '제곱 계산기' }));
    const input = create('input') as HTMLInputElement;
    input.type = 'number';
    input.placeholder = '숫자를 입력하세요';
    const result = create('p', { text: '결과: -' });

    input.addEventListener('input', () => {
        const parsed = safeParseNumber(input.value);
        result.textContent = parsed === null ? '결과: -' : `결과: ${parsed * parsed}`;
    });
    calcBox.appendChild(input);
    calcBox.appendChild(result);

    const clockBox = create('div', { className: 'box' });
    clockBox.appendChild(create('h2', { text: '시계' }));
    const clock = create('p');
    const updateClock = () => {
        clock.textContent = new Date().toLocaleTimeString();
    };
    updateClock();
    const timerId: number = window.setInterval(updateClock, 1000);

    window.addEventListener('beforeunload', () => {
        window.clearInterval(timerId);
    });
    clockBox.appendChild(clock);

    const style = create('style');
    style.textContent = `
      body { font-family: -apple-system, system-ui, sans-serif; padding: 24px; }
      .box { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
      .count { display: inline-block; min-width: 48px; text-align: center; font-size: 20px; margin: 0 8px; }
      button { margin: 0 4px; padding: 8px 12px; }
      input { padding: 6px 8px; margin-right: 8px; width: 200px; }
    `;

    container.appendChild(style);
    container.appendChild(title);
    container.appendChild(subtitle);
    container.appendChild(counterBox);
    container.appendChild(calcBox);
    container.appendChild(clockBox);
}

if (root) {
    const initialState: AppState = { count: 0 };
    renderApp(root, initialState);
}