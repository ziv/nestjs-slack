import { ActionConstraints, OptionsConstraints, ShortcutConstraints, ViewConstraints } from '@slack/bolt';
import { Controller } from '@nestjs/common';
import { eventDecorator, type Pattern } from './utils';

// types to use in decorated methods
import type {
  AllMiddlewareArgs,
  AnyMiddlewareArgs,
  SlackActionMiddlewareArgs,
  SlackCommandMiddlewareArgs,
  SlackEventMiddlewareArgs,
  SlackOptionsMiddlewareArgs,
  SlackShortcutMiddlewareArgs,
  SlackViewMiddlewareArgs,
} from '@slack/bolt/dist/types';

export { Pattern };

export type EndpointArgs<T extends AnyMiddlewareArgs> = T & AllMiddlewareArgs;

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
  Message: 'message',
};

/**
 * Decorator for Slack controller
 */
export function SlackController(): ClassDecorator {
  return (target) => Controller()(target);
}

/**
 * Arguments for the slack event handler
 */
export type SlackEventArgs = EndpointArgs<SlackEventMiddlewareArgs>;

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

/**
 * Arguments for the slack shortcut handler
 */
export type SlackShortcutArgs = EndpointArgs<SlackShortcutMiddlewareArgs>;

/**
 * Shortcut id
 */
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
 * Arguments for the slack command handler
 */
export type SlackCommandArgs = EndpointArgs<SlackCommandMiddlewareArgs>;

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

/**
 * Arguments for the slack action handler
 */
export type SlackActionArgs = EndpointArgs<SlackActionMiddlewareArgs>;

/**
 * Action id
 */
export type ActionId = Pattern | ActionConstraints;

/**
 * Decorator for action events
 * @see guide https://tools.slack.dev/bolt-js/concepts/actions
 * @param actionId
 */
export function SlackAction(actionId: ActionId): MethodDecorator {
  return eventDecorator(EventTypes.Action, actionId);
}

/**
 * Arguments for the slack view handler
 */
export type SlackViewArgs = EndpointArgs<SlackViewMiddlewareArgs>;

/**
 * View id
 */
export type ViewId = Pattern | ViewConstraints;

/**
 * Decorator for view events
 * @see guide https://tools.slack.dev/bolt-js/concepts/view-submissions
 * @param viewId
 */
export function SlackView(viewId: ViewId): MethodDecorator {
  return eventDecorator(EventTypes.View, viewId);
}

/**
 * Arguments for the slack option handler
 */
export type SlackOptionArgs = EndpointArgs<SlackOptionsMiddlewareArgs>;

/**
 * Options id
 */
export type OptionId = OptionsConstraints;

/**
 * Decorator for options events
 * @see guide https://tools.slack.dev/bolt-js/concepts/options
 * @param optionId
 */
export function SlackOption(optionId: OptionId): MethodDecorator {
  return eventDecorator(EventTypes.Option, optionId);
}

export type SlackMessageArgs = EndpointArgs<SlackEventMiddlewareArgs<'message'>>;

/**
 * Decorator for message events
 *
 * @see guide https://tools.slack.dev/bolt-js/concepts/message-listening
 * @see reference https://api.slack.com/events/message
 * @param pattern
 */
export function SlackMessage(pattern: Pattern = '*'): MethodDecorator {
  return eventDecorator(EventTypes.Message, pattern);
}
