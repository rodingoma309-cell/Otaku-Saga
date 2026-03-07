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
    window.location.href = "auth.html";
    return false;
  }

  return true;
}

// Initialisation au chargement
document.addEventListener("DOMContentLoaded", function () {
  checkAuth();

  const currentPage =
    window.location.pathname.split("/").pop() ||
    window.location.href.split("/").pop();

  if (
    currentPage === "auth.html" ||
    currentPage === "" ||
    currentPage.includes("auth.html")
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

  // === AJOUT : Gestion formulaire d'inscription ===
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }
  // === FIN AJOUT ===

  // Gestion bouton déconnexion
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  // Lien inscription (mise à jour pour redirection)
  const registerLink = document.getElementById("registerLink");
  if (registerLink) {
    registerLink.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "inscription.html"; // Redirection vers inscription
    });
  }
});

// Gérer la connexion
function handleLogin(e) {
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

  // === AJOUT : Vérification utilisateur inscrit ===
  const users = JSON.parse(localStorage.getItem("otakuSagaUsers") || "[]");
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    showError("❌ Email ou mot de passe incorrect. Inscrivez-vous d'abord.");
    return;
  }
  // === FIN AJOUT ===

  //je stocke egalement l'adresse email de l'utilisateur
  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("email", email);

  window.location.href = "accueil.html";
}

// === AJOUT COMPLET : Fonction d'inscription ===
function handleRegister(e) {
  e.preventDefault();

  const regEmailInput = document.getElementById("regEmail");
  const regPasswordInput = document.getElementById("regPassword");
  const regErrorMessage = document.getElementById("regErrorMessage");
  const regSuccessMessage = document.getElementById("regSuccessMessage");

  const email = regEmailInput.value.trim();
  const password = regPasswordInput.value.trim();

  if (!email || !password) {
    if (regErrorMessage)
      regErrorMessage.textContent = "Veuillez remplir tous les champs";
    return;
  }

  if (password.length < 6) {
    if (regErrorMessage)
      regErrorMessage.textContent =
        "Le mot de passe doit faire au moins 6 caractères";
    return;
  }

  const users = JSON.parse(localStorage.getItem("otakuSagaUsers") || "[]");

  if (users.find((u) => u.email === email)) {
    if (regErrorMessage)
      regErrorMessage.textContent = "Cet email est déjà utilisé";
    return;
  }

  users.push({ email, password });
  localStorage.setItem("otakuSagaUsers", JSON.stringify(users));

  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("email", email);

  if (regSuccessMessage) {
    regSuccessMessage.textContent = "✅ Inscription réussie ! Redirection...";
    regSuccessMessage.style.display = "block";
  }

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}
// === FIN AJOUT ===

// Gérer la déconnexion
function handleLogout(e) {
  e.preventDefault();
  if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("email");
    localStorage.removeItem("otakuSagaUsers"); // Nettoyage
    window.location.href = "auth.html";
  }
}

// Afficher un message d'erreur
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

// Exporter les fonctions pour d'autres fichiers
window.checkAuth = checkAuth;
window.handleLogout = handleLogout;
