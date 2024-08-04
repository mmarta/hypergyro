class Alien extends Object3D {
    constructor() {
        super();
        this.score = 1000;
        this.animTime = 0;
        this.w = 32;
        this.h = 32;
        this.willFire = false;
        this.fireTimeout = 0;
        this.speed = 0;
    }

    init(speed) {
        this.depth = Graphics.OBJECT_END_DEPTH - 1;
        this.pos = (Math.random() * 256) >> 0;
        this.x = Math3D.getX(this.pos, this.depth, this.w, this.h);
        this.y = Math3D.getY(this.pos, this.depth, this.w, this.h);

        this.speed = speed;
        this.willFire = (Math.random() * 2) >= 1;
        if(this.willFire) this.fireTimeout = ((Math.random() * 20) >> 0) + 10;

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
        this.animTime++;
        if(this.animTime >= 8) this.animTime = 0;
    }

    render() {
        if(!this.active) return;

        if(this.zapTime) Graphics.playAreaContext.fillStyle = '#ff8800';
        else Graphics.playAreaContext.fillStyle = '#ffff00';

        Graphics.playAreaContext.fillRect(this.x, this.y, this.w, this.h);
    }

    isCollidable() {
        return this.active && !this.zapTime;
    }
}

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
