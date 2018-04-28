class Block {
  constructor (game, settings) {
    this.game = game;
    this.zindex = 0;
    this.angle = settings.angle !== undefined ? settings.angle : 180;
    this.speed = settings.speed !== undefined ? settings.speed : 2;
    this.center = Maths.copyPoint(settings.center);
    this.size = { x: 15, y: 15 };
    this.type = settings.type;
    this.color = this.calculateColor();
    this.on = settings.on === true ? true : false;

    this.attached = [];
  }

  update () {
    this.updateEngine();
    this.updateGun();
    this.updateBomb();
  }

  updateEngine () {
    if (this.type !== "engine") {
      return;
    }

    if (!this.on) {
      return;
    }

    const vector = Maths.vectorMultiply(Maths.angleToVector(this.angle),
                                        this.speed);

    [this].concat(this.attached).forEach(body => {
      body.center.x += vector.x;
      body.center.y += vector.y;
    });
  }

  updateGun () {
    if (this.type !== "gun") {
      return;
    }

    if (!this.on) {
      return;
    }

    if (this.attached.length === 0) {
      this.turnTowards(this.game.player);
    }

    if (this.time === undefined) {
      this.time = Date.now();
      return;
    }

    if (Date.now() - this.time < 1000) {
      return;
    }

    this.time = Date.now();
    this.game.createMissile(
      Maths.vectorAdd(
        this.center,
        Maths.vectorMultiply(
          Maths.angleToVector(this.angle),
          this.size.x)),
      this.angle);
  }

  turnTowards (target) {
    let angleDifference = Maths.angleBetween(
      this.angle,
      Maths.vectorToAngle(Maths.vectorTo(target.center, this.center)));

    this.angle += angleDifference / Math.abs(angleDifference) * 0.8;
  }

  updateBomb () {
    if (this.type !== "bomb") {
      return;
    }
  }

  warpTo (point, other) {
    this.center = point;
    this.angle = other.angle;
  }

  collision (other) {
    if ((this.type !== "bomb" &&
         this.type !== "engine") ||
        this.isAttached(other)) {
      return;
    }

    other.destroy([]);
    this.destroy([]);
  }

  destroy (cascades) {
    if (cascades.includes(this)) {
      return;
    }

    cascades.push(this);
    this.game.c.entities.destroy(this);

    if (this.type === "bomb") {
      this.attached.forEach(block => block.destroy(cascades));
    }
  }

  isAttached(other) {
    return this.attached.includes(other);
  }

  toggleAttached(other) {
    if (!this.isAttached(other)) {
      this._attach(other);
      other._attach(this);
    } else {
      this._detach(other);
      other._detach(this);
    }
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

  message (key) {
    const inputter = this.game.c.inputter;

    if (key === inputter.THREE) {
      this.on = !this.on;
    }

    if (key === inputter.FOUR) {
      this.angle -= 1;
    }

    if (key === inputter.FIVE) {
      this.angle += 1;
    }
  }

  draw (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.center.x - this.size.x / 2,
                 this.center.y - this.size.y / 2,
                 this.size.x,
                 this.size.y);

    // draw orientation line
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.center.x, this.center.y);
    ctx.lineTo(this.center.x, this.center.y - this.size.y / 2);
    ctx.closePath();
    ctx.stroke();

    // draw attachment lines
    this.attached.forEach(block => {
      ctx.restore();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.center.x, this.center.y);
      ctx.lineTo(block.center.x, block.center.y);
      ctx.closePath();
      ctx.stroke();
    });
  }

  calculateColor() {
    return {
      gun: "gray",
      bomb: "red",
      engine: "orange"
    }[this.type];
  }
};
