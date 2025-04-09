import type {
  AssistantThreadContextChangedMiddleware,
  AssistantThreadStartedMiddleware,
  AssistantUserMessageMiddleware,
} from "@slack/bolt/dist/Assistant";
import type { AssistantConfig } from "@slack/bolt/dist/Assistant";
import type { AssistantThreadContextStore } from "@slack/bolt/dist/AssistantThreadContextStore";
import Slack, { type SlackOptions } from "@xpr/nestjs-slack/slack";
import { EventTypes } from "./decorators";
import { Assistant } from "@slack/bolt";

export type SlackAssistantOptions = SlackOptions & {
  /**
   * Assistant thread context store
   * Recommended to use in production for persist thread context
   */
  threadContextStore?: AssistantThreadContextStore;
};

export default class SlackAssistant extends Slack {
  constructor(readonly options: SlackAssistantOptions) {
    super(options);
  }

  override async listen(callback: () => void): Promise<void> {
    const config: Partial<AssistantConfig> = {
      threadContextStore: this.options.threadContextStore,
    };

    for (const handler of this.getHandlers().values()) {
      const { type } = handler.extras as { type: string };
      switch (type) {
        case EventTypes.ThreadStarted:
          config.threadStarted = handler as AssistantThreadStartedMiddleware;
          break;
        case EventTypes.ThreadContextChanged:
          config.threadContextChanged =
            handler as AssistantThreadContextChangedMiddleware;
          break;
        case EventTypes.UserMessage:
          config.userMessage = handler as AssistantUserMessageMiddleware;
          break;
        default:
          this.register(handler);
      }
    }

    if (!config.userMessage) {
      throw new Error("UserMessage handler is required");
    }

    if (!config.threadStarted) {
      throw new Error("ThreadStarted handler is required");
    }

    this.app().assistant(new Assistant(config as AssistantConfig));
    await this.app().start();
    callback();
  }
}
