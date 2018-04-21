class Block {
  constructor (game, settings) {
    this.game = game;
    this.color = "#fff";
    this.zindex = 0;
    this.body = game.physics.createSingleShapeBody(this, {
      shape: "rectangle",
      center: settings.center,
      size: { x: 20, y: 20 },
      density: 0.4,
      fixedRotation: false
    });
  }

  update () {
    this.body.update();

    const DRAG_RATIO = 0.1;
    this.body.drag(DRAG_RATIO);
  }

  draw (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.center.x - this.size.x / 2,
                 this.center.y - this.size.y / 2,
                 this.size.x,
                 this.size.y);
  }
};
