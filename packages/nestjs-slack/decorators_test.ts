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
  slackMessage() {
    return "test";
  }

  @SlackView("test")
  slackView() {
    return "test";
  }

  @SlackShortcut("test")
  slackShortcut() {
    return "test";
  }

  @SlackAction("test")
  slackAction() {
    return "test";
  }

  @SlackCommand("test")
  slackCommand() {
    return "test";
  }

  @SlackOption({ action_id: "test" })
  slackOption() {
    return "test";
  }

  @SlackEvent("test")
  slackEvent() {
    return "test";
  }
}
