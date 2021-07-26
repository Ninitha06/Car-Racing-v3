class Game {
  constructor() {
    this.resetText = createElement("h2");
    this.resetButton = createButton("");

    this.leaderBoardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.playerMoving = false;
    this.leftKeyActive = false;
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    player.getCount();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage(car1Img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage(car2Img);
    car2.scale = 0.07;

    cars = [car1, car2];

    var obstaclePositions = [
      { x: width / 2 + 250, y: height - 500, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 900, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 1700, image: obstacle2Image },
      { x: width / 2, y: height - 2100, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 2500, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 2900, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3300, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 3700, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4100, image: obstacle2Image },
      { x: width / 2, y: height - 4500, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 4900, image: obstacle2Image },
    ];

    fuels = new Group();
    powerCoins = new Group();
    obstacles = new Group();

    this.addSprites(fuels, 4, fuelImage, 0.02);
    this.addSprites(powerCoins, 18, powerCoinImage, 0.09);
    this.addSprites(
      obstacles,
      obstaclePositions.length,
      obstacle1Image,
      0.04,
      obstaclePositions
    );
  }

  getState() {
    database.ref("gameState").on("value", function (data) {
      gameState = data.val();
    });
  }

  setState(state) {
    database.ref("/").update({
      gameState: state,
    });
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetText.html("Reset Game");
    this.resetText.class("resetText");
    this.resetText.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leaderBoardTitle.html("LeaderBoard");
    this.leaderBoardTitle.class("resetText");
    this.leaderBoardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    Player.getAllPlayersInfo();

    const finishLine = height * 8 - 100;

    player.getCarsAtEnd();

    image(trackImg, 0, -height * 7, width, height * 8);

    if (allPlayers !== undefined) {
      this.showLeaderBoard();
      var index = 0;
      for (var plr in allPlayers) {
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        var currentLife = allPlayers[plr].life;

        cars[index].position.x = x;
        cars[index].position.y = y;
        // if(index+1 === player.index)
        if (plr === "player" + player.index) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          // If we set camera to xPosition of car, the track image does not cover full screen
          camera.position.x = width / 2;
          camera.position.y = cars[index].position.y;

          this.handleFuel(index);
          this.handlePowerCoins(index);
          this.handleObstacleCollision(index);
          this.handleCarACollisionWithCarB(index);

          // can create blast variable in Game.js also
          if (currentLife <= 0) {
            // Can add this image in start() for each of the cars and use changeImage option too.
            cars[index].addImage(blastImage);
            cars[index].scale = 0.3;
            player.blast = true;
            this.playerMoving = false;
          }
        }
        index = index + 1;
      }

      this.handlePlayerControls();
      this.handleResetButton();

      if (player.positionY > finishLine) {
        gameState = 2;
        player.rank = player.rank + 1;
        player.update();
        Player.updateCarsAtEnd(player.rank);
        this.showRank();
      }
    }
    this.showLife();
    this.showFuel();

    drawSprites();
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        gameState: 0,
        playerCount: 0,
        players: null,
        carsAtEnd: 0,
      });
      window.location.reload();
    });
  }

  handlePlayerControls() {
    if (!player.blast) {
      if (keyIsDown(UP_ARROW)) {
        this.playerMoving = true;
        player.positionY = player.positionY + 10;
        player.update();
      }

      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        player.positionX -= 5;
        player.update();
        this.leftKeyActive = true;
      }

      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        player.positionX += 5;
        player.update();
        this.leftKeyActive = false;
      }

      if (this.playerMoving) {
        player.positionY += 5;
        player.update();
      }
    }
  }

  showLeaderBoard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);

    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp; - This for giving 4 spaces
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank == 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  addSprites(spriteGroup, numOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numOfSprites; i++) {
      var x, y;
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      } else {
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      }

      var sprite = createSprite(x, y);
      sprite.addImage(spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  handleFuel(index) {
    cars[index].overlap(fuels, function (collector, collected) {
      player.fuel = 185;
      collected.remove();
    });

    if (this.playerMoving === true && player.fuel > 0) {
      player.fuel = player.fuel - 0.3;
    }

    if (player.fuel <= 0) {
      gameState = 0;
      this.gameOver();
    }
  }

  handlePowerCoins(index) {
    cars[index].overlap(powerCoins, function (collector, collected) {
      player.score = player.score + 21;
      player.update();
      collected.remove();
    });
  }

  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line succesfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks for playing",
    });
  }

  //Change player.positionY - * depending on student machine

  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 260, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 260, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 260, player.life, 20);
    noStroke();
    pop();
  }

  showFuel() {
    push();
    image(fuelImage, width / 2 - 130, height - player.positionY - 230, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 230, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 230, player.fuel, 20);
    noStroke();
    pop();
  }

  gameOver() {
    swal({
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing",
    });
  }

  handleObstacleCollision(index) {
    if (cars[index].collide(obstacles)) {
      if (this.leftKeyActive) {
        player.positionX += 50;
      } else {
        player.positionX -= 50;
      }
      if (player.life > 0) {
        player.life -= 185 / 4;
      }

      player.update();
    }
  }

  handleCarACollisionWithCarB(index) {
    if (index === 0) {
      if (cars[index].collide(cars[1])) {
        if (this.leftKeyActive) {
          player.positionX += 50;
        } else {
          player.positionX -= 50;
        }
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }

    }
    else if (index === 1) {
      if (cars[index].collide(cars[0])) {
        if (this.leftKeyActive) {
          player.positionX += 50;
        } else {
          player.positionX -= 50;
        }
        if (player.life > 0) {
          player.life -= 185 / 4;
        }

        player.update();
      }
    }
  }
}
