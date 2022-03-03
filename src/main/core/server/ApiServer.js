import ServerBase from "./serverBase";
import http from 'http'
import logger from "../Logger";

export default class ApiServer extends ServerBase {
    constructor(manager) {
        super(manager)
        this._router = {}
        this.initRouter();
    }

    initRouter() {
        this._router['/getList'] = (host) => {
            var list = [...this._app.taskManager.taskList]
            list.forEach(task => {
                var url = task.getUrl();
                task.url = `http://${host}/${task.id}/${url}`
            })
            return JSON.stringify({
                taskList: list
            })
        };
    }

    start() {
        var _this = this;
        this.stop();
        return new Promise((resolve, reject) => {
            try {

                var enabled = this._app.configManager.getSystemConfig('api-enabled', false);
                if (!enabled) {
                    reject('nouse');
                    return;
                }

                _this._server = new http.createServer(async function (req, res) {
                    if (!req.url) {
                        _this._error(res, 'error url');
                        return;
                    }

                    var fun = _this._router[req.url]
                    if (fun) {
                        res.setHeader('Content-Type', 'text/json;charset=UTF-8');//utf8编码，防止中文乱码
                        res.end(fun(req.headers.host))
                        return;
                    }

                    res.end('error')
                })

                var port = _this._app.configManager.getSystemConfig('api-port', '9100');

                _this._server.on('error', function () {
                    reject(_this.i18n.t('app.port-exist', { port }))
                })

                _this._server.listen(port, () => {
                    resolve();
                })
            } catch (error) {
                logger.error('[ApiServer] running with error.', error)
            }
        })
    }

    _error(res, message) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/javascript;charset=UTF-8');//utf8编码，防止中文乱码
        res.end(message)
    }
}