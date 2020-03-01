/** @prettier */

import { compose, identity, tap } from 'ramda';

export const int = Math.trunc;

export const boo = compose(tap(console.log), identity);

export const rand = (min = 0, max = 10) => Math.random() * (max - min) + min;

export const randInt = (min = 0, max = 10) =>
  Math.floor(Math.random() * (max - min)) + min;

export const deg = a => a * (180 / Math.PI);
export const rad = a => a * (Math.PI / 180);

/**
 * Get the norm for `val` between `min` and `max`.
 * Ex. norm(75, 0, 100) ---> 0.75
 */
export const norm = (val, min, max) => (val - min) / (max - min);

/**
 * Apply `norm` (the linear interpolate value) to the range
 * between `min` and `max` (usually between `0` and `1`).
 * Ex. lerp(0.5, 0, 100) ---> 50
 */
export const lerp = (norm, min, max) => min + (max - min) * norm;

/**
 * Limit the value to a certain range.
 * Ex. clamp(5000, 0, 100) ---> 100
 */
export const clamp = (val, min, max) =>
  Math.min(Math.max(val, Math.min(min, max)), Math.max(min, max));

export const delta = (p, p2) => ({
  dx: p2.x - p.x || 0,
  dy: p2.y - p.y || 0,
});

export const distFromDelta = ({ dx = 0, dy = 0 }) =>
  Math.sqrt(dx * dx + dy * dy);

export const angleFromDelta = ({ dx = 0, dy = 0 }) => Math.atan2(dy, dx);

/** Get a distance between two points. */
export const distBetween = (p, p2) => distFromDelta(delta(p, p2));

/**
 * Find the radian from 'p2' to 'p1'.
 * Ex. deg(angleBetween({ x: 10, y: 10 }, { x: 0, y: 0 })) ---> 45
 */
export const angleBetween = (p, p2) => angleFromDelta(delta(p, p2));

export const withinRange = (val, min, max) => val >= min && val <= max;

/** See if 'x' and 'y' falls into the bounds made by 'rect'. */
export const withinRect = (rect, p) =>
  withinRange(p.x, rect.x, rect.x + rect.width) &&
  withinRange(p.y, rect.y, rect.y + rect.height);

/** See if the given point falls within the arc's radius. */
export const withinArc = (p, a) => distBetween(p, a) <= a.radius;

export const colorToRGB = (color, alpha = 1) => {
  if (typeof color === 'string' && color[0] === '#') {
    color = parseInt(color.slice(1), 16);
  }
  const arr = [];
  arr[0] = (color >> 16) & 0xff;
  arr[1] = (color >> 8) & 0xff;
  arr[2] = color & 0xff;
  alpha = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha;
  if (alpha === 1) {
    arr[3] = alpha;
  }
  return `rbg(${arr.join(',')}`;
};

/* eslint-disable indent */
export const colorToNumber = color =>
  typeof color === 'number'
    ? color | 0
    : parseInt(
        typeof color === 'string' && color[0] === '#' ? color.slice(1) : color,
        16
      );
/* eslint-enable indent */

export const colorToHexString = color =>
  typeof color === 'number'
    ? `#${('00000' + (color | 0).toString(16)).substr(-6)}`
    : color;

export const requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(a) {
    window.setTimeout(a, 1e3 / 60);
  };

export const cancelAnimFrame =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame;
