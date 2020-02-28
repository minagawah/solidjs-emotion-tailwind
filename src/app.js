/** @prettier */

import { lazy, createEffect } from 'solid-js';
import { css } from 'emotion';

import { useStore, useScreenSize } from './store';
import { RouteProvider, createRouteHandler } from './router';

import { Loading } from '@/components/loading';
import { Header } from '@/components/header';
import { Home } from '@/components/home';
import { Profile } from '@/components/profile';

const Settings = lazy(() => import('@/components/settings'));

import './style.css';

const loadingStyle = css`
  margin-top: 1.8em;
  margin-left: 1.5em;
`;

export const App = () => {
  const [store, actions] = useStore();

  const router = createRouteHandler('home');
  const { match } = router;

  let width = 0;
  let height = 0;

  /*
   * Subscribe to the change in screen size so that
   * locally defined "width" and "height" sync.
   */
  createEffect(() => {
    ({ width, height } = store);
    console.log(`[App] ${width} x ${height}`);
  });

  actions.setScreenSize();
  actions.setSecret('1234');

  return (
    <RouteProvider router={router}>
      <Header />
      <Suspense fallback={<Loading styles={loadingStyle} />}>
        <Switch fallback={<Home />}>
          {/*
           * For query param handling, look at the example provided by Solid.js:
           * Real World Demo (routing)
           * https://github.com/ryansolid/solid-realworld/blob/master/src/App.js
           */}
          <Match when={match('home', /^home/)}>
            <Home />
          </Match>
          <Match when={match('profile', /^profile/)}>
            <Profile />
          </Match>
          <Match when={match('settings', /^settings/)}>
            <Settings />
          </Match>
        </Switch>
      </Suspense>
    </RouteProvider>
  );
};
