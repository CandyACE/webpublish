import ws from 'ws'
import logger from './Logger'
import RenderApplication from '../RenderApplication'

export default class WebSocketManager {
  /**
   * 
   * @param {RenderApplication} application 
   */
  constructor(application) {
    this.application = application
    this.wss = new ws.Server({ port: 10110 })

    let _this = this

    this.wss.on('connection', function (socket) {
      logger.info('client connected', socket)

      socket.on('message', function (message, isBinary) {
        const data = JSON.parse(message)
        if (!data.code) {
          return
        }
        switch (data.code) {
          case 'getAll':
          default:
            this.send(JSON.stringify(
              _this.application.taskManager.taskList
            ))
            break;
        }
      })
    })
  }

}