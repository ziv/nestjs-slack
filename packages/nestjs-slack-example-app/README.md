# NestJS/Slack integration demo application

## Usage

1. Clone the repository and install dependencies:

```shell
git clone git@github.com:ziv/nestjs-slack-app.git
cd nestjs-slack-app
npm install
```

2. Create a `.env` file in the root directory and add your Slack app credentials:

```
SLACK_APP_TOKEN=xapp....
SLACK_BOT_TOKEN=xoxb....
```

The `@xpr/nestjs-slack` and `@xpr/nestjs-slack-assistant` packages require application permissions based on your usage.

```
assistant:write
Allow assistant to act as an App Agent

channels:history
View messages and other content in public channels that assistant has been added to

chat:write
Send messages as @assistant

commands
Add shortcuts and/or slash commands that people can use

groups:history
View messages and other content in private channels that assistant has been added to

im:history
View messages and other content in direct messages that assistant has been added to

im:write
Start direct messages with people

mpim:history
View messages and other content in group direct messages that assistant has been added to

mpim:write
Start group direct messages with people
```