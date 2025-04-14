# NestJS/Slack Integrations

<span>
    <img alt="slack logo" height="100" src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" />
    <img alt="nestjs logo" height="100" src="https://upload.wikimedia.org/wikipedia/commons/a/a8/NestJS.svg" />
</span>

See example application at
[packages/nestjs-slack-example-app](./packages/nestjs-slack-example-app/README.md)
directory.

### @xpr/nestjs-slack

A NestJS microservice transport for
[Slack Bolt Apps](https://github.com/slackapi/bolt-js).

### @xpr/nestjs-slack-assistant

A NestJS microservice transport for
[Slack Bolt Assistant](https://github.com/slackapi/bolt-js/blob/main/src/Assistant.ts).

## Usage

### Initialize Slack/Bolt application with the `Slack` transport:

```ts
const app = await NestFactory.createMicroservice(MyModule, {
  strategy: new Slack({
    slack: {
      token: env.SLACK_BOT_TOKEN,
      appToken: env.SLACK_APP_TOKEN,
    },
  }),
});
await app.listen();
```

📃 https://tools.slack.dev/bolt-js/getting-started

### Initialize Slack/Bolt Assistant application with the `SlackAssistant` transport:

This transport is built on top of `Slack` transport. It provides all `Slack`
transports features and provide decorators for the assistant application.

```ts
const app = await NestFactory.createMicroservice(MyModule, {
  strategy: new SlackAssistant({
    slack: {
      token: env.SLACK_BOT_TOKEN,
      appToken: env.SLACK_APP_TOKEN,
    },
  }),
});
await app.listen();
```

📃 https://tools.slack.dev/bolt-js/concepts/ai-apps

### Slack Application Controller

Example of a Slack controller with listener for action and a command.

```ts
import { SlackAction, SlackCommand, SlackController } from "@xpr/nestjs-slack";

@SlackController()
export class MyController {
  @SlackAction("button-action")
  async onAction({ ack, respond, payload }: SlackActionMiddlewareArgs) {
    await ack();
    await respond(`Button clicked! with payload ${JSON.stringify(payload)}`);
  }

  @SlackCommand("/ping")
  async onPing({ ack, respond }: SlackCommandMiddlewareArgs) {
    await ack();
    await respond({
      text: "pong!",
      response_type: "in_channel",
    });
  }
}
```

📃 https://tools.slack.dev/bolt-js/concepts/event-listening

📃 https://tools.slack.dev/bolt-js/concepts/commands

### Slack Assistant Controller

```ts
import {
  SlackController,
  ThreadStarted,
  UserMessage,
  // `@xpr/nestjs-slack-assistant` re-export everything from `@xpr/nestjs-slack`
} from "@xpr/nestjs-slack-assistant";

@SlackController()
export class MyController {
  // any `@xpr/nestjs-slack` decorator can be used here as well

  @ThreadStarted()
  async startThread(
    { say, setSuggestedPrompts }: AssistantThreadStartedMiddlewareArgs,
  ) {
    await setSuggestedPrompts({ prompts: [/*...*/] });
    await say("Hi, how can I help you?");
  }

  @UserMessage()
  async message({ say, message }: AssistantUserMessageMiddlewareArgs) {
    await say("You said: " + message.text);
  }
}
```

📃 https://tools.slack.dev/bolt-js/concepts/ai-apps

---
