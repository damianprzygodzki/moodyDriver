'use strict';

const Utils = require('./Utils.js');
const Ws = require('rpi-ws281x-native');
const Color = require('color');

module.exports = class Light {
    constructor(id, name, numLeds) {
        this.container = {
            id: id,
            name: name,
            color: Color('#000000')
        };
        this.numLeds = numLeds;
        this.currentLoop = null;
        this.pixelData = new Uint32Array(this.numLeds);

        // HARDWARE init
        Ws.init(this.numLeds);
    }

    getContainer() {
        return this.container;
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

    fireplace(palette) {
        return setInterval(() => {
            this.setPixel(
                Utils.getRandom(0,this.numLeds-1),
                Utils.getRandomColorFromPalette(palette)
            );
        }, 300);
    }

    initAnimation() {
        for(var i = 0; i < this.numLeds; i++) {
            const black = Color("rgb(0,0,0)");

            if(i > 2){
                this.setPixel(i - 3, black);
            }
            if(i < this.numLeds - 3){
                this.setPixel(i, this.wheel(i));
            }
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

    /*
     *  @param Integer position
     */
    wheel(position) {
        let pos = parseInt((position / this.numLeds) * 255);

        if(pos < 85) {
            return Color("rgb(" + (255 - pos * 3) + "," + 0 + "," + (pos * 3) + ")");
        } else if(pos < 170) {
            pos -= 85;
            return Color("rgb(" + 0 + "," +  (pos * 3) +","+ (255 - pos * 3) + ")");
        } else {
            pos -= 170;
            return Color("rgb(" + (pos * 3) + "," + (255 - pos * 3) +","+  0 + ")");
        }
    }

    responseHandler (response) {
        if(container.id == response.id){
            clearInterval(currentLoop);

            if(response.color.length === 1){
                this.fadeMix(container.color, response.color[0]);

                this.container = Object.assign({}, this.container, {
                    color: response.color[0]
                })
            }else{
                currentLoop = this.fireplace(response.color);
            }
        }
    }
}
