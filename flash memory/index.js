const memoryGrid = document.getElementById("memoryGrid");
const wrapper = document.querySelector(".wrapper");
const resultBox = document.querySelector(".resultBox");
const newGameBtn = document.querySelector(".newGame button");
const timeSpan = document.querySelector(".time");
const levelSpan = document.querySelector(".level");
const startScreen = document.querySelector(".startScreen");
const startBtn = document.getElementById("startBtn");
const headline = document.querySelector(".headline");

let level = 1;
let gridSize = 3;
let flashCount = 3;
let flashed = [];
let userSelected = [];
let clickable = false;
let timer, seconds = 0;
let playing = false;

function setupGrid(size) {
    memoryGrid.innerHTML = "";
    gridSize = size;
    memoryGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    setTimeout(() => {
        memoryGrid.style.height = memoryGrid.offsetWidth + "px";
    }, 10);
    for (let i = 0; i < size * size; i++) {
        let box = document.createElement("div");
        box.className = "memoryBox";
        box.dataset.index = i;
        box.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back"></div>
            </div>
        `;
        box.addEventListener("click", boxClick);
        memoryGrid.appendChild(box);
    }
}
function getRandomFlashes(count, max) {
    let arr = [];
    while(arr.length < count) {
        let n = Math.floor(Math.random() * max);
        if(!arr.includes(n)) arr.push(n);
    }
    return arr;
}
function showFlashPattern(cb) {
    clickable = false;
    userSelected = [];
    const boxes = document.querySelectorAll(".memoryBox");
    flashed.forEach(idx => {
        boxes[idx].classList.add("flipping");
        setTimeout(() => {
            boxes[idx].classList.remove("flipping");
        }, 820);
    });
    setTimeout(() => {
        boxes.forEach(box => box.classList.remove("selected","wrong"));
        clickable = true;
        cb && cb();
    }, 860);
}
function boxClick(e) {
    if(!clickable) return;
    let idx = +e.currentTarget.dataset.index;
    if(userSelected.includes(idx)) return;
    userSelected.push(idx);
    e.currentTarget.classList.add("selected");
    if(userSelected.length === flashed.length) {
        clickable = false;
        setTimeout(checkResult, 200);
    }
}
function checkResult() {
    let win = userSelected.every(idx => flashed.includes(idx)) &&
              flashed.every(idx => userSelected.includes(idx));
    if(win) {
        level++;
        flashCount++;
        if(flashCount > Math.floor(gridSize*gridSize * 2/3)) {
            gridSize++;
            if(gridSize > 8) gridSize = 8;
            // No flashCount reset
        }
        setTimeout(startNext, 500);
    } else {
        showWrong();
        setTimeout(gameOver, 1100);
    }
}


function showWrong() {
    const boxes = document.querySelectorAll(".memoryBox");
    boxes.forEach((box, idx) => {
        if(flashed.includes(idx) && !userSelected.includes(idx))
            box.classList.add("flipping");
        if(userSelected.includes(idx) && !flashed.includes(idx))
            box.classList.add("wrong");
    });
}
function startNext() {
    setupGrid(gridSize);
    flashed = getRandomFlashes(flashCount, gridSize * gridSize);
    setTimeout(() => showFlashPattern(), 550);
}
function gameOver() {
    clearInterval(timer);
    wrapper.classList.add("hide");
    resultBox.classList.remove("hide");
    timeSpan.textContent = `${seconds}s`;
    levelSpan.textContent = level-1;
    headline.textContent = "Game Over!";
    playing = false;
}
function startTimer() {
    seconds = 0;
    clearInterval(timer);
    timer = setInterval(() => seconds++, 1000);
}
function startGame() {
    wrapper.classList.remove("hide");
    resultBox.classList.add("hide");
    startScreen.style.display = "none";
    level = 1;
    gridSize = 3;
    flashCount = 3;
    playing = true;
    setupGrid(gridSize);
    flashed = getRandomFlashes(flashCount, gridSize * gridSize);
    showFlashPattern();
    startTimer();
}
newGameBtn.onclick = startGame;
startBtn.onclick = startGame;

window.addEventListener('resize', () => {
    if(playing) setupGrid(gridSize);
});
