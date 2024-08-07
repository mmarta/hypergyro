(function() {
    const SPEED_TIMEOUT_RESTART = 900;
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

            if(player.zapped || Alien.missed >= 10) {
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

                        player.active = false;

                        Background.refresh();
                        gameStarted = false;
                    }
                } else {
                    gameOverTimer = 120;
                    AudioSystem.bgm.stop();
                }
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

            if(Control.touchEndedToStart) Control.touchEndedToStart = false;
        } else {
            Background.update();

            if(
                Control.state(90) || Control.state(32) || Control.state(17) || Control.state(71)
                || Control.controllerButton(0) || Control.controllerButton(1)
                || Control.controllerButton(2) || Control.controllerButton(3)
                || Control.touchEndedToStart
            ) {
                Control.touchEndedToStart = false;
                player.start();
                Alien.missed = 0;
                nextEnemyGen = resetEnemyGenTimer();
                speed = 2;
                speedUpdateTimeout = SPEED_TIMEOUT_RESTART;
                Background.refresh();
                AudioSystem.bgm.play();
                gameStarted = true;
            }
        }
    }

    function render() {
        let i;

        Graphics.clear();

        Background.render();

        if(gameStarted) {
            if(Alien.missed >= 6 && Alien.missed < 10 && !gameOverTimer)
                Graphics.printString(Graphics.playAreaContext, 'Zap Something!', 56, 48, 2);

            i = Alien.pool.length;
            while(i--) Alien.pool[i].render();

            i = AlienLaser.pool.length;
            while(i--) AlienLaser.pool[i].render();

            player.render();

            // Game over?
            if(gameOverTimer) {
                if(Alien.missed >= 10)
                    Graphics.printString(Graphics.playAreaContext, 'Missed 10!', 72, 48, 2);
                else
                    Graphics.printString(Graphics.playAreaContext, 'Zapped!!', 80, 48, 2);
                Graphics.printString(Graphics.playAreaContext, 'Game Over', 76, 112, 4);
            }
        } else {
            Graphics.printString(Graphics.playAreaContext, 'HyperGyro', 76, 16, 6);
            Graphics.printString(Graphics.playAreaContext, 'Controls', 80, 32, 1);
            Graphics.printString(Graphics.playAreaContext, 'Key Left, Key A,', 8, 48, 0);
            Graphics.printString(Graphics.playAreaContext, 'Controller Left,', 8, 56, 0);
            Graphics.printString(Graphics.playAreaContext, 'Touch Left', 8, 64, 0);
            Graphics.printString(Graphics.playAreaContext, 'Move Left', 144, 64, 4);

            Graphics.printString(Graphics.playAreaContext, 'Key Right, Key D,', 8, 80, 0);
            Graphics.printString(Graphics.playAreaContext, 'Controller Right,', 8, 88, 0);
            Graphics.printString(Graphics.playAreaContext, 'Touch Right', 8, 96, 0);
            Graphics.printString(Graphics.playAreaContext, 'Move Right', 136, 96, 4);

            Graphics.printString(Graphics.playAreaContext, 'Key Ctrl, Key Z,', 8, 112, 0);
            Graphics.printString(Graphics.playAreaContext, 'Key G, Key Spacebar,', 8, 120, 0);
            Graphics.printString(Graphics.playAreaContext, 'Controller Buttons', 8, 128, 0);
            Graphics.printString(Graphics.playAreaContext, '1-4, Touch', 8, 136, 0);
            Graphics.printString(Graphics.playAreaContext, 'Fire', 184, 136, 4);

            Graphics.printString(Graphics.playAreaContext, 'Fire or tap-release to start', 0, 152, 4);

            Graphics.printString(Graphics.playAreaContext, 'By Marc Marta', 60, 168, 2);
            Graphics.printString(Graphics.playAreaContext, 'Howler.js - Audio Handling', 8, 176, 2);
            Graphics.printString(Graphics.playAreaContext, 'Inspired by Japan', 44, 184, 4);
            Graphics.printString(Graphics.playAreaContext, 'Made in New York', 48, 192, 6);

            if(Graphics.useVsync)
                Graphics.printString(Graphics.playAreaContext, 'Using 60Hz Vsync', 48, 208, 4);
            else
                Graphics.printString(Graphics.playAreaContext, '60Hz Vsync Unavailable', 24, 208, 5);
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
            await AudioSystem.init();
            await Graphics.testAndSetRefreshMode();

            Graphics.nextFrame(gameLoop);
        } catch(ex) {
            console.error(ex);
        }
    }

    start();
})();
