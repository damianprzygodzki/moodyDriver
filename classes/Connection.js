'use strict';

const os = require('os');
const socketClient = require('socket.io-client');
const Color = require('color');
const Animations = require('./Animations.js');

module.exports = class Connection {
    constructor(length, uri, light) {
        this.container = {
            id: os.hostname(),
            length: length,
            color: Color('#000000')
        };
        
        this.uri = uri;
        this.io = socketClient.connect(this.uri, {reconnect: true});
        this.light = light;
        this.initHandlers();
    }
    
    initHandlers() {
        this.io.on('connect', () => {
            console.log('Connected to server: ' + this.uri + '\n...');
            
            Animations.randomPixelIteration(this.light);
        });
        
        this.io.on('getLights', () => {
            console.log('> getLights occured \n> initSuccess emitted');
            
            this.io.emit('initSuccess', this.container);
        });
        
        this.io.on('set', response => {
            if(JSON.stringify(this.container.id) !== JSON.stringify(response.id)){
                return;
            }
            
            console.log('> set occured');
            
            switch(response.type) {
                case 'solid':
                    Animations.fade(this.light, this.container.color, response.value[0]);
                    
                    this.container = Object.assign({}, this.container, {
                        color: response.value[0]
                    });
                    
                    break;
                case 'animation':
                    Animations[response.name](light);
                    break;
                case 'single':
                    for(var i = 0; i < this.container.length; i++){
                        this.light.setPixel(i, Color(response.color[i] ? response.color[i] : "#000000"));
                    }
                    break;
            }
        })
    }
}
