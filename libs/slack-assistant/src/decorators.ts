import { MessagePattern } from '@nestjs/microservices';

// @slack/bolt Assistant

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


// // @slack/bolt Actions/Events
//
// export function SlackEvent(event: string): MethodDecorator {
//   return (
//     target: object,
//     key: string | symbol,
//     descriptor: PropertyDescriptor,
//   ) => {
//     return MessagePattern(`slackEvent:${event}`)(target, key, descriptor);
//   };
// }