class Laser extends Object3D {
    constructor() {
        super();
        this.w = 16;
        this.h = 16;
    }

    init(pos, depth) {
        this.active = true;
        this.pos = pos;
        this.depth = depth;
        this.x = Math3D.getX(this.pos, this.depth, this.w, this.h);
        this.y = Math3D.getY(this.pos, this.depth, this.w, this.h);
        this.sX = 0;
    }
}

class PlayerLaser extends Laser {
    constructor() {
        super();
    }

    init(pos, depth) {
        super.init(pos, depth);
        AudioSystem.playerFire.stop();
        AudioSystem.playerFire.play();
        // AudioSystem.playerFire.pause();
        // AudioSystem.playerFire.currentTime = 0;
        // AudioSystem.playerFire.play();
    }

    update() {
        if(!this.active) return;

        this.depth += 4;
        if(this.depth > 192) {
            this.active = false;
            return;
        }

        this.x = Math3D.getX(this.pos, this.depth, this.w, this.h);
        this.y = Math3D.getY(this.pos, this.depth, this.w, this.h);
        switch(this.sX) {
            case 0:
                if(this.depth >= Graphics.MEDIUM_SCALE_MIN_DEPTH) this.sX = 16;
                break;
            case 16:
                if(this.depth >= Graphics.SMALL_SCALE_MIN_DEPTH) this.sX = 32;
                break;
        }
    }

    getFromRelPos(relPos) {
        if(relPos >= 8 && relPos < 24) return 112;
        else if(relPos >= 24 && relPos < 40) return 96;
        else if(relPos >= 40 && relPos < 56) return 80;
        else if(relPos >= 56 && relPos < 72) return 64;
        else if(relPos >= 72 && relPos < 88) return 48;
        else if(relPos >= 88 && relPos < 104) return 32;
        else if(relPos >= 104 && relPos < 120) return 16;
        else return 0;
    }

    render() {
        if(!this.active) return;

        const relPos = Math3D.getRelativePos(this.pos) % 128;
        this.sY = this.getFromRelPos(relPos);
        Graphics.playAreaContext.drawImage(
            Graphics.spriteLaser, this.sX, this.sY, this.w, this.h,
            this.x, this.y, this.w, this.h
        );
    }
}

class AlienLaser extends Laser {
    constructor() {
        super();
        this.speed = null;
        this.sY = 0;
    }

    init(pos, depth, speed) {
        super.init(pos, depth);
        this.speed = speed;
        if(this.depth < Graphics.MEDIUM_SCALE_MIN_DEPTH) this.sX = 0;
        else if(this.depth < Graphics.SMALL_SCALE_MIN_DEPTH) this.sX = 16;
        else this.sX = 32;
    }

    update() {
        if(!this.active) return;

        this.depth -= this.speed;
        if(this.depth < 16) {
            this.active = false;
            return;
        }

        this.x = Math3D.getX(this.pos, this.depth, this.w, this.h);
        this.y = Math3D.getY(this.pos, this.depth, this.w, this.h);
        switch(this.sX) {
            case 32:
                if(this.depth < Graphics.SMALL_SCALE_MIN_DEPTH) this.sX = 16;
                break;
            case 16:
                if(this.depth < Graphics.MEDIUM_SCALE_MIN_DEPTH) this.sX = 0;
                break;
        }
    }

    render() {
        if(!this.active) return;

        Graphics.playAreaContext.drawImage(
            Graphics.spriteAlienLaser, this.sX, this.sY, this.w, this.h,
            this.x, this.y, this.w, this.h
        );
    }
}

AlienLaser.pool = [
    new AlienLaser(),
    new AlienLaser(),
    new AlienLaser(),
    new AlienLaser()
];
