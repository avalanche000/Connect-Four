"use strict";

let isDebugOn = true;

let count = 0;

const Debug = {
    log: (...args) => {
        if(isDebugOn) {
            console.log(`DEBUG |`, ...args);
            // count++;
        }
    },
    on: () => isDebugOn = true,
    off: () => isDebugOn = false
}

export default Debug;
