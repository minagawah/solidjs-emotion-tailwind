/** @prettier */

import { lazy, createState, createMemo, createEffect } from 'solid-js';
import { css } from 'emotion';
import { useRouter } from '@/router';

import { Menu } from './menu';
import { Links } from './links';
import { titleStyle } from '../styles';

const Spring = lazy(() => import('./spring'));
const Tripod = lazy(() => import('./tripod'));
const Shapes = lazy(() => import('./shapes'));
const Compass = lazy(() => import('./compass'));

export const Anim = () => {
  const { getParams } = useRouter();
  const [state, setState] = createState({ page: '' });

  createEffect(() => {
    const { params } = getParams() || {};
    const [page] = params || [];
    if (page) {
      setState({ page });
    }
  });

  return (
    <>
      <h2 className={titleStyle}>Animation Samples</h2>

      <Menu />

      <Switch fallback={<Links />}>
        <Match when={state.page === 'spring'}>
          <Spring />
        </Match>
        <Match when={state.page === 'tripod'}>
          <Tripod />
        </Match>
        <Match when={state.page === 'shapes'}>
          <Shapes />
        </Match>
        <Match when={state.page === 'compass'}>
          <Compass />
        </Match>
      </Switch>
    </>
  );
};
