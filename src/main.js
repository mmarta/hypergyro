(function() {
    const SPEED_TIMEOUT_RESTART = 600;
    let nextEnemyGen = 0, gameOverTimer = 0, gameStarted = false, speed = 1, speedUpdateTimeout;

    function resetEnemyGenTimer() {
        return nextEnemyGen = ((Math.random() * 20) >> 0) + 10;
    }

    function update() {
        let i;

        // Handle fullStretch updates
        if(Graphics.fullStretch) {
            if(Control.state(49)) Graphics.toggleFullStretch(false);
        } else {
            if(Control.state(50)) Graphics.toggleFullStretch(true);
        }

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

            if(
                Control.state(90) || Control.state(32) || Control.state(17) || Control.state(71)
                || Control.controllerButton(0) || Control.controllerButton(1)
                || Control.controllerButton(2) || Control.controllerButton(3)
                || Control.touchPos !== null
            ) {
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
            Graphics.printString(Graphics.playAreaContext, 'HyperGyro', 76, 32, 6);
            Graphics.printString(Graphics.playAreaContext, 'Controls', 80, 48, 1);
            Graphics.printString(Graphics.playAreaContext, 'Key Left, Key A,', 8, 64, 0);
            Graphics.printString(Graphics.playAreaContext, 'Controller Left,', 8, 72, 0);
            Graphics.printString(Graphics.playAreaContext, 'Touch Left', 8, 80, 0);
            Graphics.printString(Graphics.playAreaContext, 'Move Left', 144, 80, 4);

            Graphics.printString(Graphics.playAreaContext, 'Key Right, Key D,', 8, 96, 0);
            Graphics.printString(Graphics.playAreaContext, 'Controller Right,', 8, 104, 0);
            Graphics.printString(Graphics.playAreaContext, 'Touch Right', 8, 112, 0);
            Graphics.printString(Graphics.playAreaContext, 'Move Right', 136, 112, 4);

            Graphics.printString(Graphics.playAreaContext, 'Key Ctrl, Key Z,', 8, 128, 0);
            Graphics.printString(Graphics.playAreaContext, 'Key G, Key Spacebar,', 8, 136, 0);
            Graphics.printString(Graphics.playAreaContext, 'Controller Buttons', 8, 144, 0);
            Graphics.printString(Graphics.playAreaContext, '1-4, Touch', 8, 152, 0);
            Graphics.printString(Graphics.playAreaContext, 'Fire', 184, 152, 4);

            Graphics.printString(Graphics.playAreaContext, 'By Marc Marta', 60, 168, 2);
            Graphics.printString(Graphics.playAreaContext, 'Inspired by Japan', 44, 176, 4);
            Graphics.printString(Graphics.playAreaContext, 'Made in New York', 48, 184, 6);

            if(Graphics.useVsync)
                Graphics.printString(Graphics.playAreaContext, 'Using 60Hz Vsync', 48, 200, 4);
            else
                Graphics.printString(Graphics.playAreaContext, '60Hz Vsync Unavailable', 24, 200, 5);
        }

        Graphics.finishRender();
    }

    function gameLoop() {
        update();
        render();

        // Vsync, run next
        Graphics.nextFrame(gameLoop);
    }

    async function start() {
        Control.init();
        Graphics.init();
        Math3D.init();
        Background.init();

        try {
            await Graphics.loadGraphics();
            await Graphics.testAndSetRefreshMode();

            Graphics.nextFrame(gameLoop);
        } catch(ex) {
            console.error(ex);
        }
    }

    start();
})();
