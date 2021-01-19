import { app, ipcMain } from "electron";

export default class EventListener {
    constructor() {
        ipcMain.on('Config:SetAutoStart', function (ower, data) {
            app.setLoginItemSettings({
                openAtLogin: data
            })
        })
    }
}