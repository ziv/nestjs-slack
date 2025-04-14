import { Module } from '@nestjs/common';
import { AssistantController } from './assistant.controller';
import { SlackController } from './slack.controller';

@Module({
  controllers: [AssistantController, SlackController],
})
export class AppModule {}
