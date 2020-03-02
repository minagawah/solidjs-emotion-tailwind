/** @prettier */

const noop = () => {};

export const useMouse = (params = {}) => {
  const { duration = 100, onMouseDown, onMouseUp, onMouseMove } = params;

  const mouse = {
    x: 0,
    y: 0,
  };

  let el;

  let inProgress = false;
  let start;
  let end;

  const clear = () => {
    start = end = void 0;
  };

  const executeCallback = (cb, args) => {
    if (typeof cb === 'function') {
      cb(args);
    }
  };

  const assignPosition = (f = noop) => (o, event) => {
    if (f && o) {
      const { x = 0, y = 0 } = f(event) || {};
      o.x = x;
      o.y = y;
    }
  };

  /*
   * =======================================
   * Mouse Events
   * =======================================
   */

  const getMousePosition = event => {
    if (!el || !event) return;

    let x;
    let y;

    if (event.pageX || event.pageY) {
      x = event.pageX;
      y = event.pageY;
    } else {
      x =
        event.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft;
      y =
        event.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop;
    }
    x -= el.offsetLeft;
    y -= el.offsetTop;

    return { x, y };
  };

  const mouseDownHandler = event => {
    if (!el) return;
    event.preventDefault();

    assignPosition(getMousePosition)(mouse, event);
    executeCallback(onMouseDown, event);
  };

  const mouseUpHandler = event => {
    if (!el) return;
    event.preventDefault();

    executeCallback(onMouseUp, event);
  };

  const mouseMoveHandler = event => {
    if (!el) return;

    assignPosition(getMousePosition)(mouse, event);
    executeCallback(onMouseMove, event);
  };

  /*
   * =======================================
   * Touche Events
   * =======================================
   */

  const getTouchPosition = event => {
    if (!el || !event || !inProgress) return;

    let x;
    let y;

    const { touches = [] } = event;
    const [touch = {}] = touches;

    x = touch.clientX || 0;
    y = touch.clientY || 0;
    x -= el.offsetLeft;
    y -= el.offsetTop;

    return { x, y };
  };

  const touchStartHandler = event => {
    event.preventDefault();

    inProgress = true;
    start = new Date().getTime();

    assignPosition(getTouchPosition)(mouse, event);
    executeCallback(onMouseDown, event);
  };

  const touchEndHandler = event => {
    event.preventDefault();

    inProgress = false;
    end = new Date().getTime();

    const delta = end - start;
    if (delta > duration) {
      clear();
    }

    executeCallback(onMouseUp, event);
  };

  const touchMoveHandler = event => {
    if (!el || !inProgress) return;

    assignPosition(getTouchPosition)(mouse, event);
    executeCallback(onMouseMove, event);
  };

  const setMouse = element => {
    if (element) {
      el = element;
      // Mouse Events
      el.addEventListener('mousedown', mouseDownHandler, false);
      el.addEventListener('mouseup', mouseUpHandler, false);
      el.addEventListener('mousemove', mouseMoveHandler, false);
      // Touch Events
      el.addEventListener('touchstart', touchStartHandler, false);
      el.addEventListener('touchend', touchEndHandler, false);
      el.addEventListener('touchmove', touchMoveHandler, false);
    }
    return mouse;
  };

  const removeMouse = () => {
    if (el) {
      // Mouse Events
      el.removeEventListener('mousedown', mouseDownHandler);
      el.removeEventListener('mouseup', mouseUpHandler);
      el.removeEventListener('mousemove', mouseMoveHandler);
      // Touch Events
      el.removeEventListener('touchstart', touchStartHandler);
      el.removeEventListener('touchend', touchEndHandler);
      el.removeEventListener('touchmove', touchMoveHandler);
    }
  };

  return [setMouse, removeMouse];
};
