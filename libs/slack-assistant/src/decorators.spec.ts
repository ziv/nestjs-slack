/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unused-vars */
/* sanity check */
import 'reflect-metadata';
import { ThreadContextChanged, ThreadStarted, UserMessage } from './decorators';
import { Controller } from '@nestjs/common';
import type { ThreadContextChangedArgs, ThreadStartedArgs, UserMessageArgs } from './types';

// @see https://github.com/nestjs/nest/blob/master/packages/microservices/constants.ts
export const PATTERN_METADATA = 'microservices:pattern';

@Controller()
class Foo {
  @ThreadStarted()
  ThreadStarted(_: ThreadStartedArgs) {
  }

  @ThreadContextChanged()
  ThreadContextChanged(_: ThreadContextChangedArgs) {
  }

  @UserMessage()
  UserMessage(_: UserMessageArgs) {
  }
}

const tester = new Foo();

test('ThreadStarted', () => {
  expect(Reflect.getMetadata(PATTERN_METADATA, tester.ThreadStarted)).toBeInstanceOf(Array);
});

test('ThreadContextChanged', () => {
  expect(Reflect.getMetadata(PATTERN_METADATA, tester.ThreadContextChanged)).toBeInstanceOf(Array);
});

test('UserMessage', () => {
  expect(Reflect.getMetadata(PATTERN_METADATA, tester.UserMessage)).toBeInstanceOf(Array);
});