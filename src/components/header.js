/** @prettier */

import { css } from 'emotion';
import tw from 'tailwind.macro';

import { useStore } from '@/store';

import logo from '@/assets/logo-js.svg';

const logoSize = 50;
const logoStyle = css`
  width: ${logoSize}px;
  height: ${logoSize}px;
`;

const flexRow = css`
  ${tw`flex flex-row flex-no-wrap justify-start content-end items-end`}
`;

const marginLeft = css`
  margin-left: 0.5em;
`;

const headerStyle = flexRow;

const wrapperStyle = css`
  ${tw`flex flex-col flex-no-wrap justify-start content-start items-start`}
`;

const screenSizeStyle = css`
  font-size: 0.9em;
  color: #c0c0c0;
  ${marginLeft}
`;

const menuStyle = css`
  font-size: 1.2em;
  ${flexRow}
`;

const linkStyle = marginLeft;

export const Header = () => {
  const [store] = useStore();

  return (
    <header className={headerStyle}>
      <img src={logo} alt="logo" className={logoStyle} />
      <nav className={wrapperStyle}>
        <div className={screenSizeStyle}>
          {store.width}x{store.height}
        </div>
        <div className={menuStyle}>
          <a href="#home" className={linkStyle}>
            Home
          </a>
          <a href="#profile" className={linkStyle}>
            Profile
          </a>
          <a href="#canvas" className={linkStyle}>
            Canvas
          </a>
          <a href="#settings" className={linkStyle}>
            Settings
          </a>
        </div>
      </nav>
    </header>
  );
};
