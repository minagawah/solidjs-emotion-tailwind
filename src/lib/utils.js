import { compose, identity, tap } from 'ramda';

export const int = Math.trunc;

export const boo = compose(
  tap(console.log),
  identity
);
