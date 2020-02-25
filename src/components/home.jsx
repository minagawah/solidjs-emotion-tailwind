import { createState, onCleanup } from 'solid-js';
import { css } from 'emotion';

const padding = 'padding: 0.2em 0.6em;';

const cntLabelStyle = css`
  ${padding}
  font-weight: bold;
  background-color: #f7df1e;
`;

const cntContentStyle = css`
  ${padding}
  background-color: #ededed;
`;

export const Home = () => {
  const [state, setState] = createState({ count: 0 });

  let timer = setInterval(() => {
    setState('count', cnt => cnt + 1);
  }, 1000);

  onCleanup(() => {
    clearInterval(timer);
  });

  return (
    <>
      <h1>Home</h1>
      <div>
        <span className={cntLabelStyle}>Count</span>
        <span className={cntContentStyle}>{state.count}</span>
      </div>
    </>
  );
};
