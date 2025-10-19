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
  // scope the selector to the edit form so we read the correct radio inputs
  const prioEl = issueForm.querySelector('input[name="priority"]:checked');
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
  card.className = "rounded-lg p-3 mb-3 shadow border border-gray-200 overflow-hidden cursor-pointer bg-[#edd5d5]/30 aspect-[2/1] flex flex-col relative";
    card.dataset.taskId = task.id;

    // Enable native drag & drop
    card.draggable = true;
    card.addEventListener('dragstart', function (e) {
      // store the task id
      e.dataTransfer.setData('text/plain', task.id);
      // small visual cue
      card.classList.add('opacity-60');
      try { e.dataTransfer.effectAllowed = 'move'; } catch (err) {}
    });
    card.addEventListener('dragend', function () {
      card.classList.remove('opacity-60');
      // remove any drag-over highlights left on containers
      document.querySelectorAll('.kanban-cards').forEach(c => c.classList.remove('ring-2','ring-offset-2','ring-indigo-200'));
    });

    const h = document.createElement("h3");
    h.className = "font-semibold text-lg text-gray-800 truncate";
    h.textContent = task.title || "Untitled";

    const p = document.createElement("p");
  p.className = "text-sm text-gray-700 mt-2 flex-1 overflow-auto no-scrollbar";
    p.textContent = task.description || "";

    // Priority badge
    const prio = (task.priority || 'low').toString().toLowerCase();
    const badge = document.createElement('div');
  // position/padding handled by Tailwind; background stays dynamic
  badge.className = 'text-xs font-semibold text-white absolute top-2 right-2 rounded-full px-2 py-1 capitalize';
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

  // Setup drag & drop listeners on the column card containers
  function setupDragDrop() {
    const containers = document.querySelectorAll('.kanban-cards');
    containers.forEach(container => {
      container.addEventListener('dragover', function (e) {
        e.preventDefault(); // allow drop
        // visual highlight
        container.classList.add('ring-2','ring-offset-2','ring-indigo-200');
        e.dataTransfer.dropEffect = 'move';
      });

      container.addEventListener('dragleave', function () {
        container.classList.remove('ring-2','ring-offset-2','ring-indigo-200');
      });

      container.addEventListener('drop', function (e) {
        e.preventDefault();
        container.classList.remove('ring-2','ring-offset-2','ring-indigo-200');
        const id = e.dataTransfer.getData('text/plain');
        if (!id) return;

        // new status is derived from container id (kanban-backlog -> backlog)
        const newStatus = container.id.replace(/^kanban-/, '');
        // update task status and re-render
        updateTaskStatus(id, newStatus);
      });
    });
  }

  // renderAll optionally accepts a searchTerm to filter tasks by title (case-insensitive)
  function renderAll(searchTerm = "") {
    const term = String(searchTerm || "").trim().toLowerCase();

    ["kanban-backlog", "kanban-in-progress", "kanban-review", "kanban-done"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = "";
    });

    // Filter tasks by title when a search term exists
    const filtered = term
      ? tasks.filter(t => (t.title || "").toLowerCase().includes(term))
      : tasks.slice();

    filtered.forEach(task => {
      const container = getContainerByKey(task.status);
      if (container) {
        container.appendChild(createCardElement(task));
      }
    });

    // update visible counts based on filtered results
    const counts = {
      backlog: filtered.filter(t => t.status === "backlog").length,
      "in-progress": filtered.filter(t => t.status === "in-progress").length,
      review: filtered.filter(t => t.status === "review").length,
      done: filtered.filter(t => t.status === "done").length,
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
    // attach drag/drop handlers after rendering
    setupDragDrop();
  }

  // helper to read current search bar value
  function getSearchTerm() {
    const el = document.getElementById("search-bar");
    return el ? el.value : "";
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
    renderAll(getSearchTerm());
    return task;
  }

  function updateTaskStatus(id, newStatus) {
    const t = tasks.find(x => x.id === id);
    if (!t) return null;
    t.status = newStatus;
    t.updatedAt = new Date().toISOString();
    saveTasks();
    renderAll(getSearchTerm());
    return t;
  }

  function updateTask(id, patch) {
    const t = tasks.find(x => x.id === id);
    if (!t) return null;
    Object.assign(t, patch);
    t.updatedAt = new Date().toISOString();
    saveTasks();
    renderAll(getSearchTerm());
    return t;
  }

  function deleteTask(id) {
    const idx = tasks.findIndex(x => x.id === id);
    if (idx === -1) return false;
    tasks.splice(idx, 1);
    saveTasks();
    renderAll(getSearchTerm());
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

  addTask(title, description, status, priority);
      if (formContainer) formContainer.classList.add("hidden");
      issueForm.reset();
    });
  }

  loadTasks();
  renderAll();

  // Live search: re-render on each input change
  const searchBar = document.getElementById("search-bar");
  if (searchBar) {
    searchBar.addEventListener("input", function (e) {
      renderAll(e.target.value);
    });
  }
});
