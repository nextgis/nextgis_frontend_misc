import { Messages } from './interfaces/Messages';

export const MESSAGES: Messages = {
  shouldNotBeAbove: 'should not be above',
  shouldBeAbove: 'should be above',
  enterFiled: 'Field is required',
  okText: 'Ok',
  clearText: 'Clear',
};

export function setMessages(messages: Partial<Messages>): void {
  Object.assign(MESSAGES, messages);
}
