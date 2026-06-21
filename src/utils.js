// Utilities - Fixed Version
// Handles storage, formatting, validation, and small helper functions.

// Fix: const instead of var, since this array is never reassigned
const priorities = ["low", "medium", "high"];

/**
 * Saves an array of tasks to localStorage as JSON.
 * Fix: now converts data to JSON before storing (was storing raw object).
 * @param {Array} data - array of task objects to persist
 */
function saveToStorage(data) {
    // typeof check: make sure we were actually handed an array
    if (typeof data === "undefined" || !Array.isArray(data)) {
        throw new TypeError("saveToStorage expects an array of tasks");
    }

    try {
        const json = JSON.stringify(data);
        localStorage.setItem("tasks", json);
        return true;
    } catch (error) {
        console.error(`Failed to save tasks to storage: ${error.message}`);
        return false;
    }
}

/**
 * Loads tasks from localStorage and parses them back into an array.
 * Fix: now parses JSON instead of returning the raw string (was returning string or null).
 * @returns {Array} parsed tasks, or an empty array if nothing is stored / parsing fails
 */
function loadFromStorage() {
    try {
        const data = localStorage.getItem("tasks");

        // Null check: nothing has been saved yet
        if (data === null) {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        console.error(`Failed to load tasks from storage: ${error.message}`);
        return [];
    }
}

/**
 * Generates a random integer ID for a task.
 * Fix: previously returned Math.random() directly (a decimal like 0.123...).
 * Now scales and rounds it into a usable integer ID.
 */
function generateRandomId() {
    return Math.floor(Math.random() * 1000000);
}

/**
 * Formats a task name: trims whitespace and capitalizes the first letter.
 * Fix: previously just returned the name unchanged.
 * @param {string} name
 */
function formatTaskName(name) {
    // typeof check + validation before string operations
    if (typeof name !== "string" || name.trim().length === 0) {
        throw new TypeError("formatTaskName expects a non-empty string");
    }

    const trimmed = name.trim();
    // Template literal instead of concatenation
    return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
}

/**
 * Checks whether a task is high priority.
 * Fix: uses === instead of ==, and returns a real boolean instead of "yes"/"no" strings.
 * @param {Object} task
 */
function isHighPriority(task) {
    // Null/undefined check before accessing properties
    if (!task || typeof task !== "object") {
        return false;
    }
    return task.priority === "high";
}

// Pure function: given a list of tasks, returns counts per priority level.
// Doesn't mutate input or rely on outside state -> pure.
function getPriorityBreakdown(tasks) {
    if (!Array.isArray(tasks)) {
        throw new TypeError("getPriorityBreakdown expects an array");
    }

    return tasks.reduce((breakdown, { priority }) => {
        breakdown[priority] = (breakdown[priority] || 0) + 1;
        return breakdown;
    }, {});
}

// Demonstrates array destructuring: pulls out the lowest and highest priority
// levels from the priorities array without manual index access.
function getPriorityRange() {
    const [lowest, , highest] = priorities;
    return { lowest, highest };
}

// ES6 module exports
export {
    priorities,
    saveToStorage,
    loadFromStorage,
    generateRandomId,
    formatTaskName,
    isHighPriority,
    getPriorityBreakdown,
    getPriorityRange
};
