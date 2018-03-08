// @flow
import type { LuxWalletRecoveryPhraseResponse } from './types';
import { generateMnemonic } from '../../utils/crypto';

export const getLuxAccountRecoveryPhrase = (): LuxWalletRecoveryPhraseResponse => (
  generateMnemonic().split(' ')
);
