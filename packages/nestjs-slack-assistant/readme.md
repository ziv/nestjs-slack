# @xpr/nestjs-slack-assistant

This package export all decorators from `@xpr/nestjs-slack` package. See
[@xpr/nestjs-slack](../nestjs-slack/readme.md) documentation for more details.

## Usage

### Installation

```shell
npm i @xpr/nestjs-slack-assistant
```

### Transport

Minimal required configuration includes
[token](https://api.slack.com/concepts/token-types#bot) and
[app token](https://api.slack.com/concepts/token-types#app-level).

More information about slack tokens: https://api.slack.com/concepts/token-types

```typescript
const token = process.env.SLACK_BOT_TOKEN as string;
const appToken = process.env.SLACK_APP_TOKEN as string;

const app = await NestFactory.createMicroservice(MyChatModule, {
  strategy: new SlackAssistant({
    slack: {
      token,
      appToken,
    },
  }),
});

await app.listen();
```

### Controller

The package exports 3 decorators:

- `@ThreadStarted` - triggered when a thread is started
  ([slack docs](https://tools.slack.dev/bolt-js/concepts/ai-apps/#handling-new-thread))
- `@ThreadContextChanged` - triggered when a thread context is changed
  ([slack docs](https://tools.slack.dev/bolt-js/concepts/ai-apps/#handling-thread-context-changes))
- `@UserMessage` - triggered when a user sends a message in a thread
  ([slack docs](https://tools.slack.dev/bolt-js/concepts/ai-apps/#handling-user-messages))

The only mandatory decorator is `@UserMessage`, but you can use the other two to
handle thread context changes and thread started events.

```typescript
@SlackController()
class ChatController {
  @ThreadStarted()
  async start(
    { say, setSuggestedPrompts, saveThreadContext }: ThreadStartedArgs,
  ) {
    try {
      await say("Hi, how can I help you?");
      await saveThreadContext();
      await setSuggestedPrompts({
        title: "Here are some suggested options:",
        prompts: [
          {
            title: "What is the weather like today?",
            message: "...the prompt to the LLM...",
          },
          {
            title: "Tell me a joke",
            message: "...the prompt to the LLM...",
          },
        ],
      });
    } catch (err) {
      this.logger.error("start failed", err);
    }
  }

  @ThreadContextChanged()
  async contextChanged({ saveThreadContext }: ThreadContextChangedArgs) {
    await saveThreadContext();
  }

  @UserMessage()
  async message({ message, say /*, client*/ }: UserMessageArgs) {
    // use the client to interact with slack
    // client.views.open()
    try {
      // client.views.update
      const response = await this.llmAgent.invoke(
        (message as { text: string })?.text ?? "",
      );
      await say(response);
    } catch (err) {
      this.logger.error("message failed", err);
    }
  }
}
```
