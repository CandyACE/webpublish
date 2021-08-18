import { app, ipcMain } from 'electron';
import { EventEmitter } from 'events'
import AutoLaunchManager from './core/AutoLaunchManager';
import ConfigManager from './core/ConfigManager';
import logger from './core/Logger';
import TrayManager from './ui/TrayManager';
import UpdateManager from './core/updateManager';
import WindowManager from './ui/WindowManager';
import updateType from './helper/updateType';
import { setupLocaleManager } from './ui/Locale';

export default class Application extends EventEmitter {
    constructor() {
        super();
        this.isReady = false;
        this.init();
    }

    init() {
        this.configManager = new ConfigManager();

        this.locale = this.configManager.getLocale();
        this.localeManager = setupLocaleManager(this.locale)
        this.i18n = this.localeManager.getI18n()

        this.trayManager = new TrayManager();
        this.autoLaunchManager = new AutoLaunchManager();
        this.updateManager = new UpdateManager();
        this.initWindowManager();
        this.initUpdateManager();
        this.handleCommands();
        this.handleIpcMessages();
        this.isReady = true;
    }

    initWindowManager() {
        this.windowManager = new WindowManager({
            userConfig: this.configManager.getSystemConfig()
        })

        this.windowManager.on('window-resized', (data) => {
            this.storeWindowState(data)
        })
        this.windowManager.on('window-moved', (data) => {
            this.storeWindowState(data)
        })
        this.windowManager.on('window-closed', (data) => {
            this.storeWindowState(data)
        })
    }

    initUpdateManager() {
        this.updateManager.on('update-message', ({ type, data }) => {
            if (type === updateType.Checking) {
                this.configManager.setSystemConfig('last-check-update-time', Date.now())
            }
        })
    }

    storeWindowState(data = {}) {
        const enabled = this.configManager.getSystemConfig('keep-window-state')
        if (!enabled) {
            return
        }

        const state = this.configManager.getSystemConfig('window-state', {})
        const { page, bounds } = data
        const newState = {
            ...state,
            [page]: bounds
        }
        this.configManager.setSystemConfig('window-state', newState)
    }


    start(page, options = {}) {
        const win = this.showPage(page, options)

        win.once('ready-to-show', () => {
            this.isReady = true
            this.emit('ready')
        })
    }

    showPage(page, options = {}) {
        const { openedAtLogin } = options
        const autoHideWindow = this.configManager.getSystemConfig('auto-hide-window')
        return this.windowManager.openWindow(page, {
            hidden: openedAtLogin || autoHideWindow
        })
    }

    show(page = 'index') {
        this.windowManager.showWindow(page)
    }

    hide(page) {
        if (page) {
            this.windowManager.autoHideWindow(page)
        } else {
            this.windowManager.hideAllWindow()
        }
    }

    toggle(page = 'index') {
        this.windowManager.toggleWindow(page)
    }

    closePage(page) {
        this.windowManager.destroyWindow(page)
    }

    quit() {
        this.emit("exit")
        app.exit()
    }

    handleCommands() {
        this.on('application:check-for-updates', () => {
            this.updateManager.checkForUpdates(true);
        })

        this.on('application:change-locale', (locale) => {
            this.localeManager.changeLanguageByLocale(locale)
                .then(() => {
                    // this.trayManager
                })
        })
    }

    handleIpcMessages() {
        ipcMain.on('command', (event, command, ...args) => {
            logger.log('[WebPublish] ipc receive command', command, ...args)
            this.emit(command, ...args)
        })
    }
}