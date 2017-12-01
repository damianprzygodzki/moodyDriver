'use strict';

const Utils = require('./Utils.js');
const Ws = require('rpi-ws281x-native');
const Color = require('color');

module.exports = class Light {
    constructor(length) {
        this.length = length;
        this.currentLoop = null;
        this.pixelData = new Uint32Array(this.length);
        
        // HARDWARE init
        Ws.init(length);
    }
    
    static reset() {
        Ws.reset();
    }
    
    getPixel(index) {
        return Color(Utils.parseHexColor(this.pixelData[index]));
    }
    
    /*
    *  @param Color color
    */
    solid(color) {
        for(var i = 0; i < this.length; i++){
            this.setPixel(i, color);
        }
    }
    
    /*
    *  @param Integer index
    *  @param Color color
    */
    setPixel(index, color) {
        this.pixelData[index] = Utils.rgb2Int(color.red(), color.green(), color.blue());
        Ws.render(this.pixelData);
    }
}
