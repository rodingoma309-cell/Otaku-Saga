// ===== GESTION MODE HORS LIGNE =====

class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.setupListeners();
    this.checkConnection();
  }

  setupListeners() {
    window.addEventListener("online", () => this.handleOnline());
    window.addEventListener("offline", () => this.handleOffline());
  }

  handleOnline() {
    this.isOnline = true;
    this.showNotification("✅ Vous êtes connecté à Internet", "success");
    document.body.classList.remove("offline-mode");
    this.syncData();
  }

  handleOffline() {
    this.isOnline = false;
    this.showNotification("❌ Pas de connexion Internet", "error");
    document.body.classList.add("offline-mode");
    this.disableFeatures();
  }

  checkConnection() {
    if (!this.isOnline) {
      document.body.classList.add("offline-mode");
      this.disableFeatures();
    }
  }

  disableFeatures() {
    // Désactiver les formulaires
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.style.opacity = "0.6";
      form.style.pointerEvents = "none";
    });

    // Désactiver les boutons de connexion/inscription
    const authButtons = document.querySelectorAll(".btn-auth, .btn-login");
    authButtons.forEach((btn) => {
      btn.disabled = true;
      btn.style.cursor = "not-allowed";
      btn.title = "Vous devez être connecté à Internet";
    });

    // Message d'alerte
    this.showOfflineMessage();
  }

  enableFeatures() {
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      form.style.opacity = "1";
      form.style.pointerEvents = "auto";
    });

    const authButtons = document.querySelectorAll(".btn-auth, .btn-login");
    authButtons.forEach((btn) => {
      btn.disabled = false;
      btn.style.cursor = "pointer";
      btn.title = "";
    });
  }

  showOfflineMessage() {
    let offlineBar = document.getElementById("offlineBar");

    if (!offlineBar) {
      offlineBar = document.createElement("div");
      offlineBar.id = "offlineBar";
      offlineBar.innerHTML = `
                <div style="
                    background: #e74c3c;
                    color: white;
                    padding: 15px;
                    text-align: center;
                    font-weight: 600;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 10000;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                ">
                    🔴 Mode hors ligne - Veuillez vérifier votre connexion Internet
                </div>
            `;
      document.body.insertBefore(offlineBar, document.body.firstChild);

      if (document.body.style.marginTop === "") {
        document.body.style.marginTop = "60px";
      }
    }
  }

  removeOfflineMessage() {
    const offlineBar = document.getElementById("offlineBar");
    if (offlineBar) {
      offlineBar.remove();
      document.body.style.marginTop = "0";
    }
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === "success" ? "#27ae60" : "#e74c3c"};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  }

  // Synchroniser les données lors de la reconnexion
  async syncData() {
    const cachedData = JSON.parse(localStorage.getItem("pendingData")) || [];

    if (cachedData.length > 0) {
      for (const data of cachedData) {
        try {
          if (data.type === "login") {
            // Relancer la connexion
          } else if (data.type === "register") {
            // Relancer l'inscription
          }
        } catch (error) {
          console.error("Erreur de synchronisation:", error);
        }
      }
      localStorage.removeItem("pendingData");
    }
  }

  // Vérifier si l'utilisateur est en ligne avant une action
  static checkBeforeAction(actionName) {
    const isOnline = navigator.onLine;

    if (!isOnline) {
      const notification = document.createElement("div");
      notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 10001;
                text-align: center;
                max-width: 400px;
            `;
      notification.innerHTML = `
                <h2 style="color: #e74c3c; margin-bottom: 15px;">❌ Mode hors ligne</h2>
                <p style="color: #7f8c8d; margin-bottom: 20px;">
                    Impossible de ${actionName}. Veuillez vérifier votre connexion Internet.
                </p>
                <button onclick="this.parentElement.remove()" style="
                    padding: 10px 20px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                ">Fermer</button>
            `;
      document.body.appendChild(notification);
      return false;
    }
    return true;
  }
}

// Initialiser au chargement
const offlineManager = new OfflineManager();

// Ajouter le style d'animation
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    body.offline-mode .btn-auth,
    body.offline-mode .btn-login,
    body.offline-mode form {
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);
