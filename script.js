// Game data with descriptions and controls
const games = [
    {
        id: 'slope',
        name: 'Slope',
        description: 'Roll down an endless slope avoiding obstacles!',
        emoji: '⛷️',
        rating: '9.5/10',
        genre: 'Action',
        type: 'slope',
        info: '← → Arrow Keys to move | Avoid yellow blocks | Get the highest score!'
    },
    {
        id: 'slope2',
        name: 'Slope 2',
        description: 'The faster, harder sequel with enhanced gameplay!',
        emoji: '⛷️',
        rating: '9.3/10',
        genre: 'Action',
        type: 'slope2',
        info: '← → Arrow Keys to move | Faster obstacles | More intense action!'
    },
    {
        id: 'geometry-dash',
        name: 'Geometry Dash',
        description: 'Jump through geometric obstacles with precision!',
        emoji: '🟩',
        rating: '9.1/10',
        genre: 'Rhythm',
        type: 'geometry-dash',
        info: 'SPACE or ↑ to jump | Perfect your timing | Avoid all obstacles!'
    },
    {
        id: 'flappy-bird',
        name: 'Flappy Bird',
        description: 'Navigate through pipes with smooth flying controls!',
        emoji: '🐦',
        rating: '8.9/10',
        genre: 'Action',
        type: 'flappy-bird',
        info: 'SPACE or CLICK to flap | Pass through green pipes | Don\'t touch the walls!'
    },
    {
        id: 'snake',
        name: 'Snake',
        description: 'Classic snake game - eat, grow, and survive!',
        emoji: '🐍',
        rating: '8.7/10',
        genre: 'Puzzle',
        type: 'snake',
        info: '← ↑ ↓ → Arrow Keys to move | Eat red food | Avoid walls and yourself!'
    },
    {
        id: 'space-invaders',
        name: 'Space Invaders',
        description: 'Defend Earth from alien invaders!',
        emoji: '👾',
        rating: '9.0/10',
        genre: 'Shooter',
        type: 'space-invaders',
        info: '← → Arrow Keys to move | SPACE to shoot | Eliminate all enemies!'
    }
];

let currentGame = null;
let gameInstance = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderGames();
    setupModal();
    loadLeaderboard();
});

// Render games
function renderGames() {
    const gamesContainer = document.getElementById('gamesContainer');
    gamesContainer.innerHTML = '';

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.onclick = () => openGame(game);
        
        const highScore = localStorage.getItem(`${game.type}HighScore`) || 0;
        
        gameCard.innerHTML = `
            <div class="game-image">
                ${game.emoji}
                <div class="game-badge">🔥 Top Score: ${highScore}</div>
            </div>
            <div class="game-info">
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <div class="game-meta">
                    <div class="game-rating">⭐ ${game.rating}</div>
                    <button class="play-btn-small" onclick="event.stopPropagation()">▶ Play</button>
                </div>
            </div>
        `;
        
        gamesContainer.appendChild(gameCard);
    });
}

// Open game
function openGame(game) {
    currentGame = game;
    document.getElementById('modalGameTitle').textContent = game.name;
    document.getElementById('gameInfo').textContent = game.info;
    document.getElementById('gameModal').classList.remove('hidden');
    
    const gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.innerHTML = '';
    
    // Initialize the selected game
    if (game.type === 'slope') {
        gameInstance = new SlopeGame(gameCanvas);
    } else if (game.type === 'slope2') {
        gameInstance = new Slope2Game(gameCanvas);
    } else if (game.type === 'geometry-dash') {
        gameInstance = new GeometryDashGame(gameCanvas);
    } else if (game.type === 'flappy-bird') {
        gameInstance = new FlappyBirdGame(gameCanvas);
    } else if (game.type === 'snake') {
        gameInstance = new SnakeGame(gameCanvas);
    } else if (game.type === 'space-invaders') {
        gameInstance = new SpaceInvadersGame(gameCanvas);
    }
    
    updateScoreDisplay();
}

// Setup modal
function setupModal() {
    const modal = document.getElementById('gameModal');
    const closeBtn = document.querySelector('.close');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');

    closeBtn.onclick = () => {
        modal.classList.add('hidden');
        if (gameInstance) gameInstance.stop();
        gameInstance = null;
        renderGames();
    };

    window.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            if (gameInstance) gameInstance.stop();
            gameInstance = null;
            renderGames();
        }
    };

    playBtn.onclick = () => {
        if (gameInstance) {
            gameInstance.start();
            playBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
        }
    };

    pauseBtn.onclick = () => {
        if (gameInstance) {
            gameInstance.pause();
            pauseBtn.classList.add('hidden');
            playBtn.classList.remove('hidden');
        }
    };

    resetBtn.onclick = () => {
        if (gameInstance) {
            gameInstance.reset();
            playBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            updateScoreDisplay();
        }
    };
}

// Update score display
function updateScoreDisplay() {
    if (gameInstance) {
        document.getElementById('scoreDisplay').textContent = `Score: ${gameInstance.score}`;
        document.getElementById('highScoreDisplay').textContent = `Best: ${gameInstance.highScore}`;
        
        const livesDisplay = document.getElementById('livesDisplay');
        if (gameInstance.lives !== undefined) {
            livesDisplay.textContent = `Lives: ${gameInstance.lives}`;
            livesDisplay.classList.remove('hidden');
        } else {
            livesDisplay.classList.add('hidden');
        }
    }
}

function updateScore() {
    updateScoreDisplay();
}

// Load leaderboard
function loadLeaderboard() {
    const leaderboardContainer = document.getElementById('leaderboardContainer');
    leaderboardContainer.innerHTML = '';

    games.forEach(game => {
        const score = parseInt(localStorage.getItem(`${game.type}HighScore`)) || 0;
        const gameLeaderboard = document.createElement('div');
        gameLeaderboard.className = 'leaderboard-game';
        gameLeaderboard.innerHTML = `
            <h3>${game.emoji} ${game.name}</h3>
            <div class="leaderboard-entry">
                <span class="leaderboard-rank"><span class="medal">🥇</span> 1st</span>
                <span class="leaderboard-score">${score} pts</span>
            </div>
        `;
        leaderboardContainer.appendChild(gameLeaderboard);
    });
}

// ============ ENHANCED SLOPE GAME ============
class SlopeGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('slopeHighScore')) || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.lives = 3;
        
        this.ball = {
            x: this.canvas.width / 2,
            y: 50,
            radius: 8,
            velocityX: 0,
            velocityY: 0
        };
        
        this.obstacles = [];
        this.particles = [];
        this.slopeAngle = 0.15;
        this.gameSpeed = 2;
        
        this.setupControls();
        this.generateObstacles();
        updateScore();
    }
    
    setupControls() {
        this.handleKeyDown = (e) => {
            if (this.gameRunning && !this.gamePaused) {
                if (e.key === 'ArrowLeft') this.ball.velocityX = -5;
                if (e.key === 'ArrowRight') this.ball.velocityX = 5;
            }
        };
        
        this.handleKeyUp = () => {
            this.ball.velocityX *= 0.8;
        };
        
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }
    
    generateObstacles() {
        for (let i = 0; i < 10; i++) {
            this.obstacles.push({
                x: Math.random() * (this.canvas.width - 60) + 30,
                y: -500 - i * 200,
                width: 60,
                height: 20
            });
        }
    }
    
    createParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                color: '#ffd93d'
            });
        }
    }
    
    start() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.animate();
    }
    
    pause() {
        this.gamePaused = true;
    }
    
    stop() {
        this.gameRunning = false;
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
    
    reset() {
        this.score = 0;
        this.lives = 3;
        this.ball.x = this.canvas.width / 2;
        this.ball.y = 50;
        this.ball.velocityX = 0;
        this.ball.velocityY = 0;
        this.obstacles = [];
        this.particles = [];
        this.gameSpeed = 2;
        this.generateObstacles();
        updateScore();
        this.gameRunning = false;
    }
    
    animate() {
        if (!this.gameRunning) return;
        if (this.gamePaused) return setTimeout(() => this.animate(), 1000 / 60);
        
        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0f0f0f');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw slope with gradient
        const slopeGradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        slopeGradient.addColorStop(0, '#667eea');
        slopeGradient.addColorStop(1, '#764ba2');
        this.ctx.fillStyle = slopeGradient;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - this.canvas.width * Math.tan(this.slopeAngle));
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.fill();
        
        // Update ball
        this.ball.velocityY += 0.2;
        this.ball.x += this.ball.velocityX;
        this.ball.y += this.ball.velocityY;
        
        // Slope physics
        const slopeY = this.canvas.height - this.ball.x * Math.tan(this.slopeAngle);
        if (this.ball.y + this.ball.radius > slopeY) {
            this.ball.y = slopeY - this.ball.radius;
            this.ball.velocityY = -this.ball.velocityY * 0.6;
        }
        
        // Draw ball with glow
        this.ctx.shadowColor = '#ff6b6b';
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // Draw obstacles
        this.ctx.fillStyle = '#ffd93d';
        this.obstacles.forEach((obs, i) => {
            obs.y += this.gameSpeed;
            this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            
            // Collision
            if (this.ball.x > obs.x && this.ball.x < obs.x + obs.width &&
                this.ball.y > obs.y && this.ball.y < obs.y + obs.height) {
                this.createParticles(this.ball.x, this.ball.y);
                this.lives--;
                if (this.lives <= 0) {
                    this.gameRunning = false;
                    alert(`Game Over! Final Score: ${this.score}`);
                    return;
                }
                this.ball.x = this.canvas.width / 2;
                this.ball.y = 50;
                updateScore();
            }
            
            if (obs.y > this.canvas.height) {
                this.obstacles[i] = {
                    x: Math.random() * (this.canvas.width - 60) + 30,
                    y: -100,
                    width: 60,
                    height: 20
                };
                this.score++;
                this.gameSpeed += 0.05;
                updateScore();
            }
        });
        
        // Draw particles
        this.particles = this.particles.filter(p => p.life > 0);
        this.ctx.fillStyle = '#ffd93d';
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            this.ctx.globalAlpha = p.life;
            this.ctx.fillRect(p.x, p.y, 5, 5);
            this.ctx.globalAlpha = 1;
        });
        
        // Draw score and lives
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText(`Lives: ${this.lives}`, 10, 30);
        
        // Boundaries
        if (this.ball.x < 0 || this.ball.x > this.canvas.width) {
            this.lives--;
            if (this.lives <= 0) {
                this.gameRunning = false;
                alert(`Game Over! Final Score: ${this.score}`);
                return;
            }
            this.ball.x = this.canvas.width / 2;
            this.ball.y = 50;
            updateScore();
        }
        
        if (this.ball.y > this.canvas.height) {
            this.lives--;
            if (this.lives <= 0) {
                this.gameRunning = false;
                alert(`Game Over! Final Score: ${this.score}`);
                return;
            }
            this.ball.x = this.canvas.width / 2;
            this.ball.y = 50;
            updateScore();
        }
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('slopeHighScore', this.highScore);
            updateScore();
        }
        
        setTimeout(() => this.animate(), 1000 / 60);
    }
}

// ============ ENHANCED SLOPE 2 GAME ============
class Slope2Game {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('slope2HighScore')) || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.lives = 2;
        
        this.ball = {
            x: this.canvas.width / 2,
            y: 50,
            radius: 8,
            velocityX: 0,
            velocityY: 0
        };
        
        this.obstacles = [];
        this.particles = [];
        this.slopeAngle = 0.2;
        this.gameSpeed = 3;
        
        this.setupControls();
        this.generateObstacles();
        updateScore();
    }
    
    setupControls() {
        this.handleKeyDown = (e) => {
            if (this.gameRunning && !this.gamePaused) {
                if (e.key === 'ArrowLeft') this.ball.velocityX = -6;
                if (e.key === 'ArrowRight') this.ball.velocityX = 6;
            }
        };
        
        this.handleKeyUp = () => {
            this.ball.velocityX *= 0.8;
        };
        
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }
    
    generateObstacles() {
        for (let i = 0; i < 15; i++) {
            this.obstacles.push({
                x: Math.random() * (this.canvas.width - 50) + 25,
                y: -500 - i * 120,
                width: 50,
                height: 20
            });
        }
    }
    
    createParticles(x, y) {
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                color: '#00d84f'
            });
        }
    }
    
    start() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.animate();
    }
    
    pause() {
        this.gamePaused = true;
    }
    
    stop() {
        this.gameRunning = false;
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
    
    reset() {
        this.score = 0;
        this.lives = 2;
        this.ball.x = this.canvas.width / 2;
        this.ball.y = 50;
        this.ball.velocityX = 0;
        this.ball.velocityY = 0;
        this.obstacles = [];
        this.particles = [];
        this.gameSpeed = 3;
        this.generateObstacles();
        updateScore();
        this.gameRunning = false;
    }
    
    animate() {
        if (!this.gameRunning) return;
        if (this.gamePaused) return setTimeout(() => this.animate(), 1000 / 60);
        
        // Draw background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#16213e');
        gradient.addColorStop(1, '#0f0f0f');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw slope
        const slopeGradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        slopeGradient.addColorStop(0, '#764ba2');
        slopeGradient.addColorStop(1, '#667eea');
        this.ctx.fillStyle = slopeGradient;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - this.canvas.width * Math.tan(this.slopeAngle));
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.fill();
        
        // Update ball
        this.ball.velocityY += 0.25;
        this.ball.x += this.ball.velocityX;
        this.ball.y += this.ball.velocityY;
        
        // Slope physics
        const slopeY = this.canvas.height - this.ball.x * Math.tan(this.slopeAngle);
        if (this.ball.y + this.ball.radius > slopeY) {
            this.ball.y = slopeY - this.ball.radius;
            this.ball.velocityY = -this.ball.velocityY * 0.65;
        }
        
        // Draw ball
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.shadowColor = '#ff6b6b';
        this.ctx.shadowBlur = 20;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        
        // Draw obstacles
        this.ctx.fillStyle = '#00d84f';
        this.obstacles.forEach((obs, i) => {
            obs.y += this.gameSpeed;
            this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            
            // Collision
            if (this.ball.x > obs.x && this.ball.x < obs.x + obs.width &&
                this.ball.y > obs.y && this.ball.y < obs.y + obs.height) {
                this.createParticles(this.ball.x, this.ball.y);
                this.lives--;
                if (this.lives <= 0) {
                    this.gameRunning = false;
                    alert(`Game Over! Final Score: ${this.score}`);
                    return;
                }
                this.ball.x = this.canvas.width / 2;
                this.ball.y = 50;
                updateScore();
            }
            
            if (obs.y > this.canvas.height) {
                this.obstacles[i] = {
                    x: Math.random() * (this.canvas.width - 50) + 25,
                    y: -100,
                    width: 50,
                    height: 20
                };
                this.score += 2;
                this.gameSpeed += 0.12;
                updateScore();
            }
        });
        
        // Draw particles
        this.particles = this.particles.filter(p => p.life > 0);
        this.ctx.fillStyle = '#00d84f';
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            this.ctx.globalAlpha = p.life;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });
        
        // Draw lives
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.font = 'bold 22px Arial';
        this.ctx.fillText(`Lives: ${this.lives}`, 10, 30);
        
        // Boundaries
        if (this.ball.x < 0 || this.ball.x > this.canvas.width || this.ball.y > this.canvas.height) {
            this.lives--;
            if (this.lives <= 0) {
                this.gameRunning = false;
                alert(`Game Over! Final Score: ${this.score}`);
                return;
            }
            this.ball.x = this.canvas.width / 2;
            this.ball.y = 50;
            updateScore();
        }
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('slope2HighScore', this.highScore);
            updateScore();
        }
        
        setTimeout(() => this.animate(), 1000 / 60);
    }
}

// ============ ENHANCED GEOMETRY DASH GAME ============
class GeometryDashGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('geometryHighScore')) || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.player = {
            x: 50,
            y: this.canvas.height - 60,
            width: 30,
            height: 30,
            velocityY: 0,
            jumping: false,
            rotation: 0
        };
        
        this.obstacles = [];
        this.gameSpeed = 6;
        this.frameCount = 0;
        
        this.setupControls();
        updateScore();
    }
    
    setupControls() {
        this.handleKeyDown = (e) => {
            if (this.gameRunning && !this.gamePaused) {
                if ((e.key === ' ' || e.key === 'ArrowUp') && !this.player.jumping) {
                    this.player.velocityY = -12;
                    this.player.jumping = true;
                    e.preventDefault();
                }
            }
        };
        
        document.addEventListener('keydown', this.handleKeyDown);
    }
    
    start() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.animate();
    }
    
    pause() {
        this.gamePaused = true;
    }
    
    stop() {
        this.gameRunning = false;
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    
    reset() {
        this.score = 0;
        this.player.y = this.canvas.height - 60;
        this.player.velocityY = 0;
        this.player.jumping = false;
        this.player.rotation = 0;
        this.obstacles = [];
        this.gameSpeed = 6;
        this.frameCount = 0;
        updateScore();
        this.gameRunning = false;
    }
    
    animate() {
        if (!this.gameRunning) return;
        if (this.gamePaused) return setTimeout(() => this.animate(), 1000 / 60);
        
        // Draw background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0e27');
        gradient.addColorStop(1, '#1a1a2e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground
        this.ctx.fillStyle = '#667eea';
        this.ctx.fillRect(0, this.canvas.height - 30, this.canvas.width, 30);
        
        // Player physics
        this.player.velocityY += 0.5;
        this.player.y += this.player.velocityY;
        this.player.rotation += this.player.velocityY * 0.02;
        
        if (this.player.y + this.player.height >= this.canvas.height - 30) {
            this.player.y = this.canvas.height - 60;
            this.player.jumping = false;
            this.player.rotation = 0;
        }
        
        // Draw player
        this.ctx.save();
        this.ctx.translate(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
        this.ctx.rotate(this.player.rotation);
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fillRect(-this.player.width / 2, -this.player.height / 2, this.player.width, this.player.height);
        this.ctx.restore();
        
        // Generate obstacles
        this.frameCount++;
        if (this.frameCount % 80 === 0) {
            this.obstacles.push({
                x: this.canvas.width,
                y: this.canvas.height - 50,
                width: 20,
                height: 20,
                rotation: 0
            });
        }
        
        // Draw obstacles
        this.ctx.fillStyle = '#ffd93d';
        this.obstacles.forEach((obs, i) => {
            obs.x -= this.gameSpeed;
            obs.rotation += 0.1;
            
            this.ctx.save();
            this.ctx.translate(obs.x + obs.width / 2, obs.y + obs.height / 2);
            this.ctx.rotate(obs.rotation);
            this.ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
            this.ctx.restore();
            
            // Collision
            if (this.player.x < obs.x + obs.width &&
                this.player.x + this.player.width > obs.x &&
                this.player.y < obs.y + obs.height &&
                this.player.y + this.player.height > obs.y) {
                this.gameRunning = false;
                alert(`Game Over! Score: ${this.score}`);
                return;
            }
            
            if (obs.x < -20) {
                this.obstacles.splice(i, 1);
                this.score++;
                this.gameSpeed += 0.2;
                updateScore();
            }
        });
        
        // Draw score
        this.ctx.fillStyle = '#00d84f';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('geometryHighScore', this.highScore);
            updateScore();
        }
        
        setTimeout(() => this.animate(), 1000 / 60);
    }
}

// ============ ENHANCED FLAPPY BIRD GAME ============
class FlappyBirdGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('flappyHighScore')) || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.bird = {
            x: 100,
            y: this.canvas.height / 2,
            width: 30,
            height: 25,
            velocityY: 0,
            rotation: 0
        };
        
        this.pipes = [];
        this.pipeGap = 100;
        this.pipeSpeed = 4;
        this.frameCount = 0;
        this.bgOffset = 0;
        
        this.setupControls();
        updateScore();
    }
    
    setupControls() {
        this.handleKeyDown = (e) => {
            if (this.gameRunning && (e.key === ' ' || e.key === 'ArrowUp')) {
                this.bird.velocityY = -8;
                e.preventDefault();
            }
        };
        
        this.canvas.addEventListener('click', () => {
            if (this.gameRunning) {
                this.bird.velocityY = -8;
            }
        });
        
        document.addEventListener('keydown', this.handleKeyDown);
    }
    
    start() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.animate();
    }
    
    pause() {
        this.gamePaused = true;
    }
    
    stop() {
        this.gameRunning = false;
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    
    reset() {
        this.score = 0;
        this.bird.y = this.canvas.height / 2;
        this.bird.velocityY = 0;
        this.bird.rotation = 0;
        this.pipes = [];
        this.frameCount = 0;
        this.bgOffset = 0;
        updateScore();
        this.gameRunning = false;
    }
    
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F6FF');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw clouds
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(100 + this.bgOffset % 600, 50, 20, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(150 + this.bgOffset % 600, 50, 25, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(200 + this.bgOffset % 600, 50, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    animate() {
        if (!this.gameRunning) return;
        if (this.gamePaused) return setTimeout(() => this.animate(), 1000 / 60);
        
        this.drawBackground();
        this.bgOffset += this.pipeSpeed;
        
        // Bird physics
        this.bird.velocityY += 0.4;
        this.bird.y += this.bird.velocityY;
        this.bird.rotation = Math.min(Math.max(this.bird.velocityY * 0.1, -0.5), 0.5);
        
        // Draw bird
        this.ctx.save();
        this.ctx.translate(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2);
        this.ctx.rotate(this.bird.rotation);
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 15, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#FF6347';
        this.ctx.beginPath();
        this.ctx.arc(8, 0, 5, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
        
        // Generate pipes
        this.frameCount++;
        if (this.frameCount % 90 === 0) {
            const gapY = Math.random() * (this.canvas.height - this.pipeGap - 100) + 50;
            this.pipes.push({
                x: this.canvas.width,
                topHeight: gapY,
                bottomY: gapY + this.pipeGap,
                width: 40,
                scored: false
            });
        }
        
        // Draw pipes
        this.ctx.fillStyle = '#228B22';
        this.pipes.forEach((pipe, i) => {
            pipe.x -= this.pipeSpeed;
            
            // Top pipe
            this.ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
            // Bottom pipe
            this.ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, this.canvas.height - pipe.bottomY);
            
            // Pipe shine
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pipe.x + 2, 0, pipe.width - 4, pipe.topHeight);
            this.ctx.strokeRect(pipe.x + 2, pipe.bottomY, pipe.width - 4, this.canvas.height - pipe.bottomY);
            
            // Collision
            if (this.bird.x < pipe.x + pipe.width &&
                this.bird.x + this.bird.width > pipe.x &&
                (this.bird.y < pipe.topHeight || this.bird.y + this.bird.height > pipe.bottomY)) {
                this.gameRunning = false;
                alert(`Game Over! Score: ${this.score}`);
                return;
            }
            
            // Scoring
            if (pipe.x + pipe.width < this.bird.x && !pipe.scored) {
                pipe.scored = true;
                this.score++;
                this.pipeSpeed += 0.1;
                updateScore();
            }
            
            if (pipe.x < -40) {
                this.pipes.splice(i, 1);
            }
        });
        
        // Draw score
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.fillText(`${this.score}`, this.canvas.width / 2 - 15, 50);
        
        // Check boundaries
        if (this.bird.y < 0 || this.bird.y + this.bird.height > this.canvas.height) {
            this.gameRunning = false;
            alert(`Game Over! Score: ${this.score}`);
            return;
        }
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('flappyHighScore', this.highScore);
            updateScore();
        }
        
        setTimeout(() => this.animate(), 1000 / 60);
    }
}

// ============ ENHANCED SNAKE GAME ============
class SnakeGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.gridSize = 20;
        this.snake = [{x: 10, y: 10}];
        this.food = {x: 15, y: 15};
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        
        this.setupControls();
        updateScore();
    }
    
    setupControls() {
        this.handleKeyDown = (e) => {
            if (this.gameRunning) {
                if (e.key === 'ArrowUp' && this.direction.y === 0) this.nextDirection = {x: 0, y: -1};
                if (e.key === 'ArrowDown' && this.direction.y === 0) this.nextDirection = {x: 0, y: 1};
                if (e.key === 'ArrowLeft' && this.direction.x === 0) this.nextDirection = {x: -1, y: 0};
                if (e.key === 'ArrowRight' && this.direction.x === 0) this.nextDirection = {x: 1, y: 0};
            }
        };
        
        document.addEventListener('keydown', this.handleKeyDown);
    }
    
    start() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.animate();
    }
    
    pause() {
        this.gamePaused = true;
    }
    
    stop() {
        this.gameRunning = false;
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    
    reset() {
        this.score = 0;
        this.snake = [{x: 10, y: 10}];
        this.food = {x: 15, y: 15};
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        updateScore();
        this.gameRunning = false;
    }
    
    animate() {
        if (!this.gameRunning) return;
        if (this.gamePaused) return setTimeout(() => this.animate(), 1000 / 10);
        
        // Draw background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#0a0e27');
        gradient.addColorStop(1, '#1a1a2e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.strokeStyle = 'rgba(102, 126, 234, 0.1)';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.canvas.width; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.canvas.height; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }
        
        // Update direction
        this.direction = this.nextDirection;
        
        // Move snake
        const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};
        
        // Collision with walls
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.gameRunning = false;
            alert(`Game Over! Score: ${this.score}`);
            return;
        }
        
        // Collision with self
        if (this.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
            this.gameRunning = false;
            alert(`Game Over! Score: ${this.score}`);
            return;
        }
        
        this.snake.unshift(head);
        
        // Check food
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            updateScore();
            this.food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
        } else {
            this.snake.pop();
        }
        
        // Draw snake
        this.snake.forEach((seg, i) => {
            if (i === 0) {
                this.ctx.fillStyle = '#00d84f';
                this.ctx.shadowColor = '#00d84f';
                this.ctx.shadowBlur = 10;
            } else {
                this.ctx.fillStyle = '#00b83c';
                this.ctx.shadowBlur = 5;
            }
            this.ctx.fillRect(seg.x * this.gridSize + 1, seg.y * this.gridSize + 1, this.gridSize - 2, this.gridSize - 2);
        });
        this.ctx.shadowBlur = 0;
        
        // Draw food
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(this.food.x * this.gridSize + this.gridSize / 2, this.food.y * this.gridSize + this.gridSize / 2, this.gridSize / 2 - 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            updateScore();
        }
        
        setTimeout(() => this.animate(), 1000 / 10);
    }
}

// ============ ENHANCED SPACE INVADERS GAME ============
class SpaceInvadersGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('spaceHighScore')) || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.lives = 3;
        
        this.player = {
            x: this.canvas.width / 2 - 20,
            y: this.canvas.height - 50,
            width: 40,
            height: 30,
            velocityX: 0
        };
        
        this.enemies = [];
        this.bullets = [];
        this.particles = [];
        this.frameCount = 0;
        
        this.setupControls();
        this.generateEnemies();
        updateScore();
    }
    
    setupControls() {
        this.handleKeyDown = (e) => {
            if (this.gameRunning) {
                if (e.key === 'ArrowLeft') this.player.velocityX = -5;
                if (e.key === 'ArrowRight') this.player.velocityX = 5;
                if (e.key === ' ') {
                    this.bullets.push({
                        x: this.player.x + 15,
                        y: this.player.y,
                        width: 8,
                        height: 15,
                        velocityY: -8
                    });
                    e.preventDefault();
                }
            }
        };
        
        this.handleKeyUp = () => {
            this.player.velocityX = 0;
        };
        
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }
    
    generateEnemies() {
        for (let i = 0; i < 8; i++) {
            this.enemies.push({
                x: 50 + i * 80,
                y: 30,
                width: 30,
                height: 30,
                velocityX: 2
            });
        }
    }
    
    createParticles(x, y, color = '#00d84f') {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                color: color
            });
        }
    }
    
    start() {
        this.gameRunning = true;
        this.gamePaused = false;
        this.animate();
    }
    
    pause() {
        this.gamePaused = true;
    }
    
    stop() {
        this.gameRunning = false;
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
    
    reset() {
        this.score = 0;
        this.lives = 3;
        this.player.x = this.canvas.width / 2 - 20;
        this.player.velocityX = 0;
        this.enemies = [];
        this.bullets = [];
        this.particles = [];
        this.frameCount = 0;
        this.generateEnemies();
        updateScore();
        this.gameRunning = false;
    }
    
    animate() {
        if (!this.gameRunning) return;
        if (this.gamePaused) return setTimeout(() => this.animate(), 1000 / 60);
        
        // Draw background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0e27');
        gradient.addColorStop(1, '#1a1a2e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 100; i++) {
            const x = (i * 97) % this.canvas.width;
            const y = (i * 73) % this.canvas.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Update player
        this.player.x += this.player.velocityX;
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x + this.player.width > this.canvas.width) this.player.x = this.canvas.width - this.player.width;
        
        // Draw player
        this.ctx.fillStyle = '#00d84f';
        this.ctx.beginPath();
        this.ctx.moveTo(this.player.x + this.player.width / 2, this.player.y);
        this.ctx.lineTo(this.player.x, this.player.y + this.player.height);
        this.ctx.lineTo(this.player.x + this.player.width, this.player.y + this.player.height);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw bullets
        this.ctx.fillStyle = '#FFD700';
        this.bullets = this.bullets.filter(b => b.y > 0);
        this.bullets.forEach(bullet => {
            bullet.y += bullet.velocityY;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        // Update enemies
        this.enemies.forEach((enemy, i) => {
            enemy.x += enemy.velocityX;
            
            // Draw enemy
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.beginPath();
            this.ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 15, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Enemy eyes
            this.ctx.fillStyle = '#000';
            this.ctx.beginPath();
            this.ctx.arc(enemy.x + 8, enemy.y + 8, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(enemy.x + 22, enemy.y + 8, 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Collision with player
            if (this.player.x < enemy.x + enemy.width &&
                this.player.x + this.player.width > enemy.x &&
                this.player.y < enemy.y + enemy.height &&
                this.player.y + this.player.height > enemy.y) {
                this.createParticles(enemy.x, enemy.y, '#ff6b6b');
                this.lives--;
                if (this.lives <= 0) {
                    this.gameRunning = false;
                    alert(`Game Over! Final Score: ${this.score}`);
                    return;
                }
                this.enemies.splice(i, 1);
                updateScore();
            }
        });
        
        // Bullet-enemy collision
        this.bullets = this.bullets.filter(bullet => {
            for (let i = 0; i < this.enemies.length; i++) {
                const enemy = this.enemies[i];
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    this.createParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#FFD700');
                    this.enemies.splice(i, 1);
                    return false;
                }
            }
            return true;
        });
        
        // Draw particles
        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        });
        
        // Score and regenerate
        if (this.enemies.length === 0) {
            this.score += 50;
            updateScore();
            this.generateEnemies();
        }
        
        // Draw lives
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText(`Lives: ${this.lives}`, 10, 30);
        
        // Draw wave count
        this.ctx.fillStyle = '#00d84f';
        this.ctx.fillText(`Wave ${Math.floor(this.score / 50) + 1}`, this.canvas.width - 150, 30);
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('spaceHighScore', this.highScore);
            updateScore();
        }
        
        setTimeout(() => this.animate(), 1000 / 60);
    }
}
