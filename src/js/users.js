(function () {
  const USERS_KEY = 'kanban_users';

  function generateId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
  }

  function loadUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to load users', e);
      return [];
    }
  }

  function saveUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  }

  function escapeHtml(str) {
    return (str + '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function renderUsers() {
    const list = document.getElementById('users-list');
    const users = loadUsers();
    list.innerHTML = '';

    if (!users.length) {
      const empty = document.createElement('div');
      empty.className = 'text-center text-gray-600 py-6';
      empty.textContent = 'Nessun utente';
      list.appendChild(empty);
      return;
    }

    users.forEach((u) => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between bg-white rounded p-3 shadow';

      const name = document.createElement('div');
      name.className = 'font-medium text-gray-800';
      name.innerHTML = escapeHtml(u.name);

      const controls = document.createElement('div');
      controls.className = 'flex items-center gap-2';

      const del = document.createElement('button');
      del.className = 'text-sm text-red-600 hover:underline px-2 py-1';
      del.textContent = 'Elimina';
      del.setAttribute('data-id', u.id);
      del.addEventListener('click', () => {
        if (!confirm('Eliminare l\'utente "' + u.name + '"?')) return;
        removeUser(u.id);
      });

      controls.appendChild(del);
      row.appendChild(name);
      row.appendChild(controls);
      list.appendChild(row);
    });
  }

  function addUser(name) {
    const trimmed = (name || '').trim();
    if (!trimmed) return { ok: false, error: 'Il nome non può essere vuoto' };

    const users = loadUsers();
    if (users.some(u => u.name.toLowerCase() === trimmed.toLowerCase())) {
      return { ok: false, error: 'Utente già presente' };
    }

    const user = { id: generateId(), name: trimmed };
    users.push(user);
    saveUsers(users);
    renderUsers();
    return { ok: true, user };
  }

  function removeUser(id) {
    const users = loadUsers().filter((u) => u.id !== id);
    saveUsers(users);
    renderUsers();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('user-form');
    const input = document.getElementById('user-name');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = input.value;
      const result = addUser(name);
      if (!result.ok) {
        // simple inline feedback
        alert(result.error || 'Errore');
        return;
      }
      input.value = '';
      input.focus();
    });

    renderUsers();
  });

  // Expose for console debugging (optional)
  window._userManager = {
    load: loadUsers,
    save: saveUsers,
    add: addUser,
    remove: removeUser,
  };
})();
