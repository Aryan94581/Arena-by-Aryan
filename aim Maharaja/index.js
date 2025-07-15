 const gameArea = document.getElementById('gameArea');
    const timerElem = document.getElementById('timer');
    const scoreElem = document.getElementById('score');
    const highElem = document.getElementById('highscore');
    const resultBox = document.getElementById('resultBox');
    const resultMsg = document.getElementById('resultMsg');
    const finalScore = document.getElementById('finalScore');
    const finalHigh = document.getElementById('finalHigh');
    const newGameBtn = document.getElementById('newGameBtn');
    const hitSound = document.getElementById('hitSound');
    const startScreen = document.getElementById('startScreen');
    const startBtn = document.getElementById('startBtn');
    const mainArea = document.querySelector('.wrapper');

    let score = 0, highScore = 0, timer = 60, interval = null, gameOn = false;
    let targetSize = 75, targets = [];

    // Local high score
    highScore = localStorage.getItem("aimMaharajaHigh") || 0;
    highElem.textContent = highScore;

    window.onload = () => {
      mainArea.style.display = 'none';
      startScreen.style.display = 'flex';
    };

    startBtn.onclick = () => {
      startScreen.style.display = 'none';
      mainArea.style.display = 'flex';
      startGame(); // apna game logic yahan call karo
    };
    function showResultPage() {
      document.querySelector('.finalScore').textContent = score;
      document.querySelector('.finalHigh').textContent = highScore;
      document.getElementById('resultMsg').textContent = 
        (score === highScore && score > 0) ? "Naya King! 👑" : "Khel Khatam!";
      document.getElementById('resultBox').classList.remove('hide');
      mainArea.classList.add('hide');
    }


    // Target SVG with rangoli/chakra effect
    const targetSVG = `<svg viewBox="0 0 90 90"><circle cx="45" cy="45" r="32" fill="#fff0"/><circle cx="45" cy="45" r="24" stroke="#2196f3" stroke-width="4" fill="none"/><circle cx="45" cy="45" r="11" stroke="#ff8000" stroke-width="5" fill="none"/><circle cx="45" cy="45" r="3.5" fill="#129407"/></svg>`;

    function randPos(size) {
      const areaRect = gameArea.getBoundingClientRect();
      let aw = areaRect.width, ah = areaRect.height;
      let x = Math.random() * (aw - size), y = Math.random() * (ah - size);
      return {x, y};
    }

    function spawnTarget(i) {
      let t = document.createElement('div');
      t.className = 'target';
      t.style.width = t.style.height = targetSize + "px";
      t.innerHTML = targetSVG;
      let pos;
      let tries = 0;
      do {
        pos = randPos(targetSize);
        tries++;
      } while (targets.some((o, idx) =>
        idx !== i && o &&
        Math.hypot(pos.x - o.x, pos.y - o.y) < targetSize * 0.9
      ) && tries < 20);
      t.style.left = pos.x + "px";
      t.style.top = pos.y + "px";
      gameArea.appendChild(t);
      t.addEventListener('pointerdown', (e) => {
        hitTarget(i, t, pos);
        e.stopPropagation();
      });
      targets[i] = {...pos, elem: t};
    }

    function hitTarget(i, t, pos) {
      if (!gameOn) return;
      score++;
      scoreElem.textContent = score;
      // Shrink targets every 10 hits, to minimum 40px
      if (score % 10 === 0 && targetSize > 40) {
        targetSize -= 7;
      }
      // Hit sound
      hitSound.currentTime = 0;
      hitSound.play();
      // Burst effect
      for (let j = 0; j < 12; j++) {
        let p = document.createElement("div");
        p.className = "particle";
        let sz = Math.random()*16 + 12;
        p.style.width = p.style.height = sz+"px";
        p.style.background = `radial-gradient(circle at 70% 30%, #ff8000 20%, #3eaf34 65%, #fff0 100%)`;
        p.style.left = (pos.x + targetSize/2 - sz/2 + Math.cos(2*Math.PI*j/12)*targetSize*0.5) + "px";
        p.style.top = (pos.y + targetSize/2 - sz/2 + Math.sin(2*Math.PI*j/12)*targetSize*0.5) + "px";
        gameArea.appendChild(p);
        setTimeout(()=>gameArea.removeChild(p), 600);
      }
      // Remove old target
      t.remove();
      // Respawn new one at random place
      spawnTarget(i);
    }

    function startGame() {
        score = 0;
        timer = 60;
        targetSize = 75;
        scoreElem.textContent = score;
        timerElem.textContent = timer;
        gameOn = true;
        resultBox.style.display = "none";
        mainArea.style.display = "flex";
        // Remove existing targets
        Array.from(gameArea.children).forEach(c => c.className === "target" && c.remove());
        targets = [];
        spawnTarget(0); spawnTarget(1);
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            timer--;
            timerElem.textContent = timer;
            if (timer <= 0) {
            endGame();
            }
        }, 1000);
    }


    function endGame() {
        gameOn = false;
        clearInterval(interval);
        // Remove targets
        Array.from(gameArea.children).forEach(c => c.className === "target" && c.remove());
        // High score check
        let newHigh = false;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("aimMaharajaHigh", highScore);
            highElem.textContent = highScore;
            newHigh = true;
        }
        // HIDE wrapper, SHOW result box
        mainArea.style.display = "none";
        resultBox.style.display = "flex";
        resultMsg.textContent = newHigh ? "Naya King! 👑" : "Khel Samapt!";
        finalScore.textContent = score;
        finalHigh.textContent = highScore;
    }


    newGameBtn.onclick = startGame;

    // Start first game on page load
    window.onload = startGame;