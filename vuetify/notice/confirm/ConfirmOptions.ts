export interface ConfirmOptions {
  message?: string;
  buttonTrueText?: string;
  buttonFalseText?: string;
  buttonTrueColor?: string;
  buttonFalseColor?: string;
  buttonFalseFlat?: boolean;
  buttonTrueFlat?: boolean;
  color?: 'success' | 'info' | 'error' | 'primary' | string;
  icon?: string;
  persistent?: boolean;
  title?: string;
  width?: number;
}
