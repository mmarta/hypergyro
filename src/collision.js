const Collision = {
    runAll() {
        let i, j;

        i = Alien.pool.length;
        while(i--) {
            j = player.lasers.length;
            while(j--) {
                if(player.lasers[j].active && Alien.pool[i].isCollidable()) {
                    if(this.check(player.lasers[j].pos, player.lasers[j].depth, Alien.pool[i].pos, Alien.pool[i].depth, 12, 4)) {
                        player.addScore(Alien.pool[i].score);
                        if(player.score > System.hi) System.hi = player.score;
                        Alien.pool[i].zapTime = 1;
                        player.lasers[j].active = false;
                        Alien.missed = 0;
                        break;
                    }
                }
            }

            if(player.isCollidable() && Alien.pool[i].isCollidable()) {
                if(this.check(player.pos, player.depth, Alien.pool[i].pos, Alien.pool[i].depth, 6, 2)) {
                    player.zapped = true;
                    AudioSystem.playerZap.play();
                    break;
                }
            }
        }

        i = AlienLaser.pool.length;
        while(i--) {
            if(player.isCollidable() && AlienLaser.pool[i].active) {
                if(this.check(player.pos, player.depth, AlienLaser.pool[i].pos, AlienLaser.pool[i].depth, 4, 3)) {
                    player.zapped = true;
                    AudioSystem.playerZap.play();
                    break;
                }
            }
        }
    },
    check(pos1, depth1, pos2, depth2, posBuffer, depthBuffer) {
        let posDistance = Math.abs(pos1 - pos2);
        if(posDistance > 128) posDistance = Math.abs(posDistance - 256)

        if(
            posDistance < posBuffer
            && depth1 + depthBuffer >= depth2 && depth2 + depthBuffer >= depth1
        ) return true;
        return false;
    }
}
