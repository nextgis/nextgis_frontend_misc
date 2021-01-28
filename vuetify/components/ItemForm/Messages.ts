import { Messages } from './interfaces/Messages';

export const MESSAGES: Messages = {
  shouldNotBeAbove: 'Should not be above',
  shouldBeAbove: 'Should be above',
  enterFiled: 'Field is required',
  okText: 'Ok',
  clearText: 'Clear',
};

export function setMessages(messages: Partial<Messages>): void {
  Object.assign(MESSAGES, messages);
}
