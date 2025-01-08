"use strict";

const callbacks = {};

const Mouse = {
    x: 0,
    y: 0,
    on: (name, cb) => {
        if (callbacks[name] != null) {
            callbacks[name].push(cb);
        } else {
            callbacks[name] = [cb];
        }
    },
    off: (name, cb) => {
        callbacks[name] = callbacks[name].filter(x => x !== cb);
    },
    trigger: (name, ...data) => callbacks[name] != null && callbacks[name].forEach(cb => cb(...data))
}

window.addEventListener("mousedown", (event) => {
    Mouse.x = event.clientX;
    Mouse.y = event.clientY;

    Mouse.trigger("down", event);
    Mouse.trigger("change", event);
});

window.addEventListener("mouseup", (event) => {
    Mouse.x = event.clientX;
    Mouse.y = event.clientY;

    Mouse.trigger("up", event);
    Mouse.trigger("change", event);
});

window.addEventListener("mousemove", (event) => {
    Mouse.x = event.clientX;
    Mouse.y = event.clientY;

    Mouse.trigger("move", event);
    Mouse.trigger("change", event);
});

export default Mouse;
