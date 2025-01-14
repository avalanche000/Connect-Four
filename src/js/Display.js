"use strict";

const patterns = [
  // horizontal
  [
    [-3, 0],
    [-2, 0],
    [-1, 0],
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  // vertical
  [
    [0, 3],
    [0, 2],
    [0, 1],
    [0, 0],
    [0, -1],
    [0, -2],
    [0, -3],
  ],
  //  diagonal right-down
  [
    [-3, -3],
    [-2, -2],
    [-1, -1],
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
  ],
  // diagonal right-up
  [
    [-3, 3],
    [-2, 2],
    [-1, 1],
    [0, 0],
    [1, -1],
    [2, -2],
    [3, -3],
  ],
];
const colors = ["#ff0000", "#ffff00", "#00ff00", "#0000ff", "#00ffff"];
const cellSize = 60;
const pieceSize = 48;

function randomColor() {
  let hex = Math.floor(Math.random() * 16777216).toString(16);

  while (hex.length < 6) {
    hex = "0" + hex;
  }

  return "#" + hex;
}

function getColor(piece) {
  while (piece >= colors.length) {
    colors.push(randomColor());
  }

  return colors[piece];
}

class Display {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    this.cellSize = cellSize;
    this.pieceSize = pieceSize;

    if (this.game.width * this.cellSize > window.innerWidth) {
      this.cellSize = window.innerWidth / this.game.width;
      this.pieceSize = this.cellSize * 0.8;
    }
  }

  get currentColor() {
    return getColor(this.game.playerIndex);
  }

  resize() {
    if (this.game.width * this.cellSize > window.innerWidth) {
      this.cellSize = window.innerWidth / this.game.width;
      this.pieceSize = this.cellSize * 0.8;
    } else {
      this.cellSize = cellSize;
      this.pieceSize = pieceSize;
    }
  }

  posToBoard(posX, posY) {
    const rect = this.canvas.canvas.getBoundingClientRect();
    const scaleX = this.canvas.canvas.width / rect.width;
    const scaleY = this.canvas.canvas.height / rect.height;
    const offsetX =
      (this.canvas.canvas.width - this.game.width * this.cellSize) / 2;
    const offsetY =
      (this.canvas.canvas.height - this.game.height * this.cellSize) / 2;
    const x = (posX - rect.left - offsetX) * scaleX;
    const y = (posY - rect.top - offsetY) * scaleY;
    const column = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);

    return [column, row];
  }

  draw() {
    this.canvas.clear();

    const boardWidth = this.game.width * this.cellSize;
    const boardHeight = this.game.height * this.cellSize;
    const boardX = (this.canvas.canvas.width - boardWidth) / 2;
    const boardY = (this.canvas.canvas.height - boardHeight) / 2;

    let pieceX;
    let pieceY;
    let cellColor;
    let piece;

    for (let column = 0; column < this.game.width; column++) {
      for (let row = 0; row < this.game.height; row++) {
        pieceX = boardX + column * this.cellSize;
        pieceY = boardY + row * this.cellSize;
        cellColor = (column + row) % 2 === 0 ? "#f0f0f0" : "#cccccc";
        piece = this.game.getSlot(column, row);

        this.canvas.drawRect(
          pieceX,
          pieceY,
          this.cellSize,
          this.cellSize,
          cellColor
        );

        if (piece >= 0)
          this.canvas.drawCircle(
            pieceX + this.cellSize / 2,
            pieceY + this.cellSize / 2,
            this.pieceSize / 2,
            getColor(piece)
          );
      }
    }
  }

  async animatePiece(column, row, time) {
    return new Promise((resolve) => {
      const playerNumber = this.game.getSlot(column, row);

      this.game.setSlot(column, row, -1);

      const boardWidth = this.game.width * this.cellSize;
      const boardHeight = this.game.height * this.cellSize;
      const boardX = (this.canvas.canvas.width - boardWidth) / 2;
      const boardY = (this.canvas.canvas.height - boardHeight) / 2;

      const x = boardX + column * this.cellSize;
      const y = boardY + row * this.cellSize;

      let startTime = Date.now();
      let currY;

      const animate = () => {
        currY =
          boardY -
          this.cellSize +
          (this.game.height + 1) *
            this.cellSize *
            ((Date.now() - startTime) / time) ** 2;

        if (currY >= y) {
          this.game.setSlot(column, row, playerNumber);

          resolve();

          return;
        }

        this.draw();
        this.canvas.drawCircle(
          x + this.cellSize / 2,
          currY + this.cellSize / 2,
          this.pieceSize / 2,
          getColor(playerNumber)
        );

        requestAnimationFrame(animate);
      };

      animate();
    });
  }
}

export default Display;
export { getColor };
