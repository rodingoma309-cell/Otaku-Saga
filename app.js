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

  // Gestion bouton déconnexion
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  // Lien inscription (simple alert)
  const registerLink = document.getElementById("registerLink");
  if (registerLink) {
    registerLink.addEventListener("click", function (e) {
      e.preventDefault();
      alert(
        "Pour cette démo, utilisez n'importe quel email et mot de passe pour vous connecter."
      );
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

  //je stocke egalement l'adresse email de l'utilisateur
  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("email", email);

  window.location.href = "accueil.html";
}

// Gérer la déconnexion
function handleLogout(e) {
  e.preventDefault();
  if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("email");
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

// Exporter les fonctions pour d’autres fichiers
window.checkAuth = checkAuth;
window.handleLogout = handleLogout;
