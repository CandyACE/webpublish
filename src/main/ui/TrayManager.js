import { EventEmitter } from 'events'
import { join } from 'path'
import { Tray, Menu } from "electron";
import path from 'path'
import logger from '../core/Logger';
import { getI18n } from './Locale'

let tray = null

export default class TrayManager extends EventEmitter {
    constructor(options = {}) {
        super()

        this.i18n = getI18n()

        this.initTemplate()
        this.setIcons()

        this.init()
        this.build()
        this.handleEvents()
    }

    initTemplate() {
        this.template = require('../config/tray').default
    }

    setIcons() {
        this.normalIcon = path.join(__static, 'image/icon.ico')
    }

    init() {
        tray = new Tray(this.normalIcon)
        tray.setToolTip(this.i18n.t('app.title'))
    }

    build() {

        // const template = JSON.parse(JSON.stringify(this.template))
        // const tpl = translateTemp
        const contextMenu = Menu.buildFromTemplate(this.template)
        tray.setContextMenu(contextMenu)
    }

    handleEvents() {
        tray.on('click', function () {
            global.application.show()
        })
    }

    destory() {
        tray.distory()
    }
}