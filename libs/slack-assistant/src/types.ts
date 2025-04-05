import type {
  AssistantThreadContextChangedMiddlewareArgs,
  AssistantThreadStartedMiddlewareArgs, AssistantUserMessageMiddlewareArgs,
} from '@slack/bolt/dist/Assistant';
import { AllMiddlewareArgs } from '@slack/bolt/dist/types/middleware';

// todo fix those types
export type ThreadStartedArgs = AssistantThreadStartedMiddlewareArgs & AllMiddlewareArgs;
export type ThreadContextChangedArgs = AssistantThreadContextChangedMiddlewareArgs & AllMiddlewareArgs;
export type UserMessageArgs = AssistantUserMessageMiddlewareArgs & AllMiddlewareArgs;
