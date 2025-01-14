"use strict";

import Canvas from "./Canvas.js";
import Game from "./Game.js";
import Display from "./Display.js";
import Mouse from "./Mouse.js";

const canvas = new Canvas("game");
const game = new Game(7, 6, 2);
const display = new Display(canvas, game);

async function getHumanMove() {
  return new Promise((resolve) => {
    canvas.drawCircle(
      Mouse.x,
      Mouse.y,
      display.pieceSize / 2,
      display.currentColor
    );

    const offMove = Mouse.on("move", () => {
      display.draw();
      canvas.drawCircle(
        Mouse.x,
        Mouse.y,
        display.pieceSize / 2,
        display.currentColor
      );
    });

    const offDown = Mouse.on("down", () => {
      const slot = display.posToBoard(Mouse.x, Mouse.y);

      if (slot[0] < 0 || slot[0] >= game.width || slot[1] > 0) return;

      offMove();
      offDown();

      resolve(slot[0]);
    });
  });
}

async function getComputerMove() {
  return Math.floor(Math.random() * 7);
}

async function getNextMove() {
  if (game.playerIndex === 0) {
    return getHumanMove();
  } else {
    return getComputerMove();
  }
}

async function turn() {
  const move = await getNextMove();
  const slot = game.placePiece(move);

  // if (slot != undefined) {
  //   await display.animatePiece(...slot, 700);
  // }

  display.draw();

  if (game.finished) {
    document.getElementById("winner").innerHTML =
      "Winner player " + game.playerIndex;

    Mouse.once("down", () => {
      document.getElementById("winner").innerHTML = "";
      game.reset();
      display.draw();
      requestAnimationFrame(turn);
    });
  } else requestAnimationFrame(turn);
}

display.draw();
turn();
