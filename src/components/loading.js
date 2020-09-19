/** @prettier */

import { css } from 'emotion';

export const Loading = props => (
  <div
    className={css`
      font-weight: bold;
      font-size: 2em;
      color: #a3a3a3;
      ${props.styles}
    `}
  >
    Loading...
  </div>
);
