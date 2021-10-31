// @ts-check

class Game {
  static isInit = false;

  /**
   * @private
   * @type {[number, number] | null}
   */
  lastClicked = null;

  /**
   * @private
   * @type {[HTMLDivElement, HTMLDivElement, HTMLDivElement][][]}
   */
  cards = [];

  confetti = null;

  /**
   * @param {HTMLDivElement} gameContainer
   */
  constructor(gameContainer) {
    this.gameContainer = gameContainer;
    if (!Game.isInit) {
      this.confetti = new JSConfetti();
      Game.isInit = true;
      /** @type {string[]} */
      const alphanum = [
        ...[...Array(18)].map((_, index) => String.fromCharCode(index + 65)),
        ...[...Array(18)].map((_, index) => String.fromCharCode(index + 65)),
      ]
        .map(
          /** @returns {[string, number]} */
          (a) => [a, Math.random()],
        )
        .sort(([, a], [, b]) => a - b)
        .map(([a]) => a);
      for (let x = 0; x < 6; x += 1) {
        this.cards.push([]);
        const card = document.createElement('div');
        for (let y = 0; y < 6; y += 1) {
          const innerCard = document.createElement('div');
          innerCard.className = 'card';
          const frontCard = document.createElement('div');
          frontCard.classList.add('front');
          const backCard = document.createElement('div');
          backCard.classList.add('back');
          backCard.innerHTML = alphanum.splice(0, 1)[0];
          innerCard.appendChild(frontCard);
          innerCard.appendChild(backCard);
          card.appendChild(innerCard);

          innerCard.addEventListener('click', () => {
            if (innerCard.classList.contains('flipped')) return;
            innerCard.classList.add('flipped', 'selected');
            if (!this.lastClicked) {
              this.lastClicked = [x, y];
              return;
            }
            if (this.lastClicked[0] === x && this.lastClicked[1] === y) return;
            const [lastX, lastY] = this.lastClicked;
            this.lastClicked = null;
            innerCard.classList.remove('selected');
            this.cards[lastX][lastY][0].classList.remove('selected');
            if (this.cards[lastX][lastY][2].innerHTML !== backCard.innerHTML) {
              setTimeout(() => {
                innerCard.classList.remove('flipped');
                this.cards[lastX][lastY][0].classList.remove('flipped');
              }, 1e3);
            } else {
              if (this.checkAllFlipped()) {
                this.confetti.addConfetti();
              }
            }
          });
          this.cards[x].push([innerCard, frontCard, backCard]);
        }
        this.gameContainer.appendChild(card);
      }
      console.log(
        this.cards
          .map((cards) => cards.map((card) => card[2].innerHTML).join(' '))
          .join('\n'),
      );
    }
  }

  checkAllFlipped = () =>
    this.cards.flat().every(([, , a]) => a.classList.contains('flipped'));
}

(() => {
  /** @type {HTMLDivElement} */
  const gameContainer = document.querySelector('#game');
  const game = new Game(gameContainer);
})();
