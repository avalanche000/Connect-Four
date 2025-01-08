"use strict";

import Mouse from "./mouse.js";
import Board, { getColor } from "./board.js";
import { humanMove, computerMove } from "./player.js";

class Game {
    constructor(canvas, width, height, players) {
        this.canvas = canvas;
        this.board = new Board(canvas, width, height);
        this.players = players;
        this.playerIndex = 0;
        this.playing = false;
        this.doAnimate = true;
        this.animating = false;

        this.board.draw();
    }

    getPlayer(column, row) {
        return this.players[this.board.getPiece(column, row) - 1];
    }

    reset() {
        this.playerIndex = 0;
        this.animating = false;
        this.board.reset();
    }

    makeMove() {
        if (this.players[this.playerIndex] === "human") {
            humanMove(this);
        } else {
            computerMove(this);
        }
    }

    async turn(column) {
        const row = this.board.getOpenRow(column);

        if (this.doAnimate) {
            this.animating = true;
            await this.animatePiece(column, row, 70 * (row + 1));
            this.animating = false;
        }

        this.board.setPiece(column, row, this.playerIndex + 1);
        this.board.draw();

        if (this.board.checkWin(column, row)) {
            document.getElementById("winner").innerHTML = `Player ${this.playerIndex + 1} Wins!`;
            document.getElementById("play").hidden = false;
            this.playing = false;
        } else if (this.board.checkTie()) {
            document.getElementById("winner").innerHTML = "It's a Tie.";
            document.getElementById("play").hidden = false;
            this.playing = false;
        } else if (this.playing) {
            this.playerIndex = (this.playerIndex + 1) % this.players.length;

            requestAnimationFrame(() => this.makeMove());
        }
    }

    start() {
        if (this.playing) return;

        this.playing = true;

        this.makeMove();
    }

    animatePiece(column, row, time) {
        const boardWidth = this.board.width * this.board.cellSize;
        const boardHeight = this.board.height * this.board.cellSize;
        const boardX = (this.canvas.canvas.width - boardWidth) / 2;
        const boardY = (this.canvas.canvas.height - boardHeight) / 2;
        const pieceX = boardX + column * this.board.cellSize;
        const pieceY = boardY - this.board.cellSize;
        const targetY = boardY + row * this.board.cellSize;
        const startTime = Date.now();

        return new Promise((resolve) => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / time;

                if (progress < 1) {
                    const animY = pieceY + (targetY - pieceY) * progress;

                    this.board.draw();
                    this.canvas.drawCircle(
                        pieceX + this.board.cellSize / 2,
                        animY + this.board.cellSize / 2,
                        this.board.pieceSize / 2,
                        getColor(this.playerIndex + 1)
                    );

                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            animate();
        });
    }

    drawMousePiece() {
        if (!this.playing || this.animating || this.players[this.playerIndex] !== "human") return;

        this.canvas.drawCircle(
            Mouse.x,
            Mouse.y,
            this.board.pieceSize / 2,
            getColor(this.playerIndex + 1)
        );
    }
}

export default Game;
