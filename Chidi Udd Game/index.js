const flyingThings = [
  "चिड़िया", "कौआ", "तोता", "मक्खी", "मच्छर", "पतंग", "तितली", "बाज़", "गिद्ध"
];
const notFlyingThings = [
  "कुत्ता", "बिल्ली", "घोड़ा", "गाय", "भालू", "छिपकली", "बकरी", "गधा", "शेर"
];

let mixedArray = [];
let current = 0;
let score = 0;
let playing = false;

const wordBox = document.getElementById('word-box');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreSpan = document.getElementById('score');
const gameOverDiv = document.getElementById('game-over');
const startScreen = document.getElementById('start-screen');
const mainGame = document.getElementById('main-game');

// Disable all scrolling & dragging on mobile/desktop
window.addEventListener('touchmove', function(e){ e.preventDefault(); }, {passive:false});
window.addEventListener('scroll', function(e){ window.scrollTo(0,0); });
document.body.addEventListener('dragstart', e => e.preventDefault());
document.body.addEventListener('drop', e => e.preventDefault());

// ---- Main Game Logic ----

function getMixedArray(level) {
  let arr = [];
  for (let i = 0; i < level; i++) {
    const isFly = Math.random() < 0.5;
    if (isFly) {
      arr.push({
        word: flyingThings[Math.floor(Math.random() * flyingThings.length)],
        isFlying: true
      });
    } else {
      arr.push({
        word: notFlyingThings[Math.floor(Math.random() * notFlyingThings.length)],
        isFlying: false
      });
    }
  }
  return arr;
}

function startGame() {
  playing = true;
  current = 0;
  score = 0;
  scoreSpan.innerText = score;
  gameOverDiv.classList.add('hidden');
  restartBtn.classList.add('hidden');
  startScreen.classList.add('hidden');
  mainGame.classList.remove('hidden');
  nextLevel(1);
}

function nextLevel(level) {
  mixedArray = getMixedArray(level);
  showWord(0);
}

function showWord(i) {
  if (i >= mixedArray.length) {
    setTimeout(() => {
      nextLevel(mixedArray.length + 1);
    }, 700);
    return;
  }
  wordBox.innerText = mixedArray[i].word;
  current = i;
  playing = true;

  let startY = null;
  let startX = null;
  let moved = false;

  function onTouchStart(e) {
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    moved = false;
  }
  function onTouchMove(e) {
    if (!playing) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaY = startY - y;
    const deltaX = startX - x;
    if (Math.abs(deltaY) > 40 && Math.abs(deltaX) < 25) {
      // Up or down swipe
      moved = true;
      handleInput(true);
    } else if (Math.abs(deltaX) > 30) {
      // Left/right swipe = wrong!
      moved = true;
      handleInput('wrongmove');
    } else if (Math.abs(deltaY) > 15) {
      moved = true;
      handleInput('wrongmove');
    }
  }
  function onTouchEnd(e) {
    if (!moved) handleInput(false);
  }

  // Keyboard Arrow Up/Down
  function onKeyDown(e) {
    if (!playing) return;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      handleInput(true);
    } else if (e.key.startsWith("Arrow")) {
      handleInput('wrongmove');
    }
  }

  function handleInput(swipedUpOrDown) {
    playing = false;
    wordBox.removeEventListener('touchstart', onTouchStart);
    wordBox.removeEventListener('mousedown', onTouchStart);
    wordBox.removeEventListener('touchmove', onTouchMove);
    wordBox.removeEventListener('mousemove', onTouchMove);
    wordBox.removeEventListener('touchend', onTouchEnd);
    wordBox.removeEventListener('mouseup', onTouchEnd);
    document.removeEventListener('keydown', onKeyDown);

    const ans = mixedArray[current];
    if (swipedUpOrDown === true && ans.isFlying) {
      score++;
      scoreSpan.innerText = score;
      setTimeout(() => showWord(current + 1), 400);
    } else if (swipedUpOrDown === false && !ans.isFlying) {
      score++;
      scoreSpan.innerText = score;
      setTimeout(() => showWord(current + 1), 400);
    } else {
      gameOverDiv.classList.remove('hidden');
      restartBtn.classList.remove('hidden');
      mainGame.classList.remove('shake');
      wordBox.innerText = '';
    }
  }

  // Mouse/Touch listeners
  wordBox.addEventListener('touchstart', onTouchStart);
  wordBox.addEventListener('mousedown', onTouchStart);
  wordBox.addEventListener('touchmove', onTouchMove);
  wordBox.addEventListener('mousemove', onTouchMove);
  wordBox.addEventListener('touchend', onTouchEnd);
  wordBox.addEventListener('mouseup', onTouchEnd);

  // Keyboard
  document.addEventListener('keydown', onKeyDown);
}

startBtn.onclick = startGame;
restartBtn.onclick = function() {
  startGame();
};
