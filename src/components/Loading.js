/** @prettier */

import { css } from 'emotion';

const defaultStyle = css`
  font-weight: bold;
  font-size: 2em;
  color: #d2d2d2;
`;

export const Loading = props => {
  const style = css`
    ${defaultStyle}
    ${props.styles}
  `;
  return <div className={style}>Loading...</div>;
};
