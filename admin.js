const ADMIN_EMAILS = ["donatien@admin.com", "blackness@admin.com"];
const ADMIN_PASSWORD = "otaku2025";

const firebaseConfig = {
  apiKey: "AIzaSyDmLoRd1Plxm8TVtHQaIumVZuJIFUkND5k",
  authDomain: "donatien-c5fd7.firebaseapp.com",
  projectId: "donatien-c5fd7",
  storageBucket: "donatien-c5fd7.appspot.com",
  messagingSenderId: "96281887961",
  appId: "1:96281887961:web:0752bc0976cbb3012c6ac8",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let allUsers = [];

// ===== LOGIN ADMIN =====
document
  .getElementById("adminLoginForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    const errorMsg = document.getElementById("adminErrorMessage");

    errorMsg.textContent = "";

    if (!ADMIN_EMAILS.includes(email)) {
      errorMsg.textContent = "Email administrateur non reconnu.";
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      errorMsg.textContent = "Mot de passe administrateur incorrect.";
      return;
    }

    try {
      await auth.signInWithEmailAndPassword(email, password);
      document.getElementById("adminLoginBox").style.display = "none";
      document.getElementById("adminDashboard").style.display = "grid";
      document.getElementById(
        "welcomeAdmin"
      ).textContent = `Bienvenue, ${email}`;
      loadDashboard();
    } catch (error) {
      errorMsg.textContent = error.message;
    }
  });

// ===== LOGOUT =====
document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.signOut().then(() => {
    document.getElementById("adminLoginBox").style.display = "flex";
    document.getElementById("adminDashboard").style.display = "none";
    document.getElementById("adminLoginForm").reset();
  });
});

// ===== NAVIGATION =====
document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-btn")
      .forEach((b) => b.classList.remove("active"));
    document
      .querySelectorAll(".section")
      .forEach((s) => s.classList.remove("active"));

    btn.classList.add("active");
    const section = document.getElementById(btn.dataset.section);
    section.classList.add("active");

    if (btn.dataset.section === "users") loadUsers();
    if (btn.dataset.section === "monitoring") loadMonitoring();
  });
});

// ===== CHARGER LE DASHBOARD =====
async function loadDashboard() {
  try {
    // Récupérer tous les utilisateurs
    const usersSnapshot = await db.collection("users").get();
    allUsers = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Statistiques
    const totalUsers = allUsers.length;
    const activeUsers = allUsers.filter((u) => u.isActive !== false).length;
    const inactiveUsers = totalUsers - activeUsers;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySignups = allUsers.filter((u) => {
      const createdDate = u.createdAt?.toDate?.() || new Date(u.createdAt);
      return createdDate >= today;
    }).length;

    document.getElementById("totalUsers").textContent = totalUsers;
    document.getElementById("activeUsers").textContent = activeUsers;
    document.getElementById("inactiveUsers").textContent = inactiveUsers;
    document.getElementById("todaySignups").textContent = todaySignups;

    // Activité récente
    loadRecentActivity();
  } catch (error) {
    console.error("Erreur lors du chargement du dashboard:", error);
  }
}

async function loadRecentActivity() {
  const activity = allUsers
    .sort(
      (a, b) => (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0)
    )
    .slice(0, 5)
    .map(
      (u) => `
            <div class="activity-item">
                <strong>${
                  u.username || u.email
                }</strong> - Inscrit le ${new Date(
        u.createdAt?.toDate?.() || u.createdAt
      ).toLocaleDateString("fr-FR")}
            </div>
        `
    )
    .join("");

  document.getElementById("recentActivity").innerHTML =
    activity || "<p>Aucune activité récente</p>";
}

// ===== CHARGER LES UTILISATEURS =====
async function loadUsers() {
  try {
    const tableBody = document.getElementById("usersTableBody");

    if (allUsers.length === 0) {
      const usersSnapshot = await db.collection("users").get();
      allUsers = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    displayUsers(allUsers);
  } catch (error) {
    console.error("Erreur lors du chargement des utilisateurs:", error);
  }
}

function displayUsers(users) {
  const tableBody = document.getElementById("usersTableBody");

  if (users.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="6" class="text-center">Aucun utilisateur</td></tr>';
    return;
  }

  tableBody.innerHTML = users
    .map((user) => {
      const createdAt = new Date(user.createdAt?.toDate?.() || user.createdAt);
      const lastActive = user.lastActive
        ? new Date(user.lastActive.toDate?.() || user.lastActive)
        : "N/A";
      const isActive = user.isActive !== false;

      return `
            <tr>
                <td>${user.username || "N/A"}</td>
                <td>${user.email}</td>
                <td>${createdAt.toLocaleDateString("fr-FR")}</td>
                <td>
                    <span class="status-badge ${
                      isActive ? "status-active" : "status-inactive"
                    }">
                        ${isActive ? "Actif" : "Inactif"}
                    </span>
                </td>
                <td>${
                  lastActive === "N/A"
                    ? "N/A"
                    : lastActive.toLocaleDateString("fr-FR")
                }</td>
                <td>
                    <button class="action-btn" onclick="viewUser('${
                      user.id
                    }')">Voir</button>
                    <button class="action-btn delete" onclick="deleteUser('${
                      user.id
                    }')">Supprimer</button>
                </td>
            </tr>
        `;
    })
    .join("");
}

// Recherche et filtre
document.getElementById("searchUsers")?.addEventListener("input", filterUsers);
document.getElementById("filterUsers")?.addEventListener("change", filterUsers);

function filterUsers() {
  const search =
    document.getElementById("searchUsers")?.value.toLowerCase() || "";
  const filter = document.getElementById("filterUsers")?.value || "";

  let filtered = allUsers.filter((u) => {
    const matchesSearch =
      (u.username || "").toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search);
    const matchesFilter =
      !filter ||
      (filter === "active" && u.isActive !== false) ||
      (filter === "inactive" && u.isActive === false);
    return matchesSearch && matchesFilter;
  });

  displayUsers(filtered);
}

// ===== ACTIONS UTILISATEURS =====
function viewUser(userId) {
  const user = allUsers.find((u) => u.id === userId);
  alert(
    `Utilisateur: ${user.username || user.email}\nEmail: ${
      user.email
    }\nInscrit le: ${new Date(
      user.createdAt?.toDate?.() || user.createdAt
    ).toLocaleDateString("fr-FR")}`
  );
}

async function deleteUser(userId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

  try {
    await db.collection("users").doc(userId).delete();
    allUsers = allUsers.filter((u) => u.id !== userId);
    displayUsers(allUsers);
    alert("Utilisateur supprimé avec succès");
  } catch (error) {
    alert("Erreur lors de la suppression: " + error.message);
  }
}

// ===== MONITORING =====
async function loadMonitoring() {
  const startTime = Date.now();

  try {
    await db.collection("users").limit(1).get();
    const responseTime = Date.now() - startTime;

    document.getElementById("responseTime").textContent = responseTime + "ms";
    document.getElementById("serverStatus").textContent = "🟢 En ligne";
    document.getElementById("securityStatus").textContent = "✅ Sécurisé";

    loadActivityLogs();
  } catch (error) {
    document.getElementById("serverStatus").textContent = "🔴 Hors ligne";
  }
}

async function loadActivityLogs() {
  const logs = allUsers
    .map(
      (u) => `
        <div class="log-item">
            [${new Date(u.createdAt?.toDate?.() || u.createdAt).toLocaleString(
              "fr-FR"
            )}] 
            Nouvel utilisateur: ${u.email}
        </div>
    `
    )
    .join("");

  document.getElementById("activityLogs").innerHTML =
    logs || '<div class="log-item">Aucun log</div>';
}

// Vérifier l'authentification au chargement
auth.onAuthStateChanged((user) => {
  if (!user) {
    document.getElementById("adminLoginBox").style.display = "flex";
    document.getElementById("adminDashboard").style.display = "none";
  }
});
