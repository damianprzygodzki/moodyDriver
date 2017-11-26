'use strict';

const Utils = require('./Utils.js');
const Color = require('color');

module.exports = class Animations {
    
    static randomPixelIteration(light) {
        const black = Color("#000000");
        
        for(var i = 0; i < light.length; i++){
            light.setPixel(i, Utils.getRandomColor());
            Utils.sleep(200);
            light.setPixel(i, black);
        }
    }
    
    static fade(light, to, from) {
        const range = 20;
        for(var i = 1; i <= range; i++){
            light.solid(Color(from).mix(Color(to), i / range));
        }
    }
    
    static christmas(light) {
        setInterval(() => {
            const red = Color("#ff003d");
            const green = Color("#00ab4c");
                
            for(var i = 0; i < 2; i++) {
                for(var j = 0; j < light.length; j++) {
                    light.setPixel(j, (j + i) % 2 ? red : green);
                }
                
                Utils.sleep(350);
            }
        }, 700);
    }
}