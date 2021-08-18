import i18next from "i18next";
import { getLanguage } from ".";

export default class LocaleManager {
  constructor(options = {}) {
    this.options = options;

    i18next.init({
      fallbackLng: 'zh-CN',
      resources: options.resources
    })
  }

  changeLanguage(lng) {
    return i18next.changeLanguage(lng)
  }

  changeLanguageByLocale(locale) {
    const lng = getLanguage(locale)
    return this.changeLanguage(lng)
  }

  getI18n() {
    return i18next
  }
}