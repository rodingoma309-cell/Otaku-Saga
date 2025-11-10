// Variables globales
let currentMangas = [];
let currentFilter = 'all';
let currentPage = 1;
const itemsPerPage = 12;

// Initialiser la page
document.addEventListener('DOMContentLoaded', function() {
    // Attendre que les données des mangas soient chargées
    if (window.allMangas && window.allMangas.length > 0) {
        currentMangas = window.allMangas;
        renderMangas();
        setupEventListeners();
    } else {
        // Si les données ne sont pas encore chargées, attendre un peu
        setTimeout(() => {
            if (window.allMangas && window.allMangas.length > 0) {
                currentMangas = window.allMangas;
                renderMangas();
                setupEventListeners();
            }
        }, 100);
    }
});

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Recherche
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSearch();
        });
        searchBtn.style.cursor = 'pointer';
    }
    
    // Filtres
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter || 'all';
            currentPage = 1;
            applyFilters();
        });
    });
}

// Gérer la recherche
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    currentPage = 1;
    applyFilters(searchTerm);
}

// Appliquer les filtres
function applyFilters(searchTerm = '') {
    let filtered = window.allMangas || [];
    
    // Filtre par genre/catégorie
    if (currentFilter !== 'all') {
        filtered = filtered.filter(manga => 
            manga.genre === currentFilter || manga.category === currentFilter
        );
    }
    
    // Filtre par recherche
    if (searchTerm) {
        filtered = filtered.filter(manga =>
            manga.title.toLowerCase().includes(searchTerm) ||
            manga.author.toLowerCase().includes(searchTerm) ||
            manga.description.toLowerCase().includes(searchTerm)
        );
    }
    
    currentMangas = filtered;
    renderMangas();
}

// Afficher les mangas
function renderMangas() {
    const grid = document.getElementById('mangasGrid');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const mangasToShow = currentMangas.slice(startIndex, endIndex);
    
    grid.innerHTML = '';
    
    if (mangasToShow.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #b0b0b0;">Aucun manga trouvé</p>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    mangasToShow.forEach(manga => {
        const card = createMangaCard(manga);
        grid.appendChild(card);
    });
    
    renderPagination();
}

// Créer une carte de manga
function createMangaCard(manga) {
        const card = document.createElement('div');
        card.className = 'manga-card';
        card.innerHTML = `
        <img src="${manga.image}" alt="${manga.title}" class="manga-cover" loading="lazy" 
             onerror="this.onerror=null; this.src='https://via.placeholder.com/400x600/667eea/ffffff?text=${encodeURIComponent(manga.title)}'">
            <div class="manga-info">
                <h3 class="manga-title">${manga.title}</h3>
                <p class="manga-author">Par ${manga.author}</p>
                <p class="manga-description">${manga.description}</p>
                <div class="manga-meta">
                <span class="manga-genre">${manga.genre}</span>
                    <span class="manga-seasons">${manga.seasons}</span>
            </div>
        </div>
    `;
    
    // Rendre la carte cliquable
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        e.preventDefault();
        showMangaDetails(manga);
    });
    
    return card;
}

// Afficher les détails d'un manga
function showMangaDetails(manga) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    // Utiliser fullStory si disponible, sinon description
    const storyText = manga.fullStory || manga.description;
    const readUrl = manga.readLink || `https://www.mangaread.org/manga/${manga.title.toLowerCase().replace(/\s+/g, '-')}/`;
    
    modal.innerHTML = `
        <div style="background: rgba(30, 30, 46, 0.95); border-radius: 20px; padding: 40px; max-width: 900px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
            <button id="closeModal" style="position: absolute; top: 20px; right: 20px; background: #667eea; border: none; color: white; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.5em; transition: all 0.3s ease; z-index: 10001;">×</button>
            <div style="display: flex; gap: 30px; margin-bottom: 30px; flex-wrap: wrap;">
                <img src="${manga.image}" alt="${manga.title}" 
                     style="width: 250px; height: 350px; object-fit: cover; border-radius: 15px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/250x350/667eea/ffffff?text=${encodeURIComponent(manga.title)}'">
                <div style="flex: 1; min-width: 250px;">
                    <h2 style="font-size: 2.5em; margin-bottom: 15px; color: #667eea; text-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);">${manga.title}</h2>
                    <p style="color: #b0b0b0; margin-bottom: 15px; font-size: 1.1em;"><strong style="color: #ffffff;">Auteur:</strong> ${manga.author}</p>
                    <p style="color: #b0b0b0; margin-bottom: 15px; font-size: 1.1em;"><strong style="color: #ffffff;">Genre:</strong> <span style="background: rgba(102, 126, 234, 0.2); padding: 5px 12px; border-radius: 15px; color: #a29bfe;">${manga.genre}</span></p>
                    <p style="color: #b0b0b0; margin-bottom: 15px; font-size: 1.1em;"><strong style="color: #ffffff;">Saisons:</strong> ${manga.seasons}</p>
                    <p style="color: #b0b0b0; margin-bottom: 25px; font-size: 1.1em;"><strong style="color: #ffffff;">Note:</strong> <span style="color: #ffd700; font-size: 1.2em;">⭐</span> ${manga.rating}/5</p>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 20px;">
                        <a href="lecture.html?id=${manga.id}" id="readFullStoryBtn" 
                           style="display: inline-block; background: linear-gradient(135deg, #6c5ce7 0%, #fd79a8 100%); color: white; padding: 15px 35px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 1.1em; transition: all 0.3s ease; box-shadow: 0 6px 20px rgba(108, 92, 231, 0.4); cursor: pointer; animation: pulse 2s infinite;"
                           onmouseover="this.style.transform='translateY(-3px) scale(1.05)'; this.style.boxShadow='0 10px 30px rgba(108, 92, 231, 0.6)'"
                           onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 6px 20px rgba(108, 92, 231, 0.4)'">
                            📚 Lire toute l'histoire dans Otaku Saga →
                        </a>
                        <a href="${readUrl}" target="_blank" id="readMangaBtn" 
                           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 1.1em; transition: all 0.3s ease; box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); cursor: pointer;"
                           onmouseover="this.style.transform='translateY(-3px) scale(1.05)'; this.style.boxShadow='0 10px 30px rgba(102, 126, 234, 0.6)'"
                           onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.4)'">
                            📖 Lire en ligne (externe) →
                        </a>
                    </div>
                    <style>
                        @keyframes pulse {
                            0%, 100% { box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4); }
                            50% { box-shadow: 0 6px 30px rgba(102, 126, 234, 0.7); }
                        }
                    </style>
                </div>
            </div>
            <div style="margin-top: 30px; padding-top: 30px; border-top: 2px solid rgba(255, 255, 255, 0.1);">
                <h3 style="color: #667eea; margin-bottom: 20px; font-size: 1.8em; display: flex; align-items: center; gap: 10px;">
                    <span>📖</span> Résumé de l'Histoire
                </h3>
                <p style="color: #d0d0d0; line-height: 1.9; font-size: 1.05em; text-align: justify; background: rgba(102, 126, 234, 0.05); padding: 20px; border-radius: 12px; border-left: 4px solid #667eea;">${storyText}</p>
                </div>
            </div>
        `;
    
    document.body.appendChild(modal);
    
    // Bouton de fermeture
    const closeBtn = modal.querySelector('#closeModal');
    closeBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.background = '#764ba2';
    });
    closeBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.background = '#667eea';
    });
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Bouton "Lire le Manga"
    const readBtn = modal.querySelector('#readMangaBtn');
    readBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
    });
    readBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
    });
    
    // Fermer en cliquant en dehors
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Fermer avec Échap
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escHandler);
            }
        }
    });
}

// Afficher la pagination
function renderPagination() {
    const totalPages = Math.ceil(currentMangas.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Bouton précédent
    html += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">‹ Précédent</button>`;
    
    // Numéros de page
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<span style="padding: 12px; color: #b0b0b0;">...</span>`;
        }
    }
    
    // Bouton suivant
    html += `<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Suivant ›</button>`;
    
    pagination.innerHTML = html;
}

// Changer de page
function changePage(page) {
    const totalPages = Math.ceil(currentMangas.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderMangas();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
