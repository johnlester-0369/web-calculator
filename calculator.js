/* ==================== DOM REFERENCES ====================
   Captured once at module load; all subsequent reads and
   writes go through these references to avoid repeated
   querySelector calls in hot paths.
   ========================================================= */
const display    = document.getElementById('display');
const expression = document.getElementById('expression');

/* ==================== STATE ====================
   Flat structure intentionally — a single-level object
   makes the reset operation a trivial reassignment and
   keeps state reads easy to reason about during debugging.
   ================================================ */
let current    = '0';
let previous   = null;
let operator   = null;
let justEvaled = false;

const MAX_DIGITS = 12;

/* ==================== DISPLAY HELPERS ==================== */

function updateDisplay() {
  display.textContent = current;
  // Shrink font when the number is too wide to fit the display comfortably
  const len = current.replace('-', '').replace('.', '').length;
  display.className = 'calc__value' + (len > 9 ? ' x-small' : len > 6 ? ' small' : '');
}

function setExpression(text) {
  expression.textContent = text;
}

/* ==================== ARITHMETIC ====================
   Eval-free operator map avoids the security surface and
   linting errors that come with eval(), while keeping the
   dispatch O(1) regardless of how many operators exist.
   ===================================================== */
const OPS = {
  '÷': (a, b) => a / b,
  '×': (a, b) => a * b,
  '−': (a, b) => a - b,
  '+': (a, b) => a + b,
};

function compute() {
  if (previous === null || operator === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  const result = OPS[operator](a, b);
  // toPrecision(10) caps the display noise that floating-point arithmetic
  // introduces (e.g. 0.1 + 0.2 = 0.30000000004); parseFloat strips trailing zeros
  const formatted = parseFloat(result.toPrecision(10)).toString();
  setExpression(`${previous} ${operator} ${current} =`);
  current    = formatted;
  previous   = null;
  operator   = null;
  justEvaled = true;
  updateDisplay();
}

/* ==================== BUTTON CLICK HANDLER ==================== */

document.querySelector('.calc__grid').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const value  = btn.dataset.value;

  if (action === 'digit') {
    // After equals, a new digit starts a fresh entry rather than appending to the result
    if (justEvaled) { current = ''; justEvaled = false; }
    if (current === '0' && value !== '.') current = '';
    if (current.length >= MAX_DIGITS) return;
    current += value;
    updateDisplay();
  }

  else if (action === 'decimal') {
    if (justEvaled) { current = '0'; justEvaled = false; }
    if (!current.includes('.')) current += '.';
    updateDisplay();
  }

  else if (action === 'op') {
    // Chain operations: pressing an operator mid-expression resolves the pending one first
    if (previous !== null && !justEvaled) compute();
    previous   = current;
    operator   = value;
    justEvaled = false;
    setExpression(`${previous} ${operator}`);
    current = '0';
    updateDisplay();
  }

  else if (action === 'equals') {
    compute();
  }

  else if (action === 'clear') {
    current = '0'; previous = null; operator = null; justEvaled = false;
    setExpression('');
    updateDisplay();
  }

  else if (action === 'backspace') {
    // Fall back to '0' rather than empty string so the display always shows a valid numeric value
    if (current.length > 1) current = current.slice(0, -1);
    else current = '0';
    updateDisplay();
  }

  else if (action === 'percent') {
    // Divides in place, matching iOS calculator behaviour for the % key
    current = (parseFloat(current) / 100).toString();
    updateDisplay();
  }
});

/* ==================== KEYBOARD SUPPORT ====================
   Physical keyboard parity so the calculator is fully usable
   without a pointer device — important for desktop users and
   accessibility audits.
   =========================================================== */
document.addEventListener('keydown', (e) => {
  if ('0123456789'.includes(e.key)) {
    document.querySelector(`[data-value="${e.key}"]`)?.click();
  } else if (e.key === '.') {
    document.querySelector('[data-action="decimal"]').click();
  } else if (e.key === '+') {
    document.querySelector('[data-value="+"]').click();
  } else if (e.key === '-') {
    document.querySelector('[data-value="−"]').click();
  } else if (e.key === '*') {
    document.querySelector('[data-value="×"]').click();
  } else if (e.key === '/') {
    // Prevent the browser's default find-in-page shortcut from triggering
    e.preventDefault();
    document.querySelector('[data-value="÷"]').click();
  } else if (e.key === 'Enter' || e.key === '=') {
    document.querySelector('[data-action="equals"]').click();
  } else if (e.key === 'Escape') {
    document.querySelector('[data-action="clear"]').click();
  } else if (e.key === 'Backspace') {
    if (current.length > 1) current = current.slice(0, -1);
    else current = '0';
    updateDisplay();
  }
});