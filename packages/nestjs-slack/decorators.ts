import { EventPattern, MessagePattern } from '@nestjs/microservices';
import {
  ActionConstraints,
  OptionsConstraints,
  ShortcutConstraints,
  ViewConstraints,
} from '@slack/bolt';

export type Pattern = string | RegExp;
export type ShortCutId = Pattern | ShortcutConstraints;
export type ActionId = Pattern | ActionConstraints;
export type ViewId = Pattern | ViewConstraints;
export type OptionId = OptionsConstraints;

export type AllConstraints =
  | Pattern
  | ActionConstraints
  | ShortcutConstraints
  | ViewConstraints
  | OptionsConstraints;

const normalizePattern = (pattern: AllConstraints) => {
  if (typeof pattern === 'string') {
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
export function eventDecorator<T extends AllConstraints>(
  type: string,
  event: T,
): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => EventPattern(`${type}://${normalizePattern(event)}`, {
    type,
    event,
  })(target, key, descriptor);

}

/**
 * @see https://tools.slack.dev/bolt-js/reference/
 */
export const EventTypes = {
  Event: 'event',
  Shortcut: 'shortcut',
  Command: 'command',
  Action: 'action',
  View: 'view',
  Option: 'option',
};

/**
 * Decorator for event events
 * @see guide https://tools.slack.dev/bolt-js/concepts/event-listening
 * @see api https://api.slack.com/apis/events-api
 * @param event
 * @constructor
 */
export function SlackEvent(event: string): MethodDecorator {
  // todo input validation (types for event)
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => EventPattern(`${EventTypes.Event}://${normalizePattern(event)}`, {
    type: EventTypes.Event,
    event,
  })(target, key, descriptor);
}

/**
 * Decorator for shortcut events
 * @see guide https://tools.slack.dev/bolt-js/concepts/shortcuts
 * @see api https://api.slack.com/interactivity/shortcuts
 * @param shortcutId
 * @constructor
 */
export function SlackShortcut(shortcutId: ShortCutId): MethodDecorator {
  return eventDecorator(EventTypes.Shortcut, shortcutId);
}

/**
 * Decorator for command events
 * @see guide https://tools.slack.dev/bolt-js/concepts/commands
 * @see api https://api.slack.com/interactivity/slash-commands
 * @param commandId
 * @constructor
 */
export function SlackCommand(commandId: Pattern): MethodDecorator {
  // todo input validation command must start with / etc.
  return eventDecorator(EventTypes.Command, commandId);
}

/**
 * Decorator for action events
 * @see guide https://tools.slack.dev/bolt-js/concepts/actions
 * @param actionId
 * @constructor
 */
export function SlackAction(actionId: ActionId): MethodDecorator {
  return eventDecorator(EventTypes.Action, actionId);
}

/**
 * Decorator for view events
 * @see guide https://tools.slack.dev/bolt-js/concepts/view-submissions
 * @param viewId
 * @constructor
 */
export function SlackView(viewId: ViewId): MethodDecorator {
  return eventDecorator(EventTypes.View, viewId);
}

/**
 * Decorator for options events
 * @see guide https://tools.slack.dev/bolt-js/concepts/options
 * @param optionId
 * @constructor
 */
export function SlackOption(optionId: OptionId): MethodDecorator {
  return eventDecorator(EventTypes.Option, optionId);
}

/**
 * Decorator for message events
 *
 * @see guide https://tools.slack.dev/bolt-js/concepts/message-listening
 * @see reference https://api.slack.com/events/message
 * @param pattern
 * @constructor
 */
export function SlackMessage(pattern: string | RegExp = '*'): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    return MessagePattern(`message://${normalizePattern(pattern)}`, {
      type: 'message',
      pattern,
    })(target, key, descriptor);
  };
}
