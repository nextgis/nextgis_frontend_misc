import { Credentials } from '../interfaces/Credentials';
import { UserApi as UserApiInterface } from '../interfaces/UserApi';
import { template } from '../utils/template';
import { Http } from './Http';

export class UserApi<UserInfo = Record<string, any>>
  implements UserApiInterface {
  urls = {
    login: '/api/login',
    logout: '/api/logout',
    userInfo: '/api/current_user',
    list: '/api/user',
    user: '/api/user/{id}',
    create: '/api/user',
    delete: '/api/user/{id}',
    update: '/api/user/{id}',
    oAuth2: '/api/oauth2/user?code={code}',
    oAuth2Options: '/api/oauth2/options',
  };

  constructor(private http: Http) {}

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

  getUser(id: string | number): Promise<UserInfo> {
    return this.http.request(template(this.urls.user, { id }), {
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

  listUsers(params: Record<string, any>): Promise<UserInfo[]> {
    return this.http.request(this.urls.list, {
      method: 'GET',
      crossDomain: true,
      params,
    });
  }

  deleteUser(id: string | number): Promise<void> {
    return this.http.request(template(this.urls.delete, { id }), {
      method: 'DELETE',
      crossDomain: true,
    });
  }

  createUser(body: Partial<UserInfo>): Promise<void> {
    return this.http.request(this.urls.create, {
      method: 'POST',
      body,
      crossDomain: true,
    });
  }

  updateUser(id: string | number, body: Partial<UserInfo>): Promise<void> {
    return this.http.request(template(this.urls.update, { id }), {
      method: 'PUT',
      body,
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
