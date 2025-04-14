import "dotenv/config";
import { env } from "node:process";
import { NestFactory } from "@nestjs/core";
import { SlackAssistant } from "@xpr/nestjs-slack-assistant";
import { AppModule } from "./app.module";
import { ConsoleLogger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    // replacing the default to remove debug level
    logger: new ConsoleLogger({ logLevels: ["log", "error", "warn"] }),

    // the SlackAssistant strategy, see AssistantController
    strategy: new SlackAssistant({
      slack: {
        token: env.SLACK_BOT_TOKEN,
        appToken: env.SLACK_APP_TOKEN,
        socketMode: true,
      },
    }),
  });
  await app.listen();
}

bootstrap().catch(console.error);
