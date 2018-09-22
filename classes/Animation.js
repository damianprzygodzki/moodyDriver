'use strict';

module.exports = class Animation {
    constructor (light, script, frameDuration) {
        this.frame = 0;
        this.frameDuration = frameDuration;
        this.light = light;

        this.frameAction = function(frameNo, lightLength, setPixel, getPixel){
            eval(script);
        }.bind(this, this.frame, this.light.length, this.light.setPixel, this.light.getPixel);
    }

    stop () {
        clearInterval(this.loop);
    }

    start () {
        this.frame = 0;

        this.loop = setInterval(() => {
            this.frameAction(this.frame, this.light);
            this.frame++;
        }, this.frameDuration);
    }
}
