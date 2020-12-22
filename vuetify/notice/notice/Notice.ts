import { VSnackbar, VIcon } from 'vuetify/lib';
import { Framework } from 'vuetify';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { VueConstructor } from 'vue/types/umd';

@Component({
  components: {
    VSnackbar,
    VIcon,
  },
})
export default class Confirm extends Vue {
  @Prop({
    default: 'info',
  })
  readonly color!: string;

  @Prop({
    default(this: VueConstructor & { $vuetify: Framework }) {
      return '';
    },
  })
  readonly icon!: string;

  @Prop({
    required: true,
  })
  readonly message!: string;

  @Prop({
    default: 3000,
  })
  readonly timeout!: number;
  @Prop({
    default: true,
  })
  readonly dismissible!: boolean;

  value = true;

  mounted(): void {
    document.addEventListener('keyup', this.onEnterPressed);
  }
  destroyed(): void {
    document.removeEventListener('keyup', this.onEnterPressed);
  }

  onEnterPressed(e: KeyboardEvent): void {
    if (e.keyCode === 13) {
      e.stopPropagation();
      this.dismiss();
    }
  }
  dismiss(): void {
    this.value = false;
    this.$destroy();
  }
  change(): void {
    this.$destroy();
  }
}
