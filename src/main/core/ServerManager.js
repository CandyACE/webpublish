import FileServer from "./server/FileServer";

export default class ServerManager {
  constructor(application) {
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
    this._server.restart()
  }

  start() {
    var _this = this;
    this._server.start().then(() => {
      _this.isRunning = true;
    }).catch(err => {
      _this.isRunning = false;
    })
  }
}