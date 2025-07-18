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
let timer = null;

const wordBox = document.getElementById('word-box');
const startBtn = document.getElementById('start-btn');
const scoreSpan = document.getElementById('score');
const gameOverDiv = document.getElementById('game-over');

function getMixedArray(level) {
  let arr = [];
  for (let i = 0; i < level; i++) {
    // Randomly pick flying or non-flying
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
  startBtn.style.display = 'none';
  nextLevel(1);
}

function nextLevel(level) {
  mixedArray = getMixedArray(level);
  showWord(0);
}

function showWord(i) {
  if (i >= mixedArray.length) {
    // Next level
    setTimeout(() => {
      nextLevel(mixedArray.length + 1);
    }, 600);
    return;
  }
  wordBox.innerText = mixedArray[i].word;
  current = i;

  // Add swipe up detection
  let startY = null;
  let moved = false;

  function onTouchStart(e) {
    startY = e.touches ? e.touches[0].clientY : e.clientY;
    moved = false;
  }
  function onTouchMove(e) {
    if (!playing) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    if (startY - y > 40) { // swiped up
      moved = true;
      handleInput(true);
    } else if (Math.abs(startY - y) > 15) { // moved but not up enough
      moved = true;
      handleInput('wrongmove');
    }
  }
  function onTouchEnd(e) {
    if (!moved) handleInput(false); // didn't move finger
  }

  function handleInput(swipedUp) {
    playing = false;
    // Remove listeners to prevent multiple triggers
    wordBox.removeEventListener('touchstart', onTouchStart);
    wordBox.removeEventListener('mousedown', onTouchStart);
    wordBox.removeEventListener('touchmove', onTouchMove);
    wordBox.removeEventListener('mousemove', onTouchMove);
    wordBox.removeEventListener('touchend', onTouchEnd);
    wordBox.removeEventListener('mouseup', onTouchEnd);

    const ans = mixedArray[current];
    if (swipedUp === true && ans.isFlying) {
      // Correct
      score++;
      scoreSpan.innerText = score;
      playing = true;
      setTimeout(() => showWord(current + 1), 400);
    } else if (swipedUp === false && !ans.isFlying) {
      // Correct (didn’t move finger)
      score++;
      scoreSpan.innerText = score;
      playing = true;
      setTimeout(() => showWord(current + 1), 400);
    } else {
      // Wrong!
      gameOverDiv.classList.remove('hidden');
      startBtn.innerText = "नया खेल शुरू करें";
      startBtn.style.display = '';
      wordBox.innerText = '';
    }
  }

  // Mobile
  wordBox.addEventListener('touchstart', onTouchStart);
  wordBox.addEventListener('touchmove', onTouchMove);
  wordBox.addEventListener('touchend', onTouchEnd);
  // Desktop
  wordBox.addEventListener('mousedown', onTouchStart);
  wordBox.addEventListener('mousemove', onTouchMove);
  wordBox.addEventListener('mouseup', onTouchEnd);
}

startBtn.onclick = startGame;
