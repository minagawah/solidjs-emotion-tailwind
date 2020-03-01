/** @prettier */

import { lazy, createEffect } from 'solid-js';
import { css } from 'emotion';

import { useStore, useScreenSize } from './store';
import { RouteProvider, createRouteHandler } from './router';

import { Loading } from '@/components/loading';
import { Header } from '@/components/header';
import { Home } from '@/components/home';
import { Profile } from '@/components/profile';
import { Canvas } from '@/components/canvas';

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
    console.log(`[App] screen: ${width} x ${height}`);
  });

  actions.setScreenSize();

  console.log(`[App] ${actions.getMessage()}`);

  return (
    <RouteProvider router={router}>
      <Header />
      <Suspense fallback={<Loading styles={loadingStyle} />}>
        <Switch fallback={<Home />}>
          <Match when={match(/^home/)}>
            <Home />
          </Match>
          <Match when={match(/^profile/)}>
            <Profile />
          </Match>
          {/* Canvas: Top */}
          <Match when={match(/^canvas$/)}>
            <Canvas />
          </Match>
          {/* Canvas: Sub-Pages (with query parameters) */}
          <Match when={match(/^canvas\/?(.*)$/)}>
            <Canvas />
          </Match>
          <Match when={match(/^settings/)}>
            <Settings />
          </Match>
        </Switch>
      </Suspense>
    </RouteProvider>
  );
};
