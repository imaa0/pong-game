const paddleLeft = document.getElementById("paddleLeft");
const paddleRight = document.getElementById("paddleRight");
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");
const gameOver = document.getElementById("gameOver");
const countdownEl = document.getElementById("countdown");

const menu = document.getElementById("menu");
const gameArea = document.getElementById("gameArea");
const startButton = document.getElementById("startButton");
const difficultySelect = document.getElementById("difficulty");

let paddleSpeed = 6;
let ballSpeed = 5;
let interval;
let pause = false;
let leftScore = 0;
let rightScore = 0;
const maxScore = 5;

let ballX, ballY, ballDX, ballDY;
let leftPaddleY = 200;
let rightPaddleY = 200;

function resetBall() {
  ballX = 392;
  ballY = 242;
  ballDX = (Math.random() > 0.5 ? 1 : -1) * ballSpeed;
  ballDY = (Math.random() * 2 - 1) * ballSpeed;
}

function updateScore() {
  scoreDisplay.textContent = `Player 1: ${leftScore} | Player 2: ${rightScore}`;
}

function showGameOver(winner) {
  gameOver.classList.remove("hidden");
  gameOver.textContent = `${winner} Wins! Press Space to Restart`;
  clearInterval(interval);
}

function moveAI() {
  const center = rightPaddleY + 50;
  if (ballY > center) rightPaddleY += paddleSpeed;
  else rightPaddleY -= paddleSpeed;
}

function update() {
  if (pause) return;

  // Move paddles
  paddleLeft.style.top = `${leftPaddleY}px`;
  paddleRight.style.top = `${rightPaddleY}px`;

  // Ball movement
  ballX += ballDX;
  ballY += ballDY;

  // Bounce top/bottom
  if (ballY <= 0 || ballY >= 485) ballDY *= -1;

  // Left paddle collision
  if (
    ballX <= 25 &&
    ballY + 15 > leftPaddleY &&
    ballY < leftPaddleY + 100
  ) {
    ballDX *= -1.1;
    playSound("hit");
  }

  // Right paddle collision
  if (
    ballX >= 760 &&
    ballY + 15 > rightPaddleY &&
    ballY < rightPaddleY + 100
  ) {
    ballDX *= -1.1;
    playSound("hit");
  }

  // Score conditions
  if (ballX < 0) {
    rightScore++;
    playSound("score");
    updateScore();
    if (rightScore >= maxScore) return showGameOver("Player 2");
    resetBall();
  }

  if (ballX > 800) {
    leftScore++;
    playSound("score");
    updateScore();
    if (leftScore >= maxScore) return showGameOver("Player 1");
    resetBall();
  }

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  moveAI();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "w") leftPaddleY -= paddleSpeed;
  if (e.key === "s") leftPaddleY += paddleSpeed;
  if (e.key === " ") {
    if (leftScore >= maxScore || rightScore >= maxScore) {
      startGame(); // restart
    } else {
      pause = !pause;
    }
  }
  if (e.key === "p") pause = !pause;
});

function playSound(type) {
  const sound = new Audio();
  sound.src =
    type === "hit"
      ? "https://freesound.org/data/previews/3/3926_5151-lq.mp3"
      : "https://freesound.org/data/previews/40/40699_512123-lq.mp3";
  sound.play();
}

function startCountdown(callback) {
  let count = 3;
  countdownEl.classList.remove("hidden");
  countdownEl.textContent = count;
  const cdInterval = setInterval(() => {
    count--;
    if (count <= 0) {
      clearInterval(cdInterval);
      countdownEl.classList.add("hidden");
      callback();
    } else {
      countdownEl.textContent = count;
    }
  }, 1000);
}

function setDifficulty(level) {
  switch (level) {
    case "easy":
      ballSpeed = 3;
      break;
    case "medium":
      ballSpeed = 5;
      break;
    case "hard":
      ballSpeed = 7;
      break;
  }
}

function startGame() {
  menu.classList.add("hidden");
  gameArea.classList.remove("hidden");

  leftScore = rightScore = 0;
  updateScore();
  gameOver.classList.add("hidden");

  leftPaddleY = 200;
  rightPaddleY = 200;

  setDifficulty(difficultySelect.value);
  resetBall();

  startCountdown(() => {
    interval = setInterval(update, 1000 / 60);
  });
}

startButton.addEventListener("click", startGame);
