"use strict";

let isDebugOn = true;

let count = 0;

const Debug = {
    log: (...args) => {
        if(isDebugOn) {
            console.debug(...args);
            // count++;
        }
    },
    on: () => isDebugOn = true,
    off: () => isDebugOn = false
}

export default Debug;
