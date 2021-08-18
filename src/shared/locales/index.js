export const availableLanguages = [
    { value: 'zh-CN', label: "简体中文" },
    { value: 'zh-TW', label: "繁體中文" },
    { value: 'en-US', label: "English" }
]

function checkLngIsAvailable(locale) {
    return availableLanguages.some(lng => lng.value === locale);
}

export function getLanguage(locale = 'zh-CN') {
    if (checkLngIsAvailable(locale)) {
        return locale
    }

    if (locale.startsWith('en')) {
        return 'en-US'
    }

    if (locale === 'zh-HK') {
        return 'zh-TW'
    }

    if (locale.startsWith('zh')) {
        return 'zh-CN'
    }
}