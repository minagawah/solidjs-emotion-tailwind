/** @prettier */

import { createEffect, afterEffects, onCleanup } from 'solid-js';
import { identity } from 'ramda';
import { css } from 'emotion';
import tw from 'twin.macro';

import {
  int,
  withinRect,
  requestAnimFrame,
  cancelAnimFrame,
} from '@/lib/utils';

import { useMouse } from '@/lib/mouse';
import { useStore } from '@/store';
import { white, pink, blue } from '@/constants/colors';

import { getCanvasSize, Ball } from './helper';

const wrapperStyle = css`
  ${tw`mt-2 flex flex-row flex-no-wrap justify-center content-start items-start`}
`;

const canvasStyle = css`
  border: 1px solid ${pink};
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

  let canvasRef; // This is a Ref.

  let ctx;
  let mouse;
  let animId;

  let ball;
  let movingHandle = null;

  let inProgress = false;

  let screen = { width: 0, height: 0 };

  createEffect(() => {
    screen.width = store.width;
    screen.height = store.height;
    reset();
  });

  // TODO: 'afterEffects' does not fire....
  // afterEffects(init);
  setTimeout(init, 200);

  onCleanup(() => {
    console.log('[canvas/Spring] ++++ onCleanup()');
    removeMouse();
  });

  function onMouseDown() {
    handles.forEach(handle => {
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
      movingHandle.x = mouse.x;
      movingHandle.y = mouse.y;
    }
  }

  function reset() {
    if (canvasRef && screen.width && screen.height) {
      const { width, height } = getCanvasSize({
        ...screen,
        el: canvasRef,
        ratio: 16 / 9,
      });
      console.log(`[canvas/Spring] canvas: ${width}x${height}`);

      canvasRef.width = width;
      canvasRef.height = height;

      handles.forEach((handle, i) => {
        handle.x = Math.random() * canvasRef.width;
        handle.y = Math.random() * canvasRef.height;
      });
    }
  }

  function init() {
    ctx = mouse = animId = void 0; // Reset all the previous.

    ctx = canvasRef && canvasRef.getContext('2d');

    if (ctx) {
      // balls.length = 0;
      handles.length = 0;
      mouse = setMouse(canvasRef, {
        onMouseDown,
        onMouseUp,
        onMouseMove,
      });
      // for (let i = 0; i < numBalls; i++) {
      //   balls.push(new Ball({ radius: 20 }));
      // }
      ball = new Ball({ radius: 20 });
      for (let i = 0; i < numHandles; i++) {
        let handle = new Ball({ radius: 15, color: blue });
        handles.push(handle);
      }
      reset();
      draw();
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
    animId = requestAnimFrame(draw, canvasRef);

    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

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

    ctx.strokeStyle = white;
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

  return (
    <>
      <h2>Tripod</h2>
      <div>
        A pure Canvas API example. Move the{' '}
        <span style="color:#00c5ff;">small blue balls</span>
      </div>
      <div id="wrapper" className={wrapperStyle}>
        <canvas id="canvas" ref={canvasRef} className={canvasStyle}></canvas>
      </div>
    </>
  );
};

export default Tripod;
