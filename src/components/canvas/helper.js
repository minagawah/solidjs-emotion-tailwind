/** @prettier */

import { int } from '@/lib/utils';

const DEFAULT_CANVAS_RATIO = 16 / 9; // Or, maybe we want: 640 / 480 ???

/**
 * (1) Set canvas width to closely to that of screen.
 * (2) Get canvas height using the given ratio.
 * (3) Calculate for available height so that the canvas would not go off screen.
 * (4) If the element is given, we can improve the accuracy (for the available height).
 * (5) When height goes off the screen (by height), then adjust the height.
 */
export const canvasSize = ({
  width,
  height,
  ratio = DEFAULT_CANVAS_RATIO,
  ref,
}) => {
  let w = int(width * 0.9); // Set canvas width to almost fill the screen width.
  let h = int(w / ratio); // Apply the ratio given to calculate the canvas height.

  // Prepare a maximum height available which is a little less than the screen height.
  let avail_h = int(height - height * 0.4);

  // When element is given, we can calculate for actually available height.
  if (ref) {
    // Get the height above the given element.
    const { y = 0 } = ref.getBoundingClientRect();
    // Subtract the height above to calculate actually available height.
    avail_h = int((height - y) * 0.9);
  }

  // If the canvas goes off the screen, set the height to the available height.
  // This time, calculate width from height.
  if (h > avail_h) {
    h = avail_h;
    w = int(h * ratio);
  }

  return { width: w, height: h };
};
