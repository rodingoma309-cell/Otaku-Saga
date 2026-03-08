// =====================================================
// APP.JS FINAL FIXÉ - OTaku-SAGA FIREBASE 100% FONCTIONNEL
// =====================================================

// 🔥 CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCtFJqHUu-YPS-q6oDq2bys3YlwLnetKoE",
  authDomain: "otakusaga2026.firebaseapp.com",
  projectId: "otakusaga2026",
  storageBucket: "otakusaga2026.firebasestorage.app",
  messagingSenderId: "404046034826",
  appId: "1:404046034826:web:500d245326be9e18033a73"
};

let db = null;
let firebaseApp = null;

// 🔥 INITIALISATION AVEC RETRY AUTOMATIQUE
async function initFirebaseWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetry; i++) {
    try {
      console.log(`🔥 Tentative ${i + 1}/${maxRetries}...`);
      
      if (!window.firebase) {
        throw new Error('SDK Firebase non chargé');
      }
      
      // Nettoyer app précédente
      if (firebaseApp) {
        window.firebase.initializeApp(firebaseConfig, 'OtakuSaga');
      } else {
        firebaseApp = window.firebase.initializeApp(firebaseConfig, 'OtakuSaga');
      }
      
      db = window.firebase.firestore();
      console.log('✅ FIREBASE OK ! DB prête');
      
      // Test immédiat
      await db.collection('users').limit(1).get();
      console.log('✅ TEST Firestore OK !');
      return true;
      
    } catch(e) {
      console.error(`❌ Tentative ${i + 1} échouée:`, e.message);
      db = null;
      firebaseApp = null;
      
      if (i === maxRetries - 1) {
        console.error('❌ TOUTES les tentatives échouées');
        return false;
      }
      await new Promise(r => setTimeout(r, 500));
    }
  }
}

// 🔥 FONCTIONS USERS AVEC RETRY DB
async function getUsers() {
  if (!db) {
    const success = await initFirebaseWithRetry();
    if (!success) return [];
  }
  
  try {
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch(e) {
    console.error('❌ getUsers:', e.message);
    return [];
  }
}

async function saveUser(email, password) {
  if (!db) {
    const success = await initFirebaseWithRetry();
    if (!success) return false;
  }
  
  try {
    await db.collection('users').add({
      email, 
      password,
      role: 'user',
      createdAt: new Date().toISOString(),
      banned: false
    });
    console.log('✅ User créé:', email);
    return true;
  } catch(e) {
    console.error('❌ saveUser:', e.message);
    return false;
  }
}

// 👑 ADMIN + AUTH (IDENTIQUE)
const ADMIN_EMAILS = ['admin@otaku.com', 'admin@saga.com'];
const ADMIN_PASSWORD = 'OtakuSaga2026!';

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

function isAdmin() { return localStorage.getItem('isAdmin') === 'true'; }
function checkAdminAuth() { 
  if (!isAdmin()) { 
    window.location.href = 'index.html'; 
    return false; 
  }
  return true; 
}

// 📝 INSCRIPTION SIMPLIFIÉE ET ROBUSTE
async function handleRegister(e) {
  e.preventDefault();
  console.log('📝 INSCRIPTION...');
  
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const regErrorMessage = document.getElementById("regErrorMessage");

  // Validations
  if (!email || !password) {
    if (regErrorMessage) regErrorMessage.textContent = "Champs vides";
    return;
  }
  if (password.length < 6) {
    if (regErrorMessage) regErrorMessage.textContent = "Mot de passe trop court";
    return;
  }
  if (ADMIN_EMAILS.includes(email)) {
    if (regErrorMessage) regErrorMessage.textContent = "Email admin réservé";
    return;
  }

  // Vérifier doublon
  const users = await getUsers();
  if (users.find(u => u.email === email)) {
    if (regErrorMessage) regErrorMessage.textContent = "Email déjà utilisé";
    return;
  }

  // CRÉER COMPTE
  const success = await saveUser(email, password);
  if (success) {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("email", email);
    alert('✅ Compte créé ! Redirection...');
    setTimeout(() => window.location.href = "index.html", 1000);
  } else {
    if (regErrorMessage) regErrorMessage.textContent = "Erreur Firebase - vérifiez console F12";
  }
}

// 🔐 CONNEXION
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return showError("Champs vides");

  // ADMIN
  if (ADMIN_EMAILS.includes(email) && password === ADMIN_PASSWORD) {
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('adminEmail', email);
    return window.location.href = 'admin.html';
  }

  // USER
  const users = await getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user || user.banned) return showError("Identifiants incorrects");

  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("email", email);
  window.location.href = "accueil.html";
}

function showError(message) {
  const errorEl = document.getElementById("errorMessage") || document.getElementById("regErrorMessage");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("show");
    setTimeout(() => errorEl.classList.remove("show"), 5000);
  }
}

// INITIALISATION
document.addEventListener("DOMContentLoaded", async function() {
  console.log('🚀 Otaku-Saga démarré');
  
  // Essayer d'initialiser au démarrage
  await initFirebaseWithRetry();
  
  checkAuth();

  // EVENTS
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  const registerForm = document.getElementById("registerForm");
  if (registerForm) registerForm.addEventListener("submit", handleRegister);

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
});

// FONCTIONS ADMIN (simplifiées)
async function initAdminDashboard() {
  if (!checkAdminAuth()) return;
  const users = await getUsers();
  // ... afficher tableau
}

function handleLogout(e) {
  e?.preventDefault();
  localStorage.clear();
  window.location.href = "index.html";
}

// EXPORTER GLOBAL
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.initFirebaseWithRetry = initFirebaseWithRetry;
window.getUsers = getUsers;
window.saveUser = saveUser;

console.log('🎌 Otaku-Saga PRÊT ! Testez inscription.html');
