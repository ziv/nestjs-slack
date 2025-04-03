import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SlackAssistant from '@xpr/slack-assistant/slack-assistant';
import { CustomStrategy } from '@nestjs/microservices/interfaces/microservice-configuration.interface';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<CustomStrategy>(AppModule, {
    strategy: new SlackAssistant({
      botToken: process.env.SLACK_BOT_TOKEN as string,
      appToken: process.env.SLACK_APP_TOKEN as string,
    }),
  });

  await app.listen();
}

bootstrap();
