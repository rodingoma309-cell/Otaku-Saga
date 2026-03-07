// Vérifier si l'utilisateur est connecté
function checkAuth() {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const currentPage =
    window.location.pathname.split("/").pop() ||
    window.location.href.split("/").pop();

  const protectedPages = [
    "accueil.html",
    "actus.html",
    "service.html",
    "contact.html",
    "apropos.html",
    "lecture.html",
  ];

  if (protectedPages.includes(currentPage) && !isAuthenticated) {
    window.location.href = "index.html";
    return false;
  }

  return true;
}

// === ADMIN SECRETS (MOT DE PASSE CACHÉ) ===
const ADMIN_EMAILS = ['admin@otaku.com', 'admin@saga.com'];
const ADMIN_PASSWORD = 'OtakuSaga2026!'; // SECRET - Changez-le !

// Vérifier si admin connecté
function isAdmin() {
  return localStorage.getItem('isAdmin') === 'true';
}

// Page admin protégée
function checkAdminAuth() {
  if (!isAdmin()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// === MESSAGE BIENVENUE PERSONNALISÉ POUR TOUS LES EMAILS (CORRIGÉ) ===
function extractNameFromEmail(email) {
  // 1. Prendre partie AVANT @ 
  let name = email.split('@')[0].toLowerCase();
  // 2. Supprimer chiffres et caractères spéciaux ✅ CORRIGÉ
  name = name.replace(/[^a-zA-Z\s]/g, ' ');
  // 3. Nettoyer espaces multiples ✅ CORRIGÉ
  name = name.replace(/\s+/g, ' ').trim();
  // 4. Première lettre majuscule
  return name.charAt(0).toUpperCase() + name.slice(1) || 'Utilisateur';
}

function showWelcomeMessage() {
  const email = localStorage.getItem('email');
  if (!email || sessionStorage.getItem('welcomeShown')) return;
  
  const name = extractNameFromEmail(email);
  const welcomeMsg = document.createElement('div');
  welcomeMsg.id = 'welcomeMsg';
  welcomeMsg.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 9999;
    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
    color: white; padding: 20px 30px; border-radius: 50px;
    box-shadow: 0 10px 30px rgba(108, 92, 231, 0.4);
    font-weight: 600; font-size: 18px; max-width: 350px;
    animation: slideIn 0.5s ease, slideOut 0.5s 4.5s forwards;
  `;
  welcomeMsg.innerHTML = `🎌 Bienvenue à Otaku-Saga <strong>${name}</strong> !`;
  
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @keyframes slideOut { to { transform: translateX(100%); opacity: 0; } }
    </style>
  `);
  
  document.body.appendChild(welcomeMsg);
  sessionStorage.setItem('welcomeShown', 'true');
  
  setTimeout(() => {
    const welcomeMsg = document.getElementById('welcomeMsg');
    if (welcomeMsg) welcomeMsg.remove();
    const style = document.querySelector('style:last-of-type');
    if (style) style.remove();
  }, 5000);
}

// === SYSTÈME MULTI-NAVEIGATEURS (GLOBAL) ===
const GLOBAL_USERS_KEY = 'otakuSagaUsers_GLOBAL_v1';

// Fonction pour synchroniser localStorage vers global
async function syncUsersGlobal() {
  try {
    let globalUsers = JSON.parse(localStorage.getItem(GLOBAL_USERS_KEY) || '[]');
    let localUsers = JSON.parse(localStorage.getItem('otakuSagaUsers') || '[]');
    
    // Fusionner les utilisateurs (éviter doublons)
    localUsers.forEach(localUser => {
      if (!globalUsers.find(g => g.email === localUser.email)) {
        globalUsers.push(localUser);
      }
    });
    
    localStorage.setItem(GLOBAL_USERS_KEY, JSON.stringify(globalUsers));
    return globalUsers;
  } catch(e) {
    return JSON.parse(localStorage.getItem('otakuSagaUsers') || '[]');
  }
}

// Vérification auth MULTI-NAVEIGATEURS
async function checkGlobalAuth() {
  await syncUsersGlobal();
  return checkAuth();
}

// Connexion avec sync global
async function globalLogin(email, password) {
  await syncUsersGlobal();
  const globalUsers = JSON.parse(localStorage.getItem(GLOBAL_USERS_KEY) || '[]');
  return globalUsers.find(u => u.email === email && u.password === password);
}

// Initialisation au chargement (MULTI-NAVEIGATEURS)
document.addEventListener("DOMContentLoaded", async function () {
  await checkGlobalAuth();

  const currentPage =
    window.location.pathname.split("/").pop() ||
    window.location.href.split("/").pop();

  // Page admin.html
  if (currentPage === 'admin.html') {
    if (!checkAdminAuth()) return;
    initAdminDashboard();
  }

  // Message bienvenue sur pages protégées
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const protectedPages = ["accueil.html", "actus.html", "service.html", "contact.html", "apropos.html", "lecture.html"];
  if (protectedPages.includes(currentPage) && isAuthenticated) {
    setTimeout(showWelcomeMessage, 800);
  }

  if (
    currentPage === "index.html" ||
    currentPage === "" ||
    currentPage.includes("index.html")
  ) {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated) {
      const alreadyConnectedDiv = document.getElementById("alreadyConnected");
      if (alreadyConnectedDiv) {
        alreadyConnectedDiv.style.display = "block";
      }
    }
  }

  // Gestion formulaire de connexion
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Gestion formulaire d'inscription
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  // Bouton admin
  const adminLoginBtn = document.getElementById('adminLoginBtn');
  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', handleAdminLogin);
  }

  // Gestion bouton déconnexion
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  // Lien inscription
  const registerLink = document.getElementById("registerLink");
  if (registerLink) {
    registerLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "inscription.html";
    });
  }
});

// Gérer la connexion utilisateur (MULTI-NAVEIGATEURS)
async function handleLogin(e) {
  e.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showError("Veuillez remplir tous les champs");
    return;
  }

  if (!email.includes("@")) {
    showError("Veuillez entrer une adresse email valide");
    return;
  }

  // Vérifier admin d'abord
  if (ADMIN_EMAILS.includes(email) && password === ADMIN_PASSWORD) {
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('adminEmail', email);
    sessionStorage.removeItem('welcomeShown');
    window.location.href = 'admin.html';
    return;
  }

  // Vérification utilisateur MULTI-NAVEIGATEURS
  const user = await globalLogin(email, password);
  
  if (!user || user.banned) {
    showError("❌ Email ou mot de passe incorrect. Inscrivez-vous d'abord.");
    return;
  }

  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("email", email);
  sessionStorage.removeItem('welcomeShown');
  window.location.href = "accueil.html";
}

// Login Admin (bouton dédié)
async function handleAdminLogin() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (ADMIN_EMAILS.includes(email) && password === ADMIN_PASSWORD) {
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('adminEmail', email);
    sessionStorage.removeItem('welcomeShown');
    window.location.href = 'admin.html';
  } else {
    showError("❌ Accès Admin refusé. Contactez le support.");
  }
}

// Gérer l'inscription (MULTI-NAVEIGATEURS)
async function handleRegister(e) {
  e.preventDefault();

  const regEmailInput = document.getElementById("regEmail");
  const regPasswordInput = document.getElementById("regPassword");
  const regErrorMessage = document.getElementById("regErrorMessage");

  const email = regEmailInput.value.trim();
  const password = regPasswordInput.value.trim();

  if (!email || !password) {
    if (regErrorMessage) regErrorMessage.textContent = "Veuillez remplir tous les champs";
    return;
  }

  if (password.length < 6) {
    if (regErrorMessage) regErrorMessage.textContent = "Le mot de passe doit faire au moins 6 caractères";
    return;
  }

  // Sync global + vérification
  await syncUsersGlobal();
  const globalUsers = JSON.parse(localStorage.getItem(GLOBAL_USERS_KEY) || '[]');
  
  if (ADMIN_EMAILS.includes(email)) {
    if (regErrorMessage) regErrorMessage.textContent = "Email réservé pour administration";
    return;
  }
  
  if (globalUsers.find(u => u.email === email)) {
    if (regErrorMessage) regErrorMessage.textContent = "Cet email est déjà utilisé";
    return;
  }

  // Ajouter utilisateur global
  const newUser = { 
    email, 
    password, 
    role: 'user',
    createdAt: new Date().toISOString(),
    banned: false 
  };
  
  globalUsers.push(newUser);
  localStorage.setItem(GLOBAL_USERS_KEY, JSON.stringify(globalUsers));
  localStorage.setItem('otakuSagaUsers', JSON.stringify(globalUsers)); // Backup local

  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("email", email);
  sessionStorage.removeItem('welcomeShown');
  
  alert('✅ Inscription réussie ! Redirection...');
  setTimeout(() => window.location.href = "index.html", 1500);
}

// Admin Dashboard (MULTI-NAVEIGATEURS)
async function initAdminDashboard() {
  await syncUsersGlobal();
  loadAdminData();
  setupAdminActions();
}

async function loadAdminData() {
  await syncUsersGlobal();
  const users = JSON.parse(localStorage.getItem(GLOBAL_USERS_KEY) || '[]');
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => localStorage.getItem('email') === u.email).length,
    bannedUsers: users.filter(u => u.banned).length
  };
  
  document.getElementById('totalUsers').textContent = stats.totalUsers;
  document.getElementById('activeUsers').textContent = stats.activeUsers;
  document.getElementById('bannedUsers').textContent = stats.bannedUsers;
  
  displayUsersList(users);
}

function displayUsersList(users) {
  const tbody = document.querySelector('#usersTable tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  users.forEach((user, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${user.email}</td>
        <td>${user.role || 'user'}</td>
        <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}</td>
        <td style="color: ${user.banned ? 'red' : 'green'}">
          ${user.banned ? '🚫 Banni' : '✅ Actif'}
        </td>
        <td>
          <button onclick="toggleBan('${user.email}')" class="btn-small ${user.banned ? 'btn-success' : 'btn-danger'}">
            ${user.banned ? 'Débanir' : 'Bannir'}
          </button>
          <button onclick="changeRole('${user.email}')" class="btn-small btn-warning">Rôle</button>
          <button onclick="deleteUser('${user.email}')" class="btn-small btn-danger">Suppr</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

async function setupAdminActions() {
  const searchInput = document.getElementById('searchUser');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      filterUsers(this.value);
    });
  }
  
  const adminLogout = document.getElementById('adminLogout');
  if (adminLogout) {
    adminLogout.addEventListener('click', function() {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminEmail');
      window.location.href = 'index.html';
    });
  }
}

async function toggleBan(email) {
  await syncUsersGlobal();
  let users = JSON.parse(localStorage.getItem(GLOBAL_USERS_KEY) || '[]');
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex !== -1) {
    users[userIndex].banned = !users[userIndex].banned;
    localStorage.setItem(GLOBAL_USERS_KEY, JSON.stringify(users));
    localStorage.setItem('otakuSagaUsers', JSON.stringify(users));
    loadAdminData();
    alert(users[userIndex].banned ? '👮 Utilisateur banni !' : '✅ Utilisateur débanni !');
  }
}

async function changeRole(email) {
  await syncUsersGlobal();
  let users = JSON.parse(localStorage.getItem(GLOBAL_USERS_KEY) || '[]');
  const userIndex = users.findIndex(u => u.email === email);
  const newRole = prompt('Nouveau rôle (user/moderator):', users[userIndex]?.role || 'user');
  
  if (userIndex !== -1 && newRole) {
    users[userIndex].role = newRole.toLowerCase();
    localStorage.setItem(GLOBAL_USERS_KEY, JSON.stringify(users));
    localStorage.setItem('otakuSagaUsers', JSON.stringify(users));
    loadAdminData();
  }
}

async function deleteUser(email) {
  if (confirm('Supprimer définitivement cet utilisateur ?')) {
    await syncUsersGlobal();
    let users = JSON.parse(localStorage.getItem(GLOBAL_USERS_KEY) || '[]');
    users = users.filter(u => u.email !== email);
    localStorage.setItem(GLOBAL_USERS_KEY, JSON.stringify(users));
    localStorage.setItem('otakuSagaUsers', JSON.stringify(users));
    loadAdminData();
  }
}

async function filterUsers(query) {
  await syncUsersGlobal();
  const users = JSON.parse(localStorage.getItem(GLOBAL_USERS_KEY) || '[]');
  const filtered = users.filter(u => u.email.toLowerCase().includes(query.toLowerCase()));
  displayUsersList(filtered);
}

function handleLogout(e) {
  e.preventDefault();
  if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("email");
    sessionStorage.clear();
    window.location.href = "index.html";
  }
}

function showError(message) {
  const errorMessage = document.getElementById("errorMessage");
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
    setTimeout(() => {
      errorMessage.classList.remove("show");
    }, 5000);
  }
}

// Exposer fonctions globales
window.checkAuth = checkAuth;
window.handleLogout = handleLogout;
window.isAdmin = isAdmin;
window.checkAdminAuth = checkAdminAuth;
window.loadAdminData = loadAdminData;
window.toggleBan = toggleBan;
window.changeRole = changeRole;
window.deleteUser = deleteUser;
window.filterUsers = filterUsers;
