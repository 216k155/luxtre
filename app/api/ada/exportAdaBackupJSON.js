// @flow
import { request } from './lib/request';

export type ExportLuxBackupJSONParams = {
  ca: string,
  walletId: string,
  filePath: string,
};

export const exportLuxBackupJSON = (
  { ca, walletId, filePath }: ExportLuxBackupJSONParams,
): Promise<[]> => (
  request({
    hostname: 'localhost',
    method: 'POST',
    path: `/api/backup/export/${walletId}`,
    port: 8090,
    ca,
  }, {}, filePath)
);
