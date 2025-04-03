import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { App, Assistant, Logger as BoltLogger } from '@slack/bolt';
import type { AssistantThreadContextStore } from '@slack/bolt/dist/AssistantThreadContextStore';
import type { Middleware } from '@slack/bolt/dist/types/middleware';
import { Logger as NestLogger } from '@nestjs/common';

export type SlackAssistantOptions = {
  botToken: string;
  appToken: string;
  logger?: NestLogger;
  threadContextStore?: AssistantThreadContextStore;
}

export default class SlackAssistant extends Server implements CustomTransportStrategy {
  #app: App;

  constructor(readonly options: SlackAssistantOptions) {
    super();
  }

  async listen(callback: () => void) {
    // do we have main reply handler?
    const userMessage = this.getHandlerByPattern('userMessage');
    if (!userMessage) {
      throw new Error('UserMessage handler is required');
    }

    const noop = () => {
    };

    this.#app = new App({
      socketMode: true,
      token: this.options.botToken,
      appToken: this.options.appToken,
      logger: Object.assign(this.options.logger ?? new NestLogger('slack assistant'), {
        getLevel: noop,
        setLevel: noop,
        setName: noop,
      }) as unknown as BoltLogger,
    });


    this.#app.assistant(new Assistant({
      threadContextStore: this.options.threadContextStore,
      userMessage: userMessage as Middleware<unknown>,
      threadStarted: this.getHandlerByPattern('threadStarted') as Middleware<unknown> ?? noop,
      threadContextChanged: this.getHandlerByPattern('threadContextChanged') as Middleware<unknown> ?? noop,
    }));

    await this.#app.start();
    callback();
  }

  async close() {
    await this.#app.stop();
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  on(event: string, callback: Function) {
    // todo web-client/WebClient events for better typing
    this.#app.client.addListener<any>(event, callback as (...args: any[]) => void);
  }

  unwrap<T>() {
    return this.#app as T;
  }
}
