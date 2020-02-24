import { createResourceState, createEffect } from 'solid-js';
import { css } from 'emotion';

import { int, rand, randInt } from '@/lib/utils';

const divinations = [
  'You will have a wonderful day',
  'You are doomed',
  'Depends on what you aim for'
];

const padding = 'padding: 0.2em 0.6em;';

const labelStyle = css`
${padding}
font-weight: bold;
background-color: #f7df1e;
`;

const messageStyle = css`
${padding}
background-color: #ededed;
`;

const messageWaitStyle = css`
${messageStyle}
color: #aeaeae;
`;

// Resolves after 650 msec.
const getDivination = async () => await new Promise(resolve => {
  setTimeout(() => {
    const index = randInt(0, divinations.length);
    const message = divinations[index];
    return resolve(message);
  }, 650);
});

export const Profile = () => {
  const [state, load] = createResourceState();

  // For 'state.message' to load, it takes 650 msec.
  load({ message: getDivination() });

  return (
    <>
      <h1>Profile</h1>
      <div>
        <span className={labelStyle}>message</span>
        <Switch>
          <Match when={!state.message}>
            <span className={messageWaitStyle}>
              Please wait...
            </span>
          </Match>
          <Match when={state.message}>
            <span className={messageStyle}>
              {state.message}
            </span>
          </Match>
        </Switch>
      </div>
    </>
  );
};
