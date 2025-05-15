const params = new URLSearchParams(window.location.search);
const username = params.get("user");
const storageKey = `sticky_${username}`;
document.getElementById("userLabel").textContent = `ユーザー: ${username}`;

let taskId = 0;

function addTask() {
  const text = document.getElementById("taskText").value.trim();
  if (!text) return;

  const task = createTaskElement(text);
  document.getElementById("todo").appendChild(task);
  saveData();
  document.getElementById("taskText").value = "";
}

function createTaskElement(text) {
  const task = document.createElement("div");
  task.className = "task";
  task.textContent = text;
  task.draggable = true;
  task.id = `task-${taskId++}`;
  task.ondragstart = drag;
  return task;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("text");
  const task = document.getElementById(id);
  ev.target.closest(".column").appendChild(task);
  saveData();
}

function saveData() {
  const data = {};
  ["todo", "doing", "done"].forEach(stage => {
    const column = document.getElementById(stage);
    data[stage] = Array.from(column.children)
      .filter(el => el.classList.contains("task"))
      .map(el => el.textContent);
  });
  sessionStorage.setItem(storageKey, JSON.stringify(data));
}

function loadData() {
  const saved = sessionStorage.getItem(storageKey);
  if (!saved) return;
  const data = JSON.parse(saved);
  ["todo", "doing", "done"].forEach(stage => {
    const column = document.getElementById(stage);
    data[stage].forEach(text => {
      const task = createTaskElement(text);
      column.appendChild(task);
    });
  });
}

window.onload = loadData;
