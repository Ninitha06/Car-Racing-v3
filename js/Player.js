class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.rank = 0;
    this.score = 0;
    this.fuel = 185;
    this.life = 185;
    this.blast = false;
  }

  getCount() {
    database.ref("playerCount").on("value", function (data) {
      playerCount = data.val();
    });
  }

  setCount(count) {
    database.ref("/").update({
      playerCount: count,
    });
  }

  addPlayer() {
    var playerNode = "players/player" + this.index;

    if (this.index == 1) {
      this.positionX = width / 2 - 100;
    } else if (this.index == 2) {
      this.positionX = width / 2 + 100;
    }

    database.ref(playerNode).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      life : this.life,
      score: this.score,
    });
  }

  static getAllPlayersInfo() {
    database.ref("players").on("value", function (data) {
      allPlayers = data.val();
    });
  }

  update() {
    var playerNode = "players/player" + this.index;
    database.ref(playerNode).update({
      positionX: this.positionX,
      positionY: this.positionY,
      life: this.life,
      score: this.score,
      rank: this.rank,
    });
  }

  getDistance() {
    var playerNode = "players/player" + this.index;
    database.ref(playerNode).on("value", function (data) {
      var position = data.val();
      this.positionX = position.positionX;
      this.positionY = position.positionY;
    });
  }

  getCarsAtEnd() {
    database.ref("carsAtEnd").on("value", (data) => {
      this.rank = data.val();
    });
  }

  static updateCarsAtEnd(rank) {
    database.ref("/").update({
      carsAtEnd : rank
    })
  }
}

