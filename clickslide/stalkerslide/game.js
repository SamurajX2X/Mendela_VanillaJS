const Game = {
    imageSize: 500,
    state: {
        board: [],
        emptyTile: { row: 0, col: 0 },
        size: 3,
        moves: 0,
        startTime: null,
        timerInterval: null,
        // jednak same stany grey bez leaderboarda
        // leaderboards: {
        //     "3": [],
        //     "4": [],
        //     "5": [],
        //     "6": []
        // },
        endTime: null,
    },

    init() {
        EventManager.setupGameButtons();
    },

    // startGame(size) {
    //     this.state.size = size;
    //     this.state.moves = 0;
    //     this.state.startTime = Date.now();
    //     this.state.endTime = null;
    //     clearInterval(this.state.timerInterval);
    //     Board.generate(size);
    //     Timer.timer();
    // },

    startGame(size) {
        this.state.size = size;
        this.state.moves = 0;
        this.state.endTime = null;

        clearInterval(this.state.timerInterval);
        this.state.startTime = Date.now();
        this.state.timerInterval = null

        Board.generate(size); // Generowanie planszy




        // usuwam poprzedni obrazek zastepuje plansza puzzle
        const imageContainer = document.getElementById('image-container');
        imageContainer.style.display = 'none';
        const puzzleContainer = document.getElementById('puzzle-container');
        puzzleContainer.classList.add('visible');

        // innicjalizacja gry (jeszcze do zrefaktoryzowania)
        const { tiles, emptyTile } = TileManager.createTiles(size);
        this.state.tiles = tiles;
        this.state.emptyTile = emptyTile;

        const emptyTileElement = tiles.find(tile => tile.classList.contains("empty-tile"));

        TileManager.shuffleTiles(tiles, emptyTileElement); // widoczne tasowanie


    },


    slide(tile) {
        const emptyTile = Board.getEmptyTileElement();
        if (TileManager.getNeighbor(tile, emptyTile)) {
            TileManager.swap(tile, emptyTile);
            this.state.emptyTile = TileManager.updateEmptyTileState(emptyTile);
            // if (WinCondition.check()) {
            //     alert("Gratulacje! Wygrana!");

            // }
        }
    }
};

const Board = {
    // debugging dodatkowego ROW z pustymi tiles
    // initializeFlag: false,

    generate(size) {

        if (this.initializeFlag) return;

        const container = document.getElementById('puzzle-container');
        container.innerHTML = '';

        //dodanie grida
        container.style.gridTemplateRows = `repeat(${size}, 1fr)`;
        container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;


        const { tiles, emptyTile } = TileManager.createTiles(size);
        Game.state.emptyTile = emptyTile;

        tiles.forEach(tile => {
            container.appendChild(tile)
            // tile.addEventListener('click', () => TileManager.swap(tile, size));
        });
        container.appendChild(TileManager.createEmptyTile(emptyTile));
        // this.initializeFlag = true;
    },

    getEmptyTileElement() {
        return document.querySelector('.empty-tile');
    }
};

const TileManager = {
    createTiles(size) {
        // initializeFlag: false,

        const tiles = [];
        const tileSize = Game.imageSize / size;
        const emptyRow = size - 1;
        const emptyCol = size - 1;
        // const imageSize = 500;



        // const emptyRow = Math.floor(Math.random() * size);
        // const emptyCol = Math.floor(Math.random() * size);
        // let emptyRow = `${300 / Game.state.size}px`;
        // let emptyCol = `${300 / Game.state.size}px`;


        // console.log(emptyRow);
        // console.log(emptyCol);
        let emptyTile = { row: emptyRow, col: emptyCol };


        // 2 fory na kolumny i wiersze
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (row === emptyRow && col === emptyCol) {
                    const empty = this.createEmptyTile(emptyTile);
                    tiles.push(empty);
                } else {
                    const tile = this.createTile(row, col, tileSize, size, Game.imageSize);
                    tiles.push(tile);
                }
            }
        }

        //  poprawione tasowanie
        this.shuffleTiles(tiles, tiles.find(tile => tile.classList.contains('empty-tile')));

        // this.shuffleTiles(tiles);
        // this.initializeFlag = true;
        return { tiles, emptyTile };
    },


    createTile(row, col, tileSize, size, imageSize) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;
        tile.style.backgroundPosition = `-${col * tileSize}px -${row * tileSize}px`;
        tile.style.backgroundSize = `${imageSize}px ${imageSize}px`;
        tile.dataset.i = row;
        tile.dataset.j = col;
        tile.dataset.number = `${row * size + col + 1}`;

        tile.style.gridRow = row + 1;
        tile.style.gridColumn = col + 1;



        tile.addEventListener('click', () => {
            Game.slide(tile)
            if (WinCondition.check()) {
                alert("brawo wygrales")
            }
        });

        return tile;
    },

    createEmptyTile(emptyTile) {
        const tile = document.createElement('div');
        tile.classList.add('empty-tile');
        // tile.style.width = `${300 / Game.state.size}px`;
        // tile.style.height = `${300 / Game.state.size}px`;


        tile.dataset.i = emptyTile.row;
        tile.dataset.j = emptyTile.col;
        tile.dataset.number = "0";

        return tile;
    },


    //stary shuffel niedzialaaacy: ((((((
    // shuffleTiles(tiles) {
    //     //fisher yates algorytm z neta
    //     for (let i = tiles.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));

    //         // Zamiana kafelków w gridzie
    //         const tempRow = tiles[i].style.gridRow;
    //         const tempCol = tiles[i].style.gridColumn;

    //         tiles[i].style.gridRow = tiles[j].style.gridRow;
    //         tiles[i].style.gridColumn = tiles[j].style.gridColumn;

    //         tiles[j].style.gridRow = tempRow;
    //         tiles[j].style.gridColumn = tempCol;

    //         // Zamiana danych w dataset
    //         [tiles[i].dataset.i, tiles[j].dataset.i] = [tiles[j].dataset.i, tiles[i].dataset.i];
    //         [tiles[i].dataset.j, tiles[j].dataset.j] = [tiles[j].dataset.j, tiles[i].dataset.j];
    //     }
    //     console.log("tilesy wyszuflowane");

    // },updateEmpty
    shuffleTiles(tiles, emptyTileElement) {
        const size = Math.sqrt(tiles.length); // Rozmiar planszy
        let emptyTileState = this.updateEmptyTileState(emptyTileElement); // Stan pustego 
        let moves = 0;

        const performMove = () => {
            if (moves >= 100) {
                clearInterval(Game.state.timerInterval); // stop poprzedniego timera debug
                Game.state.startTime = Date.now(); // Ustawienie czasu pocz
                // start timera
                Timer.timeInterval();
                return; // 100 ruchow
            }

            // Znajdź sąsiadów 
            const neighbors = this.getNeighbors(emptyTileState, size);
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

            const neighborTile = tiles.find(
                tile =>
                    parseInt(tile.dataset.i) === randomNeighbor.row &&
                    parseInt(tile.dataset.j) === randomNeighbor.col
            );

            if (neighborTile) {
                // zamiast wczesniejszego algorytmu po prostu zamiania sasiadow
                this.swap(neighborTile, emptyTileElement);
                emptyTileState = this.updateEmptyTileState(emptyTileElement); //  update stan pustego 
            }

            moves++;
            setTimeout(performMove, 20); // kazdy ruch co 20ms
        };

        performMove(); //  tasowanie


    },



    getNeighbors(emptyTileState, size) {
        const { row, col } = emptyTileState;
        const neighbors = [];

        // Dodaj sąsiadów, jeśli znajdują się w granicach planszy
        if (row > 0) neighbors.push({ row: row - 1, col }); // Sąsiad powyżej
        if (row < size - 1) neighbors.push({ row: row + 1, col }); // Sąsiad poniżej
        if (col > 0) neighbors.push({ row, col: col - 1 }); // Sąsiad po lewej
        if (col < size - 1) neighbors.push({ row, col: col + 1 }); // Sąsiad po prawej

        return neighbors;
    },


    getNeighbor(tile, emptyTile) {
        const tileRow = parseInt(tile.dataset.i);
        const tileCol = parseInt(tile.dataset.j);

        const emptyRow = parseInt(emptyTile.dataset.i);
        const emptyCol = parseInt(emptyTile.dataset.j);


        return (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
            (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow);
    },

    swap(tile, emptyTileElement) {

        // Zamień pozycje w siatce (grid-row, grid-column)
        [tile.style.gridRow, emptyTileElement.style.gridRow] = [emptyTileElement.style.gridRow, tile.style.gridRow];
        [tile.style.gridColumn, emptyTileElement.style.gridColumn] = [emptyTileElement.style.gridColumn, tile.style.gridColumn];

        // Swap the data attributes (i, j) to update the logical positions
        [tile.dataset.i, emptyTileElement.dataset.i] = [emptyTileElement.dataset.i, tile.dataset.i];
        [tile.dataset.j, emptyTileElement.dataset.j] = [emptyTileElement.dataset.j, tile.dataset.j];
    },


    updateEmptyTileState(emptyTile) {
        return {
            row: parseInt(emptyTile.dataset.i),
            col: parseInt(emptyTile.dataset.j)
        };
    }
};

const WinCondition = {
    check() {
        const tiles = document.querySelectorAll('.tile');
        let correct = 1;

        // Przechodzimy przez wszystkie kafelki (z wyjątkiem pustego)
        for (let tile of tiles) {
            const number = parseInt(tile.dataset.number);

            // Sprawdzamy, czy kafelek ma poprawny numer (pomijając pusty kafelek, który powinien być na końcu)
            if (number !== 0 && number !== correct) {
                return false; // Jeśli jakikolwiek kafelek jest nie na swoim miejscu, zwracamy false
            }
            correct++; // Przechodzimy do następnego numeru
        }

        return true; // Jeśli wszystkie kafelki są na swoich miejscach
    }
};



const EventManager = {
    setupGameButtons() {
        document.querySelectorAll("nav button").forEach(button => {
            button.addEventListener("click", () => {
                const size = parseInt(button.textContent[0]);
                Game.startGame(size);
            });
        });
    }
};

const Timer = {
    timeInterval() {
        // interwal kazda milisec aby nie wracal danych z opoznieniem
        this.myInterval = setInterval(() => {
            this.updateTime();
        }, 1);
    },


    updateTime() {
        const now = Date.now(); // start czasu
        const timePassed = now - Game.state.startTime; // elapsed czasu
        Game.state.time = timePassed;

        // formatowanie czasu
        const hours = Math.floor(timePassed / 3600000);
        const minutes = Math.floor((timePassed % 3600000) / 60000);
        const seconds = Math.floor((timePassed % 60000) / 1000);
        const milliseconds = timePassed % 1000;

        this.refreshClock(hours, minutes, seconds, milliseconds); // Odswiezanie digituw
    },

    refreshClock: function (hours, minutes, seconds, milliseconds) {
        // format liczb na odpowiednia liczbe zer, aby nie zwracaly ew. undefined
        const hr = ("00" + hours).slice(-2);
        const min = ("00" + minutes).slice(-2);
        const s = ("00" + seconds).slice(-2);
        const ms = ("000" + milliseconds).slice(-3);


        // jest wiecej niz raz wiec trzeba zrobic foreacha 
        let colon = document.querySelectorAll('.colon');
        colon.forEach(function (element) {
            element.style.backgroundImage = `url(cyferki/colon.gif)`;
        });

        let dot = document.querySelector('.dot');
        dot.style.backgroundImage = `url(cyferki/dot.gif)`;

        let h1 = document.querySelector('.digit-h1');
        h1.style.backgroundImage = `url(cyferki/c${hr[0]}.gif)`;

        let h2 = document.querySelector('.digit-h2');
        h2.style.backgroundImage = `url(cyferki/c${hr[1]}.gif)`;

        let m1 = document.querySelector('.digit-m1');
        m1.style.backgroundImage = `url(cyferki/c${min[0]}.gif)`;

        let m2 = document.querySelector('.digit-m2');
        m2.style.backgroundImage = `url(cyferki/c${min[1]}.gif)`;

        let s1 = document.querySelector('.digit-s1');
        s1.style.backgroundImage = `url(cyferki/c${s[0]}.gif)`;

        let s2 = document.querySelector('.digit-s2');
        s2.style.backgroundImage = `url(cyferki/c${s[1]}.gif)`;

        let ms1 = document.querySelector('.digit-ms1');
        ms1.style.backgroundImage = `url(cyferki/c${ms[0]}.gif)`;

        let ms2 = document.querySelector('.digit-ms2');
        ms2.style.backgroundImage = `url(cyferki/c${ms[1]}.gif)`;

        let ms3 = document.querySelector('.digit-ms3');
        ms3.style.backgroundImage = `url(cyferki/c${ms[2]}.gif)`;





    },
}

document.addEventListener("DOMContentLoaded", () => Game.init());
