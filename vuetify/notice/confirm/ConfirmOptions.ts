import { IconType } from '../IconType';

export interface ConfirmOptions {
  message?: string;
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
