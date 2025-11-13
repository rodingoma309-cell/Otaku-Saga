const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");
const registerLink = document.getElementById("registerLink");
const loginLink = document.getElementById("loginLink");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");
const registerErrorMessage = document.getElementById("registerErrorMessage");

// Basculer vers l'inscription
registerLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginBox.style.display = "none";
  registerBox.style.display = "block";
  errorMessage.textContent = "";
});

// Basculer vers la connexion
loginLink.addEventListener("click", (e) => {
  e.preventDefault();
  registerBox.style.display = "none";
  loginBox.style.display = "block";
  registerErrorMessage.textContent = "";
});

// Gestion de l'inscription
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("registerUsername").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const bio = document.getElementById("registerBio").value.trim();

  registerErrorMessage.textContent = "";

  // Validation
  if (username.length < 3 || username.length > 20) {
    registerErrorMessage.textContent =
      "Le pseudo doit contenir entre 3 et 20 caractères.";
    return;
  }

  if (password.length < 6) {
    registerErrorMessage.textContent =
      "Le mot de passe doit contenir au moins 6 caractères.";
    return;
  }

  if (password !== confirmPassword) {
    registerErrorMessage.textContent =
      "Les mots de passe ne correspondent pas.";
    return;
  }

  try {
    // Créer l'utilisateur avec Firebase
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    // Mettre à jour le profil avec le nom d'utilisateur
    await userCredential.user.updateProfile({
      displayName: username,
    });

    // Vous pouvez stocker la bio dans Firestore si vous l'avez configuré
    // Pour l'instant, nous stockons juste le profil de base

    registerErrorMessage.style.color = "#27ae60";
    registerErrorMessage.textContent =
      "✓ Inscription réussie ! Redirection en cours...";

    // Rediriger vers la page de connexion après 2 secondes
    setTimeout(() => {
      registerBox.style.display = "none";
      loginBox.style.display = "block";
      registerForm.reset();
      registerErrorMessage.textContent = "";
    }, 2000);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      registerErrorMessage.textContent = "Cet email est déjà utilisé.";
    } else if (error.code === "auth/invalid-email") {
      registerErrorMessage.textContent = "Email invalide.";
    } else if (error.code === "auth/weak-password") {
      registerErrorMessage.textContent = "Le mot de passe est trop faible.";
    } else {
      registerErrorMessage.textContent = error.message;
    }
  }
});

// Gestion de la connexion
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  errorMessage.textContent = "";

  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    window.location.href = "accueil.html";
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      errorMessage.textContent =
        "Aucun compte avec cet email. Veuillez vous inscrire.";
    } else if (error.code === "auth/wrong-password") {
      errorMessage.textContent = "Mot de passe incorrect.";
    } else {
      errorMessage.textContent = error.message;
    }
  }
});

// Vérifier si l'utilisateur est déjà connecté
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById("alreadyConnected").style.display = "block";
    loginForm.style.display = "none";
  }
});
