import { EventPattern, MessagePattern } from "@nestjs/microservices";
import { type Logger, LogLevel } from "@slack/bolt";

export type Pattern = string | RegExp;

const normalizePattern = (pattern: unknown): string => {
  if (typeof pattern === "string") {
    return pattern;
  }
  if (pattern instanceof RegExp) {
    return pattern.toString();
  }
  return JSON.stringify(pattern);
};

/**
 * Create method decorator
 * @param type type of listener
 * @param event how to identify the event
 */
export function eventDecorator<T>(type: string, event: T): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ): void | TypedPropertyDescriptor<any> =>
    EventPattern(`${type}://${normalizePattern(event)}`, {
      type,
      event,
    })(target, key, descriptor);
}

/**
 * Create method decorator
 * @param type type of listener
 * @param pattern how to identify the message
 */
export function messageDecorator(
  type: string,
  pattern: Pattern,
): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ): void | TypedPropertyDescriptor<any> =>
    MessagePattern(`${type}://${normalizePattern(pattern)}`, {
      type,
      pattern,
    })(target, key, descriptor);
}

export function adjustLogger(logger: any): Logger {
  // minimal logger interface required by the library
  for (const method of ["debug", "info", "warn", "error"]) {
    if (typeof logger[method] !== "function") {
      throw new Error(`Logger must implement "${method}" method`);
    }
  }

  const noop = () => {
  };

  return Object.assign(logger, {
    setLevel(_: LogLevel) {
      // don't allow library to set the level
    },
    setName(name: string) {
      // setContext is alias for setName
      (logger.setName ?? logger.setContext ?? noop)(name);
    },
    getLevel(): LogLevel {
      // always return the lowest supported level (by library, not real logger)
      // to avoid filtering log messages by library instead of real logger
      return LogLevel.DEBUG;
    },
  }) as Logger;
}
