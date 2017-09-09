'use strict';

const Utils = require('./Utils.js');
const Ws = require('rpi-ws281x-native');
const Color = require('color');

module.exports = class Light {
    constructor(length) {
        this.numLeds = length;
        this.currentLoop = null;
        this.pixelData = new Uint32Array(this.numLeds);
        
        // HARDWARE init
        Ws.init(this.numLeds);
    }
    
    static reset() {
        Ws.reset();
    }
    
    /*
    *  @param Color color
    */
    solid(color) {
        for(var i = 0; i < this.numLeds; i++){
            this.setPixel(i, color);
        }
    }
    
    /*
    *  @param String from
    *  @param String to
    */
    fadeMix(to, from) {
        const range = 20;
        for(var i = 1; i <= range; i++){
            this.solid(Color(from).mix(Color(to), i / range));
        }
    }
    
    initAnimation() {
        for(var i = 0; i < this.numLeds; i++) {
            const black = Color("rgb(0,0,0)");
            
            this.setPixel(i, black);
            
            setTimeout(() => {
                this.setPixel(i, Utils.getRandomColor());
            }, 50);
            
            Utils.sleep(50);
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
