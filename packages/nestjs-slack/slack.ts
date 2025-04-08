import {
  type CustomTransportStrategy,
  type MessageHandler,
  Server,
} from '@nestjs/microservices';
import { App, type AppOptions, SlackOptionsMiddlewareArgs } from '@slack/bolt';
import type {
  Middleware,
  SlackActionMiddlewareArgs,
  SlackCommandMiddlewareArgs,
  SlackEventMiddlewareArgs,
  SlackShortcutMiddlewareArgs,
} from '@slack/bolt/dist/types';
import { EventTypes, OptionId, Pattern } from './decorators';

export type SlackAssistantOptions = {
  /**
   * Slack application options with required types
   * @see https://github.com/slackapi/bolt-js
   */
  slack: AppOptions;
};

type Extra = { type: string; event: Pattern };

export default class Slack extends Server implements CustomTransportStrategy {
  #app?: App;

  constructor(readonly options: SlackAssistantOptions) {
    super();
  }

  async listen(callback: () => void): Promise<void> {
    for (const handler of this.getHandlers().values()) {
      this.register(handler);
    }
    await this.app().start();
    callback();
  }

  async close(): Promise<void> {
    // this.#app && (await this.#app.stop());
  }

  // todo web-client/WebClient events for better typing of the event argument
  on(): void {
    throw new Error('Use SlackEvent decorator to register events');
  }

  unwrap<T>(): T {
    // return this.#app as T;
    throw new Error('Use SlackEvent decorator to register events');
  }

  /**
   * Register the handler for the event
   * @param handler
   * @protected
   */
  protected register(handler: MessageHandler) {
    const { type, event } = handler.extras as Extra;
    switch (type) {
      case EventTypes.Shortcut:
        return this.app().shortcut(
          event,
          handler as Middleware<SlackShortcutMiddlewareArgs>,
        );
      case EventTypes.Action:
        return this.app().action(
          event,
          handler as Middleware<SlackActionMiddlewareArgs>,
        );
      case EventTypes.Event:
        return this.app().event<string>(
          event as string, // todo improve by providing types
          handler as Middleware<SlackEventMiddlewareArgs>,
        );
      case EventTypes.Command:
        return this.app().command(
          event,
          handler as Middleware<SlackCommandMiddlewareArgs>,
        );
      case EventTypes.Option:
        return this.app().options(
          event as OptionId,
          handler as Middleware<SlackOptionsMiddlewareArgs>,
        );
    }
  }

  /**
   * Get the Bolt app instance
   * @protected
   */
  protected app(): App {
    if (!this.#app) {
      this.#app = new App(this.options.slack);
      this.logger.log('Bolt app created');
    }
    return this.#app;
  }
}
