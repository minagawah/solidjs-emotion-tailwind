/** @prettier */

import { css } from 'emotion';
import tw from 'twin.macro';

import { black, darkgray, pink, yellow } from '@/constants/colors';

const greenYellow = '#aef71e';

const flexRow = css`
  ${tw`flex flex-row flex-no-wrap justify-start content-center items-stretch`}
`;
const flexCol = css`
  ${tw`flex flex-col flex-no-wrap justify-center content-center items-center`}
`;

const logoLinkStyle = css`
  ${tw`p-1 font-bold`}
  display: inline-block;
  ${flexCol}
  background-color: ${pink};
  font-size: 0.9em;
  &:link,
  &:visited {
    color: ${darkgray};
  }
  &:hover,
  &:active {
    background-color: ${greenYellow};
    color: ${darkgray};
    text-decoration: none;
  }
`;

const linkStyle = css`
  ${tw`ml-3 p-1 font-bold`}
  display: inline-block;
  ${flexCol}
  width: auto;
  background-color: ${yellow};
  font-size: 0.9em;
  &:link,
  &:visited {
    color: ${black};
  }
  &:hover,
  &:active {
    color: ${black};
    background-color: ${pink};
    text-decoration: none;
  }
`;

/*
      <a href="#profile" className={linkStyle}>
        Profile
      </a>
 */
export const Header = () => {
  return (
    <header className={flexRow}>
      <a href="#top" className={logoLinkStyle}>
        SolidJS
      </a>
      <a href="#anim" className={linkStyle}>
        Animations
      </a>
      <a href="#settings" className={linkStyle}>
        Settings
      </a>
    </header>
  );
};
