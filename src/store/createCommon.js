/** @prettier */

import { createEffect } from 'solid-js';

export const createCommon = ({ store, setState }) => {
  // "actions" contains previously defined actions.
  const [state, actions] = store;

  createEffect(() => {
    state.secret
      ? localStorage.setItem('secret', state.secret)
      : localStorage.removeItem('secret');
  });

  const setSecret = secret => setState({ secret });
  const removeSecret = secret => setState({ secret: null });

  // Add properties to previously defined "actions".
  store[1] = {
    ...actions,
    setSecret,
    removeSecret,
  };
};
