'use strict';

const Color = require('color');

module.exports = class Animation {
    constructor (light, script, frameDuration) {
        this.frame = 0;
        this.frameDuration = frameDuration;
        this.light = light;

        this.frameAction = function(frameNo, lightLength, setPixel, getPixel, Color){
            const red = Color("#ff003d");
            const green = Color("#00ab4c");
            const i = frameNo % 2;
            for(var j = 0; j < lightLength; j++) {
                setPixel(j, (j + i) % 2 ? red : green);
            }
        };
    }

    stop () {
        clearInterval(this.loop);
    }

    setPixel (i, c) {
        this.light.setPixel(i, c);
    }

    start () {
        this.frame = 0;

        this.loop = setInterval(() => {
            this.frameAction.call(
                this, this.frame, this.light.length, this.setPixel.bind(this), this.light.getPixel, Color
            );
            this.frame++;
        }, this.frameDuration);
    }
}
