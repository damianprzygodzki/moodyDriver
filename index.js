'use strict';

const Light = require('./classes/Light.js');
const Connection = require('./classes/Connection.js');
const Settings = require('./classes/Settings.js');
const config = require('./config.json');

/*
*      PROCESS -----------------------------------------------------------------
*/

// Handling exit
process.on('SIGINT', () => {
    Light.reset();
    process.nextTick(() => {
        process.exit(0);
    });
});

/*
 *      HARDWARE ---------------------------------------------------------------
 */

const light = new Light(
    config.NUM_LEDS
);

/*
 *      CONNECTION -------------------------------------------------------------
 */

const conn = new Connection(
    config.NUM_LEDS,
    config.SERVER_URI,
    light
);
