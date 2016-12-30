'use strict';

const socketClient = require('socket.io-client');
const config = require('./config.json');
const Light = require('./Light.js');

/*
*      PROCESS ----------------------------------------------------------------
*/

// Handling exit
process.on('SIGINT', function () {
    ws.reset();
    process.nextTick(function () { process.exit(0); });
});

/*
*      SERVER ----------------------------------------------------------------
*/

const io = socketClient.connect(config.SERVER_URI, {reconnect: true});

io.on('connect', () => {
    console.log('Connected to server: ' + config.SERVER_URI);
    console.log('...');

    const light = new Light(config.DEVICE_ID, config.NAME, config.NUM_LEDS);
    light.initAnimation();

    io.on('getLights', () => {
        console.log('> getLights occured');
        console.log('> initSuccess emitted');
        io.emit('initSuccess', light.getContainer());
    });

    io.on('set', response => {
        console.log('> set occured');

        light.responseHandler(response)
    })
});
