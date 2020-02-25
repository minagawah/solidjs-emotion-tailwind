import { css } from 'emotion';
import tw from 'tailwind.macro';

import logo from '@/assets/logo-js.svg';

const headerStyle = css`
  font-size: 1.2em;
  ${tw`flex flex-row flex-no-wrap justify-start content-end items-end`}
`;

const logoSize = 50;
const logoStyle = css`
  width: ${logoSize}px;
  height: ${logoSize}px;
`;

const linkStyle = css`
  margin-left: 0.5em;
`;

export const Header = () => {
  return (
    <div className={headerStyle}>
      <img src={logo} alt="logo" className={logoStyle} />
      <a href="#home" className={linkStyle}>
        Home
      </a>
      <a href="#profile" className={linkStyle}>
        Profile
      </a>
      <a href="#settings" className={linkStyle}>
        Settings
      </a>
    </div>
  );
};
