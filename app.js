// =====================================================
// 🔥 APP.JS MASTER - OTaku-SAGA 2026 (COEUR CENTRAL)
// =====================================================
// Version: 2.0 - Maintenance garantie index.html ↔ inscription.html ↔ admin.html

// 🔥 CONFIG FIREBASE OFFICIELLE
const firebaseConfig = {
  apiKey: "AIzaSyCtFJqHUu-YPS-q6oDq2bys3YlwLnetKoE",
  authDomain: "otakusaga2026.firebaseapp.com",
  projectId: "otakusaga2026",
  storageBucket: "otakusaga2026.firebasestorage.app",
  messagingSenderId: "404046034826",
  appId: "1:404046034826:web:500d245326be9e18033a73"
};

// 🔥 GLOBALS + ÉTAT CENTRALISÉ
let db, app;
let STATE = {
  isInitialized: false,
  currentUser: null,
  isAdmin: false,
  usersCache: [],
  lastSync: null
};

// 🔐 ADMIN CONSTANTS (NE PAS MODIFIER)
const ADMIN_CREDENTIALS = {
  emails: ['admin@otaku.com', 'admin@saga.com'],
  password: 'OtakuSaga2026!'
};

// =====================================================
// 🔥 1. INITIALISATION FIREBASE + DEBUG
// =====================================================
async function initFirebase() {
  if (STATE.isInitialized) return true;
  
  try {
    // Compat CDN (v9.23.0)
    const { initializeApp } = window.firebase;
    const { getFirestore } = window.firebase;
    
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    
    STATE.isInitialized = true;
    console.log('✅ Firebase OtakuSaga2026 CONNECTÉ - PID: otakusaga2026');
    
    // Sync users au démarrage
    await syncUsersCache();
    return true;
  } catch(e) {
    console.error('❌ Firebase INIT ERROR:', e);
    return false;
  }
}

// =====================================================
// 🔥 2. SYSTÈME D'AUTH CENTRALISÉ (INDEX + ADMIN)
// =====================================================
async function authenticateUser(email, password, isAdminAttempt = false) {
  console.log(`🔐 AUTH ${isAdminAttempt ? 'ADMIN' : 'USER'}:`, email);
  
  // ADMIN PRIORITAIRE
  if (ADMIN_CREDENTIALS.emails.includes(email) && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('adminEmail', email);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('email', email);
    
    STATE.isAdmin = true;
    STATE.currentUser = { email, role: 'admin' };
    
    console.log('👑 ADMIN AUTH OK → admin.html');
    window.location.replace('admin.html');
    return { success: true, role: 'admin' };
  }
  
  // USER (Firebase + localStorage sync)
  try {
    const users = await getUsers();
    const user = users.find(u => u.email === email && u.password === password && !u.banned);
    
    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('email', email);
      localStorage.removeItem('isAdmin'); // User normal
      
      STATE.currentUser = user;
      STATE.isAdmin = false;
      
      console.log('✅ USER AUTH OK → accueil.html');
      window.location.replace('accueil.html');
      return { success: true, role: 'user', user };
    }
    
    return { success: false, error: 'Identifiants incorrects' };
  } catch(e) {
    return { success: false, error: 'Erreur serveur' };
  }
}

// =====================================================
// 🔥 3. INSCRIPTION SYNCHRONISÉE (inscription.html → index.html)
// =====================================================
async function registerUser(email, password) {
  console.log('📝 INSCRIPTION:', email);
  
  // VALIDATIONS STRICTES
  if (!email || !password || password.length < 6 || !email.includes('@')) {
    return { success: false, error: 'Données invalides' };
  }
  
  if (ADMIN_CREDENTIALS.emails.includes(email)) {
    return { success: false, error: 'Email admin réservé' };
  }
  
  try {
    // Vérif doublon
    const users = await getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email déjà utilisé' };
    }
    
    // 🔥 SAUVEGARDE FIREBASE + localStorage
    const success = await saveUser(email, password);
    if (success) {
      // CONNEXION AUTO + REDIRECTION
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('email', email);
      
      STATE.currentUser = { email, role: 'user' };
      await syncUsersCache();
      
      console.log('✅ INSCRIPTION OK → index.html');
      return { 
        success: true, 
        message: 'Compte créé ! Redirection...',
        redirect: 'index.html'
      };
    }
    
    return { success: false, error: 'Erreur création compte' };
  } catch(e) {
    console.error('❌ REGISTER ERROR:', e);
    return { success: false, error: 'Erreur serveur' };
  }
}

// =====================================================
// 🔥 4. CACHE USERS + SYNCHRO ADMIN
// =====================================================
async function syncUsersCache() {
  if (!db) return;
  try {
    STATE.usersCache = await getUsers();
    STATE.lastSync = Date.now();
    console.log('🔄 USERS CACHE:', STATE.usersCache.length, 'utilisateurs');
  } catch(e) {
    console.error('Cache sync error:', e);
  }
}

async function getUsers() {
  if (!db) return [];
  try {
    const usersRef = window.firebase.collection(db, 'users');
    const snapshot = await window.firebase.getDocs(usersRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch(e) {
    console.error('getUsers error:', e);
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
    console.error('saveUser error:', e);
    return false;
  }
}

// =====================================================
// 🔥 5. CORE MASTER - DOMContentLoaded UNIQUE
// =====================================================
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 Otaku-Saga MASTER chargé - DEBUG ACTIF');
  
  // 🔥 INIT FIREBASE
  await initFirebase();
  
  // 🔍 DÉTECTER PAGE COURANTE
  const currentPage = getCurrentPage();
  console.log('📍 Page:', currentPage);
  
  // 🔐 CHECK AUTH + UI
  await handlePageAuth(currentPage);
  
  // 🎌 ATTACH EVENTS UNIFIÉS
  attachUnifiedEvents();
  
  // 👑 ADMIN DASHBOARD
  if (currentPage === 'admin.html') {
    await initAdminDashboard();
  }
  
  console.log('✅ MASTER READY - État:', STATE);
});

// =====================================================
// 🔥 6. DÉTECTION + ROUTING INTELLIGENT
// =====================================================
function getCurrentPage() {
  return window.location.pathname.split("/").pop().split("?")[0] || 
         window.location.href.split("/").pop().split("?")[0] || 
         'index.html';
}

async function handlePageAuth(page) {
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  // PROTÉGÉES
  const protectedPages = ['accueil.html', 'actus.html', 'service.html', 'contact.html', 'apropos.html', 'lecture.html'];
  
  if (protectedPages.includes(page) && !isAuth) {
    console.log('🔒 Redirection → index.html');
    window.location.replace('index.html');
    return;
  }
  
  // ADMIN
  if (page === 'admin.html' && !isAdmin) {
    console.log('👑 Non-admin → index.html');
    localStorage.removeItem('isAdmin');
    window.location.replace('index.html');
    return;
  }
  
  // INDEX: alreadyConnected
  if (page === 'index.html' && isAuth) {
    const alreadyConnected = document.getElementById('alreadyConnected');
    if (alreadyConnected) {
      alreadyConnected.style.display = 'block';
      console.log('✅ alreadyConnected AFFICHE');
    }
  }
}

// =====================================================
// 🔥 7. EVENTS UNIFIÉS (TOUS PAGES)
// =====================================================
function attachUnifiedEvents() {
  // INDEX: loginForm
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginForm);
  }
  
  // INSCRIPTION: registerForm  
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegisterForm);
  }
  
  // INDEX: adminLoginBtn
  const adminBtn = document.getElementById('adminLoginBtn');
  if (adminBtn) {
    adminBtn.addEventListener('click', handleAdminQuickLogin);
  }
  
  // LINKS: registerLink
  const registerLink = document.getElementById('registerLink');
  if (registerLink) {
    registerLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'inscription.html';
    });
  }
  
  // LOGOUT global
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

// =====================================================
// 🔥 8. HANDLERS FORMULAIRES OPTIMISÉS
// =====================================================
async function handleLoginForm(e) {
  e.preventDefault();
  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value.trim();
  
  if (!email || !password) return showError('Champs vides');
  
  const result = await authenticateUser(email, password);
  if (!result.success) showError(result.error);
}

async function handleRegisterForm(e) {
  e.preventDefault();
  const email = document.getElementById('regEmail')?.value.trim();
  const password = document.getElementById('regPassword')?.value.trim();
  
  const result = await registerUser(email, password);
  
  if (result.success) {
    // UI Succès + Redirection
    const submitBtn = document.getElementById('submitBtn');
    const successMsg = document.getElementById('regSuccessMessage');
    
    if (submitBtn) submitBtn.textContent = 'Créé !';
    if (successMsg) {
      successMsg.innerHTML = '✅ Compte créé ! Redirection...';
      successMsg.style.display = 'block';
    }
    
    setTimeout(() => window.location.replace('index.html'), 1500);
  } else {
    const errorEl = document.getElementById('regErrorMessage');
    if (errorEl) errorEl.textContent = result.error;
  }
}

async function handleAdminQuickLogin() {
  document.getElementById('email').value = ADMIN_CREDENTIALS.emails[0];
  document.getElementById('password').value = ADMIN_CREDENTIALS.password;
  document.getElementById('loginForm').dispatchEvent(new Event('submit'));
}

// =====================================================
// 🔥 9. ADMIN DASHBOARD COMPLET
// =====================================================
async function initAdminDashboard() {
  if (!STATE.isAdmin) return;
  
  await loadAdminData();
  setupAdminListeners();
  console.log('👑 Admin Dashboard chargé');
}

async function loadAdminData() {
  await syncUsersCache();
  const stats = calculateStats();
  updateStatsUI(stats);
  displayUsersTable(STATE.usersCache);
}

function calculateStats() {
  return {
    total: STATE.usersCache.length,
    active: STATE.usersCache.filter(u => !u.banned).length,
    banned: STATE.usersCache.filter(u => u.banned).length,
    admins: STATE.usersCache.filter(u => u.role === 'admin').length
  };
}

// =====================================================
// 🔥 10. LOGOUT + CLEANUP
// =====================================================
function handleLogout(e) {
  e?.preventDefault();
  if (!confirm('Déconnexion ?')) return;
  
  // CLEAN TOTAL
  localStorage.clear();
  sessionStorage.clear();
  STATE = { isInitialized: true, currentUser: null, isAdmin: false, usersCache: [] };
  
  window.location.replace('index.html');
}

// =====================================================
// 🔥 11. UTILITAIRES + DEBUG
// =====================================================
function showError(message, targetId = 'errorMessage') {
  const el = document.getElementById(targetId) || document.getElementById('regErrorMessage');
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 5000);
  }
  console.error('❌', message);
}

// EXPORT GLOBALES ADMIN
window.toggleBan = async (email) => {
  const user = STATE.usersCache.find(u => u.email === email);
  if (user) {
    await updateUser(email, { banned: !user.banned });
    await loadAdminData();
  }
};

window.deleteUser = async (email) => {
  if (confirm('Supprimer ?')) {
    await deleteUserByEmail(email);
    await loadAdminData();
  }
};

// FIN MASTER
console.log('🎌 Otaku-Saga 2.0 MASTER CHARGÉ ✅');
