import {
  SlackController,
  ThreadContextChanged,
  ThreadStarted,
  UserMessage,
} from ".";
import type {
  ThreadContextChangedArgs,
  ThreadStartedArgs,
  UserMessageArgs,
} from ".";

@SlackController()
class AssistantTest {
  @ThreadContextChanged()
  changed(args: ThreadContextChangedArgs) {
    console.log(args);
  }

  @ThreadStarted()
  started(args: ThreadStartedArgs) {
    console.log(args);
  }

  @UserMessage()
  msg(args: UserMessageArgs) {
    console.log(args);
  }
}

console.log(new AssistantTest());
