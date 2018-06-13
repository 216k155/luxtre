// @flow
import { observable, computed, action, runInAction } from 'mobx';
import BigNumber from 'bignumber.js';
import Store from '../lib/Store';
import Request from '.././lib/LocalizedRequest';

import type {
  SetCoinSettingResponse, 
} from '../../api/common';

import {
  ELECTRUM_PORT,
  ELECTRUM_ADDRESS
} from '../../api/common';

export default class LuxgateSettingInfoStore extends Store {

  // REQUESTS
  @observable setCoinSettingRequest: Request<SetCoinSettingResponse> = new Request(this.api.luxgate.setCoinSetting);

  @observable coinSettings = [];
  
  setup() {
    super.setup();

    const { router, luxgate } = this.actions;
    const { settingInfo } = luxgate;
    settingInfo.saveSettings.listen(this._saveSettings);
  }
  @action _saveSettings = async (settings: Array) => {
    const password = this.stores.luxgate.loginInfo.password; 
    const addr = ELECTRUM_ADDRESS;
    const port = ELECTRUM_PORT;

    if(password == "") return;
    var coinSettings = this.coinSettings;
    var isNew;
    for(var i=0; i<settings.length; i++) {
      isNew = true;
      for(var j=0; j<coinSettings.length; j++) {
        if(settings[i].value == coinSettings[j].coin && (settings[i].active == 'active' || coinSettings[j].status == 'active')) {
          if(settings[i].active != coinSettings[j].status || settings[i].wallet != coinSettings[j].installed) {
            const info: SetCoinSettingResponse = await this.setCoinSettingRequest.execute(password, settings[i].value, settings[i].active, settings[i].wallet, addr, port).promise;
            const objInfo = JSON.parse(info);
            if(objInfo)
            {
              this.coinSettings[j].status = objInfo[0].status;
            }
          }
          isNew = false;
          break;
        }
      }

      if(isNew && settings[i].active == 'active') {
        const info: SetCoinSettingResponse = await this.setCoinSettingRequest.execute(password, settings[i].value, settings[i].active, settings[i].wallet, addr, port).promise;
        const objInfo = JSON.parse(info);
        if(objInfo) {
          if(!settings[i].wallet) objInfo.push({coin: settings[i].value, installed: false, status: "active" });
          this.coinSettings.push(objInfo);
        }
      }
    }
  };

  @action _logoutAccount = () => {
    this.myPhrase = '';
    this.isLogined = false;
  };

}
