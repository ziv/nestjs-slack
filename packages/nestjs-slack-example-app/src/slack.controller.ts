import { Controller } from '@nestjs/common';
import { SlackAction, SlackCommand } from '@xpr/nestjs-slack';
import { SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types/command';
import { SlackActionMiddlewareArgs } from '@slack/bolt/dist/types/actions';

@Controller()
export class SlackController {
  @SlackAction('button-action')
  async onAction({ ack, respond, payload }: SlackActionMiddlewareArgs) {
    await ack();
    await respond(`Button clicked! with payload ${JSON.stringify(payload)}`);
  }

  @SlackCommand('/ping')
  async onPing({ ack, respond }: SlackCommandMiddlewareArgs) {
    await ack();
    await respond({
      text: 'pong!',
      response_type: 'in_channel',
    });
  }
}
