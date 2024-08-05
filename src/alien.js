class Alien extends Object3D {
    constructor() {
        super();
        this.animTime = 0;
        this.w = 32;
        this.h = 32;
        this.willFire = false;
        this.fireTimeout = 0;
        this.speed = 0;
        this.color = Alien.COLOR_PURPLE;
    }

    init(speed) {
        this.depth = Graphics.OBJECT_END_DEPTH - 1;
        this.pos = (Math.random() * 256) >> 0;
        this.x = Math3D.getX(this.pos, this.depth, this.w, this.h);
        this.y = Math3D.getY(this.pos, this.depth, this.w, this.h);

        this.speed = speed;
        this.color = (Math.random() * 4) >> 0;
        this.score = 200 * (this.color + 1);
        this.willFire = (Math.random() * 2) >= 1;
        if(this.willFire) this.fireTimeout = ((Math.random() * 20) >> 0) + 10;

        if(this.depth >= Graphics.SMALL_SCALE_MIN_DEPTH) this.sX = 64;
        else if(this.depth >= Graphics.MEDIUM_SCALE_MIN_DEPTH) this.sX = 32;
        else this.sX = 0;
        this.sX += this.setColorOffset();

        this.zapTime = 0;
        this.animTime = 0;
        this.active = true;
    }

    update() {
        if(!this.active) return;

        let i;

        if(this.zapTime) {
            switch(this.zapTime) {
                case 17:
                    this.active = false;
                    return;
            }
            this.zapTime++;
            return;
        }

        // Fire
        if(this.willFire) {
            if(this.fireTimeout) {
                this.willFire = false;
                i = AlienLaser.pool.length;
                while(i--) {
                    if(!AlienLaser.pool[i].active) {
                        AlienLaser.pool[i].init(this.pos, this.depth - 4, this.speed << 1);
                        break;
                    }
                }
            }
            else this.fireTimeout--;
        }

        this.depth -= this.speed;
        if(this.depth < 16) {
            this.active = false;
            return;
        }

        this.x = Math3D.getX(this.pos, this.depth, this.w, this.h);
        this.y = Math3D.getY(this.pos, this.depth, this.w, this.h);
        switch(this.sX) {
            case 64:
                if(this.depth < Graphics.SMALL_SCALE_MIN_DEPTH) this.sX = 32;
                this.sX += this.setColorOffset();
                break;
            case 32:
                if(this.depth < Graphics.MEDIUM_SCALE_MIN_DEPTH) this.sX = 0;
                this.sX += this.setColorOffset();
                break;
        }

        this.animTime++;
        if(this.animTime >= 8) this.animTime = 0;
    }

    setColorOffset() {
        return this.color * 96;
    }

    getFromRelPos(relPos) {
        if(relPos >= 8 && relPos < 24) return 480;
        else if(relPos >= 24 && relPos < 40) return 448;
        else if(relPos >= 40 && relPos < 56) return 416;
        else if(relPos >= 56 && relPos < 72) return 384;
        else if(relPos >= 72 && relPos < 88) return 352;
        else if(relPos >= 88 && relPos < 104) return 320;
        else if(relPos >= 104 && relPos < 120) return 288;
        else if(relPos >= 120 && relPos < 136) return 256;
        else if(relPos >= 136 && relPos < 152) return 224;
        else if(relPos >= 152 && relPos < 168) return 192;
        else if(relPos >= 168 && relPos < 184) return 160;
        else if(relPos >= 184 && relPos < 200) return 128;
        else if(relPos >= 200 && relPos < 216) return 96;
        else if(relPos >= 216 && relPos < 232) return 64;
        else if(relPos >= 232 && relPos < 248) return 32;
        else return 0;
    }

    render() {
        if(!this.active) return;

        if(this.zapTime) {
            Graphics.playAreaContext.fillStyle = '#ff8800';
            Graphics.playAreaContext.fillRect(this.x, this.y, this.w, this.h);
        } else {
            const relPos = Math3D.getRelativePos(this.pos);
            this.sY = this.getFromRelPos(relPos);

            Graphics.playAreaContext.drawImage(
                Graphics.spriteAlien,
                this.sX, this.sY, this.w, this.h,
                this.x, this.y, this.w, this.h
            )
        }

    }

    isCollidable() {
        return this.active && !this.zapTime;
    }
}

Alien.COLOR_PURPLE = 0;
Alien.COLOR_GREEN = 1;
Alien.COLOR_ORANGE = 2;
Alien.COLOR_YELLOW = 3;

Alien.pool = [
    new Alien(),
    new Alien(),
    new Alien(),
    new Alien()
];

Alien.initNext = function(speed) {
    let i = Alien.pool.length;
    while(i--) {
        if(!Alien.pool[i].active) {
            Alien.pool[i].init(speed);
            return;
        }
    }
}
