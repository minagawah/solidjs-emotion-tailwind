/** @prettier */

export const useDebounce = () => {
  let timerId = null;
  let args = null;
  let started = null;
  let elapsed = 0;

  const reset = () => {
    timerId = null;
    started = null;
    elapsed = 0;
  };

  const cancel = () => {
    // console.log(`[debounce] Cancel (for ${timerId})`);
    if (timerId) {
      elapsed = new Date() - started;
      // console.log(`[debounce] Canceled after ${elapsed}msec`);
      clearTimeout(timerId);
      reset();
    }
  };

  const cancelDebounce = () => {
    console.log('[debounce] Explicitly canceled for cleanup.');
    cancel();
  };

  const setDebounce = (f, wait = 0, ctx = null) => {
    const g = () => {
      if (typeof Reflect === 'object') {
        Reflect.apply(f, ctx, args);
      } else {
        Function.prototype.apply.call(f, ctx, args);
      }
      reset();
    };

    return function() {
      ctx = ctx || this || {};
      args = arguments;

      if (timerId) cancel();

      started = new Date();
      timerId = setTimeout(g, wait);
    };
  };

  return [setDebounce, cancelDebounce];
};
