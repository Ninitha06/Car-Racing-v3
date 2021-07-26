class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Enter your name");
    this.playButton = createButton("Play");
    this.titleImg = createImg("./assets/title.png", "game title");
    this.greeting = createElement("h2");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  setElementsStyle() {
    this.titleImg.class("gameTitle");
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.greeting.class("greeting");
  }

  setElementsPosition() {
    this.titleImg.position(120, 80);
    this.input.position(width / 2 - 110, height / 2 - 50);
    this.playButton.position(width / 2 - 90, height / 2 + 20);
    this.greeting.position(width / 2 - 300, height / 2 - 100);
  }

  display() {
    this.setElementsPosition();
    this.setElementsStyle();
    this.handleMousePressed();
  }

  handleMousePressed() {
    this.playButton.mousePressed(() => {
      this.input.hide();
      this.playButton.hide();
      var message = `Hello ${this.input.value()} ${"\n"}Please wait for the other player to join`;
      this.greeting.html(message);
      playerCount += 1;
      player.name = this.input.value();
      player.index = playerCount;
      player.setCount(playerCount);
      player.addPlayer();
      //player.getDistance();
    });
  }
}
