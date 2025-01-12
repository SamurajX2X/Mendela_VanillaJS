//! Komendy pokazują częściowo błędy z którymi się napotksłem
//zmienne globalne
let globalVariables = {
  isSolved: false,
  mainArray: [],
  shuffleAmount: 50,
  shuffleInterval: null,
  startTime: null,
  time: 0,
  leaderboards: {
    "3": [],
    "4": [],
    "5": [],
    "6": []
  },
  mode: ""
};

let game = {
  //? Zdefiniowanie interwału do liczednia czasu
  myInterval: null,
  //? Generowanie elemntów i nadanie styli
  generate: (n) => {
    // Zakonczenie interwału timera
    if (game.myInterval) {
      clearInterval(game.myInterval);
      game.myInterval = null;
    }
    // Wczytanie rankingu z cookie
    const value = document.cookie;
    const parts = value.split("leaderboards=").pop().split(";").shift();
    if (parts)
      globalVariables.leaderboards = JSON.parse(parts);
    globalVariables.mode = `${n}`;
    globalVariables.mainArray.length = 0;
    let number = 0;
    const percentSize = (1 / n) * 100;
    const pf = document.getElementById("pf");
    pf.innerHTML = "";
    for (let j = 0; j < n; j++) {
      globalVariables.mainArray[j] = [];
      for (let i = 0; i < n; i++) {
        if (j != 0 || i != 0) {
          globalVariables.mainArray[j][i] = number;
          let el = document.createElement("div");
          el.classList.add("field");
          el.setAttribute("data-j", j);
          el.setAttribute("data-i", i);
          el.setAttribute("data-number", number);
          el.setAttribute(
            "style",
            `height: ${percentSize}%; width: ${percentSize}%; left: ${(n - i - 1) * percentSize
            }%; top: ${(n - j - 1) * percentSize}% ;
            background-size: 500px;
            background-position-x: -${(n - i - 1) * (500 / n)}px;
            background-position-y: -${(n - j - 1) * (500 / n)}px
            `
          );
          pf.appendChild(el);
          el.addEventListener("click", () => game.slide(el));
        } else {
          globalVariables.mainArray[j][i] = number;
          let el = document.createElement("div");
          el.classList.add("emptyField");
          el.setAttribute("data-j", "0");
          el.setAttribute("data-i", "0");
          el.setAttribute("data-number", "0");
          el.setAttribute(
            "style",
            `height: ${percentSize}%; width: ${percentSize}%; left: ${(n - i - 1) * percentSize
            }%; top: ${(n - j - 1) * percentSize}% ;
            `
          );
          pf.appendChild(el);
        }
        number++;
      }
    }
    // Na pamiątke [*]

    // document.querySelectorAll(".field").forEach((el, nr) => {
    // line = Math.round(((nr/n)-Math.floor(nr/n))*n)
    // el.setAttribute("style", `height: ${percentSize}%; width: ${percentSize}%; left: ${line*percentSize}%`)

    // });
    game.updateBg();
    globalVariables.shuffleAmount = 40;
    game.shuffleStart();
    game.leaderboardDisplay();
  },
  //? Funckja rozpoczynająca zamienie się elementów
  slide: function (x) {
    const empty = document.querySelector('[data-number="0"]');
    const clickedI = x.dataset.i;
    const clickedJ = x.dataset.j;
    const dy = Math.abs(empty.dataset.i - clickedI);
    const dx = Math.abs(empty.dataset.j - clickedJ);
    if (dx > 1 || dy > 1 || dx == dy) return false;

    //? zamiana styli
    const tempLeft = empty.style.left;
    const tempTop = empty.style.top;
    empty.style.left = x.style.left;
    x.style.left = tempLeft;
    empty.style.top = x.style.top;
    x.style.top = tempTop;
    x.style.top = tempTop;

    //? zmiana datasetu
    const tempI = x.dataset.i;
    const tempJ = x.dataset.j;
    x.dataset.i = empty.dataset.i;
    empty.dataset.i = tempI;
    x.dataset.j = empty.dataset.j;
    empty.dataset.j = tempJ;
    game.checkWin();
  },

  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  //           MIESZANIE I PRZESUWANIE
  shuffle: function () {
    const empty = document.querySelector('[data-number="0"]');
    const possibleMoves = [];


    //? Sprawdzenie, które ruchy są dozwolone
    const moves = [
      { i: 1, j: 0 },
      { i: -1, j: 0 },
      { i: 0, j: 1 },
      { i: 0, j: -1 },
    ];

    moves.forEach((move) => {
      const newI = Number(empty.dataset.i) + move.i;
      const newJ = Number(empty.dataset.j) + move.j;

      if (
        newI >= 0 &&
        newI < globalVariables.mainArray.length &&
        newJ >= 0 &&
        newJ < globalVariables.mainArray.length
      ) {
        possibleMoves.push({ i: newI, j: newJ });
      }
    });

    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    const x = document.querySelector(
      `[data-j="${randomMove.j}"][data-i="${randomMove.i}"]`
    );

    //? Zamiana styli
    const tempLeft = empty.style.left;
    const tempTop = empty.style.top;
    empty.style.left = x.style.left;
    x.style.left = tempLeft;
    empty.style.top = x.style.top;
    x.style.top = tempTop;

    //? Zamiana datasetu
    const tempI = x.dataset.i;
    const tempJ = x.dataset.j;
    x.dataset.i = empty.dataset.i;
    empty.dataset.i = tempI;
    x.dataset.j = empty.dataset.j;
    empty.dataset.j = tempJ;
    globalVariables.shuffleAmount--;
    if (globalVariables.shuffleAmount == 0) {
      globalVariables.startTime = Date.now();
      game.time();
      window.clearInterval(globalVariables.shuffleInterval);
    }
  },


  shuffleStart: function (z) {
    if (globalVariables.shuffleInterval) {
      clearInterval(globalVariables.shuffleInterval);
    }
    globalVariables.shuffleInterval = setInterval(() => {
      game.shuffle();
    }, 50);
  },


  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  //              Sprawdzanie wygranej
  checkWin: function () {
    const n = globalVariables.mainArray.length;

    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const element = document.querySelector(
          `[data-i="${i}"][data-j="${j}"]`
        );
        const elementNumber = parseInt(element.getAttribute("data-number"));

        if (elementNumber !== globalVariables.mainArray[j][i]) {
          return false;
        }
      }
    }
    globalVariables.isSolved = true;
    game.winAlert();
    clearInterval(game.myInterval);
    game.myInterval = null;
    game.addToLeaderboard();
    return true;
  },

  winAlert: function () {
    const winPopup = document.querySelector('.winalert');
    const winTime = document.querySelector('.wintime');
    const h = Math.floor(globalVariables.time / 3600000);
    const m = Math.floor((globalVariables.time % 3600000) / 60000);
    const s = Math.floor((globalVariables.time % 60000) / 1000);
    const ms = globalVariables.time % 1000;
    winTime.innerText = `${h}h ${m}m ${s}s ${ms}ms`;
    winPopup.setAttribute('style', 'display:flex;');
  },

  closeWinAlert: function () {
    const winPopup = document.querySelector('.winalert');
    winPopup.setAttribute('style', 'display:none;');
  },

  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  //              TIMER
  time: function () {
    this.myInterval = setInterval(game.timer, 1);
  },

  timer: function () {
    const currentTime = Date.now();
    const elapsedTime = currentTime - globalVariables.startTime;
    globalVariables.time = elapsedTime;
    const h = Math.floor(elapsedTime / 3600000);
    const m = Math.floor((elapsedTime % 3600000) / 60000);
    const s = Math.floor((elapsedTime % 60000) / 1000);
    const ms = elapsedTime % 1000;
    game.updateClock(h, m, s, ms);
  },

  updateClock: function (hours, minutes, seconds, milliseconds) {
    //? Zformatowanie lcizby
    // muszą być zera bo inczaczej undefined
    let h = ("00" + hours).slice(-2);
    let m = ("00" + minutes).slice(-2);
    let s = ("00" + seconds).slice(-2);
    let ms = ("000" + milliseconds).slice(-3);

    document.querySelector('.h1').setAttribute('style', `background-image: url(img/cyferki/c${h[0]}.gif)`);
    document.querySelector('.h2').setAttribute('style', `background-image: url(img/cyferki/c${h[1]}.gif)`);
    document.querySelector('.m1').setAttribute('style', `background-image: url(img/cyferki/c${m[0]}.gif)`);
    document.querySelector('.m2').setAttribute('style', `background-image: url(img/cyferki/c${m[1]}.gif)`);
    document.querySelector('.s1').setAttribute('style', `background-image: url(img/cyferki/c${s[0]}.gif)`);
    document.querySelector('.s2').setAttribute('style', `background-image: url(img/cyferki/c${s[1]}.gif)`);
    document.querySelector('.ms1').setAttribute('style', `background-image: url(img/cyferki/c${ms[0]}.gif)`);
    document.querySelector('.ms2').setAttribute('style', `background-image: url(img/cyferki/c${ms[1]}.gif)`);
    document.querySelector('.ms3').setAttribute('style', `background-image: url(img/cyferki/c${ms[2]}.gif)`);
  },
  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  //           Ranking
  addToLeaderboard: function () {
    document.querySelector('.leaderboard').innerHTML = "";
    globalVariables.leaderboards[globalVariables.mode].push(globalVariables.time);
    globalVariables.leaderboards[globalVariables.mode] = globalVariables.leaderboards[globalVariables.mode].filter((el) => el > 0);
    globalVariables.leaderboards[globalVariables.mode].sort((a, b) => a - b);
    while (globalVariables.leaderboards[globalVariables.mode].length < 10) {
      globalVariables.leaderboards[globalVariables.mode].push(0);
    }
    globalVariables.leaderboards[globalVariables.mode].length = 10;
    document.cookie = `leaderboards=${JSON.stringify(globalVariables.leaderboards)}; expires=Mon, 18 Dec 2023 12:00:00 UTC`;
    globalVariables.leaderboards[globalVariables.mode].forEach((el, nr) => {
      const h = Math.floor(el / 3600000);
      const m = Math.floor((el % 3600000) / 60000);
      const s = Math.floor((el % 60000) / 1000);
      const ms = el % 1000;
      const p = document.createElement('p');
      if (el == 0) {
        p.innerText = `Brak wyniku`;
        document.querySelector('.leaderboard').appendChild(p);
      } else {
        p.innerText = `${nr + 1}. ${h}h ${m}m ${s}s ${ms}ms`;
        document.querySelector('.leaderboard').appendChild(p);
      }
    });
  },

  leaderboardDisplay: function () {
    document.querySelector('.leaderboard').innerHTML = "";
    if (globalVariables.leaderboards[globalVariables.mode].length == 0) {
      const p = document.createElement('p');
      p.innerText = `Brak wyników`;
      document.querySelector('.leaderboard').appendChild(p);
    }
    globalVariables.leaderboards[globalVariables.mode].forEach((el, nr) => {
      const h = Math.floor(el / 3600000);
      const m = Math.floor((el % 3600000) / 60000);
      const s = Math.floor((el % 60000) / 1000);
      const ms = el % 1000;
      const p = document.createElement('p');
      if (el == 0) {
        p.innerText = `Brak wyniku`;
        document.querySelector('.leaderboard').appendChild(p);
      } else {
        p.innerText = `${nr + 1}. ${h}h ${m}m ${s}s ${ms}ms`;
        document.querySelector('.leaderboard').appendChild(p);
      }
    });
  },
  ////////////////////////////////////////
  ////////////////////////////////////////
  //          Slider

  slideRight: function () {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.cat');
    const slideWidth = slides[0].offsetWidth;
    document.querySelector('.right').disabled = true;
    setTimeout(game.buttonDisabled, 210);
    if (slider.scrollLeft == (slides.length - 2) * slideWidth) {
      slider.scrollLeft += slideWidth;
      setTimeout(game.lastToFirst, 200);
    } else {
      slider.setAttribute("style", "scroll-behavior: smooth");
      slider.scrollLeft += slideWidth;
    }
  },

  buttonDisabled: function () {
    document.querySelector('.right').disabled = false;
    document.querySelector('.left').disabled = false;
  },

  slideLeft: function () {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.cat');
    const slideWidth = slides[0].offsetWidth;
    document.querySelector('.left').disabled = true;
    setTimeout(game.buttonDisabled, 200);
    if (slider.scrollLeft == 0) {
      slider.setAttribute("style", "scroll-behavior: unset");
      slider.scrollLeft = (slides.length - 1) * slideWidth;
      setTimeout(game.firstToLast, 10);
    } else {
      slider.setAttribute("style", "scroll-behavior: smooth");
      slider.scrollLeft -= slideWidth;
    }
  },

  lastToFirst: function () {
    const slider = document.querySelector('.slider');
    slider.setAttribute("style", "scroll-behavior: unset");
    slider.scrollLeft = 0;
  },

  firstToLast: function () {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.cat');
    const slideWidth = slides[0].offsetWidth;
    slider.setAttribute("style", "scroll-behavior: smooth");
    slider.scrollLeft = (slides.length - 2) * slideWidth;
  },

  updateBg: function () {
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.cat');
    const currentImageIndex = slider.scrollLeft / slides[0].offsetWidth;
    document.querySelectorAll('.field').forEach(el => {
      el.style.backgroundImage = `url(img/cat${currentImageIndex + 1}.jpeg)`;
    });
  }
};









*/
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
    container.innerHTML = ''; // Usuń wszystkie poprzednie elementy

    const imageSize = 300; // Rozmiar obrazu

    // Ustawienia kontenera
    container.style.width = `${imageSize}px`;
    container.style.height = `${imageSize}px`;
    container.style.display = 'grid';
    container.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    // Tablica przechowująca indeksy kafelków
    const tiles = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (row === gridSize - 1 && col === gridSize - 1) {
          // Pomijamy prawy dolny róg
          continue;
        }

        const tile = document.createElement('div');
        tile.classList.add('tile');

        // Ustawianie pozycji fragmentu obrazu
        const xOffset = col * (imageSize / gridSize);
        const yOffset = row * (imageSize / gridSize);
        tile.style.backgroundPosition = `-${xOffset}px -${yOffset}px`;
        tile.style.backgroundSize = `${imageSize}px ${imageSize}px`;

        tiles.push(tile);
      }
    }

    // Losowe ustawienie kafelków
    this.shuffleArray(tiles);

    // Dodawanie kafelków do kontenera
    tiles.forEach(tile => container.appendChild(tile));

    // Dodanie pustego miejsca w prawym dolnym rogu
    const emptyTile = document.createElement('div');
    emptyTile.classList.add('empty-tile');
    container.appendChild(emptyTile);
  },

  // Funkcja do mieszania elementów tablicy
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

    this.state.startTime = Date.now();
    clearInterval(this.state.timerInterval);
    // this.generateBoard(size);
    // this.shuffleBoard();
    // this.renderBoard();
    // this.startTimer();
    this.cropImage(size);
  },

  // generateBoard(size) {
  //     const tiles = Array.from({ length: size * size - 1 }, (_, i) => i + 1); // Kafelki od 1 do n-1
  //     tiles.push(0); // Ostatni element to puste miejsce
  //     this.state.board = Array.from({ length: size }, (_, row) => {
  //         return tiles.slice(row * size, (row + 1) * size);
  //     });
  //     this.state.emptyTile = { row: size - 1, col: size - 1 }; // Prawy dolny róg 

  // },

  // shuffleBoard() {
  //     const moves = this.state.size ** 3;
  //     for (let i = 0; i < moves; i++) {
  //         this.makeRandomMove();
  //     }
  // },

  // makeRandomMove() {
  //     const { row, col } = this.state.emptyTile;
  //     const directions = [
  //         { row: -1, col: 0 },
  //         { row: 1, col: 0 },
  //         { row: 0, col: -1 },
  //         { row: 0, col: 1 },
  //     ];
  //     const validMoves = directions.filter(
  //         (dir) =>
  //             row + dir.row >= 0 &&
  //             row + dir.row < this.state.size &&
  //             col + dir.col >= 0 &&
  //             col + dir.col < this.state.size
  //     );

  //     const move = validMoves[Math.floor(Math.random() * validMoves.length)];
  //     this.swapTiles(row, col, row + move.row, col + move.col);
  // },

  // // Swap two tiles
  // swapTiles(row1, col1, row2, col2) {
  //     const temp = this.state.board[row1][col1];
  //     this.state.board[row1][col1] = this.state.board[row2][col2];
  //     this.state.board[row2][col2] = temp;
  //     this.state.emptyTile = { row: row2, col: col2 };
  // },

  // // Render the board
  // renderBoard() {
  //     const boardElement = document.getElementById("puzzle-container");
  //     boardElement.innerHTML = ""; // Czyść planszę

  //     const size = this.state.size;
  //     const percent = 100 / size;
  //     const backgroundSize = `${100 * size}%`;

  //     for (let row = 0; row < size; row++) {
  //         for (let col = 0; col < size; col++) {
  //             const tile = this.state.board[row][col];
  //             const tileElement = document.createElement("div");
  //             tileElement.style.width = `${percent}%`;
  //             tileElement.style.height = `${percent}%`;
  //             tileElement.style.left = `${col * percent}%`;
  //             tileElement.style.top = `${row * percent}%`;
  //             tileElement.style.backgroundImage = "url('stalker.png')";
  //             tileElement.style.backgroundSize = backgroundSize;
  //             tileElement.style.backgroundPosition = `-${col * (100 / size)}% -${row * (100 / size)}%`;

  //             if (tile !== 0) {
  //                 tileElement.className = "tile";
  //                 tileElement.addEventListener("click", () => this.handleTileClick(row, col));
  //             } else {
  //                 tileElement.className = "empty-tile";
  //             }

  //             boardElement.appendChild(tileElement);
  //         }
  //     }
  // },

  // handleTileClick(row, col) {
  //     const { row: emptyRow, col: emptyCol } = this.state.emptyTile;

  //     if (
  //         (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
  //         (Math.abs(col - emptyCol) === 1 && row === emptyRow)
  //     ) {
  //         this.swapTiles(row, col, emptyRow, emptyCol);
  //         this.renderBoard();
  //         this.checkWinCondition();
  //     }
  // },

  // checkWinCondition() {
  //     const size = this.state.size;
  //     let correct = 1;

  //     for (let row = 0; row < size; row++) {
  //         for (let col = 0; col < size; col++) {
  //             if (row === size - 1 && col === size - 1) break;
  //             if (this.state.board[row][col] !== correct) return;
  //             correct++;
  //         }
  //     }

  //     this.state.endTime = Date.now();
  //     this.showVictoryDialog();
  //     this.saveTimeToLeaderboard();
  // },

  // makingCanva() {
  //     const canva = document.createElement('div');
  //     canva.style.backgroundImage(`url('stalker.png')`);
  //     canva.style.position = 'absolute';
  // },
  slide: function (tile) {
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

      // Sprawdzenie warunku zwycięstwa
      this.checkWin();
    }
  },


  showVictoryDialog() {
    const timeElapsed = this.state.endTime - this.state.startTime;
    const timeString = this.formatTime(timeElapsed);

    const dialog = document.createElement('div');
    dialog.classList.add('overlay');

    const dialogContent = document.createElement('div');
    dialogContent.classList.add('dialog');

    dialogContent.innerHTML = `
          <h2>Congratulations! You Win!</h2>
          <p>Your Time: ${timeString}</p>
          <button onclick="closeDialog()">OK</button>
      `;

    dialog.appendChild(dialogContent);
    document.body.appendChild(dialog);
  },

  // hh:mm:ss.milli
  formatTime(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = milliseconds % 1000;

    return `${this.formatTimeUnit(hours)}:${this.formatTimeUnit(minutes)}:${this.formatTimeUnit(seconds)}.${this.formatMilliseconds(ms)}`;
  },

  // Format time units to ensure two digits (e.g., 03 instead of 3)
  formatTimeUnit(unit) {
    return unit < 10 ? `0${unit}` : unit;
  },

  formatMilliseconds(ms) {
    return ms < 100 ? `0${ms}` : ms;
  },

  saveTimeToLeaderboard() {
    const size = this.state.size;
    const time = Date.now() - this.state.startTime;
    this.state.leaderboards[size].push(time);
    this.state.leaderboards[size].sort((a, b) => a - b);
    this.state.leaderboards[size] = this.state.leaderboards[size].slice(0, 10);
    this.saveLeaderboards();
  },

  loadLeaderboards() {
    const saved = localStorage.getItem("leaderboards");
    if (saved) this.state.leaderboards = JSON.parse(saved);
  },

  saveLeaderboards() {
    localStorage.setItem("leaderboards", JSON.stringify(this.state.leaderboards));
  },

  startTimer() {
    this.state.timerInterval = setInterval(() => {
      const timeElapsed = Date.now() - this.state.startTime;
      const seconds = Math.floor((timeElapsed / 1000) % 60);
      const minutes = Math.floor((timeElapsed / 60000) % 60);
      const hours = Math.floor((timeElapsed / 3600000));

      this.updateTimerDisplay(hours, minutes, seconds);
    }, 1000);  // Update every second
  },

  updateTimerDisplay(hours, minutes, seconds) {
    const timerElement = document.getElementById("timer");
    timerElement.innerHTML = ''; // Wyczyść bieżący wyświetlacz

    this.addTimeToDisplay(hours || 0); // Jeśli hours to null/undefined, ustaw 0
    this.addTimeToDisplay(minutes || 0);
    this.addTimeToDisplay(seconds || 0, true); // Ostatnia jednostka
  }
  ,

  addTimeToDisplay(time, isLast = false) {
    console.log('Time to display:', time); // Dodaj to do debugowania
    const timeString = this.formatTimeUnit(time); // Powinien zwrócić ciąg znaków np. "02"
    [...timeString].forEach(digit => { // Błąd występuje tutaj
      const img = document.createElement('img');
      img.src = `cyferki/c${digit}.gif`;
      img.alt = digit;
      document.getElementById("timer").appendChild(img);
    });

    if (!isLast) {
      const colon = document.createElement('img');
      colon.src = 'cyferki/colon.gif';
      colon.alt = ':';
      document.getElementById("timer").appendChild(colon);
    }
  },
};

function closeDialog() {
  const dialog = document.querySelector('.overlay');
  if (dialog) {
    dialog.remove();
  }
}

document.addEventListener("DOMContentLoaded", () => Game.init());
*/















const TileManager = {
  // initializeFlag: false,

  createTiles(size) {
    const tiles = [];
    // const imageSize = 500;
    const tileSize = Game.imageSize / size;

    // if (this.initializeFlag) return;


    console.log('Debug funkcja CreateTiles');



    // const emptyRow = Math.floor(Math.random() * size);
    // const emptyCol = Math.floor(Math.random() * size);
    // let emptyRow = `${300 / Game.state.size}px`;
    // let emptyCol = `${300 / Game.state.size}px`;
    // console.log(emptyRow);
    // console.log(emptyCol);

    const emptyRow = size - 1;
    const emptyCol = size - 1;



    let emptyTile = { row: emptyRow, col: emptyCol }; // 

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (row === emptyRow && col === emptyCol) {
          const empty = this.createEmptyTile(emptyTile);
          tiles.push(empty)
        }
        else {
          const tile = this.createTile(row, col, tileSize, size, Game.imageSize);
          tiles.push(tile);
        }

      }
    }

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



    tile.addEventListener('click', () => Game.slide(tile));

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
  shuffleTiles(tiles) {
    //fisher yates algorytm z neta
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      // Zamiana kafelków w gridzie
      const tempRow = tiles[i].style.gridRow;
      const tempCol = tiles[i].style.gridColumn;

      tiles[i].style.gridRow = tiles[j].style.gridRow;
      tiles[i].style.gridColumn = tiles[j].style.gridColumn;

      tiles[j].style.gridRow = tempRow;
      tiles[j].style.gridColumn = tempCol;

      // Zamiana danych w dataset
      [tiles[i].dataset.i, tiles[j].dataset.i] = [tiles[j].dataset.i, tiles[i].dataset.i];
      [tiles[i].dataset.j, tiles[j].dataset.j] = [tiles[j].dataset.j, tiles[i].dataset.j];
    }
    console.log("tilesy wyszuflowane");

  },









  getNeighbor(tile, emptyTile) {
    const tileRow = parseInt(tile.dataset.i);
    const tileCol = parseInt(tile.dataset.j);

    const emptyRow = parseInt(emptyTile.dataset.i);
    const emptyCol = parseInt(emptyTile.dataset.j);

    // Kafelki sąsiednie to takie, które różnią się o 1 w jednym z wymiarów (rząd lub kolumna)
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