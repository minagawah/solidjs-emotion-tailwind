/** @prettier */

// import { afterEffects } from 'solid-js';
import { css } from 'emotion';
import tw from 'tailwind.macro';

import { useStore } from '@/store';

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
  ${tw`mt-2 flex flex-row flex-no-wrap justify-start content-center items-center`}
`;

const Settings = () => {
  const [store, actions] = useStore();

  let inputRef;

  const removeSecret = () => actions.removeSecret();

  const setSecret = () => {
    const { value: secret } = inputRef || {};
    if (secret) {
      actions.setSecret(secret);
    }
  };

  // afterEffects(() => {
  //   console.log(inputRef);
  // });
  //
  // TODO: 'afterEffects' does not fire...
  setTimeout(() => {
    console.log(`[Settings] inputRef: ${inputRef ? 'yes' : 'no'}`);
  }, 400);

  return (
    <>
      <h1>Settings</h1>

      <p>This component is lazy loaded.</p>

      <p>Setting/Removing secret codes to/from local storage.</p>

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
          ref={inputRef}
          type="text"
          value={store.secret}
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
