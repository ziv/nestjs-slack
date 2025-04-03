import { Controller, Logger } from '@nestjs/common';
import {
  ThreadContextChanged,
  type ThreadContextChangedArgs,
  ThreadStarted,
  type ThreadStartedArgs,
  UserMessage,
  type UserMessageArgs,
} from '@xpr/slack-assistant';
import LlmAgent from './llm.agent';

@Controller()
export class AppController {
  logger = new Logger('AppController');

  constructor(readonly agent: LlmAgent) {
  }

  /**
   * This endpoint is optional
   */
  @ThreadStarted()
  async start({ say, setSuggestedPrompts, saveThreadContext }: ThreadStartedArgs) {
    try {
      await say('Hi, how can I help you?');
      await saveThreadContext();
      await setSuggestedPrompts({
        title: 'Here are some suggested options:',
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
      this.logger.error('start failed', err);
    }
  }

  /**
   * This endpoint is optional
   */
  @ThreadContextChanged()
  async contextChanged({ saveThreadContext }: ThreadContextChangedArgs) {
    await saveThreadContext();
  }

  /**
   * This endpoint is mandatory
   */
  @UserMessage()
  async message({ message, say, client }: UserMessageArgs) {
    try {
      // client.views.update
      const response = await this.agent.invoke((message as { text: string })?.text ?? '');
      await say(response);
    } catch (err) {
      this.logger.error('message failed', err);
    }
  }
}
