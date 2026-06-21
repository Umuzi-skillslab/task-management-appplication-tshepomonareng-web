// DOM Manipulation - Fixed Version
import { addTask, taskList, TaskManager } from "./app.js";
import { saveToStorage, loadFromStorage, formatTaskName } from "./utils.js";

// Fix: corrected selectors (was getElementById(".add-task-btn") - mixed ID/class syntax,
// and querySelector("task-input") - missing "#")
function setupEventListeners() {
    const addButton = document.querySelector(".add-task-btn");
    const taskForm = document.querySelector(".add-task-section");
    const taskListContainer = document.getElementById("task-list");

    // Null checks before attaching listeners
    if (addButton) {
        addButton.addEventListener("click", handleAddTask);
    }

    if (taskForm) {
        // Submit listener in case the section is later wrapped in a real <form>
        taskForm.addEventListener("submit", (event) => {
            event.preventDefault();
            handleAddTask(event);
        });
    }

    // Event delegation: one listener on the container handles clicks on any
    // current or future task item, rather than attaching one listener per task.
    if (taskListContainer) {
        taskListContainer.addEventListener("click", handleTaskClick);
    }

    // Additional listeners: keep the UI in sync on load and allow Enter-to-submit
    const titleInput = document.getElementById("title");
    if (titleInput) {
        titleInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleAddTask(event);
            }
        });
    }

    const descInput = document.getElementById("description");
    if (descInput) {
        descInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleAddTask(event);
            }
        });
    }

    restoreTasksFromStorage();
}

// Function with DOM manipulation errors fixed
function handleAddTask(event) {
    if (event && typeof event.preventDefault === "function") {
        event.preventDefault();
    }

    const titleInput = document.getElementById("title");
    const descInput = document.getElementById("description");
    const priorityInput = document.getElementById("priority");

    // Null checks before reading values
    if (!titleInput || !descInput) {
        console.error("Required input fields are missing from the page");
        return;
    }

    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const priority = priorityInput ? priorityInput.value : "low";

    if (title.length === 0) {
        console.error("Cannot add a task without a title");
        return;
    }

    try {
        addTask(formatTaskName(title), description, priority);
        displayTasks();
        saveToStorage(taskList);

        // Clear inputs after adding
        titleInput.value = "";
        descInput.value = "";
        if (priorityInput) priorityInput.value = "low";
    } catch (error) {
        console.error(`Could not add task: ${error.message}`);
    }
}

// Function with better selectors and template literals
function displayTasks() {
    const container = document.getElementById("task-list");

    // Null check before manipulating DOM
    if (!container) {
        console.error("Task list container not found");
        return;
    }

    // Clear existing content before re-rendering
    container.innerHTML = "";

    for (const task of taskList) {
        const div = document.createElement("div");
        div.className = "task-item";
        div.dataset.taskId = task.id;

        // Template literals instead of string concatenation
        div.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Priority: ${task.priority}</p>
            <p>Status: ${task.completed ? "Completed" : "Pending"}</p>
            <button class="toggle-task-btn" data-task-id="${task.id}">
                ${task.completed ? "Mark Incomplete" : "Mark Complete"}
            </button>
            <button class="delete-task-btn" data-task-id="${task.id}">Delete</button>
        `;

        container.appendChild(div);
    }

    updateStatistics();
}

// Event delegation handler: figures out which button was clicked, and on what task,
// using event.target rather than attaching individual listeners per task.
function handleTaskClick(event) {
    const target = event.target;

    if (!target || typeof target.matches !== "function") {
        return;
    }

    const taskId = Number(target.dataset.taskId);

    if (target.matches(".toggle-task-btn")) {
        const task = TaskManager.findTaskById(taskId);
        if (task) {
            task.toggleCompletion();
            displayTasks();
            saveToStorage(taskList);
        }
    } else if (target.matches(".delete-task-btn")) {
        const index = taskList.findIndex((task) => task.id === taskId);
        if (index !== -1) {
            taskList.splice(index, 1);
            displayTasks();
            saveToStorage(taskList);
        }
    }
}

// Updates the statistics panel using the task list's current state
function updateStatistics() {
    const statsContainer = document.querySelector(".statistics");
    if (!statsContainer) {
        return;
    }

    const total = TaskManager.getTotalTasks();
    const completed = TaskManager.getCompletedTasks().length;

    statsContainer.innerHTML = `<p>${completed} of ${total} tasks completed</p>`;
}

// Loads any previously saved tasks from localStorage and renders them
function restoreTasksFromStorage() {
    const savedTasks = loadFromStorage();

    if (Array.isArray(savedTasks) && savedTasks.length > 0) {
        savedTasks.forEach((savedTask) => {
            try {
                addTask(savedTask.title, savedTask.description, savedTask.priority);
            } catch (error) {
                console.error(`Skipped invalid saved task: ${error.message}`);
            }
        });
    }

    displayTasks();
}

// Fix: initialization now waits for DOMContentLoaded instead of running immediately
if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", setupEventListeners);
}

export { setupEventListeners, handleAddTask, displayTasks, handleTaskClick, updateStatistics };
