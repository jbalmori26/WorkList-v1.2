const input = document.querySelector("input");
const addBtn = document.querySelector(".btn-add");
const ul = document.querySelector("ul");
const empty = document.querySelector(".empty");

// Counter elements
const totalCounter = document.querySelector(".counter-total");
const incompleteCounter = document.querySelector(".counter-incomplete");
const completeCounter = document.querySelector(".counter-complete");

// Load tasks from localStorage
document.addEventListener("DOMContentLoaded", () => {
    const savedTasks = getTasksFromLocalStorage();
    
    if (savedTasks.length > 0) {
        empty.style.display = "none";
        savedTasks.forEach(task => {
            renderTask(task.text, task.completed, task.id);
        });
    } else {
        empty.style.display = "block";
    }
    
    updateCounters();
});

addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const text = input.value.trim();

    if (text !== "") {
        const id = Date.now().toString();
        renderTask(text, false, id);
        saveTasksToLocalStorage(); 
        input.value = "";
        checkEmpty();
        updateCounters();
    }
});

function renderTask(text, isCompleted, id = null) {
    const li = document.createElement("li");
    
    if (id) {
        li.dataset.id = id;
    }
    
    const p = document.createElement("p");
    p.textContent = text;
    if (isCompleted) p.classList.add("completed");
    
    const checkBtn = document.createElement("button");
    checkBtn.textContent = "✓";
    checkBtn.className = "btn-check";
    checkBtn.onclick = function() {
        p.classList.toggle("completed");
        saveTasksToLocalStorage();
        updateCounters();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "btn-delete";
    deleteBtn.onclick = function() {
        li.remove();
        saveTasksToLocalStorage(); 
        checkEmpty();
        updateCounters();
    };

    li.appendChild(checkBtn);
    li.appendChild(p);
    li.appendChild(deleteBtn);
    ul.appendChild(li);
}

// LocalStorage functions
function getTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

function saveTasksToLocalStorage() {
    const items = document.querySelectorAll("li");
    const tasks = [];

    items.forEach(li => {
        const task = {
            id: li.dataset.id,
            text: li.querySelector("p").textContent,
            completed: li.querySelector("p").classList.contains("completed")
        };
        tasks.push(task);
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update counters
function updateCounters() {
    const items = document.querySelectorAll("li");
    const total = items.length;
    let completed = 0;
    let incomplete = 0;

    items.forEach(li => {
        if (li.querySelector("p").classList.contains("completed")) {
            completed++;
        } else {
            incomplete++;
        }
    });

    if (totalCounter) totalCounter.textContent = total;
    if (completeCounter) completeCounter.textContent = completed;
    if (incompleteCounter) incompleteCounter.textContent = incomplete;
}

function checkEmpty() {
    const items = document.querySelectorAll("li");
    empty.style.display = (items.length === 0) ? "block" : "none";
}