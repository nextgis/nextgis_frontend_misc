export interface NoticeOptions {
  message?: string;
  color?: 'success' | 'info' | 'error' | 'primary' | string;
  icon?: string;
  timeout?: number;
  dismissible?: boolean;
}
