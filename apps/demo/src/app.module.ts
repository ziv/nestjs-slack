import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import LlmAgent from './llm.agent';

@Module({
  providers: [LlmAgent],
  controllers: [AppController],
})
export class AppModule {
}
