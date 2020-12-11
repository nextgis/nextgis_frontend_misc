// based on https://github.com/dobromir-hristov/vue-i18n-starter
import VueI18n from 'vue-i18n';
import { NavigationGuardNext, Route } from 'vue-router';

export interface UserLang {
  lang: string;
  langNoISO: string;
}

export interface TransOptions {
  defaultLanguage: string;
  supportedLanguages: string[];
  i18n: VueI18n;
}

export class Trans {
  private readonly _defaultLanguage: string;
  private readonly _supportedLanguages: string[];
  private readonly _i18n: VueI18n;

  constructor(options: TransOptions) {
    if (!options.i18n) {
      throw new Error('not set `i18n` option for Trans constructor');
    }
    this._defaultLanguage = options.defaultLanguage || 'en';
    this._supportedLanguages = options.supportedLanguages || [
      this._defaultLanguage,
    ];
    this._i18n = options.i18n;
  }

  get defaultLanguage(): string {
    return this._defaultLanguage;
  }
  get supportedLanguages(): string[] {
    return this._supportedLanguages;
  }
  get currentLanguage(): string {
    return this._i18n.locale;
  }
  set currentLanguage(lang) {
    this._i18n.locale = lang;
  }
  /**
   * Gets the first supported language that matches the user's
   */
  getUserSupportedLang(): string {
    const userPreferredLang = this.getUserLang();

    // Check if user preferred browser lang is supported
    if (this.isLangSupported(userPreferredLang.lang)) {
      return userPreferredLang.lang;
    }
    // Check if user preferred lang without the ISO is supported
    if (this.isLangSupported(userPreferredLang.langNoISO)) {
      return userPreferredLang.langNoISO;
    }
    return this.defaultLanguage;
  }
  /**
   * Returns the users preferred language
   */
  getUserLang(): UserLang {
    const lang =
      window.navigator.language ||
      (window as any).navigator.userLanguage ||
      this.defaultLanguage;
    return {
      lang: lang,
      langNoISO: lang.split('-')[0],
    };
  }
  /**
   * Sets the language to various services (axios, the html tag etc)
   */
  setI18nLanguageInServices(lang: string): string {
    this.currentLanguage = lang;
    // axios.defaults.headers.common['Accept-Language'] = lang;
    const html = document.querySelector('html');
    if (html) {
      html.setAttribute('lang', lang);
    }
    return lang;
  }
  /**
   * Loads new translation messages and changes the language when finished
   */
  changeLanguage(lang: string): Promise<any> {
    if (!this.isLangSupported(lang))
      return Promise.reject(new Error('Language not supported'));
    if (this._i18n.locale === lang) return Promise.resolve(lang); // has been loaded prior
    return this.loadLanguageFile(lang).then((msgs) => {
      this._i18n.setLocaleMessage(lang, msgs.default || msgs);
      return this.setI18nLanguageInServices(lang);
    });
  }
  /**
   * Async loads a translation file
   */
  loadLanguageFile(lang: string): Promise<any> {
    return import(
      /* webpackChunkName: "lang-[request]" */ `@/lang/${lang}.json`
    );
  }
  /**
   * Checks if a lang is supported
   */
  isLangSupported(lang: string): boolean {
    return this.supportedLanguages.includes(lang);
  }
  /**
   * Checks if the route's param is supported, if not, redirects to the first supported one.
   * @return {*}
   */
  routeMiddleware(to: Route, from: Route, next: NavigationGuardNext): any {
    // Load async message files here
    const lang = to.params.lang;
    if (!this.isLangSupported(lang)) {
      return next(this.getUserSupportedLang());
    }
    return this.changeLanguage(lang).then(() => next());
  }
  /**
   * Returns a new route object that has the current language already defined
   * To be used on pages and components, outside of the main \ route, like on Headers and Footers.
   */
  i18nRoute(to: Route): Route {
    return {
      ...to,
      params: { lang: this.currentLanguage, ...to.params },
    };
  }
}
