/** @prettier */

import { menuWrapperStyle, menuLinkStyle } from '../styles';

export const Menu = () => {
  return (
    <div className={menuWrapperStyle}>
      <a href="#anim/spring" className={menuLinkStyle}>
        Spring
      </a>
      <a href="#anim/tripod" className={menuLinkStyle}>
        Tripod
      </a>
      <a href="#anim/shapes" className={menuLinkStyle}>
        Shapes
      </a>
      <a href="#anim/compass" className={menuLinkStyle}>
        Compass
      </a>
    </div>
  );
};
