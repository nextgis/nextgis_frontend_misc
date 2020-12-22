import { ConfirmOptions } from './confirm/ConfirmOptions';
import { NoticeOptions } from './notice/NoticeOptions';

export interface NoticeSetupOptions {
  vuetify: any;
  notice?: NoticeOptions | (() => NoticeOptions);
  confirmDialog?: ConfirmOptions | (() => ConfirmOptions);
}
