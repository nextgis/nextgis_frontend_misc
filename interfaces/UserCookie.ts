export interface UserCookie {
  storeKey: string;

  getLoginState: () => void;

  setLoginState: (state: boolean) => void;

  removeLoginState: () => void;
}
