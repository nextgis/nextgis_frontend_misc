import { VueConstructor as Vue } from 'vue';
import CancelablePromise from '@nextgis/cancelable-promise';
// @ts-ignore
import ConfirmComponent from './confirm/Confirm.vue';
// @ts-ignore
import NoticeComponent from './notice/Notice.vue';
import Confirm from './confirm/Confirm';
import { NoticeSetupOptions } from './NoticeSetupOptions';
import { ConfirmOptions } from './confirm/ConfirmOptions';
import { VueConstructor } from 'vue/types/umd';
import { NoticeOptions } from './notice/NoticeOptions';

let createNoticeCmp: (
  Cmp: VueConstructor,
  options: Record<string, any>
) => CancelablePromise<boolean>;

export function NoticeSetup(
  Vue: Vue,
  installOptions: NoticeSetupOptions
): void {
  const options: Partial<NoticeSetupOptions> = { ...installOptions };
  const confirmProperty = '$confirmDialog';
  const noticeProperty = '$notice';
  const vuetify = options.vuetify;
  delete options.vuetify;
  if (!vuetify) {
    console.warn(
      'Module vuetify-notice needs vuetify instance. Use Vue.use(NoticeSetup, { vuetify })'
    );
  }
  // const Ctor = Vue.extend(Object.assign({ vuetify }, ConfirmComponent));
  createNoticeCmp = (
    Cmp: VueConstructor,
    opt: Record<string, any>
  ): CancelablePromise<boolean> => {
    const container =
      document.querySelector('[data-app=true]') || document.body;
    return new CancelablePromise<boolean>((resolve, reject, onCancel) => {
      const cmp = new Cmp({
        propsData: Object.assign(
          {},
          // Vue.prototype[confirmProperty].options,
          opt
        ),
        destroyed: (): void => {
          container.removeChild(cmp.$el);
          resolve((cmp as Confirm).value);
        },
      });
      onCancel(() => {
        cmp.$destroy();
      });
      container.appendChild(cmp.$mount().$el);
    });
  };
  Vue.prototype[confirmProperty] = confirmDialog;
  Vue.prototype[noticeProperty] = notice;
  // Vue.prototype[confirmProperty].options = options || {};
}

export function confirmDialog(
  message: string,
  options: ConfirmOptions = {}
): CancelablePromise<boolean> {
  options.message = message;
  if (createNoticeCmp) {
    return createNoticeCmp(ConfirmComponent, options);
  } else {
    throw Error('CreateNotice is not installed yet');
  }
}

export function notice(
  message: string,
  options: NoticeOptions = {}
): CancelablePromise<boolean> {
  options.message = message;
  if (createNoticeCmp) {
    return createNoticeCmp(NoticeComponent, options);
  } else {
    throw Error('CreateNotice is not installed yet');
  }
}

declare module 'vue/types/vue' {
  export interface Vue {
    $notice: (
      message: string,
      options: ConfirmOptions
    ) => CancelablePromise<boolean>;
    $confirmDialog: (
      message: string,
      options: ConfirmOptions
    ) => CancelablePromise<boolean>;
  }
}

// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(Install);
// }
