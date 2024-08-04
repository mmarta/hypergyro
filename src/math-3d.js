const Math3D = {
    xRatios: new Array(256),
    yRatios: new Array(256),
    globalPos: 0,
    init() {
        // Load the sin/cos values
        for(let i = 0; i < this.xRatios.length; i++) {
            this.xRatios[i] = Math.sin(this.convertByteDegreesToRadians(i));
            this.yRatios[i] = Math.cos(this.convertByteDegreesToRadians(i));
        }
    },
    convertByteDegreesToRadians(byteDegrees) {
        return byteDegrees * Math.PI / 128;
    },
    getX(pos, depth, w, h) {
        pos = this.getRelativePos(pos); // Calc against globalPos
        let relativeDepth = (32 / depth) * 96;
        return ((relativeDepth * this.xRatios[pos]) >> 0) + 112 - (w >> 1);
    },
    getY(pos, depth, w, h) {
        pos = this.getRelativePos(pos); // Calc against globalPos
        let relativeDepth = (32 / depth) * 96;
        return ((relativeDepth * this.yRatios[pos]) >> 0) + 112 - (h >> 1);
    },
    getRelativePos(pos) {
        let returnPos = 256 - this.globalPos + pos;
        return returnPos >= 256 ? returnPos - 256 : returnPos;
    }
};
