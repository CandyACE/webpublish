import ElectronStore from "electron-store";
import is from 'electron-is'
import { app } from "electron";
import { MAP_TYPE } from "../../shared/constants";

export default class ConfigManager {
    constructor() {
        this.systemConfig = {};

        this.init();
    }

    init() {
        this.initSystemConfig();
    }

    initSystemConfig() {
        this.systemConfig = new ElectronStore({
            name: 'ts-webpublish',
            defaults: {
                'tasks': [],
                'port': 9090,
                'address': '127.0.0.1',
                'open-at-login': false,
                'auto-hide-window': false,
                'auto-check-update': true,
                'hide-app-menu': is.windows() || is.linux(),
                'keep-window-state': false,
                'window-state': {},
                'last-update-version': '',
                'last-check-update-time': 0,
                'user-experience': true,
                'locale': app.getLocale(),
                'api-enabled': false,
                'api-port': 10110,
                'view-type': false,
                'map-engine': 'mapbox'
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
            return this.systemConfig.store
        }

        return this.systemConfig.get(key, defaultValue)
    }

    setSystemConfig(...args) {
        this.systemConfig.set(...args)
    }

    getLocale() {
        return this.getSystemConfig('locale') || app.getLocale()
    }

    reset() {
        this.systemConfig.clear()
    }
}