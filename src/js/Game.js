"use strict";

import * as UTILS from "utils";

const patterns = [
  // horizontal (right)
  [
    [-3, 0],
    [-2, 0],
    [-1, 0],
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  // vertical (down)
  [
    // no need to check upwards because there should be nothing above when placed
    // [-3, 0],
    // [-2, 0],
    // [-1, 0],
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  // diagonal (right-down)
  [
    [-3, -3],
    [-2, -2],
    [-1, -1],
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
  ],
  // diagonal (right-up)
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

/**
 * Stores the board and player data and has methods to interact with the game
 */
class Game {
  constructor(width = 7, height = 6, numPlayers) {
    this.width = width;
    this.height = height;
    this.board = UTILS.arrayUtils.arrayOf(width * height, -1);
    this.numPlayers = numPlayers;
    this.pieceCount = 0;
    this.playerIndex = 0;
    this.finished = false;
    this.winner = -1;
  }

  /**
   * Gets the player number at any slot on the board
   * @param {number} column The column (left to right)
   * @param {number} row The row (top to bottom)
   * @returns {number} Returns the player number of the slot, if there is no token it returns -1, if the slot is outside the board it returns -2
   */
  getSlot(column, row) {
    if (column < 0 || column >= this.width || row < 0 || row >= this.height) {
      //   console.warn(
      //     `Tried to get slot outside of board <column=${column}, row=${row}>`
      //   );

      return -2;
    }

    return this.board[row * this.width + column];
  }

  /**
   * Sets the player number at any slot on the board
   * @param {number} column The column (left to right)
   * @param {number} row The row (top to bottom)
   * @param {number} value The player number
   */
  setSlot(column, row, value) {
    if (column < 0 || column >= this.width || row < 0 || row >= this.height) {
      //   console.warn(
      //     `Tried to set slot outside of board <column=${column}, row=${row}>`
      //   );

      return;
    }

    this.board[row * this.width + column] = value;
  }

  hasPiece(column, row) {
    return this.getSlot(column, row) >= 0;
  }

  isColumnOpen(column) {
    return this.getSlot(column, 0) === -1;
  }

  getOpenColumns() {
    return UTILS.arrayUtils
      .range(this.width)
      .filter((column) => this.isColumnOpen(column));
  }

  checkPattern(pattern, originColumn, originRow) {
    const originValue = this.getSlot(originColumn, originRow);
    const values = pattern.map((offset) =>
      this.getSlot(originColumn + offset[0], originRow + offset[1])
    );

    let counter = 0;
    for (let i = 0; i < values.length; i++) {
      counter = values[i] === originValue ? counter + 1 : 0;

      if (counter >= 4) return true;
    }

    return false;
  }

  checkWin(originColumn, originRow) {
    for (let i = 0; i < patterns.length; i++) {
      if (this.checkPattern(patterns[i], originColumn, originRow)) return true;
    }

    return false;
  }

  placePiece(column) {
    if (!this.isColumnOpen(column)) return;
    if (this.finished) return;

    let row = this.height - 1;
    while (this.getSlot(column, row) >= 0) row--;

    this.setSlot(column, row, this.playerIndex);

    this.pieceCount++;

    if (this.checkWin(column, row)) {
      this.finished = true;
      this.winner = this.playerIndex;
    } else if (this.pieceCount === this.width * this.height) {
      this.finished = true;
      this.winner = -3;
    } else {
      this.playerIndex = (this.playerIndex + 1) % this.numPlayers;
    }

    return [column, row];
  }

  reset() {
    this.board.fill(-1);
    this.pieceCount = 0;
    this.playerIndex = 0;
    this.finished = false;
    this.winner = -1;
  }
}

export default Game;
