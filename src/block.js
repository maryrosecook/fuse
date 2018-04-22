class Block {
  constructor (game, settings) {
    this.game = game;
    this.color = "#fff";
    this.zindex = 0;
    this.angle = 180;
    this.center = Maths.copyPoint(settings.center);
    this.size = { x: 20, y: 20 };
    this.type = settings.type;

    this.attached = [];
  }

  update () {
    this.updateEngine();
    this.updateGun();
    this.updateBullet();
  }

  updateEngine () {
    if (this.type !== "engine") {
      return;
    }

    if (!this.on) {
      return;
    }

    const vector = Maths.vectorMultiply(Maths.angleToVector(this.angle), 2);

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

  }

  updateBullet () {
    if (this.type !== "bullet") {
      return;
    }

    const vector = Maths.vectorMultiply(Maths.angleToVector(this.angle), 3);
    this.center.x += vector.x;
    this.center.y += vector.y;
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
      ctx.strokeStyle = "#fa0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.center.x, this.center.y);
      ctx.lineTo(block.center.x, block.center.y);
      ctx.closePath();
      ctx.stroke();
    });
  }
};
