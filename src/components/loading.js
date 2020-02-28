/** @prettier */

import { css } from 'emotion';

export const Loading = props => (
  <div
    className={css`
      font-weight: bold;
      font-size: 2em;
      color: #d2d2d2;
      ${props.styles}
    `}
  >
    Loading...
  </div>
);
