/** @prettier */

import { css } from 'emotion';

/* #d2d2d2 */
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
