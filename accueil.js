// Données des mangas pour le diaporama (avec vraies images en ligne depuis internet)
const mangaSlides = [
    {
        title: "One Piece",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        description: "L'aventure épique de Monkey D. Luffy"
    },
    {
        title: "Naruto",
        image: "https://cdn.myanimelist.net/images/manga/1/157897.jpg",
        description: "Le ninja aux rêves de devenir Hokage"
    },
    {
        title: "Dragon Ball Z",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        description: "Les combats légendaires de Goku"
    },
    {
        title: "Attack on Titan",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        description: "La lutte contre les Titans"
    },
    {
        title: "Demon Slayer",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        description: "L'histoire de Tanjiro Kamado"
    },
    {
        title: "My Hero Academia",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        description: "L'ascension d'Izuku Midoriya"
    },
    {
        title: "Kaiju No. 8",
        image: "https://cdn.myanimelist.net/images/manga/3/238006.jpg",
        description: "Kafka Hibino et la Force de Défense contre les Kaiju"
    },
    {
        title: "Jujutsu Kaisen",
        image: "https://cdn.myanimelist.net/images/manga/2/253146.jpg",
        description: "Yuji Itadori et le monde des malédictions"
    }
];

let currentSlide = 0;
let carouselInterval;

// Initialiser le diaporama
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!track || !dotsContainer) {
        console.error('Éléments du carousel non trouvés');
        return;
    }
    
    // Créer les slides
    mangaSlides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'carousel-slide';
        slideDiv.innerHTML = `
            <img src="${slide.image}" alt="${slide.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/1200x600/6c5ce7/ffffff?text=${encodeURIComponent(slide.title)}'">
            <div class="carousel-slide-info">
                <h3>${slide.title}</h3>
                <p>${slide.description}</p>
            </div>
        `;
        track.appendChild(slideDiv);
        
        // Créer les dots
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Boutons de navigation
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => changeSlide(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => changeSlide(1));
    }
    
    // Démarrer le diaporama automatique
    startAutoCarousel();
    
    // Pause au survol
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoCarousel);
        carouselContainer.addEventListener('mouseleave', startAutoCarousel);
    }
}

function changeSlide(direction) {
    currentSlide += direction;
    
    if (currentSlide < 0) {
        currentSlide = mangaSlides.length - 1;
    } else if (currentSlide >= mangaSlides.length) {
        currentSlide = 0;
    }
    
    goToSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Mettre à jour les dots
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
    
    // Redémarrer le diaporama
    startAutoCarousel();
}

function startAutoCarousel() {
    stopAutoCarousel();
    carouselInterval = setInterval(() => {
        changeSlide(1);
    }, 5000); // Change toutes les 5 secondes
}

function stopAutoCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

// Initialiser quand la page est chargée
document.addEventListener('DOMContentLoaded', initCarousel);
