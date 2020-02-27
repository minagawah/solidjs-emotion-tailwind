/** @prettier */

import { createContext, onCleanup } from 'solid-js';

import { useDebounce } from '@/lib/debounce';

export const ScreenSizeContext = createContext([{ width: 0, height: 0 }, {}]);

const screenSize = () => {
  return {
    width: window.innerWidth || 0,
    height: window.innerHeight || 0,
  };
};

export const createScreenSize = ({ store, setState }) => {
  // "actions" contains previously defined actions.
  const [, actions] = store;
  const [setDebounce, cancelDebounce] = useDebounce();

  const setScreenSize = () => {
    setState(screenSize());
  };

  window.addEventListener('resize', setDebounce(setScreenSize, 800));

  onCleanup(() => {
    window.removeEventListener('resize', setScreenSize);
    cancelDebounce();
  });

  // Add properties to previously defined "actions".
  store[1] = {
    ...actions,
    setScreenSize,
  };
};
