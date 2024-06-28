let Engine = Matter.Engine,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Events = Matter.Events;

let potWidth = 380;
let potHeight = 350;
let potThickness = 20;

let engine, world;
let ground;
let potLeft, potRight, potBottom;
let fruits = [];
let score = 0;
let displayFruitImg;
let canDropFruit = true;
let cooldownTime = 1000;
let changeCounter = 10;
let firstDrop = false;

let appleImg, orangeImg, watermelonImg, lemonImg, pineappleImg, grapeImg, bananaImg, cornImg, changeImg;
let menuButton, resumeButton, restartButton, retryButton;
let gamePaused = false;
let gameOver = false;
let gameOverMusic, backgroundMusic;

function preload() {
  appleImg = loadImage('apple.png');
  orangeImg = loadImage('orange.png');
  watermelonImg = loadImage('watermelon.png');
  lemonImg = loadImage('lemon.png');
  pineappleImg = loadImage('pineapple.png');
  grapeImg = loadImage('grape.png');
  bananaImg = loadImage('banana.png');
  cornImg = loadImage('corn.png');
  changeImg = loadImage('change.png');
  gameOverMusic = loadSound('brotherew.mp3');
  backgroundMusic = loadSound('dreamland.mp3');
}

function setup() {
  createCanvas(1280, 720);
  engine = Engine.create();
  world = engine.world;

  engine.world.gravity.y = 1;

  ground = Bodies.rectangle(width / 2, height - 25, width, 50, { isStatic: true });
  World.add(world, ground);

  let potX = width / 2;
  let potY = height - potHeight / 2;
  let potTopWidth = potWidth * 1.2;
  let potBottomWidth = potWidth;
  let potBottomHeight = potHeight / 1.5;
  let extendedHeight = potHeight * 1.1;

  potLeft = Bodies.rectangle(potX - potBottomWidth / 2 - potThickness / 2, potY - potThickness / 2, potThickness, extendedHeight, { isStatic: true });
  potRight = Bodies.rectangle(potX + potBottomWidth / 2 + potThickness / 2, potY - potThickness / 2, potThickness, extendedHeight, { isStatic: true });
  potBottom = Bodies.rectangle(potX, potY + potBottomHeight / 2, potBottomWidth, potThickness, { isStatic: true });

  World.add(world, [potLeft, potRight, potBottom]);

  displayRandomFruit();

  Events.on(engine, 'collisionStart', handleCollisions);

  if (!menuButton) {
    menuButton = createButton('Menu');
    styleButton(menuButton, 20, 70, '#007BFF', '#0056b3');
    menuButton.mousePressed(showMenu);
  }

  if (!resumeButton) {
    resumeButton = createButton('Resume');
    styleButton(resumeButton, width / 2 - 50, height / 2 - 20, '#28a745', '#218838');
    resumeButton.mousePressed(resumeGame);
    resumeButton.hide();
  }

  if (!restartButton) {
    restartButton = createButton('Restart');
    styleButton(restartButton, width / 2 - 50, height / 2 + 20, '#ffc107', '#e0a800');
    restartButton.mousePressed(restartGame);
    restartButton.hide();
  }

  if (!retryButton) {
    retryButton = createButton('Retry');
    styleButton(retryButton, width / 2 - 50, height / 2 + 60, '#dc3545', '#c82333');
    retryButton.mousePressed(restartGame);
    retryButton.hide();
  }
}

function draw() {
  if (!gamePaused && !gameOver) {
    background('lightblue');
    Engine.update(engine);

    fill(139, 69, 19);
    rectMode(CENTER);
    rect(ground.position.x, ground.position.y, width, 50);

    drawPot(width / 2, height - potHeight / 2);

    fill(0);
    textSize(24);
    text(`Score: ${score}`, 20, 40);
    text(`Changes left: ${changeCounter}`, width - 200, 40);

    if (displayFruitImg) {
      image(displayFruitImg, width - 100, 80, 80, 80);
      image(changeImg, width - 100, 170, 80, 80);
    }

    let fruitImages = [
      { img: cornImg, score: 20 },
      { img: bananaImg, score: 30 },
      { img: grapeImg, score: 35 },
      { img: appleImg, score: 45 },
      { img: orangeImg, score: 10 },
      { img: lemonImg, score: 40 },
      { img: pineappleImg, score: 15 },
      { img: watermelonImg, score: 50 }
    ];

    fruitImages.sort((a, b) => a.score - b.score);

    let imgSize = 50;
    let startX = width - fruitImages.length * imgSize - 20;
    let startY = height - imgSize - 1;

    for (let i = 0; i < fruitImages.length; i++) {
      image(fruitImages[i].img, startX + i * imgSize, startY, imgSize, imgSize);
    }

    for (let i = fruits.length - 1; i >= 0; i--) {
      let fruit = fruits[i];
      let pos = fruit.body.position;
      let angle = fruit.body.angle;

      push();
      translate(pos.x, pos.y);
      rotate(angle);
      imageMode(CENTER);
      let fruitSize = fruit.size;
      image(fruit.img, 0, 0, fruitSize, fruitSize);
      pop();

      if (pos.y > height - potHeight - 25 && (pos.x < width / 2 - potWidth / 2 || pos.x > width / 2 + potWidth / 2)) {
        gameOver = true;
        showGameOver();
        break;
      }
    }
  }
}

function mouseClicked() {
  if (mouseX >= width - 100 && mouseX <= width - 20 && mouseY >= 170 && mouseY <= 250 && displayFruitImg) {
    if (changeCounter > 0) {
      displayRandomFruit();
      changeCounter--;
    }
    return;
  }

  if (canDropFruit && displayFruitImg && mouseY < (height - potHeight - 200) && !gamePaused && !gameOver) {
    if (!firstDrop) {
      backgroundMusic.loop();
      firstDrop = true;
    }

    if (displayFruitImg !== watermelonImg && displayFruitImg !== pineappleImg) {
      dropFruit(displayFruitImg);
      score += 1;
    }
    displayRandomFruit();
    canDropFruit = false;
    setTimeout(() => {
      canDropFruit = true;
    }, cooldownTime);
  }
}

function dropFruit(fruitImg) {
  let x = mouseX;
  let y = mouseY;
  let radius;

  if (fruitImg === appleImg) radius = 35;
  if (fruitImg === orangeImg) radius = 40;
  if (fruitImg === watermelonImg) radius = 60;
  if (fruitImg === lemonImg) radius = 35;
  if (fruitImg === pineappleImg) radius = 47;
  if (fruitImg === grapeImg) radius = 35;
  if (fruitImg === bananaImg) radius = 30;
  if (fruitImg === cornImg) radius = 20;

  let body = Bodies.circle(x, y, radius, {
    restitution: 0.5,
    friction: 0.5
  });
  World.add(world, body);

  let fallingFruit = {
    img: fruitImg,
    body: body,
    size: radius * 2
  };

  fruits.push(fallingFruit);
}

function displayRandomFruit() {
  let fruitImages = [appleImg, orangeImg, lemonImg, grapeImg, bananaImg, cornImg];
  let index = floor(random(fruitImages.length));
  displayFruitImg = fruitImages[index];
}

function handleCollisions(event) {
  let pairs = event.pairs;
  let fruitsToRemove = [];

  for (let pair of pairs) {
    let bodyA = pair.bodyA;
    let bodyB = pair.bodyB;

    let fruitA = fruits.find(f => f.body === bodyA);
    let fruitB = fruits.find(f => f.body === bodyB);

    if (fruitA && fruitB) {
      if (fruitA.img === fruitB.img) {
        let mergeScore = mergeFruits(fruitA, fruitB);
        fruitsToRemove.push(fruitB);
        score += mergeScore;
        displayRandomFruit();
      }
    }
  }

  for (let fruitToRemove of fruitsToRemove) {
    World.remove(world, fruitToRemove.body);
    fruits = fruits.filter(f => f !== fruitToRemove);
  }
}

function mergeFruits(fruit1, fruit2) {
  const mergeSequence = [
    { img: grapeImg, nextImg: bananaImg, score: 30 },
    { img: bananaImg, nextImg: cornImg, score: 20 },
    { img: cornImg, nextImg: pineappleImg, score: 15 },
    { img: pineappleImg, nextImg: appleImg, score: 45 },
    { img: appleImg, nextImg: orangeImg, score: 10 },
    { img: orangeImg, nextImg: lemonImg, score: 40 },
    { img: lemonImg, nextImg: watermelonImg, score: 35 },
    { img: watermelonImg, nextImg: watermelonImg, score: 50 }
  ];

  let index = mergeSequence.findIndex(item => item.img === fruit2.img);

  if (index !== -1) {
    fruit1.img = mergeSequence[index].nextImg;
    return mergeSequence[index].score;
  } else {
    return 0;
  }
}

function drawPot(x, y) {
  let potTopWidth = potWidth * 1.2;
  let potBottomWidth = potWidth;
  let potBottomHeight = potHeight / 1.5;
  let potBaseY = y + potBottomHeight / 2;

  beginShape();
  vertex(x - potTopWidth / 2, potBaseY - potHeight);
  vertex(x - potTopWidth / 2 + potThickness, potBaseY - potHeight);
  vertex(x - potBottomWidth / 2 + potThickness, potBaseY);
  vertex(x - potBottomWidth / 2, potBaseY);
  endShape(CLOSE);

  beginShape();
  vertex(x + potTopWidth / 2, potBaseY - potHeight);
  vertex(x + potTopWidth / 2 - potThickness, potBaseY - potHeight);
  vertex(x + potBottomWidth / 2 - potThickness, potBaseY);
  vertex(x + potBottomWidth / 2, potBaseY);
  endShape(CLOSE);

  rectMode(CENTER);
  rect(x, potBaseY, potBottomWidth - potThickness * 2, potThickness);
}

function showMenu() {
  gamePaused = true;
  resumeButton.show();
  restartButton.show();
}

function resumeGame() {
  resumeButton.hide();
  restartButton.hide();
  gamePaused = false;
}

function restartGame() {
  gameOverMusic.stop();
  backgroundMusic.stop();
  resumeButton.hide();
  restartButton.hide();
  retryButton.hide();
  gamePaused = false;
  gameOver = false;
  score = 0;
  firstDrop = false;
  fruits = [];
  World.clear(world);
  Engine.clear(engine);
  setup();
}

function showGameOver() {
  if (gameOverMusic.isPlaying()) {
    gameOverMusic.stop();
  }
  if (backgroundMusic.isPlaying()) {
    backgroundMusic.stop();
  }
  gameOverMusic.play();
  retryButton.show();
  fill(0);
  textSize(32);
  textAlign(CENTER);
  text(`Game Over! Your Score: ${score}`, width / 2, height / 2 - 50);
}

function styleButton(button, x, y, bgColor, hoverColor) {
  button.position(x, y);
  button.style('background-color', bgColor);
  button.style('border', 'none');
  button.style('color', 'white');
  button.style('padding', '10px 24px');
  button.style('text-align', 'center');
  button.style('text-decoration', 'none');
  button.style('display', 'inline-block');
  button.style('font-size', '16px');
  button.style('border-radius', '12px');
  button.style('transition-duration', '0.4s');
  button.mouseOver(() => button.style('background-color', hoverColor));
  button.mouseOut(() => button.style('background-color', bgColor));
}
