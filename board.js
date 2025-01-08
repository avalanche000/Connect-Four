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
        [3, 0]
    ],
    // vertical
    [
        [0, 3],
        [0, 2],
        [0, 1],
        [0, 0],
        [0, -1],
        [0, -2],
        [0, -3]
    ],
    //  diagonal right-down
    [
        [-3, -3],
        [-2, -2],
        [-1, -1],
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3]
    ],
    // diagonal right-up
    [
        [-3, 3],
        [-2, 2],
        [-1, 1],
        [0, 0],
        [1, -1],
        [2, -2],
        [3, -3]
    ]
];
const colors = ["#ff0000", "#ffff00", "#00ff00", "#0000ff", "#00ffff"];
const cellSize = 60;
const pieceSize = 50;

function randomColor() {
    let hex = Math.floor(Math.random() * 16777216).toString(16);

    while (hex.length < 6) {
        hex = "0" + hex;
    }

    return "#" + hex;
}

function getColor(piece) {
    while (piece > colors.length) {
        colors.push(randomColor());
    }

    return colors[piece - 1];
}

class Board {
    constructor(canvas, width, height) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.pieceSize = pieceSize;
        this.pieceCount = 0;
        this.board = Array.from({ length: width }, () => Array.from({ length: height }, () => 0));

        if (this.width * this.cellSize > window.innerWidth) {
            this.cellSize = window.innerWidth / this.width;
            this.pieceSize = this.cellSize * 0.8;
        }
    }

    resize() {
        if (this.width * this.cellSize > window.innerWidth) {
            this.cellSize = window.innerWidth / this.width;
            this.pieceSize = this.cellSize * 0.8;
        } else {
            this.cellSize = cellSize;
            this.pieceSize = pieceSize;
        }
    }

    getOpenColumns() {
        const open = [];

        for (let column = 0; column < this.width; column++) {
            for (let row = 0; row < this.height; row++) {
                if (this.getPiece(column, row) === 0) {
                    open.push(column);
                    break;
                }
            }
        }

        return open;
    }

    reset() {
        this.pieceCount = 0;
        this.board = Array.from({ length: this.width }, () => Array.from({ length: this.height }, () => 0));
    }

    getPiece(column, row) {
        if (column < 0 || column >= this.width) return -1;
        if (row < 0 || row >= this.height) return -1;

        return this.board[column][row];
    }

    setPiece(column, row, piece) {
        if (column < 0 || column >= this.width) return;
        if (row < 0 || row >= this.height) return;

        this.board[column][row] = piece;
    }

    checkPattern(column, row, pattern, piece, returnPieces = false) {
        const offsetPattern = pattern.map(offset => [column + offset[0], row + offset[1]]);
        const pieces = offsetPattern.map(p => this.getPiece(...p));

        let count = 0;
        let countPieces = [];

        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i] === piece) {
                count++;
                countPieces.push(offsetPattern[i]);
            } else {
                count = 0;
                countPieces = [];
            }

            if (count === 4) return returnPieces ? countPieces : true;
        }

        return false;
    }

    checkWin(column, row, piece) {
        piece = piece ?? this.getPiece(column, row);

        for (let i = 0; i < patterns.length; i++) {
            if (this.checkPattern(column, row, patterns[i], piece)) return true;
        }

        return false;
    }

    checkTie() {
        return this.pieceCount === this.width * this.height;
    }

    getOpenRow(column) {
        let row = this.height - 1;

        while (this.getPiece(column, row) > 0) row--;

        return row;
    }

    posToBoard(posX, posY) {
        const rect = this.canvas.canvas.getBoundingClientRect();
        const scaleX = this.canvas.canvas.width / rect.width;
        const scaleY = this.canvas.canvas.height / rect.height;
        const offsetX = (this.canvas.canvas.width - this.width * this.cellSize) / 2;
        const offsetY = (this.canvas.canvas.height - this.height * this.cellSize) / 2;
        const x = (posX - rect.left - offsetX) * scaleX;
        const y = (posY - rect.top - offsetY) * scaleY;
        const column = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        return [column, row];
    }

    draw() {
        this.canvas.clear();

        const boardWidth = this.width * this.cellSize;
        const boardHeight = this.height * this.cellSize;
        const boardX = (this.canvas.canvas.width - boardWidth) / 2;
        const boardY = (this.canvas.canvas.height - boardHeight) / 2;

        for (let column = 0; column < this.width; column++) {
            for (let row = 0; row < this.height; row++) {
                const pieceX = boardX + column * this.cellSize;
                const pieceY = boardY + row * this.cellSize;
                const cellColor = (column + row) % 2 === 0 ? "#f0f0f0" : "#cccccc";
                const piece = this.getPiece(column, row);

                this.canvas.drawRect(pieceX, pieceY, this.cellSize, this.cellSize, cellColor);

                if (piece > 0) {
                    this.canvas.drawCircle(
                        pieceX + this.cellSize / 2,
                        pieceY + this.cellSize / 2,
                        this.pieceSize / 2,
                        getColor(piece)
                    );
                }
            }
        }
    }
}

export default Board;
export { getColor };
