export default class Resizable {
  element;
  target;
  handler;
  clickCounter = 0;
  options = {
    direction: 'both',
  };
  autoSized = true;

  constructor(element, options) {
    this.element = element;
    this.options = Object.assign(this.options, options);
    this.target = this.options.target
      ? this.element.querySelector(this.options.target)
      : this.element;
    this.handler = this.element.querySelector(this.options.handler);
    this.init();
  }

  init() {
    this.handler.addEventListener('mousedown', this.initDrag, false);
  }

  setInitialTargetSize() {
    const { width, height } = this.target.getBoundingClientRect();
    this.initialWidth = width;
    this.initialHeight = height;
  }

  setInitialPosition(x, y) {
    this.initX = x;
    this.initY = y;
  }

  initDrag = (event) => {
    event.preventDefault();

    this.clickCounter++;
    this.setInitialPosition(event.clientX, event.clientY);
    this.setInitialTargetSize();
    document.documentElement.addEventListener('mousemove', this.dragging, false);
    document.documentElement.addEventListener('mouseup', this.stopDrag, false);

    if (this.clickCounter === 1) {
      this.timer = setTimeout(() => {
        this.clickCounter = 0;
      }, 300);
    } else {
      clearTimeout(this.timer);
      this.stopDrag();
      this.autoSize();
      this.clickCounter = 0;
    }
  };

  autoSize = () => {
    if (this.autoSized) {
      this.target.style.height = '75px';
      this.autoSized = false;
    } else {
      this.autoSized = true;
      this.target.style.height = 'auto';
    }
  };

  dragging = (event) => {
    if (this.options.direction === 'horizontal' || this.options.direction === 'both') {
      const newWidth = this.initialWidth + event.clientX - this.initX;
      this.target.style.width = `${newWidth}px`;
    }
    if (this.options.direction === 'vertical' || this.options.direction === 'both') {
      const newHeight = this.initialHeight + event.clientY - this.initY;
      this.target.style.height = `${newHeight}px`;
    }
    this.autoSized = false;
  };

  stopDrag = (event) => {
    if (this.options.callbacks?.onStopDrag && this.clickCounter === 0) {
      const { width, height } = this.target.getBoundingClientRect();
      this.options.callbacks.onStopDrag({ event, width, height, autoSized: this.autoSized });
    }
    document.documentElement.removeEventListener('mousemove', this.dragging, false);
    document.documentElement.removeEventListener('mouseup', this.stopDrag, false);
  };
}
