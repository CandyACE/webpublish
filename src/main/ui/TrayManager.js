import { EventEmitter } from 'events'
import { join } from 'path'
import { Tray, Menu, nativeImage } from "electron";
import path from 'path'
import logger from '../core/Logger';
import { flattenMenuItems, translateTemplate } from '../utils/menu'
import { getI18n } from "./Locale";
import cloneDeep from 'lodash.clonedeep';

let tray = null

export default class TrayManager extends EventEmitter {
  constructor(options = {}) {
    super()

    this.i18n = getI18n()
    this.menu = null;
    this.items = null;

    this.loadTemplate()
    this.setIcons()
    this.init()
    this.build()
    this.handleEvents()
  }

  loadTemplate() {
    this.template = require('../config/tray').default
  }

  setIcons() {
    this.normalIcon = nativeImage.createFromPath(path.join(__static, 'image/icon.png'))
  }

  init() {
    tray = new Tray(this.normalIcon)
    tray.setToolTip('快速发布工具')
  }

  build() {
    this.buildMenu()

    this.updateContextMenu()
  }

  buildMenu() {
    const keystrokesByCommand = {}
    for (const item in this.keymap) {
      keystrokesByCommand[this.keymap[item]] = item
    }
    const template = cloneDeep(this.template)
    const tpl = translateTemplate(template, keystrokesByCommand, this.i18n)
    this.menu = Menu.buildFromTemplate(tpl)
    this.items = flattenMenuItems(this.menu)
  }

  updateContextMenu() {
    tray.setContextMenu(this.menu)
  }

  handleEvents() {
    tray.on('click', function () {
      global.application.show()
    })
  }

  handleLocaleChange() {
    this.build()
  }

  destory() {
    tray.distory()
  }
}