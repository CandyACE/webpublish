import { ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import updateType from "../helper/updateType";
import https from "../helper/https";

var updateKindType = {
    none: "none",
    all: "all",
    host: "host"
}

var updateKind = updateKindType.none;

class Update {
    /**
     * 
     * @param {Electron.BrowserWindow} mainWindow 
     */
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
        this._hostUrl = __HOSTURL__;
        this._version = __VERSION__;
        this._init()
    }

    update() {
        console.log(updateKind)
        if (updateKind === updateKindType.none) {
            this.checkForUpdates()
        } else if (updateKind === updateKindType.all) {
            autoUpdater.autoDownload = true;
            autoUpdater.autoInstallOnAppQuit = true;
            autoUpdater.checkForUpdates()
        } else if (updateKind === updateKindType.host) {
            console.log('download')
            this.hostUpdate()
        }
    }

    checkForUpdates() {
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
        this.mainWindow.webContents.send('update-message', type, data);
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
            updateKind == updateKindType.all
            this.Message(updateType.Available)
        })
        // 没有可更新数据时
        autoUpdater.on(updateType.NotAvailable, (event, arg) => {
            this.checkHostUpdate().then(data => {
                if (data) {
                    updateKind = updateKindType.host
                    this.Message(updateType.Available)
                } else {
                    this.Message(updateType.NotAvailable)
                }
            })
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

        ipcMain.on(updateType.checkNow, function () {
            _this.checkForUpdates();
        })

        ipcMain.on(updateType.update, function () {
            _this.update()
        })
    }

    checkHostUpdate() {
        return new Promise((resove) => {
            console.log(this._hostUrl + "package.json")
            https.get(this._hostUrl + "package.json").then(data => {
                console.log("get update: " + data.version)
                resove(this.checkVersion(this._version, data.version))
            }).catch(err => { console.log(err) })
        })
    }

    checkVersion(oldValue, newValue) {
        try {
            console.log(oldValue, newValue)
            var _old = oldValue.toString().split('.');
            var _new = newValue.toString().split('.');
            for (let i = 0; i < _old.length; i++) {
                const oldItem = _old[i];
                const newItem = _new[i];
                if (!newItem) { return true }
                if (Number(newItem) > Number(oldItem)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    hostUpdate() {
        https.get(this._hostUrl + "dist.zip").then(data => {
            console.log('download:Data ',data)
        })
    }
}
export default Update