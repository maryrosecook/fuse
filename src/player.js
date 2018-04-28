class Player {
  constructor (game, settings) {
    this.game = game;
    this.color = "#f07";
    this.zindex = 0;
    this.angle = 180;
    this.center = Maths.copyPoint(settings.center);
    this.size = { x: 15, y: 15 };

    this.attached = [];
  }

  update () {
    this.handleMovement();
    this.handleHolding();
    this.handleAttaching();
    this.handleMessagingBlockHolding();
  }

  handleMovement () {
    if (this.isHolding() &&
        this.holding().attached.length > 1) {
      return;
    }

    const inputter = this.game.c.inputter;
    if (inputter.isDown(inputter.UP_ARROW)) {
      const vector = Maths.vectorMultiply(Maths.angleToVector(this.angle), 1);

      [this].concat(this.isHolding() ? this.holding() : [])
        .forEach(body => {
          body.center.x += vector.x;
          body.center.y += vector.y;
        });
    }

    if (inputter.isDown(inputter.LEFT_ARROW)) {
      this.angle -= 3;
      this.rotateHoldingToMatch(-3);
    }

    if (inputter.isDown(inputter.RIGHT_ARROW)) {
      this.angle += 3;
      this.rotateHoldingToMatch(3);
    }
  }

  rotateHoldingToMatch (change) {
    if (!this.isHolding()) {
      return;
    }

    this.holding().angle = this.angle;
    this.holding().center = Maths.rotatePointAroundCenter(
      this.holding().center, this.center, change);
  }

  handleHolding () {
    const inputter = this.game.c.inputter;
    if (!inputter.isPressed(inputter.ONE)) {
      return;
    }

    if (inputter.isPressed(inputter.ONE)) {
      if (this.isHolding()) {
        this.toggleAttached(this.holding());
        return;
      }

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

  destroy () {
    if (this.isHolding()) {
      const other = this.holding();
      this._detach(other);
      other._detach(this);
    }

    this.game.c.entities.destroy(this);
  }

  warpTo (point, other) {
    this.center = point;
    this.angle = other.angle;
  }

  _attach (other) {
    this.warpTo(Maths.copyPoint(this.closestAttachPoint(other)),
                other);
    this.attached.push(other);
  }

  _detach (other) {
    this.attached.splice(this.attached.indexOf(other), 1);
  }

  attachablePoints() {
    return [
      Maths.vectorMultiply(Maths.angleToVector(this.angle + 0),
                           this.size.x),
      Maths.vectorMultiply(Maths.angleToVector(this.angle + 90),
                           this.size.x),
      Maths.vectorMultiply(Maths.angleToVector(this.angle + 180),
                           this.size.x),
      Maths.vectorMultiply(Maths.angleToVector(this.angle + 270),
                           this.size.x)

    ].map(point => {
      return Maths.vectorAdd(point, this.center);
    });
  }

  closestAttachPoint(other) {
    return other.attachablePoints()
      .sort((point1, point2) => {
        return Maths.distance(point1, this.center) -
          Maths.distance(point2, this.center);
      })[0];
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
    ctx.lineWidth = 2;

    if (this.isHolding()) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.center.x - this.size.x / 2,
                   this.center.y - this.size.y / 2,
                   this.size.x,
                   this.size.y);
    } else {
      ctx.strokeStyle = this.color;
      ctx.strokeRect(this.center.x - this.size.x / 2,
                     this.center.y - this.size.y / 2,
                     this.size.x,
                     this.size.y);
    }

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(this.center.x, this.center.y);
    ctx.lineTo(this.center.x, this.center.y - this.size.y / 2);
    ctx.closePath();
    ctx.stroke();
  }
};
