export type FieldRule = (v: any) => boolean | string;

export interface InputOptions {
  label?: string;
  enabled?: boolean;
  readonly?: boolean;
  messages?: string[];
  required?: boolean;
  success?: boolean;
  successMsg?: string;
  error?: boolean;
  errorMsg?: string;
  hideDetails?: boolean;
  errorCount?: number;
  hint?: string;
  persistentHint?: boolean;
  appendIcon?: string;
  prependIcon?: string;
  rules?: FieldRule[];
}
