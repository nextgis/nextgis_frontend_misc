import { full } from '@nextgis/utils';
import {
  Vue,
  Component,
  Model,
  Prop,
  Watch,
  Emit,
} from 'vue-property-decorator';

import { ItemFormMeta } from './interfaces/ItemFormMeta';
import { ItemFormMetaField } from './interfaces/ItemFormMetaField';

@Component({
  components: {},
})
export default class ItemForm<I = Record<string, any>> extends Vue {
  @Model('change') readonly item!: I;
  @Prop() readonly meta!: ItemFormMeta;
  @Prop({ default: false }) readonly readonly!: boolean;
  @Prop({ default: false }) readonly dense!: boolean;
  @Prop({ default: false }) readonly outlined!: boolean;

  localItem: Record<string, any> | null = null;
  valid = true;

  get fields(): ItemFormMetaField[] {
    return this.meta.fields;
  }

  @Watch('item')
  onGeomChange(item: I): I {
    this.localItem = item;
    return item;
  }

  @Watch('localItem')
  @Emit('change')
  onChange(): I {
    return this.localItem as I;
  }

  mounted(): void {
    const item: Record<string, any> = { ...this.item };
    this.meta.fields.forEach((x) => {
      const getter = x.getter;
      const setter = x.setter;
      if (typeof getter === 'function' && typeof setter === 'function') {
        const computedProp = {
          get() {
            return getter(item[x.name]);
          },
          set(val: any) {
            item[x.name] = setter(val);
          },
        };
        // item[x.name] = computedProp;
        item[x.name] = computedProp;
      }
    });

    this.localItem = item;
  }

  hasSlot(field: ItemFormMetaField): boolean {
    const name = 'field.' + String(field.name);
    return !!this.$slots[name] || !!this.$scopedSlots[name];
  }

  getFieldProps(field: ItemFormMetaField): ItemFormMetaField {
    const props = {
      dense: this.dense,
      outlined: this.outlined,
      ...field,
    };
    if (this.readonly) {
      props.readonly = this.readonly;
    }
    props.label =
      props.label !== undefined ? props.label : '' + String(props.name);
    if (props.required) {
      props.label = props.label + '*';
      props.rules = props.rules || [];
      props.rules.unshift((v: any) => this.requiredRule(v, field));
    }
    return props;
  }

  private requiredRule(value: any, field: ItemFormMetaField): string | boolean {
    return (
      full(value) ||
      `${
        (this.meta.messages && this.meta.messages.enter_filed) || 'Please enter'
      } ${field.label}`
    );
  }
}
