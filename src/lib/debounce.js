/** @prettier */

export const useDebounce = () => {
  let timerId = null;
  let args = null;
  let started = null;
  let elapsed = 0;

  const cancel = () => {
    if (timerId) {
      elapsed = new Date() - started;
      // console.log(`[debounce] Canceled after ${elapsed}msec`);
      clearTimeout(timerId);
      timerId = null;
      elapsed = 0;
    }
  };

  const cancelDebounce = () => {
    console.log('[debounce] Explicitly canceled for cleanup.');
    cancel();
  };

  const setDebounce = (f, wait = 0, ctx = null) => {
    const g = () => {
      // console.log(`[debounce] Executed after ${elapsed} msec`);
      timerId = null;
      started = null;
      elapsed = 0;
      if (typeof Reflect === 'object') {
        Reflect.apply(f, ctx, args);
      } else {
        Function.prototype.apply.call(f, ctx, args);
      }
    };

    return function() {
      ctx = ctx || this || {};
      args = arguments;

      let now = new Date();
      elapsed = now - started;
      started = now;

      if (timerId) {
        cancel();
      }
      timerId = setTimeout(g, wait);
    };
  };

  return [setDebounce, cancelDebounce];
};
