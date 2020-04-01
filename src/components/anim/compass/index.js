/** @prettier */

import { lazy, createEffect, onCleanup } from 'solid-js';

const Hexagon = lazy(() => import('./hexagon'));

import { containerStyle } from './styles';

const Compass = () => {
  // TODO: 'afterEffects' does not fire....
  // afterEffects(init);
  setTimeout(init, 200);

  onCleanup(() => {
    console.log('[anim/Compass] ++++ onCleanup()');
  });

  function init() {
    // console.clear();
  }

  return (
    <>
      <h2>Compass</h2>
      <div>Using PIXI.js.</div>
      <div id="container" className={containerStyle}>
        <Hexagon />
      </div>
    </>
  );
};

export default Compass;
