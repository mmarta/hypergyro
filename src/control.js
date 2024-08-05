const Control = {
    codes: {},
    touchPos: null,
    controller: null,
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
            this.release(e.which);
        });

        Graphics.display.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = Graphics.display.getBoundingClientRect();
            this.setTouchPos(
                e.touches[0].clientX - rect.left,
                e.touches[0].clientY - rect.top
            );
        });

        Graphics.display.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchPos = null;
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
    setTouchPos(mouseX, mouseY) {
        const sectorWidth = Graphics.tate
            ? Graphics.screenW / 3
            : Graphics.screenW * (Graphics.playArea.width / Graphics.display.width) / 3;
        if(mouseX < sectorWidth) this.touchPos = this.TOUCH_LEFT;
        else if(mouseX < sectorWidth * 2) this.touchPos = this.TOUCH_CENTER;
        else this.touchPos = this.TOUCH_RIGHT;
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
        if(navigator.getGamepads && navigator.getGamepads().length > 0)
            return navigator.getGamepads()[0].axes[axis];
        return 0;
    },
    controllerButton(button) {
        if(navigator.getGamepads && navigator.getGamepads().length > 0)
            return navigator.getGamepads()[0].buttons[button].pressed;
        return false;
    }
};
