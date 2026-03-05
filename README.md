# Web Calculator

A clean, keyboard-friendly calculator built with vanilla HTML, CSS, and JavaScript — no build tools, no dependencies, no setup.

## Architecture
```
 ┌─────────────────────────────────────┐
 │             index.html              │
 │       structure & resource wiring   │
 └─────────────────┬───────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌───────────────┐ ┌───────────────────────┐
│ calculator.js │ │        styles/        │
├───────────────┤ ├───────────────────────┤
│ state         │ │ tokens.css  (tokens)  │
│ arithmetic    │ │ layout.css  (shell)   │
│ events        │ │ components.css (btns) │
└───────────────┘ └───────────────────────┘
```

`index.html` wires resources and owns all markup. `calculator.js` holds state, the eval-free arithmetic map, and all event handlers. The `styles/` layer follows a strict cascade: tokens declare the color contract, layout owns the shell and grid, and components owns button variants and display typography.

## Usage

Open `index.html` in any browser. No installation required.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0–9` | Digits |
| `+` `-` `*` `/` | Operators |
| `.` | Decimal |
| `Enter` or `=` | Equals |
| `Backspace` | Delete last digit |
| `Escape` | Clear |

## Project Structure
```
web-calculator/
├── index.html          # Markup and resource wiring
├── calculator.js       # State and event handling
└── styles/
    ├── tokens.css      # Design token declarations
    ├── layout.css      # Shell, display, and grid structure
    └── components.css  # Button variants and display typography
```