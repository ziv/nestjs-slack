import { Controller } from '@nestjs/common';
import { ThreadStarted, UserMessage } from '@xpr/nestjs-slack-assistant';
import type {
  ThreadStartedArgs,
  UserMessageArgs,
} from '@xpr/nestjs-slack-assistant';

const reply = {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'This is a section block with a button.',
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Click Me',
          emoji: true,
        },
        value: 'click_me_123',
        action_id: 'button-action',
      },
    },
  ],
};

@Controller()
export class AssistantController {
  @ThreadStarted()
  async startConversation({ say, setSuggestedPrompts }: ThreadStartedArgs) {
    try {
      await say(reply);
      await say('How can I help you?');
      await setSuggestedPrompts({
        title: 'Here are some suggested prompts:',
        prompts: [
          {
            title: 'What is the weather like today?',
            message: '...the prompt to the LLM...',
          },
          {
            title: 'Tell me a joke',
            message: '...the prompt to the LLM...',
          },
        ],
      });
    } catch (err) {
      console.error('need to add error handling', err);
    }
  }

  @UserMessage()
  async replyMessage({ message, say }: UserMessageArgs) {
    const msg = (message as { text: string })?.text ?? '';
    await say('I received your message: ' + msg);
  }
}
