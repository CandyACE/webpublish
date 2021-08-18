import { ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { EventEmitter } from 'events'
import updateType from "../helper/updateType";
import { Notification } from 'electron'
import { getI18n } from '../ui/Locale'

class UpdateManager extends EventEmitter {

    constructor() {
        super()

        this.i18n = getI18n()

        this._init()
        this.showMessage = false;
    }

    update() {
        autoUpdater.autoDownload = true;
        autoUpdater.autoInstallOnAppQuit = true;
        autoUpdater.checkForUpdates()
    }

    checkForUpdates(showMessage) {
        this.showMessage = showMessage
        autoUpdater.autoDownload = false;
        autoUpdater.autoInstallOnAppQuit = false;
        autoUpdater.checkForUpdates().then(it => {
            const downloadPromise = it.downloadPromise;
            if (downloadPromise == undefined) {
                return;
            }
            console.log(downloadPromise)
        })
    }

    Message(type, data) {
        console.log(type, data)
        // this.mainWindow.webContents.send('update-message', type, data);
        this.emit('update-message', { type, data })
    }

    _init() {
        var _this = this;
        autoUpdater.setFeedURL(__UPDATEURL__);
        console.log(autoUpdater.currentVersion)
        // 当更新发生错误的时候触发。
        autoUpdater.on(updateType.Error, (err) => {
            this.Message(updateType.Error, err);
            console.log(err);
        })
        // 当开始检查更新的时候触发
        autoUpdater.on(updateType.Checking, (event, arg) => {
            this.Message(updateType.Checking)
        })
        // 发现可更新数据时
        autoUpdater.on(updateType.Available, (event, arg) => {
            this.Message(updateType.Available)
            new Notification({ title: this.i18n.t('app.updae-available-message') }).show()
        })
        // 没有可更新数据时
        autoUpdater.on(updateType.NotAvailable, (event, arg) => {
            this.Message(updateType.NotAvailable)
            if (this.showMessage) {
                new Notification({ title: this.i18n.t('app.update-not-available-message') }).show()
                this.showMessage = false;
            }
        })
        // 下载监听
        autoUpdater.on(updateType.Progress, (progressObj) => {
            this.Message(updateType.Progress, progressObj)
        })
        // 下载完成
        autoUpdater.on(updateType.downloaded, () => {
            this.Message(updateType.downloaded)
            setTimeout(m => {
                autoUpdater.quitAndInstall()
            }, 1000)
        })

        // ipcMain.on(updateType.checkNow, function () {
        //     _this.checkForUpdates();
        // })

        // ipcMain.on(updateType.update, function () {
        //     _this.update()
        // })
    }
}
export default UpdateManager