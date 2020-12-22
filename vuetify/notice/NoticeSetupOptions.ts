import Vuetify from 'vuetify';
import { ConfirmOptions } from './confirm/ConfirmOptions';
import { NoticeOptions } from './notice/NoticeOptions';

export interface NoticeSetupOptions {
  vuetify: Vuetify;
  notice: NoticeOptions | (() => NoticeOptions);
  confirmDialog: ConfirmOptions | (() => ConfirmOptions);
}
