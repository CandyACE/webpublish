import httpProxy from 'http-proxy'
import logger from '../core/Logger';

/**
 * @type {httpProxy}
 */
var proxy_server = undefined;

export default class ProxyUtil {
    /**
     * 
     * @returns {httpProxy}
     */
    static getInstance() {
        if (!proxy_server) {
            proxy_server = httpProxy.createProxyServer();

            proxy_server.on('error', function (err, req, res) {
                logger.error(err);
                res.end('[httpProxy] has error: ' + err)
            })
        }
        return proxy_server;
    }
}