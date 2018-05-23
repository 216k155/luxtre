// @flow
import type { LuxgateAccountNewPhraseResponse } from './types';
import { generateMnemonic } from '../../utils/crypto';

export const getLuxgateAccountNewPhrase = (): LuxgateAccountNewPhraseResponse => (
  generateMnemonic().split(' ')
);
