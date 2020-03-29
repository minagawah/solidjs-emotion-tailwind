/** @prettier */

import { createSignal, onCleanup, createContext, useContext } from 'solid-js';

const RouterContext = createContext({});

/**
 * @returns {Array} - [store, action]
 */
export const useRouter = () => useContext(RouterContext);

export const RouteProvider = props => {
  if (!props.router) return null;

  return (
    <RouterContext.Provider value={props.router}>
      {props.children}
    </RouterContext.Provider>
  );
};

/**
 * Usage:
 * const router = createRouteHandler('top');
 * const { match } = router;
 * <Match when={match(/^top/)}>
 */
export const createRouteHandler = initial => {
  const [location, setLocation] = createSignal(
    window.location.hash.slice(2) || initial
  );
  const [read, triggerParams] = createSignal();

  const locationHandler = () => {
    // console.log(`[Route] route: ${window.location.hash}`);
    setLocation(window.location.hash.slice(1));
  };

  let params;

  window.addEventListener('hashchange', locationHandler);

  onCleanup(() => {
    window.removeEventListener('hashchange', locationHandler);
    params = void 0;
  });

  return {
    location,
    match: test => {
      const loc = location().split('?')[0];
      const match = test.exec(loc);

      if (match) {
        params = { params: match.slice(1) };
        triggerParams();
      }
      return !!match;
    },
    // TODO: Consider revising the comma operator.
    getParams: () => (read(), params),
  };
};
