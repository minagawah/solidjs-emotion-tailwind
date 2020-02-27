/** @prettier */

import { css } from 'emotion';
import tw from 'tailwind.macro';

import { useStore } from '@/store';

const mt2 = tw`mt-2`;
const flexRow = tw`flex flex-row flex-no-wrap justify-start content-center items-center`;

const secretStyle = css`
  ${tw`p-1 pl-4 pr-4 text-gray-200 bg-black`}
`;

const secretInputStyle = css`
  ${tw`pt-1 pb-1`}
  font-size: 1.1em;
`;

const secretButtonStyle = css`
  ${tw`ml-2 p-1 pl-2 pr-2`}
`;

const secretWrapperStyle = css`
  ${mt2}
  ${flexRow}
`;

const Settings = () => {
  const [store, actions] = useStore();

  const removeSecret = () => actions.removeSecret();

  const setSecret = () => {
    const { value: secret } = document.querySelector('#secret');
    console.log(`[Settings] secret: ${secret}`);
    if (secret) {
      actions.setSecret(secret);
    }
  };

  return (
    <>
      <h1>Settings</h1>
      <p>This component is lazy loaded.</p>
      <div className={secretWrapperStyle}>
        <div className={secretStyle}>
          <Show when={store.secret} fallback="(no secret)">
            {store.secret}
          </Show>
        </div>
        <button className={secretButtonStyle} onClick={removeSecret}>
          Remove Secret
        </button>
      </div>
      <div className={secretWrapperStyle}>
        <input
          id="secret"
          type="text"
          value="1234"
          className={secretInputStyle}
        />
        <button className={secretButtonStyle} onClick={setSecret}>
          Set Secret
        </button>
      </div>
    </>
  );
};

export default Settings;
