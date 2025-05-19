let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
const statusText = document.getElementById("status");
const gameBoard = document.getElementById("gameBoard");

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function startGame() {
  gameBoard.innerHTML = "";
  board.forEach((_, i) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", cellClick);
    gameBoard.appendChild(cell);
  });
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function cellClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  checkResult();
}

function checkResult() {
  let roundWon = false;

  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
  } else if (!board.includes("")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  startGame();
}

startGame();
