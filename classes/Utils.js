'use strict';
const Color = require('color');

module.exports = class Utils {

    static sleep(delay) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
    }

    static parseHtmlColor(color) {
        color = color.substr(1);
        return parseInt(color,16);
    }

    static rgb2Int(r, g, b) {
        return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
    }

    static getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getRandomColor() {
        return Color().rgb(
            this.getRandom(0,255),
            this.getRandom(0,255),
            this.getRandom(0,255)
        );
    }
}
