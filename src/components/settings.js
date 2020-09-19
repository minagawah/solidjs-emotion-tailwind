/** @prettier */

import { css } from 'emotion';
import tw from 'twin.macro';

import { useStore } from '@/store';
import { darkgray, pink, yellow } from '@/constants/colors';

import { titleStyle } from './styles';

const wrapperStyle = css`
  ${tw`mt-2 flex flex-row flex-no-wrap justify-start content-center items-center`}
`;

const padding = css`
  ${tw`p-1 pl-4 pr-4`}
`;

// font-weight ---> [normal] 400 [medium] 500 [bold] 700
const secretStyle = css`
  ${tw`text-center font-bold`}
  ${padding}
  background-color: ${yellow};
  color: ${darkgray};
`;

const buttonStyle = css`
  ${tw`ml-2 border-none text-center font-bold`}
  ${padding}
  background-color: ${pink};
  min-width: 90px;
`;

const inputStyle = css`
  ${tw`border-none font-bold`}
  ${padding}
`;

export const Settings = () => {
  const [store, actions] = useStore();

  let ref;

  const removeSecret = () => actions.removeSecret();

  const setSecret = () => {
    const { value } = ref || {};
    if (value) {
      actions.setSecret(value);
    }
  };

  return (
    <>
      <h2 className={titleStyle}>Settings</h2>

      <p>Set/Delete a secret code to/from local storage.</p>

      <div className={wrapperStyle}>
        <div className={secretStyle}>
          <Show when={store.secret} fallback="(no secret)">
            {store.secret}
          </Show>
        </div>
        <button className={buttonStyle} onClick={removeSecret}>
          Delete
        </button>
      </div>

      <div className={wrapperStyle}>
        <input
          ref={ref}
          type="text"
          value={store.secret}
          className={inputStyle}
        />
        <button className={buttonStyle} onClick={setSecret}>
          Set
        </button>
      </div>
    </>
  );
};
