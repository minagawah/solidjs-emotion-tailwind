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

import { int } from '@/lib/utils';
import { importPIXI, removeChildren } from '@/lib/pixi';
import { pink } from '@/constants/colors';

import { createShape } from './createShape';

let PIXI;

const color = pink;

export const createCircle = async () => {
  if (!PIXI) {
    PIXI = await importPIXI();
  }

  let initialized = false;

  let dragging = false;
  let eventData = null;
  let offset = null;

  let size = 1;
  let speed;

  const drag_start = $_ => event => {
    dragging = true;
    eventData = event.data;
    offset = new PIXI.Point();
    $_.spr.toLocal(eventData.global, null, offset);
  };

  const drag_move = $_ => event => {
    if (dragging) {
      const pos = eventData.getLocalPosition($_.spr.parent);
      $_.spr.position.x = pos.x - offset.x;
      $_.spr.position.y = pos.y - offset.y;
    }
  };

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
      size = 1;
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
      view: { width = 0 },
    } = $_;

    // Size: (1) Based on canvas size.
    size = int(width * 0.06);
  };

  /**
   * @protected
   */
  const draw = ($_, g) => {
    g.clear();
    g.lineStyle(0);
    g.beginFill(PIXI.utils.string2hex(color), 1);
    g.drawCircle(0, 0, size);
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
    size = $_.width;

    if (width && height && size) {
      const half = size / 2;
      $_.spr.pivot.x = half;
      $_.spr.pivot.y = half;

      // $_.speed = { x: size * 0.015, y: size * 0.015 };
      speed = { x: size * 0.015, y: size * 0.015 };

      // If there is no previous position,
      // initialize the shape position!
      if ($_.prev.initialized === false) {
        $_.x = width * 0.2;
        $_.y = height * 0.4;
      }
    }
  };

  /**
   * @protected
   */
  const update = $_ => {
    const half = $_.width / 2;

    $_.x += $_.delta * speed.x;
    $_.y += $_.delta * speed.y;

    if ($_.x_out_of_view()) {
      $_.x = -half;
    }

    if ($_.y_out_of_view()) {
      $_.y = -half;
    }
  };

  return await createShape({
    name: 'circle',
    destroy,
    before_draw,
    draw,
    resize,
    update,
  });
};
