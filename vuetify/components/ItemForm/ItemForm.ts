import { mdiCalendar } from '@mdi/js';
import { VForm, VTextField } from 'vuetify/lib';
import { full } from '@nextgis/utils';
import DatetimePicker from '../DatetimePicker/DatetimePicker.vue';
import PasswordField from '../PasswordField/PasswordField.vue';
import {
  Vue,
  Component,
  Model,
  Prop,
  Watch,
  Emit,
  Ref,
} from 'vue-property-decorator';

import { ItemFormMeta } from './interfaces/ItemFormMeta';
import { ItemFormField, ItemFormSingleField } from './interfaces/ItemFormField';
import { settings } from './settings';
import { Messages } from './interfaces/Messages';
import { updateItemFormField } from './utils';

// @ts-ignore
// import DatetimePicker from 'vuetify-datetime-picker';
// Vue.use(DatetimePicker);

@Component({
  components: {
    DatetimePicker,
    VForm,
    VTextField,
    PasswordField,
  },
})
export default class ItemFormMixin<I = Record<string, any>> extends Vue {
  @Ref('ItemForm') readonly itemForm!: HTMLFormElement;
  @Model('change') readonly item!: I;
  @Prop() readonly meta!: ItemFormMeta;
  @Prop({ type: Object, default: () => ({}) }) readonly messages!: Messages;
  @Prop({ type: Array, default: () => [] })
  readonly fields!: ItemFormField[];
  @Prop({ default: false }) readonly readonly!: boolean;
  @Prop({ default: settings.dense }) readonly dense!: boolean;
  @Prop({ default: settings.outlined }) readonly outlined!: boolean;

  icons = {
    calendar: mdiCalendar,
  };

  localItem: Record<string, any> | null = null;
  valid = true;

  get fields_(): ItemFormSingleField[] {
    const fields = this.fields.length ? this.fields : this.meta.fields || [];
    const fields_: ItemFormSingleField[] = [];
    updateItemFormField(fields, (x) => {
      fields_.push(x);
    });
    return fields_;
  }

  get rows(): ItemFormField[][] {
    const fields = this.fields.length ? this.fields : this.meta.fields || [];
    const rows: ItemFormField[][] = [];
    fields.forEach((x) => {
      if (Array.isArray(x)) {
        rows.push(x);
      } else {
        rows.push([x]);
      }
    });
    return rows;
  }

  get messages_(): Messages {
    return this.messages || this.meta.messages || settings.messages;
  }

  @Watch('item')
  onGeomChange(item: I): I {
    this.localItem = item;
    return item;
  }

  @Watch('valid')
  @Emit('valid')
  onValid(valid: boolean): boolean {
    return valid;
  }

  @Watch('localItem', { deep: true })
  @Emit('change')
  onChange(localItem: Record<string, any>): Record<string, any> {
    for (const field of this.fields_) {
      const name = String(field.name);
      if (field.type === 'number' && full(localItem[name])) {
        localItem[name] = Number(localItem[name]);
      }
    }
    return localItem;
  }

  mounted(): void {
    const item: Record<string, any> = { ...this.item };
    this.localItem = item;
  }

  hasSlot(field: ItemFormSingleField): boolean {
    const name = 'field.' + String(field.name);
    return !!this.$slots[name] || !!this.$scopedSlots[name];
  }

  getFieldProps(field: ItemFormSingleField): ItemFormField {
    const props = {
      dense: this.dense,
      outlined: this.outlined,
      ...field,
    };
    if (this.readonly) {
      props.readonly = this.readonly;
    }
    // props.label =
    //   props.label !== undefined ? props.label : '' + String(props.name);
    if (props.required) {
      if (props.label) {
        props.label = props.label + '*';
      }
      props.rules = props.rules || [];
      props.rules.unshift((v: any) => this.requiredRule(v, field));
    }
    return props;
  }

  getFieldValue(field: ItemFormSingleField): any {
    if (this.localItem) {
      const name = String(field.name);
      const value = this.localItem[name];
      if (field.type === 'date') {
        // return this._getStrFromDateField(value);
      }
      return value;
    }
  }

  setFieldValue(f: ItemFormSingleField, val: any): void {
    let valid = true;
    if (f.type === 'date' && typeof val === 'string') {
      // const appDate = formatToAppDate(val);
      // valid = this.rules.date.every((r) => r(appDate));
      valid = true;
      // val = this._getDateFieldFromStr(formatToNgwDate(val));
    }
    if (valid && this.localItem) {
      Vue.set(this.localItem, String(f.name), val);
    }
  }

  parseDateFromFieldValue(date: string): string | undefined {
    return date;
  }

  validate(): void {
    this.itemForm.validate();
  }
  reset(): void {
    this.itemForm.reset();
  }
  resetValidation(): void {
    this.itemForm.resetValidation();
  }

  // showPwd() {
  //   if (this.passwordType === 'password') {
  //     this.passwordType = '';
  //   } else {
  //     this.passwordType = 'password';
  //   }
  //   this.$nextTick(() => {
  //     this.password.focus();
  //   });
  // }

  private requiredRule(
    value: any,
    field: ItemFormSingleField
  ): string | boolean {
    return full(value) || `${this.messages_.enterFiled} ${field.label}`;
  }
}
