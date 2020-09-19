/** @prettier */

/*
 * "app" is PIXI.Application instance, and it is
 * destroyed when "onCleanup" (of Solid.js)
 * is called (which is when the route changes).
 * Every shape created by "createShape" is destroyed
 * upon "onCleanup" as well.
 * Yet, "PIXI", which is an asynchronously imported
 * module space, will never get destroyed, but reused
 * (except it clears PIXI texture caches).
 */

import { createEffect, afterEffects, onCleanup } from 'solid-js';
import { identity } from 'ramda';
import { css } from 'emotion';
import tw from 'twin.macro';

import { importPIXI } from '@/lib/pixi';
import { useStore } from '@/store';
import { pink } from '@/constants/colors';

import { getCanvasSize } from '../helper';

import {
  createCircle,
  createRect,
  createPentagon,
  createPolygon,
} from './factory';

let PIXI;

const CANVAS_BACKGROUND_COLOR = 0x292929;

const wrapperStyle = css`
  ${tw`mt-2 flex flex-row flex-no-wrap justify-center content-start items-start`}
`;

const canvasStyle = css`
  border: 1px solid ${pink};
`;

const Shapes = () => {
  const [store] = useStore();

  const dpr = window.devicePixelRatio;

  let canvasRef;
  let screen = { width: 0, height: 0 };

  let app;

  let circle;
  let rect;
  let pent;
  let poly;

  let inProgress = false;

  // TODO: 'afterEffects' does not fire....
  // afterEffects(init);
  setTimeout(init, 200);

  createEffect(() => {
    screen.width = store.width;
    screen.height = store.height;
    resize();
  });

  onCleanup(() => {
    console.log('[anim/Shapes] ++++ onCleanup()');
    reset();
  });

  /**
   * Runs only when route changes (upon "onCleanup").
   */
  function reset() {
    if (PIXI) {
      PIXI.loader && PIXI.loader.reset();
      PIXI.utils.destroyTextureCache();
    }
    app && app.destroy(true);
    app = void 0;

    rect && rect.destroy();
    circle && circle.destroy();
    pent && pent.destroy();
    poly && poly.destroy();

    circle = rect = pent = poly = void 0;
  }

  async function init() {
    console.clear();

    if (!PIXI) {
      PIXI = await importPIXI();
    }

    const isWebGL = PIXI.utils.isWebGLSupported();
    PIXI.utils.sayHello(isWebGL ? 'WebGL' : 'canvas');

    if (!isWebGL) {
      console.log('[anim/Shapes] LEGACY');
    }

    if (!canvasRef) {
      console.log('[anim/Shapes] No "canvasRef"');
    }

    if (PIXI && canvasRef) {
      reset();

      app = new PIXI.Application({
        width: screen.width || 10,
        height: screen.height || 10,
        backgroundColor: CANVAS_BACKGROUND_COLOR,
        view: canvasRef,
        resolution: dpr || 1,
        antialias: true,
        autoDensity: true, // Make it 1/2 the size for retina.
      });

      rect = await createRect();
      circle = await createCircle();
      pent = await createPentagon();
      poly = await createPolygon();

      // "resize" here acts like "init" for other apps
      // because initialization for PIXI apps depend on
      // the current canvas size.
      resize();

      // When the initialization is done,
      // each shape has its own sprite that are
      // ready to be added to the main stage.
      app.stage.addChild(rect.spr);
      app.stage.addChild(circle.spr);
      app.stage.addChild(pent.spr);
      app.stage.addChild(poly.spr);

      app.ticker.add(update);
    }
  }

  /**
   * "resize" here (as well as "resize" for each shape)
   * means to INITIALIZE the app unlike other apps.
   */
  function resize() {
    if (app && app.renderer && canvasRef) {
      // New canvas size from screen size.
      const view = getCanvasSize({
        ...screen,
        el: canvasRef,
        ratio: 16 / 9,
      });
      console.log(`[anim/Shapes] view: ${view.width}x${view.height}`);

      app.renderer.resize(view.width, view.height);

      rect.resize(view);
      circle.resize(view);
      pent.resize(view);
      poly.resize(view);
    }
  }

  function update(delta = 0) {
    if (inProgress || !canvasRef || !app) return;
    inProgress = true;

    rect && rect.update(delta);
    circle && circle.update(delta);
    pent && pent.update(delta);
    poly && poly.update(delta);

    inProgress = false;
  }

  return (
    <>
      <h2>Shapes</h2>
      <div>Using PIXI.js.</div>
      <div id="wrapper" className={wrapperStyle}>
        <canvas id="canvas" ref={canvasRef} className={canvasStyle}></canvas>
      </div>
    </>
  );
};

export default Shapes;
