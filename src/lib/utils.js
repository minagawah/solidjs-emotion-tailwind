import { compose, identity, tap } from 'ramda';

export const int = Math.trunc;

export const boo = compose(
  tap(console.log),
  identity
);

export const rand = (min = 0, max = 10) => Math.random() * (max - min) + min;

export const randInt = (min = 0, max = 10) =>
  Math.floor(Math.random() * (max - min)) + min;
