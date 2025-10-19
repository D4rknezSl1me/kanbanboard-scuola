document.addEventListener("DOMContentLoaded", function () {
  // status -> container id map
  function getContainerByKey(key) {
    const map = {
      "backlog": "kanban-backlog",
      "in-progress": "kanban-in-progress",
      "review": "kanban-review",
      "done": "kanban-done",
      "kanban-backlog": "kanban-backlog",
      "kanban-in-progress": "kanban-in-progress",
      "kanban-review": "kanban-review",
      "kanban-done": "kanban-done",
    };

    if (!key) return document.getElementById("kanban-backlog");
    const normalized = String(key).toLowerCase();
    const id = map[normalized] || map[key] || "kanban-backlog";
    return document.getElementById(id);
  }

  const STORAGE_KEY = "kanban_tasks";
  let tasks = [];

  function openEditForm(task) {
  const formContainer = document.getElementById("form-edit");
  const formSection = document.getElementById("form-section-edit");
  const issueForm = document.getElementById("issue-form-edit");

  if (!formContainer || !issueForm) return;

  // Mostra il form
  formSection.classList.remove("hidden");
  formContainer.classList.remove("hidden");

  // Compila i campi con i dati esistenti
  document.getElementById("title1").value = task.title || "";
  document.getElementById("description1").value = task.description || "";
  document.getElementById("status1").value = task.status || "backlog";

  // Cambia comportamento del submit
  issueForm.onsubmit = function (e) {
    e.preventDefault();
    const title = document.getElementById("title1").value.trim();
    const description = document.getElementById("description1").value.trim();
    const status = document.getElementById("status1").value;
    const prioEl = document.querySelector('input[name="priority1"]:checked');
    const priority = prioEl ? prioEl.value : "low";


    updateTask(task.id, { title, description, status,  priority});
    issueForm.reset();
    formContainer.classList.add("hidden");
    formSection.classList.add("hidden");

    // Ripristina submit originale dopo modifica
    issueForm.onsubmit = null;
  };
}

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Errore localStorage:", e);
      tasks = [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Errore localStorage:", e);
    }
  }

  function generateId() {
    try {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
    } catch (e) {}

    // In caso il browser non supporti crypto.randomUUID
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function createCardElement(task) {
    const card = document.createElement("article");
    card.className = "bg-white bg-opacity-90 rounded-lg p-3 mb-3 shadow border border-gray-200 overflow-hidden cursor-pointer";
    card.style.aspectRatio = "4 / 3";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.position = "relative";
    card.dataset.taskId = task.id;

    const h = document.createElement("h3");
    h.className = "font-semibold text-lg text-gray-800 truncate";
    h.textContent = task.title || "Untitled";

    const p = document.createElement("p");
    p.className = "text-sm text-gray-700 mt-2";
    p.style.flex = "1 1 auto";
    p.style.overflow = "auto";
    p.textContent = task.description || "";

    // Priority badge
    const prio = (task.priority || 'low').toString().toLowerCase();
    const badge = document.createElement('div');
    badge.className = 'text-xs font-semibold text-white';
    badge.style.position = 'absolute';
    badge.style.top = '8px';
    badge.style.right = '8px';
    badge.style.borderRadius = '999px';
    badge.style.padding = '4px 8px';
    badge.style.textTransform = 'capitalize';
    const colors = { low: '#16a34a', medium: '#0ea5e9', high: '#f59e0b', critical: '#ef4444' };
    badge.style.background = colors[prio] || colors.low;
    badge.textContent = prio;

    // --- Nuovi bottoni ---
    const btnContainer = document.createElement("div");
    btnContainer.className = "mt-3 flex justify-between";

    // Bottone Modifica
    const editBtn = document.createElement("button");
    editBtn.textContent = "Modifica";
    editBtn.className = "bg-[#185e77] text-white text-sm px-2 py-1 rounded hover:bg-blue-600";
    editBtn.addEventListener("click", function () {
      openEditForm(task);
    });

    // Bottone Cancella
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Cancella";
    deleteBtn.className = "bg-[#dd440e] text-white text-sm px-2 py-1 rounded hover:bg-red-600";
    deleteBtn.addEventListener("click", function () {
      if (confirm("Vuoi davvero cancellare questo task?")) {
        deleteTask(task.id);
      }
    });

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);


    card.appendChild(badge);
    card.appendChild(h);
    card.appendChild(p);
    card.appendChild(btnContainer);

    // Double-click per procedere allo stato successivo
    card.addEventListener("dblclick", function () {
      // backlog -> in-progress -> review -> done -> backlog
      const order = ["backlog", "in-progress", "review", "done"];
      const idx = order.indexOf(task.status);
      const next = order[(idx + 1) % order.length];
      updateTaskStatus(task.id, next);
    });

    return card;
  }

  function renderAll() {
    ["kanban-backlog", "kanban-in-progress", "kanban-review", "kanban-done"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = "";
    });

    tasks.forEach(task => {
      const container = getContainerByKey(task.status);
      if (container) {
        container.appendChild(createCardElement(task));
      }
    });

    updateCounts();
  }

  function addTask(title, description, status, priority) {
    const task = {
      id: generateId(),
      title: title || "Untitled",
      description: description || "",
      status: status || "backlog",
      priority: (priority || 'low').toString().toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.push(task);
    saveTasks();
    renderAll();
    return task;
  }

  function updateTaskStatus(id, newStatus) {
    const t = tasks.find(x => x.id === id);
    if (!t) return null;
    t.status = newStatus;
    t.updatedAt = new Date().toISOString();
    saveTasks();
    renderAll();
    return t;
  }

  function updateTask(id, patch) {
    const t = tasks.find(x => x.id === id);
    if (!t) return null;
    Object.assign(t, patch);
    t.updatedAt = new Date().toISOString();
    saveTasks();
    renderAll();
    return t;
  }

  function deleteTask(id) {
    const idx = tasks.findIndex(x => x.id === id);
    if (idx === -1) return false;
    tasks.splice(idx, 1);
    saveTasks();
    renderAll();
    return true;
  }

  function getTasks() {
    return tasks.slice();
  }

  function updateCounts() {
    const counts = {
      backlog: tasks.filter(t => t.status === "backlog").length,
      "in-progress": tasks.filter(t => t.status === "in-progress").length,
      review: tasks.filter(t => t.status === "review").length,
      done: tasks.filter(t => t.status === "done").length,
    };

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText("backlog-count", counts.backlog);
    setText("in-progress-count", counts["in-progress"]);
    setText("review-count", counts.review);
    setText("done-count", counts.done);

    setText("kanban-backlog-count", counts.backlog);
    setText("kanban-in-progress-count", counts["in-progress"]);
    setText("kanban-review-count", counts.review);
    setText("kanban-done-count", counts.done);
  }

  function addCardToColumn(title, description, columnKey) {
    const status = (columnKey || "backlog").toString().toLowerCase();
    const created = addTask(title, description, status);

    const container = getContainerByKey(created.status);
    if (!container) return null;
    return container.querySelector(`[data-task-id="${created.id}"]`);
  }

  // Per usarle in altri script
  window.addCardToColumn = addCardToColumn;
  window.addTask = addTask;
  window.getTasks = getTasks;
  window.updateTaskStatus = updateTaskStatus;
  window.updateTask = updateTask;
  window.deleteTask = deleteTask;

  const issueForm = document.getElementById("issue-form");
  const formContainer = document.getElementById("form");
  if (issueForm) {
    issueForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const title = document.getElementById("title").value.trim();
      const description = document.getElementById("description").value.trim();
      const status = document.getElementById("status").value;
      const priorityEl = document.querySelector('input[name="priority"]:checked');
      const priority = priorityEl ? priorityEl.value : 'low';

      addTask(title, description, status);

      if (formContainer) formContainer.classList.add("hidden");
      issueForm.reset();
    });
  }

  loadTasks();
  renderAll();
});
