class Player {
  constructor (game, settings) {
    this.game = game;
    this.color = "#f07";
    this.zindex = 0;
    this.angle = 180;
    this.center = Maths.copyPoint(settings.center);
    this.size = { x: 20, y: 20 };
  }

  update () {
    this.handleMovement();
    this.handleHolding();
    this.handleMessagingBlockHolding();
  }

  handleMovement () {
    const MOVEMENT_SPEED = 1;

    let vector = { x: 0, y: 0 };

    const inputter = this.game.c.inputter;
    if (inputter.isDown(inputter.UP_ARROW)) {
      vector.y = -MOVEMENT_SPEED;
    }

    if (inputter.isDown(inputter.DOWN_ARROW)) {
      vector.y = MOVEMENT_SPEED;
    }

    if (!this.isHolding() &&
        inputter.isDown(inputter.LEFT_ARROW)) {
      vector.x = -MOVEMENT_SPEED;
    }

    if (!this.isHolding() &&
        inputter.isDown(inputter.RIGHT_ARROW)) {
      vector.x = MOVEMENT_SPEED;
    }

    this.center.x += vector.x;
    this.center.y += vector.y;
  }

  handleHolding () {
    const inputter = this.game.c.inputter;
    if (inputter.isPressed(inputter.ONE)) {
      this.toggleHolding();
    }
  }

  toggleHolding () {
    if (this.holding) {
      this.holding.toggleHolding(this);
      this.holding = undefined;
    } else {
      let nearestBlock = this.nearestBlock();
      nearestBlock.toggleHolding(this);
      this.holding = nearestBlock;
    }
  }

  isHolding () {
    return this.holding !== undefined;
  }

  handleMessagingBlockHolding () {
    if (!this.isHolding()) {
      return;
    }

    const inputter = this.game.c.inputter;

    if (inputter.isPressed(inputter.THREE)) {
      this.holding.message(inputter.THREE);
    }

    if (inputter.isDown(inputter.LEFT_ARROW)) {
      this.holding.message(inputter.LEFT_ARROW);
    }

    if (inputter.isDown(inputter.RIGHT_ARROW)) {
      this.holding.message(inputter.RIGHT_ARROW);
    }
  }

  nearestBlock () {
    return this.game.block;
  }

  collision (other) {

  }

  draw (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.center.x - this.size.x / 2,
                 this.center.y - this.size.y / 2,
                 this.size.x,
                 this.size.y);

    if (this.isHolding()) {
      ctx.restore();
      ctx.strokeStyle = "#fa0";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(this.center.x, this.center.y);
      ctx.lineTo(this.holding.center.x, this.holding.center.y);
      ctx.closePath();
      ctx.stroke();
    }
  }
};
