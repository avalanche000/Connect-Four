"use strict";

import Canvas from "./canvas.js";
import Game from "./game.js";

const canvas = new Canvas("game");
const game = new Game(canvas, 9, 8, ["human", "computer", "computer"]);

window.addEventListener("resize", () => {
    canvas.resize();
    game.board.resize();
    game.board.draw(canvas);
    game.drawMousePiece();
});

document.getElementById("play").addEventListener("click", () => {
    document.getElementById("winner").innerHTML = "";
    document.getElementById("play").hidden = true;
    game.reset();
    game.start();
});

game.start();
