/** @prettier */

import { int } from '@/lib/utils';

let PIXI;

/**
 * When WegGL isn't supported, imports "pixi.js-legacy" instead.
 * @returns {Object}
 */
export const importPIXI = async () => {
  if (!PIXI) {
    PIXI = await import('pixi.js');
    const isWebGL = PIXI && PIXI.utils.isWebGLSupported();
    if (!isWebGL) {
      PIXI = void 0;
      PIXI = await import('pixi.js-legacy');
    }
  }
  return PIXI;
};

/**
 * @param {Object} [o] - PIXI.Container
 */
export const removeChildren = o => {
  let size = o.children.length;
  for (let i = size - 1; i >= 0; i--) {
    o.removeChild(o.children[i]);
  }
};

/**
 * @param {Object} [sprite] - PIXI.Sprite
 */
export const removeSpriteTexturesFromCache = sprite => {
  let baseTexture = null;
  for (const key in sprite.textures) {
    PIXI.Texture.removeFromCache(sprite.textures[key]);
    baseTexture = sprite.textures[key].baseTexture;
  }
  PIXI.BaseTexture.removeFromCache(baseTexture);
};
