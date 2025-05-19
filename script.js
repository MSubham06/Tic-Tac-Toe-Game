const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const winningLine = document.getElementById("winning-line");
const xNameDisplay = document.getElementById("x-name");
const oNameDisplay = document.getElementById("o-name");
const xScoreDisplay = document.querySelector(".x-score .score-count");
const oScoreDisplay = document.querySelector(".o-score .score-count");
const soundBtn = document.getElementById("sound-btn");
const aiBtn = document.getElementById("ai-btn");
const themeToggle = document.getElementById("checkbox");
const playerInput = document.getElementById("player-input");
const gameArea = document.getElementById("game-area");
const startBtn = document.getElementById("start-game");
const turnIndicator = document.getElementById("turn-indicator");
const currentTurnDisplay = document.getElementById("current-turn");
const boardContainer = document.getElementById("board-container");
const boardBorder = document.querySelector(".board-border");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let scores = { X: 0, O: 0 };
let soundOn = true;
let aiMode = false;
let playerNames = { X: "Player X", O: "Player O" };
let firstPlayer = "X";

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

const lineTransforms = {
  "0,1,2": { rotate: "0deg", top: "50px", left: "6px" },
  "3,4,5": { rotate: "0deg", top: "156px", left: "6px" },
  "6,7,8": { rotate: "0deg", top: "262px", left: "6px" },
  "0,3,6": { rotate: "90deg", top: "158px", left: "-102px" },
  "1,4,7": { rotate: "90deg", top: "158px", left: "4px" },
  "2,5,8": { rotate: "90deg", top: "158px", left: "110px" },
  "0,4,8": { rotate: "45deg", top: "158px", left: "6px" },
  "2,4,6": { rotate: "-45deg", top: "158px", left: "6px" }
};

// Initialize the game
function init() {
  themeToggle.addEventListener("change", toggleTheme);
  soundBtn.addEventListener("click", toggleSound);
  aiBtn.addEventListener("click", toggleAI);
  startBtn.addEventListener("click", startGame);
  
  // Set initial theme based on checkbox state
  if (themeToggle.checked) {
    document.body.classList.add("dark-mode");
  }
  
  updateTurnIndicator();
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

function toggleSound() {
  soundOn = !soundOn;
  soundBtn.classList.toggle("on");
  soundBtn.innerHTML = soundOn ? '<i class="fas fa-volume-up"></i> Sound' : '<i class="fas fa-volume-mute"></i> Sound';
}

function toggleAI() {
  aiMode = !aiMode;
  aiBtn.classList.toggle("on");
  aiBtn.innerHTML = aiMode ? '<i class="fas fa-robot"></i> AI On' : '<i class="fas fa-robot"></i> AI Off';
  restartGame();
}

function startGame() {
  const playerX = document.getElementById("player-x").value.trim() || "Player X";
  const playerO = document.getElementById("player-o").value.trim() || "Player O";
  
  playerNames.X = playerX;
  playerNames.O = playerO;
  
  xNameDisplay.textContent = playerX;
  oNameDisplay.textContent = playerO;
  
  playerInput.style.display = "none";
  gameArea.style.display = "block";
  
  cells.forEach(cell => cell.addEventListener("click", handleClick));
  
  updateTurnIndicator();
}

function playSound(sound) {
  if (soundOn) {
    sound.currentTime = 0;
    sound.play();
  }
}

function updateScores() {
  xScoreDisplay.textContent = scores.X;
  oScoreDisplay.textContent = scores.O;
}

function updateTurnIndicator() {
  boardBorder.classList.remove("x-turn", "o-turn");
  
  if (gameActive) {
    if (currentPlayer === "X") {
      currentTurnDisplay.textContent = `${playerNames.X}'s turn`;
      currentTurnDisplay.style.color = "var(--x-color)";
      boardBorder.classList.add("x-turn");
    } else {
      currentTurnDisplay.textContent = `${playerNames.O}'s turn`;
      currentTurnDisplay.style.color = "var(--o-color)";
      boardBorder.classList.add("o-turn");
    }
  }
}

function drawLine(condition) {
  const key = condition.join(",");
  const transform = lineTransforms[key];
  if (transform) {
    winningLine.style.display = "block";
    winningLine.style.top = transform.top;
    winningLine.style.left = transform.left;
    winningLine.style.transform = `rotate(${transform.rotate})`;
  }
}

function handleClick() {
  const index = this.dataset.index;
  if (board[index] !== "" || !gameActive) return;

  playSound(clickSound);

  board[index] = currentPlayer;
  this.textContent = currentPlayer;
  this.classList.add(currentPlayer === "X" ? "x-move" : "o-move");

  if (checkWin()) {
    const winnerName = currentPlayer === "X" ? playerNames.X : playerNames.O;
    statusText.textContent = `${winnerName} wins!`;
    scores[currentPlayer]++;
    updateScores();
    gameActive = false;
    playSound(winSound);
    
    // Add win animation to board
    boardContainer.classList.add(currentPlayer === "X" ? "win-animation" : "win-animation");
    setTimeout(() => {
      boardContainer.classList.remove("win-animation");
    }, 400);
    
    // Alternate first player for next game
    firstPlayer = firstPlayer === "X" ? "O" : "X";
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    playSound(drawSound);
    
    // Add draw animation to board
    boardContainer.classList.add("draw-animation");
    setTimeout(() => {
      boardContainer.classList.remove("draw-animation");
    }, 1000);
    
    // Alternate first player for next game
    firstPlayer = firstPlayer === "X" ? "O" : "X";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnIndicator();
  
  if (aiMode && currentPlayer === "O") {
    setTimeout(makeAIMove, 500);
  }
}

function makeAIMove() {
  if (!gameActive) return;
  
  // Simple AI - random move
  const emptyCells = board.map((cell, index) => cell === "" ? index : null).filter(val => val !== null);
  if (emptyCells.length > 0) {
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomIndex] = "O";
    cells[randomIndex].textContent = "O";
    cells[randomIndex].classList.add("o-move");
    playSound(clickSound);
    
    if (checkWin()) {
      statusText.textContent = `${playerNames.O} wins!`;
      scores.O++;
      updateScores();
      gameActive = false;
      playSound(winSound);
      
      // Add win animation to board
      boardContainer.classList.add("win-animation");
      setTimeout(() => {
        boardContainer.classList.remove("win-animation");
      }, 400);
      
      // Alternate first player for next game
      firstPlayer = firstPlayer === "X" ? "O" : "X";
      return;
    }
    
    if (board.every(cell => cell !== "")) {
      statusText.textContent = "It's a draw!";
      gameActive = false;
      playSound(drawSound);
      
      // Add draw animation to board
      boardContainer.classList.add("draw-animation");
      setTimeout(() => {
        boardContainer.classList.remove("draw-animation");
      }, 1000);
      
      // Alternate first player for next game
      firstPlayer = firstPlayer === "X" ? "O" : "X";
      return;
    }
    
    currentPlayer = "X";
    updateTurnIndicator();
  }
}

function checkWin() {
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      drawLine(condition);
      return true;
    }
  }
  return false;
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = firstPlayer;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("x-move", "o-move");
  });
  statusText.textContent = "";
  winningLine.style.display = "none";
  boardBorder.classList.remove("x-turn", "o-turn");
  
  updateTurnIndicator();
  
  if (aiMode && currentPlayer === "O") {
    setTimeout(makeAIMove, 500);
  }
}

// Initialize the game when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
