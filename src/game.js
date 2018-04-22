class Game {
  constructor () {
    this.c = new Coquette(this, "screen", 600, 600, "#000", true);

    this.c.entities.create(Player, { center: { x: 256, y: 110 } });

    this.block = this.c.entities.create(Block, {
      type: "engine",
      center: { x: 256, y: 210 }
    });

    this.block = this.c.entities.create(Block, {
      type: "gun",
      center: { x: 356, y: 210 }
    });

  }

  update (delta) {

  }
};
