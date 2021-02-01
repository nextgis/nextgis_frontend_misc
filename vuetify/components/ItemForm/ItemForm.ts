import { mdiCalendar } from '@mdi/js';
import { VForm, VTextField } from 'vuetify/lib';
import { defined, full } from '@nextgis/utils';
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
import { eachItemFormField } from './utils';
import { MESSAGES } from './Messages';
import { FieldRule } from './interfaces/InputOptions';

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
  @Prop({ type: Object, default: () => MESSAGES }) readonly messages!: Messages;
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
    const fields = this.fields.length
      ? this.fields
      : (this.meta && this.meta.fields) || [] || [];
    const fields_: ItemFormSingleField[] = [];
    eachItemFormField(fields, (x) => {
      fields_.push(x);
    });
    return fields_;
  }

  get rows(): ItemFormField[][] {
    const fields = this.fields.length
      ? this.fields
      : (this.meta && this.meta.fields) || [] || [];
    const rows: ItemFormField[][] = [];
    const item = this.localItem || this.item;
    const filter = (f: ItemFormField): boolean => {
      if (!Array.isArray(f) && f.test) {
        return !!f.test(item);
      }
      return true;
    };
    fields.forEach((x) => {
      let cols: ItemFormField[] = [];
      if (Array.isArray(x)) {
        cols = x;
      } else {
        cols.push(x);
      }
      rows.push(cols.filter(filter));
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
    this.validate();
    this.resetValidation();
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
    const rules: FieldRule[] = [];
    if (props.required && !props.readonly && !props.enabled) {
      if (props.label) {
        props.label = props.label + '*';
      }
      rules.push((v: any) => this.requiredRule(v));
    }
    if (field.type === 'number') {
      const min = 'min' in field ? field.min : undefined;
      const max = 'max' in field ? field.max : undefined;
      if (defined(min)) {
        rules.push((v: number) => this.minRule(v, min));
      }
      if (defined(max)) {
        rules.push((v: number) => this.maxRule(v, max));
      }
    }
    props.rules = rules.concat(props.rules || []);
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
    this.valid = this.itemForm.validate();
  }
  reset(): void {
    this.itemForm.reset();
  }
  resetValidation(): void {
    this.itemForm.resetValidation();
  }

  private requiredRule(v: any): string | boolean {
    return full(v) || `${this.messages_.enterFiled}`;
  }

  private minRule(v: number, min: number): string | boolean {
    return (defined(v) && v >= min) || `${this.messages_.shouldBeAbove} ${min}`;
  }

  private maxRule(v: number, max: number): string | boolean {
    return (
      (defined(v) && v <= max) || `${this.messages_.shouldNotBeAbove} ${max}`
    );
  }
}
