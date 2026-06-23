const game = document.getElementById('game');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

const gameWidth = 320;
const playerWidth = 50;
let playerX = 135;
let obstacles = [];
let score = 0;
let animationFrame;
let obstacleTimer;
let running = false;

function setPlayerPosition() {
    player.style.left = `${playerX}px`;
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    const x = Math.floor(Math.random() * (gameWidth - 40));
    obstacle.style.left = `${x}px`;
    obstacle.style.top = '-50px';
    game.appendChild(obstacle);
    obstacles.push({ el: obstacle, y: -50, speed: 2 + Math.random() * 2 });
}

function updateObstacles() {
    obstacles.forEach((item) => {
        item.y += item.speed;
        item.el.style.top = `${item.y}px`;
    });
    obstacles = obstacles.filter((item) => {
        if (item.y > 520) {
            game.removeChild(item.el);
            score += 1;
            scoreEl.textContent = score;
            return false;
        }
        if (checkCollision(item)) {
            endGame();
            return false;
        }
        return true;
    });
}

function checkCollision(obstacle) {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.el.getBoundingClientRect();

    return !(
        playerRect.right < obstacleRect.left ||
        playerRect.left > obstacleRect.right ||
        playerRect.bottom < obstacleRect.top ||
        playerRect.top > obstacleRect.bottom
    );
}

function gameLoop() {
    if (!running) return;
    updateObstacles();
    animationFrame = requestAnimationFrame(gameLoop);
}

function startGame() {
    if (running) return;
    running = true;
    message.textContent = 'Jogo em andamento... Boa sorte!';
    score = 0;
    scoreEl.textContent = score;
    obstacles.forEach((item) => game.removeChild(item.el));
    obstacles = [];
    playerX = 135;
    setPlayerPosition();
    obstacleTimer = setInterval(createObstacle, 900);
    gameLoop();
}

function endGame() {
    running = false;
    clearInterval(obstacleTimer);
    cancelAnimationFrame(animationFrame);
    message.textContent = 'Game over! Aperte Reiniciar para tentar de novo.';
}

function resetGame() {
    running = false;
    clearInterval(obstacleTimer);
    cancelAnimationFrame(animationFrame);
    obstacles.forEach((item) => {
        if (item.el.parentNode === game) {
            game.removeChild(item.el);
        }
    });
    obstacles = [];
    score = 0;
    scoreEl.textContent = score;
    message.textContent = 'Pronto para começar. Aperte Começar.';
    playerX = 135;
    setPlayerPosition();
}

function movePlayer(direction) {
    if (!running) return;
    playerX += direction * 40;
    playerX = Math.max(0, Math.min(gameWidth - playerWidth, playerX));
    setPlayerPosition();
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        movePlayer(-1);
    } else if (event.key === 'ArrowRight') {
        movePlayer(1);
    }
});

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
resetGame();
