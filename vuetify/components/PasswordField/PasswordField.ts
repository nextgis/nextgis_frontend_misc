import { mdiEye, mdiEyeOff } from '@mdi/js';
import { Component, Model, Vue, Watch, Emit } from 'vue-property-decorator';
import { VTextField } from 'vuetify/lib';

@Component({ components: { VTextField } })
export default class PasswordField extends Vue {
  @Model('input') password!: string;

  value = '';

  showPassword = false;

  get appendIcon(): string {
    return this.showPassword ? this.icons.show : this.icons.hide;
  }

  icons = {
    show: mdiEye,
    hide: mdiEyeOff,
  };

  @Watch('value')
  @Emit('input')
  onChange(): string {
    return this.value;
  }
}
