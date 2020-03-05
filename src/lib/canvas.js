/** @prettier */

import { int } from '@/lib/utils';

/**
 * (1) Set canvas width to closely to that of screen.
 * (2) Get canvas height using the given ratio.
 * (3) Calculate for available height so that
 *     the canvas would not go off screen.
 * (4) If the element is given, we can improve
 *     the accuracy (for the available height).
 * (5) When height goes off the screen (by height),
 *     then adjust the height.
 */
export const canvasSize = ({ width = 0, height = 0, ratio = 16 / 9, el }) => {
  // Set canvas width to almost fill the screen width.
  let w = int(width * 0.94);
  // Apply the ratio given to calculate the canvas height.
  let h = int(w / ratio);

  // Prepare a maximum height available which is
  // a little less than the screen height.
  let avail_h = height * 0.7 || 0;

  // For mobile, fill the height.
  if (height > width) {
    h = avail_h;
  }

  // When element is given, we can calculate
  // for actually available height.
  if (el) {
    // Get the height above the given element.
    const { y = 0 } = el.getBoundingClientRect();
    // Subtract the height above to calculate
    // actually available height.
    avail_h = (height - y) * 0.9;
  }

  // If the canvas goes off the screen, set the height
  // to the available height.
  if (h > avail_h) {
    h = int(avail_h) || 0;
  }

  return { width: w, height: h };
};
