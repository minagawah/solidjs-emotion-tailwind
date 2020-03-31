/** @prettier */

import { int } from '@/lib/utils';

const DEFAULT_CANVAS_RATIO = 4 / 3;

/**
 * @returns {Object}
 */
export const getCanvasSize = (args = {}) => {
  const { ratio = DEFAULT_CANVAS_RATIO, el: wrapper } = args;

  let width = 10;
  let height = 10;

  const { width: wrap_w, height: wrap_h } =
    wrapper && wrapper.getBoundingClientRect();

  if (wrap_w && wrap_h) {
    width = wrap_w * 0.97;
    height = width / ratio;
  }

  return { width, height };
};

export const getDotSize = (view = {}) => {
  const size = int(view.width * 0.01);
  return size < 3 ? 3 : size;
};

export const getLabelSize = (view = {}) => {
  const size = int(view.width * 0.05);
  return size < 4 ? 4 : size;
};
