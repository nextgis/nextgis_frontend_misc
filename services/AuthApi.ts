import { Credentials } from '../interfaces/Credentials';
import { UserApi as UserApiInterface } from '../interfaces/UserApi';
import { template } from '../utils/template';
import { Http } from './Http';
import { RestApi } from './RestApi';

export class AuthApi<UserInfo = Record<string, any>>
  extends RestApi<UserInfo>
  implements UserApiInterface {
  constructor(http: Http) {
    super({
      http,
      name: 'user',
      urls: {
        login: '/api/login',
        logout: '/api/logout',
        userInfo: '/api/current_user',
        oAuth2: '/api/oauth2/user?code={code}',
        oAuth2Options: '/api/oauth2/options',
      },
    });
  }

  login(body: Credentials): Promise<void> {
    return this.http.request(this.urls.login, {
      method: 'POST',
      body,
      crossDomain: true,
    });
  }

  getInfo(): Promise<UserInfo> {
    return this.http.request(this.urls.userInfo, {
      method: 'GET',
      crossDomain: true,
    });
  }

  logout(): Promise<void> {
    return this.http.request(this.urls.logout, {
      method: 'GET',
      crossDomain: true,
    });
  }

  deleteUser(id: string | number): Promise<void> {
    return this.http.request(template(this.urls.delete, { id }), {
      method: 'DELETE',
      crossDomain: true,
    });
  }

  loginOAuth2(code: string | number): Promise<void> {
    return this.http.request(template(this.urls.oAuth2, { code }), {
      method: 'GET',
      crossDomain: true,
    });
  }

  oAuth2Options(): Promise<unknown> {
    return this.http.request(this.urls.oAuth2Options, {
      method: 'GET',
      crossDomain: true,
    });
  }
}
