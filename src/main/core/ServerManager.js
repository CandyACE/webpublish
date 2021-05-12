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
  }

  stop() {
    this._server.stop();
  }

  restart() {
    this._server.restart()
  }

  start() {
    this._server.start()
  }
}