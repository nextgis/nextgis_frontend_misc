import { full } from '@nextgis/utils';
import Cookies from 'js-cookie';
import { UserCookie as UserCookieInterface } from '../interfaces/UserCookie';

export class UserCookie implements UserCookieInterface {
  constructor(
    public readonly storeKey = 'login_state_key',
    public readonly localeKey = 'locale_state_key'
  ) {}

  getLoginState(): boolean {
    return full(Cookies.get(this.storeKey));
  }

  setLoginState(state: boolean): string | undefined {
    return Cookies.set(this.storeKey, String(state));
  }

  removeLoginState(): void {
    return Cookies.remove(this.storeKey);
  }

  getLocale(): string {
    return Cookies.get(this.localeKey) || '';
  }

  setLocale(state: string): string | undefined {
    return Cookies.set(this.localeKey, String(state));
  }

  removeLocale(): void {
    return Cookies.remove(this.localeKey);
  }
}
