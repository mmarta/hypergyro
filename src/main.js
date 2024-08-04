(function() {
    const SPEED_TIMEOUT_RESTART = 600;
    let nextEnemyGen = 0, gameOverTimer = 0, gameStarted = false, speed = 1, speedUpdateTimeout;

    function resetEnemyGenTimer() {
        return nextEnemyGen = ((Math.random() * 20) >> 0) + 10;
    }

    function update() {
        let i;

        if(gameStarted) {
            Collision.runAll();

            if(!player.active) {
                // Game Over
                if(gameOverTimer) {
                    gameOverTimer--;
                    if(!gameOverTimer) {
                        i = Alien.pool.length;
                        while(i--) Alien.pool[i].active = false;

                        i = AlienLaser.pool.length;
                        while(i--) AlienLaser.pool[i].active = false;

                        i = player.lasers.length;
                        while(i--) player.lasers[i].active = false;

                        Background.refresh();
                        gameStarted = false;
                    }
                } else gameOverTimer = 120;
            } else {
                nextEnemyGen--;
                if(nextEnemyGen === 0) {
                    Alien.initNext(speed);
                    nextEnemyGen = resetEnemyGenTimer();
                }

                Background.update();

                i = Alien.pool.length;
                while(i--) Alien.pool[i].update();

                i = AlienLaser.pool.length;
                while(i--) AlienLaser.pool[i].update();

                player.update();

                speedUpdateTimeout--;
                if(!speedUpdateTimeout) {
                    speed++;
                    speedUpdateTimeout = SPEED_TIMEOUT_RESTART;
                }
            }
        } else {
            Background.update();

            if(Control.state(90) || Control.state(32) || Control.state(17)) {
                player.start();
                nextEnemyGen = resetEnemyGenTimer();
                speed = 2;
                speedUpdateTimeout = SPEED_TIMEOUT_RESTART;
                Background.refresh();
                gameStarted = true;
            }
        }
    }

    function render() {
        let i;

        Graphics.clear();

        Background.render();

        if(gameStarted) {
            i = Alien.pool.length;
            while(i--) Alien.pool[i].render();

            i = AlienLaser.pool.length;
            while(i--) AlienLaser.pool[i].render();

            player.render();

            // Game over?
            if(gameOverTimer) Graphics.printString(Graphics.playAreaContext, 'Game Over', 76, 112, 4);
        } else {
            Graphics.printString(Graphics.playAreaContext, 'HyperGyro', 76, 96, 6);
            Graphics.printString(Graphics.playAreaContext, 'Left, A, TouchLeft', 8, 112, 0);
            Graphics.printString(Graphics.playAreaContext, 'Left', 184, 112, 4);
            Graphics.printString(Graphics.playAreaContext, 'Right, D, TouchRight', 8, 120, 0);
            Graphics.printString(Graphics.playAreaContext, 'Right', 176, 120, 4);
            Graphics.printString(Graphics.playAreaContext, 'Z, Space, Ctrl, Touch', 8, 128, 0);
            Graphics.printString(Graphics.playAreaContext, 'Fire', 184, 128, 4);
            Graphics.printString(Graphics.playAreaContext, 'Fire To Play', 64, 144, 0);

            Graphics.printString(Graphics.playAreaContext, 'Inspired by Japan', 44, 160, 4);
            Graphics.printString(Graphics.playAreaContext, 'Made in New York', 48, 168, 6);
        }

        Graphics.finishRender();
    }

    function gameLoop() {
        update();
        render();

        // Vsync, run next
        requestAnimationFrame(gameLoop);
    }

    async function start() {
        Control.init();
        Graphics.init();
        Math3D.init();
        Background.init();

        try {
            await Graphics.loadGraphics();

            requestAnimationFrame(gameLoop);
        } catch(ex) {
            console.error(ex);
        }
    }

    start();
})();
