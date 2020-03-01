/** @prettier */

import { createEffect, afterEffects, onCleanup } from 'solid-js';
import { identity } from 'ramda';
import { css } from 'emotion';
import tw from 'tailwind.macro';

import {
  int,
  withinRect,
  requestAnimFrame,
  cancelAnimFrame,
} from '@/lib/utils';

import { useMouse } from '@/lib/mouse';
import { useStore } from '@/store';

import Ball from './ball';
import { canvasSize } from './helper';

const wrapperStyle = css`
  padding: 0.1em;
  background-color: #fbfbfb;
  ${tw`mt-1`}
`;
const canvasStyle = css`
  border: 1px solid #e0e0e0;
  ${tw`bg-white`}
`;

const Tripod = () => {
  const [store] = useStore();
  const [setMouse, removeMouse] = useMouse();

  const spring = 0.03;
  const friction = 0.85;
  // const gravity = 2;
  // const numBalls = 5;
  // const balls = [];
  const numHandles = 3;
  const handles = [];

  let canvas; // This is a Ref.

  let ctx;
  let mouse;
  let animId;

  let ball;
  let movingHandle = null;

  let inProgress = false;

  let screen_w = 0;
  let screen_h = 0;

  createEffect(() => {
    ({ width: screen_w, height: screen_h } = store);
    reset();
  });

  // TODO: 'afterEffects' does not fire....
  // afterEffects(init);
  setTimeout(init, 200);

  onCleanup(() => {
    console.log('[canvas/Spring] ++++ onCleanup()');
    removeMouse();
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('touchstart', onMouseDown);
    canvas.removeEventListener('touchend', onMouseUp);
    canvas.removeEventListener('touchmove', onMouseMove);
  });

  function reset() {
    if (canvas && screen_w && screen_h) {
      const { width, height } = canvasSize({
        width: screen_w,
        height: screen_h,
        ratio: 16 / 9,
        ref: canvas,
      });
      console.log(`[canvas/Spring] canvas: ${width}x${height}`);

      canvas.width = width;
      canvas.height = height;

      handles.forEach((handle, i) => {
        handle.x = Math.random() * canvas.width;
        handle.y = Math.random() * canvas.height;
      });
    }
  }

  // function move(ball = {}, target = {}) {
  //   ball.vx += (target.x - ball.x) * spring;
  //   ball.vy += (target.y - ball.y) * spring;
  //   ball.vy += gravity;
  //   ball.vx *= friction;
  //   ball.vy *= friction;
  //   ball.x += ball.vx;
  //   ball.y += ball.vy;
  // }

  function draw() {
    if (inProgress) return;

    inProgress = true;
    animId = requestAnimFrame(draw, canvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    handles.forEach((handle, i) => {
      const dx = handle.x - ball.x;
      const dy = handle.y - ball.y;
      ball.vx += dx * spring;
      ball.vy += dy * spring;
    });
    ball.vx *= friction;
    ball.vy *= friction;
    ball.x += ball.vx;
    ball.y += ball.vy;

    ctx.beginPath();
    // balls.forEach((ball, i) => {
    //   if (i === 0) {
    //     move(ball, mouse);
    //     ctx.moveTo(mouse.x, mouse.y);
    //   } else {
    //     const prev = balls[i - 1];
    //     move(ball, prev);
    //     ctx.moveTo(prev.x, prev.y);
    //   }
    //   ctx.lineTo(ball.x, ball.y);
    //   ctx.stroke();
    //   ball.draw(ctx);
    // });
    handles.forEach((handle, i) => {
      ctx.moveTo(ball.x, ball.y);
      ctx.lineTo(handle.x, handle.y);
      ctx.stroke();
      handle.draw(ctx);
    });
    ball.draw(ctx);

    inProgress = false;
  }

  function onMouseDown() {
    handles.forEach(handle => {
      console.log(`[canvas/Tripod] (x:${mouse.x}, y:${mouse.y})`);
      if (withinRect(handle.getBounds(), mouse)) {
        movingHandle = handle;
      }
    });
  }

  function onMouseUp() {
    if (movingHandle) {
      movingHandle = null;
    }
  }

  function onMouseMove() {
    if (movingHandle) {
      console.log(`[canvas/Tripod] (x:${mouse.x}, y:${mouse.y})`);
      movingHandle.x = mouse.x;
      movingHandle.y = mouse.y;
    }
  }

  function init() {
    ctx = mouse = animId = void 0; // Reset all the previous.

    ctx = canvas && canvas.getContext('2d');

    if (ctx) {
      // balls.length = 0;
      handles.length = 0;
      mouse = setMouse(canvas);
      // for (let i = 0; i < numBalls; i++) {
      //   balls.push(new Ball({ radius: 20 }));
      // }
      ball = new Ball({ radius: 20 });
      for (let i = 0; i < numHandles; i++) {
        let handle = new Ball({ radius: 10, color: '#0000ff' });
        handles.push(handle);
      }

      canvas.addEventListener('mousedown', onMouseDown, false);
      canvas.addEventListener('mouseup', onMouseUp, false);
      canvas.addEventListener('mousemove', onMouseMove, false);
      canvas.addEventListener('touchstart', onMouseDown, false);
      canvas.addEventListener('touchend', onMouseUp, false);
      canvas.addEventListener('touchmove', onMouseMove, false);

      reset();
      draw();
    }
  }

  return (
    <>
      <h2>Tripod</h2>
      <div>
        Move the <span style="color:#00f;">small blue balls</span>
      </div>
      <div id="wrapper" className={wrapperStyle}>
        <canvas id="canvas" ref={canvas} className={canvasStyle}></canvas>
      </div>
    </>
  );
};

export default Tripod;
