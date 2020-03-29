/** @prettier */

import { createEffect, afterEffects, onCleanup } from 'solid-js';
import { identity } from 'ramda';
import { css } from 'emotion';
import tw from 'tailwind.macro';

import { int, requestAnimFrame, cancelAnimFrame } from '@/lib/utils';
import { useMouse } from '@/lib/mouse';
import { useStore } from '@/store';
import { white, pink } from '@/constants/colors';

import { getCanvasSize, Ball } from './helper';

const wrapperStyle = css`
  ${tw`mt-2 flex flex-row flex-no-wrap justify-center content-start items-start`}
`;

const canvasStyle = css`
  border: 1px solid ${pink};
`;

const Spring = () => {
  const [store] = useStore();
  const [setMouse, removeMouse] = useMouse();

  const spring = 0.03;
  const friction = 0.85;
  const gravity = 2;
  const numBalls = 5;
  const balls = [];

  let canvasRef; // This is a Ref.

  let ctx;
  let mouse;
  let animId;
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
    }
  }

  function init() {
    ctx = mouse = animId = void 0; // Reset all the previous.

    ctx = canvasRef && canvasRef.getContext('2d');

    if (ctx) {
      balls.length = 0;
      mouse = setMouse(canvasRef);
      for (let i = 0; i < numBalls; i++) {
        balls.push(new Ball({ radius: 20 }));
      }
      reset();
      draw();
    }
  }

  function move(ball = {}, target = {}) {
    ball.vx += (target.x - ball.x) * spring;
    ball.vy += (target.y - ball.y) * spring;
    ball.vy += gravity;
    ball.vx *= friction;
    ball.vy *= friction;
    ball.x += ball.vx;
    ball.y += ball.vy;
  }

  function draw() {
    if (inProgress) return;

    inProgress = true;
    animId = requestAnimFrame(draw, canvasRef);

    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

    ctx.strokeStyle = white;
    ctx.beginPath();
    balls.forEach((ball, i) => {
      if (i === 0) {
        move(ball, mouse);
        ctx.moveTo(mouse.x, mouse.y);
      } else {
        const prev = balls[i - 1];
        move(ball, prev);
        ctx.moveTo(prev.x, prev.y);
      }
      ctx.lineTo(ball.x, ball.y);
      ctx.stroke();
      ball.draw(ctx);
    });

    inProgress = false;
  }

  return (
    <>
      <h2>Spring</h2>
      <div>A pure Canvas API example. Move around the spring.</div>
      <div id="wrapper" className={wrapperStyle}>
        <canvas id="canvas" ref={canvasRef} className={canvasStyle}></canvas>
      </div>
    </>
  );
};

export default Spring;
