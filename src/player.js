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
    this.handleAttaching();
    this.handleMessagingAttachedBlocks();
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

    if (!this.isAttached() &&
        inputter.isDown(inputter.LEFT_ARROW)) {
      vector.x = -MOVEMENT_SPEED;
    }

    if (!this.isAttached() &&
        inputter.isDown(inputter.RIGHT_ARROW)) {
      vector.x = MOVEMENT_SPEED;
    }

    this.center.x += vector.x;
    this.center.y += vector.y;
  }

  handleAttaching () {
    const inputter = this.game.c.inputter;
    if (inputter.isPressed(inputter.ONE)) {
      this.toggleAttach();
    }
  }

  toggleAttach () {
    if (this.attachedTo) {
      this.attachedTo.toggleAttach(this);
      this.attachedTo = undefined;
    } else {
      let nearestBlock = this.nearestBlock();
      nearestBlock.toggleAttach(this);
      this.attachedTo = nearestBlock;
    }
  }

  isAttached () {
    return this.attachedTo !== undefined;
  }

  handleMessagingAttachedBlocks () {
    if (!this.isAttached()) {
      return;
    }

    const inputter = this.game.c.inputter;
    if (inputter.isDown(inputter.LEFT_ARROW)) {
      this.attachedTo.message(inputter.LEFT_ARROW);
    }

    if (inputter.isDown(inputter.RIGHT_ARROW)) {
      this.attachedTo.message(inputter.RIGHT_ARROW);
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
  }
};
