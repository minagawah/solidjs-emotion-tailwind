/** @prettier */

import { lazy } from 'solid-js';
import { css } from 'emotion';

import { useStore, useScreenSize } from './store';
import { RouteProvider, createRouteHandler } from './router';

import { Loading } from '@/components/loading';
import { Header } from '@/components/header';
import { Top } from '@/components/top';
import { Anim } from '@/components/anim';
import { Profile } from '@/components/profile';
import { Settings } from '@/components/settings';

import './styles.css';

const loadingStyle = css`
  margin-top: 1.8em;
  margin-left: 1.5em;
`;

export const App = () => {
  const [, actions] = useStore();

  const router = createRouteHandler('top');
  const { match } = router;

  actions.setScreenSize();

  console.log(`[App] ${actions.getMessage()}`);

  return (
    <RouteProvider router={router}>
      <Header />
      <Suspense fallback={<Loading styles={loadingStyle} />}>
        <Switch fallback={<Top />}>
          <Match when={match(/^top/)}>
            <Top />
          </Match>
          {/* Anim: Top */}
          <Match when={match(/^anim$/)}>
            <Anim />
          </Match>
          {/* Anim: Sub-Pages (with query parameters) */}
          <Match when={match(/^anim\/?(.*)$/)}>
            <Anim />
          </Match>
          <Match when={match(/^profile/)}>
            <Profile />
          </Match>
          <Match when={match(/^settings/)}>
            <Settings />
          </Match>
        </Switch>
      </Suspense>
    </RouteProvider>
  );
};
