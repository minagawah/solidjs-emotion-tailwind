/** @prettier */

/*
 * The module provides "createSphape" which is a factory,
 * and when it is called, it provides basically
 * a blueprint for the new shape.
 *
 * The module manages the followings 3 states:
 *
 * [prev]
 *    For every "update", saves the previous
 *    "x", "y", "width", and "height"
 *    of the shape. When browser resizes,
 *    it pauses the app, ceases to run "update"
 *    for each shape. Instead, positions the shape
 *    in accord with the newly calculated canvas size
 *    and its proportions.
 *
 * [view]
 *    Saves the canvas size given from the parent program
 *    so that the shape can look up.
 *
 * [delta]
 *    For every "update", this is the "delta" given
 *    by the parent program (elapsed time in msec
 *    for every "tick").
 *
 * It is noteworthy to mention about what "resize"
 * means in any PIXI apps. Unlike the usual apps,
 * it requires CANVAS SIZE in order to begin
 * the app creation, hence, when saying "resize",
 * it is basically the same as "init" in the other apps.
 *
 * As "createShape" factory creates a new shape,
 * it provides "$_" as a context, and "$_.spr"
 * to represent the newly created PIXI.Shape.
 * This is done in the mentioned "resize" cycle.
 *
 * For PIXI.Shape requires a texture, and for
 * the texture in this app is generated from
 * PIXI.Graphics, we need extra preparations
 * before the PIXI.Graphics generation.
 * For this, we have "before_draw" is provide
 * so that the caller program can run
 * any tasks necessary before the PIXI.Graphics.
 *
 * Although properties are destroyed on "resize",
 * "$_.spr" is never destroyed once created.
 */

import { pick } from 'ramda';
import { int, defined } from '@/lib/utils';
import {
  importPIXI,
  removeSpriteTexturesFromCache,
  removeChildren,
} from '@/lib/pixi';

const noop = () => {};

const defaultAttributes = {
  prev: { x: 0, y: 0, width: 0, height: 0, init: false },
  view: { width: 0, height: 0 },
  delta: 0,
};

let PIXI;

export const createShape = async (params = {}) => {
  if (!PIXI) {
    PIXI = await importPIXI();
  }

  const {
    name,
    destroy: given_destroy = noop,
    init: given_init = noop,
    before_draw: given_before_draw = noop,
    draw: given_draw = noop,
    resize: given_resize = noop,
    update: given_update = noop,
  } = params;

  if (!name) throw new Error('No "name"');

  // Here's the context returned
  // for the caller to manage.
  // Notice we hardly have setter/getters.
  // By letting the caller program to directly
  // the core context, codes would become
  // much simpler. Encapsulation complicates
  // things too much, and I believe it rather
  // tends to make programs error prone...
  const $_ = {
    name,
    ...defaultAttributes,
  };

  // PIXI.Sprite
  // Never gets reset. Reused even when the route changes.
  $_.spr = null;

  // Minimal setters/getters.
  // Not that we want to control the situation,
  // but these are just for convenience.
  ['x', 'y', 'width', 'height'].forEach(key => {
    $_.__defineGetter__(key, () => ($_.spr && $_.spr[key]) || 0);
    $_.__defineSetter__(key, (value = 0) => $_.spr && ($_.spr[key] = value));
  });

  /**
   * Called when route changes (unmounted).
   * @protected
   */
  $_.destroy = () => {
    given_destroy($_);

    $_.spr && $_.spr.destroy();
    $_.spr = void 0;

    ['prev', 'view', 'delta'].map(key => {
      $_[key] = defaultAttributes[key];
    });

    console.log(`[anim/Shapes] (shape) "${name}" is destroyed.`);
  };

  /**
   * @protected
   */
  $_.init = () => {
    given_init($_);
  };

  /**
   * @protected
   * @param {Object} [view={}] - New canvas size.
   */
  $_.resize = (view = {}) => {
    $_.view = {
      width: view.width || 0,
      height: view.height || 0,
    };

    // Jobs neede before creating new PIXI.Graphics.
    given_before_draw($_);

    let g = given_draw($_, new PIXI.Graphics());

    if ($_.spr) {
      removeSpriteTexturesFromCache($_.spr);
      $_.spr.texture = g.generateCanvasTexture();
    } else {
      $_.spr = new PIXI.Sprite(g.generateCanvasTexture());
    }

    g.destroy();
    g = void 0;

    // When browser resizes, we want to calculate
    // for the new corresponding position based on
    // new canvas size proportion EXCEPT FOR
    // THE FIRST TIME (when it has previous position).
    if ($_.prev.init === true) {
      const ratio = $_.view.width / ($_.prev.width || 1);
      $_.x = $_.prev.x * ratio;
      $_.y = $_.prev.y * ratio;
    }

    given_resize($_);

    $_.prev = {
      ...$_.prev, // This comes first. Otherwise it overwrites new values...
      init: true,
      ...$_.view,
      ...pick(['x', 'y'], $_),
    };
  };

  let inProgress = false;

  /**
   * @protected
   */
  $_.update = (delta = 0) => {
    if (inProgress) return;
    inProgress = true;

    $_.delta = delta;

    if ($_.spr && $_.view.width && $_.view.height) {
      // Expects this to update "x" and "y".
      given_update($_);

      // Save the updated "x" and "y".
      $_.prev.x = $_.x;
      $_.prev.y = $_.y;
    }
    inProgress = false;
  };

  /**
   * @protected
   */
  $_.x_out_of_view = () => {
    const { view, spr } = $_;
    const x = spr.x - spr.pivot.x;
    const y = spr.y - spr.pivot.y;
    return x > view.width || x < -spr.width;
  };

  /**
   * @protected
   */
  $_.y_out_of_view = () => {
    const { view, spr } = $_;
    const x = spr.x - spr.pivot.x;
    const y = spr.y - spr.pivot.y;
    return y > view.height || y < -spr.height;
  };

  // Run initialization if there are any tasks given.
  $_.init();

  return $_;
};
