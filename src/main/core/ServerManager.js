import FileServer from "./server/FileServer";
import { EventEmitter } from 'events'
import RenderApplication from "../RenderApplication";
import ApiServer from "./server/ApiServer";

export default class ServerManager extends EventEmitter {
  /**
   * 
   * @param {RenderApplication} application 
   */
  constructor(application) {
    super()
    /**
     * @type {RenderApplication}
     */
    this._app = application;
    /**
     * @type {FileServer}
     */
    this._server = new FileServer(this);

    /**
     * @type {ApiServer}
     */
    this._server_api = new ApiServer(this);
    this.isRunning = true;
    this.apiIsRunning = false;
  }

  stop() {
    this._server.stop();
    this._server_api.stop();
    this.isRunning = false;
  }

  restart() {
    this.stop()
    this.start()
  }

  start() {
    var _this = this;
    this._server.start().then(function () {
      _this.emit('server')
      _this.isRunning = true;
    }).catch(function (err) {
      _this.emit('server', err)
      _this.isRunning = false;
    })

    this._server_api.start().then(function () {
      _this.emit('server_api');
      _this.apiIsRunning = true;
    }).catch(function (err) {
      _this.emit('server_api', err);
      _this.apiIsRunning = false;
    });
  }

  apiStop() {
    this._server_api.stop();
    this.apiIsRunning = false;
  }

  apiRestart() {
    this.apiStop();
    this.apiStart();
  }

  apiStart() {
    var _this = this;
    this._server_api.start().then(function () {
      _this.emit('server_api');
      _this.apiIsRunning = true;
    }).catch(function (err) {
      _this.emit('server_api', err);
      _this.apiIsRunning = false;
    });
  }
}