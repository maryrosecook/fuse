class Player {
  constructor (game, settings) {
    this.game = game;
    this.color = "#f07";
    this.zindex = 0;
    this.angle = 180;
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

    const MOVEMENT_SPEED = 0.001;
    const DRAG_RATIO = 0.1;

    const inputter = this.game.c.inputter;
    if (inputter.isDown(inputter.UP_ARROW)) {
      this.body.push({ x: 0, y: -MOVEMENT_SPEED });
    }

    if (inputter.isDown(inputter.DOWN_ARROW)) {
      this.body.push({ x: 0, y: MOVEMENT_SPEED });
    }

    if (inputter.isDown(inputter.LEFT_ARROW)) {
      this.body.push({ x: -MOVEMENT_SPEED, y: 0 });
    }

    if (inputter.isDown(inputter.RIGHT_ARROW)) {
      this.body.push({ x: MOVEMENT_SPEED, y: 0 });
    }

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
