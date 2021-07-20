import { ConfirmOptions } from './confirm/ConfirmOptions';
import { FormDialogOptions } from './formDialog/FormDialogOptions';
import { NoticeOptions } from './notice/NoticeOptions';

export interface NoticeSetupOptions {
  vuetify: any;
  notice?: NoticeOptions | (() => NoticeOptions);
  confirmDialog?: ConfirmOptions | (() => ConfirmOptions);
  formDialog?: FormDialogOptions | (() => FormDialogOptions);
}
