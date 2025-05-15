const params = new URLSearchParams(window.location.search);
const username = params.get("user");
const storageKey = `sticky_${username}`;
document.getElementById("userLabel").textContent = `ユーザー: ${username}`;

let taskId = 0;

function addTask(type) {
  const inputId = {
    normal: "input-normal",
    report: "input-report",
    urgent: "input-urgent"
  };

  const colorClass = {
    normal: "right-green",
    report: "right-blue",
    urgent: "pink"
  };

  const input = document.getElementById(inputId[type]);
  const title = input.value;
  if (title.trim() === "") return;

  const note = document.createElement("div");
  note.classList.add("note", colorClass[type]);
  note.innerText = title;

  document.getElementById("stage-todo").appendChild(note);
  input.value = ""; // 入力欄リセット
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
