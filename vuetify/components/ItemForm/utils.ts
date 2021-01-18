import { ItemFormField, ItemFormSingleField } from './interfaces/ItemFormField';

export function updateItemFormField(
  field: ItemFormField,
  cb: (field: ItemFormSingleField) => void
): void {
  if (Array.isArray(field)) {
    field.forEach((x) => updateItemFormField(x, cb));
  } else {
    cb(field);
  }
}
