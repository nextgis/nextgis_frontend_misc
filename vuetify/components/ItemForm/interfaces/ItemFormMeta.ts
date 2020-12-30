import { ItemFormField } from './ItemFormField';
import { Messages } from './Messages';

export interface ItemFormMeta<
  F extends Record<string, any> = Record<string, any>
> {
  fields: ItemFormField<keyof F>[];
  messages?: Messages;
}
