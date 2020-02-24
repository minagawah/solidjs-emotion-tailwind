import { createState, onCleanup } from 'solid-js';
import { css } from 'emotion';

import { int } from '@/lib/utils';

const padding = '0.2em 0.6em;';

const cntLabelStyle = css`
padding: ${padding}
font-weight: bold;
background-color: #f7df1e;
`;

const cntContentStyle = css`
padding: ${padding}
background-color: #ededed;
`;

export const Home = () => {
  const [state, setState] = createState({ count: 0 });

  let timer = setInterval(() => {
    setState('count', cnt => int(cnt + (1 * 1.01)));
  }, 1000);

  onCleanup(() => {
    clearInterval(timer);
  });
  
  return (
    <>
      <h1>Home</h1>
      <div>
        <span className={cntLabelStyle}>Count</span>
        <span className={cntContentStyle}>
          {state.count}
        </span>
      </div>
    </>
  );
}
