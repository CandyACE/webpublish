import http from 'http'
import RenderApplication from '../../RenderApplication';
import { getI18n } from '../../ui/Locale'
import ServerManager from '../ServerManager';

/**
 * 服务基类
 */
export default class ServerBase {
    /**
     * 
     * @param {ServerManager} manager 
     */
    constructor(manager) {
        /**
         * @type {ServerManager}
         */
        this._parent = manager
        /**
         * @type {RenderApplication}
         */
        this._app = manager._app;

        this.i18n = getI18n()

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