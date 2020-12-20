import { VueConstructor as Vue } from 'vue';
// @ts-ignore
import ConfirmComponent from './Confirm.vue';
import Confirm from './Confirm';
import { ConfirmInstallOptions } from './ConfirmInstallOptions';
import { ConfirmOptions } from './ConfirmOptions';

let createDialogCmp: (options: ConfirmOptions) => Promise<boolean>;

export function ConfirmSetup(
  Vue: Vue,
  installOptions: ConfirmInstallOptions
): void {
  const options: Partial<ConfirmInstallOptions> = { ...installOptions };
  const property = options.property || '$confirm';
  delete options.property;
  const vuetify = options.vuetify;
  delete options.vuetify;
  if (!vuetify) {
    console.warn(
      'Module vuetify-confirm needs vuetify instance. Use Vue.use(VuetifyConfirm, { vuetify })'
    );
  }
  // const Ctor = Vue.extend(Object.assign({ vuetify }, ConfirmComponent));
  createDialogCmp = (options: ConfirmOptions): Promise<boolean> => {
    const container =
      document.querySelector('[data-app=true]') || document.body;
    return new Promise<boolean>((resolve) => {
      const cmp = new ConfirmComponent({
        propsData: Object.assign({}, Vue.prototype[property].options, options),
        destroyed: (): void => {
          container.removeChild(cmp.$el);
          resolve((cmp as Confirm).value);
        },
      });
      container.appendChild(cmp.$mount().$el);
    });
  };

  Vue.prototype[property] = confirm;
  Vue.prototype[property].options = options || {};
}

export function confirm(
  message: string,
  options: ConfirmOptions = {}
): Promise<boolean> {
  options.message = message;
  if (createDialogCmp) {
    return createDialogCmp(options);
  } else {
    throw Error('CreateDialog is not installed yet');
  }
}

// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(Install);
// }
