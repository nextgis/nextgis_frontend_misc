import { Trans, TransOptions } from './Trans';

export function createTrans(options: TransOptions): Trans {
  return new Trans(options);
}
