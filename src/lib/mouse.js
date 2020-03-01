/** @prettier */

export const useMouse = () => {
  const mouse = {
    x: 0,
    y: 0,
  };

  let el;

  const handler = event => {
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
    mouse.x = x;
    mouse.y = y;
  };

  const setMouse = element => {
    if (element) {
      el = element;
      if (el) {
        el.addEventListener('mousemove', handler);
      }
    }
    return mouse;
  };

  const removeMouse = () => {
    if (el) {
      el.removeEventListener('mousemove', handler);
    }
  };

  return [setMouse, removeMouse];
};
