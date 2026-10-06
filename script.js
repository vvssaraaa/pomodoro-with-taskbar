// STATE
let mode = "work";
let sessionCount = 0;

const DURATIONS = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60
};

let timeLeft = DURATIONS.work;
let timer = null;
let isRunning = false;

let tasks = [];


// DOM
const modeLabel = document.getElementById("modeLabel");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");


// DISPLAY
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timeEl.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  modeLabel.textContent = `${mode.toUpperCase()} (${sessionCount}/4)`;
}


// TIMER LOGIC
function startTimer() {
  if (isRunning) return;

  isRunning = true;

  timer = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      clearInterval(timer);
      isRunning = false;

      switchMode();
      updateDisplay();

      // auto start next session
      startTimer();
      return;
    }

    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;

  mode = "work";
  sessionCount = 0;
  timeLeft = DURATIONS.work;

  updateDisplay();
}

function switchMode() {
  if (mode === "work") {
    sessionCount++;

    if (sessionCount % 4 === 0) {
      mode = "long";
    } else {
      mode = "short";
    }

  } else {
    mode = "work";
  }

  timeLeft = DURATIONS[mode];
}


// TASKS
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.done) {
      span.style.textDecoration = "line-through";
    }

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✓";
    doneBtn.onclick = () => toggleTask(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.onclick = () => deleteTask(index);

    li.append(span, doneBtn, deleteBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, done: false });
  taskInput.value = "";

  renderTasks();
  saveTasks();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
  saveTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
  saveTasks();
}


// STORAGE
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const data = localStorage.getItem("tasks");
  if (data) {
    tasks = JSON.parse(data);
  }
}


// EVENTS
startBtn.onclick = startTimer;
pauseBtn.onclick = pauseTimer;
resetBtn.onclick = resetTimer;

addTaskBtn.onclick = addTask;

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});


// INIT
function init() {
  loadTasks();
  renderTasks();

  mode = "work";
  sessionCount = 0;
  timeLeft = DURATIONS.work;

  updateDisplay();
}

init();