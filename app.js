// =====================================================
// APP.JS FINAL - OTaku-SAGA FIREBASE MULTI-NAVEIGATEURS
// =====================================================

// 🔥 VOTRE CONFIG FIREBASE (INTÉGRÉE)
const firebaseConfig = {
  apiKey: "AIzaSyCtFJqHUu-YPS-q6oDq2bys3YlwLnetKoE",
  authDomain: "otakusaga2026.firebaseapp.com",
  projectId: "otakusaga2026",
  storageBucket: "otakusaga2026.firebasestorage.app",
  messagingSenderId: "404046034826",
  appId: "1:404046034826:web:500d245326be9e18033a73"
};

// 🔥 INITIALISER FIREBASE + FIRESTORE (CDN Compat)
let db;
try {
  const { initializeApp } = window.firebase;
  const { getFirestore } = window.firebase;
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('🔥 Firebase OtakuSaga2026 connecté !');
} catch(e) {
  console.error('Firebase erreur:', e);
}

// 🔐 VÉRIFICATION AUTH
function checkAuth() {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const currentPage = window.location.pathname.split("/").pop() || window.location.href.split("/").pop();
  const protectedPages = ["accueil.html", "actus.html", "service.html", "contact.html", "apropos.html", "lecture.html"];

  if (protectedPages.includes(currentPage) && !isAuthenticated) {
    window.location.href = "index.html";
    return false;
  }
  return true;
}

// 👑 ADMIN
const ADMIN_EMAILS = ['admin@otaku.com', 'admin@saga.com'];
const ADMIN_PASSWORD = 'OtakuSaga2026!';
function isAdmin() { return localStorage.getItem('isAdmin') === 'true'; }
function checkAdminAuth() { 
  if (!isAdmin()) { window.location.href = 'index.html'; return false; }
  return true; 
}

// 🎌 BIENVENUE
function extractNameFromEmail(email) {
  let name = email.split('@')[0].toLowerCase();
  name = name.replace(/[^a-zA-Z\s]/g, ' ');
  name = name.replace(/\s+/g, ' ').trim();
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

// 🔥 FIREBASE USERS
async function getUsers() {
  if (!db) return [];
  try {
    const usersRef = window.firebase.collection(db, 'users');
    const snapshot = await window.firebase.getDocs(usersRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch(e) {
    console.error('Firebase users error:', e);
    return [];
  }
}

async function saveUser(email, password) {
  if (!db) return false;
  try {
    const usersRef = window.firebase.collection(db, 'users');
    await window.firebase.addDoc(usersRef, {
      email, password, 
      role: 'user',
      createdAt: new Date().toISOString(),
      banned: false
    });
    return true;
  } catch(e) {
    console.error('Save user error:', e);
    return false;
  }
}

async function updateUser(email, updates) {
  if (!db) return false;
  try {
    const usersRef = window.firebase.collection(db, 'users');
    const snapshot = await window.firebase.getDocs(usersRef);
    const userDoc = snapshot.docs.find(doc => doc.data().email === email);
    if (userDoc) {
      await window.firebase.updateDoc(window.firebase.doc(db, 'users', userDoc.id), updates);
      return true;
    }
    return false;
  } catch(e) {
    console.error('Update user error:', e);
    return false;
  }
}

async function deleteUserByEmail(email) {
  if (!db) return false;
  try {
    const usersRef = window.firebase.collection(db, 'users');
    const snapshot = await window.firebase.getDocs(usersRef);
    const userDoc = snapshot.docs.find(doc => doc.data().email === email);
    if (userDoc) {
      await window.firebase.deleteDoc(window.firebase.doc(db, 'users', userDoc.id));
      return true;
    }
    return false;
  } catch(e) {
    console.error('Delete user error:', e);
    return false;
  }
}

// INITIALISATION
document.addEventListener("DOMContentLoaded", async function() {
  checkAuth();

  const currentPage = window.location.pathname.split("/").pop() || window.location.href.split("/").pop();

  // ADMIN
  if (currentPage === 'admin.html') {
    if (!checkAdminAuth()) return;
    setTimeout(initAdminDashboard, 1000);
  }

  // BIENVENUE
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const protectedPages = ["accueil.html", "actus.html", "service.html", "contact.html", "apropos.html", "lecture.html"];
  if (protectedPages.includes(currentPage) && isAuthenticated) {
    setTimeout(showWelcomeMessage, 800);
  }

  // INDEX
  if (currentPage === "index.html" || currentPage === "" || currentPage.includes("index.html")) {
    if (isAuthenticated) {
      const alreadyConnectedDiv = document.getElementById("alreadyConnected");
      if (alreadyConnectedDiv) alreadyConnectedDiv.style.display = "block";
    }
  }

  // EVENTS
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  const registerForm = document.getElementById("registerForm");
  if (registerForm) registerForm.addEventListener("submit", handleRegister);

  const adminLoginBtn = document.getElementById('adminLoginBtn');
  if (adminLoginBtn) adminLoginBtn.addEventListener('click', handleAdminLogin);

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

  const registerLink = document.getElementById("registerLink");
  if (registerLink) {
    registerLink.addEventListener("click", function(e) {
      e.preventDefault();
      window.location.href = "inscription.html";
    });
  }
});

// 🔐 CONNEXION FIREBASE
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return showError("Champs vides");
  if (!email.includes("@")) return showError("Email invalide");

  // ADMIN
  if (ADMIN_EMAILS.includes(email) && password === ADMIN_PASSWORD) {
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('adminEmail', email);
    sessionStorage.removeItem('welcomeShown');
    return window.location.href = 'admin.html';
  }

  // USER FIREBASE
  const users = await getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user || user.banned) return showError("❌ Identifiants incorrects");

  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("email", email);
  sessionStorage.removeItem('welcomeShown');
  window.location.href = "accueil.html";
}

async function handleAdminLogin() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  
  if (ADMIN_EMAILS.includes(email) && password === ADMIN_PASSWORD) {
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('adminEmail', email);
    window.location.href = 'admin.html';
  } else {
    showError("❌ Admin refusé");
  }
}

// 📝 INSCRIPTION FIREBASE
async function handleRegister(e) {
  e.preventDefault();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const regErrorMessage = document.getElementById("regErrorMessage");

  if (!email || !password) return regErrorMessage ? regErrorMessage.textContent = "Champs vides" : null;
  if (password.length < 6) return regErrorMessage ? regErrorMessage.textContent = "Mot de passe court" : null;

  const users = await getUsers();
  
  if (ADMIN_EMAILS.includes(email)) return regErrorMessage ? regErrorMessage.textContent = "Email admin réservé" : null;
  if (users.find(u => u.email === email)) return regErrorMessage ? regErrorMessage.textContent = "Email existe" : null;

  const success = await saveUser(email, password);
  if (success) {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("email", email);
    alert('✅ Compte créé dans Firebase ! Connectez-vous !');
    setTimeout(() => window.location.href = "index.html", 1000);
  } else {
    regErrorMessage ? regErrorMessage.textContent = "Erreur création" : null;
  }
}

// 👑 ADMIN FIREBASE
async function initAdminDashboard() {
  loadAdminData();
  setupAdminActions();
}

async function loadAdminData() {
  const users = await getUsers();
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => localStorage.getItem('email') === u.email).length,
    bannedUsers: users.filter(u => u.banned).length
  };
  
  const totalEl = document.getElementById('totalUsers');
  const activeEl = document.getElementById('activeUsers');
  const bannedEl = document.getElementById('bannedUsers');
  
  if (totalEl) totalEl.textContent = stats.totalUsers;
  if (activeEl) activeEl.textContent = stats.activeUsers;
  if (bannedEl) bannedEl.textContent = stats.bannedUsers;
  
  displayUsersList(users);
}

function displayUsersList(users) {
  const tbody = document.querySelector('#usersTable tbody');
  if (!tbody) return;
  
  tbody.innerHTML = users.map((user, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${user.email}</td>
      <td>${user.role || 'user'}</td>
      <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}</td>
      <td style="color: ${user.banned ? 'red' : 'green'}">${user.banned ? '🚫 Banni' : '✅ Actif'}</td>
      <td>
        <button onclick="toggleBan('${user.email}')" class="btn-small ${user.banned ? 'btn-success' : 'btn-danger'}">
          ${user.banned ? 'Débanir' : 'Bannir'}
        </button>
        <button onclick="changeRole('${user.email}')" class="btn-small btn-warning">Rôle</button>
        <button onclick="deleteUser('${user.email}')" class="btn-small btn-danger">Suppr</button>
      </td>
    </tr>
  `).join('');
}

async function toggleBan(email) {
  const users = await getUsers();
  const user = users.find(u => u.email === email);
  if (user) {
    await updateUser(email, { banned: !user.banned });
    loadAdminData();
    alert(user.banned ? '✅ Débanni !' : '👮 Banni !');
  }
}

async function changeRole(email) {
  const newRole = prompt('Nouveau rôle (user/moderator):', 'user');
  if (newRole) {
    await updateUser(email, { role: newRole.toLowerCase() });
    loadAdminData();
  }
}

async function deleteUser(email) {
  if (confirm('Supprimer définitivement ?')) {
    await deleteUserByEmail(email);
    loadAdminData();
  }
}

function setupAdminActions() {
  const searchInput = document.getElementById('searchUser');
  if (searchInput) {
    searchInput.addEventListener('input', async function() {
      const users = await getUsers();
      const filtered = users.filter(u => u.email.toLowerCase().includes(this.value.toLowerCase()));
      displayUsersList(filtered);
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

function handleLogout(e) {
  e.preventDefault();
  if (confirm("Déconnexion ?")) {
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
    setTimeout(() => errorMessage.classList.remove("show"), 5000);
  }
}

// EXPORTER FONCTIONS GLOBALES
window.checkAuth = checkAuth;
window.handleLogout = handleLogout;
window.isAdmin = isAdmin;
window.checkAdminAuth = checkAdminAuth;
window.loadAdminData = loadAdminData;
window.toggleBan = toggleBan;
window.changeRole = changeRole;
window.deleteUser = deleteUser;

// 🚀 DÉMARRAGE
console.log('🎌 Otaku-Saga FIREBASE prêt ! Project ID: otakusaga2026');
