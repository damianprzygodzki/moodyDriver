'use strict';

const Utils = require('./Utils.js');
const Color = require('color');

module.exports = class Animations {
    
    static randomPixelIteration(light) {
        const black = Color("#000000");
        
        for(var i = 0; i < light.length; i++){
            light.setPixel(i, Utils.getRandomColor());
            Utils.sleep(50);
            light.setPixel(i, black);
        }
    }
    
    static fade(light, to, from) {
        const range = 20;
        for(var i = 1; i <= range; i++){
            light.solid(Color(from).mix(Color(to), i / range));
        }
    }
    
    static christmas(frame, light) {
        const red = Color("#ff003d");
        const green = Color("#00ab4c");
        const i = frame % 2;
        for(var j = 0; j < light.length; j++) {
            light.setPixel(j, (j + i) % 2 ? red : green);
        }
    }
    
    static glitter(frame, light) {
        
        for(var j = 0; j < light.length; j++) {
            const rand = Utils.getRandom(0, 10);
            
            light.setPixel(j, Color('#000000').mix(Color('#ffffff'), rand / 10));
        }
    }
}