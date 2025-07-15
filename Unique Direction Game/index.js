// Allowed directions
const directions = ["up", "down", "left", "right"];

// Game state
let gamePattern = [];
let userPattern = [];
let gameStarted = false;
let levels = 0;
let minutes = 0;    
let seconds = 0;
let timer;

// DOM elements
const info = document.getElementById("info");
const gameText = document.getElementById("gameText");
const arrow = document.querySelector(".arrow");
const wrapper = document.querySelector(".wrapper");
const Button = document.querySelector(".btn");
const resultBox = document.querySelector(".resultBox");
const newGame = document.querySelector(".newGame");

// Utility: Pick a random direction
function getRandomDirection() {
  return directions[Math.floor(Math.random() * directions.length)];
}
document.querySelector(".startBtn").addEventListener("click", function(){
  startGame();
  this.classList.add("hide");
})


// Start or restart the game
function startGame() {
  gamePattern = [];
  userPattern = [];
  gameStarted = true;
  startClock();
  levels = 0;
  document.body.classList.add('noscroll');
  document.documentElement.classList.add('noscroll');
  gameText.textContent = "";
  info.textContent = "Watch the pattern...";
  addNextDirection();
  arrow.classList.remove("hide");
}
function reset(){
  gamePattern = [];
  userPattern = [];
  gameStarted = false;
  levels = 0;
  minutes = 0;    
  seconds = 0;
  arrow.className = "arrow";

  // Optional: Also hide the arrow initially
  arrow.classList.add("hide");
}
// Add the next random direction to the pattern
function addNextDirection() {
  const next = getRandomDirection();
  gamePattern.push(next);
  levels++;
  showPattern();
}
// Show the full pattern to the user step by step
function showPattern() {
  let index = 0;
  const interval = setInterval(() => {
    animateArrow(gamePattern[index]);
    index++;
    if (index >= gamePattern.length) {
      clearInterval(interval);
      userPattern = [];
      gameText.textContent = "";
      info.textContent = "Now repeat the pattern";
    }
  }, 800);
}

function animateArrow(direction, color = "") {
  // Reset to base class
  arrow.className = "arrow";

  // Force reflow to reset animation
  void arrow.offsetWidth;

  // Add direction class
  arrow.classList.add(direction);

  // Optionally change color class
  if (color === "green") {
    arrow.classList.add("green");
    // Remove green after animation ends
    setTimeout(() => {
      arrow.classList.remove("green");
    }, 800);
  }
}


function handleInput(direction) {
  if (!gameStarted) return;

  userPattern.push(direction);
  animateArrow(direction, "green"); // ✅ green for user input

  const index = userPattern.length - 1;
  if (userPattern[index] !== gamePattern[index]) {
    gameOver();
    return;
  }

  if (userPattern.length === gamePattern.length) {
    setTimeout(addNextDirection, 800);
  }
}


// End the game
function gameOver() {
   gameStarted = false;
  wrapper.classList.add("hide");
  Button.classList.add("hide");
  resultBox.classList.remove("hide");
   document.body.classList.remove('noscroll');
  document.documentElement.classList.remove('noscroll');
  document.querySelector(".levels").innerHTML= levels;
  document.querySelector(".time").innerHTML = `${minutes}:${seconds}`;
}

newGame.addEventListener("click", function(){
    wrapper.classList.remove("hide");
    Button.classList.remove("hide");
    resultBox.classList.add("hide");
    arrow.classList.add("hide");
    reset();
    document.querySelector(".startBtn").classList.remove("hide");
})

function startClock() {
  clearInterval(timer);
  timer = setInterval(() => {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
  }, 1000);
}
// Calculate swipe direction based on movement delta
function getSwipeDirection(dx, dy) {
  return Math.abs(dx) > Math.abs(dy)
    ? dx > 0 ? "right" : "left"
    : dy > 0 ? "down" : "up";
}

// Touch input handlers
let startX = 0;
let startY = 0;

wrapper.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

wrapper.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - startX;
  const dy = e.changedTouches[0].clientY - startY;

  if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
    const direction = getSwipeDirection(dx, dy);
    handleInput(direction);
  }
});

// Keyboard arrow key support
document.addEventListener("keydown", (e) => {
  if (!gameStarted) return;

  const keyMap = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right"
  };

  const direction = keyMap[e.key];
  if (direction) {
    handleInput(direction);
  }
});
