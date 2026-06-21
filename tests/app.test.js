// Jest Tests - Fixed and Completed Version
import {
    Task,
    SubTask,
    taskList,
    addTask,
    findTaskByTitle,
    updateTaskPriority,
    getTaskDetails,
    mergeTasks,
    countCompletedTasks,
    calculateAveragePriority,
    getHighPriorityTasks,
    sortTasksBy,
    getSortedTasks,
    addMultipleTasks,
    summarizeTasks,
    TaskManager,
    resetTasks
} from "../src/app.js";

import {
    isHighPriority,
    formatTaskName,
    generateRandomId,
    saveToStorage,
    loadFromStorage,
    getPriorityRange
} from "../src/utils.js";

describe("Task Class", () => {
    test("should create a task with all expected properties", () => {
        const task = new Task("Test Task", "Description", "high");
        expect(task.title).toBe("Test Task");
        expect(task.description).toBe("Description");
        expect(task.priority).toBe("high");
        expect(task.completed).toBe(false);
        expect(typeof task.id).toBe("number");
    });

    test("getInfo should return a formatted string", () => {
        const task = new Task("Write tests", "Cover the app", "medium");
        expect(task.getInfo()).toBe("Task: Write tests - Priority: medium");
    });

    test("toggleCompletion should flip the completed flag", () => {
        const task = new Task("Toggle me", "desc", "low");
        expect(task.completed).toBe(false);
        task.toggleCompletion();
        expect(task.completed).toBe(true);
        task.toggleCompletion();
        expect(task.completed).toBe(false);
    });

    // Edge case: invalid title should throw rather than silently create a broken task
    test("should throw when title is missing", () => {
        expect(() => new Task("", "desc", "low")).toThrow(TypeError);
    });
});

describe("SubTask Inheritance", () => {
    test("SubTask should inherit from Task and call super()", () => {
        const subtask = new SubTask("Subtask 1", "desc", "low", "Parent Task");
        expect(subtask instanceof Task).toBe(true);
        expect(subtask.title).toBe("Subtask 1");
        expect(subtask.parentTask).toBe("Parent Task");
    });

    test("SubTask getInfo should override Task's getInfo", () => {
        const subtask = new SubTask("Subtask 1", "desc", "low", "Parent Task");
        expect(subtask.getInfo()).toContain("subtask of");
    });
});

describe("Task Functions", () => {
    beforeEach(() => {
        resetTasks();
    });

    test("addTask should add a task to taskList", () => {
        const task = addTask("New Task", "Test", "medium");
        expect(task).toBeDefined();
        expect(taskList).toHaveLength(1);
        expect(taskList[0].title).toBe("New Task");
    });

    test("findTaskByTitle should find an existing task", () => {
        addTask("Findable Task", "desc", "low");
        const found = findTaskByTitle("Findable Task");
        expect(found).toBeDefined();
        expect(found.title).toBe("Findable Task");
    });

    // Edge case: searching for a title that doesn't exist
    test("findTaskByTitle should return undefined when not found", () => {
        addTask("Some Task", "desc", "low");
        const found = findTaskByTitle("Nonexistent Task");
        expect(found).toBeUndefined();
    });

    test("updateTaskPriority should update an existing task's priority", () => {
        const task = addTask("Priority Task", "desc", "low");
        const result = updateTaskPriority(task.id, "high");
        expect(result).toBe(true);
        expect(task.priority).toBe("high");
    });

    // Edge case / error handling: unknown id should return false, not throw
    test("updateTaskPriority should return false for an unknown id", () => {
        const result = updateTaskPriority(999999, "high");
        expect(result).toBe(false);
    });

    // Error handling: invalid params should throw a clear error
    test("addTask should throw when given an empty title", () => {
        expect(() => addTask("", "desc", "low")).toThrow(TypeError);
    });

    test("calculateAveragePriority should return 0 for an empty task list", () => {
        expect(calculateAveragePriority([])).toBe(0);
    });

    test("getTaskDetails should destructure and return the expected fields", () => {
        const task = addTask("Detail Task", "desc", "high");
        const details = getTaskDetails(task);
        expect(details).toEqual({
            title: "Detail Task",
            description: "desc",
            priority: "high",
            completed: false
        });
    });

    test("addMultipleTasks should add several tasks using rest parameters", () => {
        const added = addMultipleTasks(
            { title: "A", description: "a", priority: "low" },
            { title: "B", description: "b", priority: "medium" }
        );
        expect(added).toHaveLength(2);
        expect(taskList).toHaveLength(2);
    });

    test("summarizeTasks should report totals without mutating input", () => {
        addTask("Done Task", "desc", "high");
        taskList[0].toggleCompletion();
        const snapshot = [...taskList];
        const summary = summarizeTasks(snapshot);
        expect(summary).toEqual({ total: 1, completed: 1, highPriority: 1 });
        expect(snapshot).toEqual(taskList); // confirms no mutation occurred
    });
});

describe("Array Operations", () => {
    test("mergeTasks should combine two arrays using the spread operator", () => {
        const merged = mergeTasks([1, 2], [3, 4]);
        expect(merged).toEqual([1, 2, 3, 4]);
    });

    // Edge case: merging with an empty array
    test("mergeTasks should handle an empty second array", () => {
        expect(mergeTasks([1, 2], [])).toEqual([1, 2]);
    });

    test("getHighPriorityTasks should filter tasks above a given priority", () => {
        resetTasks();
        addTask("Low", "desc", "low");
        addTask("High", "desc", "high");
        const result = getHighPriorityTasks("medium");
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("High");
    });

    test("sortTasksBy should return a working comparator (higher-order function)", () => {
        const tasks = [{ title: "Banana" }, { title: "Apple" }];
        const sorted = [...tasks].sort(sortTasksBy("title"));
        expect(sorted[0].title).toBe("Apple");
    });

    test("getSortedTasks should sort a clone of taskList without mutating it", () => {
        resetTasks();
        addTask("Banana", "desc", "low");
        addTask("Apple", "desc", "low");
        const originalOrder = taskList.map((task) => task.title);
        const sorted = getSortedTasks("title");
        expect(sorted.map((task) => task.title)).toEqual(["Apple", "Banana"]);
        expect(taskList.map((task) => task.title)).toEqual(originalOrder);
    });
});

describe("Array Destructuring", () => {
    test("getPriorityRange should destructure the lowest and highest priority", () => {
        expect(getPriorityRange()).toEqual({ lowest: "low", highest: "high" });
    });
});

describe("Recursive Function", () => {
    test("countCompletedTasks should count completed tasks correctly", () => {
        const tasks = [{ completed: true }, { completed: false }, { completed: true }];
        expect(countCompletedTasks(tasks)).toBe(2);
    });

    // Edge case: empty array should hit the base case immediately
    test("countCompletedTasks should return 0 for an empty array", () => {
        expect(countCompletedTasks([])).toBe(0);
    });
});

describe("TaskManager", () => {
    beforeEach(() => {
        resetTasks();
    });

    test("getTotalTasks and getCompletedTasks should reflect current state", () => {
        addTask("One", "desc", "low");
        const second = addTask("Two", "desc", "high");
        second.toggleCompletion();

        expect(TaskManager.getTotalTasks()).toBe(2);
        expect(TaskManager.getCompletedTasks()).toHaveLength(1);
    });

    test("findTaskById should locate a task using Array.prototype.find", () => {
        const task = addTask("Findable", "desc", "low");
        expect(TaskManager.findTaskById(task.id)).toBe(task);
    });
});

describe("Utils: Destructuring, Validation and Storage", () => {
    test("isHighPriority should return a real boolean", () => {
        expect(isHighPriority({ priority: "high" })).toBe(true);
        expect(isHighPriority({ priority: "low" })).toBe(false);
    });

    // Error handling: null input should not throw, just return false
    test("isHighPriority should handle null safely", () => {
        expect(isHighPriority(null)).toBe(false);
    });

    test("formatTaskName should trim and capitalize", () => {
        expect(formatTaskName("  buy groceries ")).toBe("Buy groceries");
    });

    test("formatTaskName should throw on invalid input", () => {
        expect(() => formatTaskName("")).toThrow(TypeError);
    });

    test("generateRandomId should return an integer", () => {
        const id = generateRandomId();
        expect(Number.isInteger(id)).toBe(true);
    });

    test("saveToStorage and loadFromStorage should round-trip JSON data", () => {
        const sample = [{ id: 1, title: "Saved Task" }];
        saveToStorage(sample);
        const loaded = loadFromStorage();
        expect(loaded).toEqual(sample);
    });
});
