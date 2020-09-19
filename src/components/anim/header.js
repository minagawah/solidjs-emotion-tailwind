/** @prettier */

import { css } from 'emotion';
import tw from 'twin.macro';

const wrapperStyle = tw`flex flex-row flex-no-wrap justify-start content-end items-end`;

const linkStyle = css`
  margin-left: 0.3em;
  padding: 0.2em 0.4em;
  background-color: #f7df1e;
  color: #19160c;
  &:link,
  &:visited {
    color: #19160c;
  }
  &:hover,
  &:active {
    color: #0030ff;
    text-decoration: none;
  }
`;

export const Header = () => {
  return (
    <div className={wrapperStyle}>
      <a href="#canvas/spring" className={linkStyle}>
        Spring
      </a>
      <a href="#canvas/tripod" className={linkStyle}>
        Tripod
      </a>
    </div>
  );
};
