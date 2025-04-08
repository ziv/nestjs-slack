import { type CustomTransportStrategy, Server } from "@nestjs/microservices";
import { App, type AppOptions, Assistant } from "@slack/bolt";
import type { AssistantThreadContextStore } from "@slack/bolt/dist/AssistantThreadContextStore";
import type {
  AssistantThreadContextChangedMiddleware,
  AssistantThreadStartedMiddleware,
  AssistantUserMessageMiddleware,
} from "@slack/bolt/dist/Assistant";
import type { WebClientEvent } from "@slack/web-api";

// using Function type to match the inherited signature (Server)
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
type Func = Function;
type Handler = (...args: any[]) => void;

export type SlackAssistantOptions = {
  /**
   * Slack application options with required types
   * @see https://github.com/slackapi/bolt-js
   */
  slack: AppOptions & Required<{ token: string; appToken: string }>;

  /**
   * Assistant thread context store
   * Recommended to use in production for persist thread context
   */
  threadContextStore?: AssistantThreadContextStore;
};

export default class SlackAssistant extends Server
  implements CustomTransportStrategy {
  #app: App | undefined;
  #eventsBuffer = new Map<string, Func>();

  constructor(readonly options: SlackAssistantOptions) {
    super();
  }

  async listen(callback: () => void): Promise<void> {
    // do we have main reply handler?
    const userMessage = this.getHandlerByPattern("userMessage");
    if (!userMessage) {
      throw new Error("UserMessage handler is required");
    }

    const noop = () => {
    };

    // todo the socket mode should be removed when done, allow user to set it
    this.#app = new App({ ...(this.options.slack ?? {}), socketMode: true });

    for (const key of this.#eventsBuffer.keys()) {
      this.#app.client.addListener(
        key as WebClientEvent,
        this.#eventsBuffer.get(key) as Handler,
      );
    }

    this.#app.assistant(
      new Assistant({
        threadContextStore: this.options.threadContextStore,
        userMessage: userMessage as AssistantUserMessageMiddleware,
        threadStarted: this.getHandlerByPattern(
          "threadStarted",
        ) as AssistantThreadStartedMiddleware ?? noop,
        threadContextChanged: this.getHandlerByPattern(
          "threadContextChanged",
        ) as AssistantThreadContextChangedMiddleware ?? noop,
      }),
    );

    await this.#app.start();
    callback();
  }

  async close(): Promise<void> {
    if (!this.#app) {
      return;
    }
    await this.#app.stop();
  }

  // todo web-client/WebClient events for better typing of the event argument
  on(event: string, callback: Func): void {
    if (this.#app) {
      this.#app.client.addListener(
        event as WebClientEvent,
        callback as Handler,
      );
    } else {
      this.#eventsBuffer.set(event, callback);
    }
  }

  unwrap<T = App>(): T {
    return this.#app as T;
  }
}
