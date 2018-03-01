// @flow
import type { LuxWallet } from './types';
import { request } from './lib/request';

export type ImportLuxBackupJSONParams = {
  ca: string,
  filePath: string,
};

export const importLuxBackupJSON = (
  { ca, filePath }: ImportLuxBackupJSONParams,
): Promise<LuxWallet> => (
  request({
    hostname: 'localhost',
    method: 'POST',
    path: '/api/backup/import',
    port: 8090,
    ca,
  }, {}, filePath)
);
