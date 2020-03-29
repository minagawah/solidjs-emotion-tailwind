/** @prettier */

const keys = ['WAIT', 'PROGRESS', 'SUCCESS', 'FAIL'];

const mapping = {
  WAIT: 0,
  PROGRESS: 1,
  SUCCESS: 2,
  FAIL: 3,
};

export const createStateMachine = (initialState = 'WAIT') => {
  const $_ = { state: 0 };

  $_.IN_PROGRESS = $_.inProgress = () => $_.state === 1;

  $_.get = () => keys[$_.state];

  $_.set = key => {
    if (!key) throw new Error('No state');
    if (!keys.includes(key)) {
      throw new Error(`No such key: ${key}`);
    }
    $_.state = mapping[key];
  };

  const tapSetter = key => () => {
    $_.set(key);
    return key;
  };

  $_.WAIT = tapSetter('WAIT');
  $_.PROGRESS = tapSetter('PROGRESS');
  $_.SUCCESS = tapSetter('SUCCESS');
  $_.FAIL = tapSetter('FAIL');

  $_.set(initialState);

  return $_;
};
