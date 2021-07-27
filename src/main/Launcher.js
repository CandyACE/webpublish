import { EventEmitter } from 'events'
import { app } from 'electron'
import is from 'electron-is'
import ExceptionHandler from './core/ExceptionHandler'
import logger from './core/Logger'
import Application from './Application'
import { parseArgvAsFile, splitArgv } from './common/utils'
import Vue from 'vue'

export default class Launcher extends EventEmitter {
  constructor() {
    super()

    logger.info('Launcher init')
    this.makeSingleInstance(() => {
      this.init()
    })
  }

  makeSingleInstance(callback) {
    // MAC 不支持单例模式
    if (is.macOS()) {
      callback && callback()
      return
    }

    const gotSingleLock = app.requestSingleInstanceLock()

    if (!gotSingleLock) {
      app.quit()
    } else {
      app.on('second-instance', (event, argv, workingDirectory) => {
        global.application.showPage('index')
        if (!is.macOS() && argv.length > 1) {
          this.handleAppLaunchArgv(argv)
        }
      })

      callback && callback()
    }
  }

  init() {
    this.exceptionHandler = new ExceptionHandler()

    this.openedAtLogin = is.macOS()
      ? app.getLoginItemSettings().wasOpenedAtLogin
      : false

    if (process.argv.length > 1) {
      this.handleAppLaunchArgv(process.argv)
    }

    logger.info('[WebPublish] openedAtLogin:', this.openedAtLogin)

    this.handelAppReady()
  }

  /**
  * handleAppLaunchArgv
  * For Windows, Linux
  * @param {array} argv
  */
  handleAppLaunchArgv(argv) {
    logger.info('[Motrix] handleAppLaunchArgv:', argv)

    // args: array, extra: map
    const { args, extra } = splitArgv(argv)
    logger.info('[Motrix] split argv args:', args)
    logger.info('[Motrix] split argv extra:', extra)
    if (extra['--opened-at-login'] === '1') {
      this.openedAtLogin = true
    }

    // const file = parseArgvAsFile(args)
    // if (file) {
    //   this.file = file
    //   this.sendFileToApplication()
    // }
  }

  handelAppReady() {
    app.on('ready', () => {
      global.application = new Application()

      const { openedAtLogin } = this
      global.application.start('index', {
        openedAtLogin
      })
    })

    app.on('activate', () => {
      if (global.application) {
        logger.info('[WebPublish] activate')
        global.application.showPage('index')
      }
    })
  }
}