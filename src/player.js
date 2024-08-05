class Player extends Object3D {
    constructor() {
        super();
        this.depth = 32;
        this.w = 32;
        this.h = 32;
        this.sX = 32;

        this.animTime = 0;
        this.dir = null;
        this.score = 0;
        this.multiplier = 1;
        this.multiplierTimer = 0;
        this.laserButton = false;
        this.laserAutofireTime = 0;
        this.lasers = [
            new PlayerLaser(),
            new PlayerLaser(),
            new PlayerLaser()
        ]
    }

    start() {
        this.active = true;
        this.animTime = 0;
        this.dir = Player.DIR_STRAIGHT;
        this.sY = 0;
        this.x = Math3D.getX(this.pos, this.depth, this.w, this.h);
        this.y = Math3D.getY(this.pos, this.depth, this.w, this.h);
        this.score = 0;
        this.multiplier = 1;
        this.multiplierTimer = 0;
        this.laserAutofireTime = 0;
    }

    input() {
        if(
            Control.state(37) || Control.state(65)
            || Control.controllerAxis(0) < -0.7
            || Control.touchPos === Control.TOUCH_LEFT
        ) {
            if(this.dir !== Player.DIR_LEFT) {
                this.sY = 64;
                this.dir = Player.DIR_LEFT;
            }
            this.pos -= 2;
            if(this.pos < 0) this.pos = 254;
            Math3D.globalPos = this.pos;
        } else if(
            Control.state(39) || Control.state(68)
            || Control.controllerAxis(0) > 0.7
            || Control.touchPos === Control.TOUCH_RIGHT
        ) {
            if(this.dir !== Player.DIR_RIGHT) {
                this.sY = 32;
                this.dir = Player.DIR_RIGHT;
            }
            this.pos += 2;
            if(this.pos >= 256) this.pos = 0;
            Math3D.globalPos = this.pos;
        } else if(this.dir !== Player.DIR_STRAIGHT) {
            this.sY = 0;
            this.dir = Player.DIR_STRAIGHT;
        }

        // Key/controller manual fire
        if(
            Control.state(90) || Control.state(32) || Control.state(17)
            || Control.controllerButton(0) || Control.controllerButton(1)
            || Control.controllerButton(2) || Control.controllerButton(3)
        ) {
            if(!this.laserButton) {
                for(let i = 0; i < this.lasers.length; i++) {
                    if(!this.lasers[i].active) {
                        this.lasers[i].init(this.pos, this.depth);
                        break;
                    }
                }
                this.laserButton = true;
            }
        } else if(this.laserButton) this.laserButton = false;

        // Touch autofire
        if(Control.touchPos !== null) {
            if(!this.laserAutofireTime) {
                for(let i = 0; i < this.lasers.length; i++) {
                    if(!this.lasers[i].active) {
                        this.lasers[i].init(this.pos, this.depth);
                        break;
                    }
                }
            }
            this.laserAutofireTime++;
            if(this.laserAutofireTime >= 8) this.laserAutofireTime = 0;
        } else if(this.laserAutofireTime) this.laserAutofireTime = 0;
    }

    addScore(score) {
        this.score += (score * this.multiplier);
        if(this.multiplier < 50) this.multiplier++;
        this.multiplierTimer = 60;
    }

    update() {
        for(let i = 0; i < this.lasers.length; i++)
            this.lasers[i].update();

        if(!this.active) return;

        this.input();

        switch(this.animTime) {
            case 0:
                this.sX = 32;
                break;
            case 4:
            case 12:
                this.sX = 64;
                break;
            case 8:
                this.sX = 96;
                break;
        }

        if(this.multiplier > 1) {
            if(!this.multiplierTimer) {
                this.multiplier--;
                if(this.multiplier > 1) this.multiplierTimer = 60;
            }
            this.multiplierTimer--;
        }

        this.animTime++;
        if(this.animTime >= 16) this.animTime = 0;
    }

    render() {
        for(let i = 0; i < this.lasers.length; i++)
            this.lasers[i].render();

        if(!this.active) return;

        Graphics.playAreaContext.drawImage(
            Graphics.spritePlayer, this.sX, this.sY, this.w, this.h,
            this.x, this.y, this.w, this.h
        );
    }

    isCollidable() {
        return this.active;
    }

    renderStatsTate() {
        Graphics.printString(Graphics.displayContext, 'SCORE', 8, 0, 6);
        Graphics.printIntRight(Graphics.displayContext, this.score, 56, 8, 4);

        Graphics.printString(Graphics.displayContext, 'MULTIPLIER', 52, 240, 1);
        Graphics.printString(Graphics.displayContext, 'X', 140, 240, 4);
        Graphics.printIntRight(Graphics.displayContext, this.multiplier, 164, 240, 4);
    }

    renderStatsYoko() {
        Graphics.printString(Graphics.displayContext, 'SCORE', 232, 8, 6);
        Graphics.printIntRight(Graphics.displayContext, this.score, 304, 16, 4);

        Graphics.printString(Graphics.displayContext, 'MULTIPLIER', 232, 160, 1);
        Graphics.printString(Graphics.displayContext, 'X', 280, 168, 4);
        Graphics.printIntRight(Graphics.displayContext, this.multiplier, 304, 168, 4);
    }
}
Player.DIR_STRAIGHT = 0;
Player.DIR_LEFT = -1;
Player.DIR_RIGHT = 1;

const player = new Player();
