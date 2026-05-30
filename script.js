// Game data with actual playable games
const games = [
    {
        id: 'slope',
        name: 'Slope',
        description: 'Roll down an endless slope and avoid obstacles!',
        emoji: '⛷️',
        rating: '9.2/10',
        genre: 'Action',
        type: 'slope'
    },
    {
        id: 'slope2',
        name: 'Slope 2',
        description: 'The sequel with more challenges and faster gameplay!',
        emoji: '⛷️',
        rating: '9.0/10',
        genre: 'Action',
        type: 'slope2'
    },
    {
        id: 'geometry-dash',
        name: 'Geometry Dash',
        description: 'Jump through geometric obstacles to the beat!',
        emoji: '🟩',
        rating: '8.8/10',
        genre: 'Rhythm',
        type: 'geometry-dash'
    },
    {
        id: 'flappy-bird',
        name: 'Flappy Bird',
        description: 'Tap to fly through the pipes!',
        emoji: '🐦',
        rating: '8.5/10',
        genre: 'Action',
        type: 'flappy-bird'
    },
    {
        id: 'snake',
        name: 'Snake',
        description: 'Eat food and grow, but don\'t hit the walls!',
        emoji: '🐍',
        rating: '8.3/10',
        genre: 'Puzzle',
        type: 'snake'
    },
    {
        id: 'space-invaders',
        name: 'Space Invaders',
        description: 'Shoot down alien invaders from space!',
        emoji: '👾',
        rating: '8.7/10',
        genre: 'Shooter',
        type: 'space-invaders'
    }
];

let currentGame = null;
let gameInstance = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderGames();
    setupModal();
});

// Render games
function renderGames() {
    const gamesContainer = document.getElementById('gamesContainer');
    gamesContainer.innerHTML = '';

    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.onclick = () => openGame(game);
        
        gameCard.innerHTML = `
            <div class="game-image">${game.emoji}</div>
            <div class="game-info">
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <div>
                    <span class="game-rating">⭐ ${game.rating}</span>
                    <span class="play-badge">▶ Play</span>
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
    };

    window.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            if (gameInstance) gameInstance.stop();
            gameInstance = null;
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
        }
    };
}

// Update score display
function updateScore(score, highScore) {
    document.getElementById('scoreDisplay').textContent = `Score: ${score}`;
    document.getElementById('highScoreDisplay').textContent = `High Score: ${highScore}`;
}

// ============ SLOPE GAME ============
class SlopeGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        this.score = 0;
        this.highScore = localStorage.getItem('slopeHighScore') || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.ball = {
            x: this.canvas.width / 2,
            y: 50,
            radius: 8,
            velocityX: 0,
            velocityY: 0
        };
        
        this.obstacles = [];
        this.slopeAngle = 0.15;
        this.gameSpeed = 2;
        
        this.setupControls();
        this.generateObstacles();
        updateScore(this.score, this.highScore);
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.gameRunning) {
                if (e.key === 'ArrowLeft') this.ball.velocityX = -5;
                if (e.key === 'ArrowRight') this.ball.velocityX = 5;
            }
        });
        
        document.addEventListener('keyup', () => {
            this.ball.velocityX *= 0.8;
        });
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
    }
    
    reset() {
        this.score = 0;
        this.ball.x = this.canvas.width / 2;
        this.ball.y = 50;
        this.ball.velocityX = 0;
        this.ball.velocityY = 0;
        this.obstacles = [];
        this.generateObstacles();
        updateScore(this.score, this.highScore);
        this.gameRunning = false;
    }
    
    animate() {
        if (!this.gameRunning) return;
        if (this.gamePaused) return setTimeout(() => this.animate(), 1000 / 60);
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw slope
        this.ctx.fillStyle = '#667eea';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - this.canvas.width * Math.tan(this.slopeAngle));
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.fill();
        
        // Update ball physics
        this.ball.velocityY += 0.2;
        this.ball.x += this.ball.velocityX;
        this.ball.y += this.ball.velocityY;
        
        // Slope physics
        const slopeY = this.canvas.height - this.ball.x * Math.tan(this.slopeAngle);
        if (this.ball.y + this.ball.radius > slopeY) {
            this.ball.y = slopeY - this.ball.radius;
            this.ball.velocityY = -this.ball.velocityY * 0.6;
        }
        
        // Draw ball
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw and update obstacles
        this.ctx.fillStyle = '#ffd93d';
        this.obstacles.forEach((obs, i) => {
            obs.y += this.gameSpeed;
            this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            
            // Collision detection
            if (this.ball.x > obs.x && this.ball.x < obs.x + obs.width &&
                this.ball.y > obs.y && this.ball.y < obs.y + obs.height) {
                this.gameRunning = false;
                alert(`Game Over! Score: ${this.score}`);
                return;
            }
            
            // Generate new obstacles
            if (obs.y > this.canvas.height) {
                this.obstacles[i] = {
                    x: Math.random() * (this.canvas.width - 60) + 30,
                    y: -100,
                    width: 60,
                    height: 20
                };
                this.score++;
                this.gameSpeed += 0.1;
                updateScore(this.score, this.highScore);
            }
        });
        
        // Boundaries
        if (this.ball.x < 0 || this.ball.x > this.canvas.width) {
            this.gameRunning = false;
            alert(`Game Over! Score: ${this.score}`);
            return;
        }
        
        if (this.ball.y > this.canvas.height) {
            this.gameRunning = false;
            alert(`Game Over! Score: ${this.score}`);
            return;
        }
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('slopeHighScore', this.highScore);
        }
        
        setTimeout(() => this.animate(), 1000 / 60);
    }
}

// ============ SLOPE 2 GAME ============
class Slope2Game {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        this.score = 0;
        this.highScore = localStorage.getItem('slope2HighScore') || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.ball = {
            x: this.canvas.width / 2,
            y: 50,
            radius: 8,
            velocityX: 0,
            velocityY: 0
        };
        
        this.obstacles = [];
        this.slopeAngle = 0.2;
        this.gameSpeed = 3;
        
        this.setupControls();
        this.generateObstacles();
        updateScore(this.score, this.highScore);
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.gameRunning) {
                if (e.key === 'ArrowLeft') this.ball.velocityX = -6;
                if (e.key === 'ArrowRight') this.ball.velocityX = 6;
            }
        });
        
        document.addEventListener('keyup', () => {
            this.ball.velocityX *= 0.8;
        });
    }
    
    generateObstacles() {
        for (let i = 0; i < 12; i++) {
            this.obstacles.push({
                x: Math.random() * (this.canvas.width - 50) + 25,
                y: -500 - i * 150,
                width: 50,
                height: 20
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
    }
    
    reset() {
        this.score = 0;
        this.ball.x = this.canvas.width / 2;
        this.ball.y = 50;
        this.ball.velocityX = 0;
        this.ball.velocityY = 0;
        this.obstacles = [];
        this.gameSpeed = 3;
        this.generateObstacles();
        updateScore(this.score, this.highScore);
        this.gameRunning = false;
    }
    
    animate() {
        if (!this.gameRunning) return;
        if (this.gamePaused) return setTimeout(() => this.animate(), 1000 / 60);
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw slope with gradient
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#764ba2');
        gradient.addColorStop(1, '#667eea');
        this.ctx.fillStyle = gradient;
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
        
        // Draw ball with glow
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.shadowColor = '#ff6b6b';
        this.ctx.shadowBlur = 10;
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
                this.gameRunning = false;
                alert(`Game Over! Score: ${this.score}`);
                return;
            }
            
            if (obs.y > this.canvas.height) {
                this.obstacles[i] = {
                    x: Math.random() * (this.canvas.width - 50) + 25,
                    y: -100,
                    width: 50,
                    height: 20
                };
                this.score++;
                this.gameSpeed += 0.15;
                updateScore(this.score, this.highScore);
            }
        });
        
        // Boundaries
        if (this.ball.x < 0 || this.ball.x > this.canvas.width || this.ball.y > this.canvas.height) {
            this.gameRunning = false;
            alert(`Game Over! Score: ${this.score}`);
            return;
        }
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('slope2HighScore', this.highScore);
        }
        
        setTimeout(() => this.animate(), 1000 / 60);
    }
}

// ============ GEOMETRY DASH GAME ============
class GeometryDashGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        this.score = 0;
        this.highScore = localStorage.getItem('geometryHighScore') || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.player = {
            x: 50,
            y: this.canvas.height - 60,
            width: 30,
            height: 30,
            velocityY: 0,
            jumping: false
        };
        
        this.obstacles = [];
        this.gameSpeed = 6;
        this.frameCount = 0;
        
        this.setupControls();
        updateScore(this.score, this.highScore);
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.gameRunning) {
                if ((e.key === ' ' || e.key === 'ArrowUp') && !this.player.jumping) {
                    this.player.velocityY = -12;
                    this.player.jumping = true;
                }
            }
        });
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
    }
    
    reset() {
        this.score = 0;
        this.player.y = this.canvas.height - 60;
        this.player.velocityY = 0;
        this.player.jumping = false;
        this.obstacles = [];
        this.gameSpeed = 6;
        this.frameCount = 0;
        updateScore(this.score, this.highScore);
        this.gameRunning = false;
    }
    
    animate() {
        if (!this.gameRunning) return;
        if (this.gamePaused) return setTimeout(() => this.animate(), 1000 / 60);
        
        this.ctx.fillStyle = '#0f0f0f';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground
        this.ctx.fillStyle = '#667eea';
        this.ctx.fillRect(0, this.canvas.height - 30, this.canvas.width, 30);
        
        // Player physics
        this.player.velocityY += 0.5;
        this.player.y += this.player.velocityY;
        
        if (this.player.y + this.player.height >= this.canvas.height - 30) {
            this.player.y = this.canvas.height - 60;
            this.player.jumping = false;
        }
        
        // Draw player
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Generate obstacles
        this.frameCount++;
        if (this.frameCount % 80 === 0) {
            this.obstacles.push({
                x: this.canvas.width,
                y: this.canvas.height - 50,
                width: 20,
                height: 20
            });
        }
        
        // Update obstacles
        this.ctx.fillStyle = '#ffd93d';
        this.obstacles.forEach((obs, i) => {
            obs.x -= this.gameSpeed;
            this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            
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
                updateScore(this.score, this.highScore);
            }
        });
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('geometryHighScore', this.highScore);
        }
        
        setTimeout(() => this.animate(), 1000 / 60);
    }
}

// ============ FLAPPY BIRD GAME ============
class FlappyBirdGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        this.score = 0;
        this.highScore = localStorage.getItem('flappyHighScore') || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.bird = {
            x: 100,
            y: this.canvas.height / 2,
            width: 30,
            height: 25,
            velocityY: 0
        };
        
        this.pipes = [];
        this.pipeGap = 100;
        this.pipeSpeed = 4;
        this.frameCount = 0;
        
        this.setupControls();
        updateScore(this.score, this.highScore);
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.gameRunning && (e.key === ' ' || e.key === 'ArrowUp')) {
                this.bird.velocityY = -8;
                e.preventDefault();
            }
        });
        
        this.canvas.addEventListener('click', () => {
            if (this.gameRunning) {
                this.bird.velocityY = -8;
            }
        });
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
    }
    
    reset() {
        this.score = 0;
        this.bird.y = this.canvas.height / 2;
        this.bird.velocityY = 0;
        this.pipes = [];
        this.frameCount = 0;
        updateScore(this.score, this.highScore);
        this.gameRunning = false;
    }
    
    animate() {
        if (!this.gameRunning) return;
        if (this.gamePaused) return setTimeout(() => this.animate(), 1000 / 60);
        
        // Draw background
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Bird physics
        this.bird.velocityY += 0.4;
        this.bird.y += this.bird.velocityY;
        
        // Draw bird
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(this.bird.x, this.bird.y, this.bird.width, this.bird.height);
        
        // Generate pipes
        this.frameCount++;
        if (this.frameCount % 90 === 0) {
            const gapY = Math.random() * (this.canvas.height - this.pipeGap - 100) + 50;
            this.pipes.push({
                x: this.canvas.width,
                topHeight: gapY,
                bottomY: gapY + this.pipeGap,
                width: 40
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
            
            // Collision detection
            if (this.bird.x < pipe.x + pipe.width &&
                this.bird.x + this.bird.width > pipe.x &&
                (this.bird.y < pipe.topHeight || this.bird.y + this.bird.height > pipe.bottomY)) {
                this.gameRunning = false;
                alert(`Game Over! Score: ${this.score}`);
                return;
            }
            
            // Score
            if (pipe.x + pipe.width < this.bird.x && !pipe.scored) {
                pipe.scored = true;
                this.score++;
                this.pipeSpeed += 0.1;
                updateScore(this.score, this.highScore);
            }
            
            if (pipe.x < -40) {
                this.pipes.splice(i, 1);
            }
        });
        
        // Check boundaries
        if (this.bird.y < 0 || this.bird.y + this.bird.height > this.canvas.height) {
            this.gameRunning = false;
            alert(`Game Over! Score: ${this.score}`);
            return;
        }
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('flappyHighScore', this.highScore);
        }
        
        setTimeout(() => this.animate(), 1000 / 60);
    }
}

// ============ SNAKE GAME ============
class SnakeGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.gridSize = 20;
        this.snake = [{x: 10, y: 10}];
        this.food = {x: 15, y: 15};
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        
        this.setupControls();
        updateScore(this.score, this.highScore);
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.gameRunning) {
                if (e.key === 'ArrowUp' && this.direction.y === 0) this.nextDirection = {x: 0, y: -1};
                if (e.key === 'ArrowDown' && this.direction.y === 0) this.nextDirection = {x: 0, y: 1};
                if (e.key === 'ArrowLeft' && this.direction.x === 0) this.nextDirection = {x: -1, y: 0};
                if (e.key === 'ArrowRight' && this.direction.x === 0) this.nextDirection = {x: 1, y: 0};
            }
        });
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
    }
    
    reset() {
        this.score = 0;
        this.snake = [{x: 10, y: 10}];
        this.food = {x: 15, y: 15};
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        updateScore(this.score, this.highScore);
        this.gameRunning = false;
    }
    
    animate() {
        if (!this.gameRunning) return;
        if (this.gamePaused) return setTimeout(() => this.animate(), 1000 / 10);
        
        this.ctx.fillStyle = '#0f0f0f';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update direction
        this.direction = this.nextDirection;
        
        // Move snake
        const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};
        
        // Check collision with walls
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.gameRunning = false;
            alert(`Game Over! Score: ${this.score}`);
            return;
        }
        
        // Check collision with self
        if (this.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
            this.gameRunning = false;
            alert(`Game Over! Score: ${this.score}`);
            return;
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            updateScore(this.score, this.highScore);
            this.food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
        } else {
            this.snake.pop();
        }
        
        // Draw snake
        this.ctx.fillStyle = '#00d84f';
        this.snake.forEach(seg => {
            this.ctx.fillRect(seg.x * this.gridSize, seg.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        });
        
        // Draw food
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
        }
        
        setTimeout(() => this.animate(), 1000 / 10);
    }
}

// ============ SPACE INVADERS GAME ============
class SpaceInvadersGame {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        this.score = 0;
        this.highScore = localStorage.getItem('spaceHighScore') || 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        this.player = {
            x: this.canvas.width / 2 - 20,
            y: this.canvas.height - 50,
            width: 40,
            height: 30,
            velocityX: 0
        };
        
        this.enemies = [];
        this.bullets = [];
        this.frameCount = 0;
        
        this.setupControls();
        this.generateEnemies();
        updateScore(this.score, this.highScore);
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.gameRunning) {
                if (e.key === 'ArrowLeft') this.player.velocityX = -5;
                if (e.key === 'ArrowRight') this.player.velocityX = 5;
                if (e.key === ' ') {
                    this.bullets.push({x: this.player.x + 15, y: this.player.y, width: 8, height: 15});
                    e.preventDefault();
                }
            }
        });
        
        document.addEventListener('keyup', () => {
            this.player.velocityX = 0;
        });
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
    }
    
    reset() {
        this.score = 0;
        this.player.x = this.canvas.width / 2 - 20;
        this.player.velocityX = 0;
        this.enemies = [];
        this.bullets = [];
        this.frameCount = 0;
        this.generateEnemies();
        updateScore(this.score, this.highScore);
        this.gameRunning = false;
    }
    
    animate() {
        if (!this.gameRunning) return;
        if (this.gamePaused) return setTimeout(() => this.animate(), 1000 / 60);
        
        // Draw background
        this.ctx.fillStyle = '#0f0f0f';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update player
        this.player.x += this.player.velocityX;
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x + this.player.width > this.canvas.width) this.player.x = this.canvas.width - this.player.width;
        
        // Draw player
        this.ctx.fillStyle = '#00d84f';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Update and draw bullets
        this.ctx.fillStyle = '#FFD700';
        this.bullets = this.bullets.filter(b => b.y > 0);
        this.bullets.forEach(bullet => {
            bullet.y -= 7;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        // Update enemies
        this.ctx.fillStyle = '#ff6b6b';
        this.enemies.forEach((enemy, i) => {
            enemy.x += enemy.velocityX;
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // Collision with player
            if (this.player.x < enemy.x + enemy.width &&
                this.player.x + this.player.width > enemy.x &&
                this.player.y < enemy.y + enemy.height &&
                this.player.y + this.player.height > enemy.y) {
                this.gameRunning = false;
                alert(`Game Over! Score: ${this.score}`);
                return;
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
                    this.enemies.splice(i, 1);
                    return false;
                }
            }
            return true;
        });
        
        // Score and regenerate
        if (this.enemies.length === 0) {
            this.score += 10;
            updateScore(this.score, this.highScore);
            this.generateEnemies();
        }
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('spaceHighScore', this.highScore);
        }
        
        setTimeout(() => this.animate(), 1000 / 60);
    }
}

// Handle contact form
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    this.reset();
});
