import { EventEmitter } from 'events'
import { join } from 'path'
import { Tray, Menu } from "electron";

let tray = null

export default class TrayManager extends EventEmitter {
    constructor(options = {}) {
        super()

        this.load()
        this.init()
        this.build()
    }

    load() {
        this.template = require('../config/tray')

        this.setIcons()
    }

    setIcons() {
        this.normalIcon = path.join(__static, 'image/icon.ico')
    }

    init() {
        tray = new Tray(this.normalIcon)
        tray.setToolTip('快速发布工具')
    }

    build() {
        const contextMenu = Menu.buildFromTemplate(this.template)
        tray.setContextMenu(contextMenu)
        tray.on('click', function () {
            global.application.show()
        })
    }

    destory() {
        tray.distory()
    }
}