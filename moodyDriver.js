var socketClient = require('socket.io-client');
var ws = require('rpi-ws281x-native');
var ds = require('ds18b20');
var lcd = require('lcd');
var Color = require('color');
const config = require('./config.js');

console.log(config)

const serverUri = 'http://damianprzygodzki.pl:3100';
// const serverUri = 'http://192.168.10.6:3100';


/*
*      INIT -------------------------------------------------------------------
*/

// Data init
let container = [
    {
        id: 0,
        name: 'Small lamp'

    },
    {
        id: 1,
        name: 'LED bar (only test purposes)'
    }
];

const NUM_LEDS = 46;
let currentLoop = null;
let pixelData = new Uint32Array(NUM_LEDS);

// HARDWARE init
ws.init(NUM_LEDS);

/*
*      LED METHODS ------------------------------------------------------------
*/

function randomBlink(isSteadyColor) {
    var color = getRandomColor();
    setInterval(function() {
        for(var i=0; i < NUM_LEDS; i++){
            setPixel(i, !!isSteadyColor ? color : getRandomColor());
            sleep(1000);
        }
    }, 1000);
}

function fireplace(palette) {
    return setInterval(()=>{
        const id = getRandom(0,NUM_LEDS-1);
        setPixel(id, getRandomColorFromPalette(palette));
    }, 300);
}

function solid(color) {
    for(var i = 0; i < NUM_LEDS; i++){
        setPixel(i, Color(color));
    }
}

function renderAll(color,ids) {
    for(var i = 0; i < NUM_LEDS; i++) {
        if(ids === "all"){
            pixelData[i] = color;
        }else if(ids.indexOf(i) > -1){
            pixelData[i] = color;
        }
    }
    ws.render(pixelData);
}

function init() {
    for(var i = 0; i < NUM_LEDS; i++) {
        const black = Color("rgb(0,0,0)")
        if(i > 2){
            setPixel(i - 3, black);
        }
        if(i < NUM_LEDS - 3){
            setPixel(i, wheel(i));
        }
        sleep(20);
    }
}

/*
*      UTILITIES --------------------------------------------------------------
*/

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function parseHtmlColor(color) {
    color = color.substr(1);
    return parseInt(color,16);
}

function rgb2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setPixel(index,color) {
    pixelData[index] = rgb2Int(color.red(),color.green(),color.blue());
    ws.render(pixelData);
}

function getRandomColor() {
    return Color().rgb(getRandom(0,255),getRandom(0,255),getRandom(0,255));
}

function getRandomColorFromPalette(palette) {
    return Color(palette[getRandom(0, palette.length - 1)]);
}

/**
 *  From string with pallete
 *  it returns array with Color
 */
function getPalette(string) {
    let palette = string.split(",");

    return palette.map(item =>
        Color(item)
    )
}

function wheel(position) {
    let pos = parseInt((position / NUM_LEDS) * 255);

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


var io = socketClient.connect(serverUri, {reconnect: true});

init();

io.on('connect', () => {
    console.log('Connected to server: ' + serverUri);
    console.log('...');

    io.on('getLights', () => {
        console.log('> getLights occured');
        console.log('> initSuccess emitted');
        io.emit('initSuccess', container);
    });

    io.on('set', response => {
        console.log('> set occured');

        clearInterval(currentLoop);

        if(response.color.length === 1){
            solid(response.color[0]);

            container = container.map(item => {
                if(item.id == response.id){
                    return Object.assign({}, item, {
                        color: response.color
                    })
                }else{
                    return item
                }
            })
        }else{
            currentLoop = fireplace(response.color);
        }
    })
});
