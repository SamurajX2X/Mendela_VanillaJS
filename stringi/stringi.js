/* let zdanie = prompt("Podaj jakies zdanie :)))");


function filterSamogloski(str) {
    // Globalny search w tekstu tych samoglosek brrr

    // const samogloski = /aąeęiouyAĄEĘIOUY/g;
    let output = str.replace(/[aąeęiouyAĄEĘIOUY]/g, (match) => {
        console.log(match);
        return match.fontcolor("red");

    });
    return output
}
console.log(filterSamogloski(zdanie))


// let p = document.createElement("p");

// p.append(filterSamogloski(zdanie));


document.body.innerHTML = filterSamogloski(zdanie)

*/

//*************************************************** 


// tablica od usera
/*
let array = eval(prompt("Podaj poprawny array np. [1,2,5]", "[1,2,3,4,5,6,7,8]"));
if (!Array.isArray(array)) {
    alert("zla tablica :(");
}

while (true) {
    let mv = prompt("Jakie przesuniecie wariacie (p - prawo l - lewo)q - koniec").toLowerCase();

    if (mv === 'q') {
        console.log("bajo");
        break;
    }

    // gdzie ma byc pierwsze
    let where = mv[0];
    let howmany = parseInt(mv.slice(1), 10);
    if (isNaN(howmany)) {
        alert("to ma byc liczba btw");
        continue;
    }

    if (where === "l") {
        moveLeft(array, howmany);
        console.log(`przesuniecie ${howmany} w lewo \n`, array);
    }
    else if (where === "p") {
        moveRight(array, howmany);
        console.log(`przesuniecie ${howmany} w prawo \n`, array);
    }
}
function moveLeft(arr, count) {
    for (let i = 0; i < count; i++) {
        arr.push(arr.shift());
    }
}


function moveRight(arr, count) {
    for (let i = 0; i < count; i++) {
        arr.unshift(arr.pop());
    }
}
*/
// *******************************************

/*
let d1 = document.createElement('div');
d1.setAttribute("id", "d1");
document.body.appendChild(d1);

let text = prompt("podaj tekst");

let word = prompt("podaj szukane slowo").toLowerCase();


let find = text.split(word).join(`<u>${word}</u>`);

document.getElementById("d1").innerHTML = find;
*/

// *******************************************

// let d1 = document.createElement('div');
// d1.setAttribute("id", "d1");
// document.body.appendChild(d1);

// let text = prompt("Podaj tekst");



// // Usunięcie interpunkcji
// text = text.replace(/[.,i]/g, "");



// // Rozdzielenie tekstu
// let words = text.split(" ").map(word => word.toLowerCase());

// // Zliczanie ile slow
// // dodaj 1 do counta ew daj wartosc 1

// let wordCount = {};
// words.forEach(word => {
//     wordCount[word] = (wordCount[word] || 0) + 1;
// });


// let sortedWords = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);

// let result = "";
// let palette = ["red", "blue", "green", "orange", "yellow"];


// sortedWords.forEach((word, n) => {
//     let color = palette[Math.floor(n / 5) % palette.length];
//     result += `<span style="color:${color}">${word[0]} - ${word[1]}</span><br>`;
// });

// document.getElementById("d1").innerHTML = result;





const Game = {
    state: {
        board: [],
        emptyTile: { row: 0, col: 0 },
        size: 3,
        moves: 0,
        startTime: null,
        timerInterval: null,
        leaderboards: {
            "3": [],
            "4": [],
            "5": [],
            "6": []
        },
        endTime: null,
    },

    init() {

        this.loadLeaderboards();
        this.setupEventListeners();
    },

    cropImage(gridSize) {
        const container = document.getElementById('puzzle-container');
        const imageSize = 300; // Rozmiar obrazu
        const tileSize = imageSize / gridSize;

        container.innerHTML = ''; // Wyczyść kontener
        container.style.width = `${imageSize}px`;
        container.style.height = `${imageSize}px`;
        container.style.display = 'grid';
        container.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
        container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

        const tiles = [];
        let emptyRow = Math.floor(Math.random() * gridSize);
        let emptyCol = Math.floor(Math.random() * gridSize);

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.style.width = `${tileSize}px`;
                tile.style.height = `${tileSize}px`;
                tile.style.left = `${col * tileSize}px`;
                tile.style.top = `${row * tileSize}px`;
                tile.dataset.i = row;
                tile.dataset.j = col;

                if (row === emptyRow && col === emptyCol) {
                    // Pusty kafelek
                    tile.dataset.number = "0";
                    tile.classList.add('empty-tile');
                    this.state.emptyTile = { row, col }; // Zapisz losową pozycję pustego kafelka
                } else {
                    const xOffset = col * tileSize;
                    const yOffset = row * tileSize;
                    tile.style.backgroundPosition = `-${xOffset}px -${yOffset}px`;
                    tile.style.backgroundSize = `${imageSize}px ${imageSize}px`;
                    tile.dataset.number = `${row * gridSize + col + 1}`;
                    tiles.push(tile);
                }
            }
        }

        // Losowe ustawienie kafelków
        this.shuffleArray(tiles);

        // Dodawanie kafelków do kontenera
        tiles.forEach(tile => {
            tile.addEventListener('click', () => this.slide(tile)); // Dodaj event do kafelków
            container.appendChild(tile);
        });

        // Dodaj pusty kafelek
        const emptyTile = document.createElement('div');
        emptyTile.classList.add('empty-tile');
        emptyTile.style.width = `${tileSize}px`;
        emptyTile.style.height = `${tileSize}px`;
        emptyTile.style.left = `${emptyCol * tileSize}px`;
        emptyTile.style.top = `${emptyRow * tileSize}px`;
        emptyTile.dataset.i = emptyRow;
        emptyTile.dataset.j = emptyCol;
        emptyTile.dataset.number = "0";
        container.appendChild(emptyTile);
    },

    slide(tile) {
        const emptyTile = document.querySelector('[data-number="0"]');
        const clickedI = parseInt(tile.dataset.i);
        const clickedJ = parseInt(tile.dataset.j);
        const emptyI = parseInt(emptyTile.dataset.i);
        const emptyJ = parseInt(emptyTile.dataset.j);

        // Obliczenie różnic w pozycjach
        const dy = Math.abs(emptyI - clickedI);
        const dx = Math.abs(emptyJ - clickedJ);

        // Sprawdzenie, czy kliknięty kafelek jest sąsiadem pustego miejsca
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
            // Zamiana stylów pozycji
            const tempLeft = emptyTile.style.left;
            const tempTop = emptyTile.style.top;
            emptyTile.style.left = tile.style.left;
            emptyTile.style.top = tile.style.top;
            tile.style.left = tempLeft;
            tile.style.top = tempTop;

            // Zamiana datasetów pozycji
            const tempI = tile.dataset.i;
            const tempJ = tile.dataset.j;
            tile.dataset.i = emptyTile.dataset.i;
            tile.dataset.j = emptyTile.dataset.j;
            emptyTile.dataset.i = tempI;
            emptyTile.dataset.j = tempJ;

            // Aktualizuj stan pustego pola
            this.state.emptyTile = { row: parseInt(emptyTile.dataset.i), col: parseInt(emptyTile.dataset.j) };

            // Sprawdzenie warunku zwycięstwa
            this.checkWin();
        }
    },

    checkWin() {
        const tiles = document.querySelectorAll('.tile');
        let correct = 1;

        for (let tile of tiles) {
            const number = parseInt(tile.dataset.number);
            if (number !== 0 && number !== correct) return; // Jeśli którykolwiek kafelek jest nie na miejscu
            correct++;
        }

        // Jeśli wszystkie kafelki są na miejscu
        alert("Gratulacje! Wygrana!");
    },

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },

    setupEventListeners() {
        document.querySelectorAll("nav button").forEach((button) => {
            button.addEventListener("click", () => {
                const size = parseInt(button.textContent[0]);
                this.startGame(size);
            });
        });
    },

    startGame(size) {
        this.state.size = size;
        this.state.moves = 0;
        this.state.startTime = null;
        this.state.endTime = null;
        clearInterval(this.state.timerInterval);
        this.state.startTime = Date.now();

        this.cropImage(size);
    },

    loadLeaderboards() {
        const saved = localStorage.getItem("leaderboards");
        if (saved) this.state.leaderboards = JSON.parse(saved);
    },

    saveLeaderboards() {
        localStorage.setItem("leaderboards", JSON.stringify(this.state.leaderboards));
    }
};

document.addEventListener("DOMContentLoaded", () => Game.init());
