const Control = {
    codes: {},
    touchPos: null,
    controller: null,
    touchEndedToStart: false,
    TOUCH_LEFT: -1,
    TOUCH_CENTER: 0,
    TOUCH_RIGHT: 1,
    init() {
        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            this.press(e.which);
        });

        window.addEventListener('keyup', (e) => {
            e.preventDefault();
            if(e.which === 13 || e.which === 49)
                this.touchEndedToStart = true;
            this.release(e.which);
        });

        Graphics.display.addEventListener('touchstart', (e) => {
            e.preventDefault();

            const rect = Graphics.display.getBoundingClientRect();
            this.setTouchPos(
                e.targetTouches[0].clientX - rect.left,
                e.targetTouches[0].clientY - rect.top
            );
        });

        Graphics.display.addEventListener('touchend', (e) => {
            e.preventDefault();
            if(!e.targetTouches[0]) {
                this.touchEndedToStart = true;
                this.touchPos = null;
            }
        });

        Graphics.display.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if(this.touchPos !== null) {
                const rect = Graphics.display.getBoundingClientRect();
                this.setTouchPos(
                    e.touches[0].clientX - rect.left,
                    e.touches[0].clientY - rect.top
                );
            }
        });

         setTimeout(this.pollGamepads, 0);
    },
    setTouchPos(touchX, touchY) {
        const ratio = Graphics.screenW / Graphics.preRender.width;
        const relTouchX = touchX / ratio;
        if(relTouchX < 92) this.touchPos = this.TOUCH_LEFT;
        else if(relTouchX >= 132 && relTouchX < 224) this.touchPos = this.TOUCH_RIGHT;
        else this.touchPos = this.TOUCH_CENTER;
    },
    press(code) {
        this.codes[code] = true;
    },
    release(code) {
        this.codes[code] = false;
    },
    state(code) {
        if(this.codes[code] === undefined) this.codes[code] = false;
        return this.codes[code];
    },
    controllerAxis(axis) {
        if(navigator.getGamepads && navigator.getGamepads()[0])
            return navigator.getGamepads()[0].axes[axis];
        return 0;
    },
    controllerButton(button) {
        if(navigator.getGamepads && navigator.getGamepads()[0])
            return navigator.getGamepads()[0].buttons[button].pressed;
        return false;
    }
};
