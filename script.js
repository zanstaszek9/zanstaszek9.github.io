const audioFiles = [
    `01.Prawidłowe-tony-serca-koniuszek-serca.mp3`,
    `02.Rozdwojenie-pierwszego-tonu-serca-koniuszek-serca.mp3`,
    `03.-Szmer-wczesnoskurczowy-z-p-max-nad-koniuszkiem-serca.mp3`,
    `04.Szmer-śródskurczowy-z-p-max-nad-koniuszkiem-serca.mp3`,
    `06.Szmer-holosystoliczny-z-p-max-nad-koniuszkiem-serca.mp3`,
    `07.Rytm_cwalowy_ton_IV.mp3`,
    `08.Szmer-skurczowy-z-p-max-nad-z-aortalną.mp3`,
    `09.Szmer-skurczowy-z-p-max-nad-z-aortalna-rozdwojenie-drugiego-tonu-serca.mp3`,
    `10.Prawidłowe-tony-serca-z-aortalna.mp3`,
    `11.Szmer-skurczowy-z-p-max-nad-z-pnia-płucnego.mp3`,
    `12.Szmer-skurczowy-z-p-max-w-punkcie-Erba-sztywne-rozdwojenie-drugiego-tonu-serca.mp3`,
    `13.Szmer-holodiastoliczny-decrescendo-oraz-szmer-wczesnoskurczowy-z-p-max-nad-z-aortalną.mp3`,
    `14.Szmer-rozkurczowy-z-p-max-nad-z-aortalną.mp3`,
    `15.Szmer-maszynowy.mp3`,
    `16.Trzask-śródszkurczowy-następujący-po-nim-szmer-skurczowy-z-p-max-nad-koniuszkiem-serca.mp3`,
    `17.Szmer-rozkurczowy-z-p-max-nad-koniuszkiem-serca.mp3`,
    `18.Szmer-skurczowy-holosystoliczny-z-p-max-w-punkcie-Erba.mp3`,
];

const folderPath = 'audio-files/serce/';
let currentIndex = -1;
let cardCounter = 0;
let audio = document.getElementById('audio');
let isFront = true;

const counter = document.getElementById('counter');
const flashcard = document.getElementById('flashcard');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const answerButtons = document.getElementById('answer-buttons');
const flipButton = document.getElementById('flip-button');
const pauseButton = document.getElementById('pause-button');
const playButton = document.getElementById('play-button');
const nextButton = document.getElementById('next-button');


function formatName(file) {
    return file
        .replace(/^\d+\.|_|-|\.mp3$/g, ' ')
        .trim();
}


function playAudio(file) {
    audio.src = folderPath + file;
    audio.play();
}

function pauseAudio() {
    audio.pause();
}

function flipCardToBack(text) {
    cardBack.querySelector('p').textContent = text;
    flashcard.classList.add('flipped');
    isFront = false;
    [...answerButtons.children].forEach(btn => {
        btn.classList.add('disabled');
        if (btn.textContent === text) {
            btn.classList.remove('wrong');
            btn.classList.add('correct');
        }
    });

    nextButton.classList.add('highlighted');
}

function flipCardToFront() {
    flashcard.classList.remove('flipped');
    isFront = true;
}

function getRandomFile(excludeIndex = -1) {
    let idx;
    do {
        idx = Math.floor(Math.random() * audioFiles.length);
    } while (idx === excludeIndex);
    return idx;
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function loadNewCard() {
    if (!isFront) flipCardToFront();
    nextButton.classList.remove('highlighted');
    const newIndex = getRandomFile(currentIndex);
    currentIndex = newIndex;
    cardCounter++;

    const file = audioFiles[currentIndex];
    const name = formatName(file);

    counter.textContent = `Przerobione karty: ${cardCounter}`;

    cardFront.querySelector('p').textContent = 'Kliknij, aby odwrócić...';
    cardBack.querySelector('p').textContent = name;

    playAudio(file);
    generateAnswerButtons(name);
}

function generateAnswerButtons(correctName) {
    answerButtons.innerHTML = '';

    const allNames = audioFiles.map(formatName);
    const wrongOptions = shuffle(allNames.filter(n => n !== correctName)).slice(0, 3);
    const options = shuffle([correctName, ...wrongOptions]);

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'answer';
        btn.textContent = option;
        btn.onclick = () => handleAnswerClick(btn, option, correctName);
        answerButtons.appendChild(btn);
    });
}

function handleAnswerClick(button, chosen, correct) {
    if (button.classList.contains('disabled') || button.classList.contains('correct')) return;

    if (chosen === correct) {
        button.classList.add('correct');
        [...answerButtons.children].forEach(btn => {
            if (btn !== button) {
                btn.classList.add('disabled');
            }
        });
        pauseAudio();
        flipCardToBack(correct);

        // Dodaj animację paska ładowania
        nextButton.classList.add('loading-progress');

        setTimeout(() => {
            nextButton.classList.remove('loading-progress');
            loadNewCard();
        }, 1800);
    } else {
        button.classList.add('wrong');
        button.classList.add('disabled');
    }
}


flipButton.addEventListener('click', () => {
    if (isFront) {
        pauseAudio();
        flipCardToBack(formatName(audioFiles[currentIndex]));
    } else {
        flipCardToFront();
        playAudio(audioFiles[currentIndex]);
    }
});

nextButton.addEventListener('click', () => {
    loadNewCard();
});


flashcard.addEventListener('click', () => {
    if (isFront) {
        flipCardToBack(formatName(audioFiles[currentIndex]));
    } else {
        flipCardToFront();
    }
});


pauseButton.addEventListener('click', () => pauseAudio());
playButton.addEventListener('click', () => playAudio(audioFiles[currentIndex]));

window.addEventListener('load', loadNewCard);
