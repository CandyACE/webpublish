import http from 'http'

/**
 * 服务基类
 */
export default class ServerBase {
    constructor(manager) {
        this._parent = manager
        this._app = manager._app;

        /**
         * @type {http.Server}
         */
        this._server = undefined;
    }

    /**
     * 启动
     */
    start() {

    }

    /**
     * 停止
     */
    stop() {
        if (this._server) {
            this._server.close();
            this._server = undefined;
        }
    }

    /**
     * 重启
     */
    restart() {
        this.stop();
        this.start();
    }
}