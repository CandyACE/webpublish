import { app, BrowserWindow } from 'electron'
import electron from 'electron'
import Update from './core/update'
import EventListener from './EventListener'
import path from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// 托盘
const Menu = electron.Menu
const Tray = electron.Tray
let appTray

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 700,
    useContentSize: true,
    width: 330,
    frame: false,
    minHeight: 500,
    minWidth: 330,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  global.update = new Update(mainWindow);
  new EventListener();

  var trayMenuTemplate = [
    {
      label: '显示主界面',
      click: function () {
        mainWindow.show()
      }
    },
    {
      label: '退出',
      click: function () {
        app.quit()
        // app.quit() //因为程序设定关闭为最小化，所以调用两次关闭，防止最大化时一次不能关闭的情况
      }
    }
  ]

  appTray = new Tray(path.join(__static, 'image/icon.ico'))
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
  appTray.setToolTip('快速发布工具')
  appTray.setContextMenu(contextMenu)
  appTray.on('click', function () {
    mainWindow.show()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
 autoUpdater.quitAndInstall()
})

app.on('ready', () => {
 if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
*/