class Block {
  constructor (game, settings) {
    this.game = game;
    this.color = "#fff";
    this.zindex = 0;
    this.angle = 180;
    this.center = Maths.copyPoint(settings.center);
    this.size = { x: 20, y: 20 };

    this.attached = [];
  }

  update () {
    this.updateEngine();
  }

  updateEngine () {
    if (this.attached.length > 0) {
      const vector = Maths.vectorMultiply(Maths.angleToVector(this.angle), 2);

      [this].concat(this.attached).forEach(body => {
        body.center.x += vector.x;
        body.center.y += vector.y;
      });
    }
  }

  toggleAttach(body) {
    if (!this.attached.includes(body)) {
      this.attached.push(body);
    } else {
      this.attached.splice(this.attached.indexOf(body), 1);
    }
  }

  message (key) {
    const inputter = this.game.c.inputter;

    if (key === inputter.LEFT_ARROW) {
      this.angle -= 1;
    } else if (key === inputter.RIGHT_ARROW) {
      this.angle += 1;
    }
  }

  draw (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.center.x - this.size.x / 2,
                 this.center.y - this.size.y / 2,
                 this.size.x,
                 this.size.y);
  }
};
