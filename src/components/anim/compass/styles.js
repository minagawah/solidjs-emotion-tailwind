/** @prettier */

import { css } from 'emotion';
import tw from 'tailwind.macro';

import { black, darkgray, pink, cyan, lightcyan } from '@/constants/colors';

export const mt2 = tw`mt-2`;

export const flexRow = css`
  ${tw`flex flex-row flex-no-wrap justify-center content-start items-start`}
`;

export const flexCol = css`
  ${tw`flex flex-col flex-no-wrap justify-start content-center items-center`}
`;

const buttonBase = css`
  ${tw`mr-3`}
  padding: 0.1em 0.4em;
  border: 0px;
  font-weight: bold;
  font-size: 1em;
`;

export const buttonStyle = css`
  ${buttonBase}
  background-color: ${pink};
  color: ${darkgray};
  &:link, &:visited {
    color: ${darkgray};
  }
  &:hover, &:active {
    background-color: ${cyan};
    color: ${darkgray};
    text-decoration: none;
  }
`;

export const buttonResetStyle = css`
  ${buttonBase}
  ${tw`mt-2 mb-2`}
  width: 120px;
  background-color: ${cyan};
  color: ${darkgray};
  &:link,
  &:visited {
    color: ${darkgray};
  }
  &:hover,
  &:active {
    background-color: ${lightcyan};
    color: ${darkgray};
    text-decoration: none;
  }
`;

export const titleStyle = css`
  font-size: 1.1em;
  font-weight: bold;
  color: ${pink};
`;

export const containerStyle = css`
  ${mt2}
  ${flexCol}
`;

export const contentStyle = css`
  ${mt2}
`;

export const bodyStyle = css`
  ${mt2}
  ${flexRow}
`;

const bodyInner = `
  width: 40vw;
  min-width: 195px;
`;

export const controlWrapperStyle = css`
  ${bodyInner}
  ${tw`flex flex-col flex-no-wrap justify-start content-start items-start`}
`;

export const controlStyle = css`
  ${tw`ml-2`}
  padding: 0.3em 0.8em;
  border: 1px solid ${pink};
  background-color: ${darkgray};
`;

export const stepStyle = css`
  ${tw`mt-1`}
  color: ${pink};
`;

export const canvasWrapperStyle = css`
  ${bodyInner}
`;

export const canvasStyle = css`
  border: 1px solid ${pink};
  background-color: ${darkgray};
`;

export const defaultState = {
  type: 'none',
  step: 0,
  count: 0,
};
