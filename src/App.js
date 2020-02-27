/** @prettier */

import { createSignal, onCleanup, lazy } from 'solid-js';

import { Header } from '@/components/Header';
import { Home } from '@/components/Home';
import { Profile } from '@/components/Profile';

// Unlike other components, 'Settings' is lazy loaded.
const Settings = lazy(() => import('@/components/Settings'));

import './style.css';

export const App = () => {
  const matches = createRouteHandler();
  return (
    <>
      <Header />
      <Switch>
        <Match when={matches('home')}>
          <Home />
        </Match>
        <Match when={matches('profile')}>
          <Profile />
        </Match>
        {/* 'Settings' is lazy loaded */}
        <Match when={matches('settings')}>
          <Suspense fallback={<div>Loading...</div>}>
            <Settings />
          </Suspense>
        </Match>
      </Switch>
    </>
  );
};

/**
 * @returns {boolean}
 */
function createRouteHandler() {
  const [location, setLocation] = createSignal('home');

  /**
   * @param {HashChangeEvent}
   */
  const locationHandler = () => {
    console.log(`[app] window.location.hash: ${window.location.hash}`);
    setLocation(window.location.hash.slice(1));
  };

  window.addEventListener('hashchange', locationHandler);

  onCleanup(() => {
    window.removeEventListener('hashchange', locationHandler);
  });

  return name => name === location();
}
