// Système d'authentification avec localStorage

// Vérifier si l'utilisateur est connecté
function checkAuth() {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  // Obtenir le nom de fichier de manière plus fiable
  const currentPage =
    window.location.pathname.split("/").pop() ||
    window.location.href.split("/").pop();

  // Liste des pages protégées (nécessitent une authentification)
  const protectedPages = [
    "accueil.html",
    "actus.html",
    "service.html",
    "contact.html",
    "apropos.html",
    "lecture.html",
  ];

  // Si on est sur une page protégée et pas connecté, rediriger vers auth
  if (protectedPages.includes(currentPage) && !isAuthenticated) {
    window.location.href = "auth.html";
    return false;
  }

  // Sur la page auth.html, on laisse l'utilisateur voir la page même s'il est connecté
  // Il peut choisir de se reconnecter ou aller à l'accueil
  // Pas de redirection automatique depuis auth.html

  return true;
}

// Boutons de navigation
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

if (prevBtn) {
  prevBtn.addEventListener("click", () => changeSlide(-1));
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => changeSlide(1));
}

// Initialiser l'authentification au chargement
document.addEventListener("DOMContentLoaded", function () {
  // Vérifier l'authentification
  checkAuth();

  // Si on est sur auth.html et déjà connecté, afficher un message
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

  // Gérer le formulaire de connexion
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Gérer le bouton de déconnexion
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  // Gérer le lien d'inscription (création de compte simple)
  const registerLink = document.getElementById("registerLink");
  if (registerLink) {
    registerLink.addEventListener("click", function (e) {
      e.preventDefault();
      // Pour simplifier, on utilise le même formulaire
      // En production, vous auriez une vraie page d'inscription
      alert(
        "Pour cette démo, utilisez n'importe quel email et mot de passe pour vous connecter."
      );
    });
  }
});

// Gérer la connexion
function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("errorMessage");

  // Validation simple
  if (!email || !password) {
    showError("Veuillez remplir tous les champs");
    return;
  }

  // Validation email basique
  if (!email.includes("@")) {
    showError("Veuillez entrer une adresse email valide");
    return;
  }

  // Pour cette démo, on accepte n'importe quel email/mot de passe
  // En production, vous vérifieriez contre une base de données
  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("userEmail", email);

  // Rediriger vers l'accueil
  window.location.href = "accueil.html";
}

// Gérer la déconnexion
function handleLogout(e) {
  e.preventDefault();

  if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    window.location.href = "auth.html";
  }
}

// Afficher un message d'erreur
function showError(message) {
  const errorMessage = document.getElementById("errorMessage");
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");

    // Masquer après 5 secondes
    setTimeout(() => {
      errorMessage.classList.remove("show");
    }, 5000);
  }
}

// Exporter les fonctions pour utilisation dans d'autres fichiers
window.checkAuth = checkAuth;
window.handleLogout = handleLogout;
