import { IconType } from '../IconType';

export interface NoticeOptions {
  message?: string;
  color?: 'success' | 'info' | 'error' | 'primary' | string;
  icon?: IconType;
  timeout?: number;
  dismissible?: boolean;
}
