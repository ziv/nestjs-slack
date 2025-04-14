import {
  type CustomTransportStrategy,
  type MessageHandler,
  Server,
} from "@nestjs/microservices";
import { App, type AppOptions, SlackOptionsMiddlewareArgs } from "@slack/bolt";
import type {
  Middleware,
  SlackActionMiddlewareArgs,
  SlackCommandMiddlewareArgs,
  SlackEventMiddlewareArgs,
  SlackShortcutMiddlewareArgs,
} from "@slack/bolt/dist/types";
import { EventTypes, OptionId, Pattern } from "./decorators";
import { adjustLogger } from "./utils";

// local helpers types

type Extra = { type: string; event: Pattern };
type ShortcutHandler = Middleware<SlackShortcutMiddlewareArgs>;
type ActionHandler = Middleware<SlackActionMiddlewareArgs>;
type EventHandler = Middleware<SlackEventMiddlewareArgs>;
type CommandHandler = Middleware<SlackCommandMiddlewareArgs>;
type OptionsHandler = Middleware<SlackOptionsMiddlewareArgs>;
type MsgHandler = Middleware<SlackEventMiddlewareArgs<"message">>;

export type SlackOptions = {
  /**
   * Slack application options with required types
   * @see https://github.com/slackapi/bolt-js
   */
  slack: AppOptions;
};

export default class Slack extends Server implements CustomTransportStrategy {
  #app?: App;

  constructor(readonly options: SlackOptions) {
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
    this.#app && (await this.#app.stop());
  }

  on(): void {
    throw new Error("Use SlackEvent decorator to register events");
  }

  unwrap<T>(): T {
    return this.#app as T;
  }

  /**
   * Register the handler for the event
   * @param handler
   * @protected
   */
  protected register(handler: MessageHandler) {
    const { type, event } = handler.extras as Extra;
    switch (type) {
      case EventTypes.Message:
        this.app().message(event, handler as MsgHandler);
        break;
      case EventTypes.Shortcut:
        this.app().shortcut(event, handler as ShortcutHandler);
        break;
      case EventTypes.Action:
        this.app().action(event, handler as ActionHandler);
        break;
      case EventTypes.Event:
        this.app().event(event as string, handler as EventHandler);
        break;
      case EventTypes.Command:
        this.app().command(event, handler as CommandHandler);
        break;
      case EventTypes.Option:
        this.app().options(event as OptionId, handler as OptionsHandler);
        break;
      default:
        throw new Error(`Unknown event type ${type}`);
    }
    this.logger.log(`Handler of type [${type}] registered with id(${event})`);
  }

  /**
   * Get/Create Bolt app instance
   * @protected
   */
  protected app(): App {
    if (!this.#app) {
      // make sure to add logger if not provided
      if (!this.options.slack.logger) {
        this.options.slack.logger = adjustLogger(this.logger);
      }
      this.#app = new App(this.options.slack);
      this.logger.log("Bolt app created");
    }
    return this.#app;
  }
}
