import { getI18n } from '../ui/Locale'

const i18n = getI18n();

export default [
    {
        label: i18n.t('app.show'),
        click: function () {
            application.show()
        }
    },
    {
        label: i18n.t('app.check-for-updates'),
        click: function () {
            application.updateManager.checkForUpdates(true)
        }
    },
    { type: "separator" },
    {
        label: i18n.t('app.quit'),
        click: function () {
            application.quit()
        }
    }
]