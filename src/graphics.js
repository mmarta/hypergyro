const Graphics = {
    display: document.getElementById('game-canvas'),
    displayContext: null,
    playArea: document.createElement('canvas'),
    playAreaContext: null,
    screenW: 0,
    screenH: 0,
    tate: null,
    useVsync: false,
    spritePlayer: null,
    spriteLaser: null,
    spriteAlienLaser: null,
    spriteAlien: null,
    spriteAlienZap: null,
    font: null,
    SMALL_SCALE_MIN_DEPTH: 128,
    MEDIUM_SCALE_MIN_DEPTH: 64,
    LARGE_SCALE_MIN_DEPTH: 1,
    OBJECT_START_DEPTH: 16,
    OBJECT_END_DEPTH: 192,
    BACKGROUND_END_DEPTH: 256,
    TARGET_REFRESH_HZ: 60,
    init() {
        this.displayContext = this.display.getContext('2d');
        this.playAreaContext = this.playArea.getContext('2d');
        this.playArea.width = 224;
        this.playArea.height = 224;
        window.addEventListener('resize', () => {
            this.displayResize();
        });
        this.displayResize();
    },
    testAndSetRefreshMode() {
        Graphics.printString(Graphics.displayContext, 'Testing Vsync...', 8, 24, 4);

        const now = Date.now();
        let frameCount = 0;

        return new Promise((resolve, reject) => {
            const refreshTester = () => {
                frameCount++;
                if(Date.now() - now < 1000) requestAnimationFrame(refreshTester);
                else {
                    if(frameCount >= this.TARGET_REFRESH_HZ - 5 && frameCount <= this.TARGET_REFRESH_HZ + 5) this.useVsync = true;
                    return resolve();
                }
            };
            requestAnimationFrame(refreshTester);
        });
    },
    nextFrame(fn) {
        if(this.useVsync) requestAnimationFrame(fn);
        else setTimeout(fn, 1000 / this.TARGET_REFRESH_HZ);
    },
    displayResize() {
        let wRatio, hRatio;
        this.tate = (window.innerHeight > window.innerWidth);

        if(this.tate) {
            this.display.width = 224;
            this.display.height = 256;
            wRatio = (window.innerWidth / this.display.width);
            hRatio = (window.innerHeight / this.display.height);
        } else {
            this.display.width = 320;
            this.display.height = 224;
            wRatio = (window.innerWidth / this.display.width);
            hRatio = (window.innerHeight / this.display.height);
        }

        if(wRatio < 1) wRatio = 1;
        if(hRatio < 1) hRatio = 1;

        const chosenRatio = (wRatio > hRatio) ? hRatio : wRatio;
        this.screenW = (this.display.width * chosenRatio) >> 0;
        this.screenH = (this.display.height * chosenRatio) >> 0;
        this.display.style.width = `${this.screenW}px`;
        this.display.style.height = `${this.screenH}px`;
    },
    loadImage(src) {
        const img = new Image();
        const promise = new Promise((resolve, reject) => {
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', () => reject({
                error: 'Could not load image',
                file: img.src.substring(img.src.lastIndexOf('/') + 1)
            }));
            img.src = src;
        });
        return promise;
    },
    async loadGraphics() {
        this.font = await this.loadImage('gfx/font.png');
        this.displayContext.fillStyle = '#000';
        this.displayContext.fillRect(0, 0, this.display.width, this.display.height);
        Graphics.printString(Graphics.displayContext, 'Loading Graphics...', 8, 8, 0);
        this.spritePlayer = await this.loadImage('gfx/hypergyro.png');
        this.spriteLaser = await this.loadImage('gfx/laser.png');
        this.spriteAlien = await this.loadImage('gfx/alien.png');
        this.spriteAlienLaser = await this.loadImage('gfx/alien-laser.png');
        this.spriteAlienZap = await this.loadImage('gfx/alien-zap.png');
    },
    printString(context, str, x, y, style) {
        for(let i = 0; i < str.length; i++)
            context.drawImage(
                this.font, (str.charCodeAt(i) - 32) << 3, style << 3, 8, 8,
                x + (i << 3), y, 8, 8
            );
    },
    printIntRight(context, num, x, y, style) {
        let digit;
        do {
            digit = num % 10;
            context.drawImage(
                this.font, ((digit + 16) << 3), style << 3, 8, 8,
                x, y, 8, 8
            );
            num = (num / 10) >> 0;
            x -= 8;
        } while(num > 0);
    },
    createPaddedHex(num) {
        let hex = num.toString(16);
        return hex.length == 1 ? `0${hex}` : hex;
    },
    createRandomColor() {
        return `#${this.createPaddedHex((Math.random() * 256) >> 0)}${this.createPaddedHex((Math.random() * 256) >> 0)}${this.createPaddedHex((Math.random() * 256) >> 0)}`;
    },
    drawStatsTate() {
        player.renderStatsTate();

        Graphics.printString(Graphics.displayContext, 'HI', 184, 0, 3);
        Graphics.printIntRight(Graphics.displayContext, System.hi, 216, 8, 4);

        Graphics.printString(Graphics.displayContext, '@2024', 44, 248, 0);
        Graphics.printString(Graphics.displayContext, 'Red Balltop', 92, 248, 6);
    },
    drawStatsYoko() {
        this.displayContext.fillStyle = '#00f';
        this.displayContext.fillRect(224, 0, 1, this.display.height);

        player.renderStatsYoko();

        Graphics.printString(Graphics.displayContext, 'HI', 232, 40, 3);
        Graphics.printIntRight(Graphics.displayContext, System.hi, 304, 48, 4);

        Graphics.printString(Graphics.displayContext, '@2024', 232, 192, 0);
        Graphics.printString(Graphics.displayContext, 'Red', 280, 192, 6);
        Graphics.printString(Graphics.displayContext, 'Balltop', 232, 200, 6);
    },
    clear() {
        // Clear Play Area
        this.playAreaContext.fillStyle = '#000';
        this.playAreaContext.fillRect(0, 0, this.playArea.width, this.playArea.height);

        this.displayContext.fillStyle = '#000';
        if(this.tate) {
            this.displayContext.fillRect(0, 0, this.display.width, 16);
            this.displayContext.fillRect(0, 16 + this.playArea.height, this.display.width, this.display.height - 16 - this.playArea.height);
        } else {
            // Clear yoko
            this.displayContext.fillRect(224, 0, this.display.width - 224, this.display.height);
        }
    },
    finishRender() {
        if(this.tate) {
            this.displayContext.drawImage(this.playArea, 0, 16, this.playArea.width, this.playArea.height);
            this.drawStatsTate();
        } else {
            this.displayContext.drawImage(this.playArea, 0, 0, this.playArea.width, this.playArea.height);
            this.drawStatsYoko();
        }
    }
};
