// https://source.unsplash.com/random/WIDTHxHEIGHT
const board = document.querySelector("#board");
const pieces = [...document.querySelectorAll(".piece")];
let animating = false;
let moves = 0;
const movesElement = document.querySelector("#moves");
const openImage = document.querySelector("#openImage");
const screenElement = document.querySelector("#screen");
const screenMoves = document.querySelector("#screen__moves");
const screenTimer = document.querySelector("#screen__timer");
const changeImageButton = document.querySelector("#changeImageButton");
const defaultimage = document.querySelector("#defaultimage");

let image = "";
let timeoutforimageButton = "";
let canChangeImage = true;
let won = false;
let clickedFirstTile = false;
let timer = 0;
let resultedtimer = 0;

changeImageButton.addEventListener("click", () => {
  if (!canChangeImage) {
    return;
  }
  // if (won) {
  //   ChangeImage();
  //   return;
  // }

  let confirmAction = confirm("Do you really want to start over?");

  if (confirmAction) {
    ChangeImage();
  }
});

Disable(defaultimage, true);
Disable(screenElement, true);

function ChangeImage() {
  timer = 0;
  resultedtimer = 0;
  clickedFirstTile = false;
  if (!canChangeImage) {
    return;
  }
  clearTimeout(timeoutforimageButton);
  canChangeImage = false;
  particleAmout = 0;
  Disable(screenElement, true);
  ResetMap();
  won = false;

  changeImageButton.setAttribute("data-timeout-disable", "");
  board.removeAttribute("data-won");
  board.removeAttribute("data-error");
  board.setAttribute("data-loading", "");
  Disable(defaultimage, true);
  pieces[8].style = "";
  moves = 0;
  particleAmout = 0;
  movesElement.innerText = moves;
  document.documentElement.style.setProperty("--selected", `url()`);

  fetch("https://source.unsplash.com/random/400x400", {})
    .then((response) => {
      if (response.ok) {
        // Check if the response is ok (status code 200)
        return response;
      } else {
        // Throw an error if the response is not ok
        throw new Error(`HTTP error: ${response.status}`);
      }
    })
    .then((data) => {
      RandomizeTiles();
      UpdateMap();

      board.removeAttribute("data-loading");
      changeImageButton.removeAttribute("data-timeout-disable");
      changeImageButton.setAttribute("data-timeout", "");

      if (data.url == "https://images.unsplash.com/source-404?fit=crop&fm=jpg&h=800&q=60&w=1200") {
        board.setAttribute("data-error", "");
        document.documentElement.style.setProperty("--selected", "url('img/defaultimage.jpg')");
        return;
      }

      image = data.url;
      openImage.href = image;
      document.documentElement.style.setProperty("--selected", `url(${image})`);

      TimeoutButton();

      AnimateBlocks();
    })
    .catch((e) => {
      console.error(e);

      RandomizeTiles();
      UpdateMap();
      board.removeAttribute("data-loading");
      board.setAttribute("data-error", "");
      changeImageButton.removeAttribute("data-timeout-disable");

      image = "img/defaultimage.jpg";
      openImage.href = image;
      document.documentElement.style.setProperty("--selected", `url(../${image})`);
      Enable(defaultimage);

      setTimeout(() => {
        alert("An error ocurred while trying to get the image");
      }, 10);

      TimeoutButton();
    });
}

function TimeoutButton() {
  timeoutforimageButton = setTimeout(() => {
    canChangeImage = true;
    changeImageButton.removeAttribute("data-timeout");
  }, 1300);
}

function AnimateBlocks() {
  let speedDivider = 5;
  for (let i = 0; i < pieces.length; i++) {
    const element = pieces[i];
    speedDivider += 0.1;
    let speed = i / speedDivider;
    element.style.opacity = "0";
    // element.style.transform = "scale(2)";
    element.style.transition = "0s";

    setTimeout(() => {
      element.setAttribute("data-animate", "");
      element.style.animationDelay = `${speed}s;`;
      element.style.opacity = "";
      // element.style.transform = "";
      element.style.transition = "";

      setTimeout(() => {
        element.removeAttribute("data-animate", "");
      }, 1500);
    }, speed * 1000);
  }

  // setTimeout(() => {
  //   ChangeImage();
  // }, (allBody.length / speedDivider) * 1000);
}

var map = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0],
];

for (let i = 0; i < pieces.length; i++) {
  const element = pieces[i];
  element.addEventListener("click", () => {
    if (!clickedFirstTile) {
      timer = new Date().getTime();
      clickedFirstTile = true;
    }

    board.removeAttribute("data-won");
    Disable(screenElement, true);
    won = false;

    if (animating) {
      return;
    }
    let posX = Number(element.dataset.num[0]);
    let posY = Number(element.dataset.num[1]);

    SeekAtDir(element, posX, posY, -1, 0);
    SeekAtDir(element, posX, posY, 0, -1);
    SeekAtDir(element, posX, posY, 0, 1);
    SeekAtDir(element, posX, posY, 1, 0);
  });
}

function RandomizeTiles() {
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const temp = map[x][y];
      let randomX = Random(0, 2);
      let randomY = Random(0, 2);

      if (randomX == 2 && randomY == 2) {
        continue;
      }
      if (x == 2 && y == 2) {
        continue;
      }

      map[x][y] = map[randomX][randomY];
      map[randomX][randomY] = temp;
    }
  }
}

function CheckCorrect() {
  let corrects = 0;

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const item = map[x][y];
      if (x == 2 && y == 2) {
        if (item == 0) {
          corrects++;
        }
      }

      if (x * 3 + 1 + y == item) {
        corrects++;
      }
    }
  }

  if (corrects == 9) {
    Won();
  } else {
    board.removeAttribute("data-won", "");
  }
}

function SeekAtDir(element, posX, posY, x, y) {
  let NewX = posX + x;
  let NewY = posY + y;

  if (Inside(NewX, 0, 3) && Inside(NewY, 0, 3)) {
    let newElement = document.querySelector(`.piece[data-num='${NewX}${NewY}']`);
    if (newElement == null) {
      return;
    }

    if (newElement.dataset.empty != null) {
      if (resultedtimer == 0) {
        moves++;
      }
      movesElement.innerText = moves;

      let newPosTemp = map[NewX][NewY];
      let oldPosTemp = map[posX][posY];

      let origBound = element.getBoundingClientRect();
      let newBound = newElement.getBoundingClientRect();

      let clone = element.cloneNode(true);
      Disable(clone);

      clone.style = `position: absolute; left: ${origBound.x}px; top: ${
        window.pageYOffset + origBound.y
      }px; transition: 0.25s ease-out`;
      UpdateItem(clone, posX, posY);
      animating = true;

      document.body.appendChild(clone);

      map[NewX][NewY] = 0;
      map[posX][posY] = 0;

      setTimeout(() => {
        clone.style.left = `${newBound.x}px`;
        clone.style.top = `${window.pageYOffset + newBound.y}px`;
      }, 10);

      setTimeout(() => {
        map[NewX][NewY] = oldPosTemp;
        map[posX][posY] = newPosTemp;

        UpdateMap();
        animating = false;
        clone.remove();

        CheckCorrect();
      }, 250);

      UpdateMap();
    }
  }
}

function UpdateMap() {
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      let newElement = pieces[x * 3 + y];
      newElement.setAttribute("data-num", x + "" + y);
      newElement.removeAttribute("data-empty");

      // console.log(map[x][y]);
      // console.log(x, y);
      // console.log(numString);
      // console.log(expX);
      // console.log(expY);

      UpdateItem(newElement, x, y);

      if (map[x][y] == 0) {
        newElement.setAttribute("data-empty", "");
        newElement.children[0].textContent = "";
      }
    }
  }
}

function UpdateItem(element, x, y) {
  let mapNum = map[x][y] - 1;
  let numString = "";
  let expX = 0;
  let expY = 0;
  if (mapNum < 3) {
    expX = 0;
    expY = mapNum;
  } else if (mapNum < 6) {
    expX = 1;
    expY = mapNum - 3;
  } else {
    expX = 2;
    expY = mapNum - 6;
  }
  element.style.backgroundPosition = `${expY * 50}% ${expX * 50}%`;
  element.children[0].textContent = map[x][y];
}

function padNumber(number, totalLength) {
  return String(number).padStart(totalLength, "0");
}

function Won() {
  won = true;
  particleAmout = 0;
  CreateParticles(window.innerWidth / 2, window.innerHeight / 2);
  // .style.backgroundImage = `url(${image})`;
  pieces[8].style.backgroundImage = `url(${image})`;
  pieces[8].style.backgroundPosition = `100% 100%`;
  board.setAttribute("data-won", "");
  Enable(screenElement);
  screenMoves.innerText = moves;

  if (resultedtimer == 0) {
    resultedtimer = new Date().getTime();
  }

  let timeinms = resultedtimer - timer;
  let timeinseconds = timeinms / 1000;
  let timeinminutes = timeinseconds / 60;
  let timeinhours = timeinminutes / 60;

  timeinseconds = padNumber(Math.floor(timeinseconds % 60), 2);
  timeinhours = padNumber(Math.floor(timeinhours % 60), 2);
  timeinminutes = padNumber(Math.floor(timeinminutes % 60), 2);

  timeinms = timeinms.toString();
  timeinms = timeinms.substr(timeinms.length - 3);
  timeinms = padNumber(timeinms, 3);

  screenTimer.innerHTML = `${timeinhours}<span class='divider'>:</span>${timeinminutes}<span class='divider'>:</span>${timeinseconds}<span class='divider'>:</span>${timeinms}`;
}

function ResetMap() {
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      map[x][y] = x * 3 + 1 + y;

      if (x == 2 && y == 2) {
        map[x][y] = 0;
      }
    }
  }

  UpdateMap();
}

board.addEventListener("keydown", (e) => {
  let direction = {
    x: 0,
    y: 0,
  };

  switch (e.code) {
    case "ArrowLeft":
      direction.y = -1;
      break;
    case "ArrowRight":
      direction.y = 1;
      break;
    case "ArrowUp":
      direction.x = -1;
      break;
    case "ArrowDown":
      direction.x = 1;
      break;
    default:
      return;
  }

  let selected = document.querySelector("button:focus");
  let num = selected.dataset.num;
  let x = Clamp(Number(num[0]) + direction.x, 0, 2);
  let y = Clamp(Number(num[1]) + direction.y, 0, 2);

  pieces[x * 3 + y].focus();
});

ChangeImage();
