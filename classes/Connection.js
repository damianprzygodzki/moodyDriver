const socketClient = require('socket.io-client');
const Light = require('./Light.js');

module.exports = class Connection {
    constructor(id, name, numLeds, uri) {
        this.uri = uri;
        this.io = socketClient.connect(this.uri, {reconnect: true});
        this.light = new Light(id, name, numLeds);

        this.io.on('connect', () => {
            console.log('Connected to server: ' + this.uri + '\n...');

            this.light.initAnimation();
            this.light.clock();
        });

        this.io.on('getLights', () => {
            console.log('> getLights occured \n> initSuccess emitted');

            this.io.emit('initSuccess', this.light.getContainer());
        });

        this.io.on('set', response => {
            console.log('> set occured');

            this.light.responseHandler(response)
        })
    }
}
