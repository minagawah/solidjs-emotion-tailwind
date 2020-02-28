/** @prettier */

import { render } from 'solid-js/dom';
import { StoreProvider } from './store';
import { App } from './app';

render(
  () => (
    <StoreProvider>
      <App />
    </StoreProvider>
  ),
  document.getElementById('app')
);
