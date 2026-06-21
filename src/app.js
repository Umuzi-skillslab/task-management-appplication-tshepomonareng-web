// Task Management Application - Fixed Version
//
// Note on priority: the starter code mixed numeric priorities (e.g. `1`, `2`, `3`)
// in some places with string priorities (`"high"`) in others. This version
// standardizes on the string scale defined in utils.js: "low" | "medium" | "high".
import { generateRandomId, isHighPriority, priorities } from "./utils.js";

// Pure function: converts a priority string into a numeric weight for comparisons.
function getPriorityWeight(priority) {
    const weight = priorities.indexOf(priority);
    return weight === -1 ? 0 : weight;
}

// Fix: properly declared with let (was missing declaration entirely - implicit global)
let taskList = [];

// Task class with errors fixed
class Task {
    constructor(title, description, priority) {
        // Parameter validation
        if (typeof title !== "string" || title.trim().length === 0) {
            throw new TypeError("Task requires a non-empty title");
        }

        this.id = generateRandomId(); // Fix: id property added
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.completed = false;
    }

    // Fix: added toggleCompletion method
    toggleCompletion() {
        this.completed = !this.completed;
        return this.completed;
    }

    getInfo() {
        // Fix: template literal instead of string concatenation
        return `Task: ${this.title} - Priority: ${this.priority}`;
    }
}

// Subtask class with inheritance fixed
class SubTask extends Task {
    constructor(title, description, priority, parentTask) {
        // Fix: super() call added - must run before using `this`
        super(title, description, priority);
        this.parentTask = parentTask;
    }

    // Method overriding: SubTask reports differently from a regular Task
    getInfo() {
        const baseInfo = super.getInfo();
        return `${baseInfo} (subtask of "${this.parentTask}")`;
    }
}

// Function with error handling and validation added
function addTask(title, description, priority) {
    // Parameter validation
    if (typeof title !== "string" || title.trim().length === 0) {
        throw new TypeError("addTask requires a valid title");
    }

    try {
        const newTask = new Task(title, description, priority); // Fix: const instead of var
        taskList.push(newTask);
        return newTask;
    } catch (error) {
        console.error(`Failed to add task: ${error.message}`);
        throw error;
    }
}

// Fix: off-by-one loop corrected, now uses for-of
function displayAllTasks() {
    for (const task of taskList) {
        console.log(task.title);
    }
}

// Fix: missing `title` parameter added, while loop infinite-loop bug fixed (i++ added), === used
function findTaskByTitle(title) {
    if (typeof title !== "string") {
        throw new TypeError("findTaskByTitle requires a string title");
    }

    let i = 0;
    while (i < taskList.length) {
        if (taskList[i].title === title) {
            return taskList[i];
        }
        i++; // Fix: increment added, was missing (infinite loop)
    }
    return undefined;
}

// Fix: typeof/null validation added, assignment bug (=) fixed to ===
function updateTaskPriority(taskId, newPriority) {
    if (typeof taskId === "undefined" || taskId === null) {
        throw new TypeError("updateTaskPriority requires a valid taskId");
    }
    if (typeof newPriority !== "string") {
        throw new TypeError("updateTaskPriority requires newPriority to be a string");
    }

    for (const task of taskList) {
        if (task.id === taskId) { // Fix: === instead of = (was always-true assignment)
            task.priority = newPriority;
            return true;
        }
    }
    return false;
}

// Fix: now uses object destructuring instead of manual property access
function getTaskDetails(task) {
    if (!task || typeof task !== "object") {
        throw new TypeError("getTaskDetails requires a task object");
    }

    const { title, description, priority, completed } = task;
    return { title, description, priority, completed };
}

// Fix: now uses the spread operator instead of manual loops
function mergeTasks(list1, list2) {
    if (!Array.isArray(list1) || !Array.isArray(list2)) {
        throw new TypeError("mergeTasks expects two arrays");
    }
    return [...list1, ...list2];
}

// Fix: base case and null/undefined check added (was missing both -> infinite recursion / crash)
function countCompletedTasks(tasks, index = 0) {
    if (!Array.isArray(tasks)) {
        throw new TypeError("countCompletedTasks expects an array");
    }

    // Base case: reached the end of the array
    if (index >= tasks.length) {
        return 0;
    }

    const current = tasks[index];
    const increment = current && current.completed ? 1 : 0;
    return increment + countCompletedTasks(tasks, index + 1);
}

// Fix: empty array handled, uses reduce (array method) instead of manual loop, Math.round applied
function calculateAveragePriority(tasksOverride) {
    const tasks = tasksOverride || taskList;

    if (!Array.isArray(tasks) || tasks.length === 0) {
        return 0; // Edge case: nothing to average
    }

    const total = tasks.reduce((sum, task) => sum + getPriorityWeight(task.priority), 0);
    return Math.round(total / tasks.length);
}

// Fix: now uses Array.prototype.filter instead of a manual loop
function getHighPriorityTasks(minPriority) {
    const minWeight = getPriorityWeight(minPriority);
    return taskList.filter((task) => getPriorityWeight(task.priority) > minWeight);
}

// Higher-order function: returns a comparator function for sorting tasks.
// Demonstrates functional programming - a function that returns a function.
function sortTasksBy(field) {
    return function comparator(a, b) {
        if (a[field] < b[field]) return -1;
        if (a[field] > b[field]) return 1;
        return 0;
    };
}

// Uses the spread operator to clone taskList before sorting, so the
// original array order isn't mutated by .sort().
function getSortedTasks(field) {
    return [...taskList].sort(sortTasksBy(field));
}
function addMultipleTasks(...tasks) {
    return tasks.map(({ title, description, priority }) =>
        addTask(title, description, priority)
    );
}

// Pure function: takes tasks in, returns a new summary object, no side effects.
function summarizeTasks(tasks) {
    if (!Array.isArray(tasks)) {
        throw new TypeError("summarizeTasks expects an array");
    }

    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const highPriority = tasks.filter((task) => isHighPriority(task)).length;

    return { total, completed, highPriority };
}

// TaskManager object with added functional-style methods
const TaskManager = {
    tasks: taskList,

    getTotalTasks() {
        return this.tasks.length;
    },

    // Fix: added method using a functional approach (filter)
    getCompletedTasks() {
        return this.tasks.filter((task) => task.completed);
    },

    // Fix: added method using map to produce a lightweight summary list
    getTaskTitles() {
        return this.tasks.map((task) => task.title);
    },

    // Uses Array.prototype.find
    findTaskById(id) {
        return this.tasks.find((task) => task.id === id);
    },

    // Uses Array.prototype.some
    hasHighPriorityTasks() {
        return this.tasks.some((task) => isHighPriority(task));
    }
};

// Function to reset state between test runs (exported for Jest's beforeEach)
function resetTasks() {
    taskList.length = 0;
}

// ES6 module exports
export {
    Task,
    SubTask,
    taskList,
    addTask,
    displayAllTasks,
    findTaskByTitle,
    updateTaskPriority,
    getTaskDetails,
    mergeTasks,
    countCompletedTasks,
    calculateAveragePriority,
    getHighPriorityTasks,
    getPriorityWeight,
    sortTasksBy,
    getSortedTasks,
    addMultipleTasks,
    summarizeTasks,
    TaskManager,
    resetTasks
};
