// Sample game data
const games = [
    {
        id: 1,
        name: 'Cosmic Quest',
        description: 'An epic space exploration adventure',
        emoji: '🚀',
        rating: '9.2/10',
        genre: 'Action-Adventure'
    },
    {
        id: 2,
        name: 'Dragon Slayer',
        description: 'Battle legendary dragons in a fantasy realm',
        emoji: '🐉',
        rating: '8.9/10',
        genre: 'RPG'
    },
    {
        id: 3,
        name: 'City Builder Pro',
        description: 'Build and manage your own metropolis',
        emoji: '🏙️',
        rating: '8.5/10',
        genre: 'Strategy'
    },
    {
        id: 4,
        name: 'Speed Racer',
        description: 'High-octane racing on futuristic tracks',
        emoji: '🏎️',
        rating: '8.7/10',
        genre: 'Racing'
    },
    {
        id: 5,
        name: 'Puzzle Master',
        description: 'Mind-bending puzzles to solve',
        emoji: '🧩',
        rating: '8.3/10',
        genre: 'Puzzle'
    },
    {
        id: 6,
        name: 'Soccer Legend',
        description: 'Play as your favorite soccer stars',
        emoji: '⚽',
        rating: '8.8/10',
        genre: 'Sports'
    }
];

// Function to render games
function renderGames() {
    const gamesContainer = document.getElementById('gamesContainer');
    gamesContainer.innerHTML = '';

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.onclick = () => openGameDetails(game);
        
        gameCard.innerHTML = `
            <div class="game-image">${game.emoji}</div>
            <div class="game-info">
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <div class="game-rating">⭐ ${game.rating}</div>
            </div>
        `;
        
        gamesContainer.appendChild(gameCard);
    });
}

// Function to open game details (placeholder)
function openGameDetails(game) {
    alert(`\n🎮 ${game.name}\n\nGenre: ${game.genre}\nRating: ${game.rating}\n\nDescription: ${game.description}\n\nClick "Play" to start the game!`);
}

// Handle contact form submission
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    this.reset();
});

// Initialize games when page loads
document.addEventListener('DOMContentLoaded', renderGames);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});