import is from 'electron-is'
import { getI18n } from '../ui/Locale'

let title = getI18n().t('app.title')

export default {
    index: {
        attrs: {
            title: title,
            width: 1024,
            height: 768,
            minWidth: 400,
            minHeight: 420,
            transparent: !is.windows()
        },
        bindCloseToHide: true,
        url: is.dev() ? 'http://localhost:9080' : `file://${__dirname}/index.html`
    }
}