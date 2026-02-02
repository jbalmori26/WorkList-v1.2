const API_URL = 'http://localhost:3000/tasks';

const input = document.querySelector("input");
const addBtn = document.querySelector(".btn-add");
const ul = document.querySelector("ul");
const empty = document.querySelector(".empty");

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(API_URL);
        const savedTasks = await response.json();
        
        if (savedTasks.length > 0) {
            empty.style.display = "none";
            savedTasks.forEach(task => {
                renderTask(task.text, task.completed, task.id);
            });
        } else {
            empty.style.display = "block";
        }
    } catch (error) {
        console.error("Error cargando tareas iniciales:", error);
    }
});

addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const text = input.value.trim();

    if (text !== "") {
        renderTask(text, false);
        saveTasks(); 
        input.value = "";
        checkEmpty();
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
    checkBtn.onclick = async function() {
        p.classList.toggle("completed");
        const isCompleted = p.classList.contains("completed");
        if (li.dataset.id) {
            await updateTaskStatus(li.dataset.id, isCompleted);
        }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.className = "btn-delete";
    deleteBtn.onclick = function() {
        li.remove();
        saveTasks(); 
        checkEmpty();
        removeTask(li.dataset.id);
    };

    li.appendChild(checkBtn);
    li.appendChild(p);
    li.appendChild(deleteBtn);
    ul.appendChild(li);
}

async function saveTasks() {
    const items = document.querySelectorAll("li");

    for (const li of items) {
        if (li.dataset.id) continue; 

        const task = {
            text: li.querySelector("p").textContent,
            completed: li.querySelector("p").classList.contains("completed")
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });

        const data = await response.json();
        li.dataset.id = data.id; 
    }
}

async function updateTaskStatus(id, completed) {
    const url = `${API_URL}/${id}`;
    try {
        const response = await fetch(url, {
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: completed })
        });

        if (!response.ok) {
            throw new Error("Error al actualizar la tarea");
        }
    } catch (error) {
        console.error("Hubo un problema:", error);
    }
}

async function removeTask(id) {
    const url = `${API_URL}/${id}`;
    await fetch(url, {method: 'DELETE'});
}

function checkEmpty() {
    const items = document.querySelectorAll("li");
    empty.style.display = (items.length === 0) ? "block" : "none";
}