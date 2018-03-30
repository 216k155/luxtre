// @flow
import { request } from './lib/request';
import { LUX_API_HOST, LUX_API_PORT, LUX_API_USER, LUX_API_PWD } from './index';

export const getLuxStakingStatus = async (): Promise<boolean> => {
  const response = await request(
    {
      hostname: LUX_API_HOST,
      method: 'POST',
      port: LUX_API_PORT,
      auth: LUX_API_USER + ':' + LUX_API_PWD
    },
    {
      jsonrpc: '2.0',
      method: 'getstakingstatus',
      params: []
    }
  );

  /*
{
    "validtime" : true,
    "haveconnections" : true,
    "walletunlocked" : true,
    "mintablecoins" : true,
    "enoughcoins" : "yes"
}
  */
  if (response)
  {
    return response.validtime == true && 
    response.haveconnections == true && 
    response.walletunlocked == true && 
    response.mintablecoins == true &&
    response.enoughcoins == 'yes';
  }
  else{
    return false;
  }
};
