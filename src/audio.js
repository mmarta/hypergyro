const AudioSystem = {
    bgm: null,
    playerFire: null,
    playerZap: null,
    alienZap: null,
    context: null,
    controlContext: null,
    async init() {
        Graphics.printString(Graphics.displayContext, 'Loading Audio...', 8, 16, 6);
        this.bgm = await this.loadAudioFile('audio/hypergyro-bgm.mp3', false, true);
        this.playerFire = await this.loadAudioFile('audio/player-fire.mp3', false, false);
        this.playerZap = await this.loadAudioFile('audio/player-zap.mp3', false, false);
        this.alienZap = await this.loadAudioFile('audio/alien-zap.mp3', false, false);
    },
    update() {
        if(!this.context) return;

        if(this.oscillators.playerFire) {
            if(this.oscillators.playerFire.frequency.value === 300) {
                this.oscillators.playerFire.stop();
                this.oscillators.playerFire = null;
            } else this.oscillators.playerFire.frequency.setValueAtTime(this.oscillators.playerFire.frequency.value - 10, this.context.currentTime);
        }
    },
    loadAudioFile(src, isMusic, loop) {
        const audioFile = new Howl({
            src: [src],
            html5: isMusic,
            loop
        });

        return new Promise((resolve, reject) => {
            audioFile.once('load', () => {
                resolve(audioFile);
            });

            audioFile.once('loaderror', () => {
                reject(`Couldn't load audio file: ${src}`);
            });
        });

        /*
        const audioElement = document.createElement('audio');
        return new Promise((resolve, reject) => {
            audioElement.addEventListener('loadeddata', () => {
                resolve(audioElement);
            });
            audioElement.addEventListener('error', () => {
                reject(`Couldn't load audio file: ${src}`);
            });
            audioElement.src = src;
        });
        */
    }
};
