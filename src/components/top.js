/** @prettier */

import { css } from 'emotion';
import tw from 'twin.macro';

import { pink } from '@/constants/colors';
import logo from '@/assets/logo-js.svg';

import { titleStyle } from './styles';

// https://css-tricks.com/a-grid-of-logos-in-squares/
const gridStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 0.5em;

  div {
    background-color: ${pink};
    padding: 0;
    position: relative;

    & ::before {
      content: '';
      display: block;
      padding-bottom: 100%;
    }

    img {
      position: absolute;
      max-width: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

export const Top = () => (
  <>
    <h2 className={titleStyle}>Top</h2>

    <p>I hope you like the animation samples.</p>

    <div className={gridStyle}>
      <div></div>
      <div>
        <img src={logo} />
      </div>
      <div></div>
    </div>
  </>
);
