// @flow
import { generateMnemonic } from '../../utils/crypto';
import type { LuxRecoveryPassphrase } from './types';

export const getLuxAccountRecoveryPhrase = (): LuxRecoveryPassphrase => (
  generateMnemonic().split(' ')
);
