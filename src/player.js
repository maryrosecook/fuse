class Player {
  constructor (game, settings) {
    this.game = game;
    this.color = "#f07";
    this.zindex = 0;
    this.angle = 180;
    this.center = Maths.copyPoint(settings.center);
    this.size = { x: 20, y: 20 };

    this.attached = [];
  }

  update () {
    this.handleMovement();
    this.handleHolding();
    this.handleAttaching();
    this.handleMessagingBlockHolding();
  }

  handleMovement () {
    const inputter = this.game.c.inputter;
    if (inputter.isDown(inputter.UP_ARROW)) {
      const vector = Maths.vectorMultiply(Maths.angleToVector(this.angle), 1);

      [this].concat(this.isHolding() ? this.holding() : []).forEach(body => {
        body.center.x += vector.x;
        body.center.y += vector.y;
      });
    }

    if (inputter.isDown(inputter.LEFT_ARROW)) {
      this.angle -= 3;
    }

    if (inputter.isDown(inputter.RIGHT_ARROW)) {
      this.angle += 3;
    }
  }

  handleHolding () {
    const inputter = this.game.c.inputter;
    if (inputter.isPressed(inputter.ONE)) {
      this.toggleAttached(this.nearestBlock(this));
    }
  }

  handleAttaching () {
    const inputter = this.game.c.inputter;
    if (!inputter.isPressed(inputter.TWO) ||
        !this.isHolding()) {
      return;
    }

    this.holding().toggleAttached(this.nearestBlock(this.holding()));
  }

  toggleAttached(other) {
    if (!this.attached.includes(other)) {
      this._attach(other);
      other._attach(this);
    } else {
      this._detach(other);
      other._detach(this);
    }
  }

  _attach (other) {
    this.attached.push(other);
  }

  _detach (other) {
    this.attached.splice(this.attached.indexOf(other), 1);
  }

  holding () {
    return this.attached[0];
  }

  isHolding () {
    return this.attached[0] !== undefined;
  }

  handleMessagingBlockHolding () {
    if (!this.isHolding()) {
      return;
    }

    const inputter = this.game.c.inputter;

    if (inputter.isPressed(inputter.THREE)) {
      this.holding().message(inputter.THREE);
    }

    if (inputter.isDown(inputter.FOUR)) {
      this.holding().message(inputter.FOUR);
    }

    if (inputter.isDown(inputter.FIVE)) {
      this.holding().message(inputter.FIVE);
    }
  }

  nearestBlock (block) {
    return this.game.c.entities.all(Block)
      .filter(other => block !== other)
      .sort((a, b) => {
        return Maths.distance(a.center, block.center) -
          Maths.distance(b.center, block.center);
      })[0];
  }

  draw (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.center.x - this.size.x / 2,
                 this.center.y - this.size.y / 2,
                 this.size.x,
                 this.size.y);

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.center.x, this.center.y);
    ctx.lineTo(this.center.x, this.center.y - this.size.y / 2);
    ctx.closePath();
    ctx.stroke();
  }
};
