'use strict';

const Light = require('./classes/Light.js');
const Connection = require('./classes/Connection.js');
const Save = require('./classes/Save.js');
const config = require('./config.json');

/*
*      PROCESS -----------------------------------------------------------------
*/

// Handling exit
process.on('SIGINT', () => {
    Light.reset();
    Save.save(JSON.stringify(conn.getResponse()));
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
