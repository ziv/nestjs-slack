import type {
  SlackActionArgs,
  SlackCommandArgs,
  SlackEventArgs,
  SlackMessageArgs,
  SlackOptionArgs,
  SlackShortcutArgs,
  SlackViewArgs,
} from "./decorators";
import {
  SlackAction,
  SlackCommand,
  SlackEvent,
  SlackMessage,
  SlackOption,
  SlackShortcut,
  SlackView,
} from "./decorators";

class TestClass {
  @SlackMessage("test")
  slackMessage(args: SlackMessageArgs) {
    console.log(args);
  }

  @SlackView("test")
  slackView(args: SlackViewArgs) {
    console.log(args);
  }

  @SlackShortcut("test")
  slackShortcut(args: SlackShortcutArgs) {
    console.log(args);
  }

  @SlackAction("test")
  slackAction(args: SlackActionArgs) {
    console.log(args);
  }

  @SlackCommand("test")
  slackCommand(args: SlackCommandArgs) {
    console.log(args);
  }

  @SlackOption({ action_id: "test" })
  slackOption(args: SlackOptionArgs) {
    console.log(args);
  }

  @SlackEvent("test")
  slackEvent(args: SlackEventArgs) {
    console.log(args);
  }
}

const testClass = new TestClass();
console.log(testClass);
