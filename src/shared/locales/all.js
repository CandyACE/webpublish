import eleLocaleAr from 'element-ui/lib/locale/lang/ar'
import eleLocaleBg from 'element-ui/lib/locale/lang/bg'
import eleLocaleCa from 'element-ui/lib/locale/lang/ca'
import eleLocaleDe from 'element-ui/lib/locale/lang/de'
import eleLocaleEl from 'element-ui/lib/locale/lang/el'
import eleLocaleEn from 'element-ui/lib/locale/lang/en'
import eleLocaleEs from 'element-ui/lib/locale/lang/es'
import eleLocaleFa from 'element-ui/lib/locale/lang/fa'
import eleLocaleFr from 'element-ui/lib/locale/lang/fr'
import eleLocaleHu from 'element-ui/lib/locale/lang/hu'
import eleLocaleId from 'element-ui/lib/locale/lang/id'
import elelocaleIt from 'element-ui/lib/locale/lang/it'
import eleLocaleJa from 'element-ui/lib/locale/lang/ja'
import eleLocaleKo from 'element-ui/lib/locale/lang/ko'
import eleLocaleNb from 'element-ui/lib/locale/lang/nb-NO'
import eleLocalePl from 'element-ui/lib/locale/lang/pl'
import eleLocalePtBR from 'element-ui/lib/locale/lang/pt-br'
import eleLocaleRo from 'element-ui/lib/locale/lang/ro'
import eleLocaleRu from 'element-ui/lib/locale/lang/ru-RU'
import eleLocaleTr from 'element-ui/lib/locale/lang/tr-TR'
import eleLocaleUk from 'element-ui/lib/locale/lang/ua'
import eleLocaleVi from 'element-ui/lib/locale/lang/vi'
import eleLocaleZhCN from 'element-ui/lib/locale/lang/zh-CN'
import eleLocaleZhTW from 'element-ui/lib/locale/lang/zh-TW'

import appLocaleZhCN from './zh-CN'
import appLocaleZhTW from './zh-TW'
import appLocaleenUS from './en-US'

const resources = {
  'ar': {
    translation: {
      ...eleLocaleAr,
    }
  },
  'bg': {
    translation: {
      ...eleLocaleBg,
    }
  },
  'ca': {
    translation: {
      ...eleLocaleCa,
    }
  },
  'de': {
    translation: {
      ...eleLocaleDe,
    }
  },
  'el': {
    translation: {
      ...eleLocaleEl,
    }
  },
  'en-US': {
    translation: {
      ...eleLocaleEn,
      ...appLocaleenUS
    }
  },
  'es': {
    translation: {
      ...eleLocaleEs,
    }
  },
  'fa': {
    translation: {
      ...eleLocaleFa,
    }
  },
  'fr': {
    translation: {
      ...eleLocaleFr,
    }
  },
  'hu': {
    translation: {
      ...eleLocaleHu,
    }
  },
  'id': {
    translation: {
      ...eleLocaleId,
    }
  },
  'it': {
    translation: {
      ...elelocaleIt,
    }
  },
  'ja': {
    translation: {
      ...eleLocaleJa,
    }
  },
  'ko': {
    translation: {
      ...eleLocaleKo,
    }
  },
  'nb': {
    translation: {
      ...eleLocaleNb,
    }
  },
  'pl': {
    translation: {
      ...eleLocalePl,
    }
  },
  'pt-BR': {
    translation: {
      ...eleLocalePtBR,
    }
  },
  'ro': {
    translation: {
      ...eleLocaleRo,
    }
  },
  'ru': {
    translation: {
      ...eleLocaleRu,
    }
  },
  'tr': {
    translation: {
      ...eleLocaleTr,
    }
  },
  'uk': {
    translation: {
      ...eleLocaleUk,
    }
  },
  'vi': {
    translation: {
      ...eleLocaleVi,
    }
  },
  'zh-CN': {
    translation: {
      ...eleLocaleZhCN,
      ...appLocaleZhCN
    }
  },
  'zh-TW': {
    translation: {
      ...eleLocaleZhTW,
      ...appLocaleZhTW
    }
  }
}

export default resources