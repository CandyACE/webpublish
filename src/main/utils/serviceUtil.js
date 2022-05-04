import express from 'express'
import path from 'path'
import enableShutdown from 'http-shutdown'

export var checkTask = (req, res, next) => {
  try {
    let id = req.params.id;
    if (!id) {
      return res.status(404).end('id is require.');
    }
    let task = _this._app.taskManager.taskList.find(f => f.id == id);
    if (!task) {
      return res.status(404).end('Not Found This ID.');
    }

    // ReadFile
    // let filePath = task.path;
    let check = task.check();
    if (!check.next) {
      return res.status(check.code).end(check.message);
    }

    next();
    // task.Action(req, res).then().catch(error => {
    //   logger.error(`[MainServer] ${filePath} is not a directory or file.`, error);
    //   return res.status(404).end(JSON.stringify({
    //     task: task,
    //     message: `${filePath} is not a directory or file.`
    //   }))
    // })
  } catch (error) {
    logger.error(`[MainServer] ${filePath} is not a directory or file.`, error)
    res.status(404).end(JSON.stringify({
      task: task,
      message: `${filePath} is not a directory or file.`
    }))
    next(error)
  }
}

export const createServer = () => {
  const server = express().disable('x-powered-by')
  const publicPath = path.resolve(__static, '/views')
  server.use(express.static(publicPath))
  server.set('views', path.join(__static, '/views/'))
  server.set('view engine', 'ejs')
  enableShutdown(server);
  return server;
}