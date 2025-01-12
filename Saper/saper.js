
let correctlyFlaggedBombs = 0;
let safeCellsUncovered = 0;
let totalSafeCells;

let container = document.createElement("div");
container.classList.add("container");

let form = document.createElement("form");
form.classList.add("form1");

let button = document.createElement("button");
button.setAttribute("id", "generate");
button.append("Generuj");

let input1 = document.createElement("input");
let input2 = document.createElement("input");
let input3 = document.createElement("input");

let rowsForm1 = document.createElement("div");
let rowsForm2 = document.createElement("div");
let rowsForm3 = document.createElement("div");

let lab1 = document.createElement("p");
lab1.append("Szerokość");
let lab2 = document.createElement("p");
lab2.append("Wysokość");
let lab3 = document.createElement("p");
lab3.append("Miny");

rowsForm1.classList.add("rows-form");
rowsForm2.classList.add("rows-form");
rowsForm3.classList.add("rows-form");

baseForm();



// stary baseform bez checkleadeboard
// function baseForm() {

//     rowsForm1.append(lab1, input1);
//     rowsForm2.append(lab2, input2);
//     rowsForm3.append(lab3, input3);
//     document.body.appendChild(container);
//     container.append(rowsForm1, rowsForm2, rowsForm3);
//     container.append(button);

//     document.getElementById("generate").addEventListener("click", function startedListener() {
//         //czy wszystkie pola są wypełnione
//         if (!input1.value || !input2.value || !input3.value) {
//             alert("Pls wyplenij pola");
//             return;
//         }

//         if (parseInt(input3.value) > (parseInt(input2.value) * parseInt(input1.value)) - 9) {
//             alert("Za duza ilosc bomb")
//             location.reload()
//         }



//         button.removeEventListener('click', startedListener);
//         const width = parseInt(input1.value);
//         const height = parseInt(input2.value);
//         mines = parseInt(input3.value);
//         generateGame(width, height, mines);
//     });
// }



// form z checkleaderboard (in progress)
function baseForm() {
    // Dodanie pól do formularza
    rowsForm1.append(lab1, input1);
    rowsForm2.append(lab2, input2);
    rowsForm3.append(lab3, input3);
    container.append(rowsForm1, rowsForm2, rowsForm3);

    // Przyciski
    let generateButton = document.createElement("button");
    generateButton.textContent = "Generate Game";
    generateButton.id = "generate";

    let leaderboardButton = document.createElement("button");
    leaderboardButton.textContent = "check leaderboard";
    leaderboardButton.id = "chk_leader";

    container.append(generateButton, leaderboardButton);
    document.body.appendChild(container);




    // Event do generowania gry
    generateButton.addEventListener("click", function startedListener() {
        if (!input1.value || !input2.value || !input3.value) {
            alert("Wypelnij wszystkie pola!!!!!");
            return;
        }


        const width = parseInt(input1.value);
        const height = parseInt(input2.value);
        mines = parseInt(input3.value);
        setModeKey(width, height, mines);


        if (parseInt(input3.value) > (parseInt(input2.value) * parseInt(input1.value)) - 9) {
            alert("Za duzo bomb (nie wiecej niz x* y - 9 jkbc)");
            location.reload();
            // location reload dziala tak samo jak refresh tak przynjanijej mowi stack overflowe 

            // JavaScript 1.2 and newer.Short version: location.reload();. Long version(identical to the short version): window.location.reload();.


            return;
        }



        // Usun przycisk leaderboard
        leaderboardButton.remove();
        // Usuwanie leaderboarda, jeśli istnieje
        let existingLeaderboard = document.querySelector(".lose");
        if (existingLeaderboard) {
            existingLeaderboard.remove();
        }


        // wylacz eventa
        generateButton.removeEventListener('click', startedListener);

        generateGame(width, height, mines);
    });

    // kopia sprawdzania danych
    leaderboardButton.addEventListener("click", function () {
        if (!input1.value || !input2.value || !input3.value) {
            alert("Wypelnij pola");
            return;
        }
        // Usuwanie starego leaderboarda przed dodaniem nowego
        let existingLeaderboard = document.querySelector(".lose");
        if (existingLeaderboard) {
            existingLeaderboard.remove();
        }
        const width = parseInt(input1.value);
        const height = parseInt(input2.value);
        mines = parseInt(input3.value);
        setModeKey(width, height, mines);


        // Generowanie nowego leaderboarda
        // let modeKey = `scores_${input1.value}_${input2.value}_${input3.value}`;


        // showLeaderboard();
        //showHighScores();
        displayLeaderboard();
    });
}

// to jest zasadniczo showhighscores tylko troche zmieniony ze wzgledu na inna logike moze jest to do poprawienia pozniej, ta funkcja tez to przejrzenia na pozniej bo jest z chatuGPT 
function displayLeaderboard() {
    let highScores = getScoresFromCookies(modeKey);

    let scoreBoard = document.createElement("div");
    scoreBoard.classList.add("lose");

    // Tworzymy tytuł dla leaderboarda
    let title = document.createElement("h3");
    title.textContent = `Top 10 Tryhardow (${modeKey.replace("scores_", "").replace(/_/g, ", ")})`;
    scoreBoard.appendChild(title);

    // Generujemy wszystkie wpisy z wynikami
    highScores.forEach((score, index) => {
        let scoreEntry = document.createElement("p");
        scoreEntry.textContent = `${index + 1}. ${score.name} - ${score.time} s`;
        scoreBoard.appendChild(scoreEntry);
        console.log(score, index);

    });

    // Dodajemy przycisk do zamknięcia leaderboarda
    let closeButton = document.createElement("button");
    closeButton.textContent = "Zamknij";
    closeButton.classList.add("continue");
    closeButton.addEventListener("click", () => {
        scoreBoard.remove();  // Usuwanie leaderboarda po kliknięciu
    });

    scoreBoard.appendChild(closeButton);
    document.body.appendChild(scoreBoard);
}


const klepa = new Image(50, 50);
klepa.src = `img/klepa.PNG`;
const flagImg = new Image(50, 50);
flagImg.src = `img/flaga.PNG`;
const questionImg = new Image(50, 50);
questionImg.src = `img/pyt.PNG`;
const bombImg = new Image(50, 50);
bombImg.src = `img/bomb.PNG`;

[input1, input2, input3].forEach(input => {
    input.type = "text";
    input.classList.add("inp");

    let timeoutId;

    // na inputowaniu
    input.addEventListener("input", () => {
        // Anuluj poprzedni timer
        clearTimeout(timeoutId);

        // Timer na 2 sekundy zevy lepiej bylo widac
        timeoutId = setTimeout(() => {
            checkDigits(input);
        }, 2000);
    });

    input.addEventListener("keydown", () => {
        // Anuluj timer 
        clearTimeout(timeoutId);
    });
});


function checkDigits(input) {
    if (isNaN(input.value)) {
        input.value = '';
    }
}


let bombs = [];
let isFirstClick = true;


function generateGame(width, height, mines) {
    setModeKey(width, height, mines);
    bombs = [];
    board = Array.from({ length: width * height }, () => ({
        isBomb: false,
        adjacentBombs: 0,
        isOpen: false,
    }));

    totalSafeCells = width * height - mines;

    leftmines = document.createElement("p");
    leftmines.classList.add("lmines");
    leftmines.append(`Miny: ${mines}`);

    let time = document.createElement("p");
    time.setAttribute("id", "times");
    time.innerHTML = "Czas gry [s]";
    container.append(leftmines, time);

    stopWatch();

    let saper = document.createElement("div");
    saper.setAttribute("id", "saper");
    container.append(saper);

    saper.style.display = "grid";
    saper.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    saper.style.gridTemplateRows = `repeat(${height}, 1fr)`;

    for (let i = 0; i < width * height; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.append(klepa.cloneNode());
        cell.setAttribute("id", i);

        cell.addEventListener("click", function () {
            if (isFirstClick) {
                generateBombs(width, height, mines, i);
                isFirstClick = false;
            }
            openCell(i);
        });

        addFlagging(cell, i);
        saper.append(cell);
    }

    showLeaderboard();
}


function generateBombs(width, height, mines, clickedId) {
    bombs = [];
    // zamiast wczesniej obiektu set na pola
    const safeCells = new Set([clickedId, ...getNeighbors(clickedId, width, height)]);

    //wr
    while (bombs.length < mines) {
        let randomId = Math.floor(Math.random() * (width * height));
        if (!bombs.includes(randomId) && !safeCells.has(randomId)) {
            bombs.push(randomId);
            board[randomId].isBomb = true;
        }
    }

    for (let i = 0; i < board.length; i++) {
        if (!board[i].isBomb) {
            const neighbors = getNeighbors(i, width, height);
            board[i].adjacentBombs = neighbors.reduce(
                (count, neighbor) => count + (board[neighbor].isBomb ? 1 : 0),
                0
            );
        }
    }
}

// szukanei sasiadow
function getNeighbors(id, width, height) {
    const neighbors = [];
    // 
    const row = Math.floor(id / width);
    const col = id % width;

    // Iteracja przez sąsiednie komórki w pionie i poziomie
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            if (r === 0 && c === 0) continue; // pomijanie wlasnej komorki
            const neighborRow = row + r;
            const neighborCol = col + c;
            // Sąsiad musi być w granicach wierszy i klumn
            if (neighborRow >= 0 && neighborRow < height && neighborCol >= 0 && neighborCol < width) {

                neighbors.push(neighborRow * width + neighborCol);
            }
        }
    }
    return neighbors;
}

function openCell(id) {
    const cell = document.querySelector(`[id='${id}']`);
    // Pobierz dane komórki z boardas
    const cellData = board[id];

    if (cellData.isOpen || cell.classList.contains("flagged")) return;

    cellData.isOpen = true;
    safeCellsUncovered++;

    if (cellData.isBomb) {
        cell.innerHTML = "";
        cell.append(bombImg.cloneNode());
        revealAllBombs();
        displayEndScreen("Przegrales xd");
        return;
    }

    cell.classList.add("safe");

    if (cellData.adjacentBombs > 0) {
        // Wyświetl liczbbomb sasiadujacych
        cell.innerHTML = cellData.adjacentBombs;
    } else {
        cell.innerHTML = "";
        // Pobranie sasiadow 
        const neighbors = getNeighbors(id, parseInt(input1.value), parseInt(input2.value));
        // Dla każdej sąsiedniej rekurencyjnie otwórz
        neighbors.forEach(neighborId => openCell(neighborId));
    }

    checkWinCondition();
}

function addFlagging(cell, id) {
    cell.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        if (!board[id].isOpen) {
            if (cell.classList.contains("flagged")) {
                cell.classList.remove("flagged");
                cell.classList.add("question");
                cell.innerHTML = "";
                cell.append(questionImg.cloneNode());
                mines++;
            } else if (cell.classList.contains("question")) {
                cell.classList.remove("question");
                cell.innerHTML = "";
                cell.append(klepa.cloneNode());
            } else {
                cell.classList.add("flagged");
                cell.innerHTML = "";
                cell.append(flagImg.cloneNode());
                mines--;
            }
            leftmines.innerHTML = `Miny: ${mines}`;
        }
        checkWinCondition();
    });
}

function revealAllBombs() {
    clearInterval(timerInterval);
    board.forEach((cellData, index) => {
        if (cellData.isBomb) {
            const cell = document.querySelector(`[id='${index}']`);
            cell.classList.add("bomb");
            cell.innerHTML = "💣"; //rmoji bomby bo byl problem z grafiami
        }
    });
}

let timerInterval;
let startTime;

function stopWatch() {
    // stoper
    startTime = new Date().getTime();
    timerInterval = setInterval(updateStopwatch, 1000);
}

function updateStopwatch() {
    // update stopera w czasie
    const currentTime = new Date().getTime();
    elapsedTime = currentTime - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    document.getElementById("times").innerHTML = "Czas gry [s] " + seconds;
}



function checkWinCondition() {
    if (safeCellsUncovered === totalSafeCells && correctlyFlaggedBombs === mines) {
        displayEndScreen("Wygrales brawo lol");
    }
}

function displayEndScreen(message) {
    clearInterval(timerInterval);

    // Usuń istniejący ekran końcow
    const existingEndScreen = document.querySelector(".lose");
    if (existingEndScreen) {
        existingEndScreen.remove();
    }

    let endScreen = document.createElement("div");
    endScreen.classList.add("lose");

    let txt = document.createElement("p");
    txt.classList.add("wintxt");
    txt.append(message);

    let tim = document.createElement("p");
    tim.classList.add("timtxt");
    tim.append("Czas gry: ", (elapsedTime / 1000).toFixed(2), " s");

    let nameInput = document.createElement("input");
    nameInput.classList.add("nameInput");
    nameInput.placeholder = "Podaj nick";

    let contbut = document.createElement("button");
    contbut.classList.add("continue");
    contbut.append("Kontynuuj");

    document.body.appendChild(endScreen);
    endScreen.append(txt, tim);

    if (!(message === "Przegrales xd")) {
        endScreen.append(nameInput);

        let saveButton = document.createElement("button");
        saveButton.textContent = "Zapisz wynik";
        saveButton.classList.add("continue");
        let scoreSaved = false;


        saveButton.addEventListener("click", () => {
            if (scoreSaved) {
                alert("Wynik został już zapisany!");
                return;
            }

            const score = {
                name: nameInput.value.trim(), // bez whitespaceow
                time: (elapsedTime / 1000).toFixed(2), // integer na stringa 2 miejscapo prz
            };

            saveScoreToCookies(score);
            showHighScores();

            scoreSaved = true;

            saveButton.disabled = true;

        });


        endScreen.append(saveButton);
    }

    endScreen.append(contbut);

    contbut.addEventListener("click", () => {
        resetGame();
    });
}

let modeKey;

function setModeKey(width, height, mines) {
    // zapisywanie w stringu trybu gry
    modeKey = `scores_${width}x${height}_${mines}`;
}


function resetGame() {
    // ekr koncowy tez do usuniecia bo sie psuje
    const endScreen = document.querySelector(".lose");
    if (endScreen) {
        endScreen.remove();
    }

    document.body.innerHTML = "";
    container.innerHTML = "";
    bombs = [];
    safeCellsUncovered = 0;
    correctlyFlaggedBombs = 0;
    isFirstClick = true;

    baseForm();
}



function saveScoreToCookies(score) {
    // pobranie aktualnego score i wrzucenie do niego nowego z endscreena
    let scores = getScoresFromCookies(modeKey);

    scores.push(score);
    scores.sort((a, b) => parseFloat(a.time) - parseFloat(b.time)); // Sortuj wyniki po czasie
    if (scores.length > 10) scores = scores.slice(0, 10); // Tylko top 10
    // kraftowanie cookiegas 
    document.cookie = `${modeKey}=${JSON.stringify(scores)}; path=/`; //cala strona bez secure
}

function getScoresFromCookies() {
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${modeKey}=`));
    //slicowanie cookiesow i sprawdzanie trybow gry
    if (cookieValue) {
        return JSON.parse(cookieValue.split("=")[1]);
    }
    return [];
}

// tablica top 10 
function showHighScores() {
    let highScores = getScoresFromCookies();

    let scoreBoard = document.createElement("div");
    scoreBoard.classList.add("lose");
    // generowanie tablicy wynikow 
    let title = document.createElement("h3");
    // szukanie i replacowanie z regexem podkreslem
    title.textContent = `Top 10 tryhardow (${modeKey.replace("scores_", "").replace(/_/g, ", ")})`;

    scoreBoard.append(title);

    highScores.forEach((score, index) => {
        let scoreEntry = document.createElement("p");
        scoreEntry.textContent = `${index + 1}. ${score.name} - ${score.time} s`;
        scoreBoard.append(scoreEntry);
    });

    let closeButton = document.createElement("button");
    closeButton.textContent = "Zamknij";
    closeButton.classList.add("continue");

    closeButton.addEventListener("click", () => {
        scoreBoard.remove();
    });

    scoreBoard.append(closeButton);
    document.body.appendChild(scoreBoard);
}





function showLeaderboard() {
    let highScores = getScoresFromCookies();

    let leaderboard = document.createElement("div");
    leaderboard.classList.add("leaderboard");

    let title = document.createElement("h3");
    title.textContent = "top 10 tryhardow";
    leaderboard.append(title);

    highScores.forEach((score, index) => {
        let scoreEntry = document.createElement("p");
        scoreEntry.textContent = `${index + 1}. ${score.name} - ${score.time} s`;
        leaderboard.append(scoreEntry);
    });

    document.body.appendChild(leaderboard);
}

