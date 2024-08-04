class BackgroundStar {
    constructor(pos, depth, color) {
        this.pos = (Math.random() * 256) >> 0;
        this.depth = (Math.random() * 256) >> 0;
        this.x = Math3D.getX(this.pos, this.depth, 1, 1);
        this.y = Math3D.getY(this.pos, this.depth, 1, 1);
        this.color = Graphics.createRandomColor();
    }

    refresh() {
        this.depth = 255;
        this.pos = (Math.random() * 256) >> 0;
        this.x = Math3D.getX(this.pos, this.depth, 1, 1);
        this.y = Math3D.getY(this.pos, this.depth, 1, 1);
        this.color = Graphics.createRandomColor();
    }

    render() {
        Graphics.playAreaContext.fillStyle = this.color;
        Graphics.playAreaContext.fillRect(this.x, this.y, 1, 1);
    }
}

const Background = {
    stars: new Array(40),
    init() {
        for(let i = 0; i < this.stars.length; i++) {
            this.stars[i] = new BackgroundStar();
        }
    },
    refresh() {
        for(let i = 0; i < this.stars.length; i++) {
            this.stars[i].pos = (Math.random() * 256) >> 0;
            this.stars[i].depth = (Math.random() * 256) >> 0;
            this.stars[i].x = Math3D.getX(this.pos, this.depth, 1, 1);
            this.stars[i].y = Math3D.getY(this.pos, this.depth, 1, 1);
            this.stars[i].color = Graphics.createRandomColor();
        }
    },
    update() {
        for(let i = 0; i < this.stars.length; i++) {
            this.stars[i].depth -= (i < 20 ? 8 : 4);
            if(this.stars[i].depth <= 16) this.stars[i].refresh();
            else {
                this.stars[i].x = Math3D.getX(this.stars[i].pos, this.stars[i].depth, 1, 1);
                this.stars[i].y = Math3D.getY(this.stars[i].pos, this.stars[i].depth, 1, 1);
            }
        }
    },
    render() {
        for(let i = 0; i < this.stars.length; i++) this.stars[i].render();
        //this.stars[0].render();
    }
};
