/** @prettier */

import { createResourceState, createContext, useContext } from 'solid-js';

import { createCommon } from './createCommon';
import { createScreenSize } from './createScreenSize';
import { createSecret } from './createSecret';

const StoreContext = createContext();

const initialState = { secret: '1234' };
const initialAction = {};

/*
 * For more state management examples, look at the ones provided by Solid.js:
 * Real World Demo (store management)
 * https://github.com/ryansolid/solid-realworld/tree/master/src/store
 */
export const StoreProvider = props => {
  const [state, loadState, setState] = createResourceState(initialState);
  const store = [state, initialAction];

  createCommon({ store, loadState, setState });
  createScreenSize({ store, loadState, setState });
  createSecret({ store, loadState, setState });

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
