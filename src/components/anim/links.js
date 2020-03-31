/** @prettier */

import { css } from 'emotion';
import tw from 'tailwind.macro';

const linkStyle = css`
  display: block;
  ${tw`mt-1`}
`;

export const Links = () => {
  return (
    <>
      <a href="#anim/spring" className={linkStyle}>
        Canvas: Spring
      </a>
      <a href="#anim/tripod" className={linkStyle}>
        Canvas: Tripod
      </a>
      <a href="#anim/shapes" className={linkStyle}>
        PIXI: Shapes
      </a>
      <a href="#anim/compass" className={linkStyle}>
        PIXI: Compass
      </a>
    </>
  );
};
