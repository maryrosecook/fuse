class Game {
  constructor () {
    this.c = new Coquette(this, "screen", 600, 600, "#000", true);
    this.physics = new Physics(this, { x: 0, y: 0 });
    this.c.entities.create(Player, { center: { x: 256, y: 110 } });
    this.c.entities.create(Block, { center: { x: 256, y: 210 } });
  }

  update (delta) {
    this.physics.update(delta);
  }
};
