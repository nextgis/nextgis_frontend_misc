import type { VueConstructor } from 'vue/types/umd';
import { VueConstructor as Vue } from 'vue';
import CancelablePromise from '@nextgis/cancelable-promise';
import ConfirmComponent from './confirm/Confirm.vue';
import NoticeComponent from './notice/Notice.vue';
import type { ConfirmOptions } from './confirm/ConfirmOptions';
import type { NoticeSetupOptions } from './NoticeSetupOptions';
import type { NoticeOptions } from './notice/NoticeOptions';

export type { NoticeOptions, ConfirmOptions, NoticeSetupOptions };

let createNoticeCmp: (
  Cmp: VueConstructor,
  options: Record<string, any>
) => CancelablePromise<boolean>;

let Confirm: VueConstructor;
let Notice: VueConstructor;

const confirmProperty = '$confirmDialog';
const noticeProperty = '$notice';
let noticeOptions: Partial<NoticeSetupOptions>;

export function NoticeSetup(
  Vue: Vue,
  installOptions: NoticeSetupOptions
): void {
  noticeOptions = { ...installOptions };
  const vuetify = noticeOptions.vuetify;
  delete noticeOptions.vuetify;
  if (!vuetify) {
    console.warn(
      'Module vuetify-notice needs vuetify instance. Use Vue.use(NoticeSetup, { vuetify })'
    );
  }
  Confirm = Vue.extend(Object.assign({ vuetify }, ConfirmComponent));
  Notice = Vue.extend(Object.assign({ vuetify }, NoticeComponent));

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
          resolve((cmp as any).value);
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

function getOptions<T>(name: keyof NoticeSetupOptions): T {
  if (noticeOptions) {
    const opt = noticeOptions[name];
    if (typeof opt === 'function') {
      return opt() as T;
    } else if (typeof opt === 'object') {
      return opt as T;
    }
  }
  return {} as T;
}

export function confirmDialog(
  msgOrOpt: string | ConfirmOptions,
  options: ConfirmOptions = {}
): CancelablePromise<boolean> {
  if (typeof msgOrOpt === 'string') {
    options.message = msgOrOpt;
  } else if (typeof msgOrOpt === 'object') {
    options = { ...msgOrOpt, ...options };
  }
  if (createNoticeCmp) {
    return createNoticeCmp(Confirm, {
      ...getOptions<ConfirmOptions>('confirmDialog'),
      ...options,
    });
  } else {
    throw Error('CreateNotice is not installed yet');
  }
}

let noticePromise: CancelablePromise<boolean>;
export function notice(
  msgOrOpt: string | NoticeOptions,
  options: NoticeOptions = {}
): CancelablePromise<boolean> {
  if (typeof msgOrOpt === 'string') {
    options.message = msgOrOpt;
  } else if (typeof msgOrOpt === 'object') {
    options = { ...msgOrOpt, ...options };
  }
  if (createNoticeCmp) {
    if (noticePromise) {
      noticePromise.cancel();
    }
    noticePromise = createNoticeCmp(Notice, {
      ...getOptions<NoticeOptions>('notice'),
      ...options,
    });
    return noticePromise;
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
