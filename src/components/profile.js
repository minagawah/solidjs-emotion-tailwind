/** @prettier */

import { createResourceState } from 'solid-js';
import { css } from 'emotion';
import tw from 'twin.macro';

import { randInt } from '@/lib/utils';
import { darkgray, pink } from '@/constants/colors';

import { titleStyle } from './styles';

const DELAY = 500;

const DIVINATIONS = [
  'You will have a wonderful day',
  'You are doomed',
  'Depends on what you aim for',
];

const padding = tw`p-1 pl-4 pr-4`;

const wrapperStyle = css`
  ${tw`mt-2 flex flex-row flex-no-wrap justify-start content-center items-center`}
  border: 1px solid ${pink};
  max-width: 540px;
`;

const labelStyle = css`
  ${tw`font-bold`}
  ${padding}
  color: ${darkgray};
  background-color: ${pink};
`;

const messageStyle = css`
  ${padding}
  background-color: ${darkgray};
`;

// Resolves after 500 msec.
const getDivination = () =>
  new Promise(resolve => {
    setTimeout(() => {
      const index = randInt(0, DIVINATIONS.length);
      return resolve(DIVINATIONS[index]);
    }, DELAY);
  });

const PleaseWait = () => <div className={messageStyle}>Please wait...</div>;

export const Profile = () => {
  const [state, load] = createResourceState();

  // For "state.message" to load, it takes 500 msec.
  load({ message: getDivination() });

  return (
    <>
      <h2 className={titleStyle}>Profile</h2>

      <p>Intentionally delaying the component load for {DELAY}msec.</p>

      <div className={wrapperStyle}>
        <div className={labelStyle}>message</div>

        <Show when={state.message} fallback={PleaseWait}>
          <div className={messageStyle}>{state.message}</div>
        </Show>
      </div>
    </>
  );
};
