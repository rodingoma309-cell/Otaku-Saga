// =====================================================
// APP.JS DEBUG - OTaku-SAGA FIREBASE (Diagnostic Complet)
// =====================================================

// 🔥 DEBUG FIREBASE - ÉTAPE PAR ÉTAPE
console.log('🔥 [DEBUG 1/7] Vérification window.firebase...');
console.log('window.firebase:', window.firebase ? '✅ DISPONIBLE' : '❌ MANQUANT');
console.log('window.firebase.firestore:', window.firebase?.firestore ? '✅ OK' : '❌ MANQUANT');

console.log('🔥 [DEBUG 2/7] Chargement config...');
console.log('Projet ID:', 'otakusaga2026');

// 🔥 VOTRE CONFIG FIREBASE (INTÉGRÉE)
const firebaseConfig = {
  apiKey: "AIzaSyCtFJqHUu-YPS-q6oDq2bys3YlwLnetKoE",
  authDomain: "otakusaga2026.firebaseapp.com",
  projectId: "otakusaga2026",
  storageBucket: "otakusaga2026.firebasestorage.app",
  messagingSenderId: "404046034826",
  appId: "1:404046034826:web:500d245326be9e18033a73"
};

// 🔥 INITIALISER FIREBASE + FIRESTORE (CDN Compat) - VERSION DEBUG
let db;
try {
  console.log('🔥 [DEBUG 3/7] Initialisation Firebase...');
  
  if (!window.firebase) {
    throw new Error('❌ SDK Firebase NON CHARGÉ - Vérifiez les <script> dans <head> HTML');
  }
  
  const { initializeApp } = window.firebase;
  const { getFirestore } = window.firebase;
  
  console.log('🔥 [DEBUG 4/7] initializeApp & getFirestore disponibles');
  
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  
  console.log('✅ [DEBUG 5/7] Firebase connecté ! Project:', firebaseConfig.projectId);
  console.log('✅ [DEBUG 6/7] Firestore DB prête:', db ? 'OK' : 'ERREUR');
  
  // 🔥 TEST LECTURE RAPIDE
  console.log('🔥 [DEBUG 7/7] Test lecture Firestore...');
  
} catch(e) {
  console.error('❌ [ERREUR CRITIQUE] Firebase:', e.message);
  console.error('Stack:', e.stack);
  db = null;
}

// 🔐 VÉRIFICATION AUTH
function checkAuth() {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const currentPage = window.location.pathname.split("/").pop() || window.location.href.split("/").pop();
  const protectedPages = ["accueil.html", "actus.html", "service.html", "contact.html", "apropos.html", "lecture.html"];

  console.log('🔐 [AUTH] Page:', currentPage, 'Connecté:', !!isAuthenticated);
  
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
  if (!isAdmin()) { 
    console.log('👑 [ADMIN] Accès refusé');
    window.location.href = 'index.html'; 
    return false; 
  }
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

// 🔥 FIREBASE USERS - VERSION DEBUG
async function getUsers() {
  console.log('🔥 [USERS] Lecture users...', db ? 'DB OK' : 'DB NULL');
  if (!db) return [];
  try {
    const usersRef = window.firebase.collection(db, 'users');
    console.log('🔥 [USERS] Collection usersRef créée');
    const snapshot = await window.firebase.getDocs(usersRef);
    console.log('🔥 [USERS] Snapshot reçu:', snapshot.size, 'docs');
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch(e) {
    console.error('❌ [USERS] ERREUR:', e.message);
    return [];
  }
}

async function saveUser(email, password) {
  console.log('💾 [SAVE] Création user:', email);
  if (!db) {
    console.error('❌ [SAVE] DB non disponible');
    return false;
  }
  try {
    const usersRef = window.firebase.collection(db, 'users');
    await window.firebase.addDoc(usersRef, {
      email, password, 
      role: 'user',
      createdAt: new Date().toISOString(),
      banned: false
    });
    console.log('✅ [SAVE] User créé avec succès:', email);
    return true;
  } catch(e) {
    console.error('❌ [SAVE] ERREUR:', e.message);
    return false;
  }
}

async function updateUser(email, updates) {
  console.log('🔄 [UPDATE] Update user:', email, updates);
  if (!db) return false;
  try {
    const usersRef = window.firebase.collection(db, 'users');
    const snapshot = await window.firebase.getDocs(usersRef);
    const userDoc = snapshot.docs.find(doc => doc.data().email === email);
    if (userDoc) {
      await window.firebase.updateDoc(window.firebase.doc(db, 'users', userDoc.id), updates);
      console.log('✅ [UPDATE] OK:', email);
      return true;
    }
    return false;
  } catch(e) {
    console.error('❌ [UPDATE] ERREUR:', e.message);
    return false;
  }
}

async function deleteUserByEmail(email) {
  console.log('🗑️ [DELETE] Suppression:', email);
  if (!db) return false;
  try {
    const usersRef = window.firebase.collection(db, 'users');
    const snapshot = await window.firebase.getDocs(usersRef);
    const userDoc = snapshot.docs.find(doc => doc.data().email === email);
    if (userDoc) {
      await window.firebase.deleteDoc(window.firebase.doc(db, 'users', userDoc.id));
      console.log('✅ [DELETE] Supprimé:', email);
      return true;
    }
    return false;
  } catch(e) {
    console.error('❌ [DELETE] ERREUR:', e.message);
    return false;
  }
}

// INITIALISATION
document.addEventListener("DOMContentLoaded", async function() {
  console.log('🚀 [INIT] DOM chargé');
  checkAuth();

  const currentPage = window.location.pathname.split("/").pop() || window.location.href.split("/").pop();
  console.log('📄 [INIT] Page actuelle:', currentPage);

  // ADMIN
  if (currentPage === 'admin.html') {
    console.log('👑 [INIT] Mode Admin');
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
  
  console.log('✅ [INIT] Tous les events attachés');
});

// ... [RESTE DU CODE IDENTIQUE - handleLogin, handleRegister, etc.] ...

// EXPORTER FONCTIONS GLOBALES
window.checkAuth = checkAuth;
window.handleLogout = handleLogout;
window.isAdmin = isAdmin;
window.checkAdminAuth = checkAdminAuth;
window.loadAdminData = loadAdminData;
window.toggleBan = toggleBan;
window.changeRole = changeRole;
window.deleteUser = deleteUser;

console.log('🎌 [FINAL] Otaku-Saga FIREBASE DEBUG prêt ! Project ID: otakusaga2026');
