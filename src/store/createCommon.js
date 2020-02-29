/** @prettier */

export const createCommon = ({ store, setState }) => {
  // "actions" contains previously defined actions.
  const [state, actions] = store;

  const getMessage = () => 'Life is beautiful...';

  // Add properties to previously defined "actions".
  store[1] = {
    ...actions,
    getMessage,
  };
};
