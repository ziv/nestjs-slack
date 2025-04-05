/* sanity */
import SlackAssistant from './slack-assistant';
import { Server } from '@nestjs/microservices';

const t = new SlackAssistant({ slack: { token: '', appToken: '' } });

test('SlackAssistantTransport', () => {
  expect(t).toBeInstanceOf(Server);
});