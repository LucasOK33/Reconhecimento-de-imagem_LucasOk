// ─── Storage helpers ────────────────────────────────────────────────────────

const DB_KEY = 'taskflow_db';

function loadDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) return JSON.parse(raw);
  const initial = { users: [], todos: [] };
  localStorage.setItem(DB_KEY, JSON.stringify(initial));
  return initial;
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getCurrentUser() {
  const raw = localStorage.getItem('currentUser');
  return raw ? JSON.parse(raw) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

// ─── Screen router ───────────────────────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ─── Error / success helpers ─────────────────────────────────────────────────

function showError(elId, msgId, message) {
  const el = document.getElementById(elId);
  document.getElementById(msgId).textContent = message;
  el.classList.remove('hidden');
}

function hideError(elId) {
  document.getElementById(elId).classList.add('hidden');
}

// ─── Auth: Register ──────────────────────────────────────────────────────────

document.getElementById('register-form').addEventListener('submit', e => {
  e.preventDefault();
  hideError('register-error');
  document.getElementById('register-success').classList.add('hidden');

  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const password = document.getElementById('reg-password').value;

  if (!name) return showError('register-error', 'register-error-msg', 'Por favor, informe seu nome.');
  if (!email) return showError('register-error', 'register-error-msg', 'Por favor, informe seu e-mail.');
  if (!/\S+@\S+\.\S+/.test(email)) return showError('register-error', 'register-error-msg', 'E-mail inválido.');
  if (!password) return showError('register-error', 'register-error-msg', 'Por favor, informe sua senha.');
  if (password.length < 6) return showError('register-error', 'register-error-msg', 'A senha deve ter ao menos 6 caracteres.');

  const db = loadDB();
  if (db.users.find(u => u.email === email)) {
    return showError('register-error', 'register-error-msg', 'Este e-mail já está cadastrado.');
  }

  const user = { id: Date.now().toString(), name, email, password };
  db.users.push(user);
  saveDB(db);

  document.getElementById('register-success').classList.remove('hidden');
  setTimeout(() => {
    document.getElementById('register-form').reset();
    document.getElementById('register-success').classList.add('hidden');
    showScreen('screen-login');
  }, 1500);
});

// ─── Auth: Login ─────────────────────────────────────────────────────────────

document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  hideError('login-error');

  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  if (!email) return showError('login-error', 'login-error-msg', 'Por favor, informe seu e-mail.');
  if (!password) return showError('login-error', 'login-error-msg', 'Por favor, informe sua senha.');

  const db = loadDB();
  const user = db.users.find(u => u.email === email);

  if (!user) return showError('login-error', 'login-error-msg', 'E-mail não encontrado. Verifique ou cadastre-se.');
  if (user.password !== password) return showError('login-error', 'login-error-msg', 'Senha incorreta. Tente novamente.');

  setCurrentUser({ id: user.id, name: user.name, email: user.email });
  document.getElementById('login-form').reset();
  initDashboard();
});

// ─── Auth: Logout ────────────────────────────────────────────────────────────

document.getElementById('btn-logout').addEventListener('click', () => {
  clearCurrentUser();
  currentFilter = 'all';
  showScreen('screen-login');
});

// ─── Navigation links ────────────────────────────────────────────────────────

document.getElementById('goto-register').addEventListener('click', () => showScreen('screen-register'));
document.getElementById('goto-login').addEventListener('click', () => showScreen('screen-login'));

// ─── Dashboard ───────────────────────────────────────────────────────────────

let currentFilter = 'all';

function initDashboard() {
  const user = getCurrentUser();
  if (!user) return showScreen('screen-login');

  document.getElementById('header-username').textContent = user.name;
  document.getElementById('header-email').textContent = user.email;

  renderTasks();
  showScreen('screen-dashboard');
}

// ─── Todos: Add ──────────────────────────────────────────────────────────────

document.getElementById('add-task-form').addEventListener('submit', e => {
  e.preventDefault();
  const taskError = document.getElementById('task-error');
  const title = document.getElementById('task-title').value.trim();

  if (!title) {
    taskError.classList.remove('hidden');
    setTimeout(() => taskError.classList.add('hidden'), 3000);
    return;
  }

  taskError.classList.add('hidden');

  const user = getCurrentUser();
  const priority = document.getElementById('task-priority').value;
  const db = loadDB();

  const todo = {
    id: Date.now().toString(),
    userId: user.id,
    title,
    priority,
    done: false,
    createdAt: new Date().toISOString(),
  };

  db.todos.push(todo);
  saveDB(db);

  document.getElementById('task-title').value = '';
  renderTasks();
});

// ─── Todos: Toggle done ───────────────────────────────────────────────────────

function toggleTodo(id) {
  const db = loadDB();
  const todo = db.todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveDB(db);
    renderTasks();
  }
}

// ─── Todos: Delete ────────────────────────────────────────────────────────────

function deleteTodo(id) {
  const db = loadDB();
  db.todos = db.todos.filter(t => t.id !== id);
  saveDB(db);
  renderTasks();
}

// ─── Todos: Render ───────────────────────────────────────────────────────────

function renderTasks() {
  const user = getCurrentUser();
  const db = loadDB();

  const userTodos = db.todos
    .filter(t => t.userId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filtered = userTodos.filter(t => {
    if (currentFilter === 'pending') return !t.done;
    if (currentFilter === 'done') return t.done;
    return true;
  });

  // Stats
  const total = userTodos.length;
  const done = userTodos.filter(t => t.done).length;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-pending').textContent = total - done;
  document.getElementById('stat-done').textContent = done;

  const list = document.getElementById('task-list');
  const empty = document.getElementById('empty-state');

  if (filtered.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  list.innerHTML = filtered.map(todo => {
    const badgeClass = { high: 'badge-high', medium: 'badge-medium', low: 'badge-low' }[todo.priority];
    const badgeLabel = { high: 'Alta', medium: 'Média', low: 'Baixa' }[todo.priority];
    const doneClass = todo.done ? 'done' : '';
    return `
      <div class="task-item ${doneClass}" id="task-${todo.id}">
        <input
          type="checkbox"
          id="check-${todo.id}"
          ${todo.done ? 'checked' : ''}
          onchange="toggleTodo('${todo.id}')"
        />
        <label for="check-${todo.id}">${escapeHtml(todo.title)}</label>
        <span class="badge ${badgeClass}">${badgeLabel}</span>
        <button class="btn-delete" onclick="deleteTodo('${todo.id}')" title="Excluir tarefa" aria-label="Excluir tarefa">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    `;
  }).join('');
}

// ─── Filter tabs ─────────────────────────────────────────────────────────────

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active-filter'));
    btn.classList.add('active-filter');
    renderTasks();
  });
});

// ─── Utility ─────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Init ────────────────────────────────────────────────────────────────────

(function init() {
  const user = getCurrentUser();
  if (user) {
    initDashboard();
  } else {
    showScreen('screen-login');
  }
})();
