import { InputOptions } from './InputOptions';

type Key = string | number | symbol;

export type ItemFormMetaField<F extends Key = Key> =
  | ItemFormMetaSimpleField<F>
  | ItemFormMetaChoicesField<F>;

export interface ItemFormMetaSimpleField<F extends Key = Key>
  extends InputOptions {
  name: F;
  type?: 'string' | 'boolean' | 'number' | 'date';
}

interface Choice {
  text?: string;
  value: string;
}

export interface ItemFormMetaChoicesField<F extends Key = Key>
  extends ItemFormMetaSimpleField<F> {
  choices?: Choice[];
}
