/** @prettier */

import { createResourceState, createContext, useContext } from 'solid-js';

import { ScreenSizeContext, createScreenSize } from './createScreenSize';
import { createCommon } from './createCommon';

const StoreContext = createContext();

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
