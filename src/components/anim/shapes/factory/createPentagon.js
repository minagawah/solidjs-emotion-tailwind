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
import { int } from '@/lib/utils';
import { importPIXI, removeChildren } from '@/lib/pixi';
import { yellow } from '@/constants/colors';

import { createShape } from './createShape';

let PIXI;

const stroke = 2;
const fillColor = yellow;

export const createPentagon = async () => {
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
      // Size: (1) Based on canvas size.
      const size = width * 0.065;
      const sides = 5;

      points.length = 0;

      let minX = Infinity;
      let minY = Infinity;

      for (var i = 0; i <= sides; i += 1) {
        const x = size * Math.cos((i * 2 * Math.PI) / sides);
        const y = size * Math.sin((i * 2 * Math.PI) / sides);
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
    g.drawPolygon(points);
    g.endFill();
    // g.moveTo(points[0], points[0]);
    // g.lineTo(points[1][0], points[1]);
    // g.lineTo(points[2][0], points[2]);
    // g.lineTo(points[3][0], points[3]);
    // g.closePath();
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
        $_.x = width * 0.3;
        $_.y = height * 0.8;
      }
    }
  };

  /**
   * @protected
   */
  const update = $_ => {
    $_.x += $_.delta * speed.x;
    $_.y -= $_.delta * speed.y;

    if ($_.x_out_of_view()) {
      $_.x = -$_.width / 2;
    }
    if ($_.y_out_of_view()) {
      $_.y = $_.view.height + $_.height / 2;
    }

    $_.spr.rotation -= $_.delta * 0.02;
  };

  return await createShape({
    name: 'pent',
    before_draw,
    draw,
    resize,
    update,
  });
};
