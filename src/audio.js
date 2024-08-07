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
                reject({
                    error: 'Could not load audio file',
                    file: src.substring(src.lastIndexOf('/') + 1)
                });
            });
        });
    }
};
