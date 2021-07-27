import FileServer from "./server/FileServer";
import { EventEmitter } from 'events'

export default class ServerManager extends EventEmitter {
  constructor(application) {
    super()
    this._app = application;
    /**
     * @type {FileServer}
     */
    this._server = new FileServer(this);

    /**
     * @type {http.Server}
     */
    this._server_api = undefined;
    this.isRunning = false;
  }

  stop() {
    this._server.stop();
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
    }).catch(function (err) {
      _this.emit('server', err)
    })
  }
}