/** @prettier */

const noop = () => {};

export const useMouse = (params = {}) => {
  const { duration = 100 } = params;
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

  const touchPosition = event => {
    if (!el || !inProgress) return;

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

  const mousePosition = event => {
    if (!el) return;

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

  const onTouchStart = event => {
    event.preventDefault();
    inProgress = true;
    start = new Date().getTime();

    const { x, y } = touchPosition(event);
    mouse.x = x;
    mouse.y = y;
  };

  const onTouchEnd = event => {
    event.preventDefault();
    inProgress = false;
    end = new Date().getTime();

    const delta = end - start;
    if (delta > duration) {
      clear();
    }
  };

  const onTouchMove = event => {
    if (!el || !inProgress) return;
    const { x, y } = touchPosition(event);
    mouse.x = x;
    mouse.y = y;
  };

  const onMouseMove = event => {
    if (!el) return;
    const { x, y } = mousePosition();
    mouse.x = x;
    mouse.y = y;
  };

  const setMouse = element => {
    if (element) {
      el = element;
      if (el) {
        el.addEventListener('mousemove', onMouseMove);
        el.addEventListener('touchmove', onTouchMove);
        el.addEventListener('touchstart', onTouchStart);
        el.addEventListener('touchend', onTouchEnd);
      }
    }
    return mouse;
  };

  const removeMouse = () => {
    if (el) {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    }
  };

  return [setMouse, removeMouse];
};
