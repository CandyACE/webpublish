import ElectronStore from "electron-store";

export default class ConfigManager {
    constructor() {
        this._systemConfig = {};

        this.init();
    }

    init() {
        this.initSystemConfig();
    }

    initSystemConfig() {
        this._systemConfig = new ElectronStore({
            name: 'ts-webpublish',
            defaults: {
                listen: true,
                tasks: [],
                port: 9090,
                address: '127.0.0.1',
                autoStart: false,
                'auto-hide-window': false,
                'auto-check-update': true,
                'hide-app-menu': is.windows() || is.linux(),
                'keep-window-state': false,
                'window-state': {},
                api: {
                    enabled: false,
                    port: 9080
                }
            }
        })
    }

    fixSystemConfig() {
        // Fix the value of open-at-login when the user delete
        // the Motrix self-starting item through startup management.
        const openAtLogin = app.getLoginItemSettings().openAtLogin
        if (this.getSystemConfig('open-at-login') !== openAtLogin) {
            this.setSystemConfig('open-at-login', openAtLogin)
        }
    }

    getSystemConfig(key, defaultValue) {
        if (typeof key === 'undefined' &&
            typeof defaultValue === 'undefined') {
            return this._systemConfig.store
        }

        return this._systemConfig.get(key, defaultValue)
    }

    setSystemConfig(...args) {
        this._systemConfig.set(...args)
    }

    reset() {
        this._systemConfig.clear()
    }
}