// @flow
import { observable, computed, action, runInAction } from 'mobx';
import Store from '../lib/Store';
import {LuxgateLog} from '../../types/LuxgateLogType';

export const MAX_LOGER_SIZE = 15;

export default class LuxgateLoggerStore extends Store {

  // REQUESTS
  @observable logbuff: Array<LuxgateLog> = [];
  
  setup() {
    super.setup();

    const { logger } = this.actions.luxgate;
    logger.addLog.listen(this._addLog);

    this.initLogger();
  }

  @action initLogger() {
    this._addLog({
      content: "Welcome to Luxgate.",
      alarm: false
    });

    this._addLog({
      content: "Please login.",
      alarm: false
    });
    
  //  this._addLog("Please login");
  }

  @action _addLog = (logData: {
    content: string,
    alarm: boolean,
  }) => {
    const time = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    const content = logData.content;
    const alarm = logData.alarm;
    const data:LuxgateLog = {time, content, alarm};
    //this.logbuff.push(data);
    this.logbuff.unshift(data);

    this._checkLoggerLimit();
  };

  @action _checkLoggerLimit() {
    if(this.logbuff.length > MAX_LOGER_SIZE) {
      this.logbuff.splice(15, 1);
    }
  }

  @action _clearLogger() {
    this.logbuff.splice(0, this.logbuff.length);
  }
}
