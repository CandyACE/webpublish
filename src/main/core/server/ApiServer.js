import ServerBase from "./ServerBase";
import http from 'http'
import logger from "../Logger";
import { promisify } from "util";
import fs from 'fs';
import { guid } from "../../../shared/twtools";
import path from "path";

const stat = promisify(fs.stat)

export default class ApiServer extends ServerBase {
    constructor(manager) {
        super(manager)
        this._router = {}
        this.initRouter();
    }

    initRouter() {
        this._router['/getList'] = (req, host) => {
            var list = [...this._app.taskManager.taskList]
            list.forEach(task => {
                var url = task.getUrl();
                task.url = `http://${host}/${task.id}/${url}`
            })
            return JSON.stringify({
                taskList: list
            })
        };

        this._router['/addTask'] = async (req, host) => {
            let url = new URL(req.url, `http://${req.headers.host}`);
            let pathname = url.searchParams.get("path");
            if (pathname) {
                let filename = path.basename(pathname, path.extname(pathname))
                var stats = await stat(pathname);
                let item = {
                    id: guid(),
                    path: pathname,
                    name: filename,
                }
            }
        }
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

                    let url = new URL(req.url, `http://${req.headers.host}`);
                    var fun = _this._router[url.pathname]
                    if (fun) {


                        var port = _this._app.configManager.getSystemConfig('port', 9090);
                        res.setHeader('Content-Type', 'text/json;charset=UTF-8');//utf8编码，防止中文乱码
                        res.setHeader('Access-Control-Allow-Origin', "*")
                        res.setHeader('Access-Control-Allow-Headers', "*")
                        res.setHeader('Access-Control-Allow-Private-Network', "true")
                        res.setHeader('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS')
                        res.end(fun(req, url.hostname + ":" + port))
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
        res.setHeader('Access-Control-Allow-Origin', "*")
        res.end(message)
    }
}