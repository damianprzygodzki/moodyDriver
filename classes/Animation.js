'use strict';

const Color = require('color');

module.exports = class Animation {
    constructor (light, script, frameDuration) {
        this.frame = 0;
        this.frameDuration = frameDuration;
        this.light = light;

        this.frameAction = function(Color, frameNo, lightLength, setPixel, getPixel){
            eval(script);
            this.light.fetch();
        };
    }

    stop () {
        clearInterval(this.loop);
    }

    setPixel (i, c) {
        this.light.setPixel(i, c);
    }

    getPixel (i) {
        this.light.getPixel(i);
    }

    start () {
        this.frame = 0;

        this.loop = setInterval(() => {
            try{
                this.frameAction.call(
                    this,
                    Color,
                    this.frame,
                    this.light.length,
                    this.setPixel.bind(this),
                    this.getPixel.bind(this)
                );
            }
            catch (e) {
                console.log(e);
                this.stop();
            }
            this.frame++;
        }, this.frameDuration);
    }
}
