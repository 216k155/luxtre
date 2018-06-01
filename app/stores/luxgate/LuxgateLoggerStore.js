// @flow
import { observable, computed, action, runInAction } from 'mobx';
import Store from '../lib/Store';
import LuxgateLogType from '../../types/LuxgateLogType';

export default class LuxgateLoggerStore extends Store {

  // REQUESTS
  @observable logbuff: Array<LuxgateLogType> = [];
  
  setup() {
    super.setup();

    const { logger } = this.actions.luxgate;
    logger.addLog.listen(this._addLog);
  }

  @action _addLog = (log: string) => {
    const curTime = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    this.logbuff.push(curTime, log);
  };

}
