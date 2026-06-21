# Issues Identified

Errors found in the starter codebase, organized by category.

## Variables & Operators
1. `taskList = []` in app.js declared with no `var`/`let`/`const` — implicit global.
2. `var` used throughout instead of `let`/`const` (taskCounter, loop counters, etc.).
3. `==` used instead of `===` in `findTaskByTitle`, `isHighPriority`.
4. Assignment operator (`=`) used in an `if` condition in `updateTaskPriority`, instead of `===` — always evaluated truthy.
5. No `typeof` checks anywhere before using parameters.

## Control Flow
6. Off-by-one error in `displayAllTasks` (`i <= taskList.length`), reads past the array end.
7. Infinite loop in `findTaskByTitle` — `while` loop missing `i++`.
8. No `for...of` loops used anywhere; everything used manual indexed loops.

## Functions & Functional Programming
9. `findTaskByTitle` missing its `title` parameter entirely.
10. No array methods (`map`/`filter`/`reduce`/`find`/`some`) used — `getHighPriorityTasks` and `mergeTasks` used manual loops instead.
11. No pure functions or higher-order functions present.

## OOP & Classes
12. `Task` class missing an `id` property and a `toggleCompletion()` method.
13. `SubTask extends Task` but never calls `super()` — throws a ReferenceError before `this` can be used.
14. `TaskManager` object only had one method (`getTotalTasks`).

## Modern JavaScript
15. String concatenation used instead of template literals (`Task.getInfo`, DOM rendering in `dom.js`).
16. No destructuring anywhere (objects, arrays, or function parameters).
17. No spread or rest operators used; `mergeTasks` manually looped to combine arrays.
18. No ES6 `import`/`export` — all files relied on global scope and `<script>` tag order.

## DOM & Events
19. `document.getElementById(".add-task-btn")` mixed ID and class selector syntax.
20. `document.querySelector("task-input")` missing the `#` prefix.
21. No null checks before attaching listeners or manipulating elements.
22. Only one event listener total; no event delegation, no form submission handling.
23. `setupEventListeners()` called immediately at the bottom of `dom.js` instead of waiting for `DOMContentLoaded` — script could run before the DOM existed.

## Storage & Data
24. `saveToStorage` stored the raw data object directly instead of `JSON.stringify`-ing it.
25. `loadFromStorage` returned the raw string instead of `JSON.parse`-ing it.
26. `generateRandomId` returned `Math.random()` directly — a decimal, not a usable integer ID.

## Error Handling & Testing
27. No `try-catch` blocks anywhere in the codebase.
28. No parameter validation on any function.
29. `countCompletedTasks` recursion had no base case and no null/undefined check — would crash or recurse forever.
30. Test suite had only 2 real tests, no `beforeEach` to reset state, and several tests had only placeholder comments instead of assertions.
