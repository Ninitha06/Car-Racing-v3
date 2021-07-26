var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount, gameState;
var car1Img, car2Img, trackImg;
var car1, car2, cars;
var allPlayers;

var fuelImage, powerCoinImage, obstacle1Image, obstacle2Image,lifeImage;
var fuels, powerCoins, obstacles;
var blastImage;

function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1Img = loadImage("./assets/car1.png");
  car2Img = loadImage("./assets/car2.png");
  trackImg = loadImage("./assets/track.jpg");
  fuelImage = loadImage("./assets/fuel.png");
  powerCoinImage = loadImage("./assets/goldCoin.png");
  obstacle1Image = loadImage("./assets/obstacle1.png");
  obstacle2Image = loadImage("./assets/obstacle2.png");
  lifeImage = loadImage('./assets/life.png');
  blastImage = loadImage('./assets/blast.png');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);

  if (playerCount == 2) {
    game.setState(1);
  }

  if (gameState == 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
