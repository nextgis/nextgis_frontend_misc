import Cookies from 'js-cookie';
import { UserCookie as UserCookieInterface } from '../interfaces/UserCookie';

export class UserCookie implements UserCookieInterface {
  constructor(public readonly storeKey = 'login_state_key') {}

  getLoginState(): string | undefined {
    return Cookies.get(this.storeKey);
  }

  setLoginState(state: boolean): string | undefined {
    return Cookies.set(this.storeKey, String(state));
  }

  removeLoginState(): void {
    return Cookies.remove(this.storeKey);
  }
}
