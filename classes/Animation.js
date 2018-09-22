'use strict';

const Color = require('color');

module.exports = class Animation {
    constructor (light, script, frameDuration) {
        this.frame = 0;
        this.frameDuration = frameDuration;
        this.light = light;

        this.frameAction = function(Color, frameNo, lightLength, setPixel, getPixel){
            eval(script)
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
                this,
                Color,
                this.frame,
                this.light.length,
                this.setPixel.bind(this),
                this.light.getPixel.bind(this)
            );
            this.frame++;
        }, this.frameDuration);
    }
}
