/** @prettier */

import { createState, createEffect, afterEffects, onCleanup } from 'solid-js';
import { css } from 'emotion';
import tw from 'tailwind.macro';

import { int } from '@/lib/utils';
import { importPIXI } from '@/lib/pixi';
import { useStore } from '@/store';
import { darkgray, lightgray, cyan } from '@/constants/colors';

import { getCanvasSize } from '../helper';

import {
  mt2,
  flexRow,
  flexCol,
  buttonStyle,
  buttonResetStyle,
  titleStyle,
  contentStyle,
  bodyStyle,
  controlWrapperStyle,
  controlStyle,
  stepStyle,
  canvasWrapperStyle,
  canvasStyle,
} from '../styles';

import { createStep1 } from './step1';
import { createStep2 } from './step2';

let PIXI;

const defaultState = {
  step: 0,
};

const activeButtonBackgroundStyle = css`
  background-color: ${cyan};
`;

const Hexagon = (props = {}) => {
  const [store] = useStore();
  const [state, setState] = createState(defaultState);

  const dpr = window.devicePixelRatio;

  let wrapperRef;
  let ref;

  let screen = { width: 0, height: 0 };
  let view = { width: 0, height: 0 };

  let app;

  let step1;
  let step2;

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
    console.log('[anim/Compass] (Hexagon) ++++ onCleanup()');
    reset();
    // cancelAnimFrame(update);
  });

  function reset() {
    if (PIXI) {
      PIXI.loader && PIXI.loader.reset();
      PIXI.utils.destroyTextureCache();
    }
    setState('step', null);
    app && app.destroy(true);
    step1 && step1.destroy();
    step2 && step2.destroy();
    step1 = step2 = app = void 0;
  }

  async function init() {
    if (!PIXI) {
      PIXI = await importPIXI();
    }

    const isWebGL = PIXI.utils.isWebGLSupported();
    PIXI.utils.sayHello(isWebGL ? 'WebGL' : 'canvas');

    if (!isWebGL) {
      console.log('[anim/Compass] (hexagon) LEGACY');
    }

    if (!ref) {
      console.log('[anim/Compass] (hexagon) No "ref"');
    }

    if (PIXI && ref) {
      reset();

      app = new PIXI.Application({
        width: screen.width || 10,
        height: screen.height || 10,
        backgroundColor: PIXI.utils.string2hex(darkgray),
        view: ref,
        resolution: dpr || 1,
        antialias: true,
        autoDensity: true, // Make it 1/2 the size for retina.
      });

      step1 = await createStep1();
      step2 = await createStep2();

      app.stage.addChild(step1.ct);
      app.stage.addChild(step2.ct);

      resize();

      app.ticker.add(update);
    }
  }

  function resize() {
    if (app && app.renderer && wrapperRef) {
      // Calculate the canvas size from
      // a wrapper around the canvas.
      view = getCanvasSize({
        ...screen,
        el: wrapperRef,
        ratio: 4 / 3,
      });
      console.log(
        `[anim/Compass] (hexagon) ${int(view.width)}x${int(view.height)}`
      );

      app.renderer.resize(view.width, view.height);
      step1.resize(view);
      step2.resize(view);
    }
  }

  function update(delta = 0) {
    if (inProgress) return;
    inProgress = true;

    step1 && step1.update(delta);
    step2 && step2.update(delta);

    // requestAnimFrame(update);

    inProgress = false;
  }

  function getActiveButtonStyle(step) {
    return step === state.step ? activeButtonBackgroundStyle : '';
  }

  function setStep(step = 1) {
    return () => {
      setState('step', step);

      step1 && step1.reset();
      step2 && step2.reset();

      state.step === 1 && step1 && step1.run(view);

      if (state.step === 2 && step1 && step2) {
        step1.run(view, { atOnce: true, stroke: lightgray });
        step2.run(view);
      }
    };
  }

  return (
    <article className={contentStyle}>
      <h4 className={titleStyle}>Regular Hexagon in a Circle</h4>

      {/* BEGIN: Body */}
      <div className={bodyStyle}>
        <div ref={wrapperRef} className={canvasWrapperStyle}>
          <canvas ref={ref} className={canvasStyle}></canvas>
        </div>

        {/* BEGIN: Control Wrapper */}
        <div className={controlWrapperStyle}>
          <div className={controlStyle}>
            {/* Step 1 */}
            <div className={stepStyle}>
              <button
                className={`${buttonStyle} ${getActiveButtonStyle(1)}`}
                onClick={setStep(1)}
              >
                Step 1
              </button>
              <span>Draw a circle.</span>
            </div>

            {/* Step 2 */}
            <div className={stepStyle}>
              <button
                className={`${buttonStyle} ${getActiveButtonStyle(2)}`}
                onClick={setStep(2)}
              >
                Step 2
              </button>
              <span>Arc AO (B, F)</span>
            </div>

            {/* Reset */}
            <div className={stepStyle}>
              <button className={`${buttonResetStyle}`} onClick={setStep(0)}>
                Reset
              </button>
            </div>
          </div>
          {/* END OF: Control */}
        </div>
        {/* END OF: Control Wrapper */}
      </div>
      {/* END OF: Body */}
    </article>
  );
};

export default Hexagon;
