const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const xNameDisplay = document.getElementById("x-name");
const oNameDisplay = document.getElementById("o-name");
const xScoreDisplay = document.querySelector(".x-score .score-count");
const oScoreDisplay = document.querySelector(".o-score .score-count");
const soundBtn = document.getElementById("sound-btn");
const aiBtn = document.getElementById("ai-btn");
const themeSwitch = document.getElementById("themeSwitch");
const playerInput = document.getElementById("player-input");
const gameArea = document.getElementById("game-area");
const startBtn = document.getElementById("start-game");
const boardContainer = document.getElementById("board-container");
const boardBorder = document.querySelector(".board-border");
const winningCells = document.getElementById("winning-cells");
const restartBtn = document.getElementById("restart-btn");

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
//Developed by https://www.linkedin.com/in/msubham/
// Initialize the game
function init() {
  // Set dark mode as default
  document.body.classList.add("dark");
  themeSwitch.checked = true;
  
  themeSwitch.addEventListener("change", toggleTheme);
  soundBtn.addEventListener("click", toggleSound);
  aiBtn.addEventListener("click", toggleAI);
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", restartGame);
  
  updateTurnIndicator();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light-mode");
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
//Developed by https://www.linkedin.com/in/msubham/
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
//Developed by https://www.linkedin.com/in/msubham/
function updateScores() {
  xScoreDisplay.textContent = scores.X;
  oScoreDisplay.textContent = scores.O;
}

function updateTurnIndicator() {
  boardBorder.classList.remove("x-turn", "o-turn");
  
  if (gameActive) {
    if (currentPlayer === "X") {
      boardBorder.classList.add("x-turn");
    } else {
      boardBorder.classList.add("o-turn");
    }
  }
}
//Developed by https://www.linkedin.com/in/msubham/
function showWinningCells(condition) {
  winningCells.innerHTML = "";
  winningCells.style.display = "block";
  
  condition.forEach(index => {
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    const rect = cell.getBoundingClientRect();
    const boardRect = document.getElementById("board").getBoundingClientRect();
    
    const winningCell = document.createElement("div");
    winningCell.className = "winning-cell";
    winningCell.style.backgroundColor = currentPlayer === "X" ? "var(--x-color)" : "var(--o-color)";
    winningCell.style.left = `${rect.left - boardRect.left + rect.width/2 - 15}px`;
    winningCell.style.top = `${rect.top - boardRect.top + rect.height/2 - 15}px`;
    
    winningCells.appendChild(winningCell);
  });
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
    statusText.style.color = currentPlayer === "X" ? "var(--x-color)" : "var(--o-color)";
    scores[currentPlayer]++;
    updateScores();
    gameActive = false;
    playSound(winSound);
    
    // Change restart button color
    restartBtn.classList.add(currentPlayer === "X" ? "x-win" : "o-win");
    //Developed by https://www.linkedin.com/in/msubham/
    // Show blinking winning cells
    const winningCondition = winConditions.find(cond => {
      const [a, b, c] = cond;
      return board[a] && board[a] === board[b] && board[b] === board[c];
    });
    showWinningCells(winningCondition);
    
    // Alternate first player for next game
    firstPlayer = firstPlayer === "X" ? "O" : "X";
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    statusText.style.color = "var(--text-color)";
    gameActive = false;
    playSound(drawSound);
    
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
//Developed by https://www.linkedin.com/in/msubham/
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
      statusText.style.color = "var(--o-color)";
      scores.O++;
      updateScores();
      gameActive = false;
      playSound(winSound);
      
      // Change restart button color
      restartBtn.classList.add("o-win");
      
      // Show blinking winning cells
      const winningCondition = winConditions.find(cond => {
        const [a, b, c] = cond;
        return board[a] && board[a] === board[b] && board[b] === board[c];
      });
      showWinningCells(winningCondition);
      
      // Alternate first player for next game
      firstPlayer = firstPlayer === "X" ? "O" : "X";
      return;
    }
    
    if (board.every(cell => cell !== "")) {
      statusText.textContent = "It's a draw!";
      statusText.style.color = "var(--text-color)";
      gameActive = false;
      playSound(drawSound);
      
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
  statusText.style.color = "var(--text-color)";
  winningCells.style.display = "none";
  winningCells.innerHTML = "";
  boardBorder.classList.remove("x-turn", "o-turn");
  restartBtn.classList.remove("x-win", "o-win");
  
  updateTurnIndicator();
  //Developed by https://www.linkedin.com/in/msubham/
  if (aiMode && currentPlayer === "O") {
    setTimeout(makeAIMove, 500);
  }
}

// Initialize the game when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
