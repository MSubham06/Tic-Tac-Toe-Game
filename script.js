const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const winningLine = document.getElementById("winning-line");

const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

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

  clickSound.currentTime = 0;
  clickSound.play();

  board[index] = currentPlayer;
  this.textContent = currentPlayer;

  if (checkWin()) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    winSound.play();
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    drawSound.play();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
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
  currentPlayer = "X";
  cells.forEach(cell => cell.textContent = "");
  statusText.textContent = "";
  winningLine.style.display = "none";
}

cells.forEach(cell => cell.addEventListener("click", handleClick));
