import { createSignal, onCleanup } from 'solid-js';
import { render } from "solid-js/dom";

import { boo } from '@/lib/utils';

import { Header } from '@/components/header';
import { Home } from '@/components/home';
import { Profile } from '@/components/profile';
import { Settings } from '@/components/settings';

import './style.css';

const App = () => {
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
        <Match when={matches('settings')}>
          <Settings />
        </Match>
      </Switch>
    </>
  );
};

render(App, document.getElementById('app'));

/**
 * @returns {boolean}
 */
function createRouteHandler () {
  const [location, setLocation] = createSignal('home');

  /**
   * @param {HashChangeEvent}
   */
  const locationHandler = () => {
    boo(`[app] window.location.hash: ${window.location.hash}`);
    setLocation(window.location.hash.slice(1));
  };

  window.addEventListener('hashchange', locationHandler);

  onCleanup(() => {
    window.removeEventListener('hashchange', locationHandler);
  });

  return name => name === location();
}
