export interface WPTool {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  group: string;
  status: 'Published' | 'Draft';
  html: string;
  css: string;
  js: string;
  seoTitle: string;
  seoDesc: string;
  seoOgImg: string;
  views: number;
  dailyViews: Record<string, number>; // date -> count
}

export const INITIAL_TOOLS: WPTool[] = [
  {
    id: 1,
    slug: 'calculator',
    title: 'Modern CSS Calculator',
    excerpt: 'A clean, high-performance tactical mathematical computation calculator layout.',
    content: 'An exquisite client-side physical calculator widget rendering grid layouts, decimal capabilities, and clear operator loops inside responsive container boxes.',
    group: 'Mathematics',
    status: 'Published',
    views: 412,
    dailyViews: {
      '2026-05-16': 52,
      '2026-05-17': 63,
      '2026-05-18': 48,
      '2026-05-19': 75,
      '2026-05-20': 59,
      '2026-05-21': 68,
      '2026-05-22': 47
    },
    seoTitle: 'Responsive Math Calculator Grid | Free WP Utility Tool',
    seoDesc: 'Perform mathematical computations immediately using this advanced calculations widget, equipped with smooth typography gradients.',
    seoOgImg: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop',
    html: `<div class="tool-container calculator-box">
  <div class="calc-screen">0</div>
  <div class="calc-buttons">
    <button class="btn col-span-2 btn-gray" data-action="clear">AC</button>
    <button class="btn btn-gray" data-action="delete">⌫</button>
    <button class="btn btn-orange" data-val="/">÷</button>

    <button class="btn" data-val="7">7</button>
    <button class="btn" data-val="8">8</button>
    <button class="btn" data-val="9">9</button>
    <button class="btn btn-orange" data-val="*">×</button>

    <button class="btn" data-val="4">4</button>
    <button class="btn" data-val="5">5</button>
    <button class="btn" data-val="6">6</button>
    <button class="btn btn-orange" data-val="-">−</button>

    <button class="btn" data-val="1">1</button>
    <button class="btn" data-val="2">2</button>
    <button class="btn" data-val="3">3</button>
    <button class="btn btn-orange" data-val="+">+</button>

    <button class="btn col-span-2" data-val="0">0</button>
    <button class="btn" data-val=".">.</button>
    <button class="btn btn-orange" data-action="equal">=</button>
  </div>
</div>`,
    css: `.calculator-box {
  max-width: 320px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
  margin: 0 auto;
}
.calc-screen {
  background: #1e293b;
  color: #38bdf8;
  font-family: monospace;
  font-size: 2rem;
  text-align: right;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
  border: 1px solid #334155;
}
.calc-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.btn {
  background: #334155;
  color: #fff;
  border: none;
  font-size: 1.1rem;
  padding: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-weight: 500;
}
.btn:active {
  transform: scale(0.95);
}
.btn:hover {
  background: #475569;
}
.btn-orange {
  background: #f97316;
}
.btn-orange:hover {
  background: #ea580c;
}
.btn-gray {
  background: #64748b;
}
.btn-gray:hover {
  background: #475569;
}
.col-span-2 {
  grid-column: span 2;
}`,
    js: `const screen = container.querySelector('.calc-screen');
const buttons = container.querySelector('.calc-buttons');
let expression = '';

buttons.addEventListener('click', (e) => {
  const target = e.target;
  if (!target.classList.contains('btn')) return;

  const val = target.getAttribute('data-val');
  const action = target.getAttribute('data-action');

  if (action === 'clear') {
    expression = '';
    screen.textContent = '0';
  } else if (action === 'delete') {
    expression = expression.slice(0, -1);
    screen.textContent = expression || '0';
  } else if (action === 'equal') {
    try {
      if (expression) {
        // Safe sanitization parse for simple math evaluation
        const sanitized = expression.replace(/[^0-9+\\-*/.]/g, '');
        const res = Function('"use strict";return (' + sanitized + ')')();
        expression = String(res);
        screen.textContent = expression;
      }
    } catch (err) {
      screen.textContent = 'Error';
      expression = '';
    }
  } else if (val) {
    if (screen.textContent === '0' && val !== '.') {
      expression = val;
    } else {
      expression += val;
    }
    screen.textContent = expression;
  }
});`
  },
  {
    id: 2,
    slug: 'word-counter',
    title: 'Pro Word Counter',
    excerpt: 'Advanced string metrics analyzing word length, character weight and density checks.',
    content: 'Evaluate character layouts instantly inside text editors, providing paragraph tags count and reading difficulty parameters natively.',
    group: 'Text Utilities',
    status: 'Published',
    views: 845,
    dailyViews: {
      '2026-05-16': 110,
      '2026-05-17': 124,
      '2026-05-18': 95,
      '2026-05-19': 142,
      '2026-05-20': 119,
      '2026-05-21': 133,
      '2026-05-22': 122
    },
    seoTitle: 'Advanced Word Counter & Paragraph Tracker Free WP Plugin',
    seoDesc: 'Calculate characters, punctuation blocks, reading time estimates, and unique density arrays easily with optimized inputs gauges.',
    seoOgImg: 'https://images.unsplash.com/photo-1516414923405-952d47b59748?w=600&auto=format&fit=crop',
    html: `<div class="tool-container counts-card">
  <h3>Text Analysis Engine</h3>
  <textarea class="text-input" placeholder="Paste or type your editorial script here..."></textarea>
  <div class="stats-grid">
    <div class="stat-box">
      <span class="label">Words</span>
      <span class="val" id="words-text">0</span>
    </div>
    <div class="stat-box">
      <span class="label">Characters</span>
      <span class="val" id="chars-text">0</span>
    </div>
    <div class="stat-box">
      <span class="label">Paragraphs</span>
      <span class="val" id="paras-text">0</span>
    </div>
    <div class="stat-box">
      <span class="label">Reading Time</span>
      <span class="val" id="time-text">0m</span>
    </div>
  </div>
</div>`,
    css: `.counts-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}
.counts-card h3 {
  margin: 0 0 16px 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1e293b;
}
.text-input {
  width: 100%;
  height: 150px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  background-color: #f8fafc;
  margin-bottom: 20px;
  box-sizing: border-box;
}
.text-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 1px #6366f1;
  background-color: #fff;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.stat-box {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  border: 1px solid #e2e8f0;
}
.stat-box .label {
  display: block;
  font-size: 0.775rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 4px;
}
.stat-box .val {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}`,
    js: `const input = container.querySelector('.text-input');
const wordsEl = container.querySelector('#words-text');
const charsEl = container.querySelector('#chars-text');
const parasEl = container.querySelector('#paras-text');
const timeEl = container.querySelector('#time-text');

input.addEventListener('input', () => {
  const text = input.value;
  
  // Character count
  const charCount = text.length;
  
  // Word count
  const words = text.trim().split(/\\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Paragraphs count
  const paragraphs = text.split(/\\n+/).filter(p => p.trim().length > 0);
  const paraCount = paragraphs.length;

  // Reading time (average 200 words per minute)
  const readTime = Math.ceil(wordCount / 200);

  // Update DOM elements dynamically
  charsEl.textContent = charCount;
  wordsEl.textContent = wordCount;
  parasEl.textContent = paraCount;
  timeEl.textContent = readTime + 'm';
});`
  },
  {
    id: 3,
    slug: 'password-generator',
    title: 'InstaSecure Password Generator',
    excerpt: 'High-entropy encryption password compiler layout with robust character selections.',
    content: 'Deploy custom randomized strings utilizing symbols, letters, caps, and integers overlays, with click copier feedback indicators.',
    group: 'Security',
    status: 'Published',
    views: 651,
    dailyViews: {
      '2026-05-16': 80,
      '2026-05-17': 92,
      '2026-05-18': 79,
      '2026-05-19': 105,
      '2026-05-20': 88,
      '2026-05-21': 95,
      '2026-05-22': 112
    },
    seoTitle: 'Instant Encrypted Password Generator Widget | Pro Tool Kit',
    seoDesc: 'Generate strong secure passwords with customizable parameters to secure user log details against brute calculations.',
    seoOgImg: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop',
    html: `<div class="tool-container pw-card">
  <h3>Secure Password Builder</h3>
  <div class="result-box">
    <div id="pw-string" class="placeholder">Click Generate</div>
    <button class="copy-btn" id="copy-btn-action">Copy</button>
  </div>
  
  <div class="settings-rows">
    <div class="slider-row">
      <div class="row-info">
        <span>Password Length</span>
        <span id="len-indicator">14</span>
      </div>
      <input type="range" class="slider-range" id="pw-len" min="6" max="32" value="14" />
    </div>

    <label class="switch-row">
      <input type="checkbox" id="pw-num" checked />
      <span>Include Numbers (0-9)</span>
    </label>

    <label class="switch-row">
      <input type="checkbox" id="pw-sym" checked />
      <span>Include Symbols (!@#$%)</span>
    </label>

    <label class="switch-row">
      <input type="checkbox" id="pw-caps" checked />
      <span>Include Uppercase Keys</span>
    </label>
  </div>

  <button class="build-btn" id="generate-trigger">Generate High-Entropy Key</button>
</div>`,
    css: `.pw-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}
.pw-card h3 {
  margin: 0 0 16px 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1e293b;
}
.result-box {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
#pw-string {
  font-family: monospace;
  font-size: 1.2rem;
  color: #0f172a;
  word-break: break-all;
  user-select: all;
  font-weight: bold;
}
#pw-string.placeholder {
  color: #94a3b8;
  font-weight: normal;
}
.copy-btn {
  background: #6366f1;
  color: #fff;
  border: none;
  font-size: 0.875rem;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
.copy-btn:hover {
  background: #4f46e5;
}
.settings-rows {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.slider-row .row-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #475569;
  margin-bottom: 6px;
  font-weight: 500;
}
.slider-range {
  width: 100%;
}
.switch-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.875rem;
  color: #475569;
  cursor: pointer;
}
.build-btn {
  width: 100%;
  background: #1e293b;
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.build-btn:hover {
  background: #0f172a;
}`,
    js: `const result = container.querySelector('#pw-string');
const copyBtn = container.querySelector('#copy-btn-action');
const lenInput = container.querySelector('#pw-len');
const lenIndicator = container.querySelector('#len-indicator');
const numInc = container.querySelector('#pw-num');
const symInc = container.querySelector('#pw-sym');
const capsInc = container.querySelector('#pw-caps');
const generateBtn = container.querySelector('#generate-trigger');

lenInput.addEventListener('input', () => {
  lenIndicator.textContent = lenInput.value;
});

function generatePassword() {
  const len = parseInt(lenInput.value, 10);
  let alphabets = 'abcdefghijklmnopqrstuvwxyz';
  if (capsInc.checked) alphabets += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (numInc.checked) alphabets += '0123456789';
  if (symInc.checked) alphabets += '!@#$%^&*()_+~|}{[]:;?><,./-=';

  let pass = '';
  for(let i=0; i < len; i++) {
    const idx = Math.floor(Math.random() * alphabets.length);
    pass += alphabets[idx];
  }

  result.textContent = pass;
  result.classList.remove('placeholder');
}

generateBtn.addEventListener('click', generatePassword);

copyBtn.addEventListener('click', () => {
  const pass = result.textContent;
  if (pass === 'Click Generate') return;
  
  navigator.clipboard.writeText(pass).then(() => {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1500);
  });
});`
  }
];
