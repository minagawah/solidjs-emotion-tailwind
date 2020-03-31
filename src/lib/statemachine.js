/** @prettier */

export const WAIT = 'WAIT';
export const PROGRESS = 'PROGRESS';
export const SUCCESS = 'SUCCESS';
export const FAIL = 'FAIL';

const KEYS = [WAIT, PROGRESS, SUCCESS, FAIL];

export const createStateMachine = (givenStatus = WAIT) => {
  const $_ = { status: WAIT };

  $_.IN_PROGRESS = () => $_.status === PROGRESS;

  const setStatus = status => {
    if (!status) throw new Error('No status');
    if (!KEYS.includes(status)) {
      throw new Error(`No such key: ${status}`);
    }
    $_.status = status;
  };

  const tapSetter = key => () => {
    setStatus(key);
    return key;
  };

  KEYS.forEach(key => {
    $_[key] = tapSetter(key);
  });

  return $_;
};
