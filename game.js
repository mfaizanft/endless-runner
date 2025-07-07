const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game Variables
let player = { x: 50, y: canvas.height - 100, width: 50, height: 50, dy: 0, jumping: false };
let gravity = 1;
let velocity = 0;
let obstacles = [];
let collectibles = [];
let score = 0;
let gameOver = false;
let gameSpeed = 6;

const token = getToken(); // Optional: send to backend for leaderboard

// Assets (replace with actual image loading)
function drawPlayer() {
  ctx.fillStyle = "#f00";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  ctx.fillStyle = "#654321";
  obstacles.forEach((obs) => {
    obs.x -= gameSpeed;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
}

function drawCollectibles() {
  ctx.fillStyle = "#FFD700";
  collectibles.forEach((coin) => {
    coin.x -= gameSpeed;
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 20, 40);
}

function addObstacle() {
  const height = 50 + Math.random() * 50;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - height,
    width: 30,
    height: height
  });
}

function addCollectible() {
  collectibles.push({
    x: canvas.width + 50,
    y: canvas.height - 120 - Math.random() * 100
  });
}

function checkCollision() {
  obstacles.forEach((obs) => {
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      gameOver = true;
    }
  });

  collectibles = collectibles.filter((coin) => {
    if (
      player.x < coin.x + 10 &&
      player.x + player.width > coin.x - 10 &&
      player.y < coin.y + 10 &&
      player.y + player.height > coin.y - 10
    ) {
      score += 10;
      return false;
    }
    return true;
  });
}

function updatePlayer() {
  if (player.jumping) {
    player.dy += gravity;
    player.y += player.dy;

    if (player.y >= canvas.height - player.height - 50) {
      player.y = canvas.height - player.height - 50;
      player.jumping = false;
      player.dy = 0;
    }
  }
}

function loop() {
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawObstacles();
  drawCollectibles();
  drawScore();

  updatePlayer();
  checkCollision();

  score += 1;

  requestAnimationFrame(loop);
}

setInterval(() => {
  if (!gameOver) addObstacle();
}, 2000);

setInterval(() => {
  if (!gameOver) addCollectible();
}, 3000);

// Jump on click/touch
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !player.jumping) {
    player.dy = -15;
    player.jumping = true;
  }
});

window.addEventListener("touchstart", () => {
  if (!player.jumping) {
    player.dy = -15;
    player.jumping = true;
  }
});

loop();
