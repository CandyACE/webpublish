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
                address: '127.0.0.1'
            }
        })
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