const audioFiles = {
    serce: [
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
    ],
    pluca: [
        `1. Obrzek-pluc.mp3`,
        `2. Stridor.mp3`,
        `3. Trzeszczenia.mp3`,
        `4. Rzężenia.mp3`,
        `5. Oskrzelowy.mp3`,
        `6. Tarcie opłucnej.mp3`,
        `7. Świsty.mp3`,
        `8. Pęcherzykowy.mp3`,
        `9. Tchawiczy.mp3`,
        `10. Oskrzelowo – pęcherzykowy.mp3`,
        `11. Świsty.mp3`,
        `12. Stridor.mp3`,
        `13. Trzeszczenia.mp3`,
        `14. Trzeszczenia.mp3`,
        `15. Stridor.mp3`,
        `16. Trzeszczenia.mp3`,
        `17. Szmer pęcherzykowy.mp3`,
    ]
};

const folderPaths = {
    serce: 'audio-files/serce/',
    pluca: 'audio-files/pluca/'
};

let currentMode = 'serce';
let currentIndex = -1;
let cardCounter = 0;
let audio = document.getElementById('audio');
let isFront = true;
const modeToggle = document.getElementById('mode-toggle');


const counter = document.getElementById('counter');
const flashcard = document.getElementById('flashcard');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const answerButtons = document.getElementById('answer-buttons');
const flipButton = document.getElementById('flip-button');
const pauseButton = document.getElementById('pause-button');
const playButton = document.getElementById('play-button');
const nextButton = document.getElementById('next-button');
const toggleAnswers = document.getElementById('toggle-answers');

let allNamesShortUnique = Array.from(
    new Set(audioFiles[currentMode].map(formatName).map(name => getFirstWords(name, 2))
    ));

function formatName(file) {
    return file
        .replace(/^\d+\.|_|-|\.mp3$/g, ' ')
        .trim();
}


function playAudio(file) {
    audio.src = folderPaths[currentMode] + file;
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
        idx = Math.floor(Math.random() * audioFiles[currentMode].length);
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

    const file = audioFiles[currentMode][currentIndex];
    const name = formatName(file);


    counter.textContent = `Przerobione karty: ${cardCounter}`;
    cardFront.querySelector('p').textContent = 'Kliknij, aby odwrócić...';
    cardBack.querySelector('p').textContent = name;

    playAudio(file);
    generateAnswerButtons(name);
}

function getFirstWords(str, wordCount) {
    const strSplit = str.split(' ');
    if (strSplit <= wordCount) {
        return str;
    }
    return strSplit.slice(0, wordCount).join(' ');
}

function generateAnswerButtons(correctName) {
    answerButtons.innerHTML = '';

    const shortCorrectName = getFirstWords(correctName, 2);

    const wrongOptions = shuffle([...allNamesShortUnique].filter(n => n !== shortCorrectName)).slice(0, 3);
    const options = shuffle([shortCorrectName, ...wrongOptions]);

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'answer';
        btn.textContent = option;
        btn.onclick = () => handleAnswerClick(btn, option, shortCorrectName, correctName);
        answerButtons.appendChild(btn);
    });
}

function handleAnswerClick(button, chosen, correctShort, correctLong) {
    if (button.classList.contains('disabled') || button.classList.contains('correct')) return;

    if (chosen === correctShort) {
        button.classList.add('correct');
        [...answerButtons.children].forEach(btn => {
            if (btn !== button) {
                btn.classList.add('disabled');
            }
        });
        pauseAudio();
        flipCardToBack(correctLong);

        nextButton.classList.add('loading-progress');

        setTimeout(() => {
            nextButton.classList.remove('loading-progress');
            loadNewCard();
        }, 1500);
    }
    else {
        button.classList.add('wrong');
        button.classList.add('disabled');
    }
}


function toggleAnswerVisibility() {
    if (toggleAnswers.checked) {
        answerButtons.style.display = 'grid';
    }
    else {
        answerButtons.style.display = 'none';
    }
}


function switchMode() {
    currentMode = modeToggle.checked ? 'pluca' : 'serce';
    currentIndex = -1;
    allNamesShortUnique = Array.from(
        new Set(audioFiles[currentMode].map(formatName).map(name => getFirstWords(name, 2)))
    );
    loadNewCard();
}

flipButton.addEventListener('click', () => {
    if (isFront) {
        pauseAudio();
        flipCardToBack(formatName(audioFiles[currentMode][currentIndex]));
    }
    else {
        flipCardToFront();
        playAudio(audioFiles[currentMode][currentIndex]);
    }
});

nextButton.addEventListener('click', () => {
    loadNewCard();
});


flashcard.addEventListener('click', () => {
    if (isFront) {
        flipCardToBack(formatName(audioFiles[currentMode][currentIndex]));
    }
    else {
        flipCardToFront();
    }
});


toggleAnswers.addEventListener('change', toggleAnswerVisibility);


pauseButton.addEventListener('click', () => pauseAudio());
playButton.addEventListener('click', () => playAudio(audioFiles[currentMode][currentIndex]));




modeToggle.addEventListener('change', switchMode);

window.addEventListener('load', loadNewCard);
