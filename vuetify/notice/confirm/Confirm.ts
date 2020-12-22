import {
  VCard,
  VCardActions,
  VCardText,
  VDialog,
  VIcon,
  VToolbar,
  VToolbarTitle,
  VSpacer,
  VBtn,
} from 'vuetify/lib';
import { Framework } from 'vuetify';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { VueConstructor } from 'vue/types/umd';

@Component({
  components: {
    VCard,
    VCardActions,
    VCardText,
    VDialog,
    VIcon,
    VToolbar,
    VToolbarTitle,
    VSpacer,
    VBtn,
  },
})
export default class Confirm extends Vue {
  @Prop({
    default: 'Yes',
  })
  readonly buttonTrueText!: string;

  @Prop({
    default: 'No',
  })
  readonly buttonFalseText!: string;

  @Prop({
    default: 'primary',
  })
  readonly buttonTrueColor!: string;
  @Prop({
    default: 'grey',
  })
  readonly buttonFalseColor!: string;
  @Prop({
    default: true,
  })
  readonly buttonFalseFlat!: boolean;
  @Prop({
    default: true,
  })
  readonly buttonTrueFlat!: boolean;
  @Prop({
    default: 'warning',
  })
  readonly color!: string;

  @Prop({
    default(this: VueConstructor & { $vuetify: Framework }) {
      return ''; //this.$vuetify.icons.values.warning;
    },
  })
  readonly icon!: string;

  @Prop({
    required: true,
  })
  readonly message!: string;

  @Prop() readonly persistent!: boolean;

  @Prop({})
  readonly title!: string;

  @Prop({
    default: 450,
  })
  readonly width!: number;

  value = false;

  mounted(): void {
    document.addEventListener('keyup', this.onEnterPressed);
  }
  destroyed(): void {
    document.removeEventListener('keyup', this.onEnterPressed);
  }

  onEnterPressed(e: KeyboardEvent): void {
    if (e.keyCode === 13) {
      e.stopPropagation();
      this.choose(true);
    }
  }

  choose(value: boolean): void {
    this.$emit('result', value);
    this.value = value;
    this.$destroy();
  }

  change(): void {
    this.$destroy();
  }
}
