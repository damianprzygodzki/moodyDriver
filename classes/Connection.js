'use strict';

const os = require('os');
const socketClient = require('socket.io-client');
const Color = require('color');

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
            
            this.light.initAnimation();
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
            
            if(response.color.length === 1){
                this.light.fadeMix(this.container.color, response.color[0]);
                
                this.container = Object.assign({}, this.container, {
                    color: response.color[0]
                });
            }else{
                for(var i = 0; i < this.container.length; i++){
                    this.light.setPixel(i, Color(response.color[i] ? response.color[i] : "#000000"));
                }
            }
        })
    }
}
