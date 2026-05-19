// ═══════════════════════════════════════════════════
//  TaskFlow — app.js
//  Stack: HTML + Tailwind CDN + Vanilla JS
//  Persistence: localStorage (users[], todos[])
// ═══════════════════════════════════════════════════

// ── Constants ────────────────────────────────────────
const DB_KEY   = 'taskflow_db';
const USER_KEY = 'currentUser';

// ── DB helpers ───────────────────────────────────────

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  const initial = { users: [], todos: [] };
  localStorage.setItem(DB_KEY, JSON.stringify(initial));
  return initial;
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(USER_KEY);
}

// ── Router ───────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── Alert helpers ─────────────────────────────────────

function showErr(elId, msgId, msg) {
  const el = document.getElementById(elId);
  document.getElementById(msgId).textContent = msg;
  el.classList.add('show');
}

function hideErr(elId) {
  document.getElementById(elId).classList.remove('show');
}

function showOk(elId) {
  document.getElementById(elId).classList.add('show');
}

function hideOk(elId) {
  document.getElementById(elId).classList.remove('show');
}

// ── Validation ───────────────────────────────────────

function isEmail(v) {
  return /\S+@\S+\.\S+/.test(v);
}

function escHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Auth: Register ───────────────────────────────────

document.getElementById('reg-form').addEventListener('submit', e => {
  e.preventDefault();
  hideErr('reg-err');
  hideOk('reg-ok');

  const name     = document.getElementById('reg-name').value.trim();
  const email    = document.getElementById('reg-email').value.trim().toLowerCase();
  const password = document.getElementById('reg-password').value;

  if (!name)              return showErr('reg-err', 'reg-err-msg', 'Informe seu nome completo.');
  if (!email)             return showErr('reg-err', 'reg-err-msg', 'Informe seu e-mail.');
  if (!isEmail(email))    return showErr('reg-err', 'reg-err-msg', 'E-mail inválido.');
  if (!password)          return showErr('reg-err', 'reg-err-msg', 'Informe sua senha.');
  if (password.length < 6) return showErr('reg-err', 'reg-err-msg', 'A senha deve ter ao menos 6 caracteres.');

  const db = loadDB();
  if (db.users.find(u => u.email === email)) {
    return showErr('reg-err', 'reg-err-msg', 'Este e-mail já está cadastrado.');
  }

  db.users.push({ name, email, password });
  saveDB(db);

  showOk('reg-ok');
  setTimeout(() => {
    document.getElementById('reg-form').reset();
    hideOk('reg-ok');
    showScreen('screen-login');
  }, 1500);
});

// ── Auth: Login ──────────────────────────────────────

document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  hideErr('login-err');

  const email    = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  if (!email)    return showErr('login-err', 'login-err-msg', 'Informe seu e-mail.');
  if (!password) return showErr('login-err', 'login-err-msg', 'Informe sua senha.');

  const db   = loadDB();
  const user = db.users.find(u => u.email === email);

  if (!user)                    return showErr('login-err', 'login-err-msg', 'E-mail não encontrado. Cadastre-se ou verifique o e-mail.');
  if (user.password !== password) return showErr('login-err', 'login-err-msg', 'Senha incorreta. Tente novamente.');

  setUser({ name: user.name, email: user.email });
  document.getElementById('login-form').reset();
  initDashboard();
});

// ── Auth: Logout ─────────────────────────────────────

document.getElementById('btn-logout').addEventListener('click', () => {
  clearUser();
  showScreen('screen-login');
});

// ── Navigation ───────────────────────────────────────

document.getElementById('goto-register').addEventListener('click', () => showScreen('screen-register'));
document.getElementById('goto-login').addEventListener('click', () => showScreen('screen-login'));

// ── Dashboard init ───────────────────────────────────

function initDashboard() {
  const user = getUser();
  if (!user) return showScreen('screen-login');

  // Greeting
  const firstName = user.name.split(' ')[0];
  document.getElementById('dash-greeting').textContent = `Olá, ${firstName}! 👋`;

  renderTasks();
  showScreen('screen-dashboard');
}

// ── Add task ─────────────────────────────────────────

document.getElementById('add-task-form').addEventListener('submit', e => {
  e.preventDefault();
  hideErr('task-add-err');

  const title = document.getElementById('task-title').value.trim();
  const type  = document.getElementById('task-type').value;
  const desc  = document.getElementById('task-desc').value.trim();

  if (!title) {
    return showErr('task-add-err', 'task-add-err-msg', 'O título da tarefa é obrigatório.');
  }

  const user = getUser();
  const db   = loadDB();

  const todo = {
    id:          Date.now().toString(),
    userId:      user.email,          // identificado pelo e-mail
    title,
    type,
    description: desc,
    done:        false,
  };

  db.todos.push(todo);
  saveDB(db);

  document.getElementById('add-task-form').reset();
  renderTasks();
});

// ── Complete task ─────────────────────────────────────

function completeTodo(id) {
  const db   = loadDB();
  const todo = db.todos.find(t => t.id === id);
  if (todo) {
    todo.done = true;
    saveDB(db);
    renderTasks();
  }
}

// ── Badge helper ──────────────────────────────────────

function typeBadge(type) {
  const map = {
    'Trabalho': 'badge-trabalho',
    'Pessoal':  'badge-pessoal',
    'Estudos':  'badge-estudos',
  };
  return `<span class="badge ${map[type] || 'badge-trabalho'}">${escHtml(type)}</span>`;
}

// ── Render tasks ──────────────────────────────────────

function renderTasks() {
  const user  = getUser();
  const db    = loadDB();

  // Filter by userId (email) + sort: pending first, done last
  const mine = db.todos
    .filter(t => t.userId === user.email)
    .sort((a, b) => {
      if (a.done === b.done) return Number(b.id) - Number(a.id); // newer first within same group
      return a.done ? 1 : -1; // pending before done
    });

  const list       = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');

  if (mine.length === 0) {
    list.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  list.innerHTML = mine.map(todo => {
    const doneClass   = todo.done ? 'is-done' : '';
    const descHtml    = todo.description
      ? `<p class="task-desc">${escHtml(todo.description)}</p>`
      : '';
    const actionBtn   = todo.done
      ? `<span class="done-chip">
           <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
           Concluída
         </span>`
      : `<button class="btn-done" onclick="completeTodo('${todo.id}')">✓ Concluir</button>`;

    return `
      <div class="task-card ${doneClass}" id="task-${todo.id}">
        <div class="task-body">
          <div class="task-meta">
            ${typeBadge(todo.type)}
          </div>
          <p class="task-title">${escHtml(todo.title)}</p>
          ${descHtml}
        </div>
        <div class="flex-shrink-0 pt-0.5">
          ${actionBtn}
        </div>
      </div>
    `;
  }).join('');
}

// ── Bootstrap ─────────────────────────────────────────

(function boot() {
  const user = getUser();
  if (user) {
    initDashboard();
  } else {
    showScreen('screen-login');
  }
})();
