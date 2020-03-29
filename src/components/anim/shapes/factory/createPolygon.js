/** @prettier */

/*
 * Since initialization of PIXI app mainly depends on
 * canvas size, "resize" here acts like "init" of
 * other apps. When "createShape" generates
 * new instance for this specific shape,
 * it provides "$_" to be its context,
 * and "$_.spr" to represent the newly created
 * PIXI.Sprite instance which is carried out
 * in the mentioned "resize" cycle.
 * In order to create the new PIXI.Sprite instance,
 * it requires a texture which is a PIXI.Graphics
 * instance, and require some extra steps before
 * the sprite creation. For this, we have
 * "before_draw" for all the preparations.
 */

import { pick } from 'ramda';
import { int, rand, randInt } from '@/lib/utils';
import { importPIXI, removeChildren } from '@/lib/pixi';
import { pink, blue } from '@/constants/colors';

import { createShape } from './createShape';

let PIXI;

const stroke = 3;
const strokeColor = pink;
const fillColor = blue;

export const createPolygon = async () => {
  if (!PIXI) {
    PIXI = await importPIXI();
  }

  let initialized = false;

  let dragging = false;
  let eventData = null;
  let offset = null;

  let points = [];
  let speed;

  /**
   * @private
   */
  const drag_start = $_ => event => {
    dragging = true;
    eventData = event.data;
    offset = new PIXI.Point();
    $_.spr.toLocal(eventData.global, null, offset);
  };

  /**
   * @private
   */
  const drag_move = $_ => event => {
    if (dragging) {
      const pos = eventData.getLocalPosition($_.spr.parent);
      $_.spr.position.x = pos.x - offset.x;
      $_.spr.position.y = pos.y - offset.y;
    }
  };

  /**
   * @private
   */
  const drag_end = $_ => event => {
    eventData = null;
    dragging = false;
    offset = null;
  };

  /**
   * @protected
   */
  const destroy = $_ => {
    if ($_ && $_.spr) {
      $_.spr.removeAllListeners();
      points.length = 0;
      speed = void 0;
      initialized = false;
    }
  };

  /**
   * Jobs neede before creating new PIXI.Graphics.
   * @protected
   */
  const before_draw = $_ => {
    const {
      view: { width = 0, height = 0 },
    } = $_;

    if (width) {
      const sides = randInt(6, 9) | 0;
      const step = (Math.PI * 2) / sides;

      // Size: (1) Based on canvas size.
      const magnify = width * 0.0022;
      const minSize = 30 * magnify;
      const maxSize = 50 * magnify;

      points.length = 0;

      let minX = Infinity;
      let minY = Infinity;

      for (var i = 0; i <= sides; i++) {
        const angle = step * i + (i ? randInt(step * 0.2, step) : step);
        const size = randInt(minSize, maxSize);

        const x = size * Math.cos(angle);
        const y = size * Math.sin(angle);
        points.push(new PIXI.Point(x, y));

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
      }

      points.forEach(point => {
        point.x = point.x - minX;
        point.y = point.y - minY;
      });
    }
  };

  /**
   * @protected
   */
  const draw = ($_, g) => {
    g.clear();
    g.beginFill(PIXI.utils.string2hex(fillColor));
    g.lineStyle(stroke, PIXI.utils.string2hex(strokeColor), 1);
    g.drawPolygon(points);
    g.endFill();
    return g;
  };

  /**
   * @protected
   */
  const resize = $_ => {
    const {
      view: { width = 0, height = 0 },
    } = $_;

    if (initialized === false && $_.spr) {
      $_.spr.interactive = true;
      $_.spr.buttonMode = true;
      $_.spr.on('pointerdown', drag_start($_));
      $_.spr.on('pointerup', drag_end($_));
      $_.spr.on('pointerupoutside', drag_end($_));
      $_.spr.on('pointermove', drag_move($_));
      initialized = true;
    }

    // Size: (2) This time, from the sprite.
    // The polygon is drawn inside the container,
    // and now the container has "width" and "height".
    const w = $_.width || 0;
    const h = $_.height || 0;

    if (width && height && w && h) {
      $_.spr.pivot.x = w / 2;
      $_.spr.pivot.y = h / 2;

      const avg = (w + h) / 2;
      const sp = avg * 0.017;
      speed = { x: sp, y: sp };

      // If there is no previous position,
      // initialize the shape position!
      if ($_.prev.initialized === false) {
        $_.x = width * 0.75;
        $_.y = height * 0.2;
      }
    }
  };

  /**
   * @protected
   */
  const update = $_ => {
    if (dragging === false) {
      $_.x -= $_.delta * speed.x;
      $_.y -= $_.delta * speed.y;

      if ($_.x_out_of_view()) {
        $_.x = $_.view.width + $_.width / 2;
      }
      if ($_.y_out_of_view()) {
        $_.y = $_.view.height + $_.height / 2;
      }
      $_.spr.rotation += $_.delta * 0.04;
    }
  };

  return await createShape({
    name: 'poly',
    destroy,
    before_draw,
    draw,
    resize,
    update,
  });
};
