// Gestion connexion / inscription (sans bio, redirection vers accueil.html)

const loginBox = document.getElementById("loginBox");
const registerBox = document.getElementById("registerBox");
const registerLink = document.getElementById("registerLink");
const loginLink = document.getElementById("loginLink");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");
const registerErrorMessage = document.getElementById("registerErrorMessage");
const alreadyConnectedEl = document.getElementById("alreadyConnected");

const auth = window.firebase && firebase.auth ? firebase.auth() : null;
const hasFirestore = window.firebase && firebase.firestore;
const db = hasFirestore ? firebase.firestore() : null;

registerLink?.addEventListener("click", (e) => {
  e.preventDefault();
  loginBox.style.display = "none";
  registerBox.style.display = "block";
  errorMessage.textContent = "";
});
loginLink?.addEventListener("click", (e) => {
  e.preventDefault();
  registerBox.style.display = "none";
  loginBox.style.display = "block";
  registerErrorMessage.textContent = "";
});

// Inscription
registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (typeof OfflineManager !== "undefined") {
    if (!OfflineManager.checkBeforeAction("vous inscrire")) return;
  } else if (!navigator.onLine) {
    alert("Connexion Internet requise pour vous inscrire.");
    return;
  }

  registerErrorMessage.style.color = "#e74c3c";
  registerErrorMessage.textContent = "";

  const username = document.getElementById("registerUsername").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (username.length < 3 || username.length > 20) {
    registerErrorMessage.textContent =
      "Le pseudo doit contenir entre 3 et 20 caractères.";
    return;
  }
  if (!email) {
    registerErrorMessage.textContent = "L'email est requis.";
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

  if (!auth) {
    registerErrorMessage.textContent = "Firebase Auth non disponible.";
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;

    if (user && user.updateProfile) {
      await user.updateProfile({ displayName: username });
    }

    // Stockage minimal dans Firestore si configuré (sans bio)
    if (db) {
      try {
        await db
          .collection("users")
          .doc(user.uid)
          .set({
            email,
            username,
            createdAt: firebase.firestore.FieldValue.serverTimestamp
              ? firebase.firestore.FieldValue.serverTimestamp()
              : new Date(),
            isActive: true,
            lastActive: firebase.firestore.FieldValue.serverTimestamp
              ? firebase.firestore.FieldValue.serverTimestamp()
              : new Date(),
          });
      } catch (err) {
        console.warn("Erreur Firestore (non bloquante):", err.message || err);
      }
    }

    registerErrorMessage.style.color = "#27ae60";
    registerErrorMessage.textContent = "Inscription réussie — redirection...";

    // Après création l'utilisateur est déjà connecté : rediriger vers accueil.html
    setTimeout(() => {
      window.location.href = "accueil.html";
    }, 900);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      registerErrorMessage.textContent = "Cet email est déjà utilisé.";
    } else if (error.code === "auth/invalid-email") {
      registerErrorMessage.textContent = "Email invalide.";
    } else if (error.code === "auth/weak-password") {
      registerErrorMessage.textContent = "Mot de passe trop faible.";
    } else {
      registerErrorMessage.textContent =
        error.message || "Erreur lors de l'inscription.";
    }
  }
});

// Connexion
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (typeof OfflineManager !== "undefined") {
    if (!OfflineManager.checkBeforeAction("vous connecter")) return;
  } else if (!navigator.onLine) {
    alert("Connexion Internet requise pour vous connecter.");
    return;
  }

  errorMessage.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!auth) {
    errorMessage.textContent = "Firebase Auth non disponible.";
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = "accueil.html";
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      errorMessage.textContent =
        "Aucun compte avec cet email. Vous serez redirigé vers l'inscription.";
      setTimeout(() => {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("registerBox").style.display = "block";
        const regEmail = document.getElementById("registerEmail");
        if (regEmail) regEmail.value = email;
      }, 900);
    } else if (error.code === "auth/wrong-password") {
      errorMessage.textContent = "Mot de passe incorrect.";
    } else {
      errorMessage.textContent =
        error.message || "Erreur lors de la connexion.";
    }
  }
});

// Afficher si déjà connecté
if (auth) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      alreadyConnectedEl && (alreadyConnectedEl.style.display = "block");
      loginForm && (loginForm.style.display = "none");
    } else {
      alreadyConnectedEl && (alreadyConnectedEl.style.display = "none");
      loginForm && (loginForm.style.display = "block");
    }
  });
}
