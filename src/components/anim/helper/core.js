/** @prettier */

import { int } from '@/lib/utils';

const DEFAULT_CANVAS_RATIO = 4 / 3;

export const getCanvasSize = (args = {}) => {
  const {
    width: scr_w = 0,
    height: scr_h = 0,
    ratio = DEFAULT_CANVAS_RATIO,
  } = args;

  const { el } = args;

  let width = 20;
  let height = 20;

  if (scr_w && scr_h) {
    width = int(scr_w * 0.98);
    height = int(width / ratio);

    let avail_h = scr_h * 0.7 || 0;

    if (el) {
      const { y = 0 } = el.getBoundingClientRect();
      avail_h = (scr_h - y) * 0.96;
    }

    if (height > avail_h) {
      height = int(avail_h) || 0;
      width = int(height * ratio);
    }
  }

  return { width, height };
};
