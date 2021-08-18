import appLocaleZhCN from './zh-CN'
import appLocaleZhTW from './zh-TW'
import appLocaleEnUS from './en-US'

const resources = {
    'en-US': {
        translation: {
            ...appLocaleEnUS
        }
    },
    'zh-CN': {
        translation: {
            ...appLocaleZhCN
        }
    },
    'zh-TW': {
        translation: {
            ...appLocaleZhTW
        }
    }
}

export default resources