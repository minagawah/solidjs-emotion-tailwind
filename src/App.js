/** @prettier */

import { lazy } from 'solid-js';
import { css } from 'emotion';

import { RouteProvider, createRouteHandler } from '@/router';

import { Loading } from '@/components/Loading';
import { Header } from '@/components/Header';
import { Home } from '@/components/Home';
import { Profile } from '@/components/Profile';

// Unlike other components, 'Settings' is lazy loaded.
const Settings = lazy(() => import('@/components/Settings'));

import './style.css';

const loadingStyle = css`
  margin-top: 1.8em;
  margin-left: 1.5em;
`;

export const App = () => {
  const router = createRouteHandler('home');
  const { match } = router;

  return (
    <RouteProvider router={router}>
      <Header />
      <Suspense fallback={<Loading styles={loadingStyle} />}>
        <Switch fallback={<Home />}>
          <Match when={match('home', /^home/)}>
            <Home />
          </Match>
          <Match when={match('profile', /^profile/)}>
            <Profile />
          </Match>
          <Match when={match('settings', /^settings/)}>
            {/* 'Settings' is lazy loaded */}
            <Settings />
          </Match>
        </Switch>
      </Suspense>
    </RouteProvider>
  );
};
