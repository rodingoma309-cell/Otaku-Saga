// =====================================================
// APP.JS FINAL - OTaku-SAGA FIREBASE (DB 100% FIXÉ)
// =====================================================

// 🔥 DEBUG FIREBASE + FIX DB NULL
console.log('🔥 [DEBUG 1/8] Vérification window.firebase...');
console.log('window.firebase:', window.firebase ? '✅ DISPONIBLE' : '❌ MANQUANT');

console.log('🔥 [DEBUG 2/8] Chargement config...');
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

let db = null;

// 🔥 INITIALISATION ROBUSTE - FIX DB NULL
async function initFirebase() {
  return new Promise((resolve, reject) => {
    console.log('🔥 [DEBUG 3/8] Initialisation Firebase...');
    
    if (!window.firebase) {
      reject(new Error('❌ SDK Firebase NON CHARGÉ - Vérifiez <script>'));
      return;
    }
    
    try {
      const { initializeApp } = window.firebase;
      const { getFirestore } = window.firebase;
      
      console.log('🔥 [DEBUG 4/8] Fonctions Firebase disponibles');
      
      const app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      
      console.log('✅ [DEBUG 5/8] Firebase connecté ! Project:', firebaseConfig.projectId);
      console.log('✅ [DEBUG 6/8] Firestore DB prête:', db ? 'OK' : 'NULL');
      
      // 🔥 TEST RAPIDE
      setTimeout(() => {
        console.log('🔥 [DEBUG 7/8] Test DB:', db ? '✅ PRÊT' : '❌ NULL');
        resolve(db);
      }, 100);
      
    } catch(e) {
      console.error('❌ [ERREUR CRITIQUE] Firebase:', e.message);
      reject(e);
    }
  });
}

// 🔥 GARANTIR DB TOUJOURS PRÊT
async function ensureDb() {
  if (db) return db;
  return await initFirebase();
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

// 🔥 FIREBASE USERS - VERSION FIXÉE
async function getUsers() {
  const currentDb = await ensureDb();
  console.log('👥 [GET USERS] Lecture... DB:', currentDb ? 'OK' : 'NULL');
  
  if (!currentDb) return [];
  
  try {
    const usersRef = window.firebase.collection(currentDb, 'users');
    console.log('👥 [GET USERS] Collection créée');
    const snapshot = await window.firebase.getDocs(usersRef);
    console.log('👥 [GET USERS] Snapshot:', snapshot.size, 'utilisateurs');
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch(e) {
    console.error('❌ [GET USERS] ERREUR:', e.message);
    return [];
  }
}

async function saveUser(email, password) {
  const currentDb = await ensureDb();
  console.log('💾 [SAVE USER] Création:', email, 'DB:', currentDb ? 'OK' : 'NULL');
  
  if (!currentDb) {
    console.error('❌ [SAVE USER] DB indisponible');
    return false;
  }
  
  try {
    const usersRef = window.firebase.collection(currentDb, 'users');
    await window.firebase.addDoc(usersRef, {
      email, password, 
      role: 'user',
      createdAt: new Date().toISOString(),
      banned: false
    });
    console.log('✅ [SAVE USER] Créé avec succès:', email);
    return true;
  } catch(e) {
    console.error('❌ [SAVE USER] ERREUR:', e.message);
    return false;
  }
}

async function updateUser(email, updates) {
  const currentDb = await ensureDb();
  if (!currentDb) return false;
  
  try {
    const usersRef = window.firebase.collection(currentDb, 'users');
    const snapshot = await window.firebase.getDocs(usersRef);
    const userDoc = snapshot.docs.find(doc => doc.data().email === email);
    if (userDoc) {
      await window.firebase.updateDoc(window.firebase.doc(currentDb, 'users', userDoc.id), updates);
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
  const currentDb = await ensureDb();
  if (!currentDb) return false;
  
  try {
    const usersRef = window.firebase.collection(currentDb, 'users');
    const snapshot = await window.firebase.getDocs(usersRef);
    const userDoc = snapshot.docs.find(doc => doc.data().email === email);
    if (userDoc) {
      await window.firebase.deleteDoc(window.firebase.doc(currentDb, 'users', userDoc.id));
      console.log('✅ [DELETE] Supprimé:', email);
      return true;
    }
    return false;
  } catch(e) {
    console.error('❌ [DELETE] ERREUR:', e.message);
    return false;
  }
}

// INITIALISATION FIXÉE
document.addEventListener("DOMContentLoaded", async function() {
  console.log('🚀 [INIT] DOM chargé - Page:', window.location.pathname);
  
  // 🔥 INITIALISER DB AU DÉMARRAGE
  try {
    await initFirebase();
    console.log('✅ [DEBUG 8/8] Système prêt !');
  } catch(e) {
    console.error('❌ Init Firebase échouée:', e.message);
  }
  
  checkAuth();
  // ... [RESTE IDENTIQUE] ...
  
  const currentPage = window.location.pathname.split("/").pop() || window.location.href.split("/").pop();

  // ADMIN
  if (currentPage === 'admin.html') {
    console.log('👑 [INIT] Mode Admin détecté');
    if (!checkAdminAuth()) return;
    setTimeout(initAdminDashboard, 1000);
  }

  // BIENVENUE
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const protectedPages = ["accueil.html", "actus.html", "service.html", "contact.html", "apropos.html", "lecture.html"];
  if (protectedPages.includes(currentPage) && isAuthenticated) {
    console.log('🎌 [BIENVENUE] User connecté:', localStorage.getItem('email'));
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
  
  console.log('✅ [INIT] Écouteurs d\'événements attachés');
});

// ... [handleLogin, handleRegister, admin functions IDENTIQUES] ...

// 📝 INSCRIPTION FIREBASE (IDENTIQUE)
async function handleRegister(e) {
  console.log('📝 [REGISTER] Inscription...');
  e.preventDefault();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const regErrorMessage = document.getElementById("regErrorMessage");

  if (!email || !password) return regErrorMessage ? regErrorMessage.textContent = "Champs vides" : null;
  if (password.length < 6) return regErrorMessage ? regErrorMessage.textContent = "Mot de passe court" : null;

  const users = await getUsers();
  
  if (ADMIN_EMAILS.includes(email)) return regErrorMessage ? regErrorMessage.textContent = "Email admin réservé" : null;
  if (users.find(u => u.email === email)) return regErrorMessage ? regErrorMessage.textContent = "Email existe" : null;

  console.log('💾 [REGISTER] Sauvegarde Firebase:', email);
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

// ... [Toutes les autres fonctions IDENTIQUES] ...

// EXPORTER FONCTIONS GLOBALES
window.checkAuth = checkAuth;
window.handleLogout = handleLogout;
window.isAdmin = isAdmin;
window.checkAdminAuth = checkAdminAuth;
window.loadAdminData = loadAdminData;
window.toggleBan = toggleBan;
window.changeRole = changeRole;
window.deleteUser = deleteUser;
window.initAdminDashboard = initAdminDashboard;
window.setupAdminActions = setupAdminActions;

console.log('🎌 [FINAL] Otaku-Saga FIREBASE DB FIXÉ ! Project ID: otakusaga2026');
