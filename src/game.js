class Game {
  constructor () {
    this.c = new Coquette(this, "screen", 600, 600, "#000", true);

    this.player = this.c.entities.create(
      Player, { center: { x: 256, y: 110 } });

    this.c.entities.create(Block, {
      type: "engine",
      center: { x: 256, y: 210 }
    });

    this.c.entities.create(Block, {
      type: "gun",
      center: { x: 356, y: 210 },
      on: true
    });

    this.c.entities.create(Block, {
      type: "gun",
      center: { x: 456, y: 210 }
    });
  }

  update (delta) {
    this.c.renderer.setViewCenter(this.player.center);
  }

  createMissile (center, angle) {
    let engine = this.c.entities.create(Block, {
      type: "engine",
      angle,
      center,
      speed: 4
    });

    engine.on = true;

    let bomb = this.c.entities.create(Block, {
      type: "bomb",
      angle,
      center: Maths.vectorAdd(
        engine.center,
        Maths.vectorMultiply(Maths.angleToVector(angle), engine.size.x))
    });

    engine.toggleAttached(bomb);
    return engine;
  }
};
