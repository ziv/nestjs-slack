import { Module } from "@nestjs/common";
import { AssistantController } from "./assistant.controller";
import { MySlackController } from "./slack.controller";

@Module({
  controllers: [AssistantController, MySlackController],
})
export class AppModule {}
