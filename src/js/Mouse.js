"use strict";

const callbacks = {};

const Mouse = {
  x: 0,
  y: 0,
  down: false,
  on: (name, cb) => {
    if (callbacks[name] != null) {
      callbacks[name].push(cb);
    } else {
      callbacks[name] = [cb];
    }

    return () => Mouse.off(name, cb);
  },
  once: (name, cb) => {
    const wrapper = (...args) => {
      cb(...args);

      Mouse.off(name, wrapper);
    };

    if (callbacks[name] != null) {
      callbacks[name].push(wrapper);
    } else {
      callbacks[name] = [wrapper];
    }
  },
  off: (name, cb) => {
    callbacks[name] = callbacks[name].filter((x) => x !== cb);
  },
  trigger: (name, ...data) => {
    if (callbacks[name] != null) callbacks[name].forEach((cb) => cb(...data));
  },
};

window.addEventListener("mousedown", (event) => {
  Mouse.x = event.clientX;
  Mouse.y = event.clientY;
  Mouse.down = true;

  Mouse.trigger("down", event);
  Mouse.trigger("change", event);
});

window.addEventListener("mouseup", (event) => {
  Mouse.x = event.clientX;
  Mouse.y = event.clientY;
  Mouse.down = false;

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
