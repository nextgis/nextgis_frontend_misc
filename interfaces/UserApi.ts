import { Credentials } from './Credentials';

export interface UserApi<UserInfo = Record<string, any>> {
  login(credentials: Credentials): Promise<void>;
  loginOAuth2(code: string | number): Promise<void>;
  getInfo(): Promise<UserInfo>;
  logout(): Promise<void>;
}
