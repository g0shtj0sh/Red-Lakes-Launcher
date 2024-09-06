'use strict';

class Slider {
    constructor(id, minValue, maxValue) {
        this.startX = 0;
        this.x = 0;

        this.slider = document.querySelector(id);
        this.touchLeft = this.slider.querySelector('.slider-touch-left');
        this.touchRight = this.slider.querySelector('.slider-touch-right');
        this.lineSpan = this.slider.querySelector('.slider-line');

        this.min = parseFloat(this.slider.getAttribute('min')) || 0;
        this.max = parseFloat(this.slider.getAttribute('max')) || 100;

        this.minValue = minValue !== undefined ? minValue : this.min;
        this.maxValue = maxValue !== undefined ? maxValue : this.max;

        this.step = parseFloat(this.slider.getAttribute('step')) || 1;

        this.normalizeFact = 18;

        this.maxX = this.slider.offsetWidth - this.touchRight.offsetWidth;
        this.selectedTouch = null;

        this.reset();

        this.setMinValue(this.minValue);
        this.setMaxValue(this.maxValue);

        this.touchLeft.addEventListener('mousedown', (event) => { this.onStart(this.touchLeft, event) });
        this.touchRight.addEventListener('mousedown', (event) => { this.onStart(this.touchRight, event) });
        this.touchLeft.addEventListener('touchstart', (event) => { this.onStart(this.touchLeft, event) });
        this.touchRight.addEventListener('touchstart', (event) => { this.onStart(this.touchRight, event) });
    }

    reset() {
        this.touchLeft.style.left = '0px';
        this.touchRight.style.left = (this.slider.offsetWidth - this.touchRight.offsetWidth) + 'px';
        this.lineSpan.style.marginLeft = '0px';
        this.lineSpan.style.width = (this.slider.offsetWidth - this.touchRight.offsetWidth) + 'px';
        this.startX = 0;
        this.x = 0;
    }

    setMinValue(minValue) {
        const ratio = (minValue - this.min) / (this.max - this.min);
        this.touchLeft.style.left = Math.ceil(ratio * (this.slider.offsetWidth - this.touchLeft.offsetWidth)) + 'px';
        this.updateLine();
    }

    setMaxValue(maxValue) {
        const ratio = (maxValue - this.min) / (this.max - this.min);
        this.touchRight.style.left = Math.ceil(ratio * (this.slider.offsetWidth - this.touchRight.offsetWidth)) + 'px';
        this.updateLine();
    }

    onStart(elem, event) {
        event.preventDefault();

        this.x = elem === this.touchLeft ? this.touchLeft.offsetLeft : this.touchRight.offsetLeft;
        this.startX = (event.pageX || event.touches[0].pageX) - this.x;
        this.selectedTouch = elem;

        this.func1 = (event) => { this.onMove(event) };
        this.func2 = (event) => { this.onStop(event) };

        document.addEventListener('mousemove', this.func1);
        document.addEventListener('mouseup', this.func2);
        document.addEventListener('touchmove', this.func1);
        document.addEventListener('touchend', this.func2);
    }

    onMove(event) {
        this.x = (event.pageX || event.touches[0].pageX) - this.startX;

        if (this.selectedTouch === this.touchLeft) {
            if (this.x > this.touchRight.offsetLeft - this.selectedTouch.offsetWidth - 24)
                this.x = this.touchRight.offsetLeft - this.selectedTouch.offsetWidth - 24;
            else if (this.x < 0)
                this.x = 0;

            this.selectedTouch.style.left = this.x + 'px';
        } else if (this.selectedTouch === this.touchRight) {
            if (this.x < this.touchLeft.offsetLeft + this.touchLeft.offsetWidth + 24)
                this.x = this.touchLeft.offsetLeft + this.touchLeft.offsetWidth + 24;
            else if (this.x > this.maxX)
                this.x = this.maxX;

            this.selectedTouch.style.left = this.x + 'px';
        }

        this.updateLine();
    }

    onStop(event) {
        document.removeEventListener('mousemove', this.func1);
        document.removeEventListener('mouseup', this.func2);
        document.removeEventListener('touchmove', this.func1);
        document.removeEventListener('touchend', this.func2);

        this.selectedTouch = null;
        this.calculateValue();
    }

    updateLine() {
        const left = parseInt(this.touchLeft.style.left);
        const right = parseInt(this.touchRight.style.left);
        this.lineSpan.style.marginLeft = left + 'px';
        this.lineSpan.style.width = (right - left) + 'px';
        this.calculateValue();
    }

    calculateValue() {
        const range = this.max - this.min;
        const minLeft = parseInt(this.touchLeft.style.left);
        const maxLeft = parseInt(this.touchRight.style.left);

        const minRatio = minLeft / (this.slider.offsetWidth - this.touchLeft.offsetWidth);
        const maxRatio = maxLeft / (this.slider.offsetWidth - this.touchRight.offsetWidth);

        const newMinValue = Math.round((minRatio * range + this.min) / this.step) * this.step;
        const newMaxValue = Math.round((maxRatio * range + this.min) / this.step) * this.step;

        this.minValue = newMinValue;
        this.maxValue = newMaxValue;

        this.emit('change', this.minValue, this.maxValue);
    }

    on(name, func) {
        this.func = this.func || {};
        this.func[name] = func;
    }

    emit(name, ...args) {
        if (this.func && this.func[name]) this.func[name](...args);
    }
}

export default Slider;
