const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let gameOver = false;
let score = 0;
let lives = 3;

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    bullets: []
};

const aliens = [];
const alienRows = 4;
const alienCols = 8;
const alienWidth = 50;
const alienHeight = 50;
const alienPadding = 10;
const alienOffsetTop = 30;
const alienOffsetLeft = 30;

function drawPlayer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    ctx.fillStyle = 'yellow';
    player.bullets.forEach((bullet, index) => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            player.bullets.splice(index, 1);
        }
    });
}

function drawAliens() {
    ctx.fillStyle = 'green';
    aliens.forEach((alien) => {
        if (alien.alive) {
            ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
        }
    });
}

function createAliens() {
    for (let c = 0; c < alienCols; c++) {
        for (let r = 0; r < alienRows; r++) {
            aliens.push({
                x: c * (alienWidth + alienPadding) + alienOffsetLeft,
                y: r * (alienHeight + alienPadding) + alienOffsetTop,
                width: alienWidth,
                height: alienHeight,
                alive: true
            });
        }
    }
}

function moveAliens() {
    aliens.forEach((alien) => {
        if (alien.alive) {
            alien.y += 0.5;
            if (alien.y + alien.height > canvas.height) {
                lives--;
                alien.y = 0;
                if (lives === 0) {
                    gameOver = true;
                }
            }
        }
    });
}

function detectCollisions() {
    player.bullets.forEach((bullet, bulletIndex) => {
        aliens.forEach((alien, alienIndex) => {
            if (alien.alive && bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.height + bullet.y > alien.y) {
                alien.alive = false;
                player.bullets.splice(bulletIndex, 1);
                score += 10;
            }
        });
    });
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 8, 20);
}

function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

function drawGameOver() {
    ctx.font = '48px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
}

function movePlayer() {
    if (rightPressed && player.x < canvas.width - player.width) {
        player.x += player.speed;
    } else if (leftPressed && player.x > 0) {
        player.x -= player.speed;
    }
}

function shoot() {
    player.bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y,
        width: 5,
        height: 10,
        speed: 7
    });
}

function update() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawBullets();
        drawAliens();
        drawScore();
        drawLives();
        movePlayer();
        moveAliens();
        detectCollisions();
        requestAnimationFrame(update);
    } else {
        drawGameOver();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        if (!spacePressed) {
            shoot();
            spacePressed = true;
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        spacePressed = false;
    }
});

createAliens();
update();
