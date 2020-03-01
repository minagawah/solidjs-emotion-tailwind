/** @prettier */

import { lazy, createState, createMemo, createEffect } from 'solid-js';

import { useRouter } from '@/router';
import { Loading } from '@/components/loading';
import { Header } from './header';

const Spring = lazy(() => import('./spring'));
const Tripod = lazy(() => import('./tripod'));

export const Canvas = () => {
  const { getParams } = useRouter();
  const [state, setState] = createState({ page: '' });

  createEffect(() => {
    const {
      params: [page],
    } = getParams() || {};

    if (page) {
      setState({ page });
    }
  });

  return (
    <>
      <h1>Canvas</h1>
      <Header />
      <Switch>
        <Match when={state.page === 'spring'}>
          <Spring />
        </Match>
        <Match when={state.page === 'tripod'}>
          <Tripod />
        </Match>
      </Switch>
    </>
  );
};
