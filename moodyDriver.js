'use strict';

const Light = require('./classes/Light.js');
const Connection = require('./classes/Connection.js');
const config = require('./config.json');

/*
*      PROCESS ----------------------------------------------------------------
*/

// Handling exit
process.on('SIGINT', () => {
    Light.reset();
    process.nextTick(() => {
        process.exit(0);
    });
});

/*
 *      CONNECTION --------------------------------------------------------------
 */

const conn = new Connection(
    config.DEVICE_ID,
    config.NAME,
    config.NUM_LEDS,
    config.SERVER_URI
);
