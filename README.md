# NestJS/Slack Integrations

See example application at [nestjs-slack-app](https://github.com/ziv/nestjs-slack-app/tree/main) repository.

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

https://tools.slack.dev/bolt-js/getting-started

### Initialize Slack/Bolt Assistant application with the `SlackAssistant` transport:

This transport is built on top of `Slack` transport. It provides all `Slack` transports features and provide decorators
for the assistant application.

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

https://tools.slack.dev/bolt-js/concepts/ai-apps

### Slack Application Controller

Example of a Slack controller with listener for action and a command.

```ts
import {
  SlackAction,
  SlackCommand,
  SlackController,
} from '@xpr/nestjs-slack';

@SlackController()
export class MyController {

  @SlackAction('button-action')
  async onAction({ ack, respond, payload }: SlackActionMiddlewareArgs) {
    await ack();
    await respond(`Button clicked! with payload ${JSON.stringify(payload)}`);
  }

  @SlackCommand('/ping')
  async onPing({ ack, respond }: SlackCommandMiddlewareArgs) {
    await ack();
    await respond({
      text: 'pong!',
      response_type: 'in_channel',
    });
  }
}
```

https://tools.slack.dev/bolt-js/concepts/event-listening

https://tools.slack.dev/bolt-js/concepts/commands


---


[//]: # (--- )

[//]: # ()

[//]: # (## Usage)

[//]: # ()

[//]: # (### Installation)

[//]: # ()

[//]: # (```shell)

[//]: # (npm i @xpr/nestjs-slack-assistant)

[//]: # (```)

[//]: # ()

[//]: # (### Controller)

[//]: # ()

[//]: # (Minimal required implementation includes a controller and a message handler)

[//]: # (decorated with `@UserMessage`.)

[//]: # ()

[//]: # (```typescript)

[//]: # ()

[//]: # (@Controller&#40;&#41;)

[//]: # (class ChatController {)

[//]: # (  @UserMessage&#40;&#41;)

[//]: # (  async message&#40;{ message, say /*, client*/ }: UserMessageArgs&#41; {)

[//]: # (    const text = &#40;message as { text: string }&#41;.text;)

[//]: # (    await say&#40;`You said: ${text}`&#41;;)

[//]: # (  })

[//]: # (})

[//]: # (```)

[//]: # ()

[//]: # (### Transport)

[//]: # ()

[//]: # (Minimal required configuration includes)

[//]: # ([token]&#40;https://api.slack.com/concepts/token-types#bot&#41; and)

[//]: # ([app token]&#40;https://api.slack.com/concepts/token-types#app-level&#41;.)

[//]: # ()

[//]: # (More information about slack tokens: https://api.slack.com/concepts/token-types)

[//]: # ()

[//]: # (```typescript)

[//]: # (const token = process.env.SLACK_BOT_TOKEN as string;)

[//]: # (const appToken = process.env.SLACK_APP_TOKEN as string;)

[//]: # ()

[//]: # (const app = await NestFactory.createMicroservice&#40;MyChatModule, {)

[//]: # (  strategy: new SlackAssistant&#40;{ slack: { token, appToken } }&#41;,)

[//]: # (}&#41;;)

[//]: # ()

[//]: # (await app.listen&#40;&#41;;)

[//]: # (```)

[//]: # ()

[//]: # (# Full Fledged Controller)

[//]: # ()

[//]: # (The package exports 3 decorators:)

[//]: # ()

[//]: # (- `@ThreadStarted` - triggered when a thread is started)

[//]: # (  &#40;[slack docs]&#40;https://tools.slack.dev/bolt-js/concepts/ai-apps/#handling-new-thread&#41;&#41;)

[//]: # (- `@ThreadContextChanged` - triggered when a thread context is changed)

[//]: # (  &#40;[slack docs]&#40;https://tools.slack.dev/bolt-js/concepts/ai-apps/#handling-thread-context-changes&#41;&#41;)

[//]: # (- `@UserMessage` - triggered when a user sends a message in a thread)

[//]: # (  &#40;[slack docs]&#40;https://tools.slack.dev/bolt-js/concepts/ai-apps/#handling-user-messages&#41;&#41;)

[//]: # ()

[//]: # (The only mandatory decorator is `@UserMessage`, but you can use the other two to)

[//]: # (handle thread context changes and thread started events.)

[//]: # ()

[//]: # (```typescript)

[//]: # ()

[//]: # (@Controller&#40;&#41;)

[//]: # (class ChatController {)

[//]: # (  @ThreadStarted&#40;&#41;)

[//]: # (  async start&#40;)

[//]: # (    { say, setSuggestedPrompts, saveThreadContext }: ThreadStartedArgs,)

[//]: # (  &#41; {)

[//]: # (    try {)

[//]: # (      await say&#40;"Hi, how can I help you?"&#41;;)

[//]: # (      await saveThreadContext&#40;&#41;;)

[//]: # (      await setSuggestedPrompts&#40;{)

[//]: # (        title: "Here are some suggested options:",)

[//]: # (        prompts: [)

[//]: # (          {)

[//]: # (            title: "What is the weather like today?",)

[//]: # (            message: "...the prompt to the LLM...",)

[//]: # (          },)

[//]: # (          {)

[//]: # (            title: "Tell me a joke",)

[//]: # (            message: "...the prompt to the LLM...",)

[//]: # (          },)

[//]: # (        ],)

[//]: # (      }&#41;;)

[//]: # (    } catch &#40;err&#41; {)

[//]: # (      this.logger.error&#40;"start failed", err&#41;;)

[//]: # (    })

[//]: # (  })

[//]: # ()

[//]: # (  @ThreadContextChanged&#40;&#41;)

[//]: # (  async contextChanged&#40;{ saveThreadContext }: ThreadContextChangedArgs&#41; {)

[//]: # (    await saveThreadContext&#40;&#41;;)

[//]: # (  })

[//]: # ()

[//]: # (  @UserMessage&#40;&#41;)

[//]: # (  async message&#40;{ message, say /*, client*/ }: UserMessageArgs&#41; {)

[//]: # (    // use the client to interact with slack)

[//]: # (    // client.views.open&#40;&#41;)

[//]: # (    try {)

[//]: # (      // client.views.update)

[//]: # (      const response = await this.llmAgent.invoke&#40;)

[//]: # (        &#40;message as { text: string }&#41;?.text ?? "",)

[//]: # (      &#41;;)

[//]: # (      await say&#40;response&#41;;)

[//]: # (    } catch &#40;err&#41; {)

[//]: # (      this.logger.error&#40;"message failed", err&#41;;)

[//]: # (    })

[//]: # (  })

[//]: # (})

[//]: # (```)
