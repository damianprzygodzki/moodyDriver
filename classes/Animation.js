module.exports = class Animation {
    constructor = (light, frameAction, frameDuration) => {
        this.frame = 0;
        this.frameAction = frameAction;
        this.frameDuration = frameDuration;
        this.light = light;
    }
    
    stop = () => {
        clearInterval(this.loop);
    }
    
    start = () => {
        this.frame = 0;
        
        this.loop = setInterval(() => {
            this.frameAction(this.frame, this.light);
            this.frame++;
        }, this.frameDuration);
    }
}