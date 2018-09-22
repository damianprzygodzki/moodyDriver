'use strict';

const Color = require('color');

module.exports = class Animation {
    constructor (light, script, frameDuration) {
        this.frame = 0;
        this.frameDuration = frameDuration;
        this.light = light;

        this.frameAction = function(frameNo, lightLength, setPixel, getPixel, Color){
            eval(script);
        };
    }

    stop () {
        clearInterval(this.loop);
    }

    start () {
        this.frame = 0;

        this.loop = setInterval(() => {
            this.frameAction().bind(
                this, this.frame, this.light.length, this.light.setPixel, this.light.getPixel, Color
            );
            this.frame++;
        }, this.frameDuration);
    }
}
