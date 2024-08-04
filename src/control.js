const Control = {
    codes: {},
    init() {
        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            this.press(e.which);
        });
        window.addEventListener('keyup', (e) => {
            e.preventDefault();
            this.release(e.which);
        });
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
    }
};
