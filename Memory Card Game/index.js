const cards = document.querySelectorAll(".card");

const wrapper = document.querySelector(".wrapper");

const resultBox = document.querySelector(".resultBox");

const newGame = document.querySelector(".newGame");

let cardOne, cardTwo;

let matchCard = 0 ;

let mistakes = 0;

let disableDeck = false;
// time
let minutes = 0;    
let seconds = 0;
let timer;


window.onload = function () {
    shuffleCard();
}

function flipCard(e){
    let clickedCard = e.target;
    if(clickedCard!== cardOne && !disableDeck){
        clickedCard.classList.add("flip");
        if(!cardOne){
            return cardOne = clickedCard;
        }else{
    
            cardTwo = clickedCard;
            disableDeck = true;
            let cardOneImg = cardOne.querySelector("img").src,
            cardTwoImg = cardTwo.querySelector("img").src;
            matchCards(cardOneImg, cardTwoImg);
        }
    }
}

function matchCards(img1, img2){
    if (img1 === img2){
        matchCard ++;
        writeMusic();
        if(matchCard == 8){
           setTimeout(() => {
                // return shuffleCard();
                resultPage(); 
                victoryMusic();
            }, 300);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    else{
        mistakes++;
        WrongMusic();
        setTimeout(() => {
            cardOne.classList.add("shake");
            cardTwo.classList.add("shake"); 
        }, 400);
        setTimeout(() => {
            cardOne.classList.remove("shake", "flip");
            cardTwo.classList.remove("shake", "flip"); 
            cardOne = cardTwo = "";
            disableDeck = false;
        }, 1200);
    }
};
function shuffleCard(){
    matchCard = 0;
    minutes = 0;
    seconds = 0;
    mistakes = 0;
    startClock();
    cardOne = cardTwo = "";
    let arr = [4, 6, 2, 3, 8, 1, 7, 5, 4, 5, 2, 6, 8, 7, 3, 1];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);
    
    cards.forEach((card, i) => {
        card.classList.remove("flip");
        let imgTag = card.querySelector("img");
        imgTag.src = 'game-image/img-'+ arr[i] +'.png';
        card.addEventListener("click", flipCard);
    });
}
function resultPage(){
    document.querySelector(".mistakes").innerHTML= mistakes;
    document.querySelector(".time").innerHTML = `${minutes}:${seconds}`;
    wrapper.classList.add("hide");
    resultBox.classList.remove("hide");
}

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


newGame.addEventListener("click", function(){
    wrapper.classList.remove("hide");
    resultBox.classList.add("hide");
    shuffleCard();
})

// startButton.addEventListener("click", function(){
//     startClock();
//     shuffleCard();
//     playBackgroundMusic();
//     startButton.innerHTML="Next";
//     cards.forEach(card => {
//         card.classList.add("flip");
//         setTimeout(() => {
//             card.classList.remove("flip");
//         }, 2000);
//         card.addEventListener("click", flipCard);
//     });
// })

// helpButton.addEventListener("click", function(){
//     cards.forEach(card => {
//         card.classList.add("flip");
//         setTimeout(() => {
//             card.classList.remove("flip");
//         }, 2000);
//         card.addEventListener("click", flipCard);
//     });
// })


 // declare globally so it doesn't recreate each time

function playBackgroundMusic() {
    if (window._bgAudioRef) {
    window._bgAudioRef.pause();
    window._bgAudioRef.currentTime = 0;
    }
  const audio = new Audio("./game music/Ncs Mp3 Ringtone Download - MobCup.Com.Co.mp3"); // Replace with your file
  audio.loop = true;
  audio.volume = 0.1;
  audio.play();

  // Optional: store the audio in window object if you want to control it later
  window._bgAudioRef = audio;
}


function WrongMusic(){
    const audio = new Audio("./game music/sounds_wrong.mp3");
    audio.play();
    audio.volume = 0.21;
}
function writeMusic(){
    const audio = new Audio("./game music/complete.mp3");
    audio.play();
}

function victoryMusic(){
    if (window._bgAudioRef) {
    window._bgAudioRef.pause();
    window._bgAudioRef.currentTime = 0;
    }
    const audio = new Audio("./game music/john-cena-ringtonebgmjohn-cena-entry-song1688598706.mp3");
    audio.play();
}
