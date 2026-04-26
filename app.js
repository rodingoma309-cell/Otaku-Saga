// =====================================================
// 🔥 APP.JS MASTER - OTaku-SAGA 2026 (COEUR CENTRAL)
// =====================================================
// Version: 2.1 - Auto-fill SUPPRIMÉ + Admin FONCTIONS COMPLÈTES

// 🔥 CONFIG FIREBASE OFFICIELLE
const firebaseConfig = {
  apiKey: "AIzaSyCtFJqHUu-YPS-q6oDq2bys3YlwLnetKoE",
  authDomain: "otakusaga2026.firebaseapp.com",
  projectId: "otakusaga2026",
  storageBucket: "otakusaga2026.firebasestorage.app",
  messagingSenderId: "404046034826",
  appId: "1:404046034826:web:500d245326be9e18033a73",
};

// 🔥 GLOBALS + ÉTAT CENTRALISÉ
let db, app;
let STATE = {
  isInitialized: false,
  currentUser: null,
  isAdmin: false,
  usersCache: [],
  lastSync: null,
};

// 🔐 ADMIN CONSTANTS (NE PAS MODIFIER)
const ADMIN_CREDENTIALS = {
  emails: ["admin@otaku.com", "admin@saga.com"],
  password: "OtakuSaga2026!",
};

// =====================================================
// 🔥 1. INITIALISATION FIREBASE + DEBUG
// =====================================================
async function initFirebase() {
  if (STATE.isInitialized) return true;

  try {
    app = window.firebase.initializeApp(firebaseConfig);
    db = window.firebase.firestore();

    STATE.isInitialized = true;
    console.log("✅ Firebase OtakuSaga2026 CONNECTÉ - PID: otakusaga2026");

    await syncUsersCache();
    return true;
  } catch (e) {
    console.error("❌ Firebase INIT ERROR:", e);
    return false;
  }
}

// =====================================================
// 🔥 2. SYSTÈME D'AUTH CENTRALISÉ (INDEX + ADMIN)
// =====================================================
async function authenticateUser(email, password, isAdminAttempt = false) {
  console.log(`🔐 AUTH ${isAdminAttempt ? "ADMIN" : "USER"}:`, email);

  if (
    ADMIN_CREDENTIALS.emails.includes(email) &&
    password === ADMIN_CREDENTIALS.password
  ) {
    localStorage.setItem("isAdmin", "true");
    localStorage.setItem("adminEmail", email);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("email", email);

    STATE.isAdmin = true;
    STATE.currentUser = { email, role: "admin" };

    console.log("👑 ADMIN AUTH OK → admin.html");
    window.location.replace("admin.html");
    return { success: true, role: "admin" };
  }

  try {
    const users = await getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password && !u.banned,
    );

    if (user) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("email", email);
      localStorage.removeItem("isAdmin");

      STATE.currentUser = user;
      STATE.isAdmin = false;

      console.log("✅ USER AUTH OK → accueil.html");
      window.location.replace("accueil.html");
      return { success: true, role: "user", user };
    }

    return { success: false, error: "Identifiants incorrects" };
  } catch (e) {
    return { success: false, error: "Erreur serveur" };
  }
}

// =====================================================
// 🔥 3. INSCRIPTION SYNCHRONISÉE
// =====================================================
async function registerUser(email, password) {
  console.log("📝 INSCRIPTION:", email);

  if (!email || !password || password.length < 6 || !email.includes("@")) {
    return { success: false, error: "Données invalides" };
  }

  if (ADMIN_CREDENTIALS.emails.includes(email)) {
    return { success: false, error: "Email admin réservé" };
  }

  try {
    const users = await getUsers();
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email déjà utilisé" };
    }

    const success = await saveUser(email, password);
    if (success) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("email", email);

      STATE.currentUser = { email, role: "user" };
      await syncUsersCache();

      console.log("✅ INSCRIPTION OK → index.html");
      return {
        success: true,
        message: "Compte créé ! Redirection...",
        redirect: "index.html",
      };
    }

    return { success: false, error: "Erreur création compte" };
  } catch (e) {
    console.error("❌ REGISTER ERROR:", e);
    return { success: false, error: "Erreur serveur" };
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
    console.log("🔄 USERS CACHE:", STATE.usersCache.length, "utilisateurs");
  } catch (e) {
    console.error("Cache sync error:", e);
  }
}

async function getUsers() {
  if (!db) return [];
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("getUsers error:", e);
    return [];
  }
}

async function saveUser(email, password) {
  if (!db) return false;
  try {
    const usersRef = db.collection("users");
    await usersRef.add({
      email,
      password,
      role: "user",
      createdAt: new Date().toISOString(),
      banned: false,
    });
    return true;
  } catch (e) {
    console.error("saveUser error:", e);
    return false;
  }
}

// =====================================================
// 🔥 5. CORE MASTER - DOMContentLoaded
// =====================================================
document.addEventListener("DOMContentLoaded", async function () {
  console.log("🚀 Otaku-Saga MASTER chargé - DEBUG ACTIF");

  await initFirebase();
  const currentPage = getCurrentPage();
  console.log("📍 Page:", currentPage);

  await handlePageAuth(currentPage);
  attachUnifiedEvents();

  if (currentPage === "admin.html") {
    await initAdminDashboard();
  }

  console.log("✅ MASTER READY - État:", STATE);
});

// =====================================================
// 🔥 6. DÉTECTION + ROUTING
// =====================================================
function getCurrentPage() {
  return (
    window.location.pathname.split("/").pop().split("?")[0] ||
    window.location.href.split("/").pop().split("?")[0] ||
    "index.html"
  );
}

async function handlePageAuth(page) {
  const isAuth = localStorage.getItem("isAuthenticated") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const protectedPages = [
    "accueil.html",
    "actus.html",
    "service.html",
    "contact.html",
    "apropos.html",
    "lecture.html",
  ];

  if (protectedPages.includes(page) && !isAuth) {
    console.log("🔒 Redirection → index.html");
    window.location.replace("index.html");
    return;
  }

  if (page === "admin.html" && !isAdmin) {
    console.log("👑 Non-admin → index.html");
    localStorage.removeItem("isAdmin");
    window.location.replace("index.html");
    return;
  }

  if (page === "index.html" && isAuth) {
    const alreadyConnected = document.getElementById("alreadyConnected");
    if (alreadyConnected) {
      alreadyConnected.style.display = "block";
      console.log("✅ alreadyConnected AFFICHE");
    }
  }
}

// =====================================================
// 🔥 7. EVENTS UNIFIÉS
// =====================================================
function attachUnifiedEvents() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", handleLoginForm);

  const registerForm = document.getElementById("registerForm");
  if (registerForm) registerForm.addEventListener("submit", handleRegisterForm);

  const adminBtn = document.getElementById("adminLoginBtn");
  if (adminBtn) adminBtn.addEventListener("click", handleAdminQuickLogin);

  const registerLink = document.getElementById("registerLink");
  if (registerLink) {
    registerLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "inscription.html";
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
}

// =====================================================
// 🔥 8. HANDLERS FORMULAIRES
// =====================================================
async function handleLoginForm(e) {
  e.preventDefault();
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) return showError("Champs vides");

  const result = await authenticateUser(email, password);
  if (!result.success) showError(result.error);
}

async function handleRegisterForm(e) {
  e.preventDefault();
  const email = document.getElementById("regEmail")?.value.trim();
  const password = document.getElementById("regPassword")?.value.trim();

  const result = await registerUser(email, password);

  if (result.success) {
    const submitBtn = document.getElementById("submitBtn");
    const successMsg = document.getElementById("regSuccessMessage");

    if (submitBtn) submitBtn.textContent = "Créé !";
    if (successMsg) {
      successMsg.innerHTML = "✅ Compte créé ! Redirection...";
      successMsg.style.display = "block";
    }

    setTimeout(() => window.location.replace("index.html"), 1500);
  } else {
    const errorEl = document.getElementById("regErrorMessage");
    if (errorEl) errorEl.textContent = result.error;
  }
}

// ✅ AUTO-FILL SUPPRIMÉ - Instructions manuelles
async function handleAdminQuickLogin() {
  console.log("👑 ADMIN BUTTON - Instructions affichées");

  const errorMsg = document.getElementById("errorMessage");
  if (errorMsg) {
    errorMsg.innerHTML = `
      <strong>👑 PORTAIL ADMINISTRATEUR</strong><br><br>
      📧 <strong>Email:</strong> <code>admin@otaku.com</code><br>
      🔑 <strong>Mot de passe:</strong> <code>OtakuSaga2026!</code><br><br>
      <small style="color: orange;">⚠️ Tapez MANUELLEMENT dans le formulaire ci-dessus</small>
    `;
    errorMsg.style.display = "block";
    errorMsg.style.background = "rgba(255, 193, 7, 0.1)";
    errorMsg.style.border = "1px solid rgba(255, 193, 7, 0.3)";
    errorMsg.style.padding = "15px";
    errorMsg.style.borderRadius = "8px";
  }
}

// =====================================================
// 🔥 9. ADMIN DASHBOARD COMPLET
// =====================================================
async function initAdminDashboard() {
  if (!STATE.isAdmin) return;

  await loadAdminData();
  setupAdminListeners();
  console.log("👑 Admin Dashboard chargé");
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
    active: STATE.usersCache.filter((u) => !u.banned).length,
    banned: STATE.usersCache.filter((u) => u.banned).length,
    admins: STATE.usersCache.filter((u) => u.role === "admin").length,
  };
}

function updateStatsUI(stats) {
  const totalEl = document.getElementById("totalUsers");
  const activeEl = document.getElementById("activeUsers");
  const bannedEl = document.getElementById("bannedUsers");

  if (totalEl) totalEl.textContent = stats.total;
  if (activeEl) activeEl.textContent = stats.active;
  if (bannedEl) bannedEl.textContent = stats.banned;
}

function displayUsersTable(users) {
  const tbody = document.querySelector("#usersTable tbody");
  if (!tbody) return;

  tbody.innerHTML = users
    .map(
      (user, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${user.email}</td>
      <td>${user.role || "user"}</td>
      <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR") : "N/A"}</td>
      <td style="color: ${user.banned ? "red" : "green"}">
        ${user.banned ? "🚫 Banni" : "✅ Actif"}
      </td>
      <td>
        <button onclick="window.toggleBan('${user.email}')" 
                class="btn-small ${user.banned ? "btn-success" : "btn-danger"}">
          ${user.banned ? "Débanir" : "Bannir"}
        </button>
        <button onclick="window.changeRole('${user.email}')" class="btn-small btn-warning">Rôle</button>
        <button onclick="window.deleteUser('${user.email}')" class="btn-small btn-danger">Suppr</button>
      </td>
    </tr>
  `,
    )
    .join("");
}

function setupAdminListeners() {
  const searchInput = document.getElementById("searchUser");
  if (searchInput) {
    searchInput.addEventListener("input", async function () {
      const filtered = STATE.usersCache.filter((u) =>
        u.email.toLowerCase().includes(this.value.toLowerCase()),
      );
      displayUsersTable(filtered);
    });
  }

  const adminLogout = document.getElementById("adminLogout");
  if (adminLogout) {
    adminLogout.addEventListener("click", handleLogout);
  }
}

// =====================================================
// 🔥 10. ADMIN ACTIONS
// =====================================================
async function updateUser(email, updates) {
  if (!db) return false;
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    const userDoc = snapshot.docs.find((doc) => doc.data().email === email);
    if (userDoc) {
      await userDoc.ref.update(updates);
      await syncUsersCache();
      return true;
    }
    return false;
  } catch (e) {
    console.error("updateUser error:", e);
    return false;
  }
}

async function deleteUserByEmail(email) {
  if (!db) return false;
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();
    const userDoc = snapshot.docs.find((doc) => doc.data().email === email);
    if (userDoc) {
      await userDoc.ref.delete();
      await syncUsersCache();
      return true;
    }
    return false;
  } catch (e) {
    console.error("deleteUserByEmail error:", e);
    return false;
  }
}

// =====================================================
// 🔥 11. LOGOUT + UTILITAIRES
// =====================================================
function handleLogout(e) {
  e?.preventDefault();
  if (!confirm("Déconnexion ?")) return;

  localStorage.clear();
  sessionStorage.clear();
  STATE = {
    isInitialized: true,
    currentUser: null,
    isAdmin: false,
    usersCache: [],
  };

  window.location.replace("index.html");
}

function showError(message, targetId = "errorMessage") {
  const el =
    document.getElementById(targetId) ||
    document.getElementById("regErrorMessage");
  if (el) {
    el.textContent = message;
    el.style.display = "block";
    setTimeout(() => (el.style.display = "none"), 5000);
  }
  console.error("❌", message);
}

// =====================================================
// 🔥 12. EXPORTS GLOBAUX ADMIN
// =====================================================
window.toggleBan = async (email) => {
  const user = STATE.usersCache.find((u) => u.email === email);
  if (user) {
    await updateUser(email, { banned: !user.banned });
    await loadAdminData();
    console.log("🔄 Ban togglé:", email);
  }
};

window.changeRole = async (email) => {
  const newRole = prompt("Nouveau rôle (user/moderator/admin):", "user");
  if (
    newRole &&
    ["user", "moderator", "admin"].includes(newRole.toLowerCase())
  ) {
    await updateUser(email, { role: newRole.toLowerCase() });
    await loadAdminData();
    console.log("🔄 Rôle changé:", email, newRole);
  }
};

window.deleteUser = async (email) => {
  if (confirm("Supprimer définitivement cet utilisateur ?")) {
    await deleteUserByEmail(email);
    await loadAdminData();
    console.log("🗑️ Utilisateur supprimé:", email);
  }
};

// FIN MASTER V2.1
console.log("🎌 Otaku-Saga 2.1 MASTER ✅ - Auto-fill SUPPRIMÉ + Admin COMPLET");
