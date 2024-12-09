const state = {
    score:{
        playerScore: 0,
        computerScore: 0, 
        scoreBox: document.getElementById('score_points'),
    },
    cardSprites: {
       avatar: document.getElementById('card-image'), 
       name: document.getElementById('card-name'), 
       type: document.getElementById('card-type'), 
    },
    fieldCards:{
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    }, 
    button: document.getElementById('next-duel'),
    audioBackground: document.getElementById('background-music'),
}

const playerSides = {
    player1: "player-cards",
    player1BOX:  document.querySelector('#player-cards'),
    computer: "computer-cards",
    computerBOX: document.querySelector('#computer-cards'),
}

const cardData = [
    {
        id:0, 
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: "./src/assets/icons/dragon.png",
        WinOf:[1],
        LoseOf: [2], 
    },
    {
        id:1, 
        name: "Dark Magician",
        type: "Rock",
        img: "./src/assets/icons/magician.png",
        WinOf:[2],
        LoseOf: [0], 
    },
    {
        id:2, 
        name: "Exodia",
        type: "Scisors",
        img: "./src/assets/icons/exodia.png",
        WinOf:[0],
        LoseOf: [1], 
    },
]

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function creatCardImage(IdCard, fieldSide){
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add('card');
    if( fieldSide === playerSides.player1){
        cardImage.addEventListener('mouseover', ()=>{
            drawSelectedCard(IdCard);
        })
        
        cardImage.addEventListener('click', ()=>{
            setCardsField(cardImage.getAttribute('data-id'))
        })
    }
    return cardImage;
}

async function drawSelectedCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = `Attribute: ${cardData[index].type}`;
}

async function setCardsField(cardId){
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId(); 

    await hiddenCardDetails(true);

    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';

    await drawCardsInField(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId );

    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId ){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function hiddenCardDetails(){
    state.cardSprites.name.innerText = ''
    state.cardSprites.type.innerText = ''
    state.cardSprites.avatar.src = ''
}

async function removeAllCardsImages(){
    let cards = playerSides.computerBOX
    let imgElements = cards.querySelectorAll('img')
    imgElements.forEach((img)=> img.remove())

    cards = playerSides.player1BOX 
    imgElements = cards.querySelectorAll('img')
    imgElements.forEach((img)=> img.remove())
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = 'draw'.toUpperCase();

    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = 'win'.toUpperCase();
        state.score.playerScore++;
        await playAudio('win');
    } 
    
    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = 'lose'.toUpperCase();
        state.score.computerScore++;
        
    }
    await playAudio(duelResults);
    return duelResults;
}

async function drawButton(text){
    state.button.innerText = text;
    state.button.style.display = 'block';
} 

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawCards(cardNumbers, fieldSide){
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await creatCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function resetDuel(){
    state.cardSprites.avatar.src = '';
    state.button.style.display = 'none';
    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';
    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play();
}

function init(){
    state.fieldCards.player.style.display = 'none'
    state.fieldCards.computer.style.display = 'none'

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    state.audioBackground.play();
    state.audioBackground.volume = 0.15;
}

init();