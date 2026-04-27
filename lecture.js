// Page de lecture complète de l'histoire du manga

document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'ID du manga depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const mangaId = parseInt(urlParams.get('id'));
    
    if (!mangaId || !window.allMangas) {
        displayError('Manga non trouvé');
        return;
    }
    
    // Trouver le manga dans la base de données
    const manga = window.allMangas.find(m => m.id === mangaId);
    
    if (!manga) {
        displayError('Manga non trouvé');
        return;
    }
    
    // Afficher l'histoire complète
    displayFullStory(manga);
});

function displayFullStory(manga) {
    const container = document.getElementById('readingContainer');
    
    // Utiliser fullStory si disponible, sinon description
    const fullStory = manga.fullStory || manga.description;
    
    // Générer le contenu HTML
    container.innerHTML = `
        <div class="reading-header">
            <a href="actus.html" class="back-btn">← Retour aux mangas</a>
            <div class="manga-header-info">
                <img src="${manga.image}" alt="${manga.title}" 
                     class="manga-cover-large"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/300x450/667eea/ffffff?text=${encodeURIComponent(manga.title)}'">
                <div class="manga-header-details">
                    <h1 class="manga-title-large">${manga.title}</h1>
                    <p class="manga-author-large"><strong>Auteur:</strong> ${manga.author}</p>
                    <p class="manga-meta-large">
                        <span class="badge">${manga.genre}</span>
                        <span class="badge">⭐ ${manga.rating}/5</span>
                    </p>
                    <p class="manga-seasons-large"><strong>Saisons:</strong> ${manga.seasons}</p>
                </div>
            </div>
        </div>
        
        <div class="reading-content">
            <div class="story-sections">
                <section class="story-section">
                    <h2 class="section-title">📖 Histoire Complète</h2>
                    <div class="story-text">
                        ${formatStoryText(fullStory)}
                    </div>
                </section>
                
                <section class="story-section">
                    <h2 class="section-title">📚 Tous les Chapitres et Saisons</h2>
                    <div class="chapters-container">
                        ${generateChaptersList(manga)}
                    </div>
                </section>
                
                <section class="story-section">
                    <h2 class="section-title">🔗 Liens de Lecture</h2>
                    <div class="reading-links">
                        <a href="${manga.readLink || '#'}" target="_blank" class="external-read-btn">
                            📖 Lire le manga en ligne (lien externe) →
                        </a>
                    </div>
                </section>
            </div>
        </div>
    `;
}

function formatStoryText(text) {
    // Formater le texte avec des paragraphes
    const paragraphs = text.split('\n').filter(p => p.trim());
    return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
}

function generateChaptersList(manga) {
    // Générer une liste de chapitres basée sur les saisons
    const seasons = manga.seasons || 'Saison 1';
    const seasonMatch = seasons.match(/(\d+)/);
    const numSeasons = seasonMatch ? parseInt(seasonMatch[1]) : 1;
    
    let chaptersHTML = '';
    
    for (let season = 1; season <= numSeasons; season++) {
        chaptersHTML += `
            <div class="season-block">
                <h3 class="season-title">Saison ${season}</h3>
                <div class="chapters-list">
                    ${generateChaptersForSeason(season, manga)}
                </div>
            </div>
        `;
    }
    
    return chaptersHTML || `
        <div class="season-block">
            <h3 class="season-title">${manga.seasons}</h3>
            <div class="chapters-list">
                ${generateDefaultChapters(manga)}
            </div>
        </div>
    `;
}

function generateChaptersForSeason(season, manga) {
    // Générer environ 12-24 chapitres par saison
    const chaptersPerSeason = 20;
    let chaptersHTML = '';
    
    for (let chapter = 1; chapter <= chaptersPerSeason; chapter++) {
        const chapterNum = (season - 1) * chaptersPerSeason + chapter;
        chaptersHTML += `
            <div class="chapter-item">
                <div class="chapter-info">
                    <span class="chapter-number">Chapitre ${chapterNum}</span>
                    <span class="chapter-title">${manga.title} - Épisode ${chapterNum}</span>
                </div>
                <div class="chapter-actions">
                    <button class="btn-read-here" onclick="readChapterHere(${manga.id}, ${chapterNum}, '${manga.title}')">
                        📖 Lire ici
                    </button>
                    <button class="btn-read-external" onclick="readChapterExternal('${manga.readLink}', ${chapterNum})">
                        🔗 Lire en externe
                    </button>
                </div>
            </div>
        `;
    }
    
    return chaptersHTML;
}

function generateDefaultChapters(manga) {
    // Générer des chapitres par défaut
    let chaptersHTML = '';
    const totalChapters = 50; // Nombre approximatif de chapitres
    
    for (let i = 1; i <= totalChapters; i++) {
        chaptersHTML += `
            <div class="chapter-item">
                <div class="chapter-info">
                    <span class="chapter-number">Chapitre ${i}</span>
                    <span class="chapter-title">${manga.title} - Épisode ${i}</span>
                </div>
                <div class="chapter-actions">
                    <button class="btn-read-here" onclick="readChapterHere(${manga.id}, ${i}, '${manga.title}')">
                        📖 Lire ici
                    </button>
                    <button class="btn-read-external" onclick="readChapterExternal('${manga.readLink}', ${i})">
                        🔗 Lire en externe
                    </button>
                </div>
            </div>
        `;
    }
    
    return chaptersHTML;
}

function readChapterHere(mangaId, chapterNum, mangaTitle) {
    // Afficher le chapitre sur le site
    const chapterContent = `
        <div class="chapter-reader">
            <h2>${mangaTitle} - Chapitre ${chapterNum}</h2>
            <div class="chapter-body">
                <p>Contenu du chapitre ${chapterNum} en cours de chargement...</p>
                <p>Titre: ${mangaTitle}</p>
                <p>Numéro du chapitre: ${chapterNum}</p>
                <p style="margin-top: 20px; color: #999;">Le contenu complet du manga sera affiché ici.</p>
            </div>
            <button class="btn-back-chapters" onclick="location.reload()">← Retour aux chapitres</button>
        </div>
    `;
    document.querySelector('.reading-content').innerHTML = chapterContent;
    window.scrollTo(0, 0);
}

function readChapterExternal(readLink, chapterNum) {
    // Rediriger vers le site externe
    if (readLink && readLink !== '#') {
        const externalLink = readLink + (readLink.includes('?') ? '&chapter=' : '?chapter=') + chapterNum;
        window.open(externalLink, '_blank');
    } else {
        alert('Lien externe non disponible pour ce manga');
    }
}

function displayError(message) {
    const container = document.getElementById('readingContainer');
    container.innerHTML = `
        <div class="error-container">
            <h2>❌ ${message}</h2>
            <p>Le manga demandé n'a pas pu être trouvé.</p>
            <a href="actus.html" class="back-btn">← Retour aux mangas</a>
        </div>
    `;
}

// Styles additionnels pour la page de lecture
const style = document.createElement('style');
style.textContent = `
    .reading-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
    }
    
    .reading-header {
        margin-bottom: 50px;
    }
    
    .back-btn {
        display: inline-block;
        color: #6c5ce7;
        text-decoration: none;
        font-weight: 600;
        margin-bottom: 30px;
        padding: 10px 20px;
        background: rgba(108, 92, 231, 0.1);
        border-radius: 10px;
        transition: all 0.3s ease;
    }
    
    .back-btn:hover {
        background: rgba(108, 92, 231, 0.2);
        transform: translateX(-5px);
    }
    
    .manga-header-info {
        display: flex;
        gap: 40px;
        align-items: flex-start;
        background: rgba(255, 255, 255, 0.05);
        padding: 40px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .manga-cover-large {
        width: 300px;
        height: 450px;
        object-fit: cover;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    
    .manga-header-details {
        flex: 1;
    }
    
    .manga-title-large {
        font-size: 3em;
        color: #6c5ce7;
        margin-bottom: 20px;
        background: linear-gradient(135deg, #6c5ce7 0%, #fd79a8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .manga-author-large {
        color: #b0b0b0;
        font-size: 1.2em;
        margin-bottom: 15px;
    }
    
    .manga-meta-large {
        display: flex;
        gap: 15px;
        margin-bottom: 15px;
        flex-wrap: wrap;
    }
    
    .badge {
        background: rgba(108, 92, 231, 0.2);
        color: #a29bfe;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
    }
    
    .manga-seasons-large {
        color: #b0b0b0;
        font-size: 1.1em;
    }
    
    .reading-content {
        margin-top: 50px;
    }
    
    .story-sections {
        display: flex;
        flex-direction: column;
        gap: 40px;
    }
    
    .story-section {
        background: rgba(255, 255, 255, 0.05);
        padding: 40px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .section-title {
        font-size: 2em;
        color: #6c5ce7;
        margin-bottom: 30px;
        padding-bottom: 15px;
        border-bottom: 2px solid rgba(108, 92, 231, 0.3);
    }
    
    .story-text {
        color: #d0d0d0;
        line-height: 2;
        font-size: 1.1em;
        text-align: justify;
    }
    
    .story-text p {
        margin-bottom: 20px;
    }
    
    .chapters-container {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }
    
    .season-block {
        background: rgba(108, 92, 231, 0.05);
        padding: 30px;
        border-radius: 15px;
        border-left: 4px solid #6c5ce7;
    }
    
    .season-title {
        font-size: 1.5em;
        color: #6c5ce7;
        margin-bottom: 20px;
    }
    
    .chapters-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 15px;
    }
    
    .chapter-item {
        background: rgba(255, 255, 255, 0.05);
        padding: 15px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        transition: all 0.3s ease;
    }
    
    .chapter-item:hover {
        background: rgba(108, 92, 231, 0.1);
        transform: translateY(-3px);
    }
    
    .chapter-number {
        color: #6c5ce7;
        font-weight: 600;
        font-size: 0.9em;
    }
    
    .chapter-title {
        color: #ffffff;
        font-size: 1em;
    }
    
    .chapter-status {
        color: #2ed573;
        font-size: 0.85em;
    }
    
    .reading-links {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
    }
    
    .external-read-btn {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 30px;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    
    .external-read-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    }
    
    .error-container {
        text-align: center;
        padding: 60px 20px;
        color: #ff6b6b;
    }
    
    @media (max-width: 768px) {
        .manga-header-info {
            flex-direction: column;
        }
        
        .manga-cover-large {
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
        }
        
        .manga-title-large {
            font-size: 2em;
        }
        
        .chapters-list {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);

