# @xpr/nestjs-slack

A NestJS microservice transport and decorators for
[Slack Bolt Apps](https://github.com/slackapi/bolt-js).

### Usage

Make sure to install peer dependencies if not already installed (`@slack/bolt`).

```shell
npm i @xpr/nestjs-slack
```

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

## Decorators

See [source file](./decorators.ts).
