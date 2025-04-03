import { MessagePattern } from '@nestjs/microservices';
import type {
  AssistantThreadContextChangedMiddlewareArgs,
  AssistantThreadStartedMiddlewareArgs, AssistantUserMessageMiddlewareArgs,
} from '@slack/bolt/dist/Assistant';
import { AllMiddlewareArgs } from '@slack/bolt/dist/types/middleware';

// todo fix those types
export type ThreadStartedArgs = AssistantThreadStartedMiddlewareArgs & AllMiddlewareArgs;
export type ThreadContextChangedArgs = AssistantThreadContextChangedMiddlewareArgs & AllMiddlewareArgs;
export type UserMessageArgs = AssistantUserMessageMiddlewareArgs & AllMiddlewareArgs;

export function ThreadStarted(): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    return MessagePattern('threadStarted')(target, key, descriptor);
  };
}

export function ThreadContextChanged(): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    return MessagePattern('threadContextChanged')(target, key, descriptor);
  };
}

export function UserMessage(): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    return MessagePattern('userMessage')(target, key, descriptor);
  };
}