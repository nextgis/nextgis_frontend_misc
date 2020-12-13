import {
  VuexModule,
  MutationAction,
} from 'vuex-module-decorators';
// import { isValueInArray } from '@/utils/validate';
import { UserApi } from '../../interfaces/UserApi';
import { UserCookie } from '../../interfaces/UserCookie';
import { Credentials } from '../../interfaces/Credentials';

export type UserRole = 'admin' | 'user';

const defaultAvatar = '';

// @Module({ dynamic: true, store, name: 'user' })
export class UserModule extends VuexModule {
  name = '';
  avatar = defaultAvatar;
  role: UserRole | '' = '';
  locale = 'en';
  defaultLocale = 'en';
  // logged = cookie.getLoginState() !== '';
  logged = '';

  cookie!: UserCookie;
  api!: UserApi;

  @MutationAction({ mutate: ['logged'] })
  login({ username, password }: Credentials): Promise<{ logged: boolean }> {
    return this.api
      .login({ username: username.trim(), password: password })
      .then((response) => {
        this.cookie.setLoginState(true);
        return { logged: true };
      });
  }

  @MutationAction({ mutate: ['logged'] })
  loginOAuth2(code: string): Promise<{ logged: boolean }> {
    return this.api.loginOAuth2(code).then((response) => {
      this.cookie.setLoginState(true);
      return { logged: true };
    });
  }

  @MutationAction({ mutate: ['logged', 'name', 'avatar', 'role', 'locale'] })
  getInfo(): Promise<{
    logged: boolean;
    name: string;
    avatar: string;
    role: UserRole;
    locale: string;
  }> {
    return this.api.getInfo().then((response) => {
      const { name, avatar, groups, locale } = response;
      this.cookie.setLoginState(true);

      const isAdmin = groups.find(
        (x: { name: string }) => x.name === 'Administrators'
      );

      let newLoc = locale;
      if (newLoc.length === 0) {
        const userLang = navigator.language || (navigator as any).userLanguage;
        newLoc = userLang;
      }

      return {
        logged: true,
        name,
        avatar,
        role: isAdmin ? 'admin' : 'user',
        locale: newLoc,
      };
    });
  }

  @MutationAction({ mutate: ['logged', 'name', 'avatar', 'role', 'locale'] })
  logout(): Promise<{
    logged: boolean;
    name: string;
    avatar: string;
    role: '';
    locale: string;
  }> {
    return this.api.logout().then(() => {
      this.cookie.removeLoginState();
      // resetRouter();
      return {
        logged: false,
        name: '',
        avatar: defaultAvatar,
        role: '',
        locale: this.defaultLocale,
      };
    });
  }
}
