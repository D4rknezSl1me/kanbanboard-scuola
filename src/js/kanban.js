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
  const USERS_KEY = 'kanban_users';

  function loadUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Errore localStorage users:', e);
      return [];
    }
  }

  // Menu a tendina utenti
  function populateUserSelects() {
    const users = loadUsers();
    const sel = document.getElementById('user');
    const sel1 = document.getElementById('user1');
    [sel, sel1].forEach(s => {
      if (!s) return;
      // Rimuovi gli utenti gia presenti
      Array.from(s.querySelectorAll('option[data-user-id]')).forEach(o => o.remove());
      users.forEach(u => {
        const opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = u.name;
        opt.setAttribute('data-user-id', u.id);
        s.appendChild(opt);
      });
    });
  }

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
    
  const prio = (task.priority || 'low').toString().toLowerCase();
  const prioInputs = issueForm.querySelectorAll('input[name="priority"]');
  prioInputs.forEach(input => {
    input.checked = (String(input.value).toLowerCase() === prio);
  });
  
  const userSelect = document.getElementById('user1');
  if (userSelect) {
    populateUserSelects();
    if (task.userId) {
      userSelect.value = task.userId;
    } else {
      userSelect.value = '';
    }
  }

  issueForm.onsubmit = function (e) {
    e.preventDefault();
    const title = document.getElementById("title1").value.trim();
    const description = document.getElementById("description1").value.trim();
    const status = document.getElementById("status1").value;
    const prioEl = issueForm.querySelector('input[name="priority"]:checked');
    const priority = prioEl ? prioEl.value : "low";
  
    const userSel = document.getElementById('user1');
    const userId = userSel && userSel.value ? userSel.value : null;
    const userName = userSel && userSel.value ? (userSel.options[userSel.selectedIndex].text || null) : null;

    updateTask(task.id, { title, description, status, priority, userId, userName });
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
      console.error("Errore localStorage (deferred):", e);
    }
  }

  function generateId() {
    try {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
    } catch (e) {}

    // In caso il browser non supporti crypto.randomUUID Stringa Base 36 - 0. 7 caratteri
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function createCardElement(task) {
    const card = document.createElement("article");
  card.className = "rounded-lg p-3 mb-3 shadow border border-gray-200 overflow-hidden cursor-pointer bg-[#edd5d5]/30 aspect-[2/1] flex flex-col relative";
    card.dataset.taskId = task.id;

    // Abilita native drag & drop
    card.draggable = true;
    card.addEventListener('dragstart', function (e) {
      // setData to drag event data
      e.dataTransfer.setData('text/plain', task.id);
      card.classList.add('opacity-60');
      try { e.dataTransfer.effectAllowed = 'move'; } catch (err) {}
    });
    card.addEventListener('dragend', function () {
      card.classList.remove('opacity-60');
      // reset stile colonne
      document.querySelectorAll('.kanban-cards').forEach(c => c.classList.remove('ring-2','ring-offset-2','ring-indigo-200'));
    });

    const h = document.createElement("h3");
    h.className = "font-semibold text-lg text-gray-800 truncate";
    h.textContent = task.title || "Untitled";

    const p = document.createElement("p");
  p.className = "text-sm text-gray-700 mt-2 flex-1 overflow-auto no-scrollbar";
    p.textContent = task.description || "";

    const prio = (task.priority || 'low').toString().toLowerCase();
    const badge = document.createElement('div');

    badge.className = 'text-xs font-semibold text-white rounded-full px-2 py-1 capitalize';
    const colors = { low: '#16a34a', medium: '#0ea5e9', high: '#f59e0b', critical: '#ef4444' };
    badge.style.background = colors[prio] || colors.low;
    badge.textContent = prio;

  const owner = document.createElement('div');

  owner.className = 'text-xs font-medium text-white rounded-full px-2 py-1 bg-gray-600/60';
  owner.textContent = task.userName || 'Anonimo';
  owner.title = task.userName || 'Anonimo';

  const headerRight = document.createElement('div');
  headerRight.className = 'absolute top-2 right-2 flex items-center gap-2';
  headerRight.appendChild(owner);
  headerRight.appendChild(badge);

    const btnContainer = document.createElement("div");
    btnContainer.className = "mt-3 flex justify-between";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Modifica";
    editBtn.className = "bg-[#185e77] text-white text-sm px-2 py-1 rounded hover:bg-blue-600";
    editBtn.addEventListener("click", function () {
      openEditForm(task);
    });

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


  card.appendChild(headerRight);
    card.appendChild(h);
    card.appendChild(p);
    card.appendChild(btnContainer);

    card.addEventListener("dblclick", function () {
      // backlog -> in-progress -> review -> done -> backlog
      const order = ["backlog", "in-progress", "review", "done"];
      const idx = order.indexOf(task.status);
      const next = order[(idx + 1) % order.length];
      updateTaskStatus(task.id, next);
    });

    return card;
  }

  // Setup drag & drop
  let dragDropInitialized = false;
  function setupDragDrop() {
    if (dragDropInitialized) return;
    const board = document.querySelector('.kanban-board');
    if (!board) return;

    let currentHighlight = null;
    // colonne, si attiva a spam quando c'e' un draggable sopra
    board.addEventListener('dragover', function (e) {
      const container = e.target.closest('.kanban-cards');
      if (!container) return;
      e.preventDefault();
      if (currentHighlight && currentHighlight !== container) {
        currentHighlight.classList.remove('ring-2','ring-offset-2','ring-indigo-200');
      }
      currentHighlight = container;
      container.classList.add('ring-2','ring-offset-2','ring-indigo-200');
      try { e.dataTransfer.dropEffect = 'move'; } catch (err) {}
    });

    board.addEventListener('dragleave', function (e) {
      const container = e.target.closest('.kanban-cards');
      if (!container) return;
      container.classList.remove('ring-2','ring-offset-2','ring-indigo-200');
      if (currentHighlight === container) currentHighlight = null;
    });

    board.addEventListener('drop', function (e) {
      const container = e.target.closest('.kanban-cards');
      if (!container) return;
      e.preventDefault();
      container.classList.remove('ring-2','ring-offset-2','ring-indigo-200');
      currentHighlight = null;
      // Riprende l'id salvato all'inizio
      const id = e.dataTransfer.getData('text/plain');
      if (!id) return;
      const newStatus = container.id.replace(/^kanban-/, '');
      updateTaskStatus(id, newStatus);
    });

    dragDropInitialized = true;
  }

  // mostra filtrando (case-insensitive)
  function renderAll(searchTerm = "") {
    const term = String(searchTerm || "").trim().toLowerCase();

    ["kanban-backlog", "kanban-in-progress", "kanban-review", "kanban-done"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = "";
    });

    // filtri
    const filtered = term
      ? tasks.filter(t => (t.title || "").toLowerCase().includes(term))
      : tasks.slice();

    filtered.forEach(task => {
      const container = getContainerByKey(task.status);
      if (container) {
        container.appendChild(createCardElement(task));
      }
    });

    // aggiorna contatori
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
    // rimettere drag & drop ai nuovi elementi
    setupDragDrop();

    // mostra se la colonna e' vuota
    [
      ["kanban-backlog", counts.backlog],
      ["kanban-in-progress", counts["in-progress"]],
      ["kanban-review", counts.review],
      ["kanban-done", counts.done]
    ].forEach(([id, count]) => {
      const container = document.getElementById(id);
      if (!container) return;
      if (count === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'text-gray-500 text-sm italic text-center mt-2';
        placeholder.textContent = 'Nessuna Issue';
        container.appendChild(placeholder);
      }
    });
  }

  // legge il valore della search bar
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
      userId: null,
      userName: null,
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

  const userSel = document.getElementById('user');
  const userId = userSel && userSel.value ? userSel.value : null;
  const userName = userSel && userSel.value ? (userSel.options[userSel.selectedIndex].text || null) : null;

  const created = addTask(title, description, status, priority);
  if (created) {
    created.userId = userId;
    created.userName = userName;
    saveTasks();
    renderAll(getSearchTerm());
  }
      if (formContainer) formContainer.classList.add("hidden");
      issueForm.reset();
    });
  }

  loadTasks();
  populateUserSelects();
  renderAll();

  const searchBar = document.getElementById("search-bar");
  if (searchBar) {
    searchBar.addEventListener("input", function (e) {
      renderAll(e.target.value);
    });
  }
});
