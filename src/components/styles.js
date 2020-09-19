/** @prettier */

import { css } from 'emotion';
import tw from 'twin.macro';

import { white, black, blue, pink } from '@/constants/colors';

/*
  padding-left: 0.4em;
  border-left: solid 0.5em ${lightgray};
 */
export const titleStyle = css`
  ${tw`mt-2 mb-3 font-bold`}
  display: block;
  font-size: 1.1em;
  color: ${white};
`;

export const menuWrapperStyle = tw`mt-1 flex flex-row flex-no-wrap justify-start content-end items-end`;

export const menuLinkStyle = css`
  ${tw`mr-2 font-bold`}
  font-size: 0.9em;
  padding: 0.1em 0.4em;
  background-color: ${blue};
  color: ${black};
  &:link,
  &:visited {
    color: ${black};
  }
  &:hover,
  &:active {
    background-color: ${pink};
    color: ${black};
    text-decoration: none;
  }
`;
