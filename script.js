class Game {
  static isInit = false;

  /**
   * @private
   * @type {[number, number][]}
   */
  clickQueue = [];

  /**
   * @private
   * @type {[HTMLDivElement, HTMLDivElement, HTMLDivElement][][]}
   */
  cards = [];

  /**
   * @param {HTMLDivElement} gameContainer
   */
  constructor(gameContainer) {
    this.gameContainer = gameContainer;

    if (!Game.isInit) {
      Game.isInit = true;
      const alphanum = [
        ...[...Array(18)].map((_, index) => String.fromCharCode(index + 65)),
        ...[...Array(18)].map((_, index) => String.fromCharCode(index + 65)),
      ]
        .map((a) => [a, Math.random()])
        .sort(([, a], [, b]) => a - b)
        .map(([a]) => a);
      console.log(alphanum);
      for (let x = 0; x < 6; x += 1) {
        this.cards.push([]);
        const card = document.createElement('div');
        for (let y = 0; y < 6; y += 1) {
          const innerCard = document.createElement('div');
          innerCard.className = 'card';
          const frontCard = document.createElement('div');
          frontCard.classList = 'front';
          const backCard = document.createElement('div');
          backCard.classList = 'back';
          backCard.innerHTML = alphanum.splice(0, 1)[0];
          innerCard.appendChild(frontCard);
          innerCard.appendChild(backCard);
          card.appendChild(innerCard);
          innerCard.addEventListener('click', () => {
            if (this.clickQueue.length >= 2) return;
            this.clickQueue.push([x, y]);
            innerCard.classList.add('flipped');
            if (this.clickQueue.length < 2) return;
            const [lastTileX, lastTileY] =
              this.clickQueue[this.clickQueue.length - 2];
            if (
              this.cards[lastTileX][lastTileY][2].innerHTML !==
              backCard.innerHTML
            ) {
              setTimeout(() => {
                innerCard.classList.remove('flipped');
                this.cards[lastTileX][lastTileY][0].classList.remove('flipped');
                this.clickQueue.splice(0, 2);
              }, 1e3);
            } else {
              this.clickQueue.splice(0, 2);
            }
          });
          this.cards[x].push([innerCard, frontCard, backCard]);
        }
        this.gameContainer.appendChild(card);
      }
    }
  }
}

(() => {
  const gameContainer = document.querySelector('#game');
  const game = new Game(gameContainer);
})();
