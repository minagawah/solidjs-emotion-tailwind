/** @prettier */

import { createEffect } from 'solid-js';

export const createSecret = ({ store, setState }) => {
  // "actions" contains previously defined actions.
  const [state, actions] = store;

  /** @private */
  const getFromLocalStorage = () => localStorage.getItem('secret');

  /** @private */
  const setLocalStorage = secret => localStorage.setItem('secret', secret);

  /** @private */
  const removeLocalStorage = () => localStorage.removeItem('secret');

  const setSecret = secret => setState({ secret });
  const removeSecret = () => setState({ secret: null });

  // Whether initialized already.
  let ready = false;

  const init = () => {
    const local = getFromLocalStorage();
    if (local) {
      setSecret(local);
    }
    ready = true;
  };

  init();

  /**
   * Having '1234' as default secret value, it overwrites
   * the one already stored in local storage with '1234'.
   * So, we need '!getFromLocalStorage' to check nothing is
   * stored in local storage. However, this prevents from
   * writing values to local storage second time onward.
   * So, we need 'ready' to allow it for second time onward.
   */
  createEffect(() => {
    if (!getFromLocalStorage() || ready) {
      if (state.secret) {
        setLocalStorage(state.secret);
      } else {
        removeLocalStorage();
      }
    }
  });

  // Add properties to previously defined "actions".
  store[1] = {
    ...actions,
    init,
    setSecret,
    removeSecret,
  };
};
