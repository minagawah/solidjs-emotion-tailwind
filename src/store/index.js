/** @prettier */

import { createResourceState, createContext, useContext } from 'solid-js';

import { ScreenSizeContext, createScreenSize } from './createScreenSize';
import { createCommon } from './createCommon';

const StoreContext = createContext();

/*
 * For more state management examples, look at the ones provided by Solid.js:
 * Real World Demo (store management)
 * https://github.com/ryansolid/solid-realworld/tree/master/src/store
 */
export const StoreProvider = props => {
  const [state, loadState, setState] = createResourceState({});
  const store = [state, {}];

  createCommon({ store, loadState, setState });
  createScreenSize({ store, loadState, setState });

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
export const useScreenSize = () => useContext(ScreenSizeContext);
