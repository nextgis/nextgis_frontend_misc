import { InputOptions } from './InputOptions';

type Key = string | number | symbol;

export type ItemFormMetaField<F extends Key = Key> =
  | ItemFormMetaSimpleField<F>
  | ItemFormMetaChoicesField<F>;

export interface ItemFormMetaSimpleField<F extends Key = Key>
  extends InputOptions {
  name: F;
  widget?: 'select' | 'textarea' | string;
  type?: 'string' | 'boolean' | 'number' | 'date';
  getter?: (val: any) => any;
  setter?: (val: any) => any;
}

interface Choice {
  text?: string;
  value: string;
}

export interface ItemFormMetaChoicesField<F extends Key = Key>
  extends ItemFormMetaSimpleField<F> {
  choices?: Choice[];
}
