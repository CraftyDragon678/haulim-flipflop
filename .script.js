class Game {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    canvas.width = this.width = 600;
    canvas.height = this.height = 600;
    this.ctx = canvas.getContext('2d');
    /**
     * @typedef {Object} MouseLocation
     * @property {number} x
     * @property {number} y
     */
    /**
     * @type {MouseLocation}
     */
    this.mouse = {
      x: 50,
      y: 50,
    };

    this.onmovemouse = this.onmovemouse.bind(this);
    this.onclickmouse = this.onclickmouse.bind(this);
    this.draw = this.draw.bind(this);

    this.status = Array(6 * 6).fill(false);
    canvas.addEventListener('mousemove', this.onmovemouse);
    canvas.addEventListener('mousedown', this.onclickmouse);
  }

  /**
   *
   * @param {MouseEvent} event
   */
  onmovemouse(event) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;
  }

  /**
   *
   * @param {MouseEvent} event
   */
  onclickmouse(event) {
    this.status[
      Math.floor(this.mouse.x / 100) * 6 + Math.floor(this.mouse.y / 100)
    ] =
      !this.status[
        Math.floor(this.mouse.x / 100) * 6 + Math.floor(this.mouse.y / 100)
      ];
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let x = 0; x < 6; x += 1) {
      for (let y = 0; y < 6; y += 1) {
        this.ctx.fillStyle = this.status[x * 6 + y] ? 'red' : 'blue';
        this.ctx.fillRect(x * 100 + 5, y * 100 + 5, 90, 90);
      }
    }
    requestAnimationFrame(this.draw);
  }
}

(() => {
  /** @type HTMLCanvasElement */
  const canvas = document.querySelector('canvas#game');
  const game = new Game(canvas);
  game.draw();
})();
