import type { TranslateResult } from 'vue-i18n';
import type { IconType } from '../IconType';

export interface ConfirmOptions {
  message?: string | TranslateResult;
  buttonTrueText?: string;
  buttonFalseText?: string;
  buttonTrueColor?: string;
  buttonFalseColor?: string;
  buttonFalseFlat?: boolean;
  buttonTrueFlat?: boolean;
  color?: 'success' | 'info' | 'error' | 'primary' | string;
  icon?: IconType;
  persistent?: boolean;
  title?: string;
  width?: number;
}
