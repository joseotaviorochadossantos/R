const board = document.getElementById('board');
const scoreEl = document.getElementById('score');
const movesEl = document.getElementById('moves');
const message = document.getElementById('message');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const victoryOverlay = document.getElementById('victoryOverlay');
const closeOverlay = document.getElementById('closeOverlay');

const symbols = ['❤️', '🌹', '💌', '✨', '🎵', '💎'];
let cards = [];
let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let boardLocked = false;

function shuffle(array) {
    return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

function createBoard() {
    board.innerHTML = '';
    const cardSymbols = shuffle([...symbols, ...symbols]);

    cards = cardSymbols.map((symbol, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'card';
        button.setAttribute('aria-label', `Carta ${index + 1}`);
        button.setAttribute('data-symbol', symbol);
        button.setAttribute('data-index', index);
        button.innerHTML = '<span class="card-face">?</span>';

        button.addEventListener('click', () => handleCardClick(button));
        return button;
    });

    cards.forEach((card) => board.appendChild(card));
}

function flipCard(card) {
    if (boardLocked || card.classList.contains('card--flipped') || card.classList.contains('card--matched')) {
        return;
    }

    card.classList.add('card--flipped');
    card.innerHTML = `<span class="card-face">${card.dataset.symbol}</span>`;
    flippedCards.push(card);
}

function unflipCards() {
    boardLocked = true;
    setTimeout(() => {
        flippedCards.forEach((card) => {
            card.classList.remove('card--flipped');
            card.innerHTML = '<span class="card-face">?</span>';
        });
        flippedCards = [];
        boardLocked = false;
    }, 800);
}

function markAsMatched() {
    flippedCards.forEach((card) => card.classList.add('card--matched'));
    matchedCount += 1;
    flippedCards = [];
}

function updateScore() {
    scoreEl.textContent = matchedCount;
    movesEl.textContent = moves;
}

function createHeartBurst(card) {
    try {
        const burst = document.createElement('div');
        burst.className = 'heart-burst';
        burst.textContent = '💖';
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2 - 12;
        const centerY = rect.top + rect.height / 2 - 12;
        burst.style.left = centerX + 'px';
        burst.style.top = centerY + 'px';
        document.body.appendChild(burst);
        setTimeout(() => {
            if (burst.parentNode) {
                burst.parentNode.removeChild(burst);
            }
        }, 1200);
    } catch (e) {
        console.warn('Heart burst animation error:', e);
    }
}

function handleCardClick(card) {
    if (boardLocked || card.classList.contains('card--flipped') || card.classList.contains('card--matched')) {
        return;
    }

    flipCard(card);

    if (flippedCards.length === 2) {
        moves += 1;
        updateScore();

        const [firstCard, secondCard] = flippedCards;
        const sameSymbol = firstCard.dataset.symbol === secondCard.dataset.symbol;

        if (sameSymbol) {
            markAsMatched();
            createHeartBurst(firstCard);
            createHeartBurst(secondCard);
            message.textContent = 'Você encontrou um par! Continue assim.';
            if (matchedCount === symbols.length) {
                message.textContent = 'Agora de par mesmo que falta é Raissa e o Zé!';
                showVictoryOverlay();
            }
        } else {
            message.textContent = 'Quase! Tente lembrar onde está o próximo símbolo.';
            unflipCards();
        }
    }
}

function showVictoryOverlay() {
    victoryOverlay.classList.add('show');
}

function hideVictoryOverlay() {
    victoryOverlay.classList.remove('show');
}


function startGame() {
    hideVictoryOverlay();
    matchedCount = 0;
    moves = 0;
    boardLocked = false;
    updateScore();
    createBoard();
    message.textContent = 'Jogo iniciado! Toque nas cartas para encontrar os pares.';
}

function resetGame() {
    hideVictoryOverlay();
    matchedCount = 0;
    moves = 0;
    boardLocked = false;
    updateScore();
    createBoard();
    message.textContent = 'Pronto para começar. Toque em Começar quando estiver preparada.';
}

startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
closeOverlay.addEventListener('click', () => {
    hideVictoryOverlay();
    resetGame();
});
resetGame();
