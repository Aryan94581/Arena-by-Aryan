const dotGrid = document.getElementById("dotGrid");
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
let pattern = [];
let userInput = [];
let clickable = false;
let timer, seconds = 0;
let playing = false;

function setupGrid(size) {
    dotGrid.innerHTML = "";
    dotGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    for (let i = 0; i < size * size; i++) {
        let dot = document.createElement("div");
        dot.className = "dot";
        dot.dataset.index = i;
        dot.addEventListener("click", onDotClick);
        dotGrid.appendChild(dot);
    }
}
function randomPattern(len, max) {
    let arr = [];
    while (arr.length < len) {
        let n = Math.floor(Math.random() * max);
        if (!arr.includes(n)) arr.push(n);
    }
    return arr;
}
function showPattern(cb) {
    clickable = false;
    let i = 0;
    const dots = document.querySelectorAll(".dot");
    let interval = setInterval(() => {
        dots.forEach(dot => dot.classList.remove("active"));
        if (i < pattern.length) {
            dots[pattern[i]].classList.add("active");
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                dots.forEach(dot => dot.classList.remove("active", "selected"));
                clickable = true;
                userInput = [];
                cb && cb();
            }, 400);
        }
    }, 500);
}
function onDotClick(e) {
    if (!clickable) return;
    let idx = +e.target.dataset.index;
    if (userInput.includes(idx)) return;
    userInput.push(idx);
    e.target.classList.add("selected");
    if (userInput.length === pattern.length) {
        clickable = false;
        setTimeout(checkPattern, 300);
    }
}
function checkPattern() {
    const correct = userInput.every((v, i) => v === pattern[i]);
    if (correct) {
        level++;
        if (level === 7 && gridSize === 3) {
            gridSize = 4;
        }
        startNext();
    } else {
        gameOver();
    }
}
function startNext() {
    if (playing) {
        setupGrid(gridSize);
        pattern = randomPattern(Math.min(4 + level, gridSize * gridSize), gridSize * gridSize);
        showPattern();
    }
}
function gameOver() {
    clearInterval(timer);
    wrapper.classList.add("hide");
    resultBox.classList.remove("hide");
    timeSpan.textContent = `${seconds}s`;
    levelSpan.textContent = level - 1;
    headline.textContent = "Game Over!";
    playing = false;
}
function startTimer() {
    seconds = 0;
    timer = setInterval(() => seconds++, 1000);
}
function startGame() {
    wrapper.classList.remove("hide");
    resultBox.classList.add("hide");
    startScreen.style.display = "none";
    level = 1;
    gridSize = 3;
    playing = true;
    setupGrid(gridSize);
    pattern = randomPattern(4 + level, gridSize * gridSize);
    showPattern();
    startTimer();
}
newGameBtn.onclick = startGame;
startBtn.onclick = startGame;
