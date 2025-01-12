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

    document.querySelector('.h1').setAttribute('style', `background-image: url(img2/cyferki/c${h[0]}.gif)`);
    document.querySelector('.h2').setAttribute('style', `background-image: url(img2/cyferki/c${h[1]}.gif)`);
    document.querySelector('.m1').setAttribute('style', `background-image: url(img2/cyferki/c${m[0]}.gif)`);
    document.querySelector('.m2').setAttribute('style', `background-image: url(img2/cyferki/c${m[1]}.gif)`);
    document.querySelector('.s1').setAttribute('style', `background-image: url(img2/cyferki/c${s[0]}.gif)`);
    document.querySelector('.s2').setAttribute('style', `background-image: url(img2/cyferki/c${s[1]}.gif)`);
    document.querySelector('.ms1').setAttribute('style', `background-image: url(img2/cyferki/c${ms[0]}.gif)`);
    document.querySelector('.ms2').setAttribute('style', `background-image: url(img2/cyferki/c${ms[1]}.gif)`);
    document.querySelector('.ms3').setAttribute('style', `background-image: url(img2/cyferki/c${ms[2]}.gif)`);
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
      el.style.backgroundImage = `url(img2/cat${currentImageIndex + 1}.jpeg)`;
    });
  }
};

