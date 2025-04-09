import {
  ActionConstraints,
  OptionsConstraints,
  ShortcutConstraints,
  ViewConstraints,
} from '@slack/bolt';
import { Controller } from '@nestjs/common';
import { eventDecorator, messageDecorator, type Pattern } from './utils';

export { Pattern };

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
 * Decorator for Slack controller
 */
export function SlackController(): ClassDecorator {
  return (target) => Controller()(target);
}

/**
 * Decorator for event events
 * @see guide https://tools.slack.dev/bolt-js/concepts/event-listening
 * @see api https://api.slack.com/apis/events-api
 * @param event
 */
export function SlackEvent(event: string): MethodDecorator {
  // todo input validation (types for event)
  return eventDecorator(EventTypes.Event, event);
}

export type ShortCutId = Pattern | ShortcutConstraints;

/**
 * Decorator for shortcut events
 * @see guide https://tools.slack.dev/bolt-js/concepts/shortcuts
 * @see api https://api.slack.com/interactivity/shortcuts
 * @param shortcutId
 */
export function SlackShortcut(shortcutId: ShortCutId): MethodDecorator {
  return eventDecorator(EventTypes.Shortcut, shortcutId);
}

/**
 * Decorator for command events
 * @see guide https://tools.slack.dev/bolt-js/concepts/commands
 * @see api https://api.slack.com/interactivity/slash-commands
 * @param commandId
 */
export function SlackCommand(commandId: Pattern): MethodDecorator {
  // todo input validation command must start with / etc.
  return eventDecorator(EventTypes.Command, commandId);
}

export type ActionId = Pattern | ActionConstraints;

/**
 * Decorator for action events
 * @see guide https://tools.slack.dev/bolt-js/concepts/actions
 * @param actionId
 */
export function SlackAction(actionId: ActionId): MethodDecorator {
  return eventDecorator(EventTypes.Action, actionId);
}

export type ViewId = Pattern | ViewConstraints;

/**
 * Decorator for view events
 * @see guide https://tools.slack.dev/bolt-js/concepts/view-submissions
 * @param viewId
 */
export function SlackView(viewId: ViewId): MethodDecorator {
  return eventDecorator(EventTypes.View, viewId);
}

export type OptionId = OptionsConstraints;

/**
 * Decorator for options events
 * @see guide https://tools.slack.dev/bolt-js/concepts/options
 * @param optionId
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
 */
export function SlackMessage(pattern: Pattern = '*'): MethodDecorator {
  return messageDecorator('message', pattern);
}
