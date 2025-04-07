import { NestFactory } from '@nestjs/core';
import SlackAssistant from '@xpr/nestjs-slack-assistant/slack-assistant';
import { Controller, Injectable, Logger, Module } from '@nestjs/common';
import {
  ThreadContextChanged,
  ThreadStarted,
  UserMessage,
} from '@xpr/nestjs-slack-assistant/decorators';
import type { ThreadStartedArgs, UserMessageArgs, ThreadContextChangedArgs } from '@xpr/nestjs-slack-assistant/types';

// nest js dependency (in this case, the LLM service)
@Injectable()
class LlmAgent {

  invoke(prompt: string) {
    return Promise.resolve(prompt ? 'You said: ' + prompt : 'I do not know what you said');
  }
}

// the chat controller, notice the decorator
@Controller()
class ChatController {
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

  // /**
  //  * This endpoint is optional
  //  */
  // @ThreadContextChanged()
  // async contextChanged({ saveThreadContext }: ThreadContextChangedArgs) {
  //   await saveThreadContext();
  // }

  /**
   * This endpoint is mandatory
   */
  @UserMessage()
  async message({ message, say, client }: UserMessageArgs) {
    // use the client to interact with slack
    // client.views.open()
    try {
      // client.views.update
      const response = await this.agent.invoke((message as { text: string })?.text ?? '');
      await say(response);
    } catch (err) {
      this.logger.error('message failed', err);
    }
  }
}

@Module({
  providers: [LlmAgent],
  controllers: [ChatController],
})
class AppModule {
}

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: new SlackAssistant({
      slack: {
        token: process.env.SLACK_BOT_TOKEN as string,
        appToken: process.env.SLACK_APP_TOKEN as string,
      },
    }),
  });

  await app.listen();
}

bootstrap();
