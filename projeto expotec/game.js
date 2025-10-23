const gameContainer = document.getElementById('gameContainer');
const bird = document.getElementById('bird');
const scoreDisplay = document.getElementById('score');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');

let birdY, birdVelocity, gravity, jumpStrength;
let score, gameLoop, pipeLoop, pipes, gameStarted, gameOver;

// 🕊️ Configurações
function resetVariables() {
    birdY = window.innerHeight / 2;
    birdVelocity = 0;
    gravity = window.innerHeight * 0.0012;
    jumpStrength = -window.innerHeight * 0.018;
    score = 0;
    pipes = [];
    gameStarted = false;
    gameOver = false;
}

// ☁️ Cria nuvens
function createClouds() {
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.width = Math.random() * 10 + 10 + 'vw';
        cloud.style.height = Math.random() * 3 + 4 + 'vh';
        cloud.style.top = Math.random() * 30 + 'vh';
        cloud.style.left = Math.random() * 100 + 'vw';
        cloud.style.animationDelay = Math.random() * 10 + 's';
        gameContainer.appendChild(cloud);
    }
}
createClouds();

function jump() {
    if (!gameStarted || gameOver) return;
    birdVelocity = jumpStrength;
    bird.classList.add('flap');
    setTimeout(() => bird.classList.remove('flap'), 150);
}

// 🎮 Controles
document.addEventListener('keydown', (e) => {
    const isSpace = e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar';
    if (isSpace) {
        e.preventDefault();
        if (!gameStarted) startGame();
        else jump();
    }
});
gameContainer.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') {
        if (!gameStarted) startGame();
        else jump();
    }
});

// 🚧 Criação de canos
function createPipe() {
    const containerHeight = gameContainer.clientHeight;
    const gap = containerHeight * 0.25;
    const minHeight = containerHeight * 0.1;
    const maxHeight = containerHeight * 0.6;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    const pipeTop = document.createElement('div');
    const pipeBottom = document.createElement('div');
    pipeTop.className = 'pipe pipe-top';
    pipeBottom.className = 'pipe pipe-bottom';
    pipeTop.style.height = topHeight + 'px';
    pipeBottom.style.height = (containerHeight - topHeight - gap) + 'px';
    pipeTop.style.left = window.innerWidth + 'px';
    pipeBottom.style.left = window.innerWidth + 'px';
    pipeTop.style.top = '0';
    pipeBottom.style.bottom = '0';

    gameContainer.appendChild(pipeTop);
    gameContainer.appendChild(pipeBottom);

    pipes.push({ top: pipeTop, bottom: pipeBottom, x: window.innerWidth, scored: false });
}

// 🔄 Atualização do jogo
function updateGame() {
    if (gameOver) return;

    birdVelocity += gravity;
    birdY += birdVelocity;
    bird.style.top = birdY + 'px';
    bird.style.transform = `rotate(${Math.min(Math.max(birdVelocity * 5, -30), 90)}deg)`;

    const containerHeight = gameContainer.clientHeight;
    if (birdY > containerHeight - bird.clientHeight || birdY < 0) {
        endGame();
        return;
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= window.innerWidth * 0.004;
        pipe.top.style.left = pipe.x + 'px';
        pipe.bottom.style.left = pipe.x + 'px';

        // pontuação
        if (!pipe.scored && pipe.x + pipe.top.clientWidth < window.innerWidth * 0.1) {
            pipe.scored = true;
            score++;
            scoreDisplay.textContent = score;
        }

        // colisão
        const birdRect = bird.getBoundingClientRect();
        const topRect = pipe.top.getBoundingClientRect();
        const bottomRect = pipe.bottom.getBoundingClientRect();

        if (
            (birdRect.right > topRect.left && birdRect.left < topRect.right &&
             birdRect.top < topRect.bottom) ||
            (birdRect.right > bottomRect.left && birdRect.left < bottomRect.right &&
             birdRect.bottom > bottomRect.top)
        ) {
            endGame();
        }

        // remove canos fora da tela
        if (pipe.x + pipe.top.clientWidth < 0) {
            pipe.top.remove();
            pipe.bottom.remove();
            pipes.splice(index, 1);
        }
    });
}

// ▶️ Início
function startGame() {
    document.activeElement.blur();
    resetVariables();
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameStarted = true;
    scoreDisplay.textContent = '0';
    document.querySelectorAll('.pipe').forEach(p => p.remove());

    createPipe();
    gameLoop = setInterval(updateGame, 1000 / 60);
    pipeLoop = setInterval(createPipe, 2000);
}

// 💀 Fim
function endGame() {
    gameOver = true;
    clearInterval(gameLoop);
    clearInterval(pipeLoop);
    finalScoreDisplay.textContent = `Pontuação: ${score}`;
    gameOverScreen.style.display = 'flex';
}

// 🔁 Reinício
function restartGame() {
    startGame();
}

