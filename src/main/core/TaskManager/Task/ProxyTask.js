import TaskBase from "./TaskBase";
import ProxyUtil from "../../../utils/proxyUtil";
import logger from "../../Logger";
import url from 'url'
import AsyncLock from "async-lock";
import express from 'express'
import { TASK_STATUS } from "../../../../shared/constants";

const asyncLock = new AsyncLock();

export default class ProxyTask extends TaskBase {
    constructor(task) {
        super(task);
        let _this = this;
    }

    setEnable(val) {
        this.enable = val;
        return val;
    }

    /**
     * 
     * @param {http.IncomingMessage} req 
     * @param {http.ServerResponse} res 
     * @param {TaskBase} taskInfo
     * @param {fs.Stats} stats
     */
    static async Action(req, res, taskInfo, stats) {
        try {
            asyncLock.acquire('proxyTask-size-write', function () {
                ++taskInfo.useData;
            })
            req.url = req.url.replace('/' + taskInfo.id, "")
            ProxyUtil.getInstance().web(req, res, {
                target: taskInfo.path
            })
        } catch (error) {
            logger.error(error)
        }
    }

    static InitRouter() {
        const app = express().disable('x-powered-by');

        app.get("*", function (req, res, next) {
            if (!req.task || req.task.type !== TASK_STATUS.PROXY) {
                return next('route')
            }

            ProxyTask.Action(req, res, req.task)
        })

        return app;
    }
}