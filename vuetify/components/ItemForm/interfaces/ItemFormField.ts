import { InputOptions } from './InputOptions';

type Key = string | number | symbol;

/**@deprecated use ItemFormField */
export type ItemFormMetaField<F extends Key = Key> = ItemFormField<F>;

export type ItemFormField<F extends Key = Key> =
  | ItemFormSingleField<F>
  | ItemFormField<F>[];

export type ItemFormSingleField<F extends Key = Key> =
  | ItemFormSimpleField<F>
  | ItemFormChoicesField<F>;

export interface ItemFormSimpleField<F extends Key = Key> extends InputOptions {
  name: F;
  widget?: 'select' | 'textarea' | 'datetime' | string;
  type?: 'string' | 'boolean' | 'number' | 'date';
}

interface Choice {
  text?: string;
  value: any;
}

export interface ItemFormChoicesField<F extends Key = Key>
  extends ItemFormSimpleField<F> {
  choices?: Choice[];
}
