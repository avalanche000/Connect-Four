"use strict";

class Canvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setColor(color) {
        this.context.fillStyle = color;
        this.context.strokeStyle = color;
    }

    setLineWidth(lineWidth) {
        this.context.lineWidth = lineWidth;
    }

    drawRect(x, y, width, height, color) {
        if (color) this.setColor(color);
        this.context.beginPath();
        this.context.rect(x, y, width, height);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
    }

    drawCircle(x, y, radius, color) {
        if (color) this.setColor(color);
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
    }

    drawLine(x1, y1, x2, y2, color) {
        if (color) this.setColor(color);
        this.context.beginPath();
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.closePath();
        this.context.stroke();
    }

    fill(color) {
        if (color) this.setColor(color);
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default Canvas;
