# Task Management Application

A vanilla JavaScript task manager, debugged and completed from a ~60%-finished starter codebase as a capstone project. Covers ES6+ syntax, OOP with inheritance, functional programming, DOM manipulation, localStorage persistence, and a full Jest test suite.

## Overview

Users can add tasks with a title, description, and priority (low/medium/high), mark them complete, delete them, and see live completion statistics. Tasks persist across page reloads via `localStorage`.

## Errors Found

See `issues-identified.md` for the full list (30 errors across 7 categories). Highlights: an undeclared global (`taskList`), `==` and `=` used where `===` was needed, an off-by-one loop, an infinite `while` loop (missing `i++`), a missing `super()` call in `SubTask`, no JSON serialization in storage functions, and a recursive function with no base case.

## Fixes Implemented

- **Variables/operators** — all `var` replaced with `let`/`const`; `==`/`=` bugs replaced with `===`; `typeof` checks added before using parameters.
- **Control flow** — off-by-one and infinite-loop bugs fixed; `for...of` used where appropriate.
- **Functions** — missing parameters restored; `map`/`filter`/`reduce`/`find`/`some` used throughout; 3 pure functions added (`getPriorityBreakdown`, `summarizeTasks`, `getPriorityWeight`); `sortTasksBy` is a higher-order function.
- **OOP** — `Task` got an `id` and `toggleCompletion()`; `SubTask` now calls `super()` and overrides `getInfo()`; `TaskManager` gained 4 new methods.
- **Modern JS** — destructuring (object, array, and function-parameter forms), template literals, spread (`mergeTasks`, `getSortedTasks`), and a rest parameter (`addMultipleTasks`) added throughout.
- **Modules** — `utils.js`, `app.js`, and `dom.js` are real ES modules with `import`/`export`.
- **DOM/events** — selectors fixed, null checks added, 5 event listeners wired up, one event-delegation handler on the task list container, `DOMContentLoaded` used for init.
- **Storage** — `JSON.stringify`/`JSON.parse` added; tasks now persist and reload correctly.
- **Error handling** — `try-catch` blocks and parameter validation added across storage, task creation, and update functions.

## Features Added

Priority dropdown, live statistics panel, mark-complete/delete buttons (via delegated click handling), Enter-to-submit, and automatic task restoration from `localStorage` on load.

## Running the App

Open `index.html` directly in a browser (no build step needed — it's plain ES modules).

## Running Tests

```bash
npm install
npm test
```

**Result:** 32/32 tests passing, 0 failures, covering Task/SubTask classes, inheritance, recursion, array operations, destructuring, storage round-trips, and edge cases (empty arrays, unknown IDs, invalid input).

## Reflection

The trickiest bug to track down was the infinite loop in `findTaskByTitle` — the missing `i++` doesn't throw an error, it just hangs, so the fix required reading the loop logic carefully rather than relying on a stack trace. The `updateTaskPriority` bug (`=` instead of `===`) was similar: it didn't crash, it just silently updated the *first* task's priority every time instead of the *matching* one, which only became obvious once a test exposed the wrong task being modified. Standardizing the `priority` field on a string scale (`"low"/"medium"/"high"`) rather than leaving it as the starter code's inconsistent mix of numbers and strings was also a judgment call worth noting — it made comparisons and the priority dropdown UI much more reliable.
