import { ItemFormField } from '../../components/ItemForm';

import type { IconType } from '../IconType';

export interface FormDialogOptions<I = Record<string, any>> {
  item: I;
  fields: ItemFormField[];
  message?: string;
  buttonApplyText?: string;
  buttonCancelText?: string;
  buttonApplyColor?: string;
  buttonCancelColor?: string;
  buttonCancelFlat?: boolean;
  buttonApplyFlat?: boolean;
  color?: 'success' | 'info' | 'error' | 'primary' | string;
  icon?: IconType;
  persistent?: boolean;
  title?: string;
  width?: number;
}
