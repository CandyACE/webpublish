import { app, BrowserWindow } from 'electron'
import electron from 'electron'
import Update from './core/update'
import EventListener from './EventListener'
import path from 'path'
import is from 'electron-is'
import Launcher from './Launcher'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

/**
 * Fix Windows notification func
 * appId defined in .electron-vue/webpack.main.config.js
 */
if (is.windows()) {
  app.setAppUserModelId(appId)
}

global.launcher = new Launcher()