import ServerBase from "./serverBase";
import http from 'http'

export default class ApiServer extends ServerBase {
    constructor(manager) {
        super(manager)
    }

    start() {
        var _this = this;
        this.stop();
        this._server = new http.createServer(async function (req, res) {
            if (!req.url) {
                
            }
        })
    }
}