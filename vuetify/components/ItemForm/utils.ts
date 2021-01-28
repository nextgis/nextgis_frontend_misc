import { ItemFormField, ItemFormSingleField } from './interfaces/ItemFormField';

export function eachItemFormField(
  field: ItemFormField,
  cb: (field: ItemFormSingleField) => void
): void {
  if (Array.isArray(field)) {
    field.forEach((x) => eachItemFormField(x, cb));
  } else {
    cb(field);
  }
}

/**
 * @deprecated use eachItemFormField
 */
export function updateItemFormField(
  field: ItemFormField,
  cb: (field: ItemFormSingleField) => void
): void {
  eachItemFormField(field, cb);
}
