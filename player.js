"use strict";

import Mouse from "./mouse.js";

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function humanMove(game) {
    const draw = () => {
        game.board.draw();
        game.drawMousePiece();
    }

    const handleClick = () => {
        const [column, mouseRow] = game.board.posToBoard(Mouse.x, Mouse.y);

        if (mouseRow > 0) return;

        const row = game.board.getOpenRow(column);

        if (game.board.getPiece(column, row) === -1) return;

        Mouse.off("up", handleClick);
        Mouse.off("change", draw);

        game.turn(column);
    }

    Mouse.on("up", handleClick);
    Mouse.on("change", draw);

    draw();
}

function computerMove(game) {
    const choices = game.board.getOpenColumns();

    game.turn(randomChoice(choices));
}

export { humanMove, computerMove };
