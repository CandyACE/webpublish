import { app } from "electron"

export default class AutoLaunchManager {
  enable() {
    return new Promise((resolve, reject) => {
      const enabled = app.getLoginItemSettings().openAtLogin
      if (enabled) {
        resolve()
      }

      app.setLoginItemSettings({
        openAtLogin: true,
        args: [
          '--opened-at-login=1'
        ]
      })
      resolve()
    })
  }

  disable() {
    return new Promise((resolve, reject) => {
      app.setLoginItemSettings({ openAtLogin: false })
      resolve()
    })
  }

  isEnabled() {
    return new Promise((resolve, reject) => {
      const enabled = app.getLoginItemSettings().openAtLogin
      resolve(enabled)
    })
  }
}