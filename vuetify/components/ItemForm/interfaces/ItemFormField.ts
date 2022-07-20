import { InputOptions } from './InputOptions';

type Key = string | number | symbol;

/**@deprecated use ItemFormField */
export type ItemFormMetaField<F extends Key = Key> = ItemFormField<F>;

export type ItemFormField<F extends Key = Key> =
  | ItemFormSingleField<F>
  | ItemFormField<F>[];

export type ItemFormSingleField<F extends Key = Key> =
  | ItemFormSimpleField<F>
  | ItemFormNumberField<F>
  | ItemFormChoicesField<F>
  | ItemFormFileField<F>;

export interface ItemFormSimpleField<F extends Key = Key> extends InputOptions {
  name: F;
  widget?: 'select' | 'textarea' | 'datetime' | string;
  type?: 'string' | 'boolean' | 'number' | 'date' | 'file';
  test?: (item: any) => boolean;
}

interface Choice {
  text?: string;
  value: any;
}

export interface ItemFormChoicesField<F extends Key = Key>
  extends ItemFormSimpleField<F> {
  choices?: Choice[];
}

export interface ItemFormNumberField<F extends Key = Key>
  extends ItemFormSimpleField<F> {
  type: 'number';
  min?: number;
  max?: number;
}
export interface ItemFormFileField<F extends Key = Key>
  extends ItemFormSimpleField<F> {
  type: 'file';
  accept?: string;
}
