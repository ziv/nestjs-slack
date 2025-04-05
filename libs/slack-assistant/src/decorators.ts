import { MessagePattern } from '@nestjs/microservices';

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