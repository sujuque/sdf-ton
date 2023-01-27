export type GestureCallbackFn = (gestureType: string, otherArgs?: any) => void;

class GestureHandler {
  TAP_THRESHOLD = 250; // milliseconds
  touchesLength = 0;
  touchesInAction: { [identifier: number]: Touch } = {};
  startTimeStamp!: number;
  callbackFn: GestureCallbackFn;

  constructor(callbackFn: GestureCallbackFn) {
    this.addEventListeners();
    this.callbackFn = callbackFn;
  }

  addEventListeners() {
    document.addEventListener(
      'touchstart',
      this.handleTouchStart.bind(this),
      false
    );
    document.addEventListener('touchmove', this.handleTouches, false);
    document.addEventListener('touchcancel', this.handleTouches, false);
    document.addEventListener(
      'touchend',
      this.handleTouchEnd.bind(this),
      false
    );
  }

  handleTouchStart(ev: TouchEvent) {
    // reset touchesInAction
    this.touchesInAction = {};
    this.touchesLength = ev.changedTouches.length;
    this.startTimeStamp = ev.timeStamp;

    for (let i = 0; i < this.touchesLength; i++) {
      const touch = ev.changedTouches[i];
      this.touchesInAction[touch.identifier] = touch;
    }
  }

  handleTouchEnd(ev: TouchEvent) {
    ev.preventDefault();

    switch (this.touchesLength) {
      case 1:
        this.handleOneTouch(ev);
        break;
      case 2:
        this.handleTwoTouches(ev);
        break;
      case 3:
        this.handleThreeTouches(ev);
        break;
      default:
        this.handleGestureNotSupported(ev);
        break;
    }
  }

  handleOneTouch(ev: TouchEvent) {
    const { timeStamp } = ev;
    // const { identifier } = ev.changedTouches[0];
    const deltaTime = timeStamp - this.startTimeStamp;

    if (deltaTime <= this.TAP_THRESHOLD) {
      this.callbackFn('tap');
    }
  }

  handleTwoTouches(ev: TouchEvent) {}

  handleThreeTouches(ev: TouchEvent) {}

  handleGestureNotSupported(ev: TouchEvent) {}

  handleTouches(ev: TouchEvent) {
    ev.preventDefault();
  }
}

export default GestureHandler;