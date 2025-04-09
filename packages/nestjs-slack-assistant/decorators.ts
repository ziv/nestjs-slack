import { eventDecorator } from "@xpr/nestjs-slack/utils";
import type { AssistantConfig } from "@slack/bolt/dist/Assistant";

export const EventTypes: { [key: string]: keyof AssistantConfig } = {
  ThreadStarted: "threadStarted",
  ThreadContextChanged: "threadContextChanged",
  UserMessage: "userMessage",
};

export function ThreadStarted(): MethodDecorator {
  return eventDecorator(EventTypes.ThreadStarted, EventTypes.ThreadStarted);
}

export function ThreadContextChanged(): MethodDecorator {
  return eventDecorator(
    EventTypes.ThreadContextChanged,
    EventTypes.ThreadContextChanged,
  );
}

export function UserMessage(): MethodDecorator {
  return eventDecorator(EventTypes.UserMessage, EventTypes.UserMessage);
}
