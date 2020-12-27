import { ItemFormMetaField } from './ItemFormMetaField';

export interface ItemFormMeta<
  F extends Record<string, any> = Record<string, any>
> {
  fields: ItemFormMetaField<keyof F>[];
  messages?: {
    enter_filed?: string;
  };
}
