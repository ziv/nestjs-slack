import { eventDecorator } from "@xpr/nestjs-slack/utils";
import type { EndpointArgs } from "@xpr/nestjs-slack";
import type {
  AssistantConfig,
  AssistantThreadContextChangedMiddlewareArgs,
  AssistantThreadStartedMiddlewareArgs,
  AssistantUserMessageMiddlewareArgs,
} from "@slack/bolt/dist/Assistant";

export const AssistantEventTypes: { [key: string]: keyof AssistantConfig } = {
  ThreadStarted: "threadStarted",
  ThreadContextChanged: "threadContextChanged",
  UserMessage: "userMessage",
};

/**
 * Arguments for the slack assistant thread started handler
 */
export type ThreadStartedArgs = EndpointArgs<
  AssistantThreadStartedMiddlewareArgs
>;

/**
 * Decorator for thread started event
 * @see https://tools.slack.dev/bolt-js/concepts/ai-apps
 */
export function ThreadStarted(): MethodDecorator {
  return eventDecorator(
    AssistantEventTypes.ThreadStarted,
    AssistantEventTypes.ThreadStarted,
  );
}

/**
 * Arguments for the slack assistant thread context changed handler
 */
export type ThreadContextChangedArgs = EndpointArgs<
  AssistantThreadContextChangedMiddlewareArgs
>;

/**
 * Decorator for context changed event
 * @see https://tools.slack.dev/bolt-js/concepts/ai-apps
 */
export function ThreadContextChanged(): MethodDecorator {
  return eventDecorator(
    AssistantEventTypes.ThreadContextChanged,
    AssistantEventTypes.ThreadContextChanged,
  );
}

/**
 * Arguments for the slack assistant user message handler
 */
export type UserMessageArgs = EndpointArgs<AssistantUserMessageMiddlewareArgs>;

/**
 * Decorator for user message event
 * @see https://tools.slack.dev/bolt-js/concepts/ai-apps
 */
export function UserMessage(): MethodDecorator {
  return eventDecorator(
    AssistantEventTypes.UserMessage,
    AssistantEventTypes.UserMessage,
  );
}
